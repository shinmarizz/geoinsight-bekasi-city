# WebGIS Mitigasi Bencana & Transportasi - GeoInsight 

> Tugas Akhir — MAPID
> WebGIS interaktif untuk visualisasi risiko multi-bencana yang diintegrasikan dengan data transportasi/jaringan jalan, guna mendukung mitigasi bencana di tingkat kota/kabupaten.

**Tema:** Multi-hazard · **Cakupan:** Kota/Kabupaten (spesifik) · **Timeline:** 6–8 minggu

---

## 📋 Daftar Isi

- [Deskripsi Proyek](#-deskripsi-proyek)
- [Fitur Unggulan (Value Proposition)](#-fitur-unggulan-value-proposition)
- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Sumber Data](#-sumber-data)
- [Struktur Folder](#-struktur-folder-usulan)
- [Cara Menjalankan](#-cara-menjalankan-usulan)
- [Roadmap / Timeline](#-roadmap--timeline)
- [Risiko & Mitigasi](#-risiko--mitigasi)
- [Deliverables](#-deliverables)
- [Langkah Selanjutnya](#-langkah-selanjutnya)

---

## 📖 Deskripsi Proyek

Proyek ini membangun WebGIS yang memvisualisasikan data kebencanaan **banjir dan longsor** — divisualisasikan sebagai **time series** (perkembangan kejadian dari waktu ke waktu) — yang diintegrasikan dengan data transportasi, untuk mendukung kebutuhan mitigasi bencana. Output berupa landing page + peta interaktif berbasis **MapLibre GL JS** dengan fitur analisis spasial dasar (popup, heatmap, radius, isochrone).

**Studi kasus:** 1 kota/kabupaten spesifik (perlu ditetapkan di minggu pertama — cek ketersediaan data terlebih dahulu, prioritaskan wilayah dengan riwayat banjir & longsor yang terdokumentasi baik di DIBI BNPB).

**Kenapa banjir & longsor, bukan gempa:** kedua hazard ini secara alami tervisualisasikan sebagai **area yang berkembang dari waktu ke waktu** (extent genangan, zona kerentanan musiman) — cocok untuk fitur time series. Gempa bersifat kejadian instan (titik episenter), sehingga kurang koheren untuk dianimasikan per waktu. Banjir & longsor juga punya relevansi langsung ke tema transportasi (jalan tergenang/tertimbun = akses evakuasi terputus), selaras dengan 2 fitur unggulan project ini.

**Batasan scope:**
- 1 wilayah studi kasus (bukan nasional/provinsi)
- 2 jenis hazard: **banjir dan longsor**
- Data historis/sekunder dengan atribut tanggal kejadian (bukan real-time sensor)
- Isochrone memakai routing engine open-source, bukan model custom

---

## 🎯 Fitur Unggulan (Value Proposition)

Dari seluruh kemungkinan fitur, dua ide berikut dipilih sebagai **nilai jual utama** karena paling berdampak langsung ke pengguna, sekaligus tidak menambah scope teknis baru (memanfaatkan fitur MVP+Optional yang sudah direncanakan):

### 1️⃣ "Apakah lokasi saya aman?" — Cek Risiko Lokasi Pribadi
Pengguna klik/cari alamat/titik di peta → sistem menampilkan tingkat risiko banjir & longsor di titik tersebut (popup informasi) beserta radius bahaya di sekitarnya (buffer dari sumber risiko terdekat: sungai, lereng rawan longsor, dsb.).
- **User story:** *"Sebagai warga, saya ingin tahu seberapa berisiko lokasi tempat tinggal/aktivitas saya, agar bisa bersiap sebelum bencana terjadi."*
- **Fitur teknis yang dipakai:** Popup + Radius/Buffer (MVP)

### 2️⃣ "Kalau tidak aman, saya harus ke mana dan berapa lama?" — Peta Evakuasi & Isochrone
Dari lokasi pengguna, sistem menghitung & menampilkan jangkauan waktu tempuh (isochrone) ke titik aman terdekat (shelter/faskes/kantor pemerintah), sehingga pengguna tahu opsi evakuasi realistis dari posisinya.
- **User story:** *"Sebagai warga dalam situasi darurat, saya ingin tahu titik aman terdekat dan estimasi waktu tempuh ke sana, agar bisa mengambil keputusan evakuasi dengan cepat."*
- **Fitur teknis yang dipakai:** Isochrone (Optional → jadi prioritas karena masuk value proposition utama)

> Fitur lain (rute alternatif jalan terdampak, pencarian faskes terpisah, dashboard heatmap) tetap ada sebagai pendukung/backlog, namun tidak jadi fokus utama — heatmap misalnya cukup jadi pelengkap narasi landing page, dan pencarian faskes "menumpang" sebagai variasi tujuan pada fitur isochrone di atas.

---

## ✨ Fitur

### MVP (Wajib)
- [ ] **Landing Page** — hero section, penjelasan tujuan, highlight wilayah & hazard yang dicover
- [ ] **WebMap Interaktif** — base layer, kontrol toggle layer, zoom/pan/geolocate
- [ ] **Integrasi Data Spasial** — 2 layer hazard (banjir & longsor) + 1 layer transportasi
- [ ] **Popup Informasi** — klik feature/lokasi untuk detail risiko *(mendukung Fitur Unggulan #1)*
- [ ] **Heatmap** — sebaran kepadatan kejadian bencana historis (pendukung narasi/edukasi)
- [ ] **Radius/Buffer** — buffer jarak dari titik rawan bencana, dihitung via PostGIS/GeoPandas *(mendukung Fitur Unggulan #1)*
- [ ] **Isochrone** — waktu tempuh ke titik evakuasi/faskes/shelter terdekat, OSMnx+NetworkX atau ORS API *(mendukung Fitur Unggulan #2 — dinaikkan prioritasnya dari Optional ke wajib karena jadi nilai jual utama)*
- [ ] **Time Series Layer** — slider waktu untuk melihat perkembangan kejadian banjir & longsor dari tahun/periode ke periode (lihat detail di bawah)

### Optional (Jika waktu cukup)
- [ ] Rute alternatif transportasi saat jalan terdampak bencana
- [ ] Dashboard statistik ringkas (jumlah kejadian, area terdampak per periode)
- [ ] Mode animasi otomatis (tombol play) untuk time series, bukan hanya geser manual

> Karena isochrone & time series naik jadi fitur wajib, alokasikan waktu development lebih awal (mulai minggu 4-5, bukan menunggu MVP lain selesai dulu) — lihat penyesuaian di Roadmap.

---

## ⏱ Time Series — Detail Implementasi

Setiap layer hazard (banjir & longsor) wajib punya atribut tanggal kejadian, sehingga bisa difilter berdasarkan waktu.

**Skema data:** kolom `tanggal_kejadian` (date) wajib ada di setiap tabel PostGIS hazard — baik data dari DIBI BNPB maupun hasil polygonize raster GEE.

**Pendekatan (default — MVP, tanpa refetch berulang):**
- Semua data historis di-load sekali di awal (`fetch` saat WebMap dibuka).
- Slider waktu (`<input type="range">`, vanilla JS, tanpa library tambahan) mengatur nilai tanggal.
- Saat slider digeser: `map.setFilter('hazard-layer', ['<=', ['get', 'tanggal_unix'], sliderValue])` — MapLibre memfilter feature yang sudah di-load di client, tanpa perlu request baru ke API.
- Cocok untuk skala data 1 kota/kabupaten (volume historis realistis untuk di-load sekaligus).

**Alternatif (jika volume data ternyata besar):** endpoint API menerima parameter `?start_date=&end_date=`, backend query PostGIS dengan filter tanggal, frontend `setData()` ulang tiap slider berubah. Lebih berat di request tapi lebih ringan di payload awal — pertimbangkan hanya jika pendekatan default terasa lambat saat testing.

---

## 🛠 Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Peta Frontend | **MapLibre GL JS** | Open-source, ringan |
| Frontend | **Vanilla JavaScript (ES6+)** dengan **Vite** sebagai dev server & bundler | Tetap tanpa framework/state management; Vite dipakai untuk hot reload saat dev dan build multi-page (`index.html` + `webmap.html`) untuk production |
| Styling | CSS murni / Tailwind via CDN | Tanpa build process |
| Basemap | MAPID Basemap / MapTiler / OpenFreeMap | Cek dulu apakah MAPID punya basemap tile service internal |
| Database Spasial | **PostgreSQL + PostGIS** | Menyimpan seluruh data hazard, transportasi, hasil analisis |
| Backend / Analisis Geospasial | **Python** (Flask/FastAPI) + **GeoPandas, Shapely, psycopg2/SQLAlchemy** | Semua analisis (buffer, density, isochrone) dihitung di backend, hasil di-serve sebagai GeoJSON |
| Data Serving | GeoJSON langsung via REST API | Cukup untuk skala kota/kabupaten; vector tiles (pg_tileserv) hanya jika data mulai berat |
| Raster Processing | **rasterio + numpy** (Python) | Untuk data raster historis (mis. hasil ekspor Google Earth Engine — genangan banjir, kerentanan longsor, DEM/slope). **Default: reclassify jadi kelas risiko diskret (rendah/sedang/tinggi) → polygonize jadi vector**, lalu diperlakukan sama seperti layer hazard lain (masuk PostGIS, di-serve sebagai GeoJSON) |
| Raster Serving (cadangan, hanya jika benar-benar butuh gradasi kontinu) | **titiler** (Python, self-host) menyajikan Cloud Optimized GeoTIFF (COG) sebagai XYZ tile | Tidak dipakai secara default. Baru dipertimbangkan kalau ada requirement eksplisit menampilkan raster mentah tanpa reklasifikasi (mis. hillshade dekoratif) |
| Isochrone Engine | **Python: OSMnx + NetworkX** (self-compute) atau proxy ke **OpenRouteService (ORS) API** | OSMnx lebih academically defensible — metodenya bisa dijelaskan detail di laporan |
| Heatmap | MapLibre `heatmap` layer (built-in, client-side) | Density bisa di-precompute via GeoPandas jika perlu |
| Hosting | Netlify/GitHub Pages (frontend statis) + VPS/Railway/Render (Python backend + PostgreSQL) | Frontend & backend deploy terpisah |

---

## 🏗 Arsitektur Sistem

```
[Data Sumber: BNPB/InaRISK, BPBD, BMKG, OSM, Bappeda]
        ↓ (ETL pakai Python: GeoPandas/Shapely, cleaning & transformasi ke PostGIS)
[Data Raster Historis: ekspor GeoTIFF, mis. dari Google Earth Engine]
        ↓ (Raster processing pakai rasterio)
[Reclassify jadi kelas risiko diskret → polygonize] ── DEFAULT, dipakai untuk semua layer hazard
        ↓
[PostgreSQL + PostGIS]
        ↓ (query spasial)
[Backend Python: Flask/FastAPI]
   ├─ Endpoint data hazard & transportasi (GeoJSON)
   ├─ Endpoint analisis: buffer/radius (GeoPandas/PostGIS ST_Buffer)
   ├─ Endpoint isochrone (OSMnx+NetworkX, atau proxy ke ORS API)
   └─ Endpoint agregasi heatmap (opsional precompute density)
        ↓ (REST API — response GeoJSON)
[Frontend: Vanilla JavaScript + MapLibre GL JS]
   ├─ Landing Page (HTML/CSS statis)
   └─ WebMap App (fetch API → render semua layer via geojson-source + popup + heatmap + radius + isochrone)
```

**Cabang cadangan (tidak default, opsional):** kalau ada requirement eksplisit menampilkan raster kontinu tanpa reklasifikasi (mis. hillshade dekoratif dari DEM), raster di-convert ke COG lalu disajikan lewat **titiler** sebagai service terpisah, dan frontend menambah satu `raster-source` khusus untuk layer itu saja — tidak mengubah pipeline layer hazard utama di atas.

Struktur kode frontend dipisah per modul (`map.js`, `layers.js`, `popup.js`, `api.js`) agar tetap terorganisir tanpa framework/state management library.

---

## 🗂 Sumber Data

**Hazard:**
- [InaRISK BNPB](https://inarisk.bnpb.go.id) — peta risiko bencana per kabupaten/kota
- [DIBI BNPB](https://dibi.bnpb.go.id) — data historis kejadian bencana
- BMKG — data curah hujan/cuaca
- PusGeN — peta rawan gempa/sesar

**Transportasi & Infrastruktur:**
- OpenStreetMap (jaringan jalan, fasilitas umum) via Overpass API / Geofabrik extract
- Titik faskes/sekolah/kantor pemerintah — OSM / Bappeda setempat
- Titik evakuasi/shelter — BPBD daerah (atau digitasi manual jika tidak tersedia)

**Batas Administrasi:**
- Badan Informasi Geospasial (BIG) — tanahair.indonesia.go.id

**Data Raster Historis (turunan citra satelit):**
- Google Earth Engine — ekspor GeoTIFF, mis. genangan banjir historis (Sentinel-1 SAR), DEM/slope untuk kerentanan longsor, curah hujan historis (CHIRPS)
- Diproses lokal via `rasterio` sebelum masuk ke pipeline (lihat Arsitektur Sistem)

---

## 📁 Struktur Folder (Usulan — Vite)

```
webgis-mitigasi-bencana/
├── frontend/
│   ├── index.html                   # Landing page (entry HTML utama)
│   ├── webmap.html                  # Halaman WebMap (entry HTML kedua)
│   ├── package.json
│   ├── vite.config.js               # konfigurasi multi-page build (rollupOptions.input)
│   ├── .env                         # var VITE_API_BASE_URL, VITE_MAPTILER_KEY, dst.
│   ├── public/                      # asset statis, disalin apa adanya saat build (favicon, gambar)
│   │   └── favicon.svg
│   └── src/
│       ├── landing/
│       │   └── landing.js           # JS khusus landing page (entry untuk index.html)
│       ├── webmap/
│       │   ├── main.js              # entry point untuk webmap.html, import modul di bawah
│       │   ├── map.js               # init MapLibre & basemap
│       │   ├── layers.js            # load & toggle layer hazard/transportasi
│       │   ├── popup.js             # handler popup feature
│       │   ├── timeline.js          # slider waktu + setFilter time series (banjir & longsor)
│       │   ├── analysis.js          # trigger buffer/isochrone ke backend
│       │   └── api.js               # fetch wrapper (pakai import.meta.env.VITE_API_BASE_URL)
│       └── styles/
│           ├── landing.css
│           └── webmap.css
├── backend/
│   ├── app.py                       # Entry point Flask/FastAPI
│   ├── routes/
│   │   ├── hazard.py
│   │   ├── transport.py
│   │   ├── buffer.py
│   │   └── isochrone.py
│   ├── services/
│   │   ├── db.py                    # Koneksi PostGIS
│   │   ├── spatial_analysis.py      # GeoPandas/Shapely logic
│   │   └── isochrone_engine.py      # OSMnx + NetworkX
│   ├── scripts/
│   │   ├── gee_export.py            # (opsional) trigger export data GEE via earthengine-api
│   │   └── raster_to_vector.py      # DEFAULT: reclassify + polygonize raster jadi GeoJSON → load ke PostGIS
│   └── requirements.txt
├── raster-tiles/                    # ⚠️ CADANGAN, tidak dipakai default — hanya jika perlu raster kontinu
│   ├── docker-compose.yml           # (opsional) titiler sbg service Docker terpisah
│   └── cogs/                        # (opsional) menyimpan file .tif hasil convert, di-mount ke titiler
├── data/
│   ├── raw/                         # data mentah dari sumber asli (BNPB, OSM, dll)
│   ├── raster/                      # hasil ekspor GeoTIFF dari GEE (sebelum diproses)
│   └── processed/                   # hasil ETL siap masuk PostGIS (GeoJSON/vector)
└── README.md
```

**Catatan konfigurasi `vite.config.js`** (multi-page, karena ada landing page + webmap sebagai HTML terpisah):

```js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        webmap: resolve(__dirname, 'webmap.html'),
      },
    },
  },
})
```

Tetap **vanilla JavaScript** — Vite di sini hanya berperan sebagai dev server (hot reload) + bundler untuk build production, bukan menambah framework/state management. Modul JS tetap ditulis manual dengan ES module (`import`/`export`) seperti direncanakan sebelumnya.

---

## ▶️ Cara Menjalankan (Usulan)

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# set koneksi PostgreSQL di .env
python app.py

# Frontend (Vite)
cd frontend
npm install
npm run dev        # dev server + hot reload, default di http://localhost:5173
npm run build       # build production ke folder dist/ (multi-page: dist/index.html & dist/webmap.html)
npm run preview     # preview hasil build production secara lokal
```

`package.json` minimal untuk frontend:

```json
{
  "name": "webgis-frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  },
  "dependencies": {
    "maplibre-gl": "^4.0.0"
  }
}
```

---

## 🗓 Roadmap / Timeline

| Minggu | Fokus | Output |
|---|---|---|
| 1 | Penetapan studi kasus, audit data, draft proposal BAB 1–3 | Wilayah studi fix, data tersedia terdaftar |
| 2 | Setup environment (PostgreSQL+PostGIS, venv Python+Flask/FastAPI, struktur frontend), wireframe, ETL awal | Environment siap, wireframe disetujui |
| 3 | Landing page + basemap MapLibre + endpoint API pertama (batas admin, jalan) | Landing page jadi, peta dasar tampil dari API |
| 4 | Integrasi layer hazard (2 layer) via API + styling + popup (Fitur Unggulan #1 mulai terbentuk) + **mulai bangun graph jalan OSMnx untuk isochrone** di backend (paralel, karena butuh waktu riset/testing) | Layer hazard tampil + popup jalan, prototipe graph routing siap diuji |
| 5 | Radius/Buffer (selesaikan Fitur Unggulan #1) + Isochrone endpoint & render di peta (progres Fitur Unggulan #2) + **skema tanggal_kejadian & slider waktu dasar** | Fitur Unggulan #1 selesai, isochrone mulai bisa didemokan, slider waktu berfungsi |
| 6 | Heatmap + penyempurnaan isochrone (variasi tujuan: shelter/faskes) + **finalisasi time series (styling per periode, testing filter banjir & longsor)** + testing responsif | Fitur Unggulan #2 stabil, time series & heatmap tampil |
| 7 | Testing menyeluruh, optimasi performa, dokumentasi teknis, BAB 4 | Sistem stabil, draft BAB 4 |
| 8 | Revisi, finalisasi laporan, persiapan sidang | WebGIS final + laporan lengkap, 2 fitur unggulan siap didemokan |

---

## ⚠️ Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Data BPBD/BNPB tidak lengkap | Fallback ke OSM + BIG, disclaimer keterbatasan data di laporan |
| ORS API rate limit / butuh key | Daftar key sejak minggu 1, atau full self-compute pakai OSMnx |
| Query spasial lambat untuk data besar | Index spasial di PostGIS (`GIST`), precompute hasil analisis berat |
| Scope creep | Kunci MVP di minggu 1, ide tambahan masuk backlog "Optional" |

---

## ✅ Deliverables

- Aplikasi WebGIS live (landing page + webmap) — deployed
- Source code (repository, terdokumentasi)
- Laporan tugas akhir (BAB 1–5)
- Dokumentasi teknis arsitektur sistem
- Video demo / slide presentasi sidang

---

## 🚀 Langkah Selanjutnya

1. Pilih 1 kota/kabupaten spesifik sebagai studi kasus.
2. Tentukan 2 jenis hazard yang difokuskan.
3. Konfirmasi ke pembimbing MAPID: ada basemap/API internal wajib pakai?
4. Mulai audit data dari InaRISK, OSM, dan BIG.

---

## 📄 Lisensi

*Tambahkan lisensi sesuai ketentuan kampus/MAPID (mis. MIT untuk source code, atau internal use only jika bagian dari program magang/kerja praktik).*