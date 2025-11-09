const mongoose = require("mongoose");

// 📌 Sub-schema for tracking individual clicks
// Stores metadata for each click without creating separate _id (saves space)
// Returns: { timestamp, ip, userAgent, referer }
const clickSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now }, // When user clicked
    ip: { type: String }, // User's IP address
    userAgent: { type: String }, // Browser/device info
    referer: { type: String }, // Where they came from
  },
  { _id: false }
); // _id: false prevents MongoDB from creating unnecessary IDs

// 📌 Main URL document schema
// Stores shortened URL data with validation and expiry handling
const urlSchema = new mongoose.Schema(
  {
    // Original long URL submitted by user
    longUrl: {
      type: String,
      required: [true, "Long URL is required"],
      trim: true, // Removes leading/trailing whitespace
      maxlength: [2048, "URL cannot exceed 2048 characters"], // HTTP standard limit
      validate: {
        // Ensures URL starts with http:// or https://
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Invalid URL format",
      },
    },

    // Complete shortened URL (e.g., https://short.ly/abc123)
    shortUrl: {
      type: String,
      required: [true, "Short URL is required"],
      unique: true, // No duplicate short URLs allowed
      trim: true,
    },

    // Unique code in the short URL (e.g., "abc123")
    // Indexed for fast lookups when redirecting
    urlCode: {
      type: String,
      required: [true, "URL code is required"],
      unique: true,
      trim: true,
      index: true, // Creates DB index for O(log n) lookup speed
      validate: {
        // Allows only alphanumeric, underscore, hyphen (3-20 chars)
        validator: function (v) {
          return /^[a-zA-Z0-9_-]{3,20}$/.test(v);
        },
        message: "URL code must be 3-20 alphanumeric characters",
      },
    },

    // Total number of times this URL was clicked
    clickCount: {
      type: Number,
      default: 0,
      min: 0, // Prevents negative counts
    },

    // Array storing last 100 click events (for analytics)
    // Capped at 1000 to prevent document bloat
    clicks: {
      type: [clickSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 1000;
        },
        message: "Click history limit exceeded",
      },
    },

    // Metadata about who created this short URL
    userMetadata: {
      ip: { type: String }, // Creator's IP
      userAgent: { type: String }, // Creator's browser
      referer: { type: String }, // Where they came from
      country: { type: String }, // Creator's country
      timestamp: { type: Date, default: Date.now },
    },

    // Optional expiration date (null = never expires)
    // Indexed for TTL cleanup job
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    // Link to user who created this URL (null for anonymous)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Soft delete flag (false = disabled but not deleted)
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Fast filtering of active/inactive URLs
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt
    collection: "urls", // Collection name in MongoDB
  }
);

// 🔍 Compound Indexes (optimize common queries)
// Fast lookup: Find active URL by code
urlSchema.index({ urlCode: 1, isActive: 1 });
// Fast sorting: Get URLs by creation/expiry date
urlSchema.index({ createdAt: 1, expiresAt: 1 });

// ⏰ TTL Index (auto-delete expired URLs)
// MongoDB automatically removes documents where expiresAt < current time
// Only applies to documents with non-null expiresAt
urlSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0, // Delete immediately when expired
    partialFilterExpression: { expiresAt: { $exists: true, $ne: null } },
  }
);

// 📊 Virtual field (computed, not stored in DB)
// Returns: Number of days until URL expires (null if no expiry)
urlSchema.virtual("daysUntilExpiration").get(function () {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diff = this.expiresAt - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// 🔧 Pre-save hook (runs before document is saved)
// Cleans data before saving to ensure consistency
urlSchema.pre("save", function (next) {
  // Remove extra whitespace from URLs
  if (this.longUrl) {
    this.longUrl = this.longUrl.trim();
  }
  if (this.urlCode) {
    this.urlCode = this.urlCode.trim();
  }
  next();
});

// 📦 Static method (called on Model, not instance)
// Usage: Url.findActiveUrl("abc123")
// Returns: Active, non-expired URL or null
urlSchema.statics.findActiveUrl = function (urlCode) {
  return this.findOne({
    urlCode,
    isActive: true,
    $or: [
      { expiresAt: null }, // Never expires
      { expiresAt: { $gt: new Date() } }, // Not yet expired
    ],
  });
};

// 🔍 Instance method (called on document)
// Usage: url.isExpired()
// Returns: true if URL has expired, false otherwise
urlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// 📈 Instance method (track click efficiently)
// Usage: await url.trackClick({ ip, userAgent, referer, timestamp })
// Updates count and stores last 100 clicks atomically
urlSchema.methods.trackClick = async function (metadata) {
  this.clickCount += 1;

  // Keep only last 100 clicks to prevent document bloat
  if (this.clicks.length >= 100) {
    this.clicks.shift();
  }

  this.clicks.push(metadata);

  // Use atomic update to avoid race conditions
  // $inc: Safely increments count even with concurrent requests
  // $slice: -100 keeps only last 100 clicks
  await this.constructor.updateOne(
    { _id: this._id },
    {
      $inc: { clickCount: 1 },
      $push: {
        clicks: {
          $each: [metadata],
          $slice: -100, // Keeps last 100 items
        },
      },
    },
    { timestamps: false } // Don't update updatedAt for clicks
  );
};

const urlModel = mongoose.model("Url", urlSchema);

module.exports = urlModel;
