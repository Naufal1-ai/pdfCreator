# 📄 WordToPDF Studio · iLovePDF Offline Suite

> Aplikasi desktop modern berbasis Electron bergaya **iLovePDF Suite** untuk mengkonversi dokumen Office ke PDF, manipulasi PDF (Merge, Split, Rotate, Watermark, Page Number, Images to PDF, dan PDF to Word) secara **100% offline** — privasi terjaga, tanpa data dikirim ke server manapun.

---

## ✨ Fitur Utama (iLovePDF Style Tools)

- 📝 **Office to PDF** — Konversi file Word (`.docx`, `.doc`), PowerPoint (`.pptx`, `.ppt`), Excel (`.xlsx`, `.xls`), CSV, dan TXT ke PDF dengan layout presisi via LibreOffice.
- 🗂️ **Merge PDF** — Gabungkan multi-file PDF menjadi satu dokumen utuh dengan urutan yang dapat diatur sesuka hati.
- ✂️ **Split PDF** — Pisahkan seluruh halaman menjadi file terpisah atau ekstrak rentang halaman kustom (misal `1-3, 5`).
- 🔄 **Rotate PDF** — Putar orientasi halaman PDF 90°, 180°, atau 270° secara permanen.
- 🛡️ **Watermark & Page Numbers** — Sematkan teks watermark diagonal transparan dan footer nomor halaman (`Halaman X dari Y`).
- 🖼️ **Images to PDF** — Konversi gambar JPG, JPEG, dan PNG menjadi satu file PDF yang rapi.
- 🔁 **PDF to Word (.docx)** — Kembalikan dokumen PDF ke file Microsoft Word (.docx) yang dapat diedit secara offline.
- 🗜️ **Kompres PDF** — Perkecil ukuran file PDF (Level Low, Medium, High).
- 👁️ **PDF Preview** — Pratinjau dokumen langsung di dalam aplikasi menggunakan engine PDF.js.
- 🔒 **100% Offline & Private** — Semua data diproses lokal di mesin Anda.

---

## 🧰 Format yang Didukung

| Kategori | Format Input | Format Output |
|---|---|---|
| Office to PDF | `.docx`, `.doc`, `.pptx`, `.ppt`, `.xlsx`, `.xls`, `.csv`, `.txt` | `.pdf` |
| Merge PDF | `.pdf` (minimal 2 file) | `.pdf` |
| Split PDF | `.pdf` | `.pdf` (satu atau banyak file) |
| Rotate PDF | `.pdf` | `.pdf` |
| Watermark PDF | `.pdf` | `.pdf` |
| Images to PDF | `.png`, `.jpg`, `.jpeg` | `.pdf` |
| PDF to Word | `.pdf` | `.docx` |

---

## 📦 Prasyarat

Sebelum menjalankan aplikasi, pastikan kamu sudah menginstall:

1. **Node.js** (v18 atau lebih baru) — [Download di nodejs.org](https://nodejs.org)
2. **LibreOffice** (versi terbaru) — [Download di libreoffice.org](https://www.libreoffice.org/download/download/)
   - Pastikan LibreOffice dapat diakses dari command line
   - Windows: Biasanya terinstall di `C:\Program Files\LibreOffice\program\soffice.exe`

---

## 🚀 Instalasi & Menjalankan

```bash
# 1. Clone atau download project ini
cd pdfConverter

# 2. Install dependencies
npm install

# 3. Jalankan aplikasi (mode development)
npm run dev

# 4. Build installer (opsional)
npm run build
```

---

## 🏗️ Struktur Proyek

```
pdfConverter/
├── docs/               # Dokumentasi & spesifikasi teknis
│   ├── SPEC.md         # Spesifikasi teknis untuk agent eksekusi
│   └── PLAN.md         # Rencana dan agenda pengerjaan
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.js     # Entry point Electron
│   │   ├── converter.js# Logic konversi via LibreOffice
│   │   └── compressor.js# Logic kompres PDF
│   ├── renderer/       # UI (HTML/CSS/JS)
│   │   ├── index.html  # Halaman utama
│   │   ├── styles/
│   │   │   └── main.css# Global styles (dark mode, dll)
│   │   └── scripts/
│   │       ├── app.js  # Logic UI utama
│   │       ├── dragdrop.js  # Drag & drop handler
│   │       └── preview.js  # PDF preview handler
│   └── preload/
│       └── preload.js  # Electron preload bridge
├── assets/             # Icons, images
├── package.json
├── README.md
└── .gitignore
```

---

## 🔧 Teknologi

| Layer | Teknologi |
|---|---|
| Framework | [Electron](https://www.electronjs.org/) |
| UI | HTML5, Vanilla CSS, JavaScript |
| Konversi | [LibreOffice](https://www.libreoffice.org/) (via CLI) |
| PDF Preview | [PDF.js](https://mozilla.github.io/pdf.js/) |
| Kompresi | Ghostscript / pdf-lib |
| Build | electron-builder |

---

## 📖 Dokumentasi

- [`docs/SPEC.md`](docs/SPEC.md) — Spesifikasi teknis lengkap
- [`docs/PLAN.md`](docs/PLAN.md) — Rencana dan agenda pengerjaan

---

## 📝 Lisensi

MIT License — bebas digunakan dan dimodifikasi.
