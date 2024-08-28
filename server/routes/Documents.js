const express = require("express");
const router = express.Router();
require("dotenv").config();
const documentQuery = require("../query/Documents");

router.post("/getDocumentNumbers", async (req, res) => {
  const { type, idStrankeUporabnika } = req.body;
  const getDocuments = await documentQuery.getDocumentNumbersByType(
    type,
    idStrankeUporabnika
  );
  res.json(getDocuments);
});

module.exports = router;
