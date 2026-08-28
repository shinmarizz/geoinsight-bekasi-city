import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import '../style.css'
import { addFloodPopup, addPuskesmasPopup, addJalanPopup, loadMapData as fetchMapData } from '../../popUps/popup';
import { API_BASE, DEFAULT_MAP_STYLE, GEOMAPID_STYLE } from '../config'
import { PUSKESMAS_HEATMAP_LAYER_ID, addPuskesmasHeatmapLayer } from './heatmap'
import { loadIsochrone, clearIsochrone, formatIsochroneSummary } from '../engine/isochroneTool'
import { requestShortestPath, clearShortestPath, formatRouteSummary } from '../engine/networkTool'
import { initGeolocation } from '../engine/geolocationTool'
import { initRealtime, destroyRealtime } from '../realtime'

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
let jalan = { type: 'FeatureCollection', features: [] }
let puskesmasHeatmap = { type: 'FeatureCollection', features: [] }
let clickHandlersAttached = false
let hasFitBounds = false

let activeAnalysisMode = null // null | 'isochrone' | 'route'
let firstRoutePoint = null

const layerVisibility = {
  jalanMinor: true,
  jalanMajor: true,
  puskesmas: true,
  flood: true,
  [PUSKESMAS_HEATMAP_LAYER_ID]: false
}

const TRAVEL_MODE_OPTIONS = [
  { value: 'jalan_kaki', label: 'Jalan Kaki' },
  { value: 'motor', label: 'Sepeda Motor' },
  { value: 'mobil', label: 'Mobil' }
]

const getSelectedMode = () => analysisModeSelect?.value || 'jalan_kaki'
const getSelectedMinutes = () => Number(analysisMinutesSelect?.value || 15)

const fetchHeatmap = async () => {
  try {
    const heatmapResponse = await fetch(`${API_BASE}/api/routes/heatmap/puskesmas?radius=750`)
    if (!heatmapResponse.ok) throw new Error(`Heatmap gagal dimuat: ${heatmapResponse.status}`)
    puskesmasHeatmap = await heatmapResponse.json()
  } catch (error) {
    console.error(error)
  }
}

const loadData = async () => {
  const data = await fetchMapData()
  puskesmas = data.puskesmas
  flood = data.flood
  jalan = data.jalan ?? jalan

  await fetchHeatmap()

  addGeoJsonLayers()
}

const refreshMapData = async () => {
  const data = await fetchMapData()
  puskesmas = data.puskesmas
  flood = data.flood
  jalan = data.jalan ?? jalan

  await fetchHeatmap()

  map.getSource('puskesmasRoute')?.setData(puskesmas)
  map.getSource('floodRoute')?.setData(flood)
  map.getSource('jalanRoute')?.setData(jalan)
  map.getSource('puskesmasHeatmap')?.setData(puskesmasHeatmap)
}

map.addControl(new maplibregl.NavigationControl(), "top-right")
map.addControl(new maplibregl.FullscreenControl(), "top-right")

const createSelect = ({ options, ariaLabel }) => {
  const select = document.createElement('select')
  select.setAttribute('aria-label', ariaLabel)
  Object.assign(select.style, {
    width: '100%',
    padding: '4px 6px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: '#ffffff',
    font: '12px/1.35 sans-serif',
    color: '#111827'
  })
  options.forEach(({ value, label }) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = label
    select.appendChild(option)
  })
  return select
}

const createPanelButton = ({ label, background, border, color }) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = label
  Object.assign(button.style, {
    marginTop: '8px', padding: '6px 8px', width: '100%', cursor: 'pointer',
    border: `1px solid ${border}`, borderRadius: '6px', background, color,
    fontWeight: '600'
  })
  return button
}

const setResultBox = (html) => {
  if (!analysisResultBox) return
  analysisResultBox.innerHTML = html
  analysisResultBox.style.display = html ? 'block' : 'none'
}

