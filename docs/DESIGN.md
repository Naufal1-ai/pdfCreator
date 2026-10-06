# 🎨 DESIGN.md — Panduan Desain WordToPDF Converter

> Panduan desain ini adalah sumber kebenaran tunggal (single source of truth) untuk tampilan dan feel aplikasi. Agent dan developer WAJIB mengikuti panduan ini saat menulis CSS dan HTML.

**Referensi Utama:** Raycast Design System — *fast, simple, delightful*
**Filosofi:** Bukan dark mode biasa — ini adalah *dark canvas* di mana setiap elemen berbicara lewat tipografi dan ruang, bukan dekorasi.

---

## 📚 Dokumen Terkait

| Dokumen | Fungsi |
|---|---|
| [`SKILL.md`](SKILL.md) | Panduan eksekusi agent |
| [`SPEC.md`](SPEC.md) | Spesifikasi teknis lengkap |
| [`PLAN.md`](PLAN.md) | Rencana 6 fase & checklist |
| [`FLOW.md`](FLOW.md) | Diagram alur proses sistem |
| [`DESIGN.md`](DESIGN.md) | Panduan desain (file ini) |

---

## 1. 🧭 Filosofi Desain

### Tiga Prinsip Utama

```
FAST        → Setiap pixel harus mendukung kecepatan kerja user
FOCUSED     → Tidak ada elemen dekoratif yang tidak punya fungsi
HONEST      → Status dan feedback harus jelas, tidak ambigu
```

### Apa yang TIDAK boleh dilakukan (Anti-patterns)

| ❌ Hindari | ✅ Lakukan sebagai gantinya |
|---|---|
| Background murni hitam `#000000` | Gunakan near-black dengan tint biru gelap |
| Gradient warna-warni sebagai hiasan | Gradient hanya untuk progress bar & status |
| Shadow tebal seperti card Material | Border tipis 1px sebagai penanda batas |
| Warna aksen seragam di seluruh UI | Warna berbeda per status (lihat Status Colors) |
| Animasi `ease-in-out` generik | Spring animation dengan `linear()` |
| Toast notification yang pop tiba-tiba | Inline feedback langsung di file card |
| Font size < 12px untuk label | Minimum 12px, selalu gunakan Inter |

---

## 2. 🎨 Color System

### Background — Surface Ladder

Sistem kedalaman menggunakan "tangga permukaan" — makin dekat ke user, makin terang sedikit. **Tidak ada shadow tebal**, kedalaman ditentukan oleh warna saja.

```css
:root {
  /* === BACKGROUNDS (Surface Ladder) === */
  --color-canvas:           #07080a;  /* Layer paling bawah — jendela utama */
  --color-surface:          #0e0f12;  /* Sidebar, panel sekunder */
  --color-surface-elevated: #141519;  /* Card, dropdown, modal */
  --color-surface-overlay:  #1c1d23;  /* Hover state pada card */
  --color-hairline:         #242728;  /* Border / divider */
  --color-hairline-subtle:  rgba(255, 255, 255, 0.06); /* Border sangat tipis */
```

> **Kenapa tidak hitam pekat?**
> `#07080a` adalah near-black dengan tint biru gelap — mengurangi eye strain, memberikan feel "obsidian" yang premium dibanding `#000000` yang terasa murah.

---

### Text — Ink Scale

```css
  /* === TEXT (Ink Scale) === */
  --color-ink-primary:   #f4f4f6;  /* Heading, label utama */
  --color-ink-secondary: #9c9c9e;  /* Sublabel, metadata, timestamp */
  --color-ink-muted:     #5a5a5d;  /* Placeholder, disabled text */
  --color-ink-inverse:   #07080a;  /* Text di atas background terang */
```

---

### Status Colors — Per State

Status warna harus **konsisten di seluruh aplikasi**. Satu file card yang menampilkan status "converting" harus menggunakan warna yang persis sama dengan progress bar dan badge.

