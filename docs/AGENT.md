# 🤖 AGENT.md — Panduan untuk AI Coding Agent

> Dokumen ini adalah instruksi utama untuk AI coding agent yang bekerja di proyek ini.
> **Baca file ini PERTAMA sebelum menyentuh kode atau dokumen apapun.**
>
> Template ini didesain untuk proyek Electron desktop app dan dapat diadaptasi ke proyek sejenis.

---

## 🧭 Siapa Kamu & Apa Tugasmu

Kamu adalah AI coding agent yang ditugaskan membangun, memelihara, atau mengembangkan
aplikasi **WordToPDF Converter** — sebuah desktop app berbasis Electron yang mengkonversi
file Office ke PDF secara offline menggunakan LibreOffice sebagai engine.

Tugasmu adalah **mengeksekusi instruksi dengan presisi** berdasarkan dokumentasi yang
telah tersedia, bukan berimprovisasi atau membuat keputusan desain sendiri.

---

## 📚 Urutan Membaca Dokumen (WAJIB)

Sebelum menulis satu baris kode pun, baca dokumen berikut **secara berurutan**:

```
1. docs/AGENT.md   ← File ini — konteks & aturan
2. docs/SKILL.md   ← Alur eksekusi per fase
3. docs/SPEC.md    ← Spesifikasi teknis (arsitektur, API, file structure)
4. docs/PLAN.md    ← Agenda & checklist pengerjaan
5. docs/FLOW.md    ← Diagram alur sistem (baca saat butuh referensi visual)
6. docs/DESIGN.md  ← Panduan desain (WAJIB sebelum Fase 3 & 4)
```

Dokumen referensi user (tidak perlu dibaca agent kecuali diminta):
```
docs/INSTALL.md  ← Panduan instalasi untuk user
docs/USAGE.md    ← Panduan penggunaan untuk user
README.md        ← Overview proyek
```

> ⚠️ Jangan skip urutan ini. Setiap dokumen dibangun di atas dokumen sebelumnya.

---

## 🏗️ Konteks Proyek

### Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Nama Proyek** | WordToPDF Converter |
| **Framework** | Electron (Node.js + Chromium) |
| **Entry Point** | `src/main/main.js` |
| **UI Layer** | HTML + Vanilla CSS (Dark Mode) |
| **Engine Konversi** | LibreOffice CLI (`soffice --headless`) |
| **Kompres PDF** | `pdf-lib` (pure JS) |
| **PDF Preview** | PDF.js (CDN) |
| **Build Tool** | electron-builder |
| **Platform Target** | Windows (x64) |
| **Mode** | 100% Offline — tidak ada network request saat runtime |

### Struktur Folder

```
pdfConverter/                   ← ROOT PROJECT
├── docs/                       ← Semua dokumentasi (JANGAN ubah tanpa izin)
│   ├── AGENT.md                ← File ini
│   ├── SKILL.md                ← Panduan eksekusi agent
│   ├── SPEC.md                 ← Spesifikasi teknis
│   ├── PLAN.md                 ← Rencana & checklist
│   ├── FLOW.md                 ← Diagram alur
│   ├── DESIGN.md               ← Panduan desain
│   ├── INSTALL.md              ← Panduan instalasi
│   └── USAGE.md                ← Panduan penggunaan
├── src/
│   ├── main/
│   │   ├── main.js             ← Electron main process, IPC handlers
│   │   ├── converter.js        ← LibreOffice wrapper
│   │   └── compressor.js       ← PDF compression (pdf-lib)
│   ├── renderer/
│   │   ├── index.html          ← Single-page UI
│   │   ├── styles/
│   │   │   └── main.css        ← Semua styles (ikuti DESIGN.md)
│   │   └── scripts/
│   │       ├── app.js          ← State management & UI controller
│   │       ├── dragdrop.js     ← Drag & drop handler
│   │       └── preview.js      ← PDF.js integration
│   └── preload/
│       └── preload.js          ← contextBridge IPC bridge
├── assets/
│   └── icon.png                ← App icon (256×256)
├── package.json                ← Dependencies & scripts
├── README.md
└── .gitignore
```

---

## ⚙️ Perintah Penting

Gunakan perintah-perintah berikut saat bekerja di proyek ini:

