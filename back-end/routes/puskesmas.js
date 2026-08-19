import express from "express"
import { getPuskesmasData } from "../controllers/puskesmas.controller.js"

const router = express.Router()

router.get("/puskesmas", getPuskesmasData)

export default router