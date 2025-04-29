const Airtable = require("airtable");
const env = require("dotenv").config();
const token =
  "patjpjS0rpdYNGj3k.e5150247a09d09f6a4b559e63475aec678a016eb2e0cd894ceac62674ada3cd4";
// const token = process.env.AIRTABLE_API_KEY;
// const baseID = 'appFZQtRfsGDkCun4';
// const dispatchBase = new Airtable({ apiKey: token }).base(baseID);

async function getRecordById(baseID, tableName, recordId) {
  console.log(" Getting record by ID -->> ", baseID, tableName, recordId);
  if (!baseID || !tableName || !recordId) {
    throw new Error("Missing required parameters: baseID, tableName, recordId");
  }
  console.log("Base ID:", baseID);
  console.log("Table Name:", tableName);
  console.log("Record ID:", recordId);
  try {
    const base = new Airtable({ apiKey: token }).base(baseID);
    console.log("Base ID:", base);
    const record = await base(tableName).find(recordId);
    console.log("Record:", record);

    return record;
  } catch (error) {
    console.error("Error fetching record:", error);
    throw error;
  }
}

async function getAllRecords(baseID, tableName) {
  try {
    const base = new Airtable({ apiKey: token }).base(baseID);
    const records = await base(tableName).select().all();
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
}

async function updateCell(baseID, tableName, recordId, fieldName, newValue) {
  try {
    console.log("Updating cell -->> ", {
      baseID,
      tableName,
      recordId,
      fieldName,
      newValue,
    });
    if (!baseID || !tableName || !recordId || !fieldName || newValue === undefined) {
      throw new Error(
        "Missing required parameters: baseID, tableName, recordId, fieldName, newValue"
      );
    }
    const base = new Airtable({ apiKey: token }).base(baseID);
    const updatedRecord = await base(tableName).update(recordId, {
      [fieldName]: newValue,
    });
    console.log("Record updated:", updatedRecord);
  } catch (error) {
    console.error("Error updating record:", error);
  }
}
async function updateMultipleCells(
  baseID,
  tableName,
  recordId,
  fieldsToUpdate
) {
  try {
    const base = new Airtable({ apiKey: token }).base(baseID);
    const updatedRecord = await dispatchBase(tableName).update(
      recordId,
      fieldsToUpdate
    );
    console.log("Record updated:", updatedRecord);
  } catch (error) {
    console.error("Error updating record:", error);
  }
}
// async function test() {
//   // const res = await  getRecordById({baseID: 'appFZQtRfsGDkCun4', tableName: '🐯 Master 🐯', recordId: 'rec3xr9ZJbzgN0hC'});
//   // console.log(res);
//   const baseId = "appFZQtRfsGDkCun4";
//   const tableIdOrName = "🐯 Master 🐯";
//   const tableID = "tblO5X9igZQEzaWfw";
//   const recordId = "rec3xr9ZJbzgN0hC";
//   // const token = process.env.AIRTABLE_API_KEY;
//   console.log("token:", token);
//   const URL = `https://api.airtable.com/v0/${baseId}/${tableID}/${recordId}`;
//   console.log("URL:", URL);
//   const res = await fetch(URL, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
//   console.log(res);
//   if (!res.ok) {
//     console.error("Error fetching record:", res.statusText);
//     return;
//   }
// }
// test();

module.exports = {
  getRecordById,
  getAllRecords,
  updateCell,
  updateMultipleCells,
};
