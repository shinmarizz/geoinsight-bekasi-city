import { AttributionControl } from "maplibre-gl";

export function addAttribution(map, wkt){
    map.addControl(new AttributionControl({
        compact:true,
        customAttribution:att
    }))
}