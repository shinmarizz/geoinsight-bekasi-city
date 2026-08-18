# 🗺️ WebGIS GeoInsight - Mitigasi Bencana & Analisis Transportasi Kota Bekasi

<div align="center">

**Platform WebGIS Interaktif untuk Visualisasi Risiko Multi-Bencana & Jaringan Transportasi**

[🔗 Live Demo](#) · [📖 Dokumentasi](#-dokumentasi-teknis) · [📋 Lisensi](#-lisensi)

</div>

> **Proyek:** Tugas Akhir MAPID (Magister Administrasi dan Perencanaan Informasi Geografis)  
> **Fokus:** Mitigasi Bencana & Analisis Jaringan Jalan  
> **Lokasi Studi Kasus:** Kota Bekasi  
> **Timeline:** 6–8 minggu

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

Dengan menggunakan teknologi **open-source terkini** (MapLibre GL JS, PostgreSQL+PostGIS, Python, Vite), GeoInsight menawarkan solusi yang **scalable, cost-effective, dan berkelanjutan** untuk mitigasi bencana tingkat kota/kabupaten.

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

```python
# back-end/
├── main.py                 # Entry point Flask app
├── routes/
│   ├── __init__.py
│   ├── hazard.py          # GET /api/hazard/banjir, /api/hazard/longsor
│   ├── transport.py       # GET /api/transport/jalan, /api/transport/faskes
│   ├── analysis.py        # POST /api/analysis/buffer, /isochrone, /heatmap
│   └── health.py          # GET /api/health (monitoring)
├── services/
│   ├── db.py              # PostGIS connection pool, query helpers
│   ├── spatial_analysis.py # GeoPandas/Shapely operations
│   ├── isochrone_engine.py # OSMnx routing, network analysis
│   └── raster_processor.py # Rasterio, reclassify, polygonize
├── models/
│   └── schemas.py         # Request/response validation (Pydantic)
├── utils/
│   ├── config.py          # Environment loading, settings
│   ├── errors.py          # Custom exceptions
│   └── logger.py          # Structured logging
├── scripts/
│   ├── etl_hazard.py      # Load DIBI/BNPB data to PostGIS
│   ├── etl_transport.py   # Download OSM, load to PostGIS
│   ├── etl_admin.py       # Load batas admin
│   ├── raster_process.py  # GEE raster → vector pipeline
│   └── load_initial_data.py
├── spatial-processor-engine/  # Reusable spatial algorithms
│   ├── engine.py
│   ├── toolbox/
│   │   ├── geometry_manipulation/
│   │   │   ├── buffer.py
│   │   │   ├── centroid.py
│   │   │   └── intersections.py
│   │   ├── network_analysis/
│   │   │   └── dijkstra.py
│   │   └── spatial_computation/
│   │       ├── area.py
│   │       ├── distance.py
│   │       └── length.py
│   ├── README.md
│   └── requirements.txt
├── data/
│   ├── raw/               # Data mentah
│   ├── processed/         # ETL output
│   └── shp/               # Shapefile
├── tests/
│   ├── test_api.py
│   ├── test_spatial.py
│   └── test_isochrone.py
├── .env.example
├── requirements.txt
└── wsgi.py               # Gunicorn entry point
```

**API Endpoint Specification:**

```python
# Hazard Layer Endpoints
GET /api/hazard/banjir
  Params: ?date_start=2020-01-01&date_end=2023-12-31
  Response: GeoJSON FeatureCollection
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {"type": "Polygon", "coordinates": [...]},
        "properties": {
          "id": 1,
          "tanggal_kejadian": "2023-02-15",
          "tingkat_risiko": "tinggi",
          "area_terdampak": 1250.5,
          "jumlah_korban": 12
        }
      }
    ]
  }

GET /api/hazard/longsor
  Similar to /banjir endpoint

# Transport Layer Endpoints
GET /api/transport/jalan
  Response: GeoJSON FeatureCollection (LineString)

GET /api/transport/faskes
  Params: ?type=shelter|hospital|office
  Response: GeoJSON FeatureCollection (Point)

# Analysis Endpoints
POST /api/analysis/buffer
  Body: {
    "geometry": {"type": "Point", "coordinates": [107.0, -6.2]},
    "distance": 500,
    "hazard_type": "banjir"
  }
  Response: {
    "type": "Feature",
    "geometry": {"type": "Polygon", ...},
    "properties": {"buffer_radius": 500, "hazard_type": "banjir"}
  }

POST /api/analysis/isochrone
  Body: {
    "from": [107.0, -6.2],
    "intervals": [5, 10, 15, 20],
    "profile": "foot"  // or "car"
  }
  Response: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {"type": "Polygon", ...},
        "properties": {"time_minutes": 5, "area_km2": 0.85}
      }
    ]
  }

GET /api/analysis/heatmap
  Params: ?hazard_type=banjir&bandwidth=50
  Response: GeoJSON FeatureCollection (density Point)

# Health Check
GET /api/health
  Response: {"status": "ok", "version": "1.0.0"}
```

---

### 🗄️ Database Stack

**System:** PostgreSQL 12+ dengan PostGIS 3.0+

**Database Schema:**

```sql
-- 1. ADMIN BOUNDARY
CREATE TABLE public.admin_boundary (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
  admin_level INT,  -- 4=province, 6=district, 8=sub-district
  name VARCHAR(255),
  CONSTRAINT admin_boundary_geom_valid CHECK (ST_IsValid(geom))
);
CREATE INDEX idx_admin_boundary_geom ON admin_boundary USING GIST(geom);

-- 2. HAZARD: BANJIR
CREATE TABLE public.hazard_banjir (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(Polygon, 4326) NOT NULL,
  tanggal_kejadian DATE,
  tahun INT,
  bulan INT,
  tingkat_risiko VARCHAR(20),  -- 'rendah', 'sedang', 'tinggi'
  area_terdampak_km2 FLOAT,
  jumlah_kejadian INT,
  jumlah_korban INT,
  jumlah_kehilangan_rumah INT,
  keterangan TEXT,
  sumber_data VARCHAR(100),  -- 'DIBI BNPB', 'BPBD', etc
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT hazard_banjir_valid CHECK (ST_IsValid(geom)),
  CONSTRAINT hazard_banjir_risiko_valid CHECK (tingkat_risiko IN ('rendah', 'sedang', 'tinggi'))
);
CREATE INDEX idx_hazard_banjir_geom ON hazard_banjir USING GIST(geom);
CREATE INDEX idx_hazard_banjir_date ON hazard_banjir (tanggal_kejadian);
CREATE INDEX idx_hazard_banjir_risiko ON hazard_banjir (tingkat_risiko);

-- 3. HAZARD: LONGSOR
CREATE TABLE public.hazard_longsor (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(Polygon, 4326) NOT NULL,
  tanggal_kejadian DATE,
  tahun INT,
  tingkat_risiko VARCHAR(20),
  area_longsor_km2 FLOAT,
  jumlah_kejadian INT,
  jumlah_korban INT,
  kedalaman_lereng INT,  -- meters
  sudut_lereng FLOAT,    -- degrees
  jenis_tanah VARCHAR(100),
  vegetasi_coverage VARCHAR(20),  -- 'rapat', 'sedang', 'jarang'
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT hazard_longsor_valid CHECK (ST_IsValid(geom))
);
CREATE INDEX idx_hazard_longsor_geom ON hazard_longsor USING GIST(geom);
CREATE INDEX idx_hazard_longsor_date ON hazard_longsor (tanggal_kejadian);

-- 4. TRANSPORT: JALAN
CREATE TABLE public.transport_jalan (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(LineString, 4326) NOT NULL,
  osm_id BIGINT UNIQUE,
  nama_jalan VARCHAR(255),
  tipe_jalan VARCHAR(50),  -- 'primary', 'secondary', 'residential'
  panjang_m FLOAT,
  status_kerusakan VARCHAR(20),  -- 'baik', 'rusak_ringan', 'rusak_berat'
  status_banjir VARCHAR(20),  -- 'aman', 'rawan', 'sering_terendam'
  kelas_jalan INT,  -- 1-4
  surface VARCHAR(50),  -- 'aspal', 'beton', 'tanah'
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT transport_jalan_valid CHECK (ST_IsValid(geom))
);
CREATE INDEX idx_transport_jalan_geom ON transport_jalan USING GIST(geom);
CREATE INDEX idx_transport_jalan_osm_id ON transport_jalan (osm_id);
CREATE INDEX idx_transport_jalan_status ON transport_jalan (status_banjir);

-- 5. FACILITY: EVACUATION & HEALTHCARE
CREATE TABLE public.facility_evakuasi (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(Point, 4326) NOT NULL,
  osm_id BIGINT,
  nama VARCHAR(255) NOT NULL,
  tipe VARCHAR(50),  -- 'shelter', 'hospital', 'health_center', 'government_office'
  subtipe VARCHAR(100),  -- 'school', 'mosque', 'community_center' for shelter
  kapasitas_orang INT,
  kontak VARCHAR(20),
  alamat TEXT,
  akses_landuse VARCHAR(50),  -- 'mudah', 'sedang', 'sulit'
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT facility_valid CHECK (ST_IsValid(geom))
);
CREATE INDEX idx_facility_geom ON facility_evakuasi USING GIST(geom);
CREATE INDEX idx_facility_tipe ON facility_evakuasi (tipe);

-- 6. TRANSPORT NETWORK (untuk isochrone routing)
CREATE TABLE public.network_node (
  id BIGINT PRIMARY KEY,
  geom GEOMETRY(Point, 4326) NOT NULL,
  CONSTRAINT network_node_valid CHECK (ST_IsValid(geom))
);
CREATE INDEX idx_network_node_geom ON network_node USING GIST(geom);

CREATE TABLE public.network_edge (
  id BIGSERIAL PRIMARY KEY,
  source BIGINT REFERENCES network_node(id),
  target BIGINT REFERENCES network_node(id),
  geom GEOMETRY(LineString, 4326),
  length_m FLOAT,
  time_minutes FLOAT,  -- calculated travel time
  tipe_jalan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_network_edge_source ON network_edge (source);
CREATE INDEX idx_network_edge_target ON network_edge (target);

-- 7. HAZARD HEATMAP (precomputed density)
CREATE TABLE public.hazard_density (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(Point, 4326) NOT NULL,
  hazard_type VARCHAR(50),  -- 'banjir', 'longsor'
  density_value FLOAT,  -- KDE value
  bandwidth INT,  -- in meters
  year INT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT hazard_density_valid CHECK (ST_IsValid(geom))
);
CREATE INDEX idx_hazard_density_geom ON hazard_density USING GIST(geom);
CREATE INDEX idx_hazard_density_year ON hazard_density (year);
```

**Spatial Indexes & Query Optimization:**

```sql
-- GIST Index untuk spatial queries
CREATE INDEX idx_hazard_banjir_geom ON hazard_banjir USING GIST(geom);

-- BTREE Index untuk tanggal filtering (time series)
CREATE INDEX idx_hazard_banjir_date ON hazard_banjir (tanggal_kejadian DESC);

-- Combined index untuk common filters
CREATE INDEX idx_hazard_banjir_date_risiko 
  ON hazard_banjir (tanggal_kejadian DESC, tingkat_risiko);

-- Query optimization: use spatial filter first, then attribute filter
EXPLAIN (ANALYZE) 
SELECT * FROM hazard_banjir 
WHERE ST_Intersects(geom, ST_MakeEnvelope(106.8, -6.4, 107.2, -6.0, 4326))
AND tanggal_kejadian >= '2020-01-01';
```

**Typical Spatial Queries:**

```python
# Python psycopg2 example

# 1. Buffer/Risk Zone Query
def get_risk_buffer(conn, geom_point, distance_m):
    """Calculate buffer zone around point"""
    query = """
    SELECT ST_AsGeoJSON(ST_Buffer(ST_GeomFromGeoJSON(%s), %s))
    """
    cursor = conn.cursor()
    cursor.execute(query, (geom_point, distance_m))
    return cursor.fetchone()[0]

# 2. Intersection Query (hazard + location)
def get_hazard_at_location(conn, lat, lon):
    """Get hazard polygons containing point"""
    query = """
    SELECT ST_AsGeoJSON(b.geom), b.tingkat_risiko, b.tanggal_kejadian
    FROM hazard_banjir b
    WHERE ST_Contains(b.geom, ST_Point(%s, %s, 4326))
    ORDER BY b.tanggal_kejadian DESC
    LIMIT 1
    """
    cursor = conn.cursor()
    cursor.execute(query, (lon, lat))
    return cursor.fetchall()

# 3. Nearest Feature Query (for isochrone)
def get_nearest_shelter(conn, lat, lon, max_distance_m=5000):
    """Find nearest shelter within max distance"""
    query = """
    SELECT id, nama, tipe, kapasitas_orang,
           ST_AsGeoJSON(geom),
           ST_Distance(geom, ST_Point(%s, %s, 4326)) as dist_m
    FROM facility_evakuasi
    WHERE tipe = 'shelter'
    AND ST_DWithin(geom, ST_Point(%s, %s, 4326), %s)
    ORDER BY dist_m ASC
    LIMIT 5
    """
    cursor = conn.cursor()
    cursor.execute(query, (lon, lat, lon, lat, max_distance_m))
    return cursor.fetchall()
```

---

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

| Script | Input | Output | Frequency |
|--------|-------|--------|-----------|
| `etl_admin.py` | BIG tanahair.id | admin_boundary table | Once (initial load) |
| `etl_hazard.py` | DIBI BNPB CSV/SHP | hazard_banjir, hazard_longsor | Monthly update |
| `etl_transport.py` | OSM Overpass | transport_jalan, facility_evakuasi | Quarterly |
| `raster_process.py` | GEE GeoTIFF export | reclassified vector | As needed |
| `build_network.py` | OSM jalan + network | network_node, network_edge | Quarterly |
| `compute_heatmap.py` | hazard_banjir, hazard_longsor | hazard_density (KDE) | Monthly |

**Sample ETL Script (`etl_hazard.py`):**

```python
import geopandas as gpd
import pandas as pd
from shapely.geometry import shape
import psycopg2
from psycopg2.extras import execute_values

def load_dibi_data(dibi_csv_path, db_conn):
    """
    Load DIBI BNPB data ke PostGIS
    """
    # Read DIBI CSV (asumsi ada kolom: geometry WKT, tanggal, risiko)
    df = pd.read_csv(dibi_csv_path)
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs='EPSG:4326')
    
    # Validate & clean
    gdf = gdf[gdf.geometry.is_valid]
    gdf['tanggal_kejadian'] = pd.to_datetime(gdf['tanggal_kejadian'])
    gdf['tahun'] = gdf['tanggal_kejadian'].dt.year
    gdf['tingkat_risiko'] = gdf['risiko_level'].map({
        'tinggi': 'tinggi',
        'sedang': 'sedang',
        'rendah': 'rendah'
    })
    
    # Insert ke database
    cursor = db_conn.cursor()
    for idx, row in gdf.iterrows():
        query = """
        INSERT INTO hazard_banjir 
        (geom, tanggal_kejadian, tahun, tingkat_risiko, area_terdampak_km2, 
         jumlah_korban, sumber_data)
        VALUES (ST_GeomFromText(%s, 4326), %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
        """
        cursor.execute(query, (
            row.geometry.wkt,
            row['tanggal_kejadian'],
            row['tahun'],
            row['tingkat_risiko'],
            row['area_km2'],
            row['jumlah_korban'],
            'DIBI BNPB'
        ))
    db_conn.commit()
    print(f"✅ Loaded {len(gdf)} records into hazard_banjir")
```

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
├── 📂 back-end/                          # 🔧 Backend Python (Flask/FastAPI)
│   ├── 📄 main.py                        # Flask app entry point
│   ├── 📄 wsgi.py                        # Gunicorn entry point
│   ├── 📄 requirements.txt                # Python dependencies
│   ├── 📄 .env.example                   # Template environment variables
│   ├── 📄 .gitignore
│   │
│   ├── 📂 routes/                        # API route handlers
│   │   ├── 📄 __init__.py
│   │   ├── 📄 hazard.py                  # GET /api/hazard/*
│   │   ├── 📄 transport.py               # GET /api/transport/*
│   │   ├── 📄 analysis.py                # POST /api/analysis/*
│   │   └── 📄 health.py                  # GET /api/health
│   │
│   ├── 📂 services/                      # Business logic
│   │   ├── 📄 __init__.py
│   │   ├── 📄 db.py                      # Database connection, queries
│   │   ├── 📄 spatial_analysis.py        # GeoPandas/Shapely operations
│   │   ├── 📄 isochrone_engine.py        # OSMnx routing
│   │   └── 📄 raster_processor.py        # Raster operations
│   │
│   ├── 📂 models/                        # Data models
│   │   ├── 📄 __init__.py
│   │   └── 📄 schemas.py                 # Request/response schemas (Pydantic)
│   │
│   ├── 📂 utils/                         # Utility functions
│   │   ├── 📄 config.py                  # Config loading (dotenv)
│   │   ├── 📄 errors.py                  # Custom exceptions
│   │   ├── 📄 logger.py                  # Logging setup
│   │   └── 📄 decorators.py              # Function decorators
│   │
│   ├── 📂 scripts/                       # ETL & maintenance scripts
│   │   ├── 📄 etl_admin.py               # Load admin boundary
│   │   ├── 📄 etl_hazard.py              # Load DIBI hazard data
│   │   ├── 📄 etl_transport.py           # Load OSM transport data
│   │   ├── 📄 raster_process.py          # GEE raster → vector
│   │   ├── 📄 build_network.py           # Build routing network
│   │   └── 📄 compute_heatmap.py         # Precompute KDE density
│   │
│   ├── 📂 spatial-processor-engine/      # Reusable spatial lib
│   │   ├── 📄 engine.py
│   │   ├── 📄 README.md
│   │   ├── 📄 requirements.txt
│   │   │
│   │   └── 📂 toolbox/
│   │       ├── 📂 geometry_manipulation/
│   │       │   ├── 📄 buffer.py
│   │       │   ├── 📄 centroid.py
│   │       │   ├── 📄 intersections.py
│   │       │   └── 📄 dissolve.py
│   │       │
│   │       ├── 📂 network_analysis/
│   │       │   ├── 📄 dijkstra.py
│   │       │   ├── 📄 isochrone.py
│   │       │   └── 📄 connectivity.py
│   │       │
│   │       └── 📂 spatial_computation/
│   │           ├── 📄 area.py
│   │           ├── 📄 distance.py
│   │           ├── 📄 length.py
│   │           └── 📄 density.py
│   │
│   ├── 📂 data/                          # Local data (development)
│   │   ├── 📂 raw/                       # Original raw data
│   │   │   ├── administrasikotabekasi.geojson
│   │   │   └── bekasi_jalan.geojson
│   │   │
│   │   ├── 📂 processed/                 # ETL processed data
│   │   │   └── [ETL output files]
│   │   │
│   │   └── 📂 shp/                       # Shapefile data
│   │       ├── batas_bekasi.{shp,shx,dbf,prj,cpg}
│   │       ├── bekasi_bekasi.{shp,shx,dbf,prj}
│   │       └── puskesmas_utm.{shp,shx,dbf,prj,cpg}
│   │
│   ├── 📂 tests/                         # Unit & integration tests
│   │   ├── 📄 test_api.py
│   │   ├── 📄 test_spatial.py
│   │   ├── 📄 test_isochrone.py
│   │   └── 📄 conftest.py                # Pytest fixtures
│   │
│   └── 📂 migrations/                    # Database schema migrations (optional)
│       └── 📄 001_initial_schema.sql
│
├── 📂 .github/                           # GitHub configuration
│   ├── 📂 workflows/                     # CI/CD pipelines
│   │   ├── 📄 deploy-frontend.yml        # Frontend deploy (Netlify/GitHub Pages)
│   │   ├── 📄 deploy-backend.yml         # Backend deploy (Railway/Render)
│   │   ├── 📄 test-backend.yml           # Backend tests
│   │   └── 📄 lint.yml                   # Code linting
│   │
│   └── 📂 ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── 📂 docs/                              # Documentation
│   ├── 📄 ARCHITECTURE.md                # System architecture detail
│   ├── 📄 DATABASE_SCHEMA.md             # Database schema docs
│   ├── 📄 API_REFERENCE.md               # Endpoint documentation
│   ├── 📄 DEPLOYMENT.md                  # Deployment guide
│   ├── 📄 CONTRIBUTING.md                # Contribution guidelines
│   └── 📂 images/                        # Documentation images/diagrams
│       └── architecture.png
│
└── 📄 docker-compose.yml                 # (optional) Local dev environment
```

**Key Structure Highlights:**
- ✅ **Monorepo structure** — front-end & back-end dalam satu repo
- ✅ **Modular organization** — separation of concerns (routes, services, models)
- ✅ **Data directory** — untuk raw & processed data (lokal development)
- ✅ **CI/CD workflows** — GitHub Actions untuk automated testing & deployment
- ✅ **Documentation** — comprehensive docs in `/docs` folder

---

## 🚀 Deployment & CI/CD

### Frontend Deployment

**Platform:** Netlify (recommended) / GitHub Pages / Vercel

**Setup Netlify (via GitHub Integration):**

```bash
# 1. Connect GitHub repository ke Netlify web console
# 2. Set build settings:
#    - Build command: npm run build
#    - Publish directory: dist/
# 3. Add environment variables (site settings):
#    VITE_API_BASE_URL=https://api.yourdomain.com
#    VITE_MAPTILER_KEY=your_maptiler_api_key
# 4. Save & deploy — automatic on every push to main
```

**GitHub Actions Workflow (`.github/workflows/deploy-frontend.yml`):**

```yaml
name: Deploy Frontend to Netlify

on:
  push:
    branches: [main]
    paths:
      - 'front-end/**'
      - '.github/workflows/deploy-frontend.yml'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: front-end/package-lock.json
      
      - name: Install dependencies
        run: cd front-end && npm install
      
      - name: Build
        run: cd front-end && npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_MAPTILER_KEY: ${{ secrets.MAPTILER_KEY }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './front-end/dist'
          production-deploy: true
          netlify-config-path: ./front-end/netlify.toml
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Netlify Configuration (`front-end/netlify.toml`):**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18.0.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  environment = { VITE_API_BASE_URL = "https://api.yourdomain.com" }

[context.deploy-preview]
  environment = { VITE_API_BASE_URL = "https://api-staging.yourdomain.com" }
```

### Backend Deployment

**Platform:** Railway / Render / Heroku / AWS EC2

**Setup Railway:**

```bash
# 1. Connect GitHub repository ke Railway web console
# 2. Railway detects Python runtime → automatic setup
# 3. Configure build:
#    - Build command: pip install -r requirements.txt
#    - Start command: gunicorn -w 4 -b 0.0.0.0:$PORT main:app
# 4. Add PostgreSQL plugin (Railway marketplace)
# 5. Set environment variables:
#    DATABASE_URL=postgresql://user:pass@host:5432/db
#    FLASK_ENV=production
#    SECRET_KEY=xxx
#    OPENROUTESERVICE_KEY=xxx
# 6. Deploy triggered automatically on push to main
```

**GitHub Actions Workflow (`.github/workflows/deploy-backend.yml`):**

```yaml
name: Deploy Backend to Railway

on:
  push:
    branches: [main]
    paths:
      - 'back-end/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_geoinsight
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          cache: pip
          cache-dependency-path: 'back-end/requirements.txt'
      
      - name: Install dependencies
        run: |
          cd back-end
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        run: |
          cd back-end
          pytest tests/ -v --cov=. --cov-report=xml
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_geoinsight
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
      
      - name: Deploy to Railway
        if: success()
        uses: railwayapp/action@v1
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Backend Environment Variables (`.env` / GitHub Secrets):**

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/geoinsight_db

# Flask
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here

# API Configuration
API_PORT=8000
API_WORKERS=4

# External APIs
OPENROUTESERVICE_KEY=your_ors_api_key

# Logging
LOG_LEVEL=INFO
```

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

```bash
git clone https://github.com/yourusername/mapid-project.git
cd mapid-project
```

#### **2. Setup Backend (Python)**

```bash
# Masuk direktori backend
cd back-end

# Buat virtual environment
python -m venv venv

# Aktifkan venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Setup PostgreSQL & PostGIS
# Buat database (di PostgreSQL shell atau pgAdmin):
# CREATE DATABASE geoinsight_db;
# CREATE EXTENSION postgis;

# Setup environment variables
cp .env.example .env
# Edit .env dengan detail PostgreSQL, API keys, dll:
# - DATABASE_URL=postgresql://user:password@localhost:5432/geoinsight_db
# - FLASK_ENV=development
# - OPENROUTESERVICE_KEY=your_key

# Load initial data (ETL)
python scripts/etl_admin.py
python scripts/etl_hazard.py
python scripts/etl_transport.py
python scripts/build_network.py

# Jalankan backend
python main.py
# Output: Running on http://127.0.0.1:5000
```

**Verifikasi Backend:**

```bash
# Test API health check
curl http://localhost:5000/api/health
# Expected: {"status": "ok", "version": "1.0.0"}

# Test data endpoint
curl http://localhost:5000/api/hazard/banjir
# Expected: GeoJSON FeatureCollection
```

#### **3. Setup Frontend (Node.js)**

```bash
# Buka terminal baru, di direktori project root
cd front-end

# Install Node dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env:
# VITE_API_BASE_URL=http://localhost:5000
# VITE_MAPTILER_KEY=your_maptiler_api_key

# Jalankan dev server
npm run dev
# Output: Local: http://localhost:5173/
```

**Akses Aplikasi:**
- Landing Page: [http://localhost:5173/](http://localhost:5173/)
- WebMap: [http://localhost:5173/map](http://localhost:5173/map)

#### **4. Build untuk Production**

```bash
# Frontend build
cd front-end
npm run build
# Output: dist/ folder (siap deploy ke Netlify)

# Backend package (gunakan Gunicorn)
cd ../back-end
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

#### **5. Using Docker (Optional)**

```bash
# Backend Docker
cd back-end
docker build -t geoinsight-backend:latest .
docker run -p 5000:5000 --env-file .env geoinsight-backend:latest

# Full stack dengan docker-compose (di root)
docker-compose up -d
# Services: frontend (5173), backend (5000), postgres (5432)
```

**`docker-compose.yml` (Optional):**

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:13-3.1
    environment:
      POSTGRES_DB: geoinsight_db
      POSTGRES_USER: geouser
      POSTGRES_PASSWORD: geopass123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./back-end
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://geouser:geopass123@postgres:5432/geoinsight_db
      FLASK_ENV: development
    depends_on:
      - postgres
    volumes:
      - ./back-end:/app

  frontend:
    build: ./front-end
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:5000
    volumes:
      - ./front-end:/app
      - /app/node_modules

volumes:
  postgres_data:
```

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

**Last Updated:** 2024-08-19  
**Project Status:** Development (Minggu 1-2)  
**Maintained By:** [Your Name / Team]  
**Advisor:** [Pembimbing MAPID]  
**Institution:** MAPID (Magister Administrasi dan Perencanaan Informasi Geografis)

---

<div align="center">

**🌍 GeoInsight — Enabling Safer Communities Through Geospatial Intelligence** 🚀

</div>