const resetAnalysisState = ({ keepResult = false } = {}) => {
  activeAnalysisMode = null
  firstRoutePoint = null
  map.getCanvas().style.cursor = ''
  isochroneButton.textContent = 'Analisis Isochrone (klik peta)'
  routeButton.textContent = 'Rute Terpendek ke Puskesmas (2 klik)'
  if (!keepResult) setResultBox('')
}

const setAnalysisStatus = (html) => setResultBox(html)

const handleIsochroneClick = async ({ longitude, latitude }) => {
  setAnalysisStatus('<p>⏳ Menghitung isochrone…</p>')
  try {
    const data = await loadIsochrone(map, {
      longitude,
      latitude,
      minutes: getSelectedMinutes(),
      mode: getSelectedMode()
    })
    resetAnalysisState()
    setResultBox(formatIsochroneSummary(data))
  } catch (error) {
    resetAnalysisState({ keepResult: true })
    setAnalysisStatus(`<p style="color:#b91c1c">⚠️ ${error.message}</p>`)
  }
}

const handleRouteClick = async ({ longitude, latitude }) => {
  if (!firstRoutePoint) {
    firstRoutePoint = [longitude, latitude]
    clearShortestPath(map)
    routeButton.textContent = 'Titik awal dipilih — klik tujuan di peta'
    return
  }

  const [startLng, startLat] = firstRoutePoint
  routeButton.textContent = '⏳ Menghitung rute…'
  try {
    const data = await requestShortestPath(map, {
      startLng,
      startLat,
      endLng: longitude,
      endLat: latitude,
      mode: getSelectedMode()
    })
    resetAnalysisState()
    setResultBox(formatRouteSummary(data))
  } catch (error) {
    resetAnalysisState({ keepResult: true })
    setAnalysisStatus(`<p style="color:#b91c1c">⚠️ ${error.message}</p>`)
  }
}

