/**
 * dragdrop.js — Drag & Drop File Handler
 * Fase 4.2 — WordToPDF Converter
 */

const VALID_EXTENSIONS = ['.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls'];

/**
 * Cek apakah file memiliki ekstensi yang valid
 */
function isValidFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  return VALID_EXTENSIONS.includes(ext);
}

/**
 * Inisialisasi Drag & Drop pada elemen drop zone
 * @param {HTMLElement} dropZone - Elemen drop zone
 * @param {function} onFilesAdded - Callback ketika file valid di-drop
 */
function initDragDrop(dropZone, onFilesAdded) {
  let dragCounter = 0;

  // Prevent default browser behavior untuk drag events di seluruh jendela
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  // Drag Enter — tambah class drag-over
  dropZone.addEventListener('dragenter', (e) => {
    dragCounter++;
    const items = Array.from(e.dataTransfer.items || []);
    const hasInvalid = items.some(item => {
      if (item.kind !== 'file') return true;
      const name = item.type || '';
      // Cek tipe MIME (tidak semua browser menyediakan nama file saat dragenter)
      return false;
    });

    dropZone.classList.remove('drag-invalid');
    dropZone.classList.add('drag-over');
  });

  // Drag Over — pertahankan class
  dropZone.addEventListener('dragover', (e) => {
    e.dataTransfer.dropEffect = 'copy';
  });

  // Drag Leave — hapus class
  dropZone.addEventListener('dragleave', (e) => {
    dragCounter--;
    if (dragCounter === 0) {
      dropZone.classList.remove('drag-over', 'drag-invalid');
    }
  });

  // Drop — proses file
  dropZone.addEventListener('drop', (e) => {
    dragCounter = 0;
    dropZone.classList.remove('drag-over', 'drag-invalid');

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(isValidFile);
    const invalidFiles = files.filter(f => !isValidFile(f));

    if (invalidFiles.length > 0 && validFiles.length === 0) {
      // Semua file tidak valid — shake animation
      dropZone.classList.add('drag-invalid');
      setTimeout(() => dropZone.classList.remove('drag-invalid'), 400);
      showInvalidFileHint(invalidFiles);
      return;
    }

    if (invalidFiles.length > 0) {
      // Ada yang tidak valid — tetap proses yang valid, beri info
      showInvalidFileHint(invalidFiles);
    }

    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  });

  // Klik drop zone juga trigger browse
  dropZone.addEventListener('click', () => {
    triggerFileBrowse(onFilesAdded);
  });

  // Keyboard a11y
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerFileBrowse(onFilesAdded);
    }
  });
}

/**
 * Trigger native file browser via electronAPI
 */
async function triggerFileBrowse(onFilesAdded) {
  try {
    const filePaths = await window.electronAPI.openFileDialog();
    if (!filePaths || filePaths.length === 0) return;

    // Buat File-like objects dari path
    const fileObjects = filePaths.map(p => ({
      name: p.split(/[\\/]/).pop(),
      path: p,
      size: 0, // akan diisi saat processing
    }));

    onFilesAdded(fileObjects, true); // true = berasal dari file dialog (sudah punya path)
  } catch (err) {
    console.error('File browse error:', err);
  }
}

/**
 * Tampilkan hint file tidak valid
 */
function showInvalidFileHint(invalidFiles) {
  const names = invalidFiles.map(f => f.name).join(', ');
  console.warn(`File tidak didukung: ${names}. Hanya .docx, .pptx, .xlsx yang diterima.`);
  // UI feedback bisa ditampilkan lewat footer status
  const statusEl = document.getElementById('footer-status-text');
  const subEl = document.getElementById('footer-status-sub');
  if (statusEl) {
    const prev = statusEl.textContent;
    const prevSub = subEl.textContent;
    statusEl.textContent = '⚠ Format tidak didukung';
    if (subEl) subEl.textContent = `${names} — hanya .docx, .pptx, .xlsx`;
    setTimeout(() => {
      statusEl.textContent = prev;
      if (subEl) subEl.textContent = prevSub;
    }, 3000);
  }
}

// Export
window.DragDrop = { initDragDrop, isValidFile, triggerFileBrowse };
