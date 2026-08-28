import pg from 'pg'
import { configDotenv } from 'dotenv'
configDotenv()
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const q = async (label, sql) => {
  try { const r = await pool.query(sql); console.log(label, '=>', JSON.stringify(r.rows)) }
  catch (e) { console.log(label, '=> FAIL:', e.message.slice(0, 160)) }
}
await q('jalan centroid sample', "select gid, round(ST_X(ST_Centroid(geom))::numeric,3) as x, round(ST_Y(ST_Centroid(geom))::numeric,3) as y from jalan_bekasi limit 5")
await q('flood centroid sample', "select gid, round(ST_X(ST_Centroid(geom))::numeric,3) as x, round(ST_Y(ST_Centroid(geom))::numeric,3) as y from petarisiko_banjirbekasi limit 3")
await q('tilenet bbox check', "select round(ST_XMin(geom)::numeric,2) as minx, round(ST_XMax(geom)::numeric,2) as maxx, round(ST_YMin(geom)::numeric,2) as miny, round(ST_YMax(geom)::numeric,2) as maxy from jalan_bekasi")
await q('puskesmas lonlat', "select gid, longitude, latitude from puskesmas_utm limit 2")
await pool.end()
