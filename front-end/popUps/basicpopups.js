import { Popup } from "maplibre-gl";

export function addPopup (map, event)
    const coordinate  = event.lngLat
    const longitude  = coordinate.lng.toFixed(2)
    const lattitude = coordinate.lat.toFixed(2)