# 🔗 Wcut ( URL Shortener API )

A secure, production-ready URL shortening service with analytics, expiration, and comprehensive security validation.

---

## 🎯 What This Does

Converts long URLs into short, shareable links with tracking and security features.

**Example:**  
`https://example.com/very/long/url/path` → `https://short.ly/abc123`

---

## 🏗️ System Design Principles

### **Defense in Depth**
- **3-Layer Validation**: Middleware → Controller → Utils
- **Early Exit**: Block malicious requests before DB lookup

### **Security First**
- SQL injection & XSS detection
- Private IP blocking (SSRF prevention)
- Phishing URL detection
- DNS validation before shortening

### **Performance**
- MongoDB indexes for O(log n) lookups
- TTL index auto-deletes expired URLs
- Atomic click tracking (no race conditions)
- Click history capped at 100 entries

### **Scalability**
- Stateless design (ready for horizontal scaling)
- Efficient schema with compound indexes
- Soft delete (isActive flag)

---

## 📋 API Routes

### **1. Health Check**
```http
GET /v1/health
```

**Purpose:** Check if server is running

**Response:**
```json
{
  "status": true,
  "message": "Server is running",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Status Code:** `200 OK`

---

### **2. Shorten URL**
```http
POST /v1/shorten
Content-Type: application/json
```

**Purpose:** Create a short URL from a long URL

**Request Body:**
```json
{
  "longUrl": "https://example.com/very/long/url",
  "customAlias": "my-link",  // Optional (3-20 chars)
  "expiresIn": 30            // Optional (days, 1-365)
}
```

**Response (Success - 201 Created):**
```json
{
  "status": true,
  "message": "URL shortened successfully",
  "data": {
    "longUrl": "https://example.com/very/long/url",
    "shortUrl": "http://localhost:5000/v1/my-link",
    "urlCode": "my-link",
    "expiresAt": "2025-02-14T10:30:00Z",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "status": false,
  "message": "Validation failed",
  "errors": [
    "longUrl is required",
    "customAlias must be 3-20 characters (alphanumeric, underscore, hyphen only)"
  ]
}
```

**Validation Rules:**
- ✅ `longUrl`: Required, 10-2048 chars, must start with http/https
- ✅ `customAlias`: Optional, 3-20 alphanumeric + `_-` only
- ✅ `expiresIn`: Optional, 1-365 days

**Status Codes:**
- `201` - URL created successfully
- `400` - Validation failed
- `409` - Custom alias already exists
- `500` - Server error

---

### **3. Redirect to Original URL**
```http
GET /v1/:urlCode
```

**Purpose:** Redirect to original long URL and track analytics

**Example Request:**
```http
GET /v1/my-link
```

**Behavior:**

| Scenario | Response | Status Code |
|----------|----------|-------------|
| ✅ Valid & Active | Redirects to `longUrl` | `302 Found` |
| ❌ URL Expired | Error message | `410 Gone` |
| ❌ URL Not Found | Error message | `404 Not Found` |
| ❌ URL Inactive | Error message | `404 Not Found` |

**Success Response (Redirect):**
```
HTTP/1.1 302 Found
Location: https://example.com/very/long/url
```

**Error Response (Expired - 410 Gone):**
```json
{
  "status": false,
  "message": "URL has expired"
}
```

**Error Response (Not Found - 404):**
```json
{
  "status": false,
  "message": "URL not found"
}
```

**What Gets Tracked:**
- ✅ Click count increment
- ✅ IP address
- ✅ User agent (browser/device)
- ✅ Referer (where they came from)
- ✅ Timestamp

---

## 🛡️ Security Features

### **Blocked Content**
- ❌ SQL injection patterns (`union`, `select`, `--`, `;`)
- ❌ XSS attempts (`<script>`, `javascript:`, `onerror=`)
- ❌ Private IPs (`127.0.0.1`, `192.168.x.x`, `10.x.x.x`)
- ❌ Dangerous files (`.exe`, `.bat`, `.php`, `.sh`)
- ❌ Adult/gambling/illegal keywords
- ❌ Phishing-like URLs (too many subdomains, suspicious patterns)
- ❌ Malicious protocols (`data:`, `file:`, `javascript:`)

### **Validation Flow**
```
1. sanitizeInputs         → Trim whitespace, remove null bytes
2. checkSuspiciousActivity → Block SQL/XSS patterns
3. validateShortenRequest  → Check required fields
4. Controller             → Business logic
5. validateUrl (Utils)    → DNS + Content-Type + Security checks
```

---

## 🚀 Setup Instructions

### **1. Clone & Install**
```bash
git clone <repository-url>
cd url-shortener
npm install
```

### **2. Environment Variables**
Create `.env` file in root:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
MONGO_URL=mongodb://localhost:27017/url-shortener

# Application URLs
VITE_BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# CORS Configuration
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:3000,http://localhost:5173

# Rate Limiting (Optional overrides)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

```

**Environment Variables Explained:**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | ✅ Yes | Server port | `5000` |
| `MONGO_URI` | ✅ Yes | MongoDB connection string | `mongodb://localhost:27017/url-shortener` |
| `BASE_URL` | ✅ Yes | Your domain (for short URLs) | `http://localhost:5000` |
| `NODE_ENV` | ❌ No | Environment mode | `development` / `production` |
| `RATE_LIMIT_WINDOW` | ❌ No | Rate limit time window (minutes) | `15` |
| `RATE_LIMIT_MAX` | ❌ No | Max requests per window | `100` |

### **3. Start MongoDB**
```bash
# Local MongoDB
mongod

# OR use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **4. Run Server**
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 📦 Project Structure

```
url-shortener/
├── controller/
│   └── urlController.js           # Business logic (createUrl, getUrl)
├── middlewares/
│   └── validationMiddleware.js    # Request validation & security checks
├── models/
│   └── urlModel.js                # MongoDB schema with indexes
├── routes/
│   └── urlRoutes.js               # API endpoints (3 routes)
├── utils/
│   └── urlValidator.js            # Deep URL validation (DNS, security)
├── .env                           # Environment variables
├── index.js                      # Entry point
└── package.json
```

---

## 🧪 Testing the API

### **Using cURL**

**1. Health Check:**
```bash
curl http://localhost:5000/v1/health
```

**2. Shorten URL (without custom alias):**
```bash
curl -X POST http://localhost:5000/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "longUrl": "https://github.com/bidyut10"
  }'
