const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "User is not logged in" });

  try {
    const validToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).send("Access token expired");
    }
    return res.status(403).send("Invalid token");
  }
};

module.exports = validateToken;
