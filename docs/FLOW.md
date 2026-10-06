# 🔄 FLOW.md — Alur Proses Sistem WordToPDF Converter

> Dokumen ini menggambarkan seluruh alur proses sistem dari perspektif user, sistem internal, dan agent eksekutor.

---

## 1. 🚀 Alur Startup Aplikasi

```mermaid
flowchart TD
    A([▶ User Buka Aplikasi]) --> B[Electron main.js dijalankan]
    B --> C[Buat BrowserWindow dengan config dark mode]
    C --> D[Load index.html via Renderer Process]
    D --> E[preload.js inject contextBridge API]
    E --> F{Cek LocalStorage:\nLibreOffice path?}
    F -- Ada --> G[Load path dari localStorage]
    F -- Tidak Ada --> H[detectLibreOfficePath\ncek path default Windows]
    H --> I{LibreOffice\nditemukan?}
    I -- ✅ Ya --> G
    I -- ❌ Tidak --> J[Tampilkan Modal:\nLibreOffice Not Found]
    J --> K[User input path manual]
    K --> L{Path valid?}
    L -- ✅ Valid --> M[Simpan ke localStorage]
    L -- ❌ Invalid --> J
    M --> G
    G --> N([✅ UI Siap Digunakan])
```

---

## 2. 🖱️ Alur Interaksi User

```mermaid
flowchart TD
    A([UI Siap]) --> B{User memilih\ncara input file}

    B -- Drag & Drop --> C["dragdrop.js:\ndeteksi event drop"]
    B -- Klik Browse --> D["open-file-dialog IPC\nNative file picker"]
    B -- Klik Convert All --> H

    C --> E{Validasi\nekstesi file}
    D --> E

    E -- ".docx/.doc\n.pptx/.xlsx" --> F[addFiles ke state.files]
    E -- Format tidak valid --> G[Toast error:\nFormat tidak didukung]
    G --> B

    F --> FA[Render file card\ndi UI dengan status: waiting]
    FA --> B

    H([Tombol Convert All]) --> I{state.files\ntidak kosong?}
    I -- Kosong --> J[Shake animation\npada drop zone]
    I -- Ada file --> K[startConversion]
    K --> L["Kirim IPC: convert-files\ndengan files + settings"]
    L --> M([Conversion Pipeline])
```

---

## 3. ⚙️ Alur Konversi — Conversion Pipeline

```mermaid
flowchart TD
    A(["IPC: convert-files diterima\ndi main process"]) --> B["converter.js:\nconvertBatch dipanggil"]
    B --> C[Loop setiap file\ndi antrian]

    C --> D[convertFile dipanggil\nuntuk 1 file]
    D --> E{Validasi file:\nekstesi & akses baca}
    E -- Error --> F["Kirim IPC: conversion-error\nper file"]
    F --> G{Masih ada\nfile lain?}

    E -- Valid --> H["spawn child_process:\nsoffice --headless --convert-to pdf"]
    H --> I[LibreOffice CLI\nberjalan di background]
    I --> J{Konversi\nberhasil?}

    J -- Gagal --> K[Parse stderr\nLibreOffice]
    K --> F

    J -- Sukses --> L{Setting:\ncompress aktif?}
    L -- Tidak --> M["Kirim IPC: conversion-progress 100%"]
    L -- Ya --> N["compressor.js:\ncompressPdf dipanggil"]
    N --> O[pdf-lib proses file]
    O --> M

    M --> P["Kirim IPC: conversion-complete\ndengan output path"]
    P --> G

    G -- Ada --> D
    G -- Selesai --> Q([Semua file selesai\ndiproses])
```

---

## 4. 📡 Alur IPC Communication

```mermaid
sequenceDiagram
    participant UI as Renderer UI
    participant Pre as preload.js
    participant Main as Main Process
    participant LO as LibreOffice CLI
    participant PDF as pdf-lib

    UI->>Pre: electronAPI.convertFiles(files, options)
    Pre->>Main: ipcRenderer.invoke convert-files
    Main->>Main: converter.convertBatch()

    loop Setiap file
        Main->>LO: spawn soffice --headless
        LO-->>Main: stdout/stderr + exit code
        Main->>UI: conversion-progress event
        UI-->>UI: Update progress bar & file card

        alt Compress aktif
            Main->>PDF: compressPdf(path, level)
            PDF-->>Main: compressed PDF
        end

        alt Sukses
            Main->>UI: conversion-complete event
            UI-->>UI: card status done
        else Error
            Main->>UI: conversion-error event
            UI-->>UI: card status error
        end
    end
```

---

## 5. 👁️ Alur PDF Preview

