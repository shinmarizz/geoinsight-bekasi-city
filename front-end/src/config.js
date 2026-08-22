export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
export const DEFAULT_MAP_STYLE = 'https://demotiles.maplibre.org/style.json'
const geomapidValue = import.meta.env.VITE_API_GEOMAPID?.trim()
export const GEOMAPID_STYLE = geomapidValue
	? geomapidValue.startsWith('http')
		? geomapidValue
		: `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${encodeURIComponent(geomapidValue)}`
	: DEFAULT_MAP_STYLE