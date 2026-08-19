import { Pool } from "../src/db.js" 

export default getPuskesmasData 
const getPuskesmasData = async () => {
    const query = `select gid, nama, alamat, kecamatan, desa, longitude, latitude, ST_AsGeoJSON(geom)::json as geom from puskesmas_utm`
    const result = await pool.query(query)

    return result.rows
}

