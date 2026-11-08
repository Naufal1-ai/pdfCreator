/**
 * app.js — Main UI Controller & State Management
 * Fase 4.4 — WordToPDF Converter
 */

// ============================================================
// STATE
// ============================================================
const state = {
  currentTool: 'office-to-pdf', // 'office-to-pdf' | 'merge-pdf' | 'split-pdf' | 'rotate-pdf' | 'watermark-pdf' | 'images-to-pdf' | 'pdf-to-word'
  files: [],          // Array of { path, name, size, ext, status, outputPath, progress }
  settings: {
    pageSize: 'A4',
    orientation: 'portrait',
    compress: false,
    compressionLevel: 'medium',
    outputDir: null,          // null = folder yang sama dengan file input
    libreOfficePath: null,
  },
  toolSettings: {
    splitMode: 'all',
    splitRange: '',
    rotateAngle: 90,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.25,
    addPageNumbers: false,
  },
  isConverting: false,
};

window.state = state;

// ============================================================
// UTILS
// ============================================================
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileExt(filename) {
  return filename.split('.').pop().toLowerCase();
}

function getFileTypeLabel(ext) {
  const map = {
    docx: 'W', doc: 'W',
    pptx: 'P', ppt: 'P',
    xlsx: 'X', xls: 'X',
    pdf: 'PDF',
    png: 'IMG', jpg: 'IMG', jpeg: 'IMG',
  };
  return map[ext] || ext.toUpperCase().slice(0, 3);
}

function getFileTypeClass(ext) {
  const map = {
    docx: 'docx', doc: 'doc',
    pptx: 'pptx', ppt: 'ppt',
    xlsx: 'xlsx', xls: 'xls',
    pdf: 'pdf',
    png: 'img', jpg: 'img', jpeg: 'img',
  };
  return map[ext] || 'docx';
}

function totalFilesSize() {
  return state.files.reduce((acc, f) => acc + (f.size || 0), 0);
}

// ============================================================
// FILE MANAGEMENT
// ============================================================

/**
 * Tambah file ke state & render ke UI
 * @param {File[]|object[]} fileList - Array File objects atau plain objects { name, path, size }
 * @param {boolean} fromDialog - true jika dari file dialog (sudah punya .path)
 */
function addFiles(fileList, fromDialog = false) {
  const added = [];

  for (const file of fileList) {
    const name = file.name;
    const path = fromDialog ? file.path : (file.path || name);
    const size = file.size || 0;
    const ext  = getFileExt(name);

    // Cegah duplikat berdasarkan path
    if (state.files.some(f => f.path === path)) continue;

    const fileObj = { path, name, size, ext, status: 'waiting', outputPath: null, progress: 0 };
    state.files.push(fileObj);
    added.push(fileObj);
  }

  // Jika dari drop (File objects), kita perlu baca path via webkitRelativePath atau gunakan name
  // Dalam Electron tanpa nodeIntegration, file path tidak tersedia — harus lewat dialog
  if (!fromDialog && added.some(f => !f.path.includes('\\'))) {
    // Fallback: tampilkan warning bahwa path tidak lengkap
    console.warn('File path tidak tersedia dari drag-drop langsung. Gunakan tombol Browse untuk path lengkap.');
  }

  renderFileList();
  updateFooter();
  updateQueueHeader();
}

/**
 * Hapus file dari state & re-render
 */
function removeFile(index) {
  const card = document.querySelector(`.file-card[data-index="${index}"]`);
  if (card) {
    card.classList.add('is-exiting');
    setTimeout(() => {
      state.files.splice(index, 1);
      renderFileList();
      updateFooter();
      updateQueueHeader();
    }, 250);
  } else {
    state.files.splice(index, 1);
    renderFileList();
    updateFooter();
    updateQueueHeader();
  }
}

/**
 * Hapus semua file
 */
function clearAll() {
  state.files = [];
  renderFileList();
  updateFooter();
  updateQueueHeader();
}

