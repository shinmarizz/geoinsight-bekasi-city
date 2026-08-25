export const USER_LOCATION_SOURCE_ID = 'user-location-source'
export const USER_LOCATION_LAYER_ID = 'user-location-dot'

const emptyData = { type: 'FeatureCollection', features: [] }

let _map = null
let _controlContainer = null

function updateLocationSource(position) {
  const { longitude, latitude, accuracy } = position.coords
  _map?.getSource(USER_LOCATION_SOURCE_ID)?.setData({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {
        akurasi: Math.round(accuracy),
        waktu: new Date(position.timestamp).toLocaleTimeString('id-ID')
      },
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    }]
  })
}

function handleClick() {
  if (!_map) return

  if (!navigator.geolocation) {
    console.error('Geolocation tidak didukung oleh browser ini.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      updateLocationSource(position)
      const { longitude, latitude } = position.coords
      _map.flyTo({ center: [longitude, latitude], zoom: 15, duration: 1200 })
    },
    (error) => {
      console.error('Geolokasi gagal:', error.message)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

const GeolocateButtonControl = {
  onAdd(map) {
    _map = map

    const container = document.createElement('div')
    container.className = 'maplibregl-ctrl maplibregl-ctrl-group'
    container.style.cssText = 'display:flex;align-items:center;justify-content:center;'

    const button = document.createElement('button')
    button.type = 'button'
    button.title = 'Tunjukkan lokasi saya'
    button.setAttribute('aria-label', 'Tunjukkan lokasi saya')
    button.style.cssText = 'width:30px;height:30px;cursor:pointer;border:none;background:transparent;display:flex;align-items:center;justify-content:center;'
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`
    button.addEventListener('click', handleClick)

    container.appendChild(button)
    _controlContainer = container
    return container
  },

  onRemove() {
    _controlContainer?.remove()
    _map = undefined
    _controlContainer = null
  }
}

export function initGeolocation(map) {
  if (!map.getSource(USER_LOCATION_SOURCE_ID)) {
    map.addSource(USER_LOCATION_SOURCE_ID, {
      type: 'geojson',
      data: emptyData
    })
  }

  if (!map.getLayer('user-location-halo')) {
    map.addLayer({
      id: 'user-location-halo',
      type: 'circle',
      source: USER_LOCATION_SOURCE_ID,
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          10, ['*', ['coalesce', ['get', 'akurasi'], 30], 0.0008],
          16, ['*', ['coalesce', ['get', 'akurasi'], 30], 0.02]
        ],
        'circle-color': '#3b82f6',
        'circle-opacity': 0.15,
        'circle-stroke-color': '#2563eb',
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.4
      }
    })
  }

  if (!map.getLayer(USER_LOCATION_LAYER_ID)) {
    map.addLayer({
      id: USER_LOCATION_LAYER_ID,
      type: 'circle',
      source: USER_LOCATION_SOURCE_ID,
      paint: {
        'circle-color': '#2563eb',
        'circle-radius': 8,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 3
      }
    })
  }

  map.addControl(GeolocateButtonControl, 'bottom-right')

  return GeolocateButtonControl
}
