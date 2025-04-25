const { getRecordById, getAllRecords, updateCell, updateMultipleCells } = require('./at');

// Configure Airtable 
// const token = 'patjpjS0rpdYNGj3k.e5150247a09d09f6a4b559e63475aec678a016eb2e0cd894ceac62674ada3cd4';
// const baseID = 'appFZQtRfsGDkCun4';
// const base = new Airtable({ apiKey: token }).base(baseID);

/**
 * Export function to get all PDFs from Airtable multiple fields and merge them into one PDF.
 * @param {string} tableName - The name of the Airtable table.
 * @param {string[]} fields - The fields containing PDF attachments.
 * @param {string} outputFilePath - The path to save the merged PDF.
 */
async function mergePDFFromAirtable(body) {
    const { baseID, tableName, fields, mergedField, recordID } = body;
    // const tableName = '🐯 Master 🐯'; // Replace with your table name
    // const fields = ['Carrier Rate Sheet', 'BOL', 'POD', 'Invoice2.0', 'Alpha RateCon']; // Replace with your field names

    // const outputFilePath = path.join(__dirname, '../docs/abc.pdf'); // Output file path

    try {

        const record = await getRecordById(baseID, tableName, recordID);
        console.log('Record:', record);



        // Fetch records from Airtable
        // const record = await base(tableName).find('recs3xr9ZJbzgN0hC'); // Replace with your record ID

        // const carrierRateSheet = record.get('Carrier Rate Sheet');
        // const bol = record.get('BOL');
        // const pod = record.get('POD');
        // const invoice = record.get('Invoice2.0');
        // const alphaRateCon = record.get('Alpha RateCon');
        // const merged = record.get('Merged');
        // const fields = [carrierRateSheet, bol, pod, invoice, alphaRateCon];

        // // Filter out empty fields
        // const filteredFields = fields.filter(field => field && field.length > 0);
        // if (filteredFields.length === 0) {
        //     console.log('No PDF attachments found in the specified fields.');
        //     return;
        // }
        // // Download PDFs and save them temporarily
        // const pathURLs = filteredFields.map(field => ({
        //     url: field[0].url,
        //     filetype: field[0].type,
        // }));
        
        // console.log('PDF URLs:', pathURLs);

        // mergeAndSavePDFs(pathURLs, outputFilePath, record)
        //     .then(() => {
        //         console.log('PDFs merged successfully. Merged file saved at:', outputFilePath);
        //     })
        //     .catch(error => {
        //         console.error('Error merging PDFs:', error);
        //     });
        
    } catch (error) {
        console.error('Error merging PDFs:', error);
    } finally {
        // Clean up temporary files
        // for (const tempFile of tempFiles) {
        //     fs.unlinkSync(tempFile);
        // }
    }
}

//mergePDFFromAirtable();
module.exports = {
    mergePDFFromAirtable
}