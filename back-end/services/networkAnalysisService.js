import pool from "../src/db.js"
import {
    resolveMode,
    getRoadGraph,
    findNearestNode,
    runDijkstra,
    reconstructPathCoordinates,
    pathDistanceMeters
} from "../src/roadGraph.js"

let puskesmasCache = null

const getPuskesmas = async () => {
    if (!puskesmasCache) {
        const query = `
            SELECT gid, nama, kecamatan, desa,
                   longitude::float8 AS longitude,
                   latitude::float8 AS latitude,
                   ST_AsGeoJSON(ST_Transform(geom, 4326), 6)::json AS geom
            FROM puskesmas_utm
            WHERE geom IS NOT NULL
        `
        const result = await pool.query(query)
        puskesmasCache = result.rows
    }
    return puskesmasCache
}

const MAX_AREA_SEGMENTS = 8000

const buildIsochroneArea = async ({ gids, bufferMeters }) => {
    if (!gids.length) return null

    const selectedGids = gids.slice(0, MAX_AREA_SEGMENTS)
    const bufferDegrees = Math.min(0.01, bufferMeters / 111320)

    const query = `
        SELECT ST_AsGeoJSON(
            ST_SimplifyPreserveTopology(
                ST_Buffer(
                    ST_Collect(
                        ST_SimplifyPreserveTopology(ST_Force2D(geom), 0.00006)
                    ),
                    $2::double precision
                ),
                0.0004
            ), 5
        )::json AS geom
        FROM jalan_bekasi
        WHERE gid = ANY($1::int[]) AND geom IS NOT NULL
    `
    try {
        const result = await pool.query(query, [selectedGids, bufferDegrees])
        return result.rows[0]?.geom ?? null
    } catch (error) {
        console.error("[isochrone] Gagal membangun area isochrone:", error.message)
        return null
    }
}

const getNetworkIsochrone = async ({ longitude, latitude, minutes, mode }) => {
    const travelMode = resolveMode(mode)
    const budgetSeconds = minutes * 60

    const startNode = await findNearestNode(longitude, latitude)
    if (!startNode) {
        throw new Error("Titik asal terlalu jauh dari jaringan jalan Bekasi (maksimum 350 meter)")
    }

    const { graph, distances, previous, lines, reachedGids } = await runDijkstra({
        startNode,
        budgetSeconds,
        mode
    })

    const reachableLines = lines.length > 40000
        ? lines.filter((_, index) => index % Math.ceil(lines.length / 40000) === 0)
        : lines


    const puskesmasList = await getPuskesmas()
    const destinations = []
    for (const puskesmas of puskesmasList) {
        const snapped = await findNearestNode(
            Number(puskesmas.longitude ?? puskesmas.geom.coordinates[0]),
            Number(puskesmas.latitude ?? puskesmas.geom.coordinates[1]),
            400
        )
        if (!snapped || !distances.has(snapped.key)) continue

        const pathCoordinates = reconstructPathCoordinates({
            graph,
            previous,
            startKey: startNode.key,
            targetKey: snapped.key
        })
        if (!pathCoordinates) continue

        const routeCoordinates = [
            [longitude, latitude],
            ...pathCoordinates,
            puskesmas.geom.coordinates
        ]
        const distanceMeters = pathDistanceMeters(routeCoordinates)

        destinations.push({
            nama: puskesmas.nama,
            kecamatan: puskesmas.kecamatan,
            desa: puskesmas.desa,
            longitude: Number(puskesmas.longitude),
            latitude: Number(puskesmas.latitude),
            position: puskesmas.geom.coordinates,
            waktuMenit: Math.round((distances.get(snapped.key) / 60) * 10) / 10,
            jarakKm: Math.round((distanceMeters / 1000) * 100) / 100,
            routeCoordinates
        })
    }

    destinations.sort((a, b) => a.waktuMenit - b.waktuMenit)
    const nearestDestinations = destinations.slice(0, 5)

    const areaGeom = await buildIsochroneArea({
        gids: [...reachedGids].slice(0, 15000),
        bufferMeters: travelMode.bufferMeters
    })

    const features = []

    if (areaGeom) {
        features.push({
            type: "Feature",
            properties: {
                featureType: "area-isochrone",
                menit: minutes,
                moda: travelMode.label,
                deskripsi: `Area yang dapat dijangkau dalam ${minutes} menit (${travelMode.label}) via jaringan jalan`
            },
            geometry: areaGeom
        })
    }

    features.push({
        type: "Feature",
        properties: {
            featureType: "jaringan-terjangkau",
            menit: minutes,
            moda: travelMode.label,
            jumlahSegmen: lines.length
        },
        geometry: {
            type: "MultiLineString",
            coordinates: reachableLines
        }
    })

    nearestDestinations.forEach((destination, index) => {
        features.push({
            type: "Feature",
            properties: {
                featureType: "rute-puskesmas",
                peringkat: index + 1,
                nama: destination.nama,
                kecamatan: destination.kecamatan,
                desa: destination.desa,
                waktu_menit: destination.waktuMenit,
                jarak_km: destination.jarakKm
            },
            geometry: {
                type: "LineString",
                coordinates: destination.routeCoordinates
            }
        })
        features.push({
            type: "Feature",
            properties: {
                featureType: "puskesmas-terjangkau",
                peringkat: index + 1,
                nama: destination.nama,
                kecamatan: destination.kecamatan,
                waktu_menit: destination.waktuMenit,
                jarak_km: destination.jarakKm
            },
            geometry: {
                type: "Point",
                coordinates: destination.position
            }
        })
    })

    features.push({
        type: "Feature",
        properties: {
            featureType: "titik-asal",
            menit: minutes,
            moda: travelMode.label,
            snap_jarak_meter: Math.round(pathDistanceMeters([[longitude, latitude], [startNode.lng, startNode.lat]]))
        },
        geometry: {
            type: "Point",
            coordinates: [startNode.lng, startNode.lat]
        }
    })

    return {
        type: "FeatureCollection",
        properties: {
            menit: minutes,
            moda: travelMode.label,
            totalPuskesmasTerjangkau: destinations.length,
            ringkasan: nearestDestinations.map(({ nama, kecamatan, waktuMenit, jarakKm }) => ({
                nama, kecamatan, waktuMenit, jarakKm
            }))
        },
        features
    }
}

