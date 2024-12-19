const express = require("express");
const router = express.Router();
const urlController = require("../controller/urlController");

router.post("/api/shorten", urlController.createUrl);
router.get("/v1/:urlCode", urlController.getUrl);

module.exports = router;
