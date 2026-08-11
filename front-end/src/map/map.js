import {Map, FullscreenControl, GlobeControl, LogoControl, NavigationControl} from 'maplibre-gl'
import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.2.0/dist/maplibre-gl.mjs';
import 'maplibre-gl/dist/maplibre-gl.css'

const tailwindSRC = document.createElement('script')
tailwindSRC.src = 'https://cdn.tailwindcss.com'
document.head.appendChild(tailwindSRC)

const mapElement = document.createElement('div')
mapElement.id = 'map'
mapElement.style.height = "500px"
document.body.appendChild(mapElement)

const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1, // starting zoom
    maplibreLogo: true
})

map.addControl(new FullscreenControl())
map.addControl(new GlobeControl())