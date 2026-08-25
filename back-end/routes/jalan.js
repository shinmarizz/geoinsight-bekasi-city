import express from "express"
import { getJalanData } from "../controllers/jalan.controller.js"

const router = express.Router()

router.get("/jalan", getJalanData)

export default router
