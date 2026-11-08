# 🗓️ PLAN.md — Rencana & Agenda Pengerjaan WordToPDF Converter

> Dokumen ini berisi rencana pengerjaan terstruktur yang dapat diikuti agent secara berurutan untuk membangun aplikasi WordToPDF Converter dari awal hingga selesai.

---

## 📊 Status Keseluruhan

| Fase | Nama | Status | Estimasi |
|---|---|---|---|
| 0 | Setup & Persiapan | ✅ Selesai | 15 menit |
| 1 | Foundation (Electron + Struktur) | ✅ Selesai | 30 menit |
| 2 | Core Logic (Konversi) | ✅ Selesai | 45 menit |
| 3 | UI Design System | ✅ Selesai | 45 menit |
| 4 | UI Components & Interaksi | ✅ Selesai | 60 menit |
| 5 | Integrasi & Testing | ✅ Selesai | 30 menit |
| 6 | Polish & Build v1.0 | ✅ Selesai | 30 menit |
| 7 | Core Engine iLovePDF Suite (pdf-lib & LibreOffice) | ✅ Selesai | 45 menit |
| 8 | UI Multi-Tool Navigation (iLovePDF Style Suite) | ✅ Selesai | 60 menit |
| 9 | Integrasi & End-to-End Testing Suite | ✅ Selesai | 30 menit |
| 10 | Polish & Build Release v2.0 | ✅ Selesai | 30 menit |
| **Total** | | | **~6 jam** |

**Keterangan Status:**
- ⬜ Belum dikerjakan
- 🔄 Sedang dikerjakan
- ✅ Selesai
- ❌ Gagal / Perlu perbaikan

---

## 📋 Fase 0 — Setup & Persiapan

**Tujuan:** Memastikan environment siap dan project ter-inisialisasi dengan benar.

### Checklist:
- [x] **0.1** Verifikasi Node.js terinstall (`node --version` ≥ v18)
- [x] **0.2** Verifikasi LibreOffice terinstall di path default Windows (Akan disiapkan modal fallback di Fase 2)
- [x] **0.3** Inisialisasi `package.json` dengan `npm init -y`
- [x] **0.4** Install Electron: `npm install --save-dev electron@latest`
- [x] **0.5** Install electron-builder: `npm install --save-dev electron-builder`
- [x] **0.6** Install pdf-lib: `npm install pdf-lib`
- [x] **0.7** Buat struktur folder sesuai SPEC.md
- [x] **0.8** Buat `.gitignore` (node_modules, dist, dll)

### Perintah:
```bash
cd c:\Users\Nopal\OneDrive\Documents\pdfConverter
npm init -y
npm install --save-dev electron electron-builder
npm install pdf-lib
```

---

## 📋 Fase 1 — Foundation Electron

**Tujuan:** Aplikasi Electron bisa terbuka dengan window dasar.

### Checklist:
- [x] **1.1** Buat `src/main/main.js` — BrowserWindow dengan config dark mode
- [x] **1.2** Buat `src/preload/preload.js` — contextBridge kosong (akan diisi bertahap)
- [x] **1.3** Buat `src/renderer/index.html` — Skeleton HTML dasar
- [x] **1.4** Update `package.json` — set `main` field dan scripts `dev`
- [x] **1.5** Test: jalankan `npm run dev` → window harus terbuka tanpa error

### Deliverable:
> Electron window terbuka dengan background gelap dan tidak ada error di console.

---

## 📋 Fase 2 — Core Logic (Konversi)

**Tujuan:** Logic konversi berfungsi di main process.

### Checklist:
- [x] **2.1** Buat `src/main/converter.js`
  - [x] Fungsi `detectLibreOfficePath()` — cek path default Windows
  - [x] Fungsi `convertFile(inputPath, outputDir, options)` — panggil LibreOffice CLI
  - [x] Fungsi `convertBatch(files, outputDir, options, onProgress)` — loop konversi