// ============================================================
// RENDER
// ============================================================

/**
 * Render ulang seluruh daftar file
 */
function renderFileList() {
  const list     = document.getElementById('file-list');
  const emptyHint = document.getElementById('empty-hint');
  if (!list) return;

  // Hapus semua card yang ada (kecuali empty hint)
  list.querySelectorAll('.file-card').forEach(el => el.remove());

  if (state.files.length === 0) {
    if (emptyHint) emptyHint.style.display = 'flex';
    return;
  }

  if (emptyHint) emptyHint.style.display = 'none';

  state.files.forEach((file, index) => {
    const card = createFileCard(file, index);
    list.appendChild(card);
  });
}

/**
 * Buat elemen file card
 */
function createFileCard(file, index) {
  const ext       = file.ext;
  const typeLabel = getFileTypeLabel(ext);
  const typeClass = getFileTypeClass(ext);
  const sizeStr   = file.size ? formatBytes(file.size) : '—';

  const card = document.createElement('div');
  card.className = 'file-card';
  card.dataset.index = index;
  card.dataset.status = file.status;

  card.innerHTML = `
    <div class="file-card__strip"></div>

    <div class="file-card__icon file-card__icon--${typeClass}">${typeLabel}</div>

    <div class="file-card__info">
      <div class="file-card__name" title="${file.name}">${file.name}</div>
      <div class="file-card__meta">${sizeStr}${file.outputPath ? ' · Siap' : ''}</div>
    </div>

    <span class="badge badge--${file.status}">${getBadgeText(file)}</span>

    <div class="file-card__actions">
      ${state.currentTool === 'merge-pdf' && state.files.length > 1 ? `
        ${index > 0 ? `<button class="btn-icon" data-action="move-up" data-index="${index}" title="Naikkan urutan">↑</button>` : ''}
        ${index < state.files.length - 1 ? `<button class="btn-icon" data-action="move-down" data-index="${index}" title="Turunkan urutan">↓</button>` : ''}
      ` : ''}
      ${file.outputPath ? `
        <button class="btn-icon" data-action="preview" data-index="${index}" title="Preview PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button class="btn-icon" data-action="open" data-index="${index}" title="Buka File">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
      ` : ''}
      <button class="btn-icon" data-action="remove" data-index="${index}" title="Hapus">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    ${file.status === 'converting' ? `
      <div class="file-card__progress">
        <div class="file-card__progress-fill" style="width:${file.progress || 2}%"></div>
      </div>
    ` : file.status === 'done' ? `
      <div class="file-card__progress">
        <div class="file-card__progress-fill is-done" style="width:100%"></div>
      </div>
    ` : ''}
  `;

  return card;
}

function getBadgeText(file) {
  switch (file.status) {
    case 'waiting':    return 'Waiting';
    case 'converting': return `Converting ${file.progress || 0}%`;
    case 'done':       return '✓ Done';
    case 'error':      return '✕ Error';
    default: return file.status;
  }
}

/**
 * Update status card tertentu tanpa re-render semua
 */
function updateFileCard(index) {
  const list = document.getElementById('file-list');
  const existing = list.querySelector(`.file-card[data-index="${index}"]`);
  if (existing) {
    const newCard = createFileCard(state.files[index], index);
    existing.replaceWith(newCard);
  }
}

// ============================================================
// SETTINGS
// ============================================================
function updateSettings(key, value) {
  state.settings[key] = value;
}

