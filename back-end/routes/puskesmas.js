import { Pool } from "express"
import pool from "../src/db"
import { getPuskesmasData } from "../controllers/puskesmas.controller"

const router = express.Router()

router.get("/", getPuskesmasData =>{
    res.json({
        message:"Puskesmas endpoint"
    })
})

module.export = router