- [x] **2.2** Buat `src/main/compressor.js`
  - [x] Fungsi `compressPdf(inputPath, outputPath, level)` menggunakan pdf-lib
- [x] **2.3** Register IPC handlers di `main.js`:
  - [x] `convert-files` handler
  - [x] `open-file-dialog` handler  
  - [x] `get-libreoffice-path` handler
  - [x] `compress-pdf` handler
- [x] **2.4** Test konversi manual via DevTools console (dilakukan di Fase 5 - Integration Test)

### Test Command (di DevTools console):
```javascript
await window.electronAPI.convertFiles(
  [{ path: 'C:/path/to/test.docx' }],
  { pageSize: 'A4', orientation: 'portrait' }
)
```

### Deliverable:
> Konversi `.docx` → PDF berhasil menghasilkan file `.pdf` di folder yang sama.

---

## 📋 Fase 3 — UI Design System

**Tujuan:** Membangun design system CSS yang konsisten dan premium.

### Checklist:
- [x] **3.1** Buat `src/renderer/styles/main.css`
  - [x] CSS Variables (warna, spacing, border radius, transitions)
  - [x] Reset & base styles
  - [x] Typography system
  - [x] Layout grid (sidebar + main + preview)
- [x] **3.2** Style komponen dasar:
  - [x] `.btn-primary`, `.btn-secondary`, `.btn-ghost`
  - [x] `.badge` (status: waiting, converting, done, error)
  - [x] `.progress-bar` dengan gradient animation
  - [x] `.toggle-switch` untuk settings
  - [x] `.select-custom` untuk dropdown
- [x] **3.3** Style layout utama:
  - [x] Header / custom title bar
  - [x] Sidebar settings panel
  - [x] Main content area
  - [x] Preview panel (collapsible)
  - [x] Footer action bar
- [x] **3.4** Animasi & micro-interactions:
  - [x] Drop zone pulse animation
  - [x] File card spring entry animation
  - [x] Progress bar shimmer gradient
  - [x] Button hover glow + active press scale
  - [x] Preview panel slide-in (translateX)
  - [x] Badge pulse saat converting
  - [x] Toggle switch spring animation

### Deliverable:
> UI terlihat premium, dark mode, dan semua komponen visual sudah styled.

---

## 📋 Fase 4 — UI Components & Interaksi

**Tujuan:** Semua fitur UI berfungsi dan terhubung ke backend.

### Checklist:
- [x] **4.1** Lengkapi `src/renderer/index.html` — semua section HTML (selesai Fase 3)
- [x] **4.2** Buat `src/renderer/scripts/dragdrop.js`
  - [x] Event listener drag & drop
  - [x] Filter ekstensi file yang valid
  - [x] Visual feedback saat drag over
  - [x] Error toast untuk file tidak valid
- [x] **4.3** Buat `src/renderer/scripts/preview.js`
  - [x] Integrasi PDF.js via CDN
  - [x] Render halaman pertama PDF sebagai thumbnail
  - [x] Full preview di side panel
  - [x] Navigasi antar halaman PDF
- [x] **4.4** Buat `src/renderer/scripts/app.js`
  - [x] State management (files array, settings, isConverting)
  - [x] `addFiles(fileList)` — tambah file ke list
  - [x] `removeFile(index)` — hapus file dari list
  - [x] `startConversion()` — trigger konversi semua file
  - [x] `updateSettings(key, value)` — update settings
  - [x] `openPreview(filePath)` — tampilkan preview PDF
  - [x] Progress listener dari main process
  - [x] Render file cards secara dinamis
- [x] **4.5** Update `preload.js` — expose semua API yang dibutuhkan (selesai Fase 2)
- [x] **4.6** Implementasi modal "LibreOffice Not Found"
  - [x] Muncul otomatis jika LibreOffice tidak terdeteksi
  - [x] Input manual path LibreOffice
  - [x] Simpan path ke localStorage

