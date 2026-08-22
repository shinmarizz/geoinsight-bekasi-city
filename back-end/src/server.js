import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'

import puskesmasRoute from "../routes/puskesmas.js"
import floodRoute from "../routes/flood.js"
import bufferRoute from "../routes/buffer.js"
import hospitalsRoute from "../routes/hospitals.js"

configDotenv()

const app = express()

app.use(cors())


app.use('/api/routes', puskesmasRoute) 
app.use('/api/routes', floodRoute)
app.use('/api/routes', bufferRoute)
app.use('/api/routes', hospitalsRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server is running! oh http://localhost:${PORT}`)
    
})
