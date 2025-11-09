const urlModel = require("../model/urlModel");
const { captureUserDetails } = require("../utils/meta-data");
const { generateUniqueUrlCode } = require("../utils/url-id");
const { validateUrl } = require("../utils/url-validator");

// Create shortened URL API endpoint
const createUrl = async (req, res) => {
  try {
    // Input validation
    const longUrl = req.body.longUrl;

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
        message: "Invalid URL",
        errors: validation.errors,
      });
    }

    // Check if URL already exists
    const existingUrl = await urlModel.findOne({
      longUrl: validation.sanitizedUrl,
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

// Redirect to original URL API endpoint
const getUrl = async (req, res) => {
  try {
    const urlCode = req.params.urlCode;

    if (!urlCode || urlCode.length > 50) {
      return res.status(400).json({
        status: false,
        message: "Invalid URL code",
      });
    }

    // Find URL in database
    const urlDocument = await urlModel.findOne({
      urlCode,
      isActive: true,
    });

    if (!urlDocument) {
      return res.status(404).json({
        status: false,
        message: "Short URL not found or has been deactivated",
      });
    }

    // Update click count asynchronously
    urlModel
      .findByIdAndUpdate(urlDocument._id, {
        $inc: { clickCount: 1 },
        $set: { lastAccessed: new Date() },
      })
      .catch((err) => console.error("Click count update failed:", err));

    /**
     * 🔁 Using 302 (Temporary Redirect)
     * - Keeps tracking accurate (no browser caching like 301).
     * - Lets me update target URLs anytime.
     * - Prevents SEO and caching issues.
     * - Standard choice for all major URL shorteners.
     */

    return res.redirect(302, urlDocument.longUrl);
  } catch (error) {
    console.error("Get URL Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// Health Check API endpoint
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