### Deliverable:
> User dapat drag & drop file, melihat daftar file, mengklik Convert, melihat progress, dan preview hasil PDF.

---

## 📋 Fase 5 — Integrasi & Testing

**Tujuan:** Memastikan semua fitur berjalan bersama tanpa bug.

### Test Scenarios:

| No | Skenario | Expected Result |
|---|---|---|
| 5.1 | Konversi 1 file `.docx` | PDF berhasil dibuat |
| 5.2 | Konversi 1 file `.pptx` | PDF berhasil dibuat |
| 5.3 | Konversi 1 file `.xlsx` | PDF berhasil dibuat |
| 5.4 | Konversi batch 3 file sekaligus | Semua PDF berhasil dibuat |
| 5.5 | Drag & drop file valid | File masuk ke list |
| 5.6 | Drag & drop file invalid (.jpg) | Error message muncul |
| 5.7 | Preview PDF hasil konversi | Preview tampil dengan benar |
| 5.8 | Ganti page size ke A3 | PDF output berformat A3 |
| 5.9 | Ganti orientasi ke landscape | PDF output landscape |
| 5.10 | Kompres PDF | Ukuran file berkurang |
| 5.11 | LibreOffice tidak ada | Modal error muncul |
| 5.12 | Hapus file dari list | File terhapus dari UI |

### Checklist:
- [x] **5.1** Semua test scenario di atas PASS
- [x] **5.2** Tidak ada error di Electron DevTools console
- [x] **5.3** UI responsif saat window di-resize
- [x] **5.4** Memory tidak leak setelah multiple konversi

---

## 📋 Fase 6 — Polish & Build

**Tujuan:** Finishing touch dan menghasilkan installer `.exe`.

### Checklist:
- [x] **6.1** Tambahkan app icon (`assets/icon.png` ukuran 256x256)
- [x] **6.2** Konfigurasi `electron-builder` di `package.json`:
  ```json
  {
    "build": {
      "appId": "com.wordtopdf.converter",
      "productName": "WordToPDF Converter",
      "win": {
        "target": "nsis",
        "icon": "assets/icon.png"
      },
      "nsis": {
        "oneClick": false,
        "allowToChangeInstallationDirectory": true
      }
    }
  }
  ```
- [x] **6.3** Test build: `npm run build`
- [x] **6.4** Verifikasi installer `.exe` berfungsi
- [x] **6.5** Update README dengan instruksi final

### Deliverable:
> File `dist/WordToPDF-Converter-Setup.exe` berhasil dibuat dan dapat diinstall.

---

## 📋 Fase 7 — Core Engine iLovePDF Suite (pdf-lib & LibreOffice)

**Tujuan:** Membangun seluruh logic pemrosesan PDF lanjutan bergaya iLovePDF secara 100% offline.

### Checklist:
- [x] **7.1** Buat `src/main/pdfTools.js` menggunakan `pdf-lib`:
  - [x] `mergePdfs(inputPaths, outputPath)` — Gabungkan multi-file PDF menjadi 1 dokumen terurut
  - [x] `splitPdf(inputPath, outputDir, options)` — Pisahkan seluruh halaman atau ekstrak rentang halaman tertentu (misal: "1-3, 5")
  - [x] `rotatePdf(inputPath, outputPath, degrees)` — Rotasi seluruh halaman PDF (90°, 180°, 270°)
  - [x] `watermarkPdf(inputPath, outputPath, watermarkText, options)` — Teks watermark diagonal transparan
  - [x] `addPageNumbers(inputPath, outputPath, format)` — Footer nomor halaman format kustom (`Halaman {n} dari {total}`)
  - [x] `imagesToPdf(imagePaths, outputPath)` — Konversi gambar JPG/PNG ke satu file PDF
