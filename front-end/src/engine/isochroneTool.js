import { API_BASE } from '../config'

const ISOCHRONE_SOURCE_ID = 'isochrone-source'

const emptyData = { type: 'FeatureCollection', features: [] }

export const clearIsochrone = (map) => {
  const source = map.getSource(ISOCHRONE_SOURCE_ID)
  if (source) source.setData(emptyData)
}

export async function loadIsochrone(map, { longitude, latitude, minutes = 15, mode = 'jalan_kaki' }) {
  const params = new URLSearchParams({ lng: longitude, lat: latitude, minutes, mode })
  const response = await fetch(`${API_BASE}/api/routes/isochrone?${params}`)
  if (!response.ok) {
    let message = 'Isochrone gagal dihitung'
    try {
      const errorBody = await response.json()
      if (errorBody?.message) message = errorBody.message
    } catch { /* keep default message */ }
    throw new Error(message)
  }

  const data = await response.json()

  const source = map.getSource(ISOCHRONE_SOURCE_ID)
  if (source) source.setData(data)
  else map.addSource(ISOCHRONE_SOURCE_ID, { type: 'geojson', data })

  if (!map.getLayer('isochrone-fill')) {
    map.addLayer({
      id: 'isochrone-fill',
      type: 'fill',
      source: ISOCHRONE_SOURCE_ID,
      filter: ['==', ['get', 'featureType'], 'area-isochrone'],
      paint: {
        'fill-color': '#f97316',
        'fill-opacity': 0.16
      }
    })
    map.addLayer({
      id: 'isochrone-outline',
      type: 'line',
      source: ISOCHRONE_SOURCE_ID,
      filter: ['==', ['get', 'featureType'], 'area-isochrone'],
      paint: {
        'line-color': '#c2410c',
        'line-width': 1.5,
        'line-dasharray': [2, 2]
      }
    })
    map.addLayer({
      id: 'isochrone-network',
      type: 'line',
      source: ISOCHRONE_SOURCE_ID,
      filter: ['==', ['get', 'featureType'], 'jaringan-terjangkau'],
      paint: {
        'line-color': '#fb923c',
        'line-width': 1.4,
        'line-opacity': 0.85
      }
    }, 'isochrone-outline')
    map.addLayer({
      id: 'isochrone-route-puskesmas',
      type: 'line',
      source: ISOCHRONE_SOURCE_ID,
      filter: ['==', ['get', 'featureType'], 'rute-puskesmas'],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': '#9333ea',
        'line-width': 3.5
      }
    })
    map.addLayer({
      id: 'isochrone-puskesmas-point',
      type: 'circle',
      source: ISOCHRONE_SOURCE_ID,
      filter: ['==', ['get', 'featureType'], 'puskesmas-terjangkau'],
      paint: {
        'circle-color': '#16a34a',
        'circle-radius': 6,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
      }
    })
    map.addLayer({
      id: 'isochrone-origin',
      type: 'circle',
      source: ISOCHRONE_SOURCE_ID,
      filter: ['==', ['get', 'featureType'], 'titik-asal'],
      paint: {
        'circle-color': '#dc2626',
        'circle-radius': 7,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 3
      }
    })
  }

  return data
}

export const formatIsochroneSummary = (data) => {
  if (!data?.properties) return ''
  const { menit, moda, totalPuskesmasTerjangkau, ringkasan } = data.properties

  const rows = (ringkasan || []).slice(0, 5).map((item) => `
    <li>
      <strong>${item.nama}</strong> — ${item.waktuMenit} menit (${item.jarakKm} km)
      <br /><small>${item.kecamatan || ''}</small>
    </li>
  `).join('')

  return `
    <div class="analysis-result">
      <p><strong>Isochrone ${menit} menit</strong> — moda ${moda}</p>
      <p>Puskesmas terjangkau: ${totalPuskesmasTerjangkau}</p>
      ${rows ? `<ol class="analysis-list">${rows}</ol>` : '<p><em>Tidak ada puskesmas dalam jangkauan.</em></p>'}
    </div>
  `
}
