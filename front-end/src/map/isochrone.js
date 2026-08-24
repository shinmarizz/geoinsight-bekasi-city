import { LngLatBounds } from 'maplibre-gl'

const ISOCHRONE_AREA_SOURCE_ID = 'isochrone-area'
const ISOCHRONE_TARGET_SOURCE_ID = 'isochrone-target'
const ISOCHRONE_AREA_FILL_LAYER_ID = 'isochrone-area-fill'
const ISOCHRONE_AREA_OUTLINE_LAYER_ID = 'isochrone-area-outline'
const ISOCHRONE_ROUTE_LAYER_ID = 'isochrone-route-line'
const ISOCHRONE_USER_LAYER_ID = 'isochrone-user-point'
const ISOCHRONE_NEAREST_LAYER_ID = 'isochrone-nearest-point'

const WALKING_SPEED_KMH = 4.8
const ISOCHRONE_MINUTES = [5, 10, 15]
const EARTH_RADIUS_KM = 6371.0088

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] }

const toRadians = (value) => value * Math.PI / 180
const toDegrees = (value) => value * 180 / Math.PI

const isValidCoordinate = (coordinate) => (
  Array.isArray(coordinate)
  && coordinate.length >= 2
  && Number.isFinite(Number(coordinate[0]))
  && Number.isFinite(Number(coordinate[1]))
)

const normalizeCoordinate = (coordinate) => [
  Number(coordinate[0]),
  Number(coordinate[1])
]

