import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, Marker, Popup } from 'maplibre-gl';
import { areaGeometry } from '../engine/areaTool';
import { bufferGeometry } from '../engine/bufferTool';  
import { addPopup } from '../../popUps/basicpopups';
import { addAttribution } from '../../controls/controlsBasic';  
import { API_BASE, DEFAULT_MAP_STYLE, GEOMAPID_STYLE } from '../config';

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
  style: GEOMAPID_STYLE,
  center: [107.0, -6.2],
  zoom: 10,
  maplibreLogo: true,
})

let usingFallbackStyle = false
map.on('error', (event) => {
  if (!usingFallbackStyle && GEOMAPID_STYLE !== DEFAULT_MAP_STYLE) {
    console.error('Style GeoMapid tidak dapat dimuat. Menggunakan style fallback.', event.error)
    usingFallbackStyle = true
    map.setStyle(DEFAULT_MAP_STYLE)
  }
})

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] }

const loadGeoJson = async (path, label) => {
  const response = await fetch(`${API_BASE}/api/routes/${path}`)
  if (!response.ok) {
    throw new Error(`Gagal mengambil data ${label}: ${response.status}`)
  }
  return response.json()
}

const [puskesmasResult, floodResult] = await Promise.allSettled([
  loadGeoJson('puskesmas', 'puskesmas'),
  loadGeoJson('flood', 'flood')
])

const puskesmas = puskesmasResult.status === 'fulfilled'
  ? puskesmasResult.value
  : emptyFeatureCollection
const flood = floodResult.status === 'fulfilled'
  ? floodResult.value
  : emptyFeatureCollection

if (puskesmasResult.status === 'rejected') console.error(puskesmasResult.reason)
if (floodResult.status === 'rejected') console.error(floodResult.reason)

map.addControl(new maplibregl.NavigationControl())
map.addControl(new maplibregl.FullscreenControl())
map.addControl(new maplibregl.GlobeControl())

// Tambahkan Attribution
addAttribution(map, '')

const addLayerSwitcher = () => {
  const panel = document.createElement('fieldset')
  panel.setAttribute('aria-label', 'Daftar layer peta')
  Object.assign(panel.style, {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: '2',
    margin: '0',
    padding: '20px 16px',
    minWidth: '170px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
    font: '13px/1.4 sans-serif'
  })

  const title = document.createElement('h4')
  title.innerText = 'Layer Peta'
  title.style.margin = '0 0 8px 0'
  title.style.fontSize = '15px'
  title.style.fontWeight = '700'
  title.style.color = '#111827'
  panel.appendChild(title)

  const layers = [
    { id: 'puskesmas', label: 'Puskesmas', color: '#0080ff' },
    { id: 'flood', label: 'Wilayah banjir', color: '#de2d26' }
  ]

  layers.forEach(({ id, label, color }) => {
    const row = document.createElement('label')
    row.style.display = 'flex'
    row.style.alignItems = 'center'
    row.style.gap = '10px'
    row.style.marginTop = '10px'
    row.style.cursor = 'pointer'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = true
    checkbox.addEventListener('change', () => {
      map.setLayoutProperty(id, 'visibility', checkbox.checked ? 'visible' : 'none')
    })

    const swatch = document.createElement('span')
    Object.assign(swatch.style, {
      width: '10px',
      height: '10px',
      display: 'inline-block',
      background: color,
      border: '1px solid #374151'
    })

    row.append(checkbox, swatch, document.createTextNode(label))
    panel.appendChild(row)
  })

  mapElement.appendChild(panel)
}

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
      type: 'fill',
        source: 'floodRoute',
        paint: {
        'fill-color': [
          'match',
          ['get', 'kelas_risi'],
          'RENDAH', '#2ca25f',
          'SEDANG', '#fec44f',
          'TINGGI', '#de2d26',
          '#9ca3af'
        ],
        'fill-opacity': 0.35,
        'fill-outline-color': '#374151'
        }
    })

      addLayerSwitcher()

      if (puskesmas.features.length > 0) {
        const bounds = new maplibregl.LngLatBounds()
        puskesmas.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates)
        })
        map.fitBounds(bounds, { padding: 60, maxZoom: 13 })
      }

    
})

window.addEventListener('load', () => {
    map.resize()
})



