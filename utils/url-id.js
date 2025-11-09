const urlModel = require("../model/urlModel");
const shortid = require("shortid");

// Generate unique URL code with collision prevention
const generateUniqueUrlCode = async (maxAttempts = 5) => {
  for (let i = 0; i < maxAttempts; i++) {
    const urlCode = shortid.generate();
    const existing = await urlModel.findOne({ urlCode });
    if (!existing) return urlCode;
  }
  throw new Error("Failed to generate unique URL code");
};

module.exports = { generateUniqueUrlCode };
