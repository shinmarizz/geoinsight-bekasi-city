import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import '../style.css'
import { addFloodPopup, addPuskesmasPopup, loadMapData as fetchMapData } from '../../popUps/popup';
import { DEFAULT_MAP_STYLE, GEOMAPID_STYLE } from '../config'
import { PUSKESMAS_HEATMAP_LAYER_ID, addPuskesmasHeatmapLayer } from './heatmap'

const existingMap = document.getElementById('map')
let mapElement = existingMap

if (!mapElement) {
  mapElement = document.createElement('div')
  mapElement.id = 'map'
  document.body.appendChild(mapElement)
}

document.body.style.margin = '0'
document.body.style.padding = '0'
Object.assign(mapElement.style, {
  position: 'fixed',
  inset: '0',
  width: '100vw',
  height: '100vh',
  zIndex: '0'
})

// Header
const header = document.createElement('header')
header.className = "absolute top-0 left-0 z-50 w-full h-14 flex items-center justify-between px-6 bg-white shadow-md"


const brand = document.createElement('a')
brand.className = "flex items-center gap-3"

const logo = document.createElement("div")

const titleContainer = document.createElement("div")
const title = document.createElement("h1")

title.className = "text-lg font-bold text-gray-400"
title.textContent = "GeoInsight"

titleContainer.append(title)

brand.append(logo, titleContainer)

const nav = document.createElement("nav")
nav.className = "flex items-center gap-6"

const menuItems = [
  { label: "Layer", href: "../../index.html" }
]

menuItems.forEach(({ label, href }) => {
  const link = document.createElement("a")
  link.href = href
  link.textContent = label
  link.className = "text-sm font-medium text-gray-500 transition hover:text-blue-500"
  nav.appendChild(link)
})

header.append(brand, nav)
document.body.prepend(header)

const map = new maplibregl.Map({
  container: mapElement,
  style: GEOMAPID_STYLE,
  center: [107.0, -6.2],
  zoom: 10,
})

let usingFallbackStyle = false
map.on('error', (event) => {
  if (!usingFallbackStyle && GEOMAPID_STYLE !== DEFAULT_MAP_STYLE) {
    console.error('Style GeoMapid tidak dapat dimuat. Menggunakan style fallback.', event.error)
    usingFallbackStyle = true
    map.setStyle(DEFAULT_MAP_STYLE)
  }
})

let puskesmas = { type: 'FeatureCollection', features: [] }
let flood = { type: 'FeatureCollection', features: [] }
let clickHandlersAttached = false
let hasFitBounds = false

const layerVisibility = {
  puskesmas: true,
  flood: true,
  [PUSKESMAS_HEATMAP_LAYER_ID]: false
}

const loadData = async () => {
  const data = await fetchMapData()
  puskesmas = data.puskesmas
  flood = data.flood
  addGeoJsonLayers()
}

map.addControl( new maplibregl.NavigationControl(), "top-right")
map.addControl(new maplibregl.FullscreenControl(), "top-right")
map.addControl(new maplibregl.GlobeControl(), "top-right")

const addLayerSwitcher = () => {
  const panel = document.createElement('fieldset')
  panel.setAttribute('aria-label', 'Daftar layer peta')
  Object.assign(panel.style, {
    position: 'absolute',
    top: '72px',
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
    { id: PUSKESMAS_HEATMAP_LAYER_ID, label: 'Heatmap Puskesmas', color: 'linear-gradient(90deg, #38bdf8, #2563eb, #dc2626)' },
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
    checkbox.checked = layerVisibility[id] ?? true
    checkbox.addEventListener('change', () => {
      layerVisibility[id] = checkbox.checked

      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', checkbox.checked ? 'visible' : 'none')
      }
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

addLayerSwitcher()


const addPuskesmasSource = () => {
  const source = map.getSource('puskesmasRoute')

  if (source) {
    source.setData(puskesmas)
    return
  }

  map.addSource('puskesmasRoute', {
    type: 'geojson',
    data: puskesmas
  })
}

const addPuskesmasLayer = () => {
  if (map.getLayer('puskesmas')) {
    map.setLayoutProperty('puskesmas', 'visibility', layerVisibility.puskesmas ? 'visible' : 'none')
    return
  }

  map.addLayer({
    id: 'puskesmas',
    type: 'circle',
    source: 'puskesmasRoute',
    layout: {
      visibility: layerVisibility.puskesmas ? 'visible' : 'none'
    },
    paint: {
      'circle-color': '#0080ff',
      'circle-radius': 7,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2
    }
  })
}

const addFloodSource = () => {
  const source = map.getSource('floodRoute')

  if (source) {
    source.setData(flood)
    return
  }

  map.addSource('floodRoute', {
    type: 'geojson',
    data: flood
  })
}

const addFloodLayer = () => {
  if (map.getLayer('flood')) {
    map.setLayoutProperty('flood', 'visibility', layerVisibility.flood ? 'visible' : 'none')
    return
  }

  map.addLayer(
    {
      id: 'flood',
      type: 'fill',
      source: 'floodRoute',
      layout: {
        visibility: layerVisibility.flood ? 'visible' : 'none'
      },
      paint: {
        'fill-color': [
          'match',
          ['get', 'kelas_risi'],

          'RENDAH',
          '#2ca25f',

          'SEDANG',
          '#fec44f',

          'TINGGI',
          '#de2d26',

          '#9ca3af'
        ],

        'fill-opacity': 0.35,
        'fill-outline-color': '#374151'
      }
    },
    'puskesmas'
  )
}

const attachClickHandlers = () => {
  if (clickHandlersAttached) return

  map.on('click', 'puskesmas', (event) => addPuskesmasPopup(map, event))
  map.on('click', 'flood', (event) => addFloodPopup(map, event))
  map.on('mouseenter', 'puskesmas', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'puskesmas', () => {
    map.getCanvas().style.cursor = ''
  })
  map.on('mouseenter', 'flood', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'flood', () => {
    map.getCanvas().style.cursor = ''
  })

  clickHandlersAttached = true
}

const getFeatureCoordinates = (geometry) => {
  if (!geometry?.coordinates) return []

  const coordinates = []
  const collectCoordinates = (value) => {
    if (!Array.isArray(value)) return

    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      coordinates.push(value)
      return
    }

    value.forEach(collectCoordinates)
  }

  collectCoordinates(geometry.coordinates)
  return coordinates
}

const fitToMapData = () => {
  if (hasFitBounds) return

  const bounds = new maplibregl.LngLatBounds()
  const features = [
    ...(puskesmas.features || []),
    ...(flood.features || [])
  ]

  features.forEach((feature) => {
    getFeatureCoordinates(feature.geometry).forEach((coordinate) => {
      bounds.extend(coordinate)
    })
  })

  if (bounds.isEmpty()) return

  map.fitBounds(bounds, {
    padding: 80,
    maxZoom: 13,
    duration: 900
  })
  hasFitBounds = true
}

const addGeoJsonLayers = () => {
  if (!map.isStyleLoaded() || !puskesmas || !flood) return

  map.resize()

  addPuskesmasSource()
  addPuskesmasLayer()

  addFloodSource()
  addFloodLayer()

  addPuskesmasHeatmapLayer(map, {
    beforeLayerId: 'puskesmas',
    visible: layerVisibility[PUSKESMAS_HEATMAP_LAYER_ID]
  })

  attachClickHandlers()

  fitToMapData()
}

map.on('load', loadData)
map.on('style.load', addGeoJsonLayers)

window.addEventListener('load', () => {
    map.resize()
})