```css
  /* === STATUS COLORS === */

  /* WAITING — File sudah ditambahkan, belum diproses */
  --color-status-waiting:        #5a5a8a;  /* Ungu muted, pasif */
  --color-status-waiting-bg:     rgba(90, 90, 138, 0.10);
  --color-status-waiting-border: rgba(90, 90, 138, 0.25);

  /* CONVERTING — Sedang diproses LibreOffice */
  --color-status-converting:        #57c1ff;  /* Biru elektrik — dari Raycast */
  --color-status-converting-bg:     rgba(87, 193, 255, 0.08);
  --color-status-converting-border: rgba(87, 193, 255, 0.20);

  /* DONE — Konversi berhasil */
  --color-status-done:        #59d499;  /* Hijau mint — dari Raycast */
  --color-status-done-bg:     rgba(89, 212, 153, 0.08);
  --color-status-done-border: rgba(89, 212, 153, 0.20);

  /* ERROR — Konversi gagal */
  --color-status-error:        #ff6363;  /* Raycast Red — signature color */
  --color-status-error-bg:     rgba(255, 99, 99, 0.08);
  --color-status-error-border: rgba(255, 99, 99, 0.20);

  /* WARNING — File besar, ada peringatan */
  --color-status-warning:        #ffc533;  /* Amber — dari Raycast */
  --color-status-warning-bg:     rgba(255, 197, 51, 0.08);
  --color-status-warning-border: rgba(255, 197, 51, 0.20);
```

---

### Accent Color

```css
  /* === ACCENT (Signature) === */
  --color-accent:       #ff6363;  /* Raycast Red — untuk CTA utama & brand */
  --color-accent-hover: #ff4a4a;
  --color-accent-dim:   rgba(255, 99, 99, 0.15);
}
```

> **Mengapa merah?** Raycast menggunakan merah sebagai signature accent-nya karena berani dan tidak generik. Di dark background yang sangat gelap, merah ini justru terasa hangat dan premium — bukan agresif.

---

## 3. 📐 Typography System

**Font:** Inter (Google Fonts) — dengan OpenType feature `ss03` aktif untuk karakter yang lebih refined.

```css
/* Import di <head> index.html */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* === FONT FAMILY === */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'GeistMono', 'Fira Code', 'Cascadia Code', monospace;

  /* === TYPE SCALE === */
  --text-xs:   11px;   /* Badge label, metadata kecil */
  --text-sm:   12px;   /* Secondary label, caption */
  --text-base: 13px;   /* Body text default (compact desktop) */
  --text-md:   14px;   /* File name, item label */
  --text-lg:   16px;   /* Section heading */
  --text-xl:   20px;   /* Panel title */
  --text-2xl:  28px;   /* Empty state heading */
  --text-3xl:  40px;   /* Hero / onboarding */

  /* === FONT WEIGHT === */
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semibold: 600;
  --weight-bold:    700;

  /* === LETTER SPACING (Raycast signature) === */
  --tracking-tight:  -0.02em;  /* Heading besar */
  --tracking-normal:  0em;
  --tracking-wide:    0.02em;  /* Body text — "airy" feel khas Raycast */
  --tracking-wider:   0.04em;  /* ALL CAPS label, badge */

  /* === LINE HEIGHT === */
  --leading-tight:  1.2;  /* Heading */
  --leading-snug:   1.4;  /* Subheading */
  --leading-normal: 1.5;  /* Body */
  --leading-loose:  1.75; /* Paragraf panjang */
}
```

### Contoh Penggunaan Typography

```css
/* Heading halaman */
.heading-page {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-ink-primary);
}

/* Nama file di file card */
.file-name {
  font-size: var(--text-md);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  color: var(--color-ink-primary);
}

/* Metadata (ukuran file, timestamp) */
.file-meta {
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
  letter-spacing: var(--tracking-wide);
  color: var(--color-ink-secondary);
}

/* Badge / status label */
.badge-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}
```

---

## 4. 📏 Spacing & Layout

```css
:root {
  /* === SPACING SCALE === */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* === BORDER RADIUS === */
  --radius-xs:   4px;   /* Input, badge */
  --radius-sm:   6px;   /* Button kecil */
  --radius-md:   8px;   /* Card, panel */
  --radius-lg:   12px;  /* Modal, drop zone */
  --radius-xl:   16px;  /* Panel besar */
  --radius-full: 9999px; /* Pill badge, toggle */

  /* === LAYOUT === */
  --sidebar-width:  240px;
  --preview-width:  320px;
  --header-height:  48px;
  --footer-height:  64px;
}
```

### Grid Layout Aplikasi

```
┌─────────────────────────────────────────────────────┐
│  HEADER (48px) — Logo | Title | Window Controls     │
├──────────────┬──────────────────────┬───────────────┤
│              │                      │               │
│   SIDEBAR    │     MAIN AREA        │   PREVIEW     │
│   (240px)    │   (flex: 1)          │   (320px)     │
│              │                      │               │
│  Settings:   │  Drop Zone /         │  PDF.js       │
│  - Page size │  File List           │  Preview      │
│  - Orient.   │                      │               │
│  - Compress  │                      │  (toggle-able)│
│              │                      │               │
├──────────────┴──────────────────────┴───────────────┤
│  FOOTER (64px) — Output dir | Convert All | Progress│
└─────────────────────────────────────────────────────┘
```

