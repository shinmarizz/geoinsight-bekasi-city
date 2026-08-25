import pool from "../src/db.js"

const getPuskesmasHeatmap = async (radiusMeters = 750) => {
    const query = `
        SELECT
            gid,
            nama,
            ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geom,
            LEAST(1, GREATEST(0.1, (
                SELECT COUNT(*)::numeric
                FROM puskesmas_utm AS nearby
                WHERE ST_DWithin(
                    ST_Transform(nearby.geom, 4326)::geography,
                    ST_Transform(p.geom, 4326)::geography,
                    $1
                )
            ) / 10)) AS intensity
        FROM puskesmas_utm AS p
        WHERE geom IS NOT NULL
    `
    const result = await pool.query(query, [radiusMeters])
    return result.rows
}

export default { getPuskesmasHeatmap }
