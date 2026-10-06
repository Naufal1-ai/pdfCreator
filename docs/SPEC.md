# 📐 SPEC.md — Spesifikasi Teknis WordToPDF Converter

> Dokumen ini adalah panduan teknis lengkap untuk agent agar dapat membaca dan langsung mengeksekusi pembuatan aplikasi WordToPDF Converter.

## 📚 Dokumen Terkait (Baca Semuanya Sebelum Eksekusi)

| Dokumen | Fungsi |
|---|---|
| [`SKILL.md`](SKILL.md) | Panduan eksekusi agent — baca PERTAMA |
| [`SPEC.md`](SPEC.md) | Spesifikasi teknis lengkap (file ini) |
| [`PLAN.md`](PLAN.md) | Rencana 6 fase & checklist |
| [`FLOW.md`](FLOW.md) | Diagram alur proses sistem |

---

## 🎯 Tujuan Proyek

Membangun aplikasi desktop berbasis **Electron** yang dapat mengkonversi file Office (`.docx`, `.doc`, `.pptx`, `.xlsx`) ke format **PDF** secara **offline** menggunakan **LibreOffice** sebagai engine konversi, dengan UI yang modern, dark mode, dan profesional.

---

## 🏛️ Arsitektur Sistem

```
[User Interface (Renderer Process)]
        ↕ (IPC via preload.js)
[Main Process (Node.js / Electron)]
        ↕ (child_process.spawn)
[LibreOffice CLI / soffice]
        ↓
[PDF Output File]
```

### Deskripsi Layer:
- **Renderer Process** — UI yang dilihat user (HTML/CSS/JS), berjalan di Chromium
- **Main Process** — Logic bisnis (konversi, file system, dll), berjalan di Node.js
- **Preload Script** — Jembatan aman antara renderer dan main process via `contextBridge`
- **LibreOffice** — Engine konversi, dipanggil via `child_process.spawn` dengan argumen headless

---

## 📁 Struktur File yang Harus Dibuat

```
pdfConverter/
├── docs/
│   ├── SPEC.md         ← [FILE INI]
│   └── PLAN.md
├── src/
│   ├── main/
│   │   ├── main.js         ← Electron entry point, window management, IPC handlers
│   │   ├── converter.js    ← LibreOffice CLI wrapper, conversion logic
│   │   └── compressor.js   ← PDF compression logic (menggunakan pdf-lib)
│   ├── renderer/
│   │   ├── index.html      ← Single page UI
│   │   ├── styles/
│   │   │   └── main.css    ← Dark mode design system
│   │   └── scripts/
│   │       ├── app.js      ← Main UI controller
│   │       ├── dragdrop.js ← Drag & drop file handling
│   │       └── preview.js  ← PDF.js preview integration
│   └── preload/
│       └── preload.js      ← contextBridge IPC bridge
├── assets/
│   └── icon.png            ← App icon
├── package.json
├── README.md
└── .gitignore
```

---

## 📦 Dependencies (package.json)

```json
{
  "name": "wordtopdf-converter",
  "version": "1.0.0",
  "description": "Offline Word to PDF Converter Desktop App",
  "main": "src/main/main.js",
  "scripts": {
    "dev": "electron .",
    "build": "electron-builder"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  },
  "dependencies": {
    "pdf-lib": "^1.17.1"
  }
}
```

---

## ⚙️ Spesifikasi Teknis Per File

---

### `src/main/main.js`

**Fungsi:**
- Inisialisasi BrowserWindow Electron
- Register semua IPC handlers
- Mengelola lifecycle aplikasi

**IPC Handlers yang harus ada:**

| Channel | Direction | Deskripsi |
|---|---|---|
| `convert-files` | Renderer → Main | Terima array file path, trigger konversi |
| `conversion-progress` | Main → Renderer | Update progress per file (%) |
| `conversion-complete` | Main → Renderer | Kirim path PDF hasil konversi |
| `conversion-error` | Main → Renderer | Kirim pesan error |
| `open-file-dialog` | Renderer → Main | Buka native file picker |
| `get-libreoffice-path` | Renderer → Main | Deteksi path LibreOffice otomatis |
| `compress-pdf` | Renderer → Main | Trigger kompresi PDF |

**Window Config:**
```javascript
{
  width: 1100,
  height: 720,
  minWidth: 800,
  minHeight: 600,
  titleBarStyle: 'hidden',        // Custom title bar
  backgroundColor: '#0f0f13',     // Dark background
  webPreferences: {
    preload: path.join(__dirname, '../preload/preload.js'),
    contextIsolation: true,
    nodeIntegration: false
  }
}
```

---

### `src/main/converter.js`

**Fungsi:** Wrapper untuk LibreOffice CLI

**LibreOffice CLI Command:**
```bash
soffice --headless --convert-to pdf --outdir "<output_dir>" "<input_file>"
```

**Fungsi yang harus diekspor:**
```javascript
// Deteksi path LibreOffice secara otomatis di Windows
async function detectLibreOfficePath()

// Konversi satu file
async function convertFile(inputPath, outputDir, options)

// Konversi batch (array file)
async function convertBatch(files, outputDir, options, onProgress)
```

**Options Object:**
```javascript
{
  pageSize: 'A4',          // 'A4' | 'Letter' | 'Legal' | 'A3'
  orientation: 'portrait', // 'portrait' | 'landscape'
  compress: false,         // boolean
  compressionLevel: 'medium' // 'low' | 'medium' | 'high'
}
```

**Deteksi LibreOffice (Windows):**
```javascript
const LIBREOFFICE_PATHS = [
  'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
  'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
];
```

---

### `src/main/compressor.js`

**Fungsi:** Kompres ukuran PDF menggunakan `pdf-lib`

