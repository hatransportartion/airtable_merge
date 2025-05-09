const Airtable = require("airtable");
const env = require("dotenv").config();
const token = process.env.AIRTABLE_API_KEY || '';

async function getRecordById(baseID, tableName, recordId) {
  console.log(" Getting record by ID -->> ", baseID, tableName, recordId);
  if (!baseID || !tableName || !recordId) {
    console.error("Missing required parameters: baseID, tableName, recordId");
    throw new Error("Internal Server Error");
  }
  console.log("Base ID:", baseID);
  console.log("Table Name:", tableName);
  console.log("Record ID:", recordId);
  try {
    const base = new Airtable({ apiKey: token }).base(baseID);
    console.log("Base ID:", base);
    const record = await base(tableName).find(recordId);

    return record;
  } catch (error) {
    console.error("Error: ", error.message);
    throw new Error("Internal Server Error");
  }
}

async function getAllRecords(baseID, tableName) {
  try {
    if(token === undefined) {
      throw new Error("Internal Server Error");
    }
    const base = new Airtable({ apiKey: token }).base(baseID);
    const records = await base(tableName).select().all();
    return records;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Internal Server Error");
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

//Update Field type to RollUp
async function updateFieldType(
  baseID,
  tableName,
  fieldName,
  newFieldType,
  options = {}
) {
  try {
    const base = new Airtable({ apiKey: token }).base(baseID);
    const table = base(tableName);
    const field = await table.find(fieldName);
    const options = {
      isValid: true,
      recordLinkFieldId: "fldPSPDqsKnUyigCf",
      fieldIdInLinkedTable: "fldZZpD32Df5n3Zxs",
      isComputed: true,
      aggregationFunction: "SUM",
      aggregationFormula: "SUM(values)",
    }
    const updatedField = await table.updateField(field.id, {
      type: newFieldType,
      options: options,
    });
  } catch (error) {
    console.error("Error updating field type:", error);
  }
}

//updateFieldType("app0c4crVcYRg8uwQ", "tbl8CErhqpvcibTu3", "DOT (from HA Truck Payroll 💵)", "rollup", )

module.exports = {
  getRecordById,
  getAllRecords,
  updateCell,
  updateMultipleCells,
};