---

## 5. 🧩 Component Specifications

### 5.1 Drop Zone

```css
.drop-zone {
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  min-height: 240px;
  padding: var(--space-8);

  /* Visual */
  background: var(--color-surface);
  border: 1.5px dashed var(--color-hairline);
  border-radius: var(--radius-lg);

  /* Transition (spring feel) */
  transition: border-color 0.2s, background 0.2s,
              transform 0.3s linear(0, 0.5, 1.05, 0.95, 1);
}

/* State: file di-hover di atasnya */
.drop-zone.drag-over {
  border-color: var(--color-accent);
  background: var(--color-accent-dim);
  transform: scale(1.01);
  /* Animated dashed border */
  animation: border-march 0.5s linear infinite;
}

/* State: file tidak valid */
.drop-zone.drag-invalid {
  border-color: var(--color-status-error);
  background: var(--color-status-error-bg);
  animation: shake 0.3s ease;
}

@keyframes border-march {
  to { stroke-dashoffset: -20; } /* Via SVG border trick */
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
```

**Empty State Content:**
- Icon: Upload cloud (SVG, stroke only, 32px, `--color-ink-muted`)
- Heading: `"Drop your files here"` — `--text-lg`, `--weight-semibold`, `--color-ink-primary`
- Sub: `".docx · .pptx · .xlsx"` — `--text-sm`, `--color-ink-muted`, `--tracking-wide`
- Button: `"Browse files"` — ghost style

---

### 5.2 File Card

Setiap file ditampilkan sebagai card horizontal dengan status indicator di kiri.

```
┌─────────────────────────────────────────────────────┐
│ ▌ [icon] filename.docx          [badge]  [••• menu] │
│   ▌ 245 KB · Word Document                 [──────] │
│   ▌                              progress bar       │
└─────────────────────────────────────────────────────┘
  ↑
  Status strip (3px wide, warna sesuai status)
```

```css
.file-card {
  display: grid;
  grid-template-columns: 3px 32px 1fr auto auto;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-hairline-subtle);
  border-radius: var(--radius-md);

  /* Spring entry animation */
  animation: card-enter 0.4s linear(0, 0.3, 1.05, 0.98, 1) both;
}

.file-card:hover {
  background: var(--color-surface-overlay);
  border-color: var(--color-hairline);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Status strip (kiri card) */
.file-card__strip {
  width: 3px;
  height: 100%;
  border-radius: var(--radius-full);
  align-self: stretch;
}
.file-card[data-status="waiting"]    .file-card__strip { background: var(--color-status-waiting); }
.file-card[data-status="converting"] .file-card__strip { background: var(--color-status-converting); }
.file-card[data-status="done"]       .file-card__strip { background: var(--color-status-done); }
.file-card[data-status="error"]      .file-card__strip { background: var(--color-status-error); }
```

---

### 5.3 Badge / Status Label

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-xs);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.badge--waiting {
  color: var(--color-status-waiting);
  background: var(--color-status-waiting-bg);
  border: 1px solid var(--color-status-waiting-border);
}
.badge--converting {
  color: var(--color-status-converting);
  background: var(--color-status-converting-bg);
  border: 1px solid var(--color-status-converting-border);
  /* Pulse animation saat converting */
  animation: badge-pulse 1.5s ease-in-out infinite;
}
.badge--done {
  color: var(--color-status-done);
  background: var(--color-status-done-bg);
  border: 1px solid var(--color-status-done-border);
}
.badge--error {
  color: var(--color-status-error);
  background: var(--color-status-error-bg);
  border: 1px solid var(--color-status-error-border);
}

@keyframes badge-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
```

---

### 5.4 Progress Bar

Progress bar harus berkarakter — bukan bar generik. Gunakan gradient animasi yang "berjalan".

```css
.progress-bar {
  width: 100%;
  height: 3px;
  background: var(--color-hairline);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    var(--color-status-converting),
    #a78bfa,           /* Ungu transisi */
    var(--color-status-converting)
  );
  background-size: 200% 100%;
  transition: width 0.3s linear(0, 0.5, 1.02, 0.98, 1);
  animation: shimmer 1.5s linear infinite;
}

