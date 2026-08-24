export const PUSKESMAS_HEATMAP_LAYER_ID = 'puskesmas-heatmap'

export const addPuskesmasHeatmapLayer = (map, { beforeLayerId, visible = false } = {}) => {
  if (!map.getSource('puskesmasHeatmap')) {
    map.addSource('puskesmasHeatmap', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    })
  }

  if (map.getLayer(PUSKESMAS_HEATMAP_LAYER_ID)) {
    map.setLayoutProperty(PUSKESMAS_HEATMAP_LAYER_ID, 'visibility', visible ? 'visible' : 'none')
    return
  }

  map.addLayer({
    id: PUSKESMAS_HEATMAP_LAYER_ID,
    type: 'heatmap',
    source: 'puskesmasHeatmap',
    layout: { visibility: visible ? 'visible' : 'none' },
    paint: {
      'heatmap-weight': ['coalesce', ['get', 'intensity'], 0.2],
      'heatmap-intensity': 1.2,
      'heatmap-radius': 30,
      'heatmap-opacity': 0.82,
      'heatmap-color': [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, '#67a9cf',
        0.45, '#fdae61',
        0.7, '#f46d43',
        1, '#d73027'
      ]
    }
  }, beforeLayerId)
}