const addLayerSwitcher = () => {
  const panel = document.createElement('fieldset')
  panel.setAttribute('aria-label', 'Daftar layer peta')
  Object.assign(panel.style, {
    position: 'absolute',
    top: '72px',
    left: '20px',
    zIndex: '2',
    margin: '0',
    padding: '10px 12px',
    minWidth: '190px',
    maxWidth: '210px',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
    font: '12px/1.35 sans-serif'
  })

  const title = document.createElement('h4')
  title.innerText = 'Layer Peta'
  title.style.margin = '0 0 6px 0'
  title.style.fontSize = '13px'
  title.style.fontWeight = '700'
  title.style.color = '#111827'
  panel.appendChild(title)

  const toggleGroup = (ids, visible) => {
    ids.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
      }
    })
  }

  const layers = [
    { id: 'jalanMinor', label: 'Jalan (lokal/setapak)', color: '#2563eb', groupIds: ['jalanMinor'] },
    { id: 'jalanMajor', label: 'Jalan (arteri/kolektor/tol)', color: 'linear-gradient(90deg, #7c3aed, #dc2626, #ea580c)', groupIds: ['jalanMajor'] },
    { id: 'puskesmas', label: 'Puskesmas', color: '#0080ff' },
    { id: PUSKESMAS_HEATMAP_LAYER_ID, label: 'Heatmap Puskesmas', color: 'linear-gradient(90deg, #38bdf8, #2563eb, #dc2626)' },
    { id: 'flood', label: 'Wilayah banjir', color: '#de2d26' }
  ]

  layers.forEach(({ id, label, color, groupIds }) => {
    const row = document.createElement('label')
    row.style.display = 'flex'
    row.style.alignItems = 'center'
    row.style.gap = '6px'
    row.style.marginTop = '6px'
    row.style.cursor = 'pointer'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = layerVisibility[id] ?? true
    checkbox.addEventListener('change', () => {
      layerVisibility[id] = checkbox.checked
      toggleGroup(groupIds ?? [id], checkbox.checked)
    })

    const swatch = document.createElement('span')
    Object.assign(swatch.style, {
      width: '8px',
      height: '8px',
      display: 'inline-block',
      flexShrink: '0',
      background: color,
      border: '1px solid #374151'
    })

    row.append(checkbox, swatch, document.createTextNode(label))
    panel.appendChild(row)
  })

  const analysisTitle = document.createElement('h4')
  analysisTitle.innerText = 'Analisis Spasial'
  analysisTitle.style.margin = '12px 0 4px 0'
  analysisTitle.style.fontSize = '13px'
  analysisTitle.style.fontWeight = '700'
  analysisTitle.style.color = '#111827'
  panel.appendChild(analysisTitle)

  const modeLabel = document.createElement('div')
  modeLabel.innerText = 'Moda perjalanan:'
  modeLabel.style.marginTop = '4px'
  modeLabel.style.fontWeight = '600'
  modeLabel.style.fontSize = '12px'
  panel.appendChild(modeLabel)

  const analysisModeSelect = createSelect({
    options: TRAVEL_MODE_OPTIONS,
    ariaLabel: 'Moda perjalanan analisis'
  })
  window.__analysisModeSelect = analysisModeSelect
  panel.appendChild(analysisModeSelect)

  const minutesLabel = document.createElement('div')
  minutesLabel.innerText = 'Batas waktu isochrone:'
  minutesLabel.style.marginTop = '6px'
  minutesLabel.style.fontWeight = '600'
  minutesLabel.style.fontSize = '12px'
  panel.appendChild(minutesLabel)

  const analysisMinutesSelect = createSelect({
    options: [5, 10, 15, 20, 30].map((minutes) => ({ value: String(minutes), label: `${minutes} menit` })),
    ariaLabel: 'Batas waktu isochrone'
  })
  analysisMinutesSelect.value = '15'
  window.__analysisMinutesSelect = analysisMinutesSelect
  panel.appendChild(analysisMinutesSelect)

  const isochroneButton = createPanelButton({
    label: 'Analisis Isochrone (klik peta)',
    background: '#fff7ed', border: '#c2410c', color: '#9a3412'
  })
  isochroneButton.addEventListener('click', () => {
    const next = activeAnalysisMode === 'isochrone' ? null : 'isochrone'
    resetAnalysisState()
    activeAnalysisMode = next
    if (next) {
      isochroneButton.textContent = 'Klik peta untuk titik asal isochrone'
      map.getCanvas().style.cursor = 'crosshair'
      setAnalysisStatus('<p><em>Klik lokasi Anda di peta untuk memulai.</em></p>')
    }
  })
  panel.appendChild(isochroneButton)

  const routeButton = createPanelButton({
    label: 'Rute Terpendek (2 klik)',
    background: '#f0f9ff', border: '#0369a1', color: '#075985'
  })
  routeButton.addEventListener('click', () => {
    const next = activeAnalysisMode === 'route' ? null : 'route'
    resetAnalysisState()
    activeAnalysisMode = next
    if (next) {
      routeButton.textContent = 'Klik titik awal rute di peta'
      map.getCanvas().style.cursor = 'crosshair'
      setAnalysisStatus('<p><em>Klik titik awal, lalu klik titik tujuan.</em></p>')
    }
  })
  panel.appendChild(routeButton)

  const analysisResultBox = document.createElement('div')
  Object.assign(analysisResultBox.style, {
    display: 'none',
    marginTop: '8px',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    background: '#f9fafb',
    fontSize: '11.5px',
    lineHeight: '1.4'
  })
  panel.appendChild(analysisResultBox)

  const hint = document.createElement('p')
  hint.innerHTML = '<em>Isochrone menghitung area jangkauan nyata melalui jaringan jalan Bekasi + rute ke puskesmas terdekat.</em>'
  hint.style.marginTop = '8px'
  hint.style.color = '#6b7280'
  hint.style.fontSize = '11px'
  panel.appendChild(hint)

  mapElement.appendChild(panel)

  window.__analysisRefs = { analysisModeSelect, analysisMinutesSelect, isochroneButton, routeButton, analysisResultBox }
}

