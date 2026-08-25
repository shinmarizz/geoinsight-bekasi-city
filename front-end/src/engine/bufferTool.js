import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt"
import { API_BASE } from "../config"

const BUFFER_SOURCE_ID = 'buffer-geometry-source'

export function bufferGeometry(map, event) {
    const geometry = event.features[0].geometry
    const wkt = geojsonToWKT(geometry)

    return computeBuffer(map, wkt)
}

async function computeBuffer(map, wkt) {
    const response = await fetch(`${API_BASE}/spatial_computation/buffer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            geometry: wkt,
            distance: 100
        })
    })

    const result = await response.json()
    const data = wktToGeoJSON(result.wkt)

    if (!map.getSource(BUFFER_SOURCE_ID)) {
        map.addSource(BUFFER_SOURCE_ID, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: data,
                    properties: {}
                }]
            }
        })

        map.addLayer({
            id: 'buffer-fill',
            type: 'fill',
            source: BUFFER_SOURCE_ID,
            paint: {
                'fill-color': '#f59e0b',
                'fill-opacity': 0.2
            }
        })

        map.addLayer({
            id: 'buffer-outline',
            type: 'line',
            source: BUFFER_SOURCE_ID,
            paint: {
                'line-color': '#d97706',
                'line-width': 2
            }
        })
    } else {
        map.getSource(BUFFER_SOURCE_ID).setData({
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

export function clearBuffer(map) {
    const source = map.getSource(BUFFER_SOURCE_ID)
    if (source) source.setData({ type: 'FeatureCollection', features: [] })
}
