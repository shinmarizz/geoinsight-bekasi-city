import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt"
import { API_BASE } from "../config"
import { compute } from "./areaTool"

export function storeBuffer(map, event){
    const geometry = event.features[0].geometry
    const wkt = geojsonToWKT(geometry)

    computeBuffer()    
}

async function computeBuffer(map, wkt){
    const response = await fetch(`${API_BASE}/geometry_manipulation/buffer`, {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({
            geometry:wkt,
            distance_m:100
        })
    })

    const result = await responsejsp.json()
    const data  = wktToGeoJSON(result.wkt)

    addBuffer(map,data)

    return result
}
