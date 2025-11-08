const express = require("express");
const router = express.Router();
const {
    createUrl,
    getUrl,
    serverStatus,
} = require("../controller/urlController");

const {
    validateShortenRequest,
    validateUrlCode,
    sanitizeInputs,
    checkSuspiciousActivity
} = require("../middlewares/validationMiddleware");

// Apply sanitization and suspicious activity check to all routes
router.use(sanitizeInputs);
router.use(checkSuspiciousActivity);

// Health check endpoint (no restrictions)
router.get("/health", serverStatus);
router.get("/", serverStatus);

// Create shortened URL
router.post(
    "/v1/shorten",
    validateShortenRequest,
    createUrl
);

// Redirect to original URL (should be last to act as catch-all)
router.get(
    "/v1/:urlCode",
    validateUrlCode,
    getUrl
);

// Catch-all for undefined routes
router.all("*", (req, res) => {
    res.status(404).json({
        status: false,
        message: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});

module.exports = router;