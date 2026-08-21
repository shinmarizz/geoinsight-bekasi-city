import pool from "../src/db.js"

const getFloodData = async () => {
    const query = `select gid, kecamatan, desa, kelas_risi, ST_AsGeoJSON(ST_Transform(geom, 4326))::json as geom from petarisiko_banjirbekasi`
    const result = await pool.query(query)

    return result.rows
}

export default { getFloodData }