const formatDistance = (distanceKm) => {
  if (!Number.isFinite(distanceKm)) return '-'
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`
  return `${distanceKm.toFixed(2)} km`
}

const getFeatureCoordinate = (feature) => {
  const geometryCoordinate = feature?.geometry?.type === 'Point'
    ? feature.geometry.coordinates
    : null

  if (isValidCoordinate(geometryCoordinate)) {
    return normalizeCoordinate(geometryCoordinate)
  }

  const properties = feature?.properties || {}
  const propertyCoordinate = [properties.longitude, properties.latitude]

  if (isValidCoordinate(propertyCoordinate)) {
    return normalizeCoordinate(propertyCoordinate)
  }

  return null
}

const haversineDistance = (fromCoordinate, toCoordinate) => {
  const [fromLng, fromLat] = fromCoordinate.map(Number)
  const [toLng, toLat] = toCoordinate.map(Number)
  const deltaLat = toRadians(toLat - fromLat)
  const deltaLng = toRadians(toLng - fromLng)
  const fromLatRad = toRadians(fromLat)
  const toLatRad = toRadians(toLat)

  const value = Math.sin(deltaLat / 2) ** 2
    + Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(deltaLng / 2) ** 2

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

const findNearestPuskesmas = (originCoordinate, puskesmasData) => {
  const features = puskesmasData?.features || []

  return features.reduce((nearest, feature) => {
    const coordinate = getFeatureCoordinate(feature)
    if (!coordinate) return nearest

    const distanceKm = haversineDistance(originCoordinate, coordinate)

    if (!nearest || distanceKm < nearest.distanceKm) {
      return { feature, coordinate, distanceKm }
    }

    return nearest
  }, null)
}

const createCirclePolygon = (centerCoordinate, radiusKm, steps = 72) => {
  const [centerLng, centerLat] = centerCoordinate
  const centerLngRad = toRadians(centerLng)
  const centerLatRad = toRadians(centerLat)
  const angularDistance = radiusKm / EARTH_RADIUS_KM
  const coordinates = []

  for (let index = 0; index <= steps; index += 1) {
    const bearing = toRadians((index / steps) * 360)
    const latRad = Math.asin(
      Math.sin(centerLatRad) * Math.cos(angularDistance)
      + Math.cos(centerLatRad) * Math.sin(angularDistance) * Math.cos(bearing)
    )
    const lngRad = centerLngRad + Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(centerLatRad),
      Math.cos(angularDistance) - Math.sin(centerLatRad) * Math.sin(latRad)
    )

    coordinates.push([toDegrees(lngRad), toDegrees(latRad)])
  }

  return coordinates
}

const createIsochroneAreas = (originCoordinate) => ({
  type: 'FeatureCollection',
  features: ISOCHRONE_MINUTES.map((minutes) => {
    const radiusKm = WALKING_SPEED_KMH * (minutes / 60)

    return {
      type: 'Feature',
      properties: {
        minutes,
        radiusKm
      },
      geometry: {
        type: 'Polygon',
        coordinates: [createCirclePolygon(originCoordinate, radiusKm)]
      }
    }
  })
})

const createTargetFeatures = (originCoordinate, nearest) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { type: 'origin' },
      geometry: { type: 'Point', coordinates: originCoordinate }
    },
    {
      type: 'Feature',
      properties: {
        type: 'nearest',
        nama: nearest.feature.properties?.nama || 'Puskesmas terdekat',
        alamat: nearest.feature.properties?.alamat || '-',
        distanceKm: nearest.distanceKm
      },
      geometry: { type: 'Point', coordinates: nearest.coordinate }
    },
    {
      type: 'Feature',
      properties: { type: 'route' },
      geometry: {
        type: 'LineString',
        coordinates: [originCoordinate, nearest.coordinate]
      }
    }
  ]
})

const setSourceData = (map, sourceId, data) => {
  const source = map.getSource(sourceId)

  if (source) {
    source.setData(data)
    return
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data
  })
}

const addIsochroneLayers = (map, visible = true) => {
  const visibility = visible ? 'visible' : 'none'
  const beforePuskesmasLayer = map.getLayer('puskesmas') ? 'puskesmas' : undefined

  if (!map.getLayer(ISOCHRONE_AREA_FILL_LAYER_ID)) {
    map.addLayer(
      {
        id: ISOCHRONE_AREA_FILL_LAYER_ID,
        type: 'fill',
        source: ISOCHRONE_AREA_SOURCE_ID,
        layout: { visibility },
        paint: {
          'fill-color': [
            'match',
            ['get', 'minutes'],
            5,
            '#22c55e',
            10,
            '#facc15',
            15,
            '#f97316',
            '#38bdf8'
          ],
          'fill-opacity': [
            'match',
            ['get', 'minutes'],
            5,
            0.28,
            10,
            0.18,
            15,
            0.12,
            0.16
          ]
        }
      },
      beforePuskesmasLayer
    )
  }

  if (!map.getLayer(ISOCHRONE_AREA_OUTLINE_LAYER_ID)) {
    map.addLayer(
      {
        id: ISOCHRONE_AREA_OUTLINE_LAYER_ID,
        type: 'line',
        source: ISOCHRONE_AREA_SOURCE_ID,
        layout: { visibility },
        paint: {
          'line-color': [
            'match',
            ['get', 'minutes'],
            5,
            '#16a34a',
            10,
            '#ca8a04',
            15,
            '#ea580c',
            '#0284c7'
          ],
          'line-width': 2,
          'line-opacity': 0.8
        }
      },
      beforePuskesmasLayer
    )
  }

  if (!map.getLayer(ISOCHRONE_ROUTE_LAYER_ID)) {
    map.addLayer({
      id: ISOCHRONE_ROUTE_LAYER_ID,
      type: 'line',
      source: ISOCHRONE_TARGET_SOURCE_ID,
      filter: ['==', ['get', 'type'], 'route'],
      layout: { visibility },
      paint: {
        'line-color': '#0f172a',
        'line-width': 3,
        'line-dasharray': [1.5, 1.2],
        'line-opacity': 0.75
      }
    })
  }

  if (!map.getLayer(ISOCHRONE_USER_LAYER_ID)) {
    map.addLayer({
      id: ISOCHRONE_USER_LAYER_ID,
      type: 'circle',
      source: ISOCHRONE_TARGET_SOURCE_ID,
      filter: ['==', ['get', 'type'], 'origin'],
      layout: { visibility },
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': 7,
        'circle-stroke-color': '#0f172a',
        'circle-stroke-width': 3
      }
    })
  }

  if (!map.getLayer(ISOCHRONE_NEAREST_LAYER_ID)) {
    map.addLayer({
      id: ISOCHRONE_NEAREST_LAYER_ID,
      type: 'circle',
      source: ISOCHRONE_TARGET_SOURCE_ID,
      filter: ['==', ['get', 'type'], 'nearest'],
      layout: { visibility },
      paint: {
        'circle-color': '#22c55e',
        'circle-radius': 8,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 3
      }
    })
  }
}

const setIsochroneVisibility = (map, visible) => {
  [
    ISOCHRONE_AREA_FILL_LAYER_ID,
    ISOCHRONE_AREA_OUTLINE_LAYER_ID,
    ISOCHRONE_ROUTE_LAYER_ID,
    ISOCHRONE_USER_LAYER_ID,
    ISOCHRONE_NEAREST_LAYER_ID
  ].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
    }
  })
}

const fitIsochroneBounds = (map, originCoordinate, nearestCoordinate) => {
  const bounds = new LngLatBounds()
  bounds.extend(originCoordinate)
  bounds.extend(nearestCoordinate)

  map.fitBounds(bounds, {
    padding: 120,
    maxZoom: 14,
    duration: 900
  })
}

const clearIsochroneLayers = (map) => {
  setSourceData(map, ISOCHRONE_AREA_SOURCE_ID, emptyFeatureCollection)
  setSourceData(map, ISOCHRONE_TARGET_SOURCE_ID, emptyFeatureCollection)
  setIsochroneVisibility(map, false)
}

export const createPuskesmasIsochroneTool = ({
  map,
  mapElement,
  getPuskesmasData
}) => {
  let currentIsochrone = null

  const panel = document.createElement('section')
  panel.className = 'isochrone-control'
  panel.setAttribute('aria-label', 'Isochrone puskesmas terdekat')

  const title = document.createElement('h4')
  title.textContent = 'Isochrone'

  const description = document.createElement('p')
  description.textContent = 'Cari puskesmas terdekat dari lokasi sekarang.'

  const actionRow = document.createElement('div')
  actionRow.className = 'isochrone-actions'

  const locateButton = document.createElement('button')
  locateButton.type = 'button'
  locateButton.className = 'isochrone-button primary'
  locateButton.textContent = 'Gunakan Lokasi'

  const clearButton = document.createElement('button')
  clearButton.type = 'button'
  clearButton.className = 'isochrone-button secondary'
  clearButton.textContent = 'Reset'

  const status = document.createElement('div')
  status.className = 'isochrone-status'
  status.textContent = 'Estimasi jalan kaki: 5, 10, 15 menit.'

  const result = document.createElement('div')
  result.className = 'isochrone-result'

  actionRow.append(locateButton, clearButton)
  panel.append(title, description, actionRow, status, result)
  mapElement.appendChild(panel)

  const sync = () => {
    if (!currentIsochrone || !map.isStyleLoaded()) return

    setSourceData(map, ISOCHRONE_AREA_SOURCE_ID, currentIsochrone.areas)
    setSourceData(map, ISOCHRONE_TARGET_SOURCE_ID, currentIsochrone.targets)
    addIsochroneLayers(map, true)
  }

  const showResult = (nearest) => {
    result.innerHTML = `
      <div><strong>${nearest.feature.properties?.nama || 'Puskesmas terdekat'}</strong></div>
      <span>${nearest.feature.properties?.alamat || '-'}</span>
      <small>Jarak lurus: ${formatDistance(nearest.distanceKm)}</small>
    `
  }

  const runIsochrone = () => {
    const puskesmasData = getPuskesmasData()

    if (!puskesmasData?.features?.length) {
      status.textContent = 'Data puskesmas belum tersedia.'
      return
    }

    if (!navigator.geolocation) {
      status.textContent = 'Browser tidak mendukung geolocation.'
      return
    }

    locateButton.disabled = true
    status.textContent = 'Mengambil lokasi sekarang...'

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const originCoordinate = [
          position.coords.longitude,
          position.coords.latitude
        ]
        const nearest = findNearestPuskesmas(originCoordinate, puskesmasData)

        if (!nearest) {
          status.textContent = 'Koordinat puskesmas tidak valid.'
          locateButton.disabled = false
          return
        }

        currentIsochrone = {
          areas: createIsochroneAreas(originCoordinate),
          targets: createTargetFeatures(originCoordinate, nearest)
        }

        sync()
        fitIsochroneBounds(map, originCoordinate, nearest.coordinate)
        showResult(nearest)
        status.textContent = 'Isochrone berhasil dibuat.'
        locateButton.disabled = false
      },
      () => {
        status.textContent = 'Izin lokasi ditolak atau lokasi tidak terbaca.'
        locateButton.disabled = false
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  locateButton.addEventListener('click', runIsochrone)
  clearButton.addEventListener('click', () => {
    currentIsochrone = null
    clearIsochroneLayers(map)
    result.innerHTML = ''
    status.textContent = 'Estimasi jalan kaki: 5, 10, 15 menit.'
  })

  return { sync }
}