/* Saat done: ganti ke hijau langsung */
.progress-bar__fill--done {
  background: var(--color-status-done);
  animation: none;
  transition: background 0.5s ease;
}

@keyframes shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```

---

### 5.5 Buttons

```css
/* PRIMARY — Aksi utama (Convert All) */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
}
.btn-primary:hover {
  background: var(--color-accent-hover);
  box-shadow: 0 0 16px rgba(255, 99, 99, 0.35);
}
.btn-primary:active {
  transform: scale(0.97);  /* Press effect */
  box-shadow: none;
}

/* GHOST — Aksi sekunder (Browse, Open Folder) */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: transparent;
  color: var(--color-ink-secondary);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
}
.btn-ghost:hover {
  background: var(--color-surface-overlay);
  color: var(--color-ink-primary);
  border-color: var(--color-hairline);
}
.btn-ghost:active {
  transform: scale(0.97);
}

/* ICON BUTTON — Tombol kecil dengan icon saja */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  color: var(--color-ink-muted);
  border: none;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.1s;
}
.btn-icon:hover {
  background: var(--color-surface-overlay);
  color: var(--color-ink-primary);
}
.btn-icon:active {
  transform: scale(0.9);
}
```

---

### 5.6 Toggle Switch (Settings)

```css
.toggle {
  position: relative;
  width: 36px;
  height: 20px;
  cursor: pointer;
}
.toggle input { display: none; }
.toggle__track {
  width: 100%;
  height: 100%;
  background: var(--color-hairline);
  border-radius: var(--radius-full);
  transition: background 0.2s ease;
}
.toggle__thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 14px; height: 14px;
  background: var(--color-ink-muted);
  border-radius: 50%;
  transition: transform 0.2s linear(0, 0.5, 1.1, 0.95, 1),
              background 0.2s ease;
}
input:checked ~ .toggle__track { background: var(--color-accent); }
input:checked ~ .toggle__thumb {
  transform: translateX(16px);
  background: #fff;
}
```

---

### 5.7 Settings Panel (Sidebar)

```css
.settings-panel {
  width: var(--sidebar-width);
  height: 100%;
  background: var(--color-surface);
  border-right: 1px solid var(--color-hairline);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  overflow-y: auto;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.settings-section__title {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-ink-muted);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-hairline-subtle);
}
```

---

### 5.8 Custom Title Bar

```css
.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--space-4);
  background: var(--color-canvas);
  border-bottom: 1px solid var(--color-hairline);
  -webkit-app-region: drag;  /* Electron: area draggable */
  user-select: none;
}

.titlebar__controls {
  display: flex;
  gap: var(--space-2);
  -webkit-app-region: no-drag;
}

