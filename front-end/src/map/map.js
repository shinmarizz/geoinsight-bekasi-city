import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, Marker, Popup } from 'maplibre-gl';

const existingMap = document.getElementById('map')
let mapElement = existingMap

if (!mapElement) {
  mapElement = document.createElement('div')
  mapElement.id = 'map'
  mapElement.style.width = '80%'
  mapElement.style.height = '50vh'
  document.body.appendChild(mapElement)
}

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.overflow = 'hidden'

const app = document.createElement('div')
app.style.display = 'flex'
app.style.flexDirection = 'column'
app.style.width = '100%'
app.style.height = '100vh'

const header = document.createElement('header')
header.className = 'bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-md shrink-0'
header.style.display = 'flex'
header.style.alignItems = 'center'
header.style.justifyContent = 'space-between'
header.style.height = '64px'
header.style.padding = '0 24px'
header.style.background = '#0f172a'
header.style.color = '#fff'
header.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.2)'

const name = document.createElement('div')
name.style.display = 'flex'
name.style.alignItems = 'center'
name.style.gap = '10px'
name.style.fontWeight = '700'
name.style.letterSpacing = '0.04em'
name.innerHTML = '<span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:#10b981"></span> GeoInsight Dashboard'

const profile = document.createElement('div')
profile.textContent = 'Mode Analisis Spasial'
profile.style.color = '#cbd5e1'
profile.style.fontSize = '14px'
profile.style.border =  "3px solid blue"
profile.style.borderWidth = "5px";
profile.style.backgroundColor = "yellow";

header.append(name, profile)

if (!existingMap) {
  app.appendChild(header)
  app.appendChild(mapElement)
  document.body.appendChild(app)
} else {
  const wrapper = document.createElement('div')
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.width = '100%'
  wrapper.style.height = '100vh'
  wrapper.appendChild(header)
  wrapper.appendChild(mapElement)
  document.body.appendChild(wrapper)
}

const map = new maplibregl.Map({
  container: mapElement,
  style: 'https://demotiles.maplibre.org/style.json',
  center: [107.0, -6.2],
  zoom: 10,
  maplibreLogo: true,
})

map.addControl(new maplibregl.NavigationControl())
map.addControl(new maplibregl.FullscreenControl())
map.addControl(new maplibregl.GlobeControl())

map.on('load', () => {
  console.log('Map berhasil dimuat')
  map.resize()
})

window.addEventListener('load', () => {
  map.resize()
})