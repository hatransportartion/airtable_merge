const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { PDFDocument } = require("pdf-lib");

async function mergePDFs(pdfPaths, outputPath) {
  console.log("MergePDFs --->> ", pdfPaths, outputPath);
  const pdfDoc = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    const imageBytes = await fetch(pdfPath.url, {
      method: "GET",
    }).then((res) => res.arrayBuffer());
    console.log(imageBytes);

    // const response = await axios({
    //   url: pdfPath.url,
    //   method: "GET",
    //   responseType: "stream",
    // });
    // console.log(response);
    // response.data.pipe(fs.createWriteStream(`./${pdfPath.filename}`));
    // break;

    if (
      pdfPath.filetype === "application/pdf" ||
      pdfPath.filetype === "image/pdf"
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
      pdfPath.filetype === "image/jpeg" ||
      pdfPath.filetype === "image/jpg"
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
    } else if (pdfPath.filetype === "image/png") {
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
    // const pdf = await PDFDocument.load(pdfBytes);
    // const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
    // copiedPages.forEach((page) => {
    //     pdfDoc.addPage(page);
    // });
  }

  const mergedPdfBytes = await pdfDoc.save();

  fs.writeFileSync(outputPath, mergedPdfBytes);

  return outputPath;
}

const pdfPaths = [
  {
    url: "https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg",
    filetype: "image/jpeg",
  },
  {
    url: "https://pdf-lib.js.org/assets/minions_banana_alpha.png",
    filetype: "image/png",
  },
  {
    url: "https://pdf-lib.js.org/assets/american_flag.pdf",
    filetype: "application/pdf",
  },
];
const outputPath = "docs/new2.pdf";

async function mergeAndSavePDFs(pdfPaths, outputPath) {
  try {
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

// mergeAndSavePDFs(pdfPaths, outputPath)
//     .then(mergedFileName => {
//         console.log(mergedFileName)
//     })
//     .catch(error => {
//         console.log(error)
//     });

module.exports = {
  mergeAndSavePDFs,
};
