import express from "express"
import { getIsochrone, getPuskesmasHeatmap } from "../controllers/spatialAnalysis.controller.js"

const router = express.Router()

router.get("/heatmap/puskesmas", getPuskesmasHeatmap)
router.get("/isochrone", getIsochrone)

export default router