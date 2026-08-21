import floodService from "../services/floodService.js"

export const getFloodData = async (req,res) => {
    try{
        const data = await floodService.getFloodData()

        const geojson = {
            type : "FeatureCollection",
            features: data.map((row) => ({
                    type:"Feature",
                    properties:{
                        gid:row.gid,
                        kecamatan: row.kecamatan,
                        desa:row.desa,
                        kelas_risi: row.kelas_risi
                    },
                    geometry:row.geom
                }))
        }   
        res.json(geojson)

    } catch(err){
        console.log(err)
        res.status(500).json(
            {
            message : ("Failed to fetch Flood Data"),
            error: err.message
        }
        )
    }
}