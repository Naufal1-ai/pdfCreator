const path = require('path');
const fs = require('fs');
const { detectLibreOfficePath, convertFile } = require('../src/main/converter');
const { compressPdf } = require('../src/main/compressor');

async function runTest() {
  console.log('=== TEST CONVERSION UTILITY ===');
  
  // 1. Detect LibreOffice
  const loPath = await detectLibreOfficePath();
  console.log('Detected LibreOffice path:', loPath);

  if (!loPath) {
    console.error('ERROR: LibreOffice not detected yet.');
    process.exit(1);
  }

  // 2. Convert sample_word.docx
  const inputPath = path.resolve(__dirname, 'sample_word.docx');
  const outputDir = path.resolve(__dirname, 'output');

  console.log(`Converting ${inputPath} -> ${outputDir}...`);
  const pdfPath = await convertFile(inputPath, outputDir, { libreOfficePath: loPath });
  console.log('✅ Conversion success! PDF generated at:', pdfPath);

  // 3. Compress PDF test
  const compressedPath = path.resolve(__dirname, 'output', 'sample_word_compressed.pdf');
  const compressResult = await compressPdf(pdfPath, compressedPath, 'medium');
  console.log('✅ Compression success! Result:', compressResult);

  console.log('=== ALL TESTS PASSED SUCCESSFULLY ===');
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
