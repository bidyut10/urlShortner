const express = require("express");
const bodyParser = require("body-parser");
const route = require("./route/route");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{ useNewUrlParser: true })
.then(() => console.log("MongoDb is connected"))
.catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT||3000 , function () {
    console.log("Express app is running on " + " " + (process.env.PORT||3000));
  });