```powershell
# Jalankan aplikasi (development mode)
npm run dev

# Build installer .exe
npm run build

# Install semua dependencies
npm install

# Tambah dependency baru (lihat aturan — PERLU KONFIRMASI)
npm install <package-name>

# Cek versi Node.js
node --version

# Cek apakah LibreOffice terinstall
Test-Path "C:\Program Files\LibreOffice\program\soffice.exe"

# Git workflow
git status
git add <files>
git commit -m "type: pesan commit"
git push
```

### Format Commit Message

Gunakan format **Conventional Commits**:

```
feat: menambahkan fitur baru
fix: memperbaiki bug
docs: perubahan dokumentasi saja
style: perubahan CSS/formatting (bukan logic)
refactor: refactor kode tanpa perubahan fitur
test: menambah/mengubah test
chore: update dependency, konfigurasi build
```

Contoh:
```
feat: implementasi drag & drop dengan spring animation
fix: perbaiki path LibreOffice tidak terdeteksi di Windows 11
docs: update PLAN.md checklist Fase 2
```

---

## ✅ Aturan WAJIB (Dilarang Dilanggar)

### 1. 🔒 Jangan Ubah Folder `docs/` Tanpa Izin Eksplisit

Folder `docs/` adalah sumber kebenaran tunggal proyek. Kamu **tidak boleh**:
- Menghapus atau mengganti nama file dokumentasi
- Mengubah konten dokumentasi kecuali diminta secara eksplisit oleh user
- Menambah file baru di `docs/` tanpa konfirmasi

**Pengecualian:** Update checklist di `PLAN.md` (`[ ]` → `[x]`) diizinkan setelah task selesai.

---

### 2. 🧪 Selalu Test Sebelum Commit

Sebelum melakukan `git commit`, **wajib** menjalankan:

```powershell
npm run dev
```

Dan memverifikasi:
- Aplikasi terbuka tanpa error
- Tidak ada error merah di Electron DevTools console (Ctrl+Shift+I)
- Fitur yang baru diimplementasikan berfungsi sesuai ekspektasi

Jika ada error → **perbaiki dulu, baru commit**.

---

### 3. 📋 Update PLAN.md Setelah Setiap Task Selesai

Setiap kali menyelesaikan satu item checklist di `PLAN.md`, update statusnya:

```markdown
# Sebelum:
- [ ] 2.1 Buat src/main/converter.js

# Setelah selesai:
- [x] 2.1 Buat src/main/converter.js
```

Juga update **Log Pengerjaan** di bagian bawah `PLAN.md` dengan timestamp dan aksi.

---

### 4. 📦 Konfirmasi Sebelum Install Dependency Baru

Sebelum menjalankan `npm install <package>`, kamu **harus**:
1. Jelaskan ke user: package apa, fungsinya apa, mengapa dibutuhkan
2. Tunjukkan alternatif yang sudah ada (apakah bisa pakai yang sudah terinstall?)
3. Tunggu konfirmasi eksplisit dari user
4. Baru jalankan install

**Dependencies yang sudah diizinkan (tidak perlu konfirmasi lagi):**
- `electron` — framework utama
- `electron-builder` — build tool
- `pdf-lib` — kompresi PDF

---

### 5. ❓ Tanya Dulu Jika Ada Ambiguitas

Jika ada instruksi yang tidak jelas, **jangan assume sendiri**. Hentikan pekerjaan dan tanyakan:

> Contoh pertanyaan yang baik:
> - "Di SPEC.md disebutkan kompresi level 'high' menggunakan downsample gambar — apakah ada target DPI tertentu?"
> - "Apakah tombol 'Convert Again' harus ada di versi pertama atau bisa ditambah di iterasi berikutnya?"

Hal yang boleh diasumsikan sendiri (tidak perlu tanya):
- Indentasi kode (gunakan 2 spasi)
- Nama variabel yang deskriptif
- Penambahan komentar kode untuk fungsi kompleks
- Urutan CSS properties

---

## 🚫 Anti-Patterns — Hal yang Dilarang

### Kode

| ❌ Dilarang | ✅ Harus Dilakukan |
|---|---|
| `nodeIntegration: true` di BrowserWindow | Selalu `contextIsolation: true` + preload |
| Hardcode path LibreOffice | Gunakan `detectLibreOfficePath()` |
| `require()` di renderer process | Semua akses Node.js lewat `contextBridge` |
| Inline CSS di HTML (`style="..."`) | Selalu gunakan class dari `main.css` |
| Warna hardcode di CSS (`#ff0000`) | Selalu gunakan CSS variable (`var(--color-...)`) |
| `console.log` yang tertinggal di production | Hapus semua debug log sebelum commit |
| `setTimeout` untuk timing animasi | Gunakan CSS transition/animation + event listener |
| Blocking operation di main process | Gunakan `async/await` + `spawn` bukan `spawnSync` |
| `eval()` atau `innerHTML` dengan user input | Sanitasi input, gunakan `textContent` |

