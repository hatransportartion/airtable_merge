const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

async function mergePDFs(pdfPaths, outputPath) {
  console.log("MergePDFs --->> ", pdfPaths);
  console.log("Array Length: ", pdfPaths.length);
  if (pdfPaths.length === 0) {
    throw new Error("No PDF paths provided");
  }
  const pdfDoc = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    const imageBytes = await fetch(pdfPath.url, {
      method: "GET",
    }).then((res) => res.arrayBuffer());
    console.log(imageBytes);

    if (
      pdfPath.type === "application/pdf" ||
      pdfPath.type === "image/pdf"
    ) {
      
      const pdfDocToMerge = await PDFDocument.load(imageBytes);
      const copiedPages = await pdfDoc.copyPages(
        pdfDocToMerge,
        pdfDocToMerge.getPageIndices()
      );
      copiedPages.forEach((page) => {
        pdfDoc.addPage(page);
      });
    } else if (
      pdfPath.type === "image/jpeg" ||
      pdfPath.type === "image/jpg"
    ) {
      const jpgImageBytes = await pdfDoc.embedJpg(imageBytes);
      const jpgDims = jpgImageBytes.scale(0.5);
      const page = pdfDoc.addPage([jpgDims.width, jpgDims.height]);
      page.drawImage(jpgImageBytes, {
        x: 0,
        y: 0,
        width: jpgDims.width,
        height: jpgDims.height,
      });
    } else if (pdfPath.type === "image/png") {
      const pngImage = await pdfDoc.embedPng(imageBytes);
      const pngDims = pngImage.scale(0.5);
      const page = pdfDoc.addPage([pngDims.width, pngDims.height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngDims.width,
        height: pngDims.height,
      });
    } else {
      console.error("Unsupported file type:", pdfPath.filetype, " & ", pdfPath);
      continue;
    }

    const pdfBytes = await pdfDoc.save();
  }

  const mergedPdfBytes = await pdfDoc.save();

  //sanitize the output path
  const sanitizedOutputPath = outputPath.replace(/[^a-zA-Z0-9_.-]/g, "_");
  console.log("Sanitized Output Path: ", sanitizedOutputPath);

  fs.writeFileSync(sanitizedOutputPath, mergedPdfBytes);

  return sanitizedOutputPath;
}

async function mergeAndSavePDFs(pdfPaths, outputPath) {
  try {
    console.log("Merging and saving PDFs -->> ", outputPath);
    const mergedFileName = await mergePDFs(pdfPaths, outputPath);
    console.log(
      "PDFs merged successfully. Merged file saved at:",
      mergedFileName
    );
    return mergedFileName;
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw error;
  }
}

module.exports = {
  mergeAndSavePDFs,
};
