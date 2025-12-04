const db = require("../queries/register.query");
const bcrypt = require("bcrypt");
const usersQuery = require("../queries/users.query");

async function register(req, res) {
  const { username, password, location } = req.body;
  try {
    const user = await usersQuery.findUser(username);
    if (user) {
      return res
        .status(400)
        .json({ error: "Account with that username already exists!" });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const role = username === "mohsaid99" ? "ADMIN" : "USER";
    const data = { username, password: hashed_password, location, role };

    console.log(data);

    await db.register(data);
    return res.status(201).json({ message: "User successfully registered!" });
  } catch(e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { register };
