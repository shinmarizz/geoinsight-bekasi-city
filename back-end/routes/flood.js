import express from "express"
import { getFloodData } from "../controllers/flood.controller.js"

const router = express.Router()

router.get("/flood", getFloodData)

export default router
