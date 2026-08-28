export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
export const DEFAULT_MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const SUPABASE_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || 'public'
export const SUPABASE_TABLES = (import.meta.env.VITE_SUPABASE_TABLES || 'puskesmas_utm,petarisiko_banjirbekasi,jalan_bekasi')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean)

const GEOMAPID_STYLE_BASE = 'https://basemap.mapid.io/styles/street-2d-building/style.json'

const geomapidValue = String(import.meta.env.VITE_API_GEOMAPID || '')
	.trim()

export const GEOMAPID_STYLE = geomapidValue.startsWith('http')
	? geomapidValue
	: geomapidValue
		? `${GEOMAPID_STYLE_BASE}?key=${encodeURIComponent(geomapidValue)}`
		: DEFAULT_MAP_STYLE

if (import.meta.env.DEV) {
	console.log('API_BASE : ', API_BASE)
}
