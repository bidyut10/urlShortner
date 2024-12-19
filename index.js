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
// const { cacheMiddleware } = require("./middlewares/cacheMiddleware");
const path = require('path')

// Load environment variables
dotenv.config();
if (!process.env.MONGO_URL) {
  throw new Error("Missing required environment variables");
}

const app = express();

// Security Middleware
app.use(helmet()); 

// Enable CORS
app.use(cors());

// Compression Middleware
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Slow Down Middleware
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, 
  delayAfter: 100, 
  delayMs: (hits) => hits * 100,
});
app.use(speedLimiter);

// Logging
app.use(morgan("combined"));

// Body Parser
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/", route);

// Serve static files
app.use(express.static(path.join(__dirname, "./client/dist")));

// Fallback for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client", "dist", "index.html"));
});

// Start Server
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app is running on port " + (process.env.PORT || 3000));
});
