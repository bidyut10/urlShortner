// ✅ route/route.js

const express = require("express");
const router = express.Router();

const {
  validateShortenRequest,
  validateUrlCode,
  sanitizeInputs,
  checkSuspiciousActivity,
} = require("../middlewares/validationMiddleware");

const {
  createUrl,
  getUrl,
  serverStatus,
} = require("../controller/urlController");

// ✅ Verify all middlewares are actually defined
if (
  typeof sanitizeInputs !== "function" ||
  typeof checkSuspiciousActivity !== "function"
) {
  console.error("❌ Middleware import error: sanitizeInputs or checkSuspiciousActivity not found");
  process.exit(1);
}

// ✅ Apply middlewares safely
router.use(sanitizeInputs);
router.use(checkSuspiciousActivity);

// ✅ Define routes
router.get("/v1/health", serverStatus);
router.post("/v1/shorten", validateShortenRequest, createUrl);
router.get("/v1/:urlCode", validateUrlCode, getUrl);

module.exports = router;
