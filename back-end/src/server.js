import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'

import puskesmasRoute from "../routes/puskesmas.js"
import floodRoute from "../routes/flood.js"
import bufferRoute from "../routes/buffer.js"
import hospitalsRoute from "../routes/hospitals.js"
import jalanRoute from "../routes/jalan.js"
import networkAnalysisRoute from "../routes/networkAnalysis.js"
import spatialAnalysisRoute from "../routes/spatialAnalysis.js"

configDotenv()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/routes', puskesmasRoute)
app.use('/api/routes', floodRoute)
app.use('/api/routes', bufferRoute)
app.use('/api/routes', hospitalsRoute)
app.use('/api/routes', jalanRoute)
app.use('/api/routes', networkAnalysisRoute)
app.use('/api/routes', spatialAnalysisRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
