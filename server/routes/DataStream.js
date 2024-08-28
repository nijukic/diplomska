const express = require("express");
const router = express.Router();
require("dotenv").config();
const trainQuery = require("../query/Trains");

router.get("/activeTrains", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendActiveTrains = async () => {
    try {
      const activeTrains = await trainQuery.getActiveTrains();
      res.write(`data: ${JSON.stringify(activeTrains)}\n\n`);
    } catch (error) {
      console.error("Error fetching active trains:", error);
    }
  };

  await sendActiveTrains();

  // Send data every X seconds
  const intervalId = setInterval(sendActiveTrains, 3000);

  // Clear interval on client disconnect
  req.on("close", () => {
    clearInterval(intervalId);
  });
});

router.get("/activeTrainsCustomer", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendActiveTrains = async () => {
    try {
      const activeTrains = await trainQuery.getActiveTrainsCustomer();
      res.write(`data: ${JSON.stringify(activeTrains)}\n\n`);
    } catch (error) {
      console.error("Error fetching active trains:", error);
    }
  };

  await sendActiveTrains();

  const intervalId = setInterval(sendActiveTrains, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

module.exports = router;
