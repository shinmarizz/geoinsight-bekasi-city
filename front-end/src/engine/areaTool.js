import { geojsonToWKT} from "@terraformer/wkt"
import { API_BASE } from "../config"

export function areaGeometry (event) {
    const geometry = event.feature[0].geometry
    const wkt = geojsonToWKT(geometry)

    compute(wkt)
}

export async function compute(wkt){
    const response = await fetch (`${API_BASE}/spatial_computation/area`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({geometry:wkt})
    })

    const result = await response.json()

    const output = document.getElementById("luas")
    output.textContent = `${result.area_ha.toLocaleString("ID-id")} ${result.unit}`

return result
}
