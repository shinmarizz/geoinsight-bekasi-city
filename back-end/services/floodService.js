import pool from "../src/db.js"

const getFloodData = async () => {
    const query =  `select gid, kecamatan, desa, kelas, kelas_risi, ST_AsGeoJSON::json as geom from petarisiko_banjirbekasi`
    const result = pool.query(pool)

    return result.rows
}

export default { getFloodData }
