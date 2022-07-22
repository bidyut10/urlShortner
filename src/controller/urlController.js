const urlModel = require("../model/urlModel");
//packages
const shortid = require("shortid");
const redis = require("redis");
const { promisify } = require("util");


const redisClient = redis.createClient(
  13190,   //port
  "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com", // host
  { no_ready_check: true }
);
//password
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (error) {
  if (error) throw error;
});
redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});


//Connection setup for redis
 
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


//creating a function to help check validation
const isValid = function (value) {
  if (typeof value === "undefined" || typeof value === "null") {
    return false;
  }
  if (value.trim().length == 0) {
    return false;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return true;
  }
};


const createurl = async function (req, res) {
  try {

    //checking body is empty or not
    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide URL details",
      });
    }

    //checking longUrl validation via function
    if (!isValid(req.body.longUrl)) {
      return res
        .status(400)
        .send({ status: false, message: " Please provide LONG URL" });
    }

    //checking longUrl format
    const longUrl = req.body.longUrl.trim();
    if (!(/(:?^((https|http|HTTP|HTTPS){1}:\/\/)(([w]{3})[\.]{1})?([a-zA-Z0-9]{1,}[\.])[\w]*((\/){1}([\w@?^=%&amp;~+#-_.]+))*)$/.test(longUrl))
    ) {
      return res.status(400).send({
        status: false,
        message: "Invalid URL Format",
      });
    }

    //find longUrl in our cache if it is there than send the response from cache memory

    const findInCache = await GET_ASYNC(`${longUrl}`);
    if (findInCache) {
      let data = JSON.parse(findInCache);

      let finaldata= {
        longUrl:data.longUrl,
        shortUrl:data.shortUrl,
        urlCode:data.urlCode
      }
      return res
        .status(200)
        .send({
          status: true,
          msg: `longUrl is already registered and coming from cache`,
          data: finaldata,
        });

    }

    //if longurl not found in cache than it is find in db and than send the data and also set the longUrl in cache
    let url = await urlModel
      .findOne({ longUrl })
      .select({ shortUrl: 1, _id: 0 });

    if (url) {
      await SET_ASYNC(`${longUrl}`, JSON.stringify(url));
      return res.status(201).send({
        status: true,
        msg: `${longUrl} is already registered and this is comming from Db`,
        data: url
      });
    }

    //creating new short url
    const baseUrl = "http://localhost:3000";

    let urlCode = shortid.generate()

    const shortUrl = baseUrl + "/" + urlCode;
    const urlData = { urlCode, longUrl, shortUrl };
    const newurl = await urlModel.create(urlData);

    //set longurl and urlcode in cache memory
    await SET_ASYNC(`${longUrl}`, JSON.stringify(newurl));
    await SET_ASYNC(`${urlCode}`, JSON.stringify(newurl));

    //restruc the res
    let currentUrl = {
      urlCode: newurl.urlCode,
      longUrl: newurl.longUrl,
      shortUrl: newurl.shortUrl,
    };
    return res.status(201).send({status:true, data: currentUrl });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
};



const geturl = async function (req, res) {
  try {
    //urlcode validation
    let urlData = req.params.urlCode;
    //validation
    const urlCode = urlData
      .split("")
      .map((a) => a.trim())
      .join("");
    if (!urlCode) {
      res.status(400).send({ status: false, msg: "please provide UrlCode" });
    } 

    let cachedUrlDataTwo = await GET_ASYNC(`${urlCode}`);
    let cachedUrlDataThree = JSON.parse(cachedUrlDataTwo);
    if (cachedUrlDataThree) {
      res.redirect(302, cachedUrlDataThree["longUrl"]);
    } else {
      let checkUrlCodevalid = await urlModel.findOne({ urlCode: urlCode }).select({ longUrl: 1 });
      if (!checkUrlCodevalid) {
        return res.status(404).send({ status: false, msg: "shortUrl not found" });
      }
      await SET_ASYNC(`${urlCode}`, JSON.stringify(checkUrlCodevalid));
      res.redirect(302, checkUrlCodevalid.longUrl);
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: "Server Error" });
  }
};

module.exports = {
  createurl,
  geturl,
};
