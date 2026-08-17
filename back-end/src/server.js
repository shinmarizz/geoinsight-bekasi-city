const express = require('express')

const app = express()

app.get("/geoinsight")

const PORT = 5001
const server = app.listen(PORT, ()=>{
    console.log(`Berhasil ${PORT}`)
})


//GET POST PUT DELETE
// https://localhost:5001/geoinsight