function initSettings() {
  // Page Size
  const pageSizeEl = document.getElementById('page-size');
  pageSizeEl?.addEventListener('change', e => updateSettings('pageSize', e.target.value));

  // Orientation
  document.getElementById('btn-portrait')?.addEventListener('click', () => {
    updateSettings('orientation', 'portrait');
    document.getElementById('btn-portrait').classList.add('is-active');
    document.getElementById('btn-landscape').classList.remove('is-active');
  });
  document.getElementById('btn-landscape')?.addEventListener('click', () => {
    updateSettings('orientation', 'landscape');
    document.getElementById('btn-landscape').classList.add('is-active');
    document.getElementById('btn-portrait').classList.remove('is-active');
  });

  // PDF Compression toggle
  const compressCheckbox = document.getElementById('compress-checkbox');
  const compressLevelRow = document.getElementById('compress-level-row');
  compressCheckbox?.addEventListener('change', e => {
    updateSettings('compress', e.target.checked);
    if (compressLevelRow) {
      compressLevelRow.style.display = e.target.checked ? 'flex' : 'none';
    }
  });

  // Compression level
  document.getElementById('compress-level')?.addEventListener('change', e => {
    updateSettings('compressionLevel', e.target.value);
  });

  // Split settings
  const splitModeSelect = document.getElementById('split-mode-select');
  const splitRangeRow = document.getElementById('split-range-row');
  const splitRangeInput = document.getElementById('split-range-input');

  splitModeSelect?.addEventListener('change', e => {
    state.toolSettings.splitMode = e.target.value;
    if (splitRangeRow) {
      splitRangeRow.style.display = e.target.value === 'range' ? 'flex' : 'none';
    }
  });

  splitRangeInput?.addEventListener('input', e => {
    state.toolSettings.splitRange = e.target.value.trim();
  });

  // Rotate settings
  document.getElementById('rotate-angle-select')?.addEventListener('change', e => {
    state.toolSettings.rotateAngle = parseInt(e.target.value, 10);
  });

  // Watermark settings
  document.getElementById('watermark-text-input')?.addEventListener('input', e => {
    state.toolSettings.watermarkText = e.target.value;
  });

  document.getElementById('watermark-opacity-select')?.addEventListener('change', e => {
    state.toolSettings.watermarkOpacity = parseFloat(e.target.value);
  });

  document.getElementById('pagenum-checkbox')?.addEventListener('change', e => {
    state.toolSettings.addPageNumbers = e.target.checked;
  });

  // Output directory
  document.getElementById('output-dir-btn')?.addEventListener('click', async () => {
    const dir = await window.electronAPI.openFolderDialog();
    if (dir) {
      updateSettings('outputDir', dir);
      const pathEl = document.getElementById('output-dir-path');
      if (pathEl) pathEl.textContent = dir.replace(/^.*[\\/]/, '~/.../' + dir.split(/[\\/]/).pop());
    }
  });

  // Show in finder/explorer
  document.getElementById('show-in-finder-btn')?.addEventListener('click', async () => {
    const dir = state.settings.outputDir || (await getDefaultOutputDir());
    if (dir) window.electronAPI.openFolder(dir);
  });
}

function initToolNav() {
  const nav = document.getElementById('tool-nav');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    const item = e.target.closest('.tool-nav__item');
    if (!item) return;
    const tool = item.dataset.tool;
    if (tool && tool !== state.currentTool) {
      switchTool(tool);
    }
  });
}

