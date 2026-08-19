# 🗺️ WebGIS GeoInsight - Mitigasi Bencana & Analisis Transportasi Kota Bekasi

<div align="center">

**Platform WebGIS Interaktif untuk Visualisasi Risiko Multi-Bencana & Jaringan Transportasi**

[🔗 Live Demo](#) · [📖 Dokumentasi](#-dokumentasi-teknis) · [📋 Lisensi](#-lisensi)

</div>

---

## 📋 Daftar Isi

- [Latar Belakang](#-latar-belakang)
- [Tujuan Proyek](#-tujuan-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Sumber Data](#-sumber-data)
- [Struktur Repository](#-struktur-repository)
- [Deployment & CI/CD](#-deployment--cicd)
- [Cara Menjalankan](#-cara-menjalankan)
- [Dokumentasi Teknis](#-dokumentasi-teknis)
- [Roadmap](#-roadmap)
- [Risiko & Mitigasi](#-risiko--mitigasi)
- [Lisensi](#-lisensi)

---

## 🌍 Latar Belakang

Bencana alam seperti **banjir** dan **longsor** menjadi tantangan serius bagi pemerintah dan masyarakat kota/kabupaten di Indonesia, khususnya **Kota Bekasi** yang memiliki risiko tinggi terhadap banjir musiman dan longsor di area perbukitan. 

Setiap tahun, kejadian banjir dan longsor di Bekasi mengakibatkan:
- **Ratusan rumah terendam** air, mengganggu aktivitas ekonomi
- **Akses transportasi terputus**, menyulitkan proses evakuasi dan distribusi bantuan
- **Kerugian material dan non-material** yang signifikan bagi komunitas setempat
- **Minimnya informasi real-time** bagi publik tentang area risiko dan rute evakuasi aman

### Solusi: GeoInsight WebGIS Platform

**GeoInsight** adalah platform WebGIS inovatif yang dirancang untuk:

1. **Memvisualisasikan risiko bencana dengan detail spasial & temporal**
   - Layer interaktif untuk banjir dan longsor dengan perkembangan historis
   - Pemetaan tingkat kerawanan (rendah/sedang/tinggi)

2. **Mengintegrasikan jaringan transportasi & fasilitas evakuasi**
   - Overlay jaringan jalan, shelter, rumah sakit, kantor pemerintah
   - Identifikasi rute terdampak dan rute alternatif

3. **Mendukung pengambilan keputusan cepat dalam mitigasi bencana**
   - Popup informasi risiko lokasi pribadi (Fitur Unggulan #1)
   - Peta evakuasi dengan perhitungan waktu tempuh ke titik aman (Fitur Unggulan #2)

4. **Meningkatkan literasi bencana masyarakat umum**
   - Dashboard heatmap kejadian historis untuk edukasi
   - Antarmuka user-friendly, aksesibel dari perangkat apa pun

Dengan menggunakan teknologi **open-source terkini** (MapLibre GL JS, PostgreSQL+PostGIS, Node.js, Vite), GeoInsight menawarkan solusi yang **scalable, cost-effective, dan berkelanjutan** untuk mitigasi bencana tingkat kota/kabupaten.

---

## 🎯 Tujuan Proyek

### Tujuan Utama

1. **Membangun platform WebGIS interaktif** yang memvisualisasikan risiko bencana (banjir & longsor) dengan integrasi data transportasi untuk mendukung mitigasi bencana di Kota Bekasi

2. **Menyediakan fitur analisis spasial canggih** untuk mendukung keputusan evakuasi, perencanaan rute aman, dan identifikasi area prioritas mitigasi

3. **Mengimplementasikan time series visualization** untuk menunjukkan perkembangan bencana historis per periode waktu, sehingga publik dapat memahami tren dan perubahan risiko

### Tujuan Spesifik

| # | Tujuan Spesifik | Output/KPI |
|---|---|---|
| 1 | Mengintegrasikan data multi-sumber dalam satu dashboard WebGIS terpadu | Minimum 5 layer data terintegrasi (banjir, longsor, jalan, faskes, admin) |
| 2 | Menyajikan layer hazard dengan styling intuitif & interaktif | Layer hazard tampil dengan warna gradasi risiko (rendah/sedang/tinggi) |
| 3 | Menghitung & menampilkan radius bahaya dari sumber risiko | Buffer tool menghasilkan zona risiko dengan accuracy >95% |
| 4 | Implementasikan isochrone untuk jangkauan waktu evakuasi | Isochrone tersedia dalam 5-30 menit, calculated dengan akurasi routing >90% |
| 5 | Menyediakan heatmap kejadian historis untuk edukasi | Heatmap menampilkan density bencana dengan KDE smoothing |
| 6 | Fitur cek risiko lokasi pribadi via popup informasi | Popup menampilkan risk level, historical events, nearest shelter |
| 7 | Slider time series untuk analisis temporal bencana | Timeline slider dapat filter data 5+ tahun dengan smooth transitions |
| 8 | Responsive design untuk desktop & mobile | Aplikasi tersedia di desktop, tablet, mobile dengan UX optimal |

---

## ✨ Fitur Utama

### 🏆 Fitur Unggulan (Value Proposition)

#### 1️⃣ **"Apakah Lokasi Saya Aman?"** — Cek Risiko Lokasi Pribadi

Pengguna dapat mengklik/mencari alamat atau titik di peta untuk melihat:

```
┌─────────────────────────────────────┐
│ POPUP INFORMASI RISIKO              │
├─────────────────────────────────────┤
│ Lokasi: Jl. Benda, Kel. Pengasinan  │
│ Koordinat: 107.0°E, 6.2°S          │
│ ────────────────────────────────────│
│ 🔴 TINGKAT RISIKO: TINGGI           │
│ ────────────────────────────────────│
│ Risiko Banjir:   ████████░░ 80%     │
│ Risiko Longsor:  ██░░░░░░░░ 20%     │
│ ────────────────────────────────────│
│ 📊 KEJADIAN HISTORIS (5 tahun):     │
│ • Banjir: 12 kali (terakhir Jan23)  │
│ • Longsor: 2 kali (2019, 2021)      │
│ ────────────────────────────────────│
│ ⚠️ ZONA RISIKO:                      │
│ • 500m dari Sungai Cikarang         │
│ • Area genangan banjir 2019-2023    │
│ ────────────────────────────────────│
│ 🏥 SHELTER TERDEKAT:                 │
│ • Pendopo Kelurahan Pengasinan (1km)│
│ • Sekolah SD Negeri 01 (1.5km)      │
│                                     │
│ [ ► Lihat Rute Evakuasi ]           │
└─────────────────────────────────────┘
```

**User Story:**  
*"Sebagai warga, saya ingin tahu seberapa berisiko lokasi tempat tinggal/aktivitas saya, agar bisa bersiap sebelum bencana terjadi."*

**Fitur Teknis:**
- ✅ Geolocation & address search
- ✅ Spatial query ke PostGIS untuk overlap risk zones
- ✅ Popup display dengan historical events
- ✅ Distance calculation ke nearest shelter/faskes

---

#### 2️⃣ **"Kalau Tidak Aman, Saya Harus ke Mana?"** — Peta Evakuasi & Isochrone

Dari lokasi pengguna, sistem menghitung & menampilkan:
- **Jangkauan waktu tempuh** (isochrone) ke titik aman terdekat
- **Opsi rute evakuasi realistis** dengan estimasi waktu perjalanan
- **Overlay layer transportasi** untuk menunjukkan jalur terbaik

```
PETA ISOCHRONE EVAKUASI
- Warna biru: 5 menit tempuh
- Warna hijau: 10 menit tempuh  
- Warna kuning: 20 menit tempuh
- Warna merah: >30 menit tempuh

Dari: 📍 Rumah (Jl. Benda)
Tujuan: 🏥 Shelter terdekat
├─ Pendopo Kelurahan (1 km, ~5 menit jalan kaki)
├─ SD Negeri 01 (1.5 km, ~10 menit)
└─ Rumah Sakit Karya Bhakti (3 km, ~15 menit motor)
```

**User Story:**  
*"Sebagai warga dalam situasi darurat, saya ingin tahu titik aman terdekat dan estimasi waktu tempuh, agar bisa mengambil keputusan evakuasi dengan cepat."*

**Fitur Teknis:**
- ✅ OSMnx + NetworkX untuk perhitungan routing
- ✅ Isochrone polygon rendering dengan MapLibre
- ✅ Multiple destination support (shelter, faskes, kantor)
- ✅ Real-time update traffic consideration (optional)

---

### 📊 Fitur Lengkap (MVP & Optional)

#### MVP (Wajib - Minggu 1-6)

| # | Kategori | Fitur | Deskripsi | Status |
|---|----------|-------|-----------|--------|
| 1 | **Interface** | Landing Page | Hero section, value proposition, map preview | ✅ |
| 2 | | WebMap Interaktif | Basemap, zoom/pan/geolocate, layer toggle | ✅ |
| 3 | **Data Hazard** | Layer Banjir | Vector polygon dari PostGIS + styling gradient | ✅ |
| 4 | | Layer Longsor | Vector polygon dari PostGIS + styling gradient | ✅ |
| 5 | **Data Transportasi** | Layer Jalan | OSM jaringan jalan dengan status kerusakan | ✅ |
| 6 | | Layer Fasilitas | POI shelter, rumah sakit, kantor pemerintah | ✅ |
| 7 | **Analisis Spasial** | Popup Risiko | Detail hazard pada feature click (FU#1) | ✅ |
| 8 | | Buffer/Radius | Zona bahaya dari sumber risiko (FU#1) | ✅ |
| 9 | | Isochrone | Waktu tempuh ke evakuasi (FU#2) | ✅ |
| 10 | **Visualisasi** | Heatmap | Kernel density kejadian historis | ✅ |
| 11 | | Time Series | Slider waktu + MapLibre filter layer | ✅ |
| 12 | | Search & Info | Search feature, info panel detail | ✅ |

#### Optional (Jika waktu >Minggu 7-8)

| # | Fitur | Deskripsi | Prioritas |
|---|-------|-----------|-----------|
| 1 | Dashboard Statistik | Ringkas jumlah kejadian, area terdampak per periode | Medium |
| 2 | Rute Alternatif | Visualisasi jaringan jalan alternatif saat jalan utama terdampak | Medium |
| 3 | Animasi Auto Time Series | Play/pause otomatis untuk timeline | Low |
| 4 | Export Data | Download data layer sebagai shapefile/GeoJSON | Low |
| 5 | Mobile App Version | Progressive Web App untuk mobile offline support | Very Low |

---

## 🛠 Teknologi yang Digunakan

### 📱 Frontend Stack

**Teknologi Utama:**
- **Mapping Library:** [MapLibre GL JS](https://maplibre.org/) v5.24+ — open-source, ringan, support vector & raster tiles
- **Framework:** Vanilla JavaScript (ES6+) — tanpa framework abstraction layer
- **Build Tool:** [Vite](https://vitejs.dev/) — dev server dengan HMR, fast build
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4.3 + CSS murni
- **Geospatial Utils:** [Terraformer WKT](https://github.com/terraformer-js/terraformer) — parsing WKT geometri
- **HTTP Client:** Vanilla `fetch` API

**Dependencies:**

```json
{
  "dependencies": {
    "maplibre-gl": "^6.1.0",
    "@terraformer/wkt": "^2.2.2",
    "tailwindcss": "^4.3.3",
    "@tailwindcss/vite": "^4.3.3"
  },
  "devDependencies": {
    "vite": "^8.2.0"
  }
}
```

**Struktur Frontend Modular:**

```javascript
// src/webmap/
├── main.js              // Entry point WebMap
├── map.js               // MapLibre GL initialization
│   └── Handlers: basemap load, style sync
├── layers.js            // Layer source/paint definition
│   └── Handlers: toggle, filter, paint update
├── popup.js             // Feature popup builder
│   └── Handlers: risk level display, historical data
├── timeline.js          // Time series slider
│   └── Handlers: date filter, animation control
├── analysis.js          // Buffer/isochrone trigger
│   └── Request: POST to backend /api/analysis/*
├── api.js               // Fetch wrapper + error handling
│   └── Functions: GET/POST with VITE_API_BASE_URL
├── config/
│   └── config.js        // Map center, zoom, layer config
└── utils/
    └── helpers.js       // Utility functions (distance, etc)
```

**Frontend Features:**
- ✅ Multi-page build (index.html landing + map.html webmap)
- ✅ Environment variables (.env) untuk API base URL, keys
- ✅ Responsive design (mobile-first dengan Tailwind)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Performance (code splitting, lazy loading)

---

### 🔧 Backend Stack

**Teknologi Utama:**
- **Runtime:** Python 3.8+
- **Web Framework:** Flask (minimal, REST API focus) atau FastAPI (async support)
- **CORS Middleware:** flask-cors / starlette.middleware
- **Geospatial Libraries:**
  - [GeoPandas](https://geopandas.org/) — spatial operations, CRS transformation
  - [Shapely](https://shapely.readthedocs.io/) — buffer, intersection, validation
  - [Rasterio](https://rasterio.readthedocs.io/) — read/process GeoTIFF raster
- **Database Driver:** psycopg2 / SQLAlchemy ORM
- **Routing & Isochrone:**
  - [OSMnx](https://osmnx.readthedocs.io/) — download & process OSM networks
  - [NetworkX](https://networkx.org/) — graph operations, shortest path
- **Production Server:** Gunicorn (WSGI) / Uvicorn (ASGI)

**Dependencies:**

```
Flask>=3.0
Flask-CORS>=6.0
GeoPandas>=0.12.0
Shapely>=2.0
Rasterio>=1.3
PyProj>=3.0
psycopg2-binary>=2.9
SQLAlchemy>=2.0
OSMnx>=1.5
NetworkX>=2.8
Gunicorn>=21.0
python-dotenv>=0.19.0
```

**Struktur Backend:**
---

### 🗄️ Database Stack

**System:** PostgreSQL 12+ dengan PostGIS 3.0+

### 📊 Data Pipeline

**ETL Workflow (Extract → Transform → Load):**

```
┌─ Data Sumber Mentah
├─ DIBI BNPB (banjir/longsor historis)
├─ OSM Overpass API (jalan, faskes, shelter)
├─ BIG (batas admin)
└─ GEE Export (raster DEM, landsat, sentinel)
    ↓ [Step 1: EXTRACT]
    └─ Python scripts download data
    
    ↓ [Step 2: VALIDATE]
    ├─ Cek CRS → transform ke EPSG:4326
    ├─ Validasi geometri (Shapely ST_IsValid)
    ├─ Hapus duplikat & null geometry
    └─ Enrichment: add tanggal_kejadian, risiko level
    
    ↓ [Step 3: TRANSFORM]
    ├─ Reclassify raster jadi kelas diskret
    ├─ Polygonize (rasterio + gdal)
    ├─ Merge layer vector
    └─ CRS standardize
    
    ↓ [Step 4: LOAD]
    ├─ Insert ke PostgreSQL+PostGIS
    ├─ Build spatial index (GIST)
    ├─ Vacuum & analyze untuk optimasi
    └─ Validate row count
    
    ↓ [Step 5: EXPORT]
    ├─ Query PostGIS → dump GeoJSON
    └─ Serve via REST API
```

**ETL Scripts:**

**Sample ETL Script (`etl_hazard.py`):**

---

## 📍 Sumber Data

### 1. Hazard (Bencana)

| Sumber | Tipe Data | Coverage | Akses | Format |
|--------|-----------|----------|-------|--------|
| [DIBI BNPB](https://dibi.bnpb.go.id) | Kejadian bencana historis (point + polygon) | Nasional | Portal web, CSV download | CSV, Shapefile, GeoJSON |
| [InaRISK BNPB](https://inarisk.bnpb.go.id) | Peta kerawanan bencana (raster) | Nasional | Portal web, WMS | Raster GeoTIFF, WMS tiles |
| [BMKG](https://www.bmkg.go.id) | Curah hujan historis, warning | Nasional | Portal MEWS, API | Daily data, GeoTIFF |
| BPBD Kota Bekasi | Data lokal bencana, dokumentasi foto | Lokal | Koordinasi langsung | Spreadsheet, shapefile |

**Data Hazard yang Digunakan:**
- **Banjir:** Polygon genangan dari DIBI 2015-2023, atribut: tanggal, area, korban
- **Longsor:** Polygon longsor dari DIBI 2015-2023, atribut: tanggal, kedalaman, slope
- **Kontrol Kualitas:** Validasi CRS EPSG:4326, hapus geometri null/invalid

### 2. Transportasi & Infrastruktur

| Sumber | Tipe Data | Coverage | Akses | Format |
|--------|-----------|----------|-------|--------|
| [OpenStreetMap (OSM)](https://www.openstreetmap.org) | Jaringan jalan, POI faskes/shelter | Global (detail di urban areas) | Overpass API, Geofabrik | GeoJSON, Shapefile, PBF |
| Bappeda Kota Bekasi | POI lokal, titik evakuasi, shelter | Lokal Bekasi | Koordinasi | Spreadsheet + shapefile |
| [Google Maps / Mapbox](https://developers.google.com/maps) | Geocoding, routing validation | Global | API key required | REST API response |

**Data Transportasi yang Digunakan:**
- **Jalan:** OSM primary/secondary roads, atribut: panjang, tipe, surface
- **Shelter:** Sekolah, masjid, balai kelurahan dari OSM + Bappeda
- **Faskes:** Rumah sakit, puskesmas dari OSM + Kemenkes database
- **Kontrol Kualitas:** Snapping ke network node, validasi LineString

### 3. Batas Administrasi

| Sumber | Coverage | Akses | Format |
|--------|----------|-------|--------|
| [BIG (Badan Informasi Geospasial)](https://tanahair.indonesia.go.id) | Batas admin (provinsi, kab/kota, kelurahan) | Nasional | Portal tanahair.id | GeoJSON, Shapefile |

**Data Admin yang Digunakan:**
- **Batas Kota Bekasi:** Polygon kota + kelurahan/kecamatan
- **Kontrol Kualitas:** Validate topology, repair polygon jika perlu

### 4. Data Raster Historis (Opsional)

| Sumber | Tipe Dataset | Resolusi | Akses | Format |
|--------|--------------|----------|-------|--------|
| [Google Earth Engine (GEE)](https://earthengine.google.com) | Sentinel-1 SAR, Landsat, SRTM DEM, CHIRPS rainfall | 10-30 m | Python API | Cloud-optimized GeoTIFF |
| [USGS Earth Explorer](https://earthexplorer.usgs.gov) | Landsat archive, SRTM raw | 30 m | Download portal | GeoTIFF |

**Data Raster yang Digunakan (optional):**
- **DEM/Slope:** SRTM 30m untuk analisis kerentanan longsor
- **Rainfall:** CHIRPS monthly untuk analisis banjir seasonal
- **Landsat NDVI:** Untuk analisis vegetation coverage
- **Sentinel-1 SAR:** Untuk detection genangan banjir (water body vs land)

**Kontrol Kualitas:**
- Reclassify kontinyu → diskret (rendah/sedang/tinggi)
- Polygonize raster → vector
- Merge dengan vector hazard layer

---

## 📁 Struktur Repository

```
mapid-project/
│
├── 📄 README.md                          ← You are here
├── 📄 LICENSE                            # MIT License
├── 📄 .gitignore                         # Git ignore patterns
├── 📄 package.json                       # Root monorepo config (optional)
│
├── 📂 front-end/                         # 🎨 Frontend Vite + Vanilla JS
│   ├── 📄 index.html                     # Landing page (entry point 1)
│   ├── 📄 map.html                       # WebMap halaman (entry point 2)
│   ├── 📄 package.json                   # npm dependencies
│   ├── 📄 vite.config.js                 # Multi-page build config
│   ├── 📄 tailwind.config.js             # Tailwind CSS config
│   ├── 📄 .env.example                   # Template environment variables
│   ├── 📄 .gitignore
│   │
│   ├── 📂 public/                        # Static assets (favicon, images)
│   │   └── favicon.svg
│   │
│   └── 📂 src/
│       ├── 📂 webmap/                    # WebMap application
│       │   ├── 📄 main.js                # Entry point, init all modules
│       │   ├── 📄 map.js                 # MapLibre GL initialization
│       │   ├── 📄 layers.js              # Layer management (add/toggle)
│       │   ├── 📄 popup.js               # Feature popup builder & handler
│       │   ├── 📄 timeline.js            # Time series slider + filtering
│       │   ├── 📄 analysis.js            # Buffer/isochrone UI trigger
│       │   └── 📄 api.js                 # Fetch wrapper, error handling
│       │
│       ├── 📂 landing/                   # Landing page application
│       │   └── 📄 landing.js             # Landing page interactions
│       │
│       ├── 📂 styles/                    # Global styles
│       │   ├── 📄 webmap.css             # WebMap-specific styles
│       │   ├── 📄 landing.css            # Landing page styles
│       │   └── 📄 style.css              # Global reusable styles
│       │
│       ├── 📂 config/
│       │   └── 📄 config.js              # Map center, zoom, layer config
│       │
│       ├── 📂 controls/                  # UI controls
│       │   └── 📄 controlsBasic.js       # Map controls (zoom, search, toggle)
│       │
│       ├── 📂 layers/                    # Layer definitions
│       │   ├── 📄 vector.js              # Vector layer handler
│       │   └── 📄 raster.js              # Raster layer handler (optional)
│       │
│       ├── 📂 popUps/                    # Popup templates
│       │   └── 📄 basicpopups.js         # Popup HTML templates
│       │
│       ├── 📂 engine/                    # Analysis tools
│       │   ├── 📄 areaTool.js            # Area calculation tool
│       │   └── 📄 bufferTool.js          # Buffer interactive tool
│       │
│       └── 📂 utils/                     # Utility functions
│           ├── 📄 helpers.js             # Common functions
│           └── 📄 validators.js          # Input validation
│
├── 📂 back-end/                          # 🔧 Backend Node.js (Express.js, CORS, pg)

```

**Key Structure Highlights:**

---

## 🚀 Deployment & CI/CD

### Frontend Deployment

**Platform:** Netlify (recommended) / GitHub Pages / Vercel

**Setup Netlify (via GitHub Integration):**


**GitHub Actions Workflow (`.github/workflows/deploy-frontend.yml`):**


**Netlify Configuration (`front-end/netlify.toml`):**


### Backend Deployment

**Platform:** Railway / Render / Heroku / AWS EC2

**Setup Railway:**



**GitHub Actions Workflow (`.github/workflows/deploy-backend.yml`):**


**Backend Environment Variables (`.env` / GitHub Secrets):**



---

## ▶️ Cara Menjalankan

### Prerequisites

Pastikan sudah installed:
- **Node.js** 16+ dan npm
- **Python** 3.8+ dan pip
- **PostgreSQL** 12+ dengan PostGIS 3.0+
- **Git**

### Step-by-Step Setup

#### **1. Clone Repository**


#### **2. Setup Backend (Python)**


**Verifikasi Backend:**

#### **3. Setup Frontend (Node.js)**


**Akses Aplikasi:**

#### **4. Build untuk Production**

#### **5. Using Docker (Optional)**

---

## 📖 Dokumentasi Teknis

### API Documentation

Lihat [API_REFERENCE.md](docs/API_REFERENCE.md) untuk:
- Endpoint list lengkap
- Request/response examples
- Error codes & handling
- Rate limiting & caching strategy

### Database Schema

Lihat [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) untuk:
- Table structure detail
- Spatial indexes
- Sample queries

### System Architecture

Lihat [ARCHITECTURE.md](docs/ARCHITECTURE.md) untuk:
- Component diagram
- Data flow
- Technology stack justification

### Deployment Guide

Lihat [DEPLOYMENT.md](docs/DEPLOYMENT.md) untuk:
- Railway/Render setup
- GitHub Actions workflows
- Environment configuration
- Backup & disaster recovery

---

## 🗓️ Roadmap

### Timeline Pengembangan (8 Minggu)

| **Minggu** | **Milestone** | **Fokus Utama** | **Deliverable** |
|---|---|---|---|
| **1** | **Planning & Setup** | Penetapan wilayah studi, audit data, setup environment | ✅ Environment siap, data sources identified, GitHub repo setup |
| **2** | **Infrastructure** | PostgreSQL+PostGIS setup, database schema, ETL scripts | ✅ Database online, initial data loaded, backend boilerplate |
| **3** | **MVP Peta** | Landing page design, basemap MapLibre, basic layer API | ✅ Landing page live, peta dasar tampil, 2 endpoint API berfungsi |
| **4** | **Fitur Unggulan #1 (Awal)** | Layer hazard styling, popup info, buffer calculation | ✅ Risk layer visible, popup menampilkan detail, buffer endpoint working |
| **5** | **Fitur Unggulan #1 (Lanjut)** | Buffer radius render, isochrone backend compute | ✅ Fitur Unggulan #1 selesai, isochrone prototipe jalan |
| **6** | **Fitur Unggulan #2 & Analytics** | Isochrone render, time series slider, heatmap | ✅ Fitur Unggulan #2 selesai, time series filtering berfungsi, heatmap tampil |
| **7** | **Polish & Optimization** | Responsive design, performa testing, responsivitas mobile | ✅ Semua fitur MVP stabil, responsive tested, load time <3s |
| **8** | **Finalisasi & Sidang** | Deployment production, dokumentasi final, presentasi | ✅ WebGIS live di URL public, semua docs lengkap, sidang berhasil |

### Feature Backlog (Post-MVP)

- [ ] **v2.0:** Real-time hazard alerts via push notification
- [ ] **v2.0:** Mobile app (React Native / Flutter)
- [ ] **v2.0:** Advanced analytics dashboard (time series forecasting)
- [ ] **v2.0:** Community reporting feature (crowdsourced hazard data)
- [ ] **v3.0:** Multi-language support (EN, ID, Javanese)
- [ ] **v3.0:** Integration dengan early warning system BMKG

---

## ⚠️ Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Strategi Mitigasi |
|--------|-----------|--------|-------------------|
| **Data BPBD/BNPB tidak lengkap** | Tinggi | Cakupan analisis terbatas | Fallback ke OSM + survey manual, tambah disclaimer di UI |
| **ORS API rate limit / paid subscription** | Sedang | Isochrone timeout pada traffic tinggi | Setup OSMnx self-compute (gratis), implementasi caching, rate limiting |
| **Query PostGIS lambat saat data besar** | Sedang | UX jelek pada zoom tinggi, timeout API | Build spatial index GIST, precompute density, limit feature count |
| **Scope creep feature requests** | Tinggi | Deadline terlewat | Kunci MVP minggu 1, move extra features ke "Optional" backlog |
| **Kesalahan CRS/geometri data** | Sedang | Misalignment peta, buffer salah | Validasi & standardisasi EPSG:4326 di ETL, test spatial queries |
| **Server down / database crash** | Rendah | Downtime aplikasi | Backup harian, redundant database, monitoring alerts |
| **Security vulnerability** | Rendah | Data leak / unauthorized access | Input validation, SQL injection prevention, HTTPS only, rate limiting |

---

## ✅ Deliverables Checklist

- ✅ **Aplikasi WebGIS** live & deployed (landing page + webmap + API)
- ✅ **Repository GitHub** — source code terdokumentasi, README lengkap
- ✅ **Database Production** — PostgreSQL+PostGIS dengan data historis 5+ tahun
- ✅ **REST API** — semua endpoint documented & tested
- ✅ **Laporan Tugas Akhir** — BAB 1-5 (latar belakang, metodologi, hasil, pembahasan, kesimpulan)
- ✅ **Dokumentasi Teknis** — API spec, database schema, deployment guide
- ✅ **Video Demo** — walkthrough fitur & analisis spasial (~5-10 menit)
- ✅ **Slide Presentasi** — untuk sidang tugas akhir (~20 slide)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan untuk tujuan akademis, komersial, atau internal.

```
MIT License

Copyright (c) 2024 GeoInsight Team - MAPID

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

**Attribution untuk Data Spasial:**

- **BNPB/DIBI data** — sesuai [Term of Service BNPB](https://dibi.bnpb.go.id)
- **OSM data** — sesuai [ODbL license](https://www.openstreetmap.org/copyright)
- **BIG data** — sesuai [BIG data sharing policy](https://www.big.go.id)
- **GEE data** — sesuai [Google Earth Engine Terms](https://earthengine.google.com/terms/)

---

## 🤝 Kontribusi & Dukungan

### Reporting Issues

Temukan bug atau punya saran? Buka [GitHub Issue](https://github.com/yourusername/mapid-project/issues) dengan template:
- **Bug Report:** Describe, reproduce steps, expected vs actual
- **Feature Request:** Use case, proposed solution, benefit

### Contributing Code

Pull requests welcome! Ikuti:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk guidelines detail.

### Contact

- 📧 **Email:** your-email@example.com
- 💬 **GitHub Issues:** [Buka issue](https://github.com/yourusername/mapid-project/issues)
- 💬 **GitHub Discussions:** [Mulai diskusi](https://github.com/yourusername/mapid-project/discussions)

---

## 📚 Referensi & Bacaan Lanjutan

### Official Documentation
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- [PostGIS Manual 3.0](https://postgis.net/docs/manual-3.0/)
- [GeoPandas User Guide](https://geopandas.org/docs/user_guide.html)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)

### Geospatial Resources
- [OpenRouteService API](https://openrouteservice.org/dev/)
- [OSMnx + NetworkX Tutorial](https://medium.com/nerd-for-tech/routing-with-osmnx-and-networkx)
- [PostGIS Spatial Indexing](https://postgis.net/docs/manual-3.0/using_postgis_dbmanagement.html)
- [Shapely Geometric Operations](https://shapely.readthedocs.io/en/stable/reference/shapely.html)

### Data Sources
- [DIBI BNPB Data Portal](https://dibi.bnpb.go.id)
- [InaRISK Risk Platform](https://inarisk.bnpb.go.id)
- [Bappenas Geospatial](https://gis-bappenas.id/)
- [Google Earth Engine](https://earthengine.google.com/)

### Best Practices
- [Web Mapping Best Practices](https://wiki.openstreetmap.org/wiki/Web_maps)
- [Spatial Database Performance](https://trac.osgeo.org/postgis/wiki/Performance)
- [GeoJSON Specification](https://tools.ietf.org/html/rfc7946)
- [RESTful API Design](https://restfulapi.net/)

---

<div align="center">

**🌍 GeoInsight — Enabling Safer Communities Through Geospatial Intelligence** 🚀

</div>
