import pool from "../src/db.js"

const getFloodData = async () => {
    const query = `select gid, kecamatan, desa, kelas_risi, ST_AsGeoJSON(geom, 6)::json as geom from petarisiko_banjirbekasi`
    const result = await pool.query(query)

    return result.rows
}

export default { getFloodData }