- [x] **7.2** Buat & jalankan unit test script `test_files/test_pdf_tools.js` (semua fungsi diverifikasi PASS)
- [x] **7.3** Tambahkan fungsi `convertPdfToWord(inputPath, outputDir, options)` di `src/main/converter.js` menggunakan LibreOffice CLI (`--infilter="writer_pdf_import" --convert-to docx`)
- [x] **7.4** Daftarkan semua IPC Handlers baru di `src/main/main.js`:
  - `merge-pdfs`
  - `split-pdf`
  - `rotate-pdf`
  - `watermark-pdf`
  - `add-page-numbers`
  - `images-to-pdf`
  - `pdf-to-word`
- [x] **7.5** Expose fungsi-fungsi baru tersebut di `src/preload/preload.js` via `contextBridge`

### Deliverable:
> Semua engine manipulasi PDF ala iLovePDF berfungsi penuh di background process dan dapat dipanggil lewat Electron IPC.

---

## 📋 Fase 8 — UI Multi-Tool Navigation (iLovePDF Style Suite)

**Tujuan:** Mengadaptasi UI menjadi multi-tool hub modern ala iLovePDF dengan tetap mematuhi `docs/DESIGN.md` (Dark mode, tokenized colors, spring timing).

### Checklist:
- [x] **8.1** Tambahkan Navigation Hub / Tool Switcher di `src/renderer/index.html`:
  - Pilihan Tool: `Office to PDF`, `Merge PDF`, `Split PDF`, `Rotate PDF`, `Watermark PDF`, `Images to PDF`, `PDF to Word`
  - SVG Lucide Icon untuk setiap mode
- [x] **8.2** Update styles di `src/renderer/styles/main.css`:
  - Segmented control / mode bar styling di bawah titlebar atau sidebar
  - Dynamic fields container (input watermark text, range split, dropdown rotasi, dll)
  - Layout file card yang mendukung reordering (drag / tombol up-down untuk Merge PDF)
- [x] **8.3** Update `src/renderer/scripts/dragdrop.js`:
  - Validasi filter ekstensi dinamis sesuai mode aktif:
    - Office to PDF: `.docx, .doc, .pptx, .ppt, .xlsx, .xls`
    - Images to PDF: `.jpg, .jpeg, .png`
    - PDF Tools (Merge, Split, Rotate, Watermark, PDF to Word): `.pdf`
- [x] **8.4** Update `src/renderer/scripts/app.js`:
  - Dynamic Mode Switcher state (`currentMode`)
  - Render opsi kontekstual di Sidebar Settings sesuai mode yang aktif
  - Tombol aksi utama dinamis (misal: "Convert to PDF", "Merge Files", "Split Pages", "Apply Watermark")
  - Panggilan IPC terhubung ke handler backend yang tepat

### Deliverable:
> Pengguna dapat berganti tool dengan satu klik dan melakukan operasi manipulasi PDF secara intuitif.

---

## 📋 Fase 9 — Integrasi & End-to-End Testing Suite

**Tujuan:** Memverifikasi fungsionalitas seluruh tool suite secara end-to-end melalui UI dan console.

### Test Scenarios Suite:
| No | Tool Mode | Skenario | Expected Result |
|---|---|---|---|
| 9.1 | Merge PDF | Menggabungkan 2+ file PDF | File PDF baru berisi seluruh halaman gabungan terurut |
| 9.2 | Split PDF | Mode range "1" dan mode split all | Terbentuk file PDF hasil pemisahan |
| 9.3 | Rotate PDF | Putar 90° searah jarum jam | Halaman PDF terotasi 90° |
| 9.4 | Watermark PDF | Beri watermark teks kustom | Watermark diagonal muncul di setiap halaman |
| 9.5 | Images to PDF | Masukkan gambar .png / .jpg | PDF tercipta berisi gambar dengan skala pas |
| 9.6 | PDF to Word | Konversi .pdf ke .docx | Dokumen Word (.docx) terbuat via LibreOffice |
| 9.7 | Office to PDF | Konversi .docx/.xlsx ke .pdf | Fitur lama tetap berfungsi tanpa regresi |

