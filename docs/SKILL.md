---
name: wordtopdf-converter-builder
description: >
  Membangun aplikasi desktop WordToPDF Converter berbasis Electron secara
  otomatis dari awal hingga selesai. Agent membaca SPEC.md dan PLAN.md,
  kemudian mengeksekusi setiap fase pembangunan secara terstruktur.
  Gunakan skill ini ketika user meminta untuk memulai pembangunan,
  melanjutkan fase tertentu, atau memperbaiki bagian yang gagal.
triggers:
  - "mulai eksekusi"
  - "lanjut eksekusi"
  - "bangun aplikasinya"
  - "lanjut fase"
  - "build the app"
---

# 🤖 SKILL: WordToPDF Converter Builder

Skill ini memandu agent AI untuk membangun aplikasi **WordToPDF Converter**
berbasis Electron secara otomatis dari nol hingga menghasilkan installer `.exe`.

---

## 📋 Langkah Wajib Sebelum Mulai

Agent **HARUS** membaca file berikut secara berurutan sebelum menulis kode apapun:

1. **Baca [`docs/AGENT.md`](AGENT.md)** — aturan & konteks agent (baca PERTAMA SEKALI)
2. **Baca file ini (SKILL.md)** — pahami alur eksekusi
3. **Baca [`docs/SPEC.md`](SPEC.md)** — spesifikasi teknis lengkap (arsitektur, struktur file, API)
4. **Baca [`docs/PLAN.md`](PLAN.md)** — rencana 6 fase dengan checklist
5. **Baca [`docs/FLOW.md`](FLOW.md)** — diagram alur proses sistem
6. **Baca [`docs/DESIGN.md`](DESIGN.md)** — panduan desain WAJIB sebelum Fase 3 & 4

---

## 🏗️ Ringkasan Proyek

| Aspek | Detail |
|---|---|
| **Platform** | Desktop — Windows |
| **Framework** | Electron (JavaScript) |
| **UI** | HTML + Vanilla CSS (dark mode, animasi) |
| **Engine Konversi** | LibreOffice CLI (`soffice --headless`) |
| **Format Input** | `.docx`, `.doc`, `.pptx`, `.ppt`, `.xlsx`, `.xls` |
| **Format Output** | `.pdf` |
| **Fitur Utama** | Drag & drop, batch conversion, preview, compress, page settings |
| **Privasi** | 100% offline, tidak ada data dikirim ke server |

---

## 📁 Root Directory

```
c:\Users\Nopal\OneDrive\Documents\pdfConverter\
```

---

## ⚙️ Alur Eksekusi Agent

Agent harus mengikuti alur ini **secara ketat dan berurutan**:

### FASE 0 — Setup & Persiapan
```
1. Verifikasi Node.js terinstall
2. Verifikasi LibreOffice terinstall
3. Jalankan: npm init -y
4. Jalankan: npm install --save-dev electron electron-builder
5. Jalankan: npm install pdf-lib
6. Buat struktur folder sesuai SPEC.md
7. Buat .gitignore
8. Update checklist PLAN.md
```

### FASE 1 — Foundation Electron
```
1. Buat src/main/main.js
   - BrowserWindow config (lihat SPEC.md § main.js)
   - Lifecycle management (app.whenReady, window-all-closed)
2. Buat src/preload/preload.js (kosong, hanya contextBridge stub)
3. Buat src/renderer/index.html (skeleton HTML)
4. Update package.json: "main": "src/main/main.js", "scripts.dev": "electron ."
5. TEST: npm run dev → window harus terbuka
6. Update checklist PLAN.md
```

### FASE 2 — Core Logic Konversi
```
1. Buat src/main/converter.js
   - detectLibreOfficePath()
   - convertFile(inputPath, outputDir, options)
   - convertBatch(files, outputDir, options, onProgress)
2. Buat src/main/compressor.js
   - compressPdf(inputPath, outputPath, level)
3. Tambahkan IPC handlers di main.js:
   - convert-files
   - open-file-dialog
   - get-libreoffice-path
   - compress-pdf
4. TEST: panggil converter dari DevTools console
5. Update checklist PLAN.md
```

