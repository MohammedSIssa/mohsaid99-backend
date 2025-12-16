require("dotenv").config();

const cors = require("cors");

const express = require("express");
const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const socialMediaRouter = require("./social-media-app/app");
const mohsaidRouter = require("./mohsaid99/mohsaid99");
const JSCRouter = require("./JSC/app");
const localMarketRouter = require("./local-market/localMarket");
const newMohsaid99 = require("./mohsaid99-refactored/new-mohsaid99");

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Pulsing" });
});

// mohsaid99 routes
app.use("/mohsaid99", mohsaidRouter);

// refactored mohsaid99
app.use("/new-mohsaid99", newMohsaid99);

// new social media app routes
app.use("/social-media-app", socialMediaRouter);

// JSC router
app.use("/jsc", JSCRouter);

// Local Market
app.use("/local-market", localMarketRouter);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
