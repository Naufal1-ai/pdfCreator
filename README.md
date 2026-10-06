# 📄 WordToPDF Converter

> Aplikasi desktop modern berbasis Electron untuk mengkonversi file Word, PowerPoint, dan Excel ke PDF secara offline — privasi terjaga, tanpa data dikirim ke server manapun.

---

## ✨ Fitur Utama

- 🖱️ **Drag & Drop** — Seret file langsung ke aplikasi
- 📦 **Batch Conversion** — Konversi banyak file sekaligus
- 👁️ **Preview PDF** — Lihat hasil sebelum disimpan
- 📐 **Pengaturan Halaman** — Pilih ukuran (A4, Letter, dll) dan orientasi (portrait/landscape)
- 🗜️ **Kompres PDF** — Kurangi ukuran file output
- 🔒 **100% Offline** — Semua proses berjalan lokal di komputer kamu
- 🌙 **Dark Mode** — Tampilan modern dan profesional

---

## 🧰 Format yang Didukung

| Format Input | Ekstensi |
|---|---|
| Microsoft Word | `.docx`, `.doc` |
| Microsoft PowerPoint | `.pptx`, `.pptx` |
| Microsoft Excel | `.xlsx`, `.xls` |

**Output:** `.pdf`

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
