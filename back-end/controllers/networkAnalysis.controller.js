import networkAnalysisService from "../services/networkAnalysisService.js"

const numberParam = (value) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : NaN
}

const isValidCoordinate = (longitude, latitude) =>
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 && longitude <= 180 &&
    latitude >= -90 && latitude <= 90

export const getIsochrone = async (req, res) => {
    try {
        const longitude = numberParam(req.query.lng)
        const latitude = numberParam(req.query.lat)
        const minutes = Math.min(60, Math.max(1, numberParam(req.query.minutes) || 15))
        const mode = String(req.query.mode || "jalan_kaki")

        if (!isValidCoordinate(longitude, latitude)) {
            return res.status(400).json({ message: "lng dan lat harus berupa koordinat yang valid" })
        }

        const result = await networkAnalysisService.getNetworkIsochrone({ longitude, latitude, minutes, mode })
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(error.message.includes("jaringan") ? 422 : 500).json({
            message: error.message.includes("jaringan") ? error.message : "Gagal menghitung isochrone",
            error: error.message
        })
    }
}

export const getShortestPath = async (req, res) => {
    try {
        const startLng = numberParam(req.query.startLng)
        const startLat = numberParam(req.query.startLat)
        const endLng = numberParam(req.query.endLng)
        const endLat = numberParam(req.query.endLat)
        const mode = String(req.query.mode || "jalan_kaki")

        if (!isValidCoordinate(startLng, startLat) || !isValidCoordinate(endLng, endLat)) {
            return res.status(400).json({ message: "Koordinat awal dan akhir harus valid" })
        }

        const result = await networkAnalysisService.getShortestPath({ startLng, startLat, endLng, endLat, mode })
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(error.message.includes("jaringan") ? 422 : 500).json({
            message: error.message.includes("jaringan") ? error.message : "Gagal menghitung rute terpendek",
            error: error.message
        })
    }
}

export default { getIsochrone, getShortestPath }
