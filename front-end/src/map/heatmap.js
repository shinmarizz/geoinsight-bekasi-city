export const PUSKESMAS_HEATMAP_LAYER_ID = 'puskesmas-heatmap'

const PUSKESMAS_SOURCE_ID = 'puskesmasRoute'

export const addPuskesmasHeatmapLayer = (map, options = {}) => {
  const {
    beforeLayerId = 'puskesmas',
    visible = false
  } = options

  if (map.getLayer(PUSKESMAS_HEATMAP_LAYER_ID)) {
    map.setLayoutProperty(
      PUSKESMAS_HEATMAP_LAYER_ID,
      'visibility',
      visible ? 'visible' : 'none'
    )
    return
  }

  if (!map.getSource(PUSKESMAS_SOURCE_ID)) return

  const insertBeforeLayer = map.getLayer(beforeLayerId) ? beforeLayerId : undefined

  map.addLayer(
    {
      id: PUSKESMAS_HEATMAP_LAYER_ID,
      type: 'heatmap',
      source: PUSKESMAS_SOURCE_ID,
      layout: {
        visibility: visible ? 'visible' : 'none'
      },
      maxzoom: 15,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9,
          0.7,
          14,
          1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9,
          0.8,
          14,
          1.6
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(14, 165, 233, 0)',
          0.25,
          '#bae6fd',
          0.5,
          '#38bdf8',
          0.75,
          '#2563eb',
          1,
          '#dc2626'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          9,
          18,
          14,
          34
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12,
          0.85,
          15,
          0.35
        ]
      }
    },
    insertBeforeLayer
  )
}