```

**3. Shorten URL (with custom alias & expiration):**
```bash
curl -X POST http://localhost:5000/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "longUrl": "https://github.com/bidyut10",
    "customAlias": "bidyut",
    "expiresIn": 30
  }'
```

**4. Access Short URL (redirects):**
```bash
curl -L http://localhost:5000/v1/bidyut
```

### **Using Postman**
1. Create new request
2. Set method to `POST`
3. URL: `http://localhost:5000/v1/shorten`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "longUrl": "https://example.com",
  "customAlias": "test",
  "expiresIn": 7
}
```

### **Using JavaScript (fetch)**
```javascript
const response = await fetch('http://localhost:5000/v1/shorten', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    longUrl: 'https://example.com',
    customAlias: 'my-link',
    expiresIn: 30
  })
});

const data = await response.json();
console.log(data.data.shortUrl); // http://localhost:5000/v1/my-link
```

---

## 📊 Database Indexes

Optimized for performance:

```javascript
// Fast lookups by URL code
{ urlCode: 1, isActive: 1 }

// Auto-delete expired URLs (TTL index)
{ expiresAt: 1 }

// Analytics queries
{ createdAt: 1, expiresAt: 1 }
```

---

## ⚙️ Dependencies

```json
{
  "express": "^4.18.0",        // Web framework
  "mongoose": "^7.0.0",        // MongoDB ODM
  "validator": "^13.9.0",      // URL validation
  "node-fetch": "^2.6.7",      // HTTP requests (for URL checking)
  "dotenv": "^16.0.0",         // Environment variables
  "dns": "built-in"            // DNS resolution
}
```

Install all:
```bash
npm install express mongoose validator node-fetch dotenv
```

---

## 🔧 Configuration Options

### **URL Code Generation**
- **Default**: Random 6-character alphanumeric (e.g., `a3X9kL`)
- **Custom**: 3-20 characters (alphanumeric, `_`, `-`)

### **Expiration**
- **Default**: Never expires (`null`)
- **Custom**: 1-365 days from creation

### **Click Tracking**
- Stores last **100 clicks** per URL
- Tracks: IP, User-Agent, Referer, Timestamp
- Updates atomically (no race conditions)

---

## 🚨 HTTP Status Codes

| Code | Meaning | Used In |
|------|---------|---------|
| 200 | OK | Health check |
| 201 | Created | URL shortened successfully |
| 302 | Found (Redirect) | Redirect to original URL |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | URL doesn't exist or inactive |
| 409 | Conflict | Custom alias already taken |
| 410 | Gone | URL expired |
| 500 | Server Error | Database/internal error |

---

## 🎯 Core Features

✅ Custom short URLs (aliases)  
✅ Expiration dates (1-365 days)  
✅ Click analytics (last 100 clicks)  
✅ Security validation (SQL/XSS/SSRF)  
✅ DNS verification before shortening  
✅ Auto-cleanup of expired URLs (TTL)  
✅ Soft delete (disable without deletion)  
✅ Private IP blocking  
✅ Phishing detection  
✅ Content-type validation  

---

## 📝 Complete API Flow Example

```
User wants to shorten: https://example.com/long/url

1. POST /v1/shorten
   {
     "longUrl": "https://example.com/long/url",
     "customAlias": "my-link"
   }

2. Server validates:
   ✅ Sanitizes input
   ✅ Checks for SQL/XSS
   ✅ Validates URL format
   ✅ Checks DNS resolution
   ✅ Verifies content-type
   ✅ Blocks malicious content

3. Server creates short URL:
   http://localhost:5000/v1/my-link

4. User shares short URL

5. Someone clicks: GET /v1/my-link

6. Server:
   ✅ Finds URL in DB
   ✅ Checks if active & not expired
   ✅ Tracks click (IP, browser, etc.)
   ✅ Redirects to: https://example.com/long/url
```

---

## 📝 License

MIT License - Feel free to use in your projects!

---

## 👨‍💻 Author

**Bidyut Kundu**  
Building secure, scalable systems one API at a time 🚀

---

**Need help?** Open an issue or reach out!