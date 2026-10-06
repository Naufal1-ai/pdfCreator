# 📖 USAGE.md — Panduan Penggunaan WordToPDF Converter

> Panduan lengkap cara menggunakan semua fitur WordToPDF Converter, dari konversi dasar hingga pengaturan lanjutan.

---

## 📋 Daftar Isi

1. [Mengenal Antarmuka](#1-mengenal-antarmuka)
2. [Menambahkan File](#2-menambahkan-file)
3. [Mengatur Konversi](#3-mengatur-konversi)
4. [Melakukan Konversi](#4-melakukan-konversi)
5. [Melihat Hasil (Preview)](#5-melihat-hasil-preview)
6. [Mengakses File Output](#6-mengakses-file-output)
7. [Fitur Lanjutan](#7-fitur-lanjutan)
8. [Tips & Trik](#8-tips--trik)
9. [Pertanyaan Umum (FAQ)](#9-pertanyaan-umum-faq)
10. [Pesan Error & Solusinya](#10-pesan-error--solusinya)

---

## 1. Mengenal Antarmuka

Saat pertama kali membuka aplikasi, kamu akan melihat tampilan berikut:

```
┌─────────────────────────────────────────────────────────────────┐
│ ● ● ●  WordToPDF Converter                                      │  ← Title Bar
├──────────────┬─────────────────────────────────┬────────────────┤
│              │                                 │                │
│  PENGATURAN  │         AREA UTAMA              │    PREVIEW     │
│              │                                 │    PDF         │
│  Ukuran      │   ┌─────────────────────────┐   │                │
│  Halaman     │   │                         │   │  (Klik file    │
│              │   │   Drop files here  ☁    │   │   untuk buka   │
│  Orientasi   │   │   .docx · .pptx · .xlsx │   │   preview)     │
│              │   │                         │   │                │
│  Kompresi    │   └─────────────────────────┘   │                │
│              │                                 │                │
│  Output Dir  │   [Daftar file akan            │                │
│              │    muncul di sini]              │                │
├──────────────┴─────────────────────────────────┴────────────────┤
│  📁 Output: Sama dengan file asli    [Convert All ▶]  [●●●●●] │  ← Footer
└─────────────────────────────────────────────────────────────────┘
```

### Penjelasan Area:

| Area | Fungsi |
|---|---|
| **Title Bar** | Judul aplikasi + tombol minimize/maximize/close |
| **Sidebar Pengaturan** | Atur ukuran halaman, orientasi, dan kompresi |
| **Area Utama** | Drop zone untuk file + daftar file yang akan dikonversi |
| **Panel Preview** | Menampilkan preview PDF hasil konversi |
| **Footer** | Pilih folder output + tombol Convert All + progress bar |

---

## 2. Menambahkan File

Ada dua cara untuk menambahkan file ke antrian konversi:

### Cara 1: Drag & Drop ⭐ (Cara Tercepat)

1. Buka File Explorer / folder yang berisi file kamu
2. Pilih satu atau beberapa file (`.docx`, `.pptx`, `.xlsx`)
3. **Seret (drag)** file tersebut ke area tengah aplikasi
4. Lepaskan (drop) — file akan langsung masuk ke daftar

**Visual feedback saat drag:**
- ✅ File valid → border area berubah warna + sedikit membesar
- ❌ File tidak valid → border berubah merah + animasi goyang

> 💡 **Tip:** Kamu bisa drag banyak file sekaligus! Tahan `Ctrl` di File Explorer untuk pilih banyak file, lalu seret semuanya ke aplikasi.

---

### Cara 2: Browse File (Tombol)

1. Klik tombol **"Browse files"** di tengah area drop zone
2. Jendela pemilih file Windows akan terbuka
3. Navigasi ke folder yang berisi file kamu
4. Pilih satu atau beberapa file (tahan `Ctrl` untuk multi-pilih)
5. Klik **"Open"**

---

### Format File yang Didukung

| Format | Ekstensi | Keterangan |
|---|---|---|
| Microsoft Word | `.docx`, `.doc` | Dokumen teks, laporan, surat |
| Microsoft PowerPoint | `.pptx`, `.ppt` | Presentasi, slide |
| Microsoft Excel | `.xlsx`, `.xls` | Tabel data, spreadsheet |

> ⚠️ **Perhatian:** Format lain seperti `.pdf`, `.jpg`, `.png` tidak didukung dan akan ditolak.

---

### Menghapus File dari Daftar

Untuk menghapus file sebelum konversi:
- Arahkan kursor ke file card yang ingin dihapus
- Klik ikon **🗑️ (trash)** yang muncul di sisi kanan card
- File dihapus dari daftar (file asli di komputer tidak terhapus)

Untuk menghapus semua file:
- Klik menu **"···"** di pojok kanan atas daftar
- Pilih **"Hapus semua file"**

---

## 3. Mengatur Konversi

Sebelum melakukan konversi, atur preferensi di **Sidebar Pengaturan** (sisi kiri).

### 3.1 Ukuran Halaman

Klik dropdown **"Ukuran Halaman"** dan pilih:

| Pilihan | Ukuran | Penggunaan Umum |
|---|---|---|
| **A4** ✅ (default) | 210 × 297 mm | Dokumen standar, laporan, surat |
| **Letter** | 216 × 279 mm | Dokumen format Amerika |
| **Legal** | 216 × 356 mm | Dokumen hukum |
| **A3** | 297 × 420 mm | Poster, diagram besar |

> 💡 **Catatan:** Jika dokumen Word kamu sudah diatur ke ukuran tertentu, LibreOffice biasanya akan mengikuti ukuran aslinya. Setting ini lebih berpengaruh saat dokumen tidak memiliki ukuran yang terdefinisi.

---

### 3.2 Orientasi Halaman

Pilih orientasi output PDF:

| Pilihan | Tampilan | Cocok Untuk |
|---|---|---|
| **Portrait** ✅ (default) | Vertikal (↕) | Dokumen teks, laporan |
| **Landscape** | Horizontal (↔) | Tabel lebar, presentasi, grafik |

---

### 3.3 Kompresi PDF

Aktifkan toggle **"Kompres PDF"** jika kamu ingin memperkecil ukuran file output.

**Level kompresi:**

| Level | Pengurangan Ukuran | Kualitas | Waktu Proses |
|---|---|---|---|
| **Rendah** | ~10–20% | Hampir sama | Cepat |
| **Sedang** ✅ (default) | ~30–50% | Sedikit berkurang | Normal |
| **Tinggi** | ~50–70% | Berkurang (terutama gambar) | Lebih lama |

> ⚠️ **Perhatian:** Kompresi tinggi dapat menurunkan kualitas gambar di dalam dokumen. Gunakan level Sedang untuk keseimbangan terbaik.

---

### 3.4 Folder Output

Secara default, file PDF disimpan di **folder yang sama** dengan file aslinya.

Untuk mengubah folder output:
1. Klik tombol **"📁"** di footer bawah
2. Pilih folder tujuan dari dialog Windows
3. Semua hasil konversi akan masuk ke folder tersebut

---

## 4. Melakukan Konversi

### Konversi Semua File

1. Pastikan sudah menambahkan file ke daftar
2. Atur pengaturan sesuai kebutuhan (opsional)
3. Klik tombol **"Convert All ▶"** di footer kanan bawah
4. Tunggu proses selesai

**Yang terjadi selama konversi:**
- Setiap file card menampilkan **progress bar berjalan**
- Status badge berubah dari `WAITING` → `CONVERTING` → `DONE` (atau `ERROR`)
- Footer menampilkan progress keseluruhan (misal: `2 / 5 files`)

### Memahami Status File

| Status | Warna | Arti |
|---|---|---|
| `WAITING` | 🟣 Ungu | File dalam antrian, belum diproses |
| `CONVERTING` | 🔵 Biru | Sedang diproses oleh LibreOffice |
| `DONE` | 🟢 Hijau | Konversi berhasil, PDF siap |
| `ERROR` | 🔴 Merah | Konversi gagal, lihat pesan error |
| `WARNING` | 🟡 Kuning | Berhasil tapi ada peringatan (misal: file besar) |

### Membatalkan Konversi

Untuk membatalkan proses yang sedang berjalan:
- Klik tombol **"Stop"** yang muncul menggantikan tombol "Convert All" saat proses berjalan
- File yang sudah selesai tetap tersimpan
- File yang sedang diproses akan dilewati

---

## 5. Melihat Hasil (Preview)

Setelah konversi selesai, kamu bisa preview PDF langsung di dalam aplikasi.

### Cara membuka preview:

1. Pastikan status file sudah **`DONE`** (hijau)
2. Klik ikon **👁️ (preview)** di file card
3. Panel preview akan muncul dari sisi kanan

### Navigasi di panel preview:

| Aksi | Cara |
|---|---|
| Halaman berikutnya | Klik tombol **"→"** atau tekan tombol `→` |
| Halaman sebelumnya | Klik tombol **"←"** atau tekan tombol `←` |
| Ke halaman tertentu | Klik nomor halaman → ketik nomor → Enter |
| Tutup preview | Klik tombol **"✕"** atau tekan `Esc` |

---

## 6. Mengakses File Output

### Buka file PDF langsung:
- Klik tombol **"Open File"** yang muncul di file card setelah `DONE`
- PDF akan terbuka di aplikasi PDF default komputer kamu (misal: Acrobat Reader, Edge)

### Buka folder berisi PDF:
- Klik tombol **"Open Folder"** di file card
- File Explorer akan terbuka dan langsung menunjukkan lokasi file PDF

### Lokasi default file output:
File PDF disimpan di folder yang **sama** dengan file aslinya, dengan nama yang sama tapi ekstensi `.pdf`.

Contoh:
```
Input:  C:\Users\Nopal\Documents\Laporan.docx
Output: C:\Users\Nopal\Documents\Laporan.pdf
```

---

## 7. Fitur Lanjutan

### 7.1 Batch Conversion (Banyak File Sekaligus)

1. Tambahkan semua file sekaligus (drag banyak file / Ctrl+klik saat browse)
2. Atur pengaturan sekali — berlaku untuk **semua** file
3. Klik "Convert All" — semua file diproses berurutan
4. Monitor progress masing-masing file secara individual

> 💡 **Tip:** Tidak ada batasan jumlah file. Namun untuk file dalam jumlah sangat banyak (>50 file), disarankan dibagi per batch agar lebih mudah dipantau.

---

### 7.2 Retry File yang Gagal

Jika ada file yang gagal (`ERROR`):
1. Kamu tidak perlu mengkonversi ulang semua file
2. Perbaiki penyebab error terlebih dahulu (tutup file di Word, dll)
3. Klik tombol **"Retry"** di file card yang error
4. Hanya file itu saja yang akan diproses ulang

---

### 7.3 Konversi Ulang (Re-convert)

Jika ingin mengkonversi ulang file yang sudah `DONE` (misal: setelah mengubah settings):
1. Klik menu **"···"** di file card
2. Pilih **"Convert Again"**
3. File akan diproses ulang dengan settings saat ini

---

## 8. Tips & Trik

### ⚡ Untuk Kecepatan Terbaik
- Tutup file yang akan dikonversi dari Microsoft Word/PowerPoint/Excel sebelum mengkonversi
- Gunakan SSD — konversi LibreOffice jauh lebih cepat di SSD dibanding HDD
- Jangan buka terlalu banyak aplikasi berat saat konversi berlangsung

### 🎯 Untuk Kualitas Terbaik
- Gunakan format `.docx` (bukan `.doc` lama) untuk hasil terbaik
- Embed semua font di dokumen Word sebelum konversi (*File → Options → Save → Embed fonts*)
- Hindari menggunakan font yang tidak umum / belum terinstall di komputer

### 📦 Untuk Ukuran File Terkecil
- Aktifkan kompresi level "Sedang" atau "Tinggi"
- Kompres gambar di dokumen Word sebelum konversi (*Format Picture → Compress Pictures*)
- Simpan gambar di Word dengan resolusi 150-200 DPI, bukan 300+ DPI

### 🔄 Untuk Workflow Efisien
- Gunakan fitur "Set Output Folder" agar semua PDF otomatis tersimpan di satu tempat
- Drag file langsung dari email/browser ke aplikasi tanpa perlu save dulu
- Gunakan shortcut `Ctrl+A` di File Explorer untuk select semua file, lalu drag sekaligus

---

## 9. Pertanyaan Umum (FAQ)

**Q: Apakah data saya dikirim ke internet?**
> A: **Tidak.** Semua konversi dilakukan 100% di komputer lokal kamu menggunakan LibreOffice. Tidak ada data yang dikirim ke server manapun.

**Q: Berapa lama proses konversi untuk satu file?**
> A: Bergantung pada ukuran file dan spesifikasi komputer. Rata-rata:
> - File kecil (<1 MB): 2-5 detik
> - File sedang (1-10 MB): 5-15 detik
> - File besar (>10 MB): 15-60 detik

**Q: Apakah format dan layout dokumen terjaga?**
> A: Ya, dengan catatan:
> - Font yang terinstall di komputer → layout sempurna
> - Font khusus yang tidak terinstall → diganti font alternatif (bisa sedikit berbeda)
> - Tabel, gambar, header/footer → terjaga dengan baik
> - Makro VBA, form interaktif → tidak dikonversi (wajar)

**Q: Bisa konversi file yang dilindungi password?**
> A: Tidak. File yang diproteksi password tidak bisa dikonversi. Hapus perlindungan di Microsoft Office terlebih dahulu.

**Q: Kenapa gambar di PDF terlihat buram?**
> A: Kemungkinan kompresi aktif di level "Tinggi". Coba kurangi level kompresi ke "Rendah" atau matikan kompresi sama sekali.

**Q: Apakah bisa konversi file `.odt` (LibreOffice format)?**
> A: Tidak didukung di versi ini. Hanya format Microsoft Office yang didukung.

**Q: Apakah hasil PDF bisa di-edit?**
> A: Hasil konversi adalah PDF standar. Bisa diedit dengan Acrobat Pro atau tools PDF editor lainnya.

---

## 10. Pesan Error & Solusinya

| Pesan Error | Penyebab | Solusi |
|---|---|---|
| `LibreOffice not found` | LibreOffice belum terinstall | Install LibreOffice dari [libreoffice.org](https://libreoffice.org) |
| `File is locked by another process` | File sedang dibuka di Word/Excel | Tutup file tersebut dari Microsoft Office, lalu retry |
| `Permission denied` | Tidak ada akses tulis ke folder output | Ganti folder output ke lokasi lain (misal Desktop) |
| `File is corrupted or invalid` | File rusak atau bukan format Office | Coba buka file di Microsoft Office dulu, save ulang, lalu konversi |
| `Conversion timeout` | File terlalu besar atau sistem terlalu lambat | Tunggu beberapa saat lalu coba retry, atau tutup aplikasi lain |
| `Out of memory` | RAM tidak cukup untuk proses file besar | Tutup aplikasi lain, atau konversi file secara satu per satu |

---

## 📞 Bantuan Lebih Lanjut

Jika kamu menemui masalah yang tidak ada di panduan ini:
- Lihat [`docs/INSTALL.md`](INSTALL.md) untuk masalah instalasi
- Lihat [`README.md`](../README.md) untuk informasi umum proyek
- Buka **DevTools** (Ctrl+Shift+I) untuk melihat log error teknis
