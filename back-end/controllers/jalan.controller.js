import jalanService from "../services/jalanService.js"

const ROAD_CLASS_COLORS = {
  "Jalan Tol Dua Jalur Dengan Pemisah Fisik": "#7c3aed",
  "Jalan Tol Dua Jalur Tanpa Pemisah Fisik": "#8b5cf6",
  "Jalan Arteri": "#dc2626",
  "Jalan Kolektor": "#ea580c",
  "Jalan Lokal": "#2563eb",
  "Jalan Setapak": "#0d9488",
  "Jalan Lain": "#9ca3af"
}

export const getJalanData = async (req, res) => {
  try {
    const simplified = req.query.simplified !== "0"
    const rows = await jalanService.getJalanData({ simplified })

    const geojson = {
      type: "FeatureCollection",
      features: rows.map((row) => ({
        type: "Feature",
        properties: {
          gid: row.gid,
          kelas_jalan: row.remark,
          warna: ROAD_CLASS_COLORS[row.remark] ?? ROAD_CLASS_COLORS["Jalan Lain"],
          panjang_meter: Number(row.panjang_meter)
        },
        geometry: row.geom
      }))
    }

    res.json(geojson)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Gagal mengambil data jalan Bekasi",
      error: error.message
    })
  }
}

export default { getJalanData }
