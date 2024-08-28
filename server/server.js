const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());

//Routers
const userRouter = require("./routes/Users");
app.use("/user", userRouter);

const tokenRouter = require("./routes/RefreshToken");
app.use("/refresh-token", tokenRouter);

const trainRouter = require("./routes/Trains");
app.use("/trains", trainRouter);

const wagonRouter = require("./routes/Wagons");
app.use("/wagon", wagonRouter);

const dataStreamRouter = require("./routes/DataStream");
app.use("/datastream", dataStreamRouter);

const stationRouter = require("./routes/Stations");
app.use("/station", stationRouter);

const documentRouter = require("./routes/Documents");
app.use("/document", documentRouter);

app.listen(3001, () => {
  console.log("Server running on 3001");
});

app.post("/auth", async (req, res) => {
  const accessToken = req.body.accessToken;

  if (accessToken == "") {
    return res.status(403).send("No access token provided");
  }

  try {
    // Validation and decoding of token to get userId, username, role, customerId
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (user) {
      return res.status(200).json({
        accessToken: accessToken,
        idUporabnika: user.idUporabnika,
        uporabniskoImeUporabnika: user.uporabniskoImeUporabnika,
        vlogaUporabnika: user.vlogaUporabnika,
        idStrankeUporabnika: user.idStrankeUporabnika,
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).send("Access token expired");
    }
    return res.status(403).send("Invalid token");
  }
});
