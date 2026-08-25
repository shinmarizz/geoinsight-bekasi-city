import { geojsonToWKT } from "@terraformer/wkt"
import { API_BASE } from "../config"

export function areaGeometry(event) {
    const geometry = event.features[0].geometry
    const wkt = geojsonToWKT(geometry)

    return compute(wkt)
}

export async function compute(wkt) {
    const response = await fetch(`${API_BASE}/spatial_computation/area`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geometry: wkt })
    })

    const result = await response.json()
    return result
}
