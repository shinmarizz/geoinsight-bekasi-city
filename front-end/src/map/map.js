import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, Marker, Popup } from 'maplibre-gl';
import { areaGeometry } from '../engine/areaTool';
import { bufferGeometry } from '../engine/bufferTool';  
import { addPopup } from '../../popUps/basicpopups';
import { addAttribution } from '../../controls/controlsBasic';  
import { API_BASE } from '../config';

const existingMap = document.getElementById('map')
let mapElement = existingMap

if (!mapElement) {
  mapElement = document.createElement('div')
  mapElement.id = 'map'
  mapElement.style.width = '100%'
  mapElement.style.height = '100vh'
  document.body.appendChild(mapElement)
}

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.overflowX = 'hidden'
document.body.style.overflowY = 'auto'

const app = document.createElement('div')
app.style.display = 'flex'
app.style.flexDirection = 'column'
app.style.width = '100%'
app.style.minHeight = '100vh'

const header = document.createElement('header')
header.className = 'bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-md shrink-0'
header.style.display = 'flex'
header.style.alignItems = 'center'
header.style.justifyContent = 'space-between'
header.style.height = '64px'
header.style.padding = '0 24px'
header.style.background = 'white'
header.style.color = 'black'
header.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.2)'

const name = document.createElement('div')
name.style.display = 'flex'
name.style.alignItems = 'center'
name.style.gap = '10px'
name.style.fontWeight = '700'
name.style.letterSpacing = '0.04em'
name.innerHTML = '<span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:#10b981"></span> GeoInsight Dashboard'

const profile = document.createElement('div')
profile.textContent = 'Analisis Spasial'
profile.style.color = 'black'
profile.style.fontSize = '10px'
profile.style.fontWeight = '500px'
profile.style.letterSpacing = '0.5px'
profile.style.padding = '10px 20px'
profile.style.borderRadius = '10px'
profile.style.border = '2px solid black'
profile.style.background = 'linear-gradient(pearl)'
profile.style.display = 'inline-flex'
profile.style.alignItems = 'center'
profile.style.gap = '3px'
profile.style.transition = 'transform 0.2s ease, box-shadow 0.1 s'
profile.style.cursor = 'pointer'

profile.addEventListener('mouseenter', () => {
  profile.style.transform = 'translateY(-2px) scale(1.02)'
})
profile.addEventListener('mouseleave', () => {
  profile.style.transform = 'translateY(0) scale(1)'
})

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

const responsePuskesmas = await fetch(`${API_BASE}/api/routes/puskesmas`)

if (!responsePuskesmas.ok) {
  throw new Error(`Gagal mengambil data puskesmas: ${responsePuskesmas.status}`)
}

const puskesmas = await responsePuskesmas.json()

const responseFlood = await fetch(`${API_BASE}/api/routes/flood`)

if (!responseFlood.ok){
  throw new Error(`Gagal mengambil data flood: ${responseFlood.status}`)
}
map.addControl(new maplibregl.NavigationControl())
map.addControl(new maplibregl.FullscreenControl())
map.addControl(new maplibregl.GlobeControl())

// Tambahkan Attribution
addAttribution(map, '')

map.on('load', () => {
    console.log('Berhasil')
    map.resize()
    
    // Puskesmas
    map.addSource('puskesmasRoute', {
        type:'geojson',
      data: puskesmas
    })
    
    map.addLayer({
        id: 'puskesmas',
      type: 'circle',
        source: 'puskesmasRoute',
        paint: {
        'circle-color': '#0080ff',
        'circle-radius': 7,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
        }
    })

    // Flood 

    map.addSource('floodRoute', {
        type:'geojson',
      data: flood
    })
    
    map.addLayer({
        id: 'flood',
      type: 'circle',
        source: 'floodRoute',
        paint: {
        'circle-color': '#0080ff',
        'circle-radius': 7,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
        }
    })

      if (flood.features.length > 0) {
        const bounds = new maplibregl.LngLatBounds()
        puskesmas.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates)
        })
        map.fitBounds(bounds, { padding: 60, maxZoom: 13 })
      }
    
    
    // Event listener untuk menghitung Buffer Geometry saat user klik
    map.on('click', 'buffer-geometry-layer', (event) => {
        console.log('Buffer Geometry clicked')
        bufferGeometry(map, event)
        addPopup(map, event)
    })
    
    // Ubah cursor ketika hover di layer
    map.on('mouseenter', 'area-geometry-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'area-geometry-layer', () => {
        map.getCanvas().style.cursor = ''
    })
    
})

window.addEventListener('load', () => {
    map.resize()
})