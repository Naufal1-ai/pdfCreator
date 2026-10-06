# 🗓️ PLAN.md — Rencana & Agenda Pengerjaan WordToPDF Converter

> Dokumen ini berisi rencana pengerjaan terstruktur yang dapat diikuti agent secara berurutan untuk membangun aplikasi WordToPDF Converter dari awal hingga selesai.

---

## 📊 Status Keseluruhan

| Fase | Nama | Status | Estimasi |
|---|---|---|---|
| 0 | Setup & Persiapan | ✅ Selesai | 15 menit |
| 1 | Foundation (Electron + Struktur) | ✅ Selesai | 30 menit |
| 2 | Core Logic (Konversi) | ⬜ Belum | 45 menit |
| 3 | UI Design System | ⬜ Belum | 45 menit |
| 4 | UI Components & Interaksi | ⬜ Belum | 60 menit |
| 5 | Integrasi & Testing | ⬜ Belum | 30 menit |
| 6 | Polish & Build | ⬜ Belum | 30 menit |
| **Total** | | | **~3.5 jam** |

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
- [ ] **0.2** Verifikasi LibreOffice terinstall di path default Windows (Akan disiapkan modal fallback di Fase 2)
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
- [ ] **2.1** Buat `src/main/converter.js`
  - [ ] Fungsi `detectLibreOfficePath()` — cek path default Windows
  - [ ] Fungsi `convertFile(inputPath, outputDir, options)` — panggil LibreOffice CLI
  - [ ] Fungsi `convertBatch(files, outputDir, options, onProgress)` — loop konversi
- [ ] **2.2** Buat `src/main/compressor.js`
  - [ ] Fungsi `compressPdf(inputPath, outputPath, level)` menggunakan pdf-lib
- [ ] **2.3** Register IPC handlers di `main.js`:
  - [ ] `convert-files` handler
  - [ ] `open-file-dialog` handler  
  - [ ] `get-libreoffice-path` handler
  - [ ] `compress-pdf` handler
- [ ] **2.4** Test konversi manual via DevTools console

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
- [ ] **3.1** Buat `src/renderer/styles/main.css`
  - [ ] CSS Variables (warna, spacing, border radius, transitions)
  - [ ] Reset & base styles
  - [ ] Typography system
  - [ ] Layout grid (sidebar + main + preview)
- [ ] **3.2** Style komponen dasar:
  - [ ] `.btn-primary`, `.btn-secondary`, `.btn-ghost`
  - [ ] `.badge` (status: waiting, converting, done, error)
  - [ ] `.progress-bar` dengan gradient animation
  - [ ] `.card` dengan glassmorphism effect
  - [ ] `.toggle-switch` untuk settings
  - [ ] `.select-custom` untuk dropdown
- [ ] **3.3** Style layout utama:
  - [ ] Header / custom title bar
  - [ ] Sidebar settings panel
  - [ ] Main content area
  - [ ] Preview panel (collapsible)
  - [ ] Footer action bar
- [ ] **3.4** Animasi & micro-interactions:
  - [ ] Drop zone pulse animation
  - [ ] File card fade-in
  - [ ] Progress bar shimmer
  - [ ] Button hover glow
  - [ ] Preview panel slide-in

### Deliverable:
> UI terlihat premium, dark mode, dan semua komponen visual sudah styled.

---

## 📋 Fase 4 — UI Components & Interaksi

**Tujuan:** Semua fitur UI berfungsi dan terhubung ke backend.

### Checklist:
- [ ] **4.1** Lengkapi `src/renderer/index.html` — semua section HTML
- [ ] **4.2** Buat `src/renderer/scripts/dragdrop.js`
  - [ ] Event listener drag & drop
  - [ ] Filter ekstensi file yang valid
  - [ ] Visual feedback saat drag over
  - [ ] Error toast untuk file tidak valid
- [ ] **4.3** Buat `src/renderer/scripts/preview.js`
  - [ ] Integrasi PDF.js via CDN
  - [ ] Render halaman pertama PDF sebagai thumbnail
  - [ ] Full preview di side panel
  - [ ] Navigasi antar halaman PDF
- [ ] **4.4** Buat `src/renderer/scripts/app.js`
  - [ ] State management (files array, settings, isConverting)
  - [ ] `addFiles(fileList)` — tambah file ke list
  - [ ] `removeFile(index)` — hapus file dari list
  - [ ] `startConversion()` — trigger konversi semua file
  - [ ] `updateSettings(key, value)` — update settings
  - [ ] `openPreview(filePath)` — tampilkan preview PDF
  - [ ] Progress listener dari main process
  - [ ] Render file cards secara dinamis
- [ ] **4.5** Update `preload.js` — expose semua API yang dibutuhkan
- [ ] **4.6** Implementasi modal "LibreOffice Not Found"
  - [ ] Muncul otomatis jika LibreOffice tidak terdeteksi
  - [ ] Input manual path LibreOffice
  - [ ] Simpan path ke localStorage

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
- [ ] **5.1** Semua test scenario di atas PASS
- [ ] **5.2** Tidak ada error di Electron DevTools console
- [ ] **5.3** UI responsif saat window di-resize
- [ ] **5.4** Memory tidak leak setelah multiple konversi

---

## 📋 Fase 6 — Polish & Build

**Tujuan:** Finishing touch dan menghasilkan installer `.exe`.

### Checklist:
- [ ] **6.1** Tambahkan app icon (`assets/icon.png` ukuran 256x256)
- [ ] **6.2** Konfigurasi `electron-builder` di `package.json`:
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
- [ ] **6.3** Test build: `npm run build`
- [ ] **6.4** Verifikasi installer `.exe` berfungsi
- [ ] **6.5** Update README dengan instruksi final

### Deliverable:
> File `dist/WordToPDF-Converter-Setup.exe` berhasil dibuat dan dapat diinstall.

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
| - | - | Dokumen dibuat | ✅ |
