export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
export const DEFAULT_MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'
const GEOMAPID_STYLE_BASE = 'https://basemap.mapid.io/styles/street-2d-building/style.json'

const geomapidValue = String(import.meta.env.VITE_API_GEOMAPID || '')
	.trim()

export const GEOMAPID_STYLE = geomapidValue.startsWith('http')
	? geomapidValue
	: geomapidValue
		? `${GEOMAPID_STYLE_BASE}?key=${encodeURIComponent(geomapidValue)}`
		: DEFAULT_MAP_STYLE

	console.log("API_BASE : ", API_BASE)
	console.log("GEOMAPID_STYLE_BASE : ", GEOMAPID_STYLE_BASE)