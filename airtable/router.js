//Router for merge api /api/merge
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();

const { mergeAndSavePDFs } = require("../utility/pdfmerging");
const { validateRequestBody, getAllAttahcmentURL } = require("./service");
const { getRecordById, getAllRecords, updateCell, updateMultipleCells } = require('./at');

router.post("/merge", async (req, res) => {
  const requestBody = req.body;

  const validation = validateRequestBody(requestBody);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  const pathURLs = await getAllAttahcmentURL(requestBody);

  const docDirectoryPath = '/home/app/docs';
  const outputFilePath = `docs/${requestBody.recordID}.pdf`;
  const NODE_ENV = process.env.NODE_ENV === 'prod' || 'local';
  console.log("NODE_ENV: ", NODE_ENV);
  console.log("Output File Path: ", outputFilePath);
  if(NODE_ENV === 'prod') {
    outputFilePath = `${docDirectoryPath}/${requestBody.recordID}.pdf`;
  }

  mergeAndSavePDFs(pathURLs.data, outputFilePath)
    .then(() => {
      console.log("PDFs merged successfully.");
      // Update the Airtable record with the merged PDF URL
      const recordId = requestBody.recordID;
      //const mergedField = requestBody.mergedField;
      const mergedPDFUrl = `https://api.handatransportation.com/docs/${requestBody.recordID}.pdf`;
      const newValue = [
        {
          url: mergedPDFUrl,
          filename: `${requestBody.recordID}.pdf`,
        },
      ]
      updateCell(requestBody.baseID, requestBody.tableID, recordId, requestBody.mergedField, newValue);
      console.log("Record updated with merged PDF URL:", mergedPDFUrl);
      return res.status(200).send(requestBody);
    })
    .catch((error) => {
      console.error("Error merging PDFs:", error);
      return res.status(500).json({ error: "Error merging PDFs" });
    });
});

router.post("/merge2", async (req, res) => {
  const requestBody = req.body;
  const docDirectoryPath = '/home/app/docs';
  const outputFilePath = `docs/${requestBody.recordID}.pdf`;
  const NODE_ENV = process.env.NODE_ENV === 'prod' || 'local';
  if(NODE_ENV === 'prod') {
    outputFilePath = `${docDirectoryPath}/${requestBody.recordID}.pdf`;
  }

  mergeAndSavePDFs(requestBody.docURLs, outputFilePath)
    .then(() => {
      console.log("PDFs merged successfully.");
      // Update the Airtable record with the merged PDF URL
      const recordId = requestBody.recordID;
      //const mergedField = requestBody.mergedField;
      const mergedPDFUrl = `https://api.handatransportation.com/docs/${requestBody.recordID}.pdf`;
      const newValue = [
        {
          url: mergedPDFUrl,
          filename: `${requestBody.recordID}.pdf`,
        },
      ]
      // updateCell(requestBody.baseID, requestBody.tableID, recordId, requestBody.mergedField, newValue);
      console.log("Merged PDF URL: ", mergedPDFUrl);
      const response = {
        status: "success",
        message: "PDFs merged successfully",
        url: mergedPDFUrl,
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error("Error merging PDFs:", error);
      return res.status(500).json({ error: "Error merging PDFs" });
    });
});

module.exports = router;
