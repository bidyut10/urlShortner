const express = require("express");
const bodyParser = require("body-parser");
const route = require("./route/route");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const slowDown = require("express-slow-down");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URL", "VITE_BACKEND_URL", "NODE_ENV"];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const app = express();

// Trust proxy for accurate IP addresses (if behind nginx/cloudflare)
app.set("trust proxy", 1);

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// CORS Configuration - Production Ready
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:3000", "http://localhost:5173"]; // Default for development

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "X-Request-ID"],
  maxAge: 600 // Cache preflight requests for 10 minutes
}));

// Compression Middleware
app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body Parser with size limits
app.use(bodyParser.json({ limit: "10kb" })); // Prevent large payload attacks
app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized request data: ${key}`);
  }
}));

// Data Sanitization against XSS
app.use(xss());

// Rate Limiting - Stricter for production
const createRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit to 50 requests per windowMs
  message: {
    status: false,
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === "/v1/health";
  },
  handler: (req, res) => {
    res.status(429).json({
      status: false,
      message: "Too many requests, please slow down.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

app.use("/v1/shorten", createRateLimiter);

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { status: false, message: "Too many requests from this IP" }
});
app.use(globalLimiter);

// Slow Down Middleware for gradual rate limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
  maxDelayMs: 20000 // Maximum delay of 20 seconds
});
app.use(speedLimiter);

// Request ID for tracking
app.use((req, res, next) => {
  req.id = require("crypto").randomUUID();
  res.setHeader("X-Request-ID", req.id);
  next();
});

// Logging - Different formats for dev/prod
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", {
    skip: (req, res) => res.statusCode < 400
  }));
} else {
  app.use(morgan("dev"));
}

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB is connected successfully");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${(i + 1) * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000));
      }
    }
  }
  console.error("Failed to connect to MongoDB after multiple attempts");
  process.exit(1);
};

// MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through app termination");
  process.exit(0);
});

// Routes
app.use("/", route);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", {
    requestId: req.id,
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });

  // CORS Error
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      status: false,
      message: "CORS policy violation",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose Cast Error
  if (err.name === "CastError") {
    return res.status(400).json({
      status: false,
      message: "Invalid data format"
    });
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: false,
      message: "Invalid token"
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    status: false,
    message: err.message || "Internal server error",
    requestId: req.id,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Server Running Successfully      
║   Port: ${PORT.toString().padEnd(29)}
║   Environment: ${(process.env.NODE_ENV || "development").padEnd(22)}
║   Time: ${new Date().toLocaleString().padEnd(28)}
╚════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down gracefully...");
      server.close(async () => {
        console.log("✅ HTTP server closed");
        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("⚠️  Forcing shutdown");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

startServer();

module.exports = app;