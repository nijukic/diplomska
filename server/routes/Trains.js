const express = require("express");
const router = express.Router();
require("dotenv").config();
const trainQuery = require("../query/Trains");

router.post("/searchTrains", async (req, res) => {
  const { status, type, date } = req.body;
  const searchTrains = await trainQuery.getTrainsBySearch(status, type, date);
  res.json(searchTrains);
});

router.post("/searchSpecificTrain", async (req, res) => {
  const { dodeljenaStevilka, date } = req.body;
  const searchTrain = await trainQuery.getSpecificTrain(
    dodeljenaStevilka,
    date
  );
  res.json(searchTrain);
});

router.post("/refreshDetailsTrain", async (req, res) => {
  const { dodeljenaStevilka, date } = req.body;
  const searchTrain = await trainQuery.refreshDetailsTrain(
    dodeljenaStevilka,
    date
  );
  res.json(searchTrain);
});

module.exports = router;