function switchTool(toolName) {
  state.currentTool = toolName;

  // Update tabs active state
  document.querySelectorAll('.tool-nav__item').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.tool === toolName);
  });

  // Toggle settings sections
  const sectionOffice    = document.getElementById('section-office-settings');
  const sectionMerge     = document.getElementById('section-merge-settings');
  const sectionSplit     = document.getElementById('section-split-settings');
  const sectionRotate    = document.getElementById('section-rotate-settings');
  const sectionWatermark = document.getElementById('section-watermark-settings');
  const sectionImages    = document.getElementById('section-images-settings');
  const sectionWord      = document.getElementById('section-word-settings');

  if (sectionOffice)    sectionOffice.style.display    = toolName === 'office-to-pdf' ? 'flex' : 'none';
  if (sectionMerge)     sectionMerge.style.display     = toolName === 'merge-pdf' ? 'flex' : 'none';
  if (sectionSplit)     sectionSplit.style.display     = toolName === 'split-pdf' ? 'flex' : 'none';
  if (sectionRotate)    sectionRotate.style.display    = toolName === 'rotate-pdf' ? 'flex' : 'none';
  if (sectionWatermark) sectionWatermark.style.display = toolName === 'watermark-pdf' ? 'flex' : 'none';
  if (sectionImages)    sectionImages.style.display    = toolName === 'images-to-pdf' ? 'flex' : 'none';
  if (sectionWord)      sectionWord.style.display      = toolName === 'pdf-to-word' ? 'flex' : 'none';

  // Adapt hero and dropzone
  const heroTitle = document.querySelector('.main-hero__title');
  const heroSub   = document.querySelector('.main-hero__subtitle');
  const dropSub   = document.querySelector('.drop-zone__subtitle');

  switch (toolName) {
    case 'office-to-pdf':
      if (heroTitle) heroTitle.textContent = 'From Office to PDF.';
      if (heroSub) heroSub.textContent = 'One queue. Perfectly portable documents.';
      if (dropSub) dropSub.textContent = '.docx · .pptx · .xlsx';
      break;
    case 'merge-pdf':
      if (heroTitle) heroTitle.textContent = 'Merge PDF Documents.';
      if (heroSub) heroSub.textContent = 'Combine multiple PDF files into one in queue order.';
      if (dropSub) dropSub.textContent = '2 or more .pdf files';
      break;
    case 'split-pdf':
      if (heroTitle) heroTitle.textContent = 'Split PDF Document.';
      if (heroSub) heroSub.textContent = 'Extract pages or split entire document into individual pages.';
      if (dropSub) dropSub.textContent = '.pdf';
      break;
    case 'rotate-pdf':
      if (heroTitle) heroTitle.textContent = 'Rotate PDF Pages.';
      if (heroSub) heroSub.textContent = 'Rotate pages 90°, 180°, or 270° clockwise.';
      if (dropSub) dropSub.textContent = '.pdf';
      break;
    case 'watermark-pdf':
      if (heroTitle) heroTitle.textContent = 'Watermark & Page Numbers.';
      if (heroSub) heroSub.textContent = 'Add transparent diagonal text & footer page numbers.';
      if (dropSub) dropSub.textContent = '.pdf';
      break;
    case 'images-to-pdf':
      if (heroTitle) heroTitle.textContent = 'Images to PDF.';
      if (heroSub) heroSub.textContent = 'Convert JPG and PNG images into a clean PDF document.';
      if (dropSub) dropSub.textContent = '.jpg · .jpeg · .png';
      break;
    case 'pdf-to-word':
      if (heroTitle) heroTitle.textContent = 'PDF to Word (.docx).';
      if (heroSub) heroSub.textContent = 'Convert PDF files back to editable Word documents offline.';
      if (dropSub) dropSub.textContent = '.pdf';
      break;
  }

  // Filter or clear invalid files if user changed mode
  updateConvertBtn();
  updateFooter();
  renderFileList();
}

function moveFileUp(index) {
  if (index <= 0) return;
  const temp = state.files[index];
  state.files[index] = state.files[index - 1];
  state.files[index - 1] = temp;
  renderFileList();
  updateFooter();
}

function moveFileDown(index) {
  if (index >= state.files.length - 1) return;
  const temp = state.files[index];
  state.files[index] = state.files[index + 1];
  state.files[index + 1] = temp;
  renderFileList();
  updateFooter();
}

async function getDefaultOutputDir() {
  // Fallback: Documents/PDFs
  return null;
}

// ============================================================
// CONVERSION & TOOL PIPELINES
// ============================================================

function getConvertBtnLabel() {
  switch (state.currentTool) {
    case 'office-to-pdf': return 'Convert All to PDF';
    case 'merge-pdf':     return 'Merge All PDFs';
    case 'split-pdf':     return 'Split PDF Document';
    case 'rotate-pdf':    return 'Rotate All Pages';
    case 'watermark-pdf': return 'Apply Watermark';
    case 'images-to-pdf': return 'Convert Images to PDF';
    case 'pdf-to-word':   return 'Convert to Word (.docx)';
    default:              return 'Process Files';
  }
}

