import puskesmasService from "../services/puskesmasService.js"; // adjust path as needed
export const getPuskesmasData = async (req, res) => {
    try {
        const data = await puskesmasService.getPuskesmasData();

        const geojson = {
            type: "FeatureCollection",
            features: data.map((row) => ({
                type: "Feature",
                properties: {
                    gid: row.gid,
                    nama: row.nama,
                    alamat: row.alamat,
                    kecamatan: row.kecamatan,
                    desa: row.desa,
                    longitude: row.longitude,
                    latitude: row.latitude
                },
                geometry: row.geom
            }))
        }

        res.json(geojson);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch Puskesmas data",
            error: err.message
        })
    }
}

export default { getPuskesmasData }



