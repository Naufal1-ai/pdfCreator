const path = require('path');
const fs = require('fs');
const {
  mergePdfs,
  splitPdf,
  rotatePdf,
  watermarkPdf,
  addPageNumbers,
  imagesToPdf,
} = require('../src/main/pdfTools');

async function runTests() {
  console.log('🧪 Memulai pengujian pdfTools...');
  const samplePdf1 = path.join(__dirname, 'output', 'sample_word.pdf');
  const samplePdf2 = path.join(__dirname, 'output', 'sample_excel.pdf');
  const testOutDir = path.join(__dirname, 'output', 'test_tools');

  if (!fs.existsSync(testOutDir)) {
    fs.mkdirSync(testOutDir, { recursive: true });
  }

  // 1. Test Merge PDF
  console.log('1. Menguji Merge PDF...');
  const mergeOutput = path.join(testOutDir, 'merged_test.pdf');
  const mergeRes = await mergePdfs([samplePdf1, samplePdf2], mergeOutput);
  console.log('✅ Merge berhasil:', mergeRes);

  // 2. Test Watermark PDF
  console.log('2. Menguji Watermark PDF...');
  const watermarkOutput = path.join(testOutDir, 'watermarked_test.pdf');
  const wmRes = await watermarkPdf(samplePdf1, watermarkOutput, 'CONFIDENTIAL');
  console.log('✅ Watermark berhasil:', wmRes);

  // 3. Test Rotate PDF
  console.log('3. Menguji Rotate PDF...');
  const rotateOutput = path.join(testOutDir, 'rotated_test.pdf');
  const rotRes = await rotatePdf(samplePdf1, rotateOutput, 90);
  console.log('✅ Rotate berhasil:', rotRes);

  // 4. Test Add Page Numbers
  console.log('4. Menguji Page Numbers...');
  const pageNumOutput = path.join(testOutDir, 'pagenum_test.pdf');
  const pnRes = await addPageNumbers(mergeOutput, pageNumOutput, 'Halaman {n} dari {total}');
  console.log('✅ Page Numbers berhasil:', pnRes);

  // 5. Test Split PDF
  console.log('5. Menguji Split PDF...');
  const splitDir = path.join(testOutDir, 'split');
  const splitFiles = await splitPdf(mergeOutput, splitDir, { mode: 'all' });
  console.log('✅ Split all pages berhasil. Dihasilkan:', splitFiles.length, 'file');

  // 6. Test Image to PDF (using assets/icon.png)
  console.log('6. Menguji Image to PDF...');
  const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
  const imgPdfOutput = path.join(testOutDir, 'image_to_pdf.pdf');
  const imgRes = await imagesToPdf([iconPath], imgPdfOutput);
  console.log('✅ Image to PDF berhasil:', imgRes);

  console.log('\n🎉 SEMUA FITUR PDFTOOLS BERHASIL DIUJI TANPA ERROR!');
}

runTests().catch(err => {
  console.error('❌ Terjadi error saat pengujian:', err);
  process.exit(1);
});

