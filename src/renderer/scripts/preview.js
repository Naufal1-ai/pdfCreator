/**
 * preview.js — PDF Preview Handler menggunakan PDF.js
 * Fase 4.3 — WordToPDF Converter
 */

const PreviewModule = (() => {
  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 1;
  let currentZoom = 0.75;
  let currentFilePath = null;

  // DOM Elements
  const panel         = document.getElementById('preview-panel');
  const canvas        = document.getElementById('pdf-canvas');
  const placeholder   = document.getElementById('preview-placeholder');
  const metaEl        = document.getElementById('preview-meta');
  const filenameEl    = document.getElementById('preview-filename');
  const pagesEl       = document.getElementById('preview-pages');
  const filesizeEl    = document.getElementById('preview-filesize');
  const compressionEl = document.getElementById('preview-compression');
  const pageIndicator = document.getElementById('page-indicator');
  const zoomLevelEl   = document.getElementById('zoom-level');
  const ctx           = canvas ? canvas.getContext('2d') : null;

  /**
   * Inisialisasi PDF.js worker
   */
  function init() {
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // Bind controls
    document.getElementById('preview-close-btn')?.addEventListener('click', closePreview);
    document.getElementById('prev-page-btn')?.addEventListener('click', prevPage);
    document.getElementById('next-page-btn')?.addEventListener('click', nextPage);
    document.getElementById('zoom-in-btn')?.addEventListener('click', zoomIn);
    document.getElementById('zoom-out-btn')?.addEventListener('click', zoomOut);
    document.getElementById('open-pdf-btn')?.addEventListener('click', openCurrentPdf);
  }

  /**
   * Buka PDF di preview panel
   * @param {string} filePath - Path absolut file PDF
   * @param {object} meta - { filename, pages, size, compressionRatio }
   */
  async function openPreview(filePath, meta = {}) {
    if (!filePath) return;
    currentFilePath = filePath;
    currentPage = 1;
    currentZoom = 0.75;

    // Tampilkan panel
    panel.classList.remove('is-hidden');

    // Update metadata
    if (metaEl) metaEl.style.display = 'block';
    if (filenameEl) filenameEl.textContent = meta.filename || filePath.split(/[\\/]/).pop();
    if (filesizeEl) filesizeEl.textContent = meta.size ? formatBytes(meta.size) : '—';

    if (compressionEl && meta.compressionRatio) {
      compressionEl.style.display = 'inline';
      compressionEl.textContent = `-${meta.compressionRatio}%`;
    } else if (compressionEl) {
      compressionEl.style.display = 'none';
    }

    // Load PDF
    try {
      placeholder.style.display = 'none';
      canvas.style.display = 'block';

      // Gunakan URL file lokal via blob URL
      const url = `file://${filePath.replace(/\\/g, '/')}`;
      const loadingTask = pdfjsLib.getDocument(url);
      pdfDoc = await loadingTask.promise;
      totalPages = pdfDoc.numPages;

      if (pagesEl) pagesEl.textContent = `${totalPages} pages`;
      updatePageIndicator();
      await renderPage(currentPage);
    } catch (err) {
      console.error('PDF load error:', err);
      placeholder.style.display = 'flex';
      placeholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>Gagal memuat preview PDF</span>
      `;
      canvas.style.display = 'none';
    }
  }

  /**
   * Render halaman tertentu ke canvas
   */
  async function renderPage(pageNum) {
    if (!pdfDoc || !canvas || !ctx) return;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: currentZoom * 2 }); // *2 untuk retina

    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width  = `${viewport.width / 2}px`;
    canvas.style.height = `${viewport.height / 2}px`;

    const renderContext = { canvasContext: ctx, viewport };
    await page.render(renderContext).promise;
    updatePageIndicator();
    updateZoomLabel();
  }

  function prevPage() {
    if (currentPage <= 1) return;
    currentPage--;
    renderPage(currentPage);
  }

  function nextPage() {
    if (currentPage >= totalPages) return;
    currentPage++;
    renderPage(currentPage);
  }

  function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.25, 3.0);
    renderPage(currentPage);
  }

  function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.25, 0.25);
    renderPage(currentPage);
  }

  function closePreview() {
    panel.classList.add('is-hidden');
    pdfDoc = null;
    currentFilePath = null;
    if (canvas) canvas.style.display = 'none';
    if (placeholder) {
      placeholder.style.display = 'flex';
      placeholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span>Select a converted file to preview</span>
      `;
    }
    if (metaEl) metaEl.style.display = 'none';
  }

  async function openCurrentPdf() {
    if (currentFilePath) {
      await window.electronAPI.openFile(currentFilePath);
    }
  }

  function updatePageIndicator() {
    if (pageIndicator) pageIndicator.textContent = `${currentPage} / ${totalPages}`;
  }

  function updateZoomLabel() {
    if (zoomLevelEl) zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  return { init, openPreview, closePreview };
})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => PreviewModule.init());
window.PreviewModule = PreviewModule;