addLayerSwitcher()

const { analysisModeSelect, analysisMinutesSelect, isochroneButton, routeButton, analysisResultBox } = window.__analysisRefs
delete window.__analysisRefs
delete window.__analysisModeSelect
delete window.__analysisMinutesSelect

const addJalanSource = () => {
  const source = map.getSource('jalanRoute')
  if (source) {
    source.setData(jalan)
    return
  }
  map.addSource('jalanRoute', {
    type: 'geojson',
    data: jalan
  })
}

const JALAN_MAJOR_CLASSES = [
  'Jalan Tol Dua Jalur Dengan Pemisah Fisik',
  'Jalan Tol Dua Jalur Tanpa Pemisah Fisik',
  'Jalan Arteri',
  'Jalan Kolektor'
]

const addJalanLayers = () => {
  if (map.getLayer('jalanMinor')) {
    map.setLayoutProperty('jalanMinor', 'visibility', layerVisibility.jalanMinor ? 'visible' : 'none')
  } else {
    map.addLayer({
      id: 'jalanMinor',
      type: 'line',
      source: 'jalanRoute',
      layout: {
        visibility: layerVisibility.jalanMinor ? 'visible' : 'none',
        'line-cap': 'round'
      },
      filter: ['!', ['in', ['get', 'kelas_jalan'], ['literal', JALAN_MAJOR_CLASSES]]],
      paint: {
        'line-color': ['get', 'warna'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 14, 2, 17, 4]
      }
    }, 'puskesmas')
  }

  if (map.getLayer('jalanMajor')) {
    map.setLayoutProperty('jalanMajor', 'visibility', layerVisibility.jalanMajor ? 'visible' : 'none')
  } else {
    map.addLayer({
      id: 'jalanMajor',
      type: 'line',
      source: 'jalanRoute',
      layout: {
        visibility: layerVisibility.jalanMajor ? 'visible' : 'none',
        'line-cap': 'round'
      },
      filter: ['in', ['get', 'kelas_jalan'], ['literal', JALAN_MAJOR_CLASSES]],
      paint: {
        'line-color': ['get', 'warna'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.4, 14, 3.5, 17, 8]
      }
    }, 'puskesmas')
  }
}

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
  map.on('click', 'jalanMinor', (event) => addJalanPopup(map, event))
  map.on('click', 'jalanMajor', (event) => addJalanPopup(map, event))

  const interactiveLayers = ['puskesmas', 'flood', 'jalanMinor', 'jalanMajor']
  interactiveLayers.forEach((layerId) => {
    map.on('mouseenter', layerId, () => {
      if (!activeAnalysisMode) map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', layerId, () => {
      if (!activeAnalysisMode) map.getCanvas().style.cursor = ''
    })
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

  addJalanSource()
  addJalanLayers()

  addPuskesmasHeatmapLayer(map, {
    beforeLayerId: 'puskesmas',
    visible: layerVisibility[PUSKESMAS_HEATMAP_LAYER_ID]
  })
  map.getSource('puskesmasHeatmap')?.setData(puskesmasHeatmap)

  attachClickHandlers()

  fitToMapData()
}

map.on('click', (event) => {
  if (!activeAnalysisMode) return

  const point = { longitude: event.lngLat.lng, latitude: event.lngLat.lat }
  if (activeAnalysisMode === 'isochrone') handleIsochroneClick(point)
  else if (activeAnalysisMode === 'route') handleRouteClick(point)
})

map.on('load', () => {
  loadData()
  initGeolocation(map)
  initRealtime(() => refreshMapData())
})
map.on('style.load', () => {
  addGeoJsonLayers()
})

window.addEventListener('load', () => {
    map.resize()
})
