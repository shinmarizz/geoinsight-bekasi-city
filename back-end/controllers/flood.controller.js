import floodService from "../services/floodService.js"

export const getFloodData = async (req,res) => {
    try{
        const data  = floodService.getFloodData()

        const geojson = {
            type : "FeatureCollection",
            features: (row) => (
                {
                    type:"Feature",
                    properties:{
                        gid:row.gid,
                        desa:row.desa
                    },
                    geometry:row.geom
                }
            )
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