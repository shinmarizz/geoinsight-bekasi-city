import express from "express"
import { getShortestPath } from "../controllers/networkAnalysis.controller.js"

const router = express.Router()

router.get("/network/route", getShortestPath)

export default router
