const validator = require("validator");
const dns = require("dns").promises;
const { URL } = require("url");
const fetch = require("node-fetch");

// Comprehensive URL validation function (business logic layer)
// Note: Basic sanitization happens in middleware before this runs
const validateUrl = async (urlString) => {
  const errors = [];

  // 1️⃣ Basic input check
  if (!urlString || typeof urlString !== "string") {
    return { isValid: false, errors: ["The provided URL is invalid."] };
  }

  const trimmedUrl = urlString.trim();

  if (trimmedUrl.length > 2048) {
    errors.push("URL exceeds maximum length");
  }
  if (trimmedUrl.length < 10) {
    errors.push("URL too short to be valid");
  }

  // 2️⃣ Strict format validation
  if (
    !validator.isURL(trimmedUrl, {
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: true,
      require_host: true,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
    })
  ) {
    errors.push("Invalid URL format.");
    return { isValid: false, errors };
  }

  try {
    const parsed = new URL(trimmedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // 3️⃣ Block internal, private, and loopback addresses
    const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"];
    if (blockedHosts.includes(hostname)) {
      errors.push("Localhost or private address not allowed");
    }

    const privateIpPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^fc00:/i,
      /^fd00:/i,
    ];
    if (privateIpPatterns.some((r) => r.test(hostname))) {
      errors.push("Private IP address detected");
    }

    // 4️⃣ Block dangerous extensions
    const dangerousExts = [
      ".exe",
      ".bat",
      ".cmd",
      ".com",
      ".vbs",
      ".jar",
      ".dll",
      ".scr",
      ".pif",
      ".msi",
      ".sh",
      ".php",
      ".aspx",
      ".cgi",
    ];
    if (dangerousExts.some((ext) => pathname.endsWith(ext))) {
      errors.push("Dangerous or executable file type detected");
    }

    // 5️⃣ Block adult, gambling, and illegal keywords/domains
    const bannedKeywords = [
      "porn",
      "xxx",
      "sex",
      "adult",
      "nude",
      "cam",
      "escort",
      "bet",
      "casino",
      "gambling",
      "poker",
      "pharma",
      "viagra",
      "torrent",
      "crack",
      "warez",
      "drugs",
      "hack",
      "scam",
      "phish",
    ];

    if (
      bannedKeywords.some(
        (k) =>
          hostname.includes(k) ||
          pathname.includes(k) ||
          parsed.search.includes(k)
      )
    ) {
      errors.push("Blocked or illegal content detected");
    }

    // 6️⃣ DNS validation and IP resolution
    try {
      const result = await dns.lookup(hostname);
      const ip = result.address;
      if (privateIpPatterns.some((p) => p.test(ip))) {
        errors.push("URL resolves to private IP");
      }
    } catch {
      errors.push("Domain does not resolve to a valid IP");
    }

    // 7️⃣ Phishing heuristic checks
    if (
      hostname.split(".").length > 5 ||
      hostname.match(/[\d-]{5,}/) ||
      pathname.match(/login|verify|update|account|secure/i)
    ) {
      errors.push("Suspicious or phishing-like URL pattern");
    }

    // 8️⃣ Quick remote HEAD request check
    try {
      const response = await fetch(trimmedUrl, {
        method: "HEAD",
        redirect: "follow",
        timeout: 4000,
      });
      const type = response.headers.get("content-type") || "";

      if (
        type.includes("application/octet-stream") ||
        type.includes("binary") ||
        type.includes("x-msdownload")
      ) {
        errors.push("Binary or downloadable content detected — blocked");
      }
    } catch (err) {
      // skip silently - network issues shouldn't block valid URLs
    }

    // 9️⃣ Dangerous protocols
    if (["data:", "javascript:", "file:"].includes(parsed.protocol)) {
      errors.push("Unsafe protocol detected");
    }
  } catch (err) {
    errors.push("Failed to parse URL structure");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedUrl: trimmedUrl,
  };
};

module.exports = { validateUrl };
