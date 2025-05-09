const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const asyncHandler = require('express-async-handler');

const { mergeAndSavePDFs } = require("../utility/pdfmerging");
// const { validateRequestBody, getAllAttahcmentURL } = require("./service");
// const { getRecordById, getAllRecords, updateCell, updateMultipleCells } = require('./at');

// router.post("/merge", async (req, res) => {
//   const requestBody = req.body;

//   const validation = validateRequestBody(requestBody);
//   if (!validation.valid) {
//     return res.status(400).json({ error: validation.error });
//   }
//   const pathURLs = await getAllAttahcmentURL(requestBody);

//   const outputFilePath = `/home/app/docs/${requestBody.recordID}.pdf`;
//   const NODE_ENV = process.env.NODE_ENV === 'local' || 'prod';
//   console.log("NODE_ENV: ", NODE_ENV);
//   console.log("Output File Path: ", outputFilePath);
//   if(NODE_ENV === 'local') {
//     outputFilePath = `docs/${requestBody.recordID}.pdf`;
//   }

//   mergeAndSavePDFs(pathURLs.data, outputFilePath)
//     .then(() => {
//       console.log("PDFs merged successfully.");
//       // Update the Airtable record with the merged PDF URL
//       const recordId = requestBody.recordID;
//       //const mergedField = requestBody.mergedField;
//       const mergedPDFUrl = `https://api.handatransportation.com/docs/${requestBody.recordID}.pdf`;
//       const newValue = [
//         {
//           url: mergedPDFUrl,
//           filename: `${requestBody.recordID}.pdf`,
//         },
//       ]
//       updateCell(requestBody.baseID, requestBody.tableID, recordId, requestBody.mergedField, newValue);
//       console.log("Record updated with merged PDF URL:", mergedPDFUrl);
//       return res.status(200).send(requestBody);
//     })
//     .catch((error) => {
//       console.error("Error merging PDFs:", error);
//       return res.status(500).json({ error: "Error merging PDFs" });
//     });
// });

router.post("/merge2", asyncHandler(async (req, res) => {
  const requestBody = req.body;
  
  let outputFilePath = `/home/app/docs/${requestBody.recordID}.pdf`;
  console.log(process.env.NODE_ENV);
  const NODE_ENV = process.env.NODE_ENV === 'local' || 'prod';
  console.log("NODE_ENV: ", NODE_ENV);
  console.log("Output File Path: ", outputFilePath);
  if(NODE_ENV) {
    outputFilePath = `docs/${requestBody.recordID}.pdf`;
  }
  console.log("Output File Path: ", outputFilePath);
  const resp = await mergeAndSavePDFs(requestBody.docURLs, outputFilePath)
    
}));

module.exports = router;
