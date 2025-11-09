import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from "file-saver";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  Copy,
  SquareArrowOutUpRight,
  ChevronDown,
  Loader2,
} from "lucide-react";

const Hero = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [size, setSize] = useState(150);
  const [format, setFormat] = useState("png");
  const [alertVisible, setAlertVisible] = useState({ message: "", type: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cache for API responses
  const cacheRef = useRef({});

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedLongUrl = sessionStorage.getItem("longUrl");
    const savedShortUrl = sessionStorage.getItem("shortUrl");
    const savedCache = sessionStorage.getItem("urlCache");

    if (savedLongUrl) setLongUrl(savedLongUrl);
    if (savedShortUrl) {
      setShortUrl(savedShortUrl);
      setQrCode(savedShortUrl);
    }
    if (savedCache) {
      try {
        cacheRef.current = JSON.parse(savedCache);
      } catch (e) {
        console.error("Failed to parse cache:", e);
      }
    }
  }, []);

  // Save to sessionStorage whenever values change
  useEffect(() => {
    if (longUrl) {
      sessionStorage.setItem("longUrl", longUrl);
    } else {
      sessionStorage.removeItem("longUrl");
    }
  }, [longUrl]);

  useEffect(() => {
    if (shortUrl) {
      sessionStorage.setItem("shortUrl", shortUrl);
    } else {
      sessionStorage.removeItem("shortUrl");
    }
  }, [shortUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert("Copied successfully!", "success");
  };

  const showAlert = (message, type) => {
    setAlertVisible({ message, type });
    setTimeout(() => setAlertVisible({ message: "", type: "" }), 2000);
  };

  // Sanitize and validate URL
  const isValidUrl = (url) => {
    try {
      const trimmedUrl = url.trim();

      // Check for empty or only whitespace
      if (!trimmedUrl) return false;

      // Check for SQL injection patterns
      const sqlPatterns =
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|UNION)\b)/gi;
      if (sqlPatterns.test(trimmedUrl)) return false;

      // Check for script injection
      const scriptPatterns = /<script|javascript:|onerror=|onload=/gi;
      if (scriptPatterns.test(trimmedUrl)) return false;

      // Validate URL format
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      if (!urlPattern.test(trimmedUrl)) return false;

      // Try to create URL object for additional validation
      let testUrl = trimmedUrl;
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        testUrl = "https://" + trimmedUrl;
      }

      const urlObj = new URL(testUrl);

      // Check for suspicious protocols
      if (!["http:", "https:"].includes(urlObj.protocol)) return false;

      return true;
    } catch (error) {
      return false;
    }
  };

  // Sanitize URL
  const sanitizeUrl = (url) => {
    let sanitized = url.trim();

    // Remove any script tags or javascript
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, "");
    sanitized = sanitized.replace(/javascript:/gi, "");
    sanitized = sanitized.replace(/on\w+\s*=/gi, "");

    // Ensure protocol
    if (!sanitized.startsWith("http://") && !sanitized.startsWith("https://")) {
      sanitized = "https://" + sanitized;
    }

    return sanitized;
  };

  const handleGenerateShortUrl = async () => {
    try {
      if (longUrl.length === 0) {
        showAlert("Please enter your URL.", "error");
        return;
      }

      // Validate URL
      if (!isValidUrl(longUrl)) {
        showAlert("Please enter a valid URL.", "error");
        return;
      }

      const sanitizedUrl = sanitizeUrl(longUrl);

      // Check cache first
      if (cacheRef.current[sanitizedUrl]) {
        setShortUrl(cacheRef.current[sanitizedUrl]);
        setQrCode(cacheRef.current[sanitizedUrl]);
        showAlert("Link loaded successfully!", "success");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/shorten`,
        { longUrl: sanitizedUrl },
        {
          timeout: 10000, // 10 second timeout
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
        }
      );

      if (response.status === 200 && response.data && response.data.data) {
        const { shortUrl: newShortUrl } = response.data.data;

        // Update cache
        cacheRef.current[sanitizedUrl] = newShortUrl;
        sessionStorage.setItem("urlCache", JSON.stringify(cacheRef.current));

        setShortUrl(newShortUrl);
        setQrCode(newShortUrl);
        showAlert("URL shortened successfully.", "success");
      } else if (response.status === 429) {
        showAlert("Too many requests. Please try again later.", "error");
      } else if (response.status === 400) {
        showAlert("Invalid URL format.", "error");
      } else {
        showAlert("Failed to shorten URL. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error shortening URL:", error);

      if (error.code === "ECONNABORTED") {
        showAlert("Request timeout. Please try again.", "error");
      } else if (error.response) {
        // Server responded with error
        showAlert(
          `Error: ${error.response.status}. Please try again.`,
          "error"
        );
      } else if (error.request) {
        // Request made but no response
        showAlert("Network error. Please check your connection.", "error");
      } else {
        showAlert("Failed to shorten URL. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQRCode = () => {
    try {
      const canvas = document.getElementById("qr-code");
      if (!canvas) {
        showAlert("QR Code not found.", "error");
        return;
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = size;
      tempCanvas.height = size;
      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0, size, size);
      tempCanvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `qrcode.${format}`);
          showAlert("QR Code downloaded successfully.", "success");
        } else {
          showAlert("Failed to download QR Code.", "error");
        }
      });
    } catch (error) {
      console.error("Error downloading QR Code:", error);
      showAlert("Failed to download QR Code.", "error");
    }
  };

  const formatOptions = [
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPEG" },
    { value: "jpg", label: "JPG" },
  ];

  return (
    <div className="border-y border-neutral-100 w-full">
      {/* Full-screen loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Loader2 size={48} className="text-yellow-400 animate-spin" />
        </div>
      )}

      {alertVisible.message && (
        <div
          className={`fixed top-6 right-6 ${
            alertVisible.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-3 z-50`}
        >
          <span className="text-xs">{alertVisible.message}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 px-4">
        <div className="md:border-r md:border-neutral-100 w-full md:w-2/4 py-4">
          <h1 className="pb-2 pr-0 md:pr-4 text-neutral-900 font-normal text-xl leading-relaxed">
            Instantly Shorten Links with One Click
          </h1>
          <h1 className="pr-0 md:pr-4 text-neutral-600 text-sm font-normal leading-relaxed">
            Wcut transforms lengthy links from Instagram, Facebook, YouTube,
            Twitter, LinkedIn, WhatsApp, blogs, and websites into sleek,
            shareable URLs. Just paste your link, click Generate Url, and you're
            good to go.
          </h1>
          <div className="flex justify-between items-center gap-4 mt-4 pr-0 md:pr-4">
            <input
              type="text"
              placeholder="Enter your url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerateShortUrl()}
              className="w-full border border-neutral-100 outline-none px-6 py-3 text-black placeholder-neutral-600 text-sm hover:border-yellow-300"
            />
            <button
              className={`cursor-pointer px-6 py-3 bg-yellow-300 text-black font-medium border border-yellow-300 hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleGenerateShortUrl}
              disabled={isLoading}
            >
              <span className="text-sm">
                {isLoading ? "Loading..." : "Generate"}
              </span>
            </button>
          </div>
        </div>
        <div className="w-full md:w-2/4 flex flex-col justify-between items-center gap-4 pl-0 md:pl-4 pb-4 md:pb-0">
          {shortUrl && (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center p-3 border border-neutral-100">
                <span className="text-sm truncate mr-2">{shortUrl}</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="hover:text-green-400"
                  >
                    <Copy size={20} />
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400"
                  >
                    <SquareArrowOutUpRight size={20} />
                  </a>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <QRCodeCanvas
                    id="qr-code"
                    value={qrCode}
                    size={110}
                    className="bg-white p-2 border border-neutral-100"
                  />
                  <div className="ml-4 space-y-4 w-full">
                    <div className="flex justify-center items-center gap-4">
                      <div className="relative w-full" ref={dropdownRef}>
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full p-3 border border-neutral-100 bg-transparent focus:outline-none text-sm flex justify-between items-center hover:border-yellow-300"
                        >
                          <span>
                            {
                              formatOptions.find((opt) => opt.value === format)
                                ?.label
                            }
                          </span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              isDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 w-full bg-white border border-neutral-100 mt-1 z-10">
                            {formatOptions.map((option) => (
                              <div
                                key={option.value}
                                onClick={() => {
                                  setFormat(option.value);
                                  setIsDropdownOpen(false);
                                }}
                                className="p-3 text-sm cursor-pointer hover:bg-yellow-300 transition-colors"
                              >
                                {option.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        min="100"
                        max="1000"
                        className="w-full p-3 border text-sm border-neutral-100 bg-transparent placeholder-neutral-900 focus:outline-none hover:border-yellow-300"
                        placeholder="QR Code Size"
                      />
                    </div>

                    <button
                      className="cursor-pointer w-full text-sm px-6 py-3 bg-yellow-300 text-black font-medium border border-yellow-300 hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2"
                      onClick={handleDownloadQRCode}
                    >
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
