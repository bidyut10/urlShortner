const urlModel = require("../model/urlModel");
const { validateUrl } = require("../utils/url-validator");
const shortid = require("shortid");

// ✅ Server health check
const serverStatus = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Health check failed",
    });
  }
};

// ✅ Create shortened URL
const createUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, expiresIn } = req.body;

    // Validate URL using comprehensive validator
    const validation = await validateUrl(longUrl);
    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: "URL validation failed",
        errors: validation.errors,
      });
    }

    // Generate or use custom URL code
    const urlCode = customAlias || shortid.generate();

    // Check if custom alias already exists
    if (customAlias) {
      const existing = await urlModel.findOne({ urlCode: customAlias });
      if (existing) {
        return res.status(409).json({
          status: false,
          message: "Custom alias already in use",
        });
      }
    }

    // Calculate expiration date
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }

    // Build short URL
    const baseUrl = process.env.VITE_BACKEND_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/v1/${urlCode}`;

    // Create URL document
    const urlDoc = new urlModel({
      longUrl: validation.sanitizedUrl,
      shortUrl,
      urlCode,
      expiresAt,
      userMetadata: {
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
        referer: req.headers["referer"] || req.headers["referrer"],
        timestamp: new Date(),
      },
    });

    await urlDoc.save();

    return res.status(201).json({
      status: true,
      message: "URL shortened successfully",
      data: {
        longUrl: urlDoc.longUrl,
        shortUrl: urlDoc.shortUrl,
        urlCode: urlDoc.urlCode,
        expiresAt: urlDoc.expiresAt,
        createdAt: urlDoc.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating short URL:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "URL code already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to create short URL",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Redirect to original URL
const getUrl = async (req, res) => {
  try {
    const { urlCode } = req.params;

    // Find active, non-expired URL
    const urlDoc = await urlModel.findActiveUrl(urlCode);

    if (!urlDoc) {
      return res.status(404).json({
        status: false,
        message: "Short URL not found or has expired",
      });
    }

    // Track click asynchronously (don't block redirect)
    setImmediate(() => {
      urlDoc.trackClick({
        timestamp: new Date(),
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
        referer: req.headers["referer"] || req.headers["referrer"],
      }).catch(err => {
        console.error("Failed to track click:", err);
      });
    });

    // Check if analytics view is requested
    const viewAnalytics = req.sanitizedQuery?.analytics === "true";

    if (viewAnalytics) {
      // Return analytics instead of redirecting
      return res.status(200).json({
        status: true,
        message: "URL analytics",
        data: {
          longUrl: urlDoc.longUrl,
          shortUrl: urlDoc.shortUrl,
          urlCode: urlDoc.urlCode,
          clickCount: urlDoc.clickCount,
          createdAt: urlDoc.createdAt,
          expiresAt: urlDoc.expiresAt,
          isActive: urlDoc.isActive,
          recentClicks: urlDoc.clicks.slice(-10), // Last 10 clicks
        },
      });
    }

    // Redirect to original URL
    return res.redirect(302, urlDoc.longUrl);
  } catch (error) {
    console.error("Error retrieving URL:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to retrieve URL",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createUrl,
  getUrl,
  serverStatus,
};