# 🗺️ WebGIS GeoInsight — Mitigasi Bencana & Analisis Transportasi Kota Bekasi

<div align="center">

**Platform WebGIS interaktif untuk visualisasi risiko banjir, jaringan transportasi, dan analisis spasial Kota Bekasi.**

[🔗 Backend API](https://geoinsight-bekasi-city-production.up.railway.app) · [📖 Dokumentasi](#dokumentasi-teknis) · [📋 Lisensi](#lisensi)

</div>

---

## 📌 Ringkasan

**GeoInsight** adalah aplikasi WebGIS (Web Geographic Information System) yang dibangun untuk memvisualisasikan data risiko bencana dan jaringan transportasi Kota Bekasi secara interaktif. Aplikasi menampilkan peta banjir, lokasi puskesmas, dan jaringan jalan di atas peta dasar (basemap), dilengkapi dengan **analisis spasial isochrone** dan **rute terpendek** melalui jaringan jalan nyata, serta dukungan **pembaruan data real-time** lewat Supabase.

Proyek ini mengimplementasikan alur lengkap **backend → database spasial → frontend WebGIS**, menggunakan teknologi open-source modern (MapLibre GL, PostgreSQL+PostGIS, Node.js, Vite), dan telah di-deploy ke **Vercel** (frontend), **Railway** (backend), serta **Supabase** (database).

---

## 📋 Daftar Isi

- [Informasi Proyek](#informasi-proyek)
- [Data yang Digunakan](#data-yang-digunakan)
- [Proses / Arsitektur](#proses--arsitektur)
- [Stack Teknologi](#stack-teknologi)
- [Endpoint API](#endpoint-api)
- [Fitur Implementasi](#fitur-implementasi)
- [Struktur Repository](#struktur-repository)
- [Cara Menjalankan](#cara-menjalankan)
- [Deployment](#deployment)
- [Hasil](#hasil)
- [Lisensi](#lisensi)

---

## ℹ️ Informasi Proyek

### Latar Belakang

Kota Bekasi memiliki risiko tinggi terhadap **banjir musiman**. Persebaran informasi kebencanaan masih tersebar dan belum terintegrasi dalam satu platform geospasial, sehingga menyulitkan masyarakat dalam memahami tingkat risiko serta akses menuju fasilitas penting (puskesmas) dan jalur evakuasi/transportasi yang aman.

### Tujuan

1. **Membangun platform WebGIS interaktif** yang memvisualisasikan risiko banjir, jaringan jalan, dan lokasi fasilitas kesehatan dalam satu peta.
2. **Menyediakan analisis spasial** untuk mendukung pengambilan keputusan, yaitu **isochrone** (area jangkauan waktu tempuh melalui jaringan jalan) dan **rute terpendek**.
3. **Mendukung pembaruan data real-time** sehingga peta dapat ter-update otomatis saat data pada database berubah.

### Cakupan Wilayah

- Lokasi peta berpusat di **Kota Bekasi** (sekitar `107.0°E, -6.2°S`), zoom awal 10.

---

## 🗂️ Data yang Digunakan

Data disimpan di **PostgreSQL + PostGIS** pada **Supabase**. Terdapat 3 tabel utama yang diakses backend, serta 1 file data mentah jaringan jalan.

| Tabel / File | Isi | Atribut Utama |
|---|---|---|
| `petarisiko_banjirbekasi` | Wilayah risiko banjir (polygon) | `gid`, `kecamatan`, `desa`, `kelas_risi` (`RENDAH`/`SEDANG`/`TINGGI`), `geom` |
| `jalan_bekasi` | Jaringan jalan (line) | `gid`, `remark` (kelas jalan), `geom` |
| `puskesmas_utm` | Titik fasilitas kesehatan | `gid`, `nama`, `alamat`, `kecamatan`, `desa`, `longitude`, `latitude`, `geom` |
| `back-end/data/bekasi_jalan.geojson` | Data mentah jaringan jalan | Sumber: **OpenStreetMap** (Overpass Turbo), lisensi ODbL, ~31.081 fitur |

> **Catatan data:** Ubah-ubah CRS dilakukan dengan PostGIS (`ST_Transform`, `ST_SetSRID`, `ST_Force2D`). Panjang segmen jalan dihitung dalam meter (SRID 32748 = UTM Zona 48S).

### Jumlah Data (terverifikasi)

- **62** titik puskesmas
- **565** fitur wilayah banjir
- **±31.081** segmen jaringan jalan (berasal dari OpenStreetMap)

---

## ⚙️ Proses / Arsitektur

```
        ┌──────────────┐      HTTPS/JWT      ┌─────────────────────┐
        │   FRONTEND    │ ─────────────────► │      BACKEND        │
        │  (Vercel)     │   request API      │  (Railway/Express)  │
        │ MapLibre GL   │ ◄───────────────── │  /api/routes/*      │
        └──────┬───────┘      GeoJSON        └──────────┬──────────┘
               │                                        │  pg (Pool)
        Supabase Realtime │                             │
        (postgres_changes)│                    ┌────────▼─────────┐
               ▼          │                    │  DATABASE         │
        auto re-fetch     │                    │ PostgreSQL+PostGIS│
                       data                          │ (Supabase)   │
```

### Alur Kerja

1. **Frontend** memuat peta via MapLibre GL dengan basemap GeoMapid (fallback OpenFreeMap `positron` bila gagal).
2. Pada event `load`, frontend memanggil endpoint backend untuk mengambil data dalam bentuk **GeoJSON**:
   - `/api/routes/puskesmas`, `/api/routes/flood`, `/api/routes/jalan?simplified=1`
   - `/api/routes/heatmap/puskesmas?radius=750`
3. **Backend (Node.js/Express)** menjalankan query **PostGIS** lewat driver `pg` (connection pool), lalu membungkus hasil menjadi **GeoJSON FeatureCollection**.
4. **Frontend** menambahkan layer peta (banjir, jalan, puskesmas, heatmap) dan popup interaktif.
5. **Analisis spasial** (isochrone / rute terpendek) diselesaikan **di backend Node.js** (`src/roadGraph.js`): graf jalan dibangun sekali (cache), Dijkstra dengan MinHeap, snapping ke simpul terdekat (radius 350 m), dengan 3 moda perjalanan.
6. **Realtime (Supabase)**: frontend berlangganan `postgres_changes` pada ketiga tabel. Jika ada INSERT/UPDATE/DELETE, frontend otomatis memuat ulang data dan memperbarui layer.

---

## 🛠️ Stack Teknologi

### Frontend

| Kategori | Teknologi |
|---|---|
| Build Tool | Vite 8 (multi-page: `index.html` + `src/map/map.html`) |
| Bahasa | Vanilla JavaScript (ES Modules) |
| Mapping | MapLibre GL JS v6 |
| Styling | Tailwind CSS v4 (plugin `@tailwindcss/vite`) + CSS murni |
| Geospasial | `@terraformer/wkt` (parsing WKT) |
| Realtime | `@supabase/supabase-js` (subscription `postgres_changes`) |

Framework **Tanpa** React/Vue — murni Vanilla JS untuk performa dan kesederhanaan.

### Backend

| Kategori | Teknologi |
|---|---|
| Runtime | Node.js (ES Modules) |
| Web Framework | Express v5.2 |
| Database Driver | `pg` (node-postgres) v8.23, connection pool dengan SSL |
| Middleware | `cors`, `express.json`, `dotenv` |
| Analisis Jaringan | `src/roadGraph.js` — Dijkstra custom (MinHeap), grid spatial indexing |

Terdapat juga **microservice Python (Flask)** terpisah di `spatial-processor-engine` untuk operasi geometri geodesi (luas, jarak, buffer, centroid, irisan, dijkstra WKT) menggunakan `pyproj` & `shapely`.

### Database

- **PostgreSQL** + **PostGIS**
- Dihosting di **Supabase** (koneksi via pooler, port 6543, SSL)

### Deployment

| Bagian | Platform |
|---|---|
| Frontend | **Vercel** (`vercel.json`, `framework: vite`, output `dist`) |
| Backend | **Railway** (`Procfile`: `web: npm start`) |
| Database | **Supabase** (Postgres + PostGIS + Realtime) |
| Basemap | **GeoMapid** (`basemap.mapid.io` style `street-2d-building`) |

---

## 🔌 Endpoint API

Semua route Backend di-mount pada prefix `/api/routes` (dari `back-end/src/server.js`).

### Node.js (Express)

| Method | Path | Fungsi |
|---|---|---|
| GET | `/api/routes/puskesmas` | Data puskesmas (GeoJSON) |
| GET | `/api/routes/flood` | Data wilayah banjir (GeoJSON) |
| GET | `/api/routes/jalan?simplified=1` | Data jaringan jalan (GeoJSON, geometri disederhanakan) |
| GET | `/api/routes/network/route?startLng=&startLat=&endLng=&endLat=&mode=` | Rute terpendek antara dua titik |
| GET | `/api/routes/isochrone?lng=&lat=&minutes=&mode=` | Area jangkauan waktu (isochrone) |
| GET | `/api/routes/heatmap/puskesmas?radius=750` | Heatmap kepadatan puskesmas |

> Catatan: `routes/buffer.js` dan `routes/hospitals.js` merupakan router kosong (placeholder).

### Python (Flask) — Spatial Processor Engine

| Method | Path | Fungsi |
|---|---|---|
| POST | `/spatial_computation/area` | Luas geometri (hektare) |
| POST | `/spatial_computation/distance` | Jarak antara dua geometri |
| POST | `/spatial_computation/length` | Panjang / keliling |
| POST | `/geometry_manipulation/buffer` | Buffer metrik akurat |
| POST | `/geometry_manipulation/centroid` | Titik centroid |
| POST | `/geometry_manipulation/intersections` | Irisan dua geometri |
| POST | `/network_analysis/dijkstra` | Rute terpendek pada network WKT |

---

## ✨ Fitur Implementasi

Semua fitur berikut **benar-benar diimplementasikan** dalam kode (`front-end/src/map/map.js` dan modul pendukungnya).

### Visualisasi Layer

- **Basemap** GeoMapid `street-2d-building` dengan fallback OpenFreeMap Positron.
- **Layer Banjir** — fill polygon, warna sesuai `kelas_risi` (RENDAH hijau, SEDANG kuning, TINGGI merah).
- **Layer Jalan** — `jalanMinor` (lokal/setapak) & `jalanMajor` (arteri/kolektor/tol), warna per kelas jalan.
- **Layer Puskesmas** — titik circle biru.
- **Layer Heatmap Puskesmas** — kepadatan (density) kernel (default nonaktif, dapat diaktifkan).

### Panel Interaktif

- **Panel Layer Peta** (kiri atas) — toggle visibilitas 5 layer.
- **Panel Analisis Spasial** — pilih moda (Jalan Kaki 5 km/jam, Sepeda Motor 40 km/jam, Mobil 70 km/jam), batas waktu isochrone (5/10/15/20/30 menit), tombol **Isochrone** dan **Rute Terpendek**.

### Analisis Spasial

- **Isochrone** — hitung area jangkauan waktu melalui jaringan jalan + rute ke puskesmas terdekat, dengan ringkasan 5 puskesmas tercepat.
- **Rute Terpendek** — cari jalur optimal antara dua titik (klik awal & tujuan), tampilkan jarak/waktu.

### Interaksi & Popup

- **Popup Puskesmas** — nama, alamat, kecamatan, desa, koordinat, link Google Maps.
- **Popup Banjir** — badge tingkat risiko, kecamatan, desa, koordinat.
- **Popup Jalan** — kelas jalan, panjang segmen (km), ID segmen.
- **Geolokasi** — tombol custom, high-accuracy, layer halo akurasi + titik lokasi, `flyTo`.

### Realtime

- **Supabase Realtime** — subscribe `postgres_changes` pada tabel `puskesmas_utm`, `petarisiko_banjirbekasi`, `jalan_bekasi`; perubahan memicu pemuatan ulang layer secara otomatis tanpa refresh halaman.

---

## 📁 Struktur Repository

```
mapid-project/
│
├── 📄 README.md                     ← Dokumentasi ini
├── 📄 LICENSE                       # MIT License
├── 📄 package.json                  # NPM workspaces (front-end & back-end)
│
├── 📂 front-end/                    # 🎨 Frontend (Vite + Vanilla JS + MapLibre)
│   ├── 📄 index.html                # Landing page (entry 1)
│   ├── 📄 vite.config.js            # Multi-page build + copy maplibre worker
│   ├── 📄 vercel.json               # Konfigurasi deploy Vercel
│   ├── 📄 tailwind.config.js
│   ├── 📄 .env / .env.example       # Env vars (template tanpa nilai rahasia)
│   │
│   └── 📂 src/
│       ├── 📄 config.js             # API base, style basemap, konfig Supabase
│       ├── 📄 realtime.js           # Subscribe Supabase postgres_changes
│       ├── 📄 style.css
│       ├── 📂 map/
│       │   ├── map.html             # WebMap page (entry 2)
│       │   ├── map.js               # Inti aplikasi peta (layer, panel, analisis)
│       │   ├── heatmap.js           # Layer heatmap puskesmas
│       │   └── styleMap.css
│       ├── 📂 engine/               # Analisis: isochrone, network, geolocation, area, buffer
│       ├── 📂 popUps/               # Builder popup (puskesmas, banjir, jalan)
│       ├── 📂 controls/             # Kontrol dasar
│       └── 📂 legend/               # (placeholder)
│
└── 📂 back-end/                     # 🔧 Backend (Node.js Express + PostGIS)
    ├── 📄 Procfile                  # Deploy Railway
    ├── 📄 package.json              # express, pg, cors, dotenv
    ├── 📄 .env / .env.example
    │
    ├── 📂 src/
    │   ├── server.js                # Entry Express, mount routes
    │   ├── db.js                    # pg Pool (Supabase / lokal)
    │   └── roadGraph.js             # Graf jalan, Dijkstra, isochrone
    ├── 📂 routes/                   # Definisi route per resource
    ├── 📂 controllers/              # Logika handler → GeoJSON
    ├── 📂 services/                 # Query SQL ke database
    ├── 📂 data/                     # Data mentah (bekasi_jalan.geojson, dll.)
    └── 📂 spatial-processor-engine/ # Microservice Python (Flask) geometri
```

---

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js** 16+ dan npm
- **PostgreSQL** 12+ dengan **PostGIS** (atau akun **Supabase**)
- **Git**

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shinmarizz/geoinsight-bekasi-city.git
cd mapid-project
npm install
```

### 2. Setup Backend

```bash
cd back-end
cp .env.example .env
# isi DATABASE_URL / DB_* sesuai database lokal atau Supabase Anda
npm install
npm run dev        # server berjalan di http://localhost:5000
```

### 3. Setup Frontend

```bash
cd front-end
cp .env.example .env
# isi VITE_API_BASE_URL = http://127.0.0.1:5000 (untuk lokal)
# isi VITE_API_GEOMAPID, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm install
npm run dev        # dev server Vite
```

### 4. Build Produksi

```bash
cd front-end
npm run build      # hasil di dist/
npm run preview
```

> **Catatan Maplibre worker:** `vite.config.js` berisi plugin `copyMaplibreWorkers()` yang menyalin `maplibre-gl-worker.mjs` ke output build. Ini penting agar peta berfungsi di Vercel (worker tidak boleh 404).

---

## 🧪 Deployment

### Frontend — Vercel

Environtment variables yang perlu di-set di dashboard Vercel (nilai diisi sesuai environment Anda, **jangan** memakai nilai rahasia di berkas publik):

```
VITE_API_BASE_URL=https://your-backend.up.railway.app
VITE_API_GEOMAPID=https://basemap.mapid.io/styles/street-2d-building/style.json?key=YOUR_GEOMAPID_KEY
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_SCHEMA=public
VITE_SUPABASE_TABLES=puskesmas_utm,petarisiko_banjirbekasi,jalan_bekasi
```

Build command: `npm run build` · Output directory: `dist`.

### Backend — Railway

- Set `DATABASE_URL` ke connection string Supabase Anda.
- `Procfile` berisi `web: npm start` (menjalankan `node src/server.js`).
- Railway mem-build dari folder `back-end`.

### Database & Realtime — Supabase

1. Buat tabel `puskesmas_utm`, `petarisiko_banjirbekasi`, `jalan_bekasi` (dengan PostGIS).
2. Aktifkan **Realtime** untuk ketiga tabel di **Table Editor** (flag Realtime).
3. Ambil **Project URL** dan **anon key** dari Supabase Dashboard → Settings → API.

---

## ✅ Hasil

Proyek **GeoInsight WebGIS** berhasil dibangun dan di-deploy end-to-end:

- **Backend & Database** terhubung ke Supabase (PostgreSQL+PostGIS) dan berjalan di Railway — terverifikasi setiap endpoint mengembalikan data (62 puskesmas, 565 fitur banjir, ±31.081 segmen jalan).
- **Frontend** di-deploy di Vercel dengan multi-page (landing + peta), basemap tampil, dan worker MapLibre berfungsi (masalah 404 worker teratasi).
- **Fitur** layer interaktif, popup, panel analisis, isochrone, rute terpendek, geolokasi, dan heatmap **berfungsi**.
- **Realtime** terpasang via Supabase sehingga data dapat ter-update otomatis.

### Permasalahan yang Ditemukan & Diselesaikan

1. **Data tidak tampil di production** — `VITE_API_BASE_URL` awalnya masih menunjuk `127.0.0.1`; diperbaiki agar menunjuk URL backend Railway.
2. **Reference Error `GEOMAPID_STYLE_BASE is not defined`** — bundle lama; diselesaikan dengan deploy kode `config.js` terbaru.
3. **Peta kosong (basemap & data tidak render)** — file worker MapLibre (`maplibre-gl-worker.mjs`) tidak ikut ter-build sehingga Vercel mengembalikan 404. Diselesaikan dengan plugin Vite yang menyalin worker ke output build.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

### Atribusi Data Spasial

- **OpenStreetMap** — data jalan, sesuai lisensi [ODbL](https://www.openstreetmap.org/copyright).
- **Data risiko banjir** — sesuai kebijakan penyedia data (BPBD/InaRISK/BNPB).

---

<div align="center">

**🌍 GeoInsight — Enabling Safer Communities Through Geospatial Intelligence** 🚀

</div>
