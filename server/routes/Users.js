const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userQuery = require("../query/Users");

router.post("/signUp", async (req, res) => {
  try {
    const { uporabniskoImeUporabnika, gesloUporabnika, vlogaUporabnika } =
      req.body;
    const user = await userQuery.getUserByUsername(uporabniskoImeUporabnika);
    const customerNumber = await userQuery.checkCustomerNumber(
      req.body.stevilkaStranke
    );
    if (user) {
      return res.status(400).send("Uporabniško ime že obstaja!");
    } else if (customerNumber) {
      return res.status(400).send("Za to številko stranke že obstaja račun!");
    } else {
      bcrypt.hash(gesloUporabnika, 10).then((hash) => {
        req.body.stevilkaStranke == null
          ? userQuery.createUser(
              uporabniskoImeUporabnika,
              hash,
              vlogaUporabnika
            )
          : userQuery.createUserCustomer(
              uporabniskoImeUporabnika,
              hash,
              vlogaUporabnika,
              req.body.stevilkaStranke
            );
        return res.status(200).json("Uporabniški račun uspešno ustvarjen!");
      });
    }
  } catch (error) {
    return res.status(500).send("Uporabniški račun ni bilo mogoče ustvariti!");
  }
});

router.post("/login", async (req, res) => {
  const { uporabniskoImeUporabnika, gesloUporabnika } = req.body;

  const user = await userQuery.getUserByUsername(uporabniskoImeUporabnika);

  if (!user) {
    return res.status(400).send("Uporabniško ime ne obstaja!");
  }
  const userPassword = await userQuery.getPasswordByUsername(
    user.uporabniskoImeUporabnika
  );
  try {
    if (await bcrypt.compare(gesloUporabnika, userPassword)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        {
          idUporabnika: user.idUporabnika,
          uporabniskoImeUporabnika: user.uporabniskoImeUporabnika,
          vlogaUporabnika: user.vlogaUporabnika,
          idStrankeUporabnika: user.idStrankeUporabnika,
        },
        process.env.REFRESH_TOKEN_SECRET
      );
      userQuery.createRefreshToken(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        //sameSite: "None", // Ensure this is 'None' for cross-origin
        //secure: false, // Set to true if you are using HTTPS
        //maxAge: 24 * 60 * 60 * 1000, // We handle token expiration in MySQL server
      });
      return res.status(200).json({
        accessToken: accessToken,
        idUporabnika: user.idUporabnika,
        uporabniskoImeUporabnika: user.uporabniskoImeUporabnika,
        vlogaUporabnika: user.vlogaUporabnika,
        idStrankeUporabnika: user.idStrankeUporabnika,
      });
    } else {
      return res.status(400).send("Napačna kombinacija gesla in imena!");
    }
  } catch {
    return res.status(500).send("Prijava neuspešna!");
  }
});

function generateAccessToken(user) {
  return jwt.sign(
    {
      idUporabnika: user.idUporabnika,
      uporabniskoImeUporabnika: user.uporabniskoImeUporabnika,
      vlogaUporabnika: user.vlogaUporabnika,
      idStrankeUporabnika: user.idStrankeUporabnika,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

router.get("/allCustomers", async (req, res) => {
  const allCustomers = await userQuery.getAllCustomers();
  res.json(allCustomers);
});

module.exports = router;
