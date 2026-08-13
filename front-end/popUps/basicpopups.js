import { Popup } from "maplibre-gl";
import { storeAreaGeometry} from "../src/engine/areaTool"

const popup = new Popup()

export function addPopup (map, event){
    const coordinate  = event.lngLat
    const longitude  = coordinate.lng.toFixed(2)
    const lattitude = coordinate.lat.toFixed(2)

    const properties = event.features[0].properties
    const city = properties.NAME

    console.log(properties)

    return popup
    .settingLat(event.lat)
    .setHTML(`
            <div>
                <h3>${cityName}</h3>
                <div>Bujur: ${longitude}</div>
                <div>Lintang: ${latitude}</div>
            </div>    
        `)
        .addTo(map)
}
   
export function addPulauPopup(map, event){
    const result = storeAreaGeometry(event)
    
    return popup
        .setLngLat(event.lngLat)
        .setHTML(`
            <div>
                <div id="luas"></div>
            </div>    
        `)
        .addTo(map)
}