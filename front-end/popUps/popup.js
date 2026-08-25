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
  const [puskesmasResult, floodResult, jalanResult] = await Promise.allSettled([
    loadGeoJson('puskesmas', 'puskesmas'),
    loadGeoJson('flood', 'flood'),
    loadGeoJson('jalan?simplified=1', 'jalan')
  ])

  if (puskesmasResult.status === 'rejected') console.error(puskesmasResult.reason)
  if (floodResult.status === 'rejected') console.error(floodResult.reason)
  if (jalanResult.status === 'rejected') console.error(jalanResult.reason)

  return {
    puskesmas: puskesmasResult.status === 'fulfilled'
      ? puskesmasResult.value
      : emptyFeatureCollection,
    flood: floodResult.status === 'fulfilled'
      ? floodResult.value
      : emptyFeatureCollection,
    jalan: jalanResult.status === 'fulfilled'
      ? jalanResult.value
      : emptyFeatureCollection
  }
}

const formatCoordinate = (value) => {
  const coordinate = Number(value)
  return Number.isFinite(coordinate) ? coordinate.toFixed(5) : '-'
}

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const getFloodRiskMeta = (risk) => {
  const normalizedRisk = String(risk || '').toUpperCase()

  if (normalizedRisk === 'TINGGI') {
    return { label: 'Risiko Tinggi', className: 'risk-high' }
  }

  if (normalizedRisk === 'SEDANG') {
    return { label: 'Risiko Sedang', className: 'risk-medium' }
  }

  if (normalizedRisk === 'RENDAH') {
    return { label: 'Risiko Rendah', className: 'risk-low' }
  }

  return { label: 'Risiko Tidak Diketahui', className: 'risk-unknown' }
}

const buildPopupTable = (rows) => rows.map(({ label, value }) => `
  <tr>
    <th scope="row">${escapeHtml(label)}</th>
    <td>${escapeHtml(value || '-')}</td>
  </tr>
`).join('')

const buildCoordinateChips = (longitude, latitude) => `
  <div class="geo-popup-coordinates" aria-label="Koordinat lokasi">
    <span>Lng ${formatCoordinate(longitude)}</span>
    <span>Lat ${formatCoordinate(latitude)}</span>
  </div>
`

const buildMapsLink = (latitude, longitude, label = 'Lihat Maps') => {
  const latValue = Number(latitude)
  const lngValue = Number(longitude)

  if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) return ''

  const url = `https://www.google.com/maps?q=${latValue},${lngValue}`

  return `
    <a class="geo-popup-action" href="${url}" target="_blank" rel="noopener noreferrer">
      ${escapeHtml(label)}
    </a>
  `
}

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
      <div class="geo-popup geo-popup-health">
        <div class="geo-popup-header">
          <span class="geo-popup-kicker">Fasilitas Kesehatan</span>
          <strong>${escapeHtml(properties.nama || 'Puskesmas')}</strong>
        </div>

        <table class="geo-popup-table">
          <tbody>
            ${buildPopupTable([
              { label: 'Alamat', value: properties.alamat },
              { label: 'Kecamatan', value: properties.kecamatan },
              { label: 'Desa', value: properties.desa }
            ])}
          </tbody>
        </table>

        <div class="geo-popup-footer">
          ${buildCoordinateChips(longitude, latitude)}
          ${buildMapsLink(latitude, longitude)}
        </div>
      </div>
    `)
    .addTo(map)
}

export function addJalanPopup(map, event) {
  const feature = event.features?.[0]
  if (!feature) return

  const properties = feature.properties || {}
  const { lng, lat } = event.lngLat
  const panjangKm = Number(properties.panjang_meter)
  const warna = properties.warna || '#9ca3af'

  new Popup()
    .setLngLat(event.lngLat)
    .setHTML(`
      <div class="geo-popup geo-popup-jalan">
        <div class="geo-popup-header">
          <span class="geo-popup-kicker">Jaringan Jalan</span>
          <strong>${escapeHtml(properties.kelas_jalan || 'Jalan')}</strong>
          <span class="geo-popup-badge" style="background:${warna};color:#fff">
            <span aria-hidden="true" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#fff;margin-right:4px"></span>
            Kelas Jalan
          </span>
        </div>

        <table class="geo-popup-table">
          <tbody>
            ${buildPopupTable([
              { label: 'Kelas Jalan', value: properties.kelas_jalan },
              { label: 'Panjang Segmen', value: Number.isFinite(panjangKm) ? `${(panjangKm / 1000).toFixed(2)} km` : '-' },
              { label: 'ID Segmen', value: properties.gid }
            ])}
          </tbody>
        </table>

        <div class="geo-popup-footer">
          ${buildCoordinateChips(lng, lat)}
        </div>
      </div>
    `)
    .addTo(map)
}

export function addFloodPopup(map, event) {
  const feature = event.features?.[0]
  if (!feature) return

  const properties = feature.properties || {}
  const { lng, lat } = event.lngLat
  const risk = getFloodRiskMeta(properties.kelas_risi)

  new Popup()
    .setLngLat(event.lngLat)
    .setHTML(`
      <div class="geo-popup geo-popup-flood">
        <div class="geo-popup-header">
          <span class="geo-popup-kicker">Wilayah Banjir</span>
          <strong>Informasi Risiko</strong>
          <span class="geo-popup-badge ${risk.className}">${escapeHtml(risk.label)}</span>
        </div>

        <table class="geo-popup-table">
          <tbody>
            ${buildPopupTable([
              { label: 'Kelas Risiko', value: properties.kelas_risi || 'Tidak diketahui' },
              { label: 'Kecamatan', value: properties.kecamatan },
              { label: 'Desa', value: properties.desa }
            ])}
          </tbody>
        </table>

        <div class="geo-popup-footer">
          ${buildCoordinateChips(lng, lat)}
          ${buildMapsLink(lat, lng)}
        </div>
      </div>
    `)
    .addTo(map)
}