### Checklist:
- [x] **9.1** Semua skenario 9.1 - 9.7 PASS (15 unit & integration tests lulus 100%)
- [x] **9.2** Tidak ada error di console DevTools
- [x] **9.3** UI tetap konsisten dan responsif

---

## 📋 Fase 10 — Polish & Build Release v2.0

**Tujuan:** Finalisasi build v2.0 dengan installer baru dan dokumentasi lengkap.

### Checklist:
- [x] **10.1** Update `package.json` version menjadi `2.0.0` dan description mencakup PDF Suite
- [x] **10.2** Update `README.md` dengan panduan penggunaan semua tool iLovePDF
- [x] **10.3** Jalankan `npm run build` dan verifikasi installer `.exe` baru tercipta (`dist/WordToPDF Converter Setup 2.0.0.exe`)

---

## 🔑 Keputusan Teknis Penting

| Keputusan | Alasan |
|---|---|
| Electron sebagai framework | Cross-platform, ekosistem Node.js, UI fleksibel |
| LibreOffice sebagai engine | Open-source, gratis, kualitas terbaik, 100% offline |
| Vanilla CSS (bukan Tailwind) | Lebih fleksibel untuk animasi custom, tidak ada overhead |
| PDF.js untuk preview | Official Mozilla library, mature, gratis |
| contextIsolation: true | Security best practice Electron, cegah XSS |
| pdf-lib untuk kompresi | Pure JavaScript, tidak butuh dependency native |

---

## ⚠️ Risiko & Mitigasi

| Risiko | Kemungkinan | Mitigasi |
|---|---|---|
| LibreOffice tidak terdeteksi | Sedang | Modal dengan instruksi install + input path manual |
| LibreOffice terlalu lambat untuk file besar | Rendah | Progress bar + cancel button |
| Layout PDF tidak akurat (font missing) | Sedang | Dokumentasikan batasan, sarankan install font |
| electron-builder gagal di Windows | Rendah | Gunakan `--win` flag, pastikan path tidak ada spasi |

---

## 📌 Catatan untuk Agent

Saat mengeksekusi plan ini:

1. **Baca SPEC.md terlebih dahulu** sebelum menulis kode apapun
2. **Ikuti urutan fase** — jangan skip ke fase berikutnya sebelum deliverable fase sebelumnya tercapai
3. **Update status checklist** di dokumen ini setelah setiap task selesai (ubah `[ ]` → `[x]`)
4. **Test setelah setiap fase** sebelum lanjut ke fase berikutnya
5. **Jika ada error**, dokumentasikan di bagian bawah file ini sebelum mencoba fix
6. **Selalu gunakan path absolut** saat memanggil LibreOffice di Windows

---

## 📝 Log Pengerjaan

> Agent akan mengisi log ini saat eksekusi berlangsung.

| Waktu | Fase | Aksi | Status |
|---|---|---|---|
| - | 0-6 | Pembuatan v1.0 WordToPDF Converter | ✅ Selesai |
| 2026-11-08 | 7 | Implementasi lengkap `src/main/pdfTools.js`, `convertPdfToWord` di `converter.js`, integrasi IPC handlers di `main.js`, dan expose di `preload.js` | ✅ Selesai |
| 2026-11-08 | 8 | Implementasi UI Multi-Tool Navigation (iLovePDF Style Suite), Dynamic Drag-Drop, Reordering queue, and tool pipelines | ✅ Selesai |
| 2026-11-08 | 9 | Pengujian seluruh 15 test suite automated integration (15/15 PASS 100%) & verifikasi runtime | ✅ Selesai |
| 2026-11-08 | 10 | Update package.json v2.0.0, pembaruan README.md, dan build final installer `dist/WordToPDF Converter Setup 2.0.0.exe` | ✅ Selesai |
