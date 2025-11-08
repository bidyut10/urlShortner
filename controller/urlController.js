const urlModel = require("../model/urlModel");
const shortid = require("shortid");
const validator = require("validator");
const dns = require("dns").promises;
const { URL } = require("url");

// Comprehensive URL validation with security checks
const validateUrl = async (urlString) => {
  const errors = [];

  // Basic validation
  if (!urlString || typeof urlString !== "string") {
    errors.push("URL must be a non-empty string");
    return { isValid: false, errors };
  }

  const trimmedUrl = urlString.trim();

  // Length validation
  if (trimmedUrl.length > 2048) {
    errors.push("URL exceeds maximum length of 2048 characters");
  }

  if (trimmedUrl.length < 10) {
    errors.push("URL is too short to be valid");
  }

  // Protocol validation - must use http or https
  if (!validator.isURL(trimmedUrl, {
    protocols: ["http", "https"],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
  })) {
    errors.push("Invalid URL format. Must use http:// or https://");
    return { isValid: false, errors };
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    // Block localhost and private IP ranges
    const blockedHosts = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "[::1]",
      "[::]",
    ];

    const hostname = parsedUrl.hostname.toLowerCase();

    if (blockedHosts.includes(hostname)) {
      errors.push("Cannot shorten localhost or loopback addresses");
    }

    // Block private IP ranges
    const privateIpPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^fc00:/i,
      /^fd00:/i,
    ];

    if (privateIpPatterns.some((pattern) => pattern.test(hostname))) {
      errors.push("Cannot shorten private IP addresses");
    }

    // SQL Injection pattern detection
    const sqlPatterns = [
      /(\s*(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|eval|expression)\s*)/i,
      /(;|\-\-|\/\*|\*\/|xp_|sp_)/i,
      /('|"|`|;|--|\||&|\$|<|>|\{|\}|\[|\]|\(|\))/,
    ];

    const fullUrl = trimmedUrl.toLowerCase();
    if (sqlPatterns.some((pattern) => pattern.test(fullUrl))) {
      errors.push("URL contains potentially malicious patterns");
    }

    // Block dangerous file extensions
    const dangerousExtensions = [
      ".exe", ".bat", ".cmd", ".com", ".pif", ".scr",
      ".vbs", ".js", ".jar", ".msi", ".dll", ".sh",
    ];

    const pathname = parsedUrl.pathname.toLowerCase();
    if (dangerousExtensions.some((ext) => pathname.endsWith(ext))) {
      errors.push("URL points to potentially dangerous file type");
    }

    // Block adult content domains (basic list)
    const blockedKeywords = [
      "porn", "xxx", "sex", "adult", "nsfw", "nude",
      "casino", "gambling", "pharma", "viagra",
    ];

    if (blockedKeywords.some((keyword) =>
      hostname.includes(keyword) || pathname.includes(keyword)
    )) {
      errors.push("URL contains blocked content");
    }

    // DNS validation (optional but recommended)
    try {
      await dns.lookup(hostname);
    } catch (dnsError) {
      errors.push("Domain does not resolve to a valid IP address");
    }

    // Check for suspicious patterns
    if (hostname.split(".").length > 5) {
      errors.push("URL has suspicious subdomain structure");
    }

    // Block data URIs and javascript protocols
    if (parsedUrl.protocol === "data:" || parsedUrl.protocol === "javascript:") {
      errors.push("Dangerous protocol detected");
    }

  } catch (parseError) {
    errors.push("Failed to parse URL structure");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedUrl: trimmedUrl,
  };
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>\"']/g, "")
    .substring(0, 2048);
};

// Capture user metadata with privacy considerations
const captureUserDetails = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : req.socket.remoteAddress;

  return {
    ip: ip || "unknown",
    userAgent: req.headers["user-agent"]?.substring(0, 500) || "unknown",
    timestamp: new Date().toISOString(),
    referer: req.headers["referer"]?.substring(0, 500) || null,
  };
};