/**
 * Mulai aksi tool aktif untuk file-file dalam antrian
 */
async function startConversion() {
  if (state.isConverting) return;
  const pendingFiles = state.files.filter(f => f.status === 'waiting' || f.status === 'error');
  if (pendingFiles.length === 0) return;

  const tool = state.currentTool;
  if (tool === 'merge-pdf' && pendingFiles.length < 2) {
    setFooterStatus('⚠ Butuh minimal 2 file PDF untuk digabungkan', 'Tambahkan file lagi');
    return;
  }

  state.isConverting = true;
  updateConvertBtn();

  pendingFiles.forEach(f => { f.status = 'waiting'; f.progress = 0; });
  renderFileList();
  showGlobalProgress(0);

  try {
    switch (tool) {
      case 'office-to-pdf':
        await runOfficeToPdf(pendingFiles);
        break;
      case 'merge-pdf':
        await runMergePdfs(pendingFiles);
        break;
      case 'split-pdf':
        await runSplitPdf(pendingFiles);
        break;
      case 'rotate-pdf':
        await runRotatePdf(pendingFiles);
        break;
      case 'watermark-pdf':
        await runWatermarkPdf(pendingFiles);
        break;
      case 'images-to-pdf':
        await runImagesToPdf(pendingFiles);
        break;
      case 'pdf-to-word':
        await runPdfToWord(pendingFiles);
        break;
    }
  } catch (err) {
    console.error('Execution error:', err);
    setFooterStatus('Proses gagal', err.message);
  } finally {
    state.isConverting = false;
    updateConvertBtn();
    renderFileList();
    setTimeout(() => hideGlobalProgress(), 2500);
  }
}

async function runOfficeToPdf(pendingFiles) {
  setFooterStatus(`Mengonversi 0 dari ${pendingFiles.length} file...`, '');
  const filesToConvert = pendingFiles.map(f => ({ path: f.path, name: f.name }));

  const removeListener = window.electronAPI.onProgress((data) => {
    const { fileIndex, percent, status, outputPath } = data;
    const file = pendingFiles[fileIndex];
    if (!file) return;
    const stateIdx = state.files.indexOf(file);

    file.status   = status;
    file.progress = percent;
    if (outputPath) file.outputPath = outputPath;

    updateFileCard(stateIdx);
    const doneCount = pendingFiles.filter(f => f.status === 'done' || f.status === 'error').length;
    const globalPct = Math.round((doneCount / pendingFiles.length) * 100);
    updateGlobalProgress(globalPct);

    const processingFile = pendingFiles.find(f => f.status === 'converting');
    setFooterStatus(
      `Converting ${doneCount} of ${pendingFiles.length} files... ${globalPct}%`,
      processingFile ? `Processing ${processingFile.name}` : ''
    );
  });

  try {
    await window.electronAPI.convertFiles(filesToConvert, {
      pageSize:        state.settings.pageSize,
      orientation:     state.settings.orientation,
      outputDir:       state.settings.outputDir,
      libreOfficePath: state.settings.libreOfficePath,
    });
    setFooterStatus(`✓ ${pendingFiles.length} file berhasil dikonversi ke PDF`, '');
    updateGlobalProgress(100);
  } finally {
    removeListener();
  }
}

async function runMergePdfs(pendingFiles) {
  setFooterStatus('Menggabungkan file PDF...', '');
  updateGlobalProgress(30);

  const firstDir = pendingFiles[0].path.replace(/[\\/][^\\/]+$/, '');
  const outputDir = state.settings.outputDir || firstDir;
  const outputPath = `${outputDir}\\merged_${Date.now()}.pdf`;
  const inputPaths = pendingFiles.map(f => f.path);

  pendingFiles.forEach(f => { f.status = 'converting'; f.progress = 50; });
  renderFileList();

  const res = await window.electronAPI.mergePdfs(inputPaths, outputPath);
  updateGlobalProgress(100);

  pendingFiles.forEach(f => { f.status = 'done'; f.progress = 100; f.outputPath = res.outputPath; });
  setFooterStatus(`✓ Berhasil menggabungkan ${pendingFiles.length} file PDF`, `Tersimpan di: ${res.outputPath}`);
}

