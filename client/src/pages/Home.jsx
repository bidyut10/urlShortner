import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { saveAs } from "file-saver";
import axios from "axios";

const Home = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [size, setSize] = useState(150); // Size state for download size only
  const [format, setFormat] = useState("png");

  const handleGenerateShortUrl = async () => {
    try {
      const response = await axios.post("http://localhost:4000/url/shorten", {
        longUrl: longUrl,
      });

      const { shortUrl } = response.data.data;
      setShortUrl(shortUrl);
      setQrCode(shortUrl);
    } catch (error) {
      console.error("Error shortening the URL:", error);
      alert("Failed to generate short URL.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied to clipboard!");
  };

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById("qr-code");
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(canvas, 0, 0, size, size);
    tempCanvas.toBlob((blob) => {
      saveAs(blob, `qrcode.${format}`);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white">
      <div className="rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-sans uppercase text-center mb-8">
          URL Shortener & QR Code Generator
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg bg-black text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            onClick={handleGenerateShortUrl}
            className="w-full bg-gradient-to-r from-cyan-500 to-green-600 text-black p-3 rounded-lg font-semibold hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Generate Short URL
          </button>

          {shortUrl && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg border border-gray-300 bg-black">
                <span className="text-white ">{shortUrl}</span>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopy}
                    className="text-white hover:text-blue-400"
                  >
                    <FiCopy size={20} />
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-green-400"
                  >
                    <FiExternalLink size={20} />
                  </a>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-medium">QR Code</h3>
                <div className="flex justify-between items-center mt-4">
                  <QRCodeCanvas
                    id="qr-code"
                    value={qrCode}
                    size={150} // Fixed display size
                    className="bg-white p-2 rounded-lg"
                  />
                  <div className="ml-4 space-y-2">
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-100 focus:outline-none"
                    >
                      <option value="png" className="text-black">
                        PNG
                      </option>
                      <option value="jpeg" className="text-black">
                        JPEG
                      </option>
                      <option value="jpg" className="text-black">
                        JPG
                      </option>
                    </select>

                    <input
                      type="number"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-900 focus:outline-none"
                      placeholder="QR Code Size"
                    />

                    <button
                      onClick={handleDownloadQRCode}
                      className="w-full bg-gradient-to-r from-cyan-500 to-green-600 text-black p-2 rounded-lg transition hover:shadow-md"
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

export default Home;