// Generate unique URL code with collision prevention
const generateUniqueUrlCode = async (maxAttempts = 5) => {
  for (let i = 0; i < maxAttempts; i++) {
    const urlCode = shortid.generate();
    const existing = await urlModel.findOne({ urlCode });
    if (!existing) return urlCode;
  }
  throw new Error("Failed to generate unique URL code");
};

// Create shortened URL
const createUrl = async (req, res) => {
  try {
    // Input validation
    const longUrl = sanitizeInput(req.body.longUrl);

    if (!longUrl) {
      return res.status(400).json({
        status: false,
        message: "URL is required",
        errors: ["longUrl field is missing or empty"],
      });
    }

    // Comprehensive URL validation
    const validation = await validateUrl(longUrl);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid URL provided",
        errors: validation.errors,
      });
    }

    // Check if URL already exists
    const existingUrl = await urlModel.findOne({
      longUrl: validation.sanitizedUrl
    });

    if (existingUrl) {
      return res.status(200).json({
        status: true,
        data: {
          urlCode: existingUrl.urlCode,
          longUrl: existingUrl.longUrl,
          shortUrl: existingUrl.shortUrl,
          createdAt: existingUrl.createdAt,
        },
        message: "URL already shortened",
      });
    }

    // Generate unique URL code
    const urlCode = await generateUniqueUrlCode();

    // Construct short URL
    const baseUrl = process.env.VITE_BACKEND_URL?.replace(/\/$/, "");
    if (!baseUrl) {
      throw new Error("Backend URL not configured");
    }

    const shortUrl = `${baseUrl}/v1/${urlCode}`;

    // Capture user metadata
    const userMetadata = captureUserDetails(req);

    // Create new URL document
    const newUrl = await urlModel.create({
      longUrl: validation.sanitizedUrl,
      shortUrl,
      urlCode,
      userMetadata,
      clickCount: 0,
      isActive: true,
    });

    return res.status(201).json({
      status: true,
      data: {
        urlCode: newUrl.urlCode,
        longUrl: newUrl.longUrl,
        shortUrl: newUrl.shortUrl,
        createdAt: newUrl.createdAt,
      },
      message: "URL shortened successfully",
    });

  } catch (error) {
    console.error("Create URL Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "Duplicate URL code detected",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Internal server error",
      errorId: Date.now().toString(36),
    });
  }
};

// Redirect to original URL
const getUrl = async (req, res) => {
  try {
    const urlCode = sanitizeInput(req.params.urlCode);

    if (!urlCode || urlCode.length > 50) {
      return res.status(400).json({
        status: false,
        message: "Invalid URL code",
      });
    }

    // Find URL in database
    const urlDocument = await urlModel.findOne({
      urlCode,
      isActive: true
    });

    if (!urlDocument) {
      return res.status(404).json({
        status: false,
        message: "Short URL not found or has been deactivated",
      });
    }

    // Update click count (fire-and-forget to avoid latency)
    urlModel.findByIdAndUpdate(
      urlDocument._id,
      {
        $inc: { clickCount: 1 },
        $set: { lastAccessed: new Date() }
      }
    ).catch((err) => console.error("Click count update failed:", err));

    // Redirect to original URL
    return res.redirect(301, urlDocument.longUrl);

  } catch (error) {
    console.error("Get URL Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// Health check endpoint
const serverStatus = async (req, res) => {
  try {
    // Check database connectivity
    const dbStatus = await urlModel.db.db.admin().ping();

    return res.status(200).json({
      status: true,
      message: "Server is running smoothly",
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus.ok === 1 ? "connected" : "disconnected",
      },
    });
  } catch (error) {
    console.error("Health check error:", error);
    return res.status(503).json({
      status: false,
      message: "Service unavailable",
    });
  }
};

module.exports = {
  createUrl,
  getUrl,
  serverStatus,
};