### Desain

| ❌ Dilarang | ✅ Harus Dilakukan |
|---|---|
| Background murni `#000000` | Gunakan `var(--color-canvas)` = `#07080a` |
| Shadow tebal sebagai depth indicator | Gunakan border tipis + surface ladder |
| Warna aksen seragam untuk semua status | Setiap status punya warna sendiri (lihat DESIGN.md) |
| Animasi `ease-in-out` generik | Gunakan spring timing `linear()` dari DESIGN.md |
| Font selain Inter | Inter adalah satu-satunya font yang diizinkan |
| Komponen dari library UI eksternal | Hanya Vanilla CSS + Lucide Icons |

---

## 🔁 Alur Kerja Per Sesi

Setiap kali kamu mulai sesi kerja baru di proyek ini, ikuti alur ini:

```
START
  │
  ▼
1. Baca AGENT.md (file ini) — refresh konteks
  │
  ▼
2. Baca PLAN.md — lihat fase mana yang aktif & task mana yang pending
  │
  ▼
3. Tentukan task berikutnya dari checklist
  │
  ▼
4. Baca dokumen relevan (SPEC / DESIGN / FLOW) jika diperlukan
  │
  ▼
5. Implementasi task
  │
  ▼
6. Test: npm run dev → pastikan tidak ada error
  │
  ▼
7. Update checklist PLAN.md → [ ] menjadi [x]
  │
  ▼
8. git add + git commit (format Conventional Commits)
  │
  ▼
9. Lanjut ke task berikutnya ATAU laporkan progres ke user
  │
  ▼
END (atau loop kembali ke langkah 3)
```

---

## 💬 Format Komunikasi Agent

Saat melaporkan progres atau bertanya ke user, gunakan format berikut:

### Laporan Progres

```
✅ SELESAI: [nama task]
   File yang dibuat/diubah: [daftar file]
   Test status: [pass/fail + keterangan]
   Next: [task berikutnya]
```

### Laporan Error

```
❌ ERROR ditemukan saat: [langkah yang gagal]
   Pesan error: [error message]
   Penyebab: [analisis singkat]
   Solusi yang dicoba: [apa yang sudah dicoba]
   Butuh keputusan: [pertanyaan spesifik ke user, jika ada]
```

### Pertanyaan Klarifikasi

```
❓ KLARIFIKASI DIPERLUKAN
   Konteks: [mengapa perlu klarifikasi]
   Opsi A: [deskripsi] → Dampak: [apa yang terjadi]
   Opsi B: [deskripsi] → Dampak: [apa yang terjadi]
   Rekomendasi saya: [Opsi A/B] karena [alasan]
```

---

## 🔧 Adaptasi untuk Proyek Electron Lain

> Bagian ini untuk developer yang ingin menggunakan AGENT.md ini sebagai template.

Jika kamu menggunakan template ini untuk proyek Electron lain, sesuaikan bagian berikut:

1. **Konteks Proyek** — ganti nama proyek, engine, dan platform target
2. **Struktur Folder** — sesuaikan dengan struktur proyek baru
3. **Perintah Penting** — sesuaikan `npm run dev`, `npm run build`, dll
4. **Dependencies yang sudah diizinkan** — update sesuai project
5. **Urutan Membaca Dokumen** — tambah/hapus sesuai docs yang ada

Bagian yang bersifat **universal** dan biasanya tidak perlu diubah:
- Format commit message (Conventional Commits)
- Alur kerja per sesi
- Format komunikasi agent
- Aturan test sebelum commit
- Aturan konfirmasi install dependency

---

## 📌 Quick Reference

```
Project Root : c:\Users\Nopal\OneDrive\Documents\pdfConverter
Dev Command  : npm run dev
Build Command: npm run build
Main Entry   : src/main/main.js
UI Entry     : src/renderer/index.html
Styles       : src/renderer/styles/main.css
IPC Bridge   : src/preload/preload.js
Converter    : src/main/converter.js
LibreOffice  : C:\Program Files\LibreOffice\program\soffice.exe
Git Remote   : https://github.com/Naufal1-ai/pdfCreator.git
Git Branch   : main
```
