# 🛠️ INSTALL.md — Panduan Instalasi WordToPDF Converter

> Panduan lengkap langkah demi langkah untuk menginstal dan menjalankan WordToPDF Converter di Windows.

---

## 📋 Daftar Isi

1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Instalasi Node.js](#2-instalasi-nodejs)
3. [Instalasi LibreOffice](#3-instalasi-libreoffice)
4. [Instalasi Aplikasi](#4-instalasi-aplikasi)
5. [Verifikasi Instalasi](#5-verifikasi-instalasi)
6. [Troubleshooting Instalasi](#6-troubleshooting-instalasi)
7. [Uninstall](#7-uninstall)

---

## 1. Prasyarat Sistem

Sebelum memulai, pastikan komputer kamu memenuhi spesifikasi berikut:

| Komponen | Minimum | Rekomendasi |
|---|---|---|
| **OS** | Windows 10 (64-bit) | Windows 11 (64-bit) |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 1 GB free | 2 GB free |
| **Prosesor** | Intel Core i3 / AMD Ryzen 3 | Intel Core i5+ / AMD Ryzen 5+ |
| **Node.js** | v18.x | v20.x LTS |
| **LibreOffice** | v7.0 | v24.x (terbaru) |

> ⚠️ **Penting:** Aplikasi ini berjalan **100% offline**. Tidak perlu koneksi internet setelah instalasi selesai.

---

## 2. Instalasi Node.js

Node.js dibutuhkan untuk menjalankan framework Electron.

### Langkah-langkah:

**a) Download Node.js**
1. Buka browser dan kunjungi: **https://nodejs.org**
2. Klik tombol **"LTS"** (Long Term Support) — versi yang lebih stabil
3. Download file `.msi` untuk Windows

**b) Jalankan Installer**
1. Double-click file `.msi` yang sudah didownload
2. Klik **"Next"** → **"I accept the terms"** → **"Next"**
3. Biarkan direktori instalasi default: `C:\Program Files\nodejs\`
4. Pastikan opsi **"Add to PATH"** ✅ dicentang
5. Klik **"Install"** → tunggu hingga selesai → **"Finish"**

**c) Verifikasi**

Buka **Command Prompt** atau **PowerShell**, lalu ketik:

```powershell
node --version
# Output yang diharapkan: v20.x.x atau lebih baru

npm --version
# Output yang diharapkan: v10.x.x atau lebih baru
```

Jika muncul angka versi → ✅ Node.js berhasil terinstall.

> 💡 **Tip:** Jika command tidak dikenali setelah instalasi, coba restart Command Prompt atau restart komputer.

---

## 3. Instalasi LibreOffice

LibreOffice adalah engine konversi utama yang mengubah file Word/PowerPoint/Excel menjadi PDF.

### Langkah-langkah:

**a) Download LibreOffice**
1. Buka browser dan kunjungi: **https://www.libreoffice.org/download/download/**
2. Pilih versi terbaru (misal: `LibreOffice 24.x`)
3. Pastikan pilih **Windows (64-bit)**
4. Download file `.msi` (ukuran sekitar 300-400 MB)

**b) Jalankan Installer**
1. Double-click file `.msi`
2. Klik **"Next"** → Pilih **"Typical"** untuk instalasi standar → **"Next"**
3. Klik **"Install"** → Proses instalasi membutuhkan sekitar 5-10 menit
4. Klik **"Finish"**

**c) Verifikasi Path LibreOffice**

Setelah instalasi, cek apakah file `soffice.exe` ada di path berikut:

```
C:\Program Files\LibreOffice\program\soffice.exe
```

Cara cek lewat PowerShell:
```powershell
Test-Path "C:\Program Files\LibreOffice\program\soffice.exe"
# Output yang diharapkan: True
```

Jika output `True` → ✅ LibreOffice berhasil terinstall.

**d) Test Konversi Manual (Opsional)**

Untuk memastikan LibreOffice berfungsi, coba jalankan konversi test:

```powershell
& "C:\Program Files\LibreOffice\program\soffice.exe" --headless --version
# Output yang diharapkan: LibreOffice 24.x.x...
```

> ⚠️ **Catatan:** Tidak perlu menambahkan LibreOffice ke PATH sistem. Aplikasi akan mendeteksi path-nya secara otomatis.

---

## 4. Instalasi Aplikasi

### Opsi A: Dari Source Code (Development)

Gunakan cara ini jika kamu ingin menjalankan atau memodifikasi kode sumber.

**a) Pastikan kamu berada di folder project:**
```powershell
cd "C:\Users\Nopal\OneDrive\Documents\pdfConverter"
```

**b) Install semua dependencies:**
```powershell
npm install
```

Proses ini akan mengunduh semua library yang diperlukan ke folder `node_modules/`. Tunggu hingga selesai (sekitar 1-3 menit tergantung koneksi internet).

Output yang diharapkan:
```
added XXX packages in Xs
```

**c) Jalankan aplikasi:**
```powershell
npm run dev
```

Jendela aplikasi WordToPDF Converter akan terbuka secara otomatis.

---

### Opsi B: Build Installer `.exe` (Production)

Gunakan cara ini untuk menghasilkan installer yang bisa didistribusikan.

**a) Jalankan build:**
```powershell
npm run build
```

Proses ini membutuhkan waktu 5-15 menit.

**b) Temukan installer:**

Setelah build selesai, file installer ada di:
```
pdfConverter\dist\WordToPDF-Converter-Setup.exe
```

**c) Jalankan installer:**
1. Double-click `WordToPDF-Converter-Setup.exe`
2. Ikuti wizard instalasi
3. Aplikasi akan tersedia di Start Menu dan Desktop

---

## 5. Verifikasi Instalasi

Setelah berhasil menjalankan aplikasi, lakukan pemeriksaan berikut:

### Checklist Verifikasi:

- [ ] **Jendela aplikasi terbuka** tanpa error
- [ ] **Tidak ada modal error** "LibreOffice Not Found" saat startup
- [ ] **Drop zone terlihat** di area tengah aplikasi
- [ ] **Sidebar settings** terlihat di sisi kiri
- [ ] Coba **drag & drop** satu file `.docx` → file card muncul di list
- [ ] Klik **"Convert All"** → file berhasil dikonversi ke PDF
- [ ] PDF hasil konversi **bisa dibuka** dan isinya benar

---

## 6. Troubleshooting Instalasi

### ❌ Error: "LibreOffice Not Found"

**Penyebab:** LibreOffice tidak terinstall atau terinstall di path yang tidak standar.

**Solusi:**
1. Pastikan LibreOffice sudah terinstall
2. Saat muncul modal error, klik **"Set Path Manual"**
3. Arahkan ke lokasi `soffice.exe` di komputer kamu
4. Klik **"Save"**

Cari `soffice.exe` dengan PowerShell:
```powershell
Get-ChildItem -Path "C:\Program Files" -Recurse -Filter "soffice.exe" -ErrorAction SilentlyContinue
```

---

### ❌ Error: "npm: command not found"

**Penyebab:** Node.js belum terinstall atau tidak ada di PATH.

**Solusi:**
1. Pastikan Node.js sudah terinstall (lihat [Langkah 2](#2-instalasi-nodejs))
2. Restart Command Prompt / PowerShell
3. Jika masih error, coba restart komputer
4. Jika tetap error, reinstall Node.js dan pastikan opsi **"Add to PATH"** dicentang

---

### ❌ Error: "Cannot find module 'electron'"

**Penyebab:** `npm install` belum dijalankan atau gagal.

**Solusi:**
```powershell
# Hapus node_modules dan install ulang
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### ❌ Error: "EPERM: operation not permitted"

**Penyebab:** Tidak punya akses tulis ke folder tujuan output.

**Solusi:**
1. Jalankan aplikasi sebagai **Administrator** (klik kanan → "Run as administrator")
2. Atau ubah folder output ke lokasi yang kamu miliki aksesnya (misal: Desktop atau Documents)

---

### ❌ Aplikasi terbuka tapi layar putih / blank

**Penyebab:** Electron renderer gagal load.

**Solusi:**
```powershell
# Cek apakah ada error di console
npm run dev
# Buka DevTools dengan Ctrl+Shift+I dan lihat tab Console
```

---

### ❌ Build `.exe` gagal

**Penyebab:** `electron-builder` membutuhkan akses internet untuk download artifacts.

**Solusi:**
```powershell
# Build dengan flag eksplisit
npx electron-builder --win --x64
```

Pastikan koneksi internet stabil saat pertama kali build.

---

## 7. Uninstall

### Jika menggunakan Source Code (Development):
```powershell
# Cukup hapus folder project
Remove-Item -Recurse -Force "C:\Users\Nopal\OneDrive\Documents\pdfConverter"
```

### Jika menggunakan Installer `.exe`:
1. Buka **Settings** → **Apps** → **Installed apps**
2. Cari **"WordToPDF Converter"**
3. Klik **"Uninstall"**

### Hapus data aplikasi (opsional):
```powershell
# Hapus data yang disimpan aplikasi (path LibreOffice, dll)
Remove-Item -Recurse -Force "$env:APPDATA\wordtopdf-converter"
```

---

## 📞 Bantuan Lebih Lanjut

Jika masalah tidak teratasi dengan panduan di atas, lihat:
- [`docs/USAGE.md`](USAGE.md) — Panduan penggunaan lengkap
- [`docs/SPEC.md`](SPEC.md) — Spesifikasi teknis (untuk developer)
- [`README.md`](../README.md) — Overview proyek
