const { PDFDocument, StandardFonts, rgb, degrees } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Gabungkan beberapa file PDF menjadi satu file PDF.
 * @param {string[]} inputPaths - Array path absolut file PDF yang akan digabung
 * @param {string} outputPath - Path output PDF hasil penggabungan
 * @returns {Promise<{outputPath: string, pageCount: number, size: number}>}
 */
async function mergePdfs(inputPaths, outputPath) {
  if (!inputPaths || inputPaths.length < 2) {
    throw new Error('Minimal butuh 2 file PDF untuk digabungkan');
  }

  const mergedPdf = await PDFDocument.create();

  for (const filePath of inputPaths) {
    const fileBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    outputPath,
    pageCount: mergedPdf.getPageCount(),
    size: pdfBytes.length,
  };
}

/**
 * Parse string range halaman seperti "1-3, 5, 8-10" menjadi array index 0-based
 * @param {string} rangeStr
 * @param {number} totalPages
 * @returns {number[]} Array 0-based page indices
 */
function parsePageRanges(rangeStr, totalPages) {
  const indices = new Set();
  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indices.add(pageNum - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Pisahkan / ekstrak halaman dari PDF.
 * @param {string} inputPath - Path file PDF sumber
 * @param {string} outputDir - Direktori hasil split
 * @param {object} options - { mode: 'all'|'range', ranges: '1-3, 5' }
 * @returns {Promise<string[]>} Array path file hasil split
 */
async function splitPdf(inputPath, outputDir, options = { mode: 'all' }) {
  const fileBytes = fs.readFileSync(inputPath);
  const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outputFiles = [];

  if (options.mode === 'range' && options.ranges) {
    const pageIndices = parsePageRanges(options.ranges, totalPages);
    if (pageIndices.length === 0) {
      throw new Error('Range halaman tidak valid');
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach(p => newDoc.addPage(p));

    const outputPath = path.join(outputDir, `${baseName}_extracted.pdf`);
    const pdfBytes = await newDoc.save({ useObjectStreams: true });
    fs.writeFileSync(outputPath, pdfBytes);
    outputFiles.push(outputPath);
  } else {
    // Default mode: split all pages into separate PDFs
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);

      const outputPath = path.join(outputDir, `${baseName}_page_${i + 1}.pdf`);
      const pdfBytes = await newDoc.save({ useObjectStreams: true });
      fs.writeFileSync(outputPath, pdfBytes);
      outputFiles.push(outputPath);
    }
  }

  return outputFiles;
}

/**
 * Putar seluruh halaman PDF sebesar derajat tertentu.
 * @param {string} inputPath - Path file PDF sumber
 * @param {string} outputPath - Path output PDF
 * @param {number} rotationDegrees - 90, 180, atau 270
 * @returns {Promise<{outputPath: string, pageCount: number}>}
 */
async function rotatePdf(inputPath, outputPath, rotationDegrees = 90) {
  const fileBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    outputPath,
    pageCount: pages.length,
  };
}

/**
 * Tambahkan teks watermark diagonal di setiap halaman PDF.
 * @param {string} inputPath - Path file PDF sumber
 * @param {string} outputPath - Path output PDF
 * @param {string} watermarkText - Teks watermark
 * @param {object} options - { opacity, size }
 * @returns {Promise<{outputPath: string, pageCount: number}>}
 */
async function watermarkPdf(inputPath, outputPath, watermarkText, options = {}) {
  const {
    opacity = 0.25,
    size = 48,
  } = options;

  const fileBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, size);
    const textHeight = font.heightAtSize(size);

    page.drawText(watermarkText, {
      x: (width - textWidth) / 2,
      y: (height - textHeight) / 2,
      size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    outputPath,
    pageCount: pages.length,
  };
}

/**
 * Tambahkan nomor halaman di footer setiap halaman PDF.
 * @param {string} inputPath - Path file PDF sumber
 * @param {string} outputPath - Path output PDF
 * @param {string} format - Format teks, misal 'Halaman {n} dari {total}'
 * @returns {Promise<{outputPath: string, pageCount: number}>}
 */
async function addPageNumbers(inputPath, outputPath, format = 'Halaman {n} dari {total}') {
  const fileBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const text = format.replace('{n}', (i + 1).toString()).replace('{total}', total.toString());
    const size = 10;
    const textWidth = font.widthOfTextAtSize(text, size);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 20,
      size,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    outputPath,
    pageCount: total,
  };
}

/**
 * Konversi gambar-gambar (JPG, PNG) menjadi satu file PDF.
 * @param {string[]} imagePaths - Array path file gambar (.jpg, .jpeg, .png)
 * @param {string} outputPath - Path output PDF
 * @returns {Promise<{outputPath: string, pageCount: number}>}
 */
async function imagesToPdf(imagePaths, outputPath) {
  if (!imagePaths || imagePaths.length === 0) {
    throw new Error('Minimal butuh 1 file gambar untuk dikonversi');
  }

  const pdfDoc = await PDFDocument.create();

  for (const imgPath of imagePaths) {
    const ext = path.extname(imgPath).toLowerCase();
    const imgBytes = fs.readFileSync(imgPath);

    let image;
    if (ext === '.png') {
      image = await pdfDoc.embedPng(imgBytes);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      image = await pdfDoc.embedJpg(imgBytes);
    } else {
      continue;
    }

    const { width, height } = image.scale(1.0);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    outputPath,
    pageCount: pdfDoc.getPageCount(),
  };
}

module.exports = {
  mergePdfs,
  splitPdf,
  rotatePdf,
  watermarkPdf,
  addPageNumbers,
  imagesToPdf,
};

