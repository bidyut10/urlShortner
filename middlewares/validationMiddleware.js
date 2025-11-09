// Validate request body for URL shortening
const validateShortenRequest = (req, res, next) => {
  const errors = [];

  // Check if body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: false,
      message: "Request body is required",
      errors: ["No data provided"],
    });
  }

  // Validate longUrl
  if (!req.body.longUrl) {
    errors.push("longUrl is required");
  } else if (typeof req.body.longUrl !== "string") {
    errors.push("longUrl must be a string");
  } else if (req.body.longUrl.trim().length === 0) {
    errors.push("longUrl cannot be empty");
  } else if (req.body.longUrl.length > 2048) {
    errors.push("longUrl cannot exceed 2048 characters");
  }

  // Validate customAlias if provided
  if (req.body.customAlias) {
    if (typeof req.body.customAlias !== "string") {
      errors.push("customAlias must be a string");
    } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(req.body.customAlias)) {
      errors.push(
        "customAlias must be 3-20 characters (alphanumeric, underscore, hyphen only)"
      );
    }
  }

  // Validate expiresIn if provided
  if (req.body.expiresIn !== undefined && req.body.expiresIn !== null) {
    const expiresIn = parseInt(req.body.expiresIn);
    if (isNaN(expiresIn) || expiresIn < 1 || expiresIn > 365) {
      errors.push("expiresIn must be a number between 1 and 365 days");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validate URL code parameter
const validateUrlCode = (req, res, next) => {
  const { urlCode } = req.params;

  if (!urlCode) {
    return res.status(400).json({
      status: false,
      message: "URL code is required",
    });
  }

  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(urlCode)) {
    return res.status(400).json({
      status: false,
      message: "Invalid URL code format",
    });
  }

  next();
};

const sanitizeInputs = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim().replace(/\0/g, "");
      }
    }
  }

  // Sanitize params
  if (req.params && typeof req.params === "object") {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = req.params[key].trim().replace(/\0/g, "");
      }
    }
  }

  // ✅ Safe handling for Express 5 - never modify req.query
  req.sanitizedQuery = {};
  const rawQuery = req.query || {}; // prevent undefined access

  for (const key in rawQuery) {
    if (typeof rawQuery[key] === "string") {
      req.sanitizedQuery[key] = rawQuery[key].trim().replace(/\0/g, "");
    } else {
      req.sanitizedQuery[key] = rawQuery[key];
    }
  }

  next();
};


// Check for suspicious patterns in requests
const checkSuspiciousActivity = (req, res, next) => {
  const suspicious = [];

  // Check for SQL injection patterns in all inputs
  const sqlPatterns = [
    /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bunion\b)/gi,
    /('|--|;|\/\*|\*\/|xp_|sp_)/gi,
  ];

  // Check body
  if (req.body) {
    const bodyStr = JSON.stringify(req.body).toLowerCase();
    sqlPatterns.forEach((pattern) => {
      if (pattern.test(bodyStr)) {
        suspicious.push("Potential SQL injection detected in request body");
      }
    });
  }

  // Check for XSS patterns
  const xssPattern = /<script|javascript:|onerror=|onload=/gi;
  if (req.body && xssPattern.test(JSON.stringify(req.body))) {
    suspicious.push("Potential XSS attack detected");
  }

  if (suspicious.length > 0) {
    console.warn("Suspicious Activity Detected:", {
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      path: req.path,
      method: req.method,
      suspicions: suspicious,
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({
      status: false,
      message: "Request blocked due to suspicious activity",
    });
  }

  next();
};

module.exports = {
  validateShortenRequest,
  validateUrlCode,
  sanitizeInputs,
  checkSuspiciousActivity,
};