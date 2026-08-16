import { AttributionControl } from "maplibre-gl";

export function addAttribution(map, attribution = 'GeoInsight Dashboard'){
    map.addControl(new AttributionControl({
        compact:true,
        customAttribution: attribution
    }))
}