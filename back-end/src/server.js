import express from 'express'
import cors from 'cors'
require("dotenv").config()

import puskesmasRoute from "../routes/puskesmas"
import floodRoute from "../routes/flood"
import bufferRoute from "../routes/buffer"
import hospitalsRoute from "../routes/hospitals"

const app = express()


app.use(/api/routes, "puskesmasRoute")
app.use(/api/routes, "floodRoute")
app.use(/api/routes, "bufferRoute")
app.use(/api/route, "hospitalRoute")

const PORT = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`Server is running! oh http://localhost:${PORT}`)
})
