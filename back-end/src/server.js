const express = require('express')
const cors = require('cors')
require("dotenv").config()

const puskesmasRoute = require("../routes/puskesmas")
const floodRoute = require("../routes/flood")
const bufferRoute = require("../routes/buffer")
const hospitalsRoute = require("../routes/hospitals")

const app = express()


app.use(/api/routes, "puskesmasRoute")
app.use(/api/routes, "floodRoute")
app.use(/api/routes, "bufferRoute")
app.use(/api/route, "hospitalRoute")

const PORT = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`Server is running! oh http://localhost:${PORT}`)
})
