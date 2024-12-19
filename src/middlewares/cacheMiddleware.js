const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // Cache items expire after 300 seconds

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl || req.url;

    if (cache.has(key)) {
        const cachedData = cache.get(key);
        return res.status(200).send(cachedData);
    }

    res.sendResponse = res.send;
    res.send = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
    };

    next();
};

module.exports = { cacheMiddleware, cache };
