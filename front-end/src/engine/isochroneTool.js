import { API_BASE } from '../config'

export async function loadIsochrone(map, { longitude, latitude, minutes = 15, speedKmh = 5 }) {
  const params = new URLSearchParams({ lng: longitude, lat: latitude, minutes, speedKmh })
  const response = await fetch(`${API_BASE}/api/routes/isochrone?${params}`)
  if (!response.ok) throw new Error('Isochrone gagal dihitung')

  const data = await response.json()
  const source = map.getSource('isochrone-source')
  if (source) source.setData(data)
  else map.addSource('isochrone-source', { type: 'geojson', data })

  if (!map.getLayer('isochrone-fill')) {
    map.addLayer({
      id: 'isochrone-fill', type: 'fill', source: 'isochrone-source',
      paint: { 'fill-color': '#f97316', 'fill-opacity': 0.24, 'fill-outline-color': '#c2410c' }
    })
  }
  return data
}