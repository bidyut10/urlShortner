import { QRCodeCanvas } from "qrcode.react";
import { FiCopy } from "react-icons/fi";
import { saveAs } from "file-saver";
import axios from "axios";
import { useState } from "react";
import { VscLinkExternal } from "react-icons/vsc";

const Hero = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [size, setSize] = useState(150);
  const [format, setFormat] = useState("png");
  const [alertVisible, setAlertVisible] = useState({ message: "", type: "" });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert("Copied successfully!", "success");
  };

  const showAlert = (message, type) => {
    setAlertVisible({ message, type });
    setTimeout(() => setAlertVisible({ message: "", type: "" }), 2000);
  };

  const handleGenerateShortUrl = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/shorten`,
        { longUrl }
      );

      const { shortUrl } = response.data.data;
      setShortUrl(shortUrl);
      setQrCode(shortUrl);
      showAlert("URL shortened successfully!", "success");
    } catch (error) {
      console.error(error)
      showAlert("Failed to shorten URL. Please try again.", "error");
    }
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
    <div className="max-w-3xl mx-auto space-y-10 my-[45px] px-5 md:px-0 pt-12 md:pt-0">
      {alertVisible.message && (
        <div
          className={`fixed bottom-4 right-4 ${
            alertVisible.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded-md`}
        >
          <span>{alertVisible.message}</span>
        </div>
      )}
      {/* Title */}
      <header className="text-start space-y-4">
        <h2 className="text-2xl font-normal ">
          Simple & Lightning-Fast One-Click URL Shortener!
        </h2>
        <p className="text-gray-600 text-lg">
          <strong className="text-purple-500">Cuturl</strong> transforms lengthy
          links from Instagram, Facebook, YouTube, Twitter, LinkedIn, WhatsApp,
          TikTok, blogs, and websites into sleek, shareable URLs. Just paste
          your link, click {"'"}Generate Url{"'"}, and you’re good to go!
        </p>
      </header>
      <div className="w-full rounded-lg p-4 shadow-xl relative">
        <div className="mt-10">
          <input
            type="text"
            placeholder="Enter your url"
            value={longUrl} 
            onChange={(e) => setLongUrl(e.target.value)} 
            className="w-full border border-black rounded-md outline-none p-2.5 text-black placeholder-gray-600"
          />
        </div>
        <button
          onClick={handleGenerateShortUrl}
          className="w-full mt-4 bg-[#cc99ff] font-normal p-3 rounded-md hover:bg-[#bf80ff] transition-colors duration-1000 hover:ease-linear"
        >
          Generate Url
        </button>
        {shortUrl && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg border border-black">
              <span>{shortUrl}</span>
              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(shortUrl)} 
                  className="hover:text-blue-400"
                >
                  <FiCopy size={20} />
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#b366ff]"
                >
                  <VscLinkExternal size={20} />
                </a>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mt-4">
                <QRCodeCanvas
                  id="qr-code"
                  value={qrCode}
                  size={150} 
                  className="bg-white p-2 rounded-lg"
                />
                <div className="ml-4 space-y-2">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 border border-black rounded-lg bg-transparent placeholder-gray-100 focus:outline-none"
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
                    className="w-full p-2 border border-black rounded-lg bg-transparent placeholder-gray-900 focus:outline-none"
                    placeholder="QR Code Size"
                  />

                  <button
                    onClick={handleDownloadQRCode}
                    className="w-full bg-[#cc99ff] font-normal p-3 rounded-md hover:bg-[#bf80ff] transition-colors duration-1000 hover:ease-linear"
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
  );
};

export default Hero;
