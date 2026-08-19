import pool from "../src/db.js"

const getPuskesmasData = async () => {
    const query = `select gid, nama, alamat, kecamatan, desa, longitude, latitude, ST_AsGeoJSON(ST_Transform(geom, 4326))::json as geom from puskesmas_utm`
    const result = await pool.query(query)

    return result.rows
}

export default { getPuskesmasData }

