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
        const minutes = Math.min(120, Math.max(1, numberParam(req.query.minutes, 15)))
        const speedKmh = Math.min(80, Math.max(1, numberParam(req.query.speedKmh, 5)))

        if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
            return res.status(400).json({ message: "lng dan lat harus berupa koordinat yang valid" })
        }

        const result = await spatialAnalysisService.getIsochrone({ longitude, latitude, minutes, speedKmh })
        res.json({
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: { minutes, speedKmh, distanceMeters: result.distanceMeters },
                geometry: result.geom
            }]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to calculate isochrone", error: error.message })
    }
}
