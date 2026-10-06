/**
 * app.js — Main UI Controller & State Management
 * Fase 4.4 — WordToPDF Converter
 */

// ============================================================
// STATE
// ============================================================
const state = {
  files: [],          // Array of { path, name, size, ext, status, outputPath, progress }
  settings: {
    pageSize: 'A4',
    orientation: 'portrait',
    compress: false,
    compressionLevel: 'medium',
    outputDir: null,          // null = folder yang sama dengan file input
    libreOfficePath: null,
  },
  isConverting: false,
};

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
  const map = { docx: 'W', doc: 'W', pptx: 'P', ppt: 'P', xlsx: 'X', xls: 'X' };
  return map[ext] || ext.toUpperCase().charAt(0);
}

function getFileTypeClass(ext) {
  const map = { docx: 'docx', doc: 'doc', pptx: 'pptx', ppt: 'ppt', xlsx: 'xlsx', xls: 'xls' };
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
      <div class="file-card__meta">${sizeStr}${file.outputPath ? ' · PDF siap' : ''}</div>
    </div>

    <span class="badge badge--${file.status}">${getBadgeText(file)}</span>

    <div class="file-card__actions">
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

async function getDefaultOutputDir() {
  // Fallback: Documents/PDFs
  return null;
}

// ============================================================
// CONVERSION
// ============================================================

/**
 * Mulai konversi semua file dengan status 'waiting'
 */
async function startConversion() {
  if (state.isConverting) return;
  const pendingFiles = state.files.filter(f => f.status === 'waiting' || f.status === 'error');
  if (pendingFiles.length === 0) return;

  state.isConverting = true;
  updateConvertBtn();

  // Set semua file pending → waiting
  pendingFiles.forEach(f => { f.status = 'waiting'; f.progress = 0; });
  renderFileList();

  // Footer update
  setFooterStatus(`Converting 0 of ${pendingFiles.length} files...`, '');
  showGlobalProgress(0);

  // Daftar file untuk API
  const filesToConvert = pendingFiles.map(f => ({ path: f.path, name: f.name }));

  // Register progress listener
  const removeListener = window.electronAPI.onProgress((data) => {
    const { fileIndex, percent, status, outputPath } = data;

    // fileIndex = indeks dalam filesToConvert, tapi kita perlu indeks di state.files
    const file = pendingFiles[fileIndex];
    if (!file) return;
    const stateIdx = state.files.indexOf(file);

    file.status   = status;
    file.progress = percent;
    if (outputPath) file.outputPath = outputPath;

    updateFileCard(stateIdx);

    // Hitung progress global
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
      pageSize:         state.settings.pageSize,
      orientation:      state.settings.orientation,
      outputDir:        state.settings.outputDir,
      libreOfficePath:  state.settings.libreOfficePath,
    });

    // Selesai
    const doneCount  = state.files.filter(f => f.status === 'done').length;
    const errorCount = state.files.filter(f => f.status === 'error').length;

    if (errorCount === 0) {
      setFooterStatus(`✓ ${doneCount} file berhasil dikonversi`, '');
    } else {
      setFooterStatus(`${doneCount} berhasil, ${errorCount} gagal`, 'Periksa file yang bermasalah');
    }

    updateGlobalProgress(100);
    setTimeout(() => hideGlobalProgress(), 2000);

  } catch (err) {
    console.error('Conversion error:', err);
    setFooterStatus('Konversi gagal', err.message);
  } finally {
    removeListener();
    state.isConverting = false;
    updateConvertBtn();
    renderFileList();
  }
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
  btn.innerHTML = state.isConverting
    ? `<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
       </svg> Converting...`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
       </svg> Convert All Files <span style="font-size:var(--text-xs);opacity:0.7;">⌘↵</span>`;
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

    if (action === 'remove') {
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

  // 11. Initial state render
  updateFooter();
  updateQueueHeader();
  setFooterStatus('Ready', 'Drop files or click Browse to start');
}

// Boot
document.addEventListener('DOMContentLoaded', init);
