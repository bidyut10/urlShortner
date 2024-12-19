const urlModel = require("../model/urlModel");
const shortid = require("shortid");
// const { cache } = require("../middlewares/cacheMiddleware");

// Function to validate input
const isValid = function (value) {
  return typeof value === "string" && value.trim().length > 0;
};

const captureUserDetails = function (req) {
  return {
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  };
}

const createUrl = async function (req, res) {
  try {
    if (!req.body.longUrl || !isValid(req.body.longUrl)) {
      return res.status(400).send({ status: false, message: "Invalid URL" });
    }
    const longUrl = req.body.longUrl.trim();
    const url = await urlModel.findOne({ longUrl });
  
    if (!url) {
      const userMetadata = captureUserDetails(req);
      const baseUrl = process.env.VITE_BACKEND_URL;
      const urlCode = shortid.generate();
      const shortUrl = `${baseUrl}/v1/${urlCode}`;
      const newUrl = await urlModel.create({ longUrl, shortUrl, urlCode, userMetadata });

      const response = {
        urlCode: newUrl.urlCode,
        longUrl: newUrl.longUrl,
        shortUrl: newUrl.shortUrl,
      };
      res.status(201).send({ status: true, data: response });
    } 

    res.status(200).send({
      status: true, data: {
        urlCode: url.urlCode,
        longUrl: url.longUrl,
        shortUrl: url.shortUrl,
      } });
  } catch (error) {
    res.status(500).send({ status: false, message: "Server Error" });
  }
};

const getUrl = async function (req, res) {
  try {
    const urlCode = req.params.urlCode.trim();
    if (!urlCode) {
      return res.status(400).send({ status: false, message: "Invalid URL Code" });
    }

    // const cachedUrl = cache.get(urlCode);
    // if (cachedUrl) {
    //   return res.redirect(cachedUrl.longUrl);
    // }

    const url = await urlModel.findOne({ urlCode });
    if (!url) {
      return res.status(404).send({ status: false, message: "URL not found" });
    }

    // cache.set(urlCode, url); 

    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).send({ status: false, message: "Server Error" });
  }
};

module.exports = {
  createUrl,
  getUrl,
};
