import { Popup } from 'maplibre-gl'
import { API_BASE } from '../src/config'

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] }

const loadGeoJson = async (path, label) => {
  const response = await fetch(`${API_BASE}/api/routes/${path}`)
  if (!response.ok) {
    throw new Error(`Gagal mengambil data ${label}: ${response.status}`)
  }

  const data = await response.json()
  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error(`Format data ${label} bukan GeoJSON FeatureCollection`)
  }

  return data
}

export const loadMapData = async () => {
  const [puskesmasResult, floodResult] = await Promise.allSettled([
    loadGeoJson('puskesmas', 'puskesmas'),
    loadGeoJson('flood', 'flood')
  ])

  if (puskesmasResult.status === 'rejected') console.error(puskesmasResult.reason)
  if (floodResult.status === 'rejected') console.error(floodResult.reason)

  return {
    puskesmas: puskesmasResult.status === 'fulfilled'
      ? puskesmasResult.value
      : emptyFeatureCollection,
    flood: floodResult.status === 'fulfilled'
      ? floodResult.value
      : emptyFeatureCollection
  }
}

const formatCoordinate = (value) => Number(value).toFixed(5)
const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

export function addPuskesmasPopup(map, event) {
  const feature = event.features?.[0]
  if (!feature) return

  const { lng, lat } = event.lngLat
  const properties = feature.properties || {}
  const longitude = properties.longitude || lng
  const latitude = properties.latitude || lat

  new Popup()
    .setLngLat(event.lngLat)
    .setHTML(`
      <div>
        <strong>${escapeHtml(properties.nama || 'Puskesmas')}</strong>
        <div>Alamat: ${escapeHtml(properties.alamat || '-')}</div>
        <div>Kecamatan: ${escapeHtml(properties.kecamatan || '-')}</div>
        <div>Desa: ${escapeHtml(properties.desa || '-')}</div>
        <div>Bujur: ${formatCoordinate(longitude)}</div>
        <div>Lintang: ${formatCoordinate(latitude)}</div>
      </div>
    `)
    .addTo(map)
}

export function addFloodPopup(map, event) {
  const feature = event.features?.[0]
  if (!feature) return

  const properties = feature.properties || {}

  new Popup()
    .setLngLat(event.lngLat)
    .setHTML(`
      <div>
        <strong>Risiko banjir: ${escapeHtml(properties.kelas_risi || 'Tidak diketahui')}</strong>
        <div>Kecamatan: ${escapeHtml(properties.kecamatan || '-')}</div>
        <div>Desa: ${escapeHtml(properties.desa || '-')}</div>
      </div>
    `)
    .addTo(map)
}
