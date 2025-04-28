//Router for merge api /api/merge
const express = require("express");
const router = express.Router();

const { mergeAndSavePDFs } = require("../utility/pdfmerging");
const { validateRequestBody, getAllAttahcmentURL } = require("./service");
// const { getRecordById, getAllRecords, updateCell, updateMultipleCells } = require('./at');

router.post("/merge", async (req, res) => {
  const requestBody = req.body;

  const validation = validateRequestBody(requestBody);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  // const { baseID, tableID, fields, mergedField } = requestBody;
  console.log(requestBody);
  const pathURLs = await getAllAttahcmentURL(requestBody);
  console.log(pathURLs);
  mergeAndSavePDFs(pathURLs.data, "docs/new3.pdf")
    .then(() => {
      console.log("PDFs merged successfully.");
      return res.status(200).send(requestBody);
    })
    .catch((error) => {
      console.error("Error merging PDFs:", error);
      return res.status(500).json({ error: "Error merging PDFs" });
    });
});

module.exports = router;