**Strategi kompresi:**
- Low: Hanya optimasi metadata
- Medium: Optimasi + remove duplikat resource
- High: Optimasi + downsample gambar (jika ada)

---

### `src/preload/preload.js`

**Fungsi:** Expose IPC API ke renderer via `contextBridge`

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  convertFiles: (files, options) => ipcRenderer.invoke('convert-files', files, options),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  onProgress: (callback) => ipcRenderer.on('conversion-progress', callback),
  onComplete: (callback) => ipcRenderer.on('conversion-complete', callback),
  onError: (callback) => ipcRenderer.on('conversion-error', callback),
  compressPdf: (filePath, level) => ipcRenderer.invoke('compress-pdf', filePath, level),
  getLibreOfficePath: () => ipcRenderer.invoke('get-libreoffice-path'),
})
```

---

### `src/renderer/index.html`

**Layout Sections:**
1. **Header** — Logo, title, window controls (minimize, maximize, close)
2. **Sidebar** — Settings panel (page size, orientation, compression)
3. **Main Area** — Drop zone + file list
4. **Preview Panel** — PDF.js iframe preview (bisa toggle show/hide)
5. **Footer / Action Bar** — Tombol "Convert All", progress bar, output folder selector

---

### `src/renderer/styles/main.css`

**Design System (CSS Variables):**
```css
:root {
  /* Colors */
  --bg-primary: #0f0f13;
  --bg-secondary: #1a1a24;
  --bg-card: #22223a;
  --accent-primary: #6c63ff;
  --accent-secondary: #ff6584;
  --accent-glow: rgba(108, 99, 255, 0.3);
  --text-primary: #f0f0ff;
  --text-secondary: #9090b0;
  --border: rgba(255, 255, 255, 0.08);
  --success: #4ade80;
  --error: #f87171;
  --warning: #fbbf24;

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

**Komponen UI yang harus ada:**
- `.drop-zone` — Area drag & drop dengan animasi border dashed saat hover
- `.file-card` — Card tiap file dengan status indicator (waiting/converting/done/error)
- `.progress-bar` — Animated progress bar dengan gradient
- `.preview-panel` — Side panel untuk PDF preview
- `.settings-panel` — Sidebar settings dengan toggle switches
- `.btn-primary` — Tombol utama dengan glow effect
- `.badge` — Label status konversi

---

### `src/renderer/scripts/app.js`

**State Management:**
```javascript
const state = {
  files: [],          // Array of { path, name, size, status, outputPath }
  settings: {
    pageSize: 'A4',
    orientation: 'portrait',
    compress: false,
    compressionLevel: 'medium',
    outputDir: null,  // null = same as input
  },
  libreOfficePath: null,
  isConverting: false,
}
```

**Event Handlers:**
- File drop / file picker → `addFiles()`
- Convert button → `startConversion()`
- Settings change → `updateSettings()`
- Preview click → `openPreview(filePath)`
- Remove file → `removeFile(index)`

---

### `src/renderer/scripts/dragdrop.js`

**Implementasi:**
- Listen `dragenter`, `dragover`, `dragleave`, `drop` pada `.drop-zone`
- Filter hanya file dengan ekstensi: `.docx`, `.doc`, `.pptx`, `.ppt`, `.xlsx`, `.xls`
- Tampilkan visual feedback saat file di-hover (animasi pulse, border glow)
- Tampilkan error jika format tidak didukung

---

### `src/renderer/scripts/preview.js`

**Implementasi:**
- Gunakan **PDF.js** dari CDN: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
- Render halaman pertama PDF sebagai preview thumbnail
- Full preview di panel samping (dengan scroll antar halaman)

---

## 🔍 Deteksi LibreOffice

Saat aplikasi pertama kali buka, lakukan:
1. Cek path default Windows
2. Jika tidak ditemukan → tampilkan modal dialog meminta user untuk set path manual
3. Simpan path di `localStorage` / `electron-store`

---

## 🎨 UI/UX Requirements

- **Loading state:** Spinner + persentase per file saat konversi berlangsung
- **Success state:** Checkmark hijau + tombol "Open File" & "Open Folder"
- **Error state:** Icon merah + pesan error yang jelas + tombol "Retry"
- **Empty state:** Ilustrasi + teks "Drop your files here" di drop zone
- **Animations:** Fade-in untuk file cards, slide-in untuk preview panel, shake untuk invalid file drop

---

## 🚫 Edge Cases yang Harus Ditangani

| Skenario | Penanganan |
|---|---|
| LibreOffice tidak ditemukan | Modal dialog dengan instruksi instalasi |
| File sudah terbuka di Word | Error message: "File sedang digunakan, tutup terlebih dahulu" |
| File corrupt / tidak valid | Error per file, file lain tetap lanjut |
| Output folder tidak ada write permission | Fallback ke Downloads folder |
| File terlalu besar (>100MB) | Warning dialog, tapi tetap lanjutkan |
| Nama file mengandung karakter spesial | Sanitasi nama file sebelum diproses |

---

## ✅ Definition of Done

Aplikasi dianggap selesai jika:
- [ ] Konversi `.docx` → PDF berhasil via LibreOffice
- [ ] Konversi `.pptx` → PDF berhasil via LibreOffice  
- [ ] Konversi `.xlsx` → PDF berhasil via LibreOffice
- [ ] Drag & drop berfungsi
- [ ] Batch conversion berfungsi
- [ ] PDF preview tampil setelah konversi
- [ ] Pengaturan page size & orientasi berfungsi
- [ ] Kompres PDF berfungsi
- [ ] Error handling semua edge case
- [ ] Aplikasi bisa di-build menjadi `.exe` via electron-builder
