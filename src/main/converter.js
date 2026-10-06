const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ============================================================
// LibreOffice path detection (Windows)
// ============================================================
const LIBREOFFICE_PATHS = [
  'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
  'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
  'C:\\Program Files\\LibreOffice 7\\program\\soffice.exe',
  'C:\\Program Files\\LibreOffice 6\\program\\soffice.exe',
];

/**
 * Deteksi path LibreOffice secara otomatis di Windows.
 * @returns {string|null} Path soffice.exe jika ditemukan, null jika tidak.
 */
async function detectLibreOfficePath() {
  for (const p of LIBREOFFICE_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

/**
 * Konversi satu file Office ke PDF menggunakan LibreOffice CLI.
 * @param {string} inputPath - Path absolut file input (.docx, .pptx, dll)
 * @param {string} outputDir - Direktori tujuan file PDF
 * @param {object} options - { pageSize, orientation, libreOfficePath }
 * @returns {Promise<string>} Path absolut file PDF hasil konversi
 */
async function convertFile(inputPath, outputDir, options = {}) {
  const {
    libreOfficePath = await detectLibreOfficePath(),
  } = options;

  if (!libreOfficePath) {
    throw new Error('LIBREOFFICE_NOT_FOUND');
  }

  // Pastikan output dir ada
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const args = [
      '--headless',
      '--convert-to', 'pdf',
      '--outdir', outputDir,
      inputPath
    ];

    const proc = spawn(libreOfficePath, args, {
      windowsHide: true,
    });

    let stderr = '';
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`LibreOffice exit code ${code}: ${stderr}`));
      }

      // Nama file output: ganti ekstensi input dengan .pdf
      const inputBasename = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(outputDir, `${inputBasename}.pdf`);

      if (!fs.existsSync(outputPath)) {
        return reject(new Error(`PDF tidak ditemukan setelah konversi: ${outputPath}`));
      }

      resolve(outputPath);
    });

    proc.on('error', (err) => {
      reject(new Error(`Gagal menjalankan LibreOffice: ${err.message}`));
    });
  });
}

/**
 * Konversi batch (array file) ke PDF.
 * @param {Array<{path: string, name: string}>} files - Array file untuk dikonversi
 * @param {string} outputDir - Direktori tujuan file PDF
 * @param {object} options - Opsi konversi
 * @param {function} onProgress - Callback(fileIndex, percent, status, outputPath)
 * @returns {Promise<Array>} Array hasil konversi
 */
async function convertBatch(files, outputDir, options = {}, onProgress = () => {}) {
  const results = [];
  const libreOfficePath = options.libreOfficePath || await detectLibreOfficePath();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      onProgress(i, 0, 'converting', null);

      const outputPath = await convertFile(file.path, outputDir, {
        ...options,
        libreOfficePath,
      });

      onProgress(i, 100, 'done', outputPath);
      results.push({ index: i, status: 'done', outputPath, error: null });

    } catch (err) {
      onProgress(i, 0, 'error', null);
      results.push({ index: i, status: 'error', outputPath: null, error: err.message });
    }
  }

  return results;
}

module.exports = { detectLibreOfficePath, convertFile, convertBatch };
