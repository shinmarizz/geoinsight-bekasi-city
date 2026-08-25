import pool from "../src/db.js"

const getJalanData = async ({ simplified = true } = {}) => {
    const tolerance = simplified ? 0.00004 : 0
    const query = `
        SELECT
            gid,
            COALESCE(NULLIF(remark, ''), 'Jalan Lain') AS remark,
            ST_Length(ST_Transform(ST_SetSRID(geom, 4326), 32748)) AS panjang_meter,
            ST_AsGeoJSON(
                CASE WHEN $1::double precision > 0
                    THEN ST_SimplifyPreserveTopology(ST_Force2D(ST_SetSRID(geom, 4326)), $1::double precision)
                    ELSE ST_Force2D(ST_SetSRID(geom, 4326))
                END, 6
            )::json AS geom
        FROM jalan_bekasi
        WHERE geom IS NOT NULL
    `
    const result = await pool.query(query, [tolerance])
    return result.rows
}

export default { getJalanData }
