import networkAnalysisService from "../services/networkAnalysisService.js"
import spatialAnalysisService from "../services/spatialAnalysisService.js"

const numberParam = (value, fallback) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

export const getPuskesmasHeatmap = async (req, res) => {
    try {
        const radiusMeters = Math.min(5000, Math.max(50, numberParam(req.query.radius, 750)))
        const rows = await spatialAnalysisService.getPuskesmasHeatmap(radiusMeters)
        res.json({
            type: "FeatureCollection",
            features: rows.map((row) => ({
                type: "Feature",
                properties: { gid: row.gid, nama: row.nama, intensity: Number(row.intensity) },
                geometry: row.geom
            }))
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to calculate heatmap", error: error.message })
    }
}

export const getIsochrone = async (req, res) => {
    try {
        const longitude = numberParam(req.query.lng, NaN)
        const latitude = numberParam(req.query.lat, NaN)

        if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
            return res.status(400).json({ message: "lng dan lat harus berupa koordinat yang valid" })
        }

        const result = await networkAnalysisService.getNetworkIsochrone({
            longitude,
            latitude,
            minutes: numberParam(req.query.minutes, 15),
            mode: req.query.mode || "jalan_kaki"
        })
        res.json(result)
    } catch (error) {
        console.error(error)
        if (String(error.message).includes("jaringan")) {
            return res.status(422).json({ message: error.message })
        }
        res.status(500).json({ message: "Gagal menghitung isochrone", error: error.message })
    }
}