async function runSplitPdf(pendingFiles) {
  setFooterStatus('Memisahkan halaman PDF...', '');
  const total = pendingFiles.length;

  for (let i = 0; i < total; i++) {
    const file = pendingFiles[i];
    file.status = 'converting';
    file.progress = 40;
    updateFileCard(state.files.indexOf(file));

    const fileDir = file.path.replace(/[\\/][^\\/]+$/, '');
    const outputDir = state.settings.outputDir || `${fileDir}\\${file.name.replace(/\.pdf$/i, '')}_split`;

    const outFiles = await window.electronAPI.splitPdf(file.path, outputDir, {
      mode: state.toolSettings.splitMode,
      ranges: state.toolSettings.splitRange,
    });

    file.status = 'done';
    file.progress = 100;
    file.outputPath = outFiles[0] || outputDir;
    updateFileCard(state.files.indexOf(file));
    updateGlobalProgress(Math.round(((i + 1) / total) * 100));
  }

  setFooterStatus(`✓ Selesai memisahkan PDF`, 'File tersimpan di folder split');
}

async function runRotatePdf(pendingFiles) {
  setFooterStatus('Memutar halaman PDF...', '');
  const total = pendingFiles.length;

  for (let i = 0; i < total; i++) {
    const file = pendingFiles[i];
    file.status = 'converting';
    file.progress = 50;
    updateFileCard(state.files.indexOf(file));

    const outputPath = file.path.replace(/\.pdf$/i, '_rotated.pdf');
    const res = await window.electronAPI.rotatePdf(file.path, outputPath, state.toolSettings.rotateAngle);

    file.status = 'done';
    file.progress = 100;
    file.outputPath = res.outputPath;
    updateFileCard(state.files.indexOf(file));
    updateGlobalProgress(Math.round(((i + 1) / total) * 100));
  }

  setFooterStatus(`✓ ${total} file PDF berhasil diputar`, '');
}

async function runWatermarkPdf(pendingFiles) {
  setFooterStatus('Menambahkan watermark & nomor halaman...', '');
  const total = pendingFiles.length;

  for (let i = 0; i < total; i++) {
    const file = pendingFiles[i];
    file.status = 'converting';
    file.progress = 50;
    updateFileCard(state.files.indexOf(file));

    const outputPath = file.path.replace(/\.pdf$/i, '_watermarked.pdf');
    await window.electronAPI.watermarkPdf(
      file.path,
      outputPath,
      state.toolSettings.watermarkText || 'CONFIDENTIAL',
      { opacity: state.toolSettings.watermarkOpacity }
    );

    if (state.toolSettings.addPageNumbers) {
      await window.electronAPI.addPageNumbers(outputPath, outputPath);
    }

    file.status = 'done';
    file.progress = 100;
    file.outputPath = outputPath;
    updateFileCard(state.files.indexOf(file));
    updateGlobalProgress(Math.round(((i + 1) / total) * 100));
  }

  setFooterStatus(`✓ Watermark berhasil disematkan`, '');
}

async function runImagesToPdf(pendingFiles) {
  setFooterStatus('Mengonversi gambar ke PDF...', '');
  updateGlobalProgress(40);

  const firstDir = pendingFiles[0].path.replace(/[\\/][^\\/]+$/, '');
  const outputDir = state.settings.outputDir || firstDir;
  const outputPath = `${outputDir}\\images_${Date.now()}.pdf`;
  const inputPaths = pendingFiles.map(f => f.path);

  pendingFiles.forEach(f => { f.status = 'converting'; f.progress = 60; });
  renderFileList();

  const res = await window.electronAPI.imagesToPdf(inputPaths, outputPath);
  updateGlobalProgress(100);

  pendingFiles.forEach(f => { f.status = 'done'; f.progress = 100; f.outputPath = res.outputPath; });
  setFooterStatus(`✓ Berhasil membuat PDF dari ${pendingFiles.length} gambar`, `Tersimpan di: ${res.outputPath}`);
}

