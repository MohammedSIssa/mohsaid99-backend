const express = require("express");
const { Router } = express;
const JSCRouter = Router();

const loginRouter = require("./routes/login.route");
const hcfsRouter = require("./routes/hcfs.route");

JSCRouter.get("/", (req, res) => res.send("Hello From JSC"));
JSCRouter.use("/login", loginRouter);
JSCRouter.use("/hcfs", hcfsRouter);

// const db = require("./db");
// const bcrypt = require("bcrypt");

// JSCRouter.post("/register", async (req, res) => {
//   const { username, password, role } = req.body;
//   try {
//     const hashed_password = await bcrypt.hash(password, 10);
//     await db.query(
//       "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
//       [username, hashed_password, role]
//     );

//     return res.status(201).json({ message: "Created user successfully" });
//   } catch {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = JSCRouter;