const getShortestPath = async ({ startLng, startLat, endLng, endLat, mode }) => {
    const travelMode = resolveMode(mode)

    const [startNode, endNode] = await Promise.all([
        findNearestNode(startLng, startLat),
        findNearestNode(endLng, endLat)
    ])

    if (!startNode || !endNode) {
        throw new Error("Titik awal/akhir terlalu jauh dari jaringan jalan Bekasi (maksimum 350 meter)")
    }
    if (startNode.key === endNode.key) {
        throw new Error("Titik awal dan akhir berada pada simpul jaringan yang sama")
    }

    const { graph, previous, visited } = await runDijkstra({
        startNode,
        mode,
        targetKey: endNode.key
    })

    if (!visited.has(endNode.key)) {
        throw new Error("Tidak ditemukan rute antara kedua titik dalam jaringan jalan")
    }

    const pathCoordinates = reconstructPathCoordinates({
        graph,
        previous,
        startKey: startNode.key,
        targetKey: endNode.key
    })

    const routeCoordinates = [
        [startLng, startLat],
        ...pathCoordinates,
        [endLng, endLat]
    ]
    const distanceMeters = pathDistanceMeters(routeCoordinates)

    return {
        type: "FeatureCollection",
        properties: {
            moda: travelMode.label,
            jarakKm: Math.round((distanceMeters / 1000) * 100) / 100,
            waktuMenit: Math.round(((distanceMeters / ((travelMode.maxKmh * 1000) / 3600)) / 60) * 10) / 10
        },
        features: [
            {
                type: "Feature",
                properties: {
                    featureType: "rute-terpendek",
                    moda: travelMode.label,
                    jarak_km: Math.round((distanceMeters / 1000) * 100) / 100,
                    waktu_menit: Math.round(((distanceMeters / ((travelMode.maxKmh * 1000) / 3600)) / 60) * 10) / 10
                },
                geometry: {
                    type: "LineString",
                    coordinates: routeCoordinates
                }
            },
            {
                type: "Feature",
                properties: { featureType: "titik-awal" },
                geometry: { type: "Point", coordinates: [startLng, startLat] }
            },
            {
                type: "Feature",
                properties: { featureType: "titik-akhir" },
                geometry: { type: "Point", coordinates: [endLng, endLat] }
            }
        ]
    }
}

export default { getNetworkIsochrone, getShortestPath }
