const express = require("express");
const router = express.Router();
require("dotenv").config();
const stationQuery = require("../query/Stations");

router.get("/allStations", async (req, res) => {
  const stations = await stationQuery.getAllStations();
  res.json(stations);
});

router.post("/allMiddleStations", async (req, res) => {
  const { dodeljenaStevilka, date } = req.body;
  const allStops = await stationQuery.getAllStops(dodeljenaStevilka, date);
  res.json(allStops);
});

module.exports = router;
