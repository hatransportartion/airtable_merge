const Airtable = require('airtable');
const token = 'patjpjS0rpdYNGj3k.e5150247a09d09f6a4b559e63475aec678a016eb2e0cd894ceac62674ada3cd4';
const baseID = 'appFZQtRfsGDkCun4';
const dispatchBase = new Airtable({ apiKey: token }).base(baseID);

async function getRecordById(tableName, recordId) {
    try {
        const record = await dispatchBase(tableName).find(recordId);
        return record;
    } catch (error) {
        console.error('Error fetching record:', error);
        throw error;
    }
}

async function getAllRecords(tableName) {
    try {
        const records = await dispatchBase(tableName).select().all();
        return records;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
}

async function updateCell(tableName, recordId, fieldName, newValue) {
    try {
        const updatedRecord = await dispatchBase(tableName).update(recordId, {
            [fieldName]: newValue,
        });
        console.log('Record updated:', updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
    }
}
async function updateMultipleCells(tableName, recordId, fieldsToUpdate) {
    try {
        const updatedRecord = await dispatchBase(tableName).update(recordId, fieldsToUpdate);
        console.log('Record updated:', updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
    }
}



module.exports = {
    getRecordById,
    getAllRecords,
    updateCell,
    updateMultipleCells
};

