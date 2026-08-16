import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt"
import { API_BASE } from "../config"
import { compute } from "./areaTool"

export function bufferGeometry(map, event){
    const geometry = event.features[0].geometry
    const wkt = geojsonToWKT(geometry)

    computeBuffer(map, wkt)    
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

    const result = await response.json()
    const data  = wktToGeoJSON(result.wkt)

    console.log('Buffer geometry:', data)
    
    // Update buffer geometry source di map
    if (map.getSource('buffer-geometry-source')) {
        map.getSource('buffer-geometry-source').setData({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: data,
                properties: {}
            }]
        })
    }

    return result
}
