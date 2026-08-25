import { API_BASE } from '../config'

const ROUTE_SOURCE_ID = 'network-route-source'

const emptyData = { type: 'FeatureCollection', features: [] }

export const clearShortestPath = (map) => {
  const source = map.getSource(ROUTE_SOURCE_ID)
  if (source) source.setData(emptyData)
}

const ensureLayers = (map) => {
  if (map.getSource(ROUTE_SOURCE_ID)) return

  map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: emptyData })

  map.addLayer({
    id: 'network-route-line',
    type: 'line',
    source: ROUTE_SOURCE_ID,
    filter: ['==', ['get', 'featureType'], 'rute-terpendek'],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#0ea5e9',
      'line-width': 4.5,
      'line-opacity': 0.95
    }
  })
  map.addLayer({
    id: 'network-route-endpoints',
    type: 'circle',
    source: ROUTE_SOURCE_ID,
    filter: ['in', ['get', 'featureType'], ['literal', ['titik-awal', 'titik-akhir']]],
    paint: {
      'circle-color': ['match', ['get', 'featureType'], 'titik-awal', '#16a34a', '#dc2626'],
      'circle-radius': 7,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2.5
    }
  })
}

export async function requestShortestPath(map, { startLng, startLat, endLng, endLat, mode = 'jalan_kaki' }) {
  const params = new URLSearchParams({ startLng, startLat, endLng, endLat, mode })
  const response = await fetch(`${API_BASE}/api/routes/network/route?${params}`)
  if (!response.ok) {
    let message = 'Rute terpendek gagal dihitung'
    try {
      const errorBody = await response.json()
      if (errorBody?.message) message = errorBody.message
    } catch { /* keep default message */ }
    throw new Error(message)
  }

  const data = await response.json()
  ensureLayers(map)
  map.getSource(ROUTE_SOURCE_ID).setData(data)

  return data
}

export const formatRouteSummary = (data) => {
  if (!data?.properties) return ''
  const { moda, jarakKm, waktuMenit } = data.properties
  return `
    <div class="analysis-result">
      <p><strong>Rute Terpendek</strong> — moda ${moda}</p>
      <p>Jarak: <strong>${jarakKm} km</strong><br />Estimasi waktu: <strong>${waktuMenit} menit</strong></p>
    </div>
  `
}