async function runPdfToWord(pendingFiles) {
  setFooterStatus('Mengonversi PDF ke Word (.docx)...', '');
  const total = pendingFiles.length;

  for (let i = 0; i < total; i++) {
    const file = pendingFiles[i];
    file.status = 'converting';
    file.progress = 50;
    updateFileCard(state.files.indexOf(file));

    const fileDir = file.path.replace(/[\\/][^\\/]+$/, '');
    const outputDir = state.settings.outputDir || fileDir;

    const outDocx = await window.electronAPI.convertPdfToWord(file.path, outputDir, {
      libreOfficePath: state.settings.libreOfficePath,
    });

    file.status = 'done';
    file.progress = 100;
    file.outputPath = outDocx;
    updateFileCard(state.files.indexOf(file));
    updateGlobalProgress(Math.round(((i + 1) / total) * 100));
  }

  setFooterStatus(`✓ ${total} PDF berhasil dikonversi ke dokumen Word`, '');
}

// ============================================================
// FOOTER & PROGRESS
// ============================================================
function updateFooter() {
  const convertBtn = document.getElementById('convert-btn');
  const footerInfo = document.getElementById('footer-info');

  const hasPending = state.files.some(f => f.status === 'waiting' || f.status === 'error');
  if (convertBtn) convertBtn.disabled = !hasPending || state.isConverting;

  if (footerInfo) {
    if (state.files.length > 0) {
      footerInfo.textContent = `${state.files.length} file · ${formatBytes(totalFilesSize())}`;
    } else {
      footerInfo.textContent = '';
    }
  }

  // Default status
  if (!state.isConverting && state.files.length === 0) {
    setFooterStatus('Ready', '');
  }
}

function updateQueueHeader() {
  const countEl   = document.getElementById('queue-count');
  const clearBtn  = document.getElementById('clear-all-btn');
  if (countEl) countEl.textContent = state.files.length;
  if (clearBtn) clearBtn.style.display = state.files.length > 0 ? 'inline-flex' : 'none';
}

