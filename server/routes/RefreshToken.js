const express = require("express");
const router = express.Router();
const userQuery = require("../query/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("No refresh token provided");
  }
  try {
    if (await userQuery.getRefreshToken(refreshToken)) {
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const newAccessToken = jwt.sign(
        {
          idUporabnika: user.idUporabnika,
          uporabniskoImeUporabnika: user.uporabniskoImeUporabnika,
          vlogaUporabnika: user.vlogaUporabnika,
          idStrankeUporabnika: user.idStrankeUporabnika,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      return res.status(200).json({
        accessToken: newAccessToken,
        idUporabnika: user.idUporabnika,
        uporabniskoImeUporabnika: user.uporabniskoImeUporabnika,
        vlogaUporabnika: user.vlogaUporabnika,
        idStrankeUporabnika: user.idStrankeUporabnika,
      });
    } else {
      return res.status(403).send("Refresh token not in database");
    }
  } catch (error) {
    return res.status(403).send("Invalid refresh token");
  }
});

router.post("/destroy", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("No refresh token provided to destroy");
  }
  try {
    if (await userQuery.deleteRefreshToken(refreshToken)) {
      return res.status(200).send("Refresh token destroyed");
    } else {
      return res.status(403).send("Refresh token not in database");
    }
  } catch (error) {
    return res.status(403).send("Invalid refresh token");
  }
});

module.exports = router;
