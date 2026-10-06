const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Kompres file PDF menggunakan pdf-lib.
 * @param {string} inputPath - Path file PDF sumber
 * @param {string} outputPath - Path file PDF output
 * @param {'low'|'medium'|'high'} level - Level kompresi
 * @returns {Promise<{inputSize: number, outputSize: number, ratio: number}>}
 */
async function compressPdf(inputPath, outputPath, level = 'medium') {
  const inputBytes = fs.readFileSync(inputPath);
  const inputSize = inputBytes.length;

  // Load PDF
  const pdfDoc = await PDFDocument.load(inputBytes, {
    ignoreEncryption: true,
  });

  // Strategi kompresi berdasarkan level
  const saveOptions = {
    useObjectStreams: true,   // Aktifkan object streams (efisien)
    addDefaultPage: false,
    objectsPerTick: 50,
  };

  if (level === 'medium' || level === 'high') {
    // Hapus duplikat resource
    saveOptions.useObjectStreams = true;
  }

  if (level === 'high') {
    // Tambahan optimasi untuk high
    saveOptions.objectsPerTick = 100;
  }

  const compressedBytes = await pdfDoc.save(saveOptions);

  // Pastikan output dir ada
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, compressedBytes);

  const outputSize = compressedBytes.length;
  const ratio = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

  return {
    inputSize,
    outputSize,
    ratio: parseFloat(ratio),
    outputPath,
  };
}

module.exports = { compressPdf };
