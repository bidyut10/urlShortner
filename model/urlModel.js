const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  userAgent: { type: String },
  referer: { type: String }
}, { _id: false });

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: [true, "Long URL is required"],
    trim: true,
    maxlength: [2048, "URL cannot exceed 2048 characters"],
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format"
    }
  },
  shortUrl: {
    type: String,
    required: [true, "Short URL is required"],
    unique: true,
    trim: true
  },
  urlCode: {
    type: String,
    required: [true, "URL code is required"],
    unique: true,
    trim: true,
    index: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9_-]{3,20}$/.test(v);
      },
      message: "URL code must be 3-20 alphanumeric characters"
    }
  },
  clickCount: {
    type: Number,
    default: 0,
    min: 0
  },
  clicks: {
    type: [clickSchema],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 1000; // Limit stored clicks
      },
      message: "Click history limit exceeded"
    }
  },
  userMetadata: {
    ip: { type: String },
    userAgent: { type: String },
    referer: { type: String },
    country: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: "urls"
});

// Compound index for efficient queries
urlSchema.index({ urlCode: 1, isActive: 1 });
urlSchema.index({ createdAt: 1, expiresAt: 1 });

// TTL index to auto-delete expired URLs
urlSchema.index({ expiresAt: 1 }, {
  expireAfterSeconds: 0,
  partialFilterExpression: { expiresAt: { $exists: true, $ne: null } }
});

// Virtual for days until expiration
urlSchema.virtual("daysUntilExpiration").get(function () {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diff = this.expiresAt - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
urlSchema.pre("save", function (next) {
  // Trim and validate before saving
  if (this.longUrl) {
    this.longUrl = this.longUrl.trim();
  }
  if (this.urlCode) {
    this.urlCode = this.urlCode.trim();
  }
  next();
});

// Static method to find active URLs
urlSchema.statics.findActiveUrl = function (urlCode) {
  return this.findOne({
    urlCode,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Instance method to check if URL is expired
urlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Instance method to increment click safely
urlSchema.methods.trackClick = async function (metadata) {
  this.clickCount += 1;

  // Keep only last 100 clicks to prevent document bloat
  if (this.clicks.length >= 100) {
    this.clicks.shift();
  }

  this.clicks.push(metadata);

  // Use updateOne to avoid triggering unnecessary middleware
  await this.constructor.updateOne(
    { _id: this._id },
    {
      $inc: { clickCount: 1 },
      $push: {
        clicks: {
          $each: [metadata],
          $slice: -100 
        }
      }
    },
    { timestamps: false }
  );
};

const urlModel = mongoose.model("Url", urlSchema);

module.exports = urlModel;