```mermaid
flowchart LR
    A(["User klik Preview\npada file card"]) --> B{outputPath\ntersedia?}
    B -- Belum dikonversi --> C["Disable preview button\nTooltip: Convert dulu"]
    B -- Ada --> D["preview.js:\nopenPreview dipanggil"]
    D --> E["PDF.js load file\nvia file:// protocol"]
    E --> F[Render halaman pertama\nsebagai thumbnail]
    F --> G[Slide-in panel preview\ndi sisi kanan UI]
    G --> H{User navigasi\nhalaman?}
    H -- Next/Prev --> I[PDF.js render\nhalaman berikutnya]
    I --> H
    H -- Tutup Panel --> J[Slide-out animation]
    J --> K([Panel tertutup])
```

---

## 6. 🚨 Alur Error Handling

```mermaid
flowchart TD
    ERR([Error Terjadi]) --> A{Jenis Error}

    A -- "LibreOffice\ntidak ditemukan" --> B["Modal: LibreOffice Not Found\nTampilkan instruksi install"]
    B --> C{User aksi}
    C -- Set path manual --> D[Validasi path baru]
    C -- Tutup modal --> E["Disable tombol Convert\nTampilkan warning banner"]

    A -- "File sedang\ndibuka di Word" --> F["File card: error\nPesan: Tutup file di Word dulu"]
    F --> G[Tombol Retry tersedia]
    G -- Klik Retry --> H[Ulangi convertFile\nuntuk file ini saja]

    A -- "File corrupt\ntidak valid" --> I["File card: error\nPesan: File tidak dapat dibaca"]

    A -- "Permission\ndenied di output folder" --> J[Fallback: ganti output\nke folder Downloads]
    J --> K[Lanjut konversi]

    A -- "File sangat\nbesar lebih 100MB" --> L[Warning dialog\nkonfirmasi lanjut?]
    L -- Ya --> K
    L -- Tidak --> M[Skip file ini]
```

---

## 7. 🤖 Alur Agent Skill Execution

```mermaid
flowchart TD
    START(["Agent dipanggil untuk\nmembangun WordToPDF Converter"]) --> R1

    subgraph READ ["📖 READ PHASE"]
        R1["Baca SKILL.md"] --> R2["Baca SPEC.md"]
        R2 --> R3["Baca PLAN.md"]
        R3 --> R4["Baca FLOW.md"]
        R4 --> R5[Pahami arsitektur,\nfile structure, dependencies]
    end

    R5 --> P0

    subgraph EXEC ["⚙️ EXECUTION PHASE"]
        P0["Fase 0: Setup\nnpm init + install deps"] --> P1
        P1["Fase 1: Foundation Electron\nmain.js + index.html"] --> P2
        P2["Fase 2: Core Logic\nconverter.js + compressor.js"] --> P3
        P3["Fase 3: Design System\nmain.css + variables"] --> P4
        P4["Fase 4: UI Components\napp.js + dragdrop.js + preview.js"] --> P5
        P5["Fase 5: Testing\njalankan semua test scenarios"] --> P6
        P6["Fase 6: Build\nnpm run build menuju .exe"]
    end

    subgraph CHECK ["✅ CHECK per Fase"]
        CK{Deliverable\ntercapai?}
        CK -- Gagal --> FIX["Debug & fix\ndokumentasi error di PLAN.md"]
        FIX --> CK
        CK -- Sukses --> NEXT["Update PLAN.md checklist\nLanjut fase berikutnya"]
    end

    P0 & P1 & P2 & P3 & P4 & P5 & P6 --> CK
    NEXT --> NEXT2{Fase\nterakhir?}
    NEXT2 -- Tidak --> EXEC
    NEXT2 -- Ya --> DONE

    DONE(["Aplikasi selesai dibangun\nInstaller .exe siap"])
```

---

## 8. 🗂️ Ringkasan Komponen Sistem

```mermaid
graph TB
    subgraph ELECTRON ["Electron App"]
        subgraph RENDERER ["Renderer Process Chromium"]
            HTML[index.html]
            CSS[main.css]
            APPJS[app.js]
            DD[dragdrop.js]
            PV[preview.js]
        end

        subgraph BRIDGE ["Preload Bridge"]
            PRE["preload.js\ncontextBridge"]
        end

        subgraph MAIN ["Main Process Node.js"]
            MJ["main.js\nIPC Handlers"]
            CV["converter.js\nLibreOffice Wrapper"]
            CP["compressor.js\npdf-lib"]
        end
    end

    subgraph EXTERNAL ["External Tools"]
        LO["LibreOffice CLI\nsoffice.exe"]
        PDFJS["PDF.js CDN\nMozilla"]
    end

    subgraph OUTPUT ["Output"]
        PDFOUT[PDF Files]
    end

    HTML --> APPJS & DD & PV
    APPJS & DD & PV --> PRE
    PRE --> MJ
    MJ --> CV & CP
    CV --> LO --> PDFOUT
    CP --> PDFOUT
    PV --> PDFJS
    CSS --> HTML
```