### FASE 3 — UI Design System
```
1. Buat src/renderer/styles/main.css
   - CSS Variables (lihat SPEC.md § main.css)
   - Reset & base styles
   - Layout grid
   - Semua komponen UI (btn, badge, progress-bar, dll)
   - Animasi & micro-interactions
2. Link CSS di index.html
3. Review visual di app yang berjalan
4. Update checklist PLAN.md
```

### FASE 4 — UI Components & Interaksi
```
1. Lengkapi src/renderer/index.html (semua sections)
2. Buat src/renderer/scripts/dragdrop.js
3. Buat src/renderer/scripts/preview.js (PDF.js integration)
4. Buat src/renderer/scripts/app.js (state management + event handlers)
5. Lengkapi src/preload/preload.js (semua API di contextBridge)
6. Implementasi modal LibreOffice Not Found
7. TEST: drag & drop, convert, preview, settings
8. Update checklist PLAN.md
```

### FASE 5 — Integrasi & Testing
```
1. Jalankan semua 12 test scenarios dari PLAN.md
2. Fix semua bug yang ditemukan
3. Pastikan tidak ada console error
4. Test resize window
5. Update checklist PLAN.md
```

### FASE 6 — Polish & Build
```
1. Tambahkan app icon di assets/icon.png
2. Konfigurasi electron-builder di package.json
3. Jalankan: npm run build
4. Verifikasi installer .exe di folder dist/
5. Update checklist PLAN.md
6. Update README.md dengan instruksi final
```

---

## ✅ Aturan Penting untuk Agent

### DO ✅
- Baca SPEC.md dan PLAN.md SEBELUM menulis kode apapun
- Ikuti urutan fase dengan ketat
- Update checklist di PLAN.md setelah setiap task selesai (`[ ]` → `[x]`)
- Test deliverable setiap fase sebelum lanjut
- Gunakan path absolut untuk semua file operations
- Dokumentasikan error di PLAN.md sebelum mencoba fix

### DON'T ❌
- Jangan skip fase atau mengerjakan secara paralel
- Jangan hardcode path LibreOffice — gunakan `detectLibreOfficePath()`
- Jangan gunakan `nodeIntegration: true` — selalu lewat `contextBridge`
- Jangan gunakan framework CSS (Tailwind, Bootstrap) — hanya Vanilla CSS
- Jangan kirim data file ke server eksternal manapun

---

## 🔧 Perintah Berguna

```bash
# Jalankan app (development)
npm run dev

# Build installer
npm run build

# Cek versi Node
node --version

# Cek LibreOffice terinstall
"C:\Program Files\LibreOffice\program\soffice.exe" --version
```

---

## 🚨 Troubleshooting Umum

| Problem | Solusi |
|---|---|
| `soffice` not found | Cek path di SPEC.md § Deteksi LibreOffice, atau minta user input manual |
| Electron window tidak muncul | Cek `package.json` field `main`, pastikan path ke `main.js` benar |
| IPC tidak berfungsi | Pastikan `contextIsolation: true` dan gunakan `contextBridge` |
| PDF output kosong | LibreOffice mungkin gagal diam-diam — cek `stderr` dari `child_process` |
| Build gagal | Pastikan `icon.png` ada di `assets/`, jalankan `npm run build -- --win` |

---

## 📚 Referensi Dokumen

| Dokumen | Path | Fungsi |
|---|---|---|
| **AGENT.md** | `docs/AGENT.md` | **Aturan & konteks agent — baca pertama** |
| SKILL.md | `docs/SKILL.md` | Panduan eksekusi agent (file ini) |
| SPEC.md | `docs/SPEC.md` | Spesifikasi teknis lengkap |
| PLAN.md | `docs/PLAN.md` | Rencana & checklist per fase |
| FLOW.md | `docs/FLOW.md` | Diagram alur proses sistem |
| DESIGN.md | `docs/DESIGN.md` | Panduan desain — warna, font, komponen, animasi |
| INSTALL.md | `docs/INSTALL.md` | Panduan instalasi untuk user |
| USAGE.md | `docs/USAGE.md` | Panduan penggunaan lengkap untuk user |
| README.md | `README.md` | Dokumentasi user-facing |
