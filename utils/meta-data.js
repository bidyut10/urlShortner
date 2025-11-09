// Capturing user metadata while respecting privacy
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

module.exports = { captureUserDetails };
