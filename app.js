require("dotenv").config();

const cors = require("cors");
// const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

// app.use(cookieParser());
// const corsOptions = {
//   origin:
//     process.env.NODE_ENV === "development"
//       ? process.env.LOCALHOST_URI
//       : process.env.GITHUB_URI,
//   credentials: true,
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const socialMediaRouter = require("./social-media-app/app");
const mohsaidRouter = require("./mohsaid99/mohsaid99");
const JSCRouter = require("./JSC/app");
const localMarketRouter = require("./local-market/localMarket");
const newMohsaid99 = require("./mohsaid99-refactored/new-mohsaid99");
const repairsRouter = require("./repair-logs-jsc/repairLogs");
const modernMohsaid99Router = require("./modern-mohsaid99/modern-app");

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Pulsing" });
});

// mohsaid99 routes
app.use("/mohsaid99", cors("*"), mohsaidRouter);

// refactored mohsaid99
app.use("/new-mohsaid99", cors("*"), newMohsaid99);

// new social media app routes
app.use("/social-media-app", cors("*"), socialMediaRouter);

// JSC router
app.use("/jsc", cors("*"), JSCRouter);

// Local Market
app.use("/local-market", cors("*"), localMarketRouter);

// Repair Logs
app.use("/repair-logs", cors("*"), repairsRouter);

app.use("/modern-mohsaid99", cors("*"), modernMohsaid99Router);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
