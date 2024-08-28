const express = require("express");
const router = express.Router();
require("dotenv").config();
const wagonQuery = require("../query/Wagons");

router.post("/getWagonsOfTrain", async (req, res) => {
  const { dodeljenaStevilka, date } = req.body;
  const searchWagons = await wagonQuery.getWagonsOfTrain(
    dodeljenaStevilka,
    date
  );
  res.json(searchWagons);
});

router.post("/searchWagons", async (req, res) => {
  const { type, documentNumber } = req.body;
  const searchWagons = await wagonQuery.searchWagons(type, documentNumber);
  res.json(searchWagons);
});

router.post("/searchWagonsById", async (req, res) => {
  const { wagonNumber } = req.body;
  const searchWagons = await wagonQuery.searchWagonsById(wagonNumber);
  res.json(searchWagons);
});

router.post("/getWagonNumbers", async (req, res) => {
  const { idStrankeUporabnika } = req.body;
  const wagonNumbers = await wagonQuery.getWagonNumbers(idStrankeUporabnika);
  res.json(wagonNumbers);
});

router.post("/getCustomerWagons", async (req, res) => {
  const { idStrankeUporabnika } = req.body;
  const getWagons = await wagonQuery.getCustomerWagons(idStrankeUporabnika);
  res.json(getWagons);
});

module.exports = router;
