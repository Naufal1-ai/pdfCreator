const path = require('path');
const fs = require('fs');
const { detectLibreOfficePath, convertFile, convertBatch, convertPdfToWord } = require('../src/main/converter');
const { compressPdf } = require('../src/main/compressor');
const {
  mergePdfs,
  splitPdf,
  rotatePdf,
  watermarkPdf,
  addPageNumbers,
  imagesToPdf,
} = require('../src/main/pdfTools');

const OUTPUT_DIR = path.resolve(__dirname, 'output');

function isPdfValid(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  if (stat.size <= 0) return false;
  const buffer = Buffer.alloc(5);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 5, 0);
  fs.closeSync(fd);
  return buffer.toString('utf8').startsWith('%PDF-');
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🚀 MEMULAI SUITE PENGUJIAN OTOMATIS: WordToPDF');
  console.log('====================================================\n');

  let passedCount = 0;
  let totalCount = 0;

  async function test(name, fn) {
    totalCount++;
    process.stdout.write(`[Test ${totalCount}] ${name} ... `);
    try {
      await fn();
      console.log('✅ PASS');
      passedCount++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
    }
  }

  let loPath = null;

  // 1. Deteksi LibreOffice
  await test('Deteksi LibreOffice Path di Sistem', async () => {
    loPath = await detectLibreOfficePath();
    if (!loPath) throw new Error('LibreOffice tidak ditemukan pada path standar.');
  });

  // 2. Konversi Word (.docx)
  let wordPdf = null;
  await test('Konversi Word (.docx) -> PDF', async () => {
    const input = path.resolve(__dirname, 'sample_word.docx');
    wordPdf = await convertFile(input, OUTPUT_DIR, { libreOfficePath: loPath });
    if (!isPdfValid(wordPdf)) throw new Error('File PDF tidak valid atau kosong');
  });

  // 3. Konversi Excel (.xlsx)
  let excelPdf = null;
  await test('Konversi Excel (.xlsx) -> PDF', async () => {
    const input = path.resolve(__dirname, 'sample_excel.xlsx');
    excelPdf = await convertFile(input, OUTPUT_DIR, { libreOfficePath: loPath });
    if (!isPdfValid(excelPdf)) throw new Error('File PDF tidak valid atau kosong');
  });

  // 4. Konversi CSV (.csv)
  let csvPdf = null;
  await test('Konversi Spreadsheet CSV (.csv) -> PDF', async () => {
    const input = path.resolve(__dirname, 'sample_data.csv');
    csvPdf = await convertFile(input, OUTPUT_DIR, { libreOfficePath: loPath });
    if (!isPdfValid(csvPdf)) throw new Error('File PDF tidak valid atau kosong');
  });

  // 5. Konversi Text (.txt)
  let txtPdf = null;
  await test('Konversi Plain Text (.txt) -> PDF', async () => {
    const input = path.resolve(__dirname, 'sample_text.txt');
    txtPdf = await convertFile(input, OUTPUT_DIR, { libreOfficePath: loPath });
    if (!isPdfValid(txtPdf)) throw new Error('File PDF tidak valid atau kosong');
  });

  // 6. Konversi Batch (Semua file sekaligus)
  await test('Konversi Batch (3 file sekaligus)', async () => {
    const batchFiles = [
      { path: path.resolve(__dirname, 'sample_word.docx'), name: 'sample_word.docx' },
      { path: path.resolve(__dirname, 'sample_excel.xlsx'), name: 'sample_excel.xlsx' },
      { path: path.resolve(__dirname, 'sample_data.csv'), name: 'sample_data.csv' }
    ];
    let progressUpdates = 0;
    const results = await convertBatch(batchFiles, OUTPUT_DIR, { libreOfficePath: loPath }, (idx, pct, status) => {
      progressUpdates++;
    });

    if (results.length !== 3) throw new Error(`Jumlah hasil batch tidak sesuai: ${results.length}`);
    const allDone = results.every(r => r.status === 'done' && isPdfValid(r.outputPath));
    if (!allDone) throw new Error('Sebagian file batch gagal dikonversi.');
    if (progressUpdates === 0) throw new Error('Callback progress tidak terpanggil.');
  });

  // 7. Kompresi PDF
  await test('Kompresi PDF (Level Low, Medium, High)', async () => {
    if (!wordPdf) throw new Error('Sumber PDF word belum tersedia.');
    
    const outLow = path.resolve(OUTPUT_DIR, 'compressed_low.pdf');
    const outMed = path.resolve(OUTPUT_DIR, 'compressed_medium.pdf');
    const outHigh = path.resolve(OUTPUT_DIR, 'compressed_high.pdf');

    const resLow = await compressPdf(wordPdf, outLow, 'low');
    const resMed = await compressPdf(wordPdf, outMed, 'medium');
    const resHigh = await compressPdf(wordPdf, outHigh, 'high');

    if (!isPdfValid(outLow) || !isPdfValid(outMed) || !isPdfValid(outHigh)) {
      throw new Error('Hasil kompresi bukan PDF yang valid.');
    }
  });

  // 8. Error Handling jika input tidak ada
  await test('Error Handling (File input fiktif / tidak ada)', async () => {
    const fakePath = path.resolve(__dirname, 'non_existent_file.docx');
    try {
      await convertFile(fakePath, OUTPUT_DIR, { libreOfficePath: loPath });
      throw new Error('Seharusnya melempar error ketika file tidak ada.');
    } catch (err) {
      if (err.message.includes('Seharusnya')) throw err;
      // Berhasil menangkap error
    }
  });

  // 9. PDF to Word (.docx) via LibreOffice
  await test('iLovePDF Suite: PDF to Word (.docx)', async () => {
    if (!wordPdf) throw new Error('Sumber PDF word belum tersedia.');
    const docxOut = await convertPdfToWord(wordPdf, OUTPUT_DIR, { libreOfficePath: loPath });
    if (!fs.existsSync(docxOut) || fs.statSync(docxOut).size === 0) {
      throw new Error('Hasil konversi Word tidak ditemukan atau 0 byte');
    }
  });

  // 10. Merge PDF
  let mergedPdf = null;
  await test('iLovePDF Suite: Merge Multi-PDF', async () => {
    const mergeOutput = path.resolve(OUTPUT_DIR, 'test_suite_merged.pdf');
    const res = await mergePdfs([wordPdf, excelPdf], mergeOutput);
    mergedPdf = res.outputPath;
    if (!isPdfValid(mergedPdf) || res.pageCount < 2) {
      throw new Error('Gagal menggabungkan PDF');
    }
  });

  // 11. Rotate PDF
  await test('iLovePDF Suite: Rotate PDF (90°)', async () => {
    const rotateOutput = path.resolve(OUTPUT_DIR, 'test_suite_rotated.pdf');
    const res = await rotatePdf(wordPdf, rotateOutput, 90);
    if (!isPdfValid(res.outputPath)) {
      throw new Error('Gagal memutar halaman PDF');
    }
  });

  // 12. Watermark PDF
  await test('iLovePDF Suite: Watermark PDF (Diagonal Text)', async () => {
    const wmOutput = path.resolve(OUTPUT_DIR, 'test_suite_watermarked.pdf');
    const res = await watermarkPdf(wordPdf, wmOutput, 'CONFIDENTIAL', { opacity: 0.3 });
    if (!isPdfValid(res.outputPath)) {
      throw new Error('Gagal menyematkan watermark');
    }
  });

  // 13. Add Page Numbers
  await test('iLovePDF Suite: Add Page Numbers', async () => {
    const pnOutput = path.resolve(OUTPUT_DIR, 'test_suite_pagenumbers.pdf');
    const res = await addPageNumbers(mergedPdf, pnOutput, 'Halaman {n} dari {total}');
    if (!isPdfValid(res.outputPath)) {
      throw new Error('Gagal menambahkan nomor halaman');
    }
  });

  // 14. Split PDF (Range & All)
  await test('iLovePDF Suite: Split PDF', async () => {
    const splitDir = path.resolve(OUTPUT_DIR, 'test_suite_split');
    const files = await splitPdf(mergedPdf, splitDir, { mode: 'all' });
    if (!files || files.length < 2 || !files.every(isPdfValid)) {
      throw new Error('Gagal split PDF menjadi individual file');
    }
  });

  // 15. Images to PDF
  await test('iLovePDF Suite: Images to PDF', async () => {
    const iconPath = path.resolve(__dirname, '..', 'assets', 'icon.png');
    const imgPdfOutput = path.resolve(OUTPUT_DIR, 'test_suite_images.pdf');
    const res = await imagesToPdf([iconPath], imgPdfOutput);
    if (!isPdfValid(res.outputPath) || res.pageCount < 1) {
      throw new Error('Gagal mengonversi gambar ke PDF');
    }
  });

  console.log('\n====================================================');
  console.log(`📊 HASIL PENGUJIAN: ${passedCount}/${totalCount} BERHASIL`);
  console.log('====================================================');

  if (passedCount === totalCount) {
    console.log('🎉 SEMUA PENGUJIAN ENGINE 100% SUKSES!');
    process.exit(0);
  } else {
    console.error('⚠️ ADA PENGUJIAN YANG GAGAL.');
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