function updateConvertBtn() {
  const btn = document.getElementById('convert-btn');
  if (!btn) return;
  const hasPending = state.files.some(f => f.status === 'waiting' || f.status === 'error');
  btn.disabled = !hasPending || state.isConverting;
  const label = getConvertBtnLabel();
  btn.innerHTML = state.isConverting
    ? `<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
       </svg> Memproses...`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
       </svg> ${label} <span style="font-size:var(--text-xs);opacity:0.7;">⌘↵</span>`;
}

function setFooterStatus(text, sub) {
  const statusEl = document.getElementById('footer-status-text');
  const subEl    = document.getElementById('footer-status-sub');
  if (statusEl) statusEl.textContent = text;
  if (subEl)    subEl.textContent    = sub || '';
}

function showGlobalProgress(pct) {
  const el = document.getElementById('global-progress');
  if (el) el.style.display = 'flex';
  updateGlobalProgress(pct);
}

function updateGlobalProgress(pct) {
  const fill  = document.getElementById('global-progress-fill');
  const label = document.getElementById('global-progress-label');
  if (fill)  fill.style.width  = `${pct}%`;
  if (label) label.textContent = `${pct}%`;
}

function hideGlobalProgress() {
  const el = document.getElementById('global-progress');
  if (el) el.style.display = 'none';
}

// ============================================================
// MODAL — LibreOffice Not Found
// ============================================================
function showLibreOfficeModal() {
  const modal = document.getElementById('libreoffice-modal');
  if (modal) modal.style.display = 'flex';
}

function hideLibreOfficeModal() {
  const modal = document.getElementById('libreoffice-modal');
  if (modal) modal.style.display = 'none';
}

function initLibreOfficeModal() {
  document.getElementById('modal-skip-btn')?.addEventListener('click', hideLibreOfficeModal);

  document.getElementById('modal-save-btn')?.addEventListener('click', () => {
    const input = document.getElementById('libreoffice-path-input');
    const path  = input?.value.trim();
    if (path) {
      state.settings.libreOfficePath = path;
      localStorage.setItem('libreOfficePath', path);
      hideLibreOfficeModal();
    }
  });

  document.getElementById('browse-libreoffice-btn')?.addEventListener('click', async () => {
    const paths = await window.electronAPI.openFileDialog();
    if (paths && paths[0]) {
      const input = document.getElementById('libreoffice-path-input');
      if (input) input.value = paths[0];
    }
  });
}

// ============================================================
// INIT
// ============================================================
async function init() {
  // 1. Deteksi LibreOffice
  const savedPath = localStorage.getItem('libreOfficePath');
  if (savedPath) {
    state.settings.libreOfficePath = savedPath;
  } else {
    const detected = await window.electronAPI.getLibreOfficePath();
    if (detected) {
      state.settings.libreOfficePath = detected;
    } else {
      // Tampilkan modal jika tidak ditemukan
      showLibreOfficeModal();
    }
  }

  // 2. Init settings panel
  initSettings();

  // 3. Init modal
  initLibreOfficeModal();

  // 4. Init drag & drop
  const dropZone = document.getElementById('drop-zone');
  if (dropZone && window.DragDrop) {
    window.DragDrop.initDragDrop(dropZone, (files, fromDialog) => {
      addFiles(files, fromDialog);
    });
  }

  // 5. Browse button
  document.getElementById('browse-btn')?.addEventListener('click', async (e) => {
    e.stopPropagation(); // Jangan trigger klik drop-zone
    const paths = await window.electronAPI.openFileDialog();
    if (paths && paths.length > 0) {
      const fileObjects = paths.map(p => ({
        name: p.split(/[\\/]/).pop(),
        path: p,
        size: 0,
      }));
      addFiles(fileObjects, true);
    }
  });

  // 6. Clear all
  document.getElementById('clear-all-btn')?.addEventListener('click', clearAll);

  // 7. Convert button
  document.getElementById('convert-btn')?.addEventListener('click', startConversion);

  // 8. Keyboard shortcut: Cmd/Ctrl + Enter → Convert
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      startConversion();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      document.getElementById('browse-btn')?.click();
    }
  });

  // 9. File card action delegation (preview / open / remove)
  document.getElementById('file-list')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const index  = parseInt(btn.dataset.index, 10);
    const file   = state.files[index];
    if (!file) return;

    if (action === 'move-up') {
      moveFileUp(index);
    } else if (action === 'move-down') {
      moveFileDown(index);
    } else if (action === 'remove') {
      removeFile(index);
    } else if (action === 'open' && file.outputPath) {
      await window.electronAPI.openFile(file.outputPath);
    } else if (action === 'preview' && file.outputPath) {
      window.PreviewModule.openPreview(file.outputPath, {
        filename: file.name.replace(/\.\w+$/, '.pdf'),
        size: 0,
      });
    }
  });

  // 10. Window controls (custom title bar)
  document.getElementById('btn-close')?.addEventListener('click',    () => window.electronAPI.windowClose());
  document.getElementById('btn-minimize')?.addEventListener('click', () => window.electronAPI.windowMinimize());
  document.getElementById('btn-maximize')?.addEventListener('click', () => window.electronAPI.windowMaximize());

  // 11. Initial state render & Tool Nav
  initToolNav();
  updateFooter();
  updateQueueHeader();
  setFooterStatus('Ready', 'Drop files or click Browse to start');
}

// Boot
document.addEventListener('DOMContentLoaded', init);