/* Window control buttons (close, minimize, maximize) */
.titlebar__btn {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.titlebar__btn:active { transform: scale(0.85); }
.titlebar__btn--close    { background: #ff6363; }
.titlebar__btn--minimize { background: #ffc533; }
.titlebar__btn--maximize { background: #59d499; }
```

---

## 6. 🎬 Animation System

Semua animasi menggunakan prinsip **spring physics** — terasa fisik dan natural, bukan robotic.

### Spring Timing Functions

```css
:root {
  /* Spring ringan — untuk microinteractions (button press, toggle) */
  --spring-quick: linear(0, 0.4, 1.05, 0.97, 1);

  /* Spring medium — untuk elemen masuk/keluar (card, panel) */
  --spring-normal: linear(0, 0.3, 0.8, 1.08, 0.96, 1.02, 1);

  /* Spring ekspresif — untuk drop zone, highlight besar */
  --spring-bouncy: linear(0, 0.1, 0.4, 0.85, 1.12, 0.94, 1.03, 0.99, 1);
}
```

### Tabel Animasi Per Elemen

| Elemen | Trigger | Animasi | Durasi | Timing |
|---|---|---|---|---|
| File card masuk | Drop / browse | `translateY(8px)→0` + `scale(0.98)→1` + `opacity(0)→1` | 400ms | `--spring-normal` |
| File card keluar | Remove | `translateX(0)→(−20px)` + `opacity(1)→0` | 250ms | `ease-in` |
| Drop zone aktif | `dragover` | `scale(1)→(1.01)` + border glow | 200ms | `--spring-quick` |
| Drop zone invalid | Drop invalid | `shake` horizontal | 300ms | `ease` |
| Button press | `:active` | `scale(1)→(0.97)` | 100ms | `--spring-quick` |
| Toggle switch | Click | Thumb slide + overshoot | 200ms | `--spring-quick` |
| Preview panel buka | Click preview | `translateX(100%)→0` | 350ms | `--spring-normal` |
| Preview panel tutup | Click close | `translateX(0)→(100%)` | 250ms | `ease-in` |
| Badge converting | Auto | Opacity pulse loop | 1500ms | `ease-in-out` |
| Progress bar fill | Progress event | Width transition | 300ms | `--spring-quick` |
| Modal muncul | Trigger | `scale(0.95)→1` + `opacity(0)→1` | 300ms | `--spring-normal` |

---

## 7. 🖥️ Layout Responsiveness

Aplikasi ini adalah desktop app — **tidak perlu mobile responsive**. Namun harus handle berbagai ukuran jendela desktop.

```css
/* Minimum window size: 800×600 (diset di main.js) */

/* Preview panel auto-hide di window kecil */
@media (max-width: 900px) {
  .preview-panel {
    position: fixed;          /* Overlay, bukan inline */
    right: 0; top: 0; bottom: 0;
    transform: translateX(100%);
  }
  .preview-panel.is-open {
    transform: translateX(0);
    box-shadow: -8px 0 32px rgba(0,0,0,0.5);
  }
}

/* Sidebar collapse di window sangat kecil */
@media (max-width: 700px) {
  .settings-panel {
    width: 48px;  /* Icon-only mode */
    overflow: hidden;
  }
  .settings-section__title,
  .settings-label { display: none; }
}
```

---

## 8. 🔤 Icon System

Gunakan **Lucide Icons** — minimal, konsisten, SVG stroke-based. Jangan campur dengan library icon lain.

```html
<!-- CDN di index.html -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

### Icon yang Digunakan

| Lokasi | Icon Name | Size | Color |
|---|---|---|---|
| Drop zone empty state | `upload-cloud` | 32px | `--color-ink-muted` |
| File type: Word | `file-text` | 20px | `#57c1ff` |
| File type: PowerPoint | `presentation` | 20px | `#ff9057` |
| File type: Excel | `table` | 20px | `#59d499` |
| Status: waiting | `clock` | 14px | `--color-status-waiting` |
| Status: converting | `loader-2` (spinning) | 14px | `--color-status-converting` |
| Status: done | `check-circle` | 14px | `--color-status-done` |
| Status: error | `alert-circle` | 14px | `--color-status-error` |
| Toolbar: delete | `trash-2` | 16px | `--color-ink-muted` |
| Toolbar: open file | `external-link` | 16px | `--color-ink-muted` |
| Toolbar: open folder | `folder-open` | 16px | `--color-ink-muted` |
| Settings: page size | `layout` | 16px | `--color-ink-secondary` |
| Settings: orientation | `rotate-cw` | 16px | `--color-ink-secondary` |
| Settings: compress | `archive` | 16px | `--color-ink-secondary` |
| Preview: close | `x` | 16px | `--color-ink-secondary` |
| Window: close | *(custom circle)* | 12px | — |
| Window: minimize | *(custom circle)* | 12px | — |
| Window: maximize | *(custom circle)* | 12px | — |

---

## 9. ✅ Design Checklist untuk Agent

Sebelum mengakhiri Fase 3 (UI Design System), verifikasi semua poin ini:

- [ ] Semua CSS variables terdefinisi di `:root`
- [ ] Tidak ada hardcoded color di luar `:root` (selalu gunakan `var(--...)`)
- [ ] Font Inter berhasil diload dari Google Fonts
- [ ] `letter-spacing: var(--tracking-wide)` aktif di body text
- [ ] Drop zone memiliki animasi `drag-over` yang terlihat jelas
- [ ] File card entry animation menggunakan spring timing
- [ ] Setiap status memiliki warna berbeda (waiting/converting/done/error)
- [ ] Progress bar memiliki shimmer animation saat converting
- [ ] Tombol primary memiliki `box-shadow` glow saat hover
- [ ] Tombol memiliki `scale(0.97)` saat `:active`
- [ ] Toggle switch memiliki spring animation
- [ ] Title bar menggunakan `-webkit-app-region: drag`
- [ ] Window control buttons berwarna sesuai (merah/kuning/hijau)
- [ ] Preview panel memiliki slide-in animation
- [ ] Tidak ada elemen menggunakan `box-shadow` tebal sebagai depth indicator
