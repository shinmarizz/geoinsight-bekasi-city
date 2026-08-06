import {Map, FullscreenControl, GlobeControl, LogoControl} from 'maplibre-gl'
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.2.0/dist/maplibre-gl.mjs';
import 'maplibre-gl/dist/maplibre-gl.css'
import './style.css'


const mapElement = document.createElement('div')
mapElement.id = 'map'
mapElement.style.height = "200px"
document.body.appendChild(mapElement)

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/globe.json',
  center: [106.83, -6.19],
  zoom: 12,
  attributionControl: false,
  cooperativeGestures: true
})

map.addControl(new FullscreenControl())
map.addControl(new GlobeControl())
