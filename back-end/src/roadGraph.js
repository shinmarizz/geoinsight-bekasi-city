import pool from "./db.js"

const NODE_PRECISION = 1e6
const DEFAULT_SNAP_RADIUS_METERS = 350

export const TRAVEL_MODES = {
  jalan_kaki: { label: "Jalan Kaki", maxKmh: 5, bufferMeters: 130 },
  motor: { label: "Sepeda Motor", maxKmh: 40, bufferMeters: 230 },
  mobil: { label: "Mobil", maxKmh: 70, bufferMeters: 320 }
}

const CLASS_SPEED_KMH = [
  { match: "tol", speed: 80 },
  { match: "arteri", speed: 55 },
  { match: "kolektor", speed: 40 },
  { match: "lokal", speed: 25 },
  { match: "setapak", speed: 10 },
  { match: "jalan lain", speed: 20 }
]

const resolveSpeedKmh = (remark) => {
  const normalized = String(remark || "").toLowerCase()
  const found = CLASS_SPEED_KMH.find((entry) => normalized.includes(entry.match))
  return found ? found.speed : 20
}

export const resolveMode = (mode) => TRAVEL_MODES[mode] ?? TRAVEL_MODES.jalan_kaki

const haversineMeters = (lngA, latA, lngB, latB) => {
  const rad = Math.PI / 180
  const dLat = (latB - latA) * rad
  const dLng = (lngB - lngA) * rad
  const lat1 = latA * rad
  const lat2 = latB * rad
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const nodeKey = (lng, lat) => `${Math.round(lat * NODE_PRECISION)}:${Math.round(lng * NODE_PRECISION)}`

const edgeSeconds = (meters, speedKmh, travelMode) => {
  const effectiveKmh = Math.min(travelMode.maxKmh, speedKmh)
  return (meters / ((effectiveKmh * 1000) / 3600))
}

class MinHeap {
  constructor() {
    this.items = []
  }

  get size() {
    return this.items.length
  }

  push(priority, value) {
    const items = this.items
    items.push({ priority, value })
    let index = items.length - 1
    while (index > 0) {
      const parent = (index - 1) >> 1
      if (items[parent].priority <= items[index].priority) break
      ;[items[parent], items[index]] = [items[index], items[parent]]
      index = parent
    }
  }

  pop() {
    const items = this.items
    if (!items.length) return undefined
    const top = items[0]
    const last = items.pop()
    if (items.length) {
      items[0] = last
      let index = 0
      for (;;) {
        const left = index * 2 + 1
        const right = left + 1
        let smallest = index
        if (left < items.length && items[left].priority < items[smallest].priority) smallest = left
        if (right < items.length && items[right].priority < items[smallest].priority) smallest = right
        if (smallest === index) break
        ;[items[smallest], items[index]] = [items[index], items[smallest]]
        index = smallest
      }
    }
    return top
  }
}

const buildGraph = async () => {
  const startedAt = Date.now()
  const query = `
    SELECT
      gid,
      COALESCE(NULLIF(remark, ''), 'Jalan Lain') AS remark,
      ST_AsGeoJSON(ST_Force2D(ST_SetSRID(geom, 4326)), 6)::json AS geojson
    FROM jalan_bekasi
    WHERE geom IS NOT NULL
  `
  const result = await pool.query(query)
  const nodes = new Map()
  const grid = new Map()
  const GRID_CELL = 0.004
  let edgeCount = 0

  const registerNode = (lng, lat) => {
    const key = nodeKey(lng, lat)
    if (!nodes.has(key)) {
      nodes.set(key, { key, lng, lat, edges: [] })
      const cellX = Math.floor(lng / GRID_CELL)
      const cellY = Math.floor(lat / GRID_CELL)
      const cellId = `${cellX}:${cellY}`
      let bucket = grid.get(cellId)
      if (!bucket) {
        bucket = []
        grid.set(cellId, bucket)
      }
      bucket.push(key)
    }
    return nodes.get(key)
  }

  for (const row of result.rows) {
    const parts = row.geojson?.type === "MultiLineString"
      ? row.geojson.coordinates
      : row.geojson?.coordinates
        ? [row.geojson.coordinates]
        : []

    for (const part of parts) {
      if (!Array.isArray(part) || part.length < 2) continue

      let previous = null
      for (const [lng, lat] of part) {
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue
        const node = registerNode(lng, lat)
        if (previous && node !== previous) {
          const meters = haversineMeters(previous.lng, previous.lat, node.lng, node.lat)
          if (meters >= 0.5) {
            const speedKmh = resolveSpeedKmh(row.remark)
            previous.edges.push({ to: node.key, meters, speedKmh, gid: row.gid })
            node.edges.push({ to: previous.key, meters, speedKmh, gid: row.gid })
            edgeCount += 2
          }
        }
        previous = node
      }
    }
  }

  console.log(`[roadGraph] ${nodes.size} simpul, ${edgeCount} sisi dibangun dalam ${Date.now() - startedAt}ms`)
  return { nodes, grid, gridCell: GRID_CELL }
}

let graphPromise = null

export const getRoadGraph = () => {
  if (!graphPromise) {
    graphPromise = buildGraph().catch((error) => {
      graphPromise = null
      throw error
    })
  }
  return graphPromise
}

export const findNearestNode = async (longitude, latitude, radiusMeters = DEFAULT_SNAP_RADIUS_METERS) => {
  const graph = await getRoadGraph()
  const radiusDeg = radiusMeters / 111000
  const centerCellX = Math.floor(longitude / graph.gridCell)
  const centerCellY = Math.floor(latitude / graph.gridCell)
  const cellSpan = Math.ceil(radiusDeg / graph.gridCell)

  let best = null
  let bestDistance = Infinity

  for (let dx = -cellSpan; dx <= cellSpan; dx++) {
    for (let dy = -cellSpan; dy <= cellSpan; dy++) {
      const bucket = graph.grid.get(`${centerCellX + dx}:${centerCellY + dy}`)
      if (!bucket) continue
      for (const key of bucket) {
        const node = graph.nodes.get(key)
        const distance = haversineMeters(longitude, latitude, node.lng, node.lat)
        if (distance < bestDistance) {
          bestDistance = distance
          best = node
        }
      }
    }
  }

  if (!best || bestDistance > radiusMeters) return null
  return best
}

export const runDijkstra = async ({ startNode, budgetSeconds, mode, targetKey }) => {
  const graph = await getRoadGraph()
  const travelMode = resolveMode(mode)
  const distances = new Map([[startNode.key, 0]])
  const previous = new Map()
  const visited = new Set()
  const heap = new MinHeap()
  heap.push(0, startNode.key)

  const lines = []
  const reachedGids = new Set()

  while (heap.size > 0) {
    const { priority: currentTime, value: currentKey } = heap.pop()
    if (visited.has(currentKey)) continue
    visited.add(currentKey)

    if (targetKey && currentKey === targetKey) break
    if (budgetSeconds !== undefined && currentTime >= budgetSeconds) continue

    const currentNode = graph.nodes.get(currentKey)
    for (const edge of currentNode.edges) {
      if (visited.has(edge.to)) continue
      const nextTime = currentTime + edgeSeconds(edge.meters, edge.speedKmh, travelMode)
      const remainingBudget = budgetSeconds === undefined ? Infinity : budgetSeconds - currentTime

      if (nextTime <= (budgetSeconds ?? Infinity)) {
        const nextNode = graph.nodes.get(edge.to)
        lines.push([[currentNode.lng, currentNode.lat], [nextNode.lng, nextNode.lat]])
        reachedGids.add(edge.gid)
        if (!distances.has(edge.to) || nextTime < distances.get(edge.to)) {
          distances.set(edge.to, nextTime)
          previous.set(edge.to, { fromKey: currentKey })
          heap.push(nextTime, edge.to)
        }
      } else if (remainingBudget > 0) {
        const fraction = remainingBudget / (nextTime - currentTime)
        const cutLng = currentNode.lng + (graph.nodes.get(edge.to).lng - currentNode.lng) * fraction
        const cutLat = currentNode.lat + (graph.nodes.get(edge.to).lat - currentNode.lat) * fraction
        lines.push([[currentNode.lng, currentNode.lat], [cutLng, cutLat]])
      }
    }
  }

  return { graph, distances, previous, visited, lines, reachedGids }
}

export const reconstructPathCoordinates = ({ graph, previous, startKey, targetKey }) => {
  const coordinates = []
  let cursor = targetKey
  const guard = new Set()

  while (cursor && cursor !== startKey && !guard.has(cursor)) {
    guard.add(cursor)
    const node = graph.nodes.get(cursor)
    coordinates.push([node.lng, node.lat])
    const parent = previous.get(cursor)
    cursor = parent?.fromKey
  }

  if (cursor !== startKey) return null
  const startNode = graph.nodes.get(startKey)
  coordinates.push([startNode.lng, startNode.lat])
  coordinates.reverse()
  return coordinates
}

export const pathDistanceMeters = (coordinates) => {
  let total = 0
  for (let index = 1; index < coordinates.length; index++) {
    const [lngA, latA] = coordinates[index - 1]
    const [lngB, latB] = coordinates[index]
    total += haversineMeters(lngA, latA, lngB, latB)
  }
  return total
}

export default {
  TRAVEL_MODES,
  resolveMode,
  getRoadGraph,
  findNearestNode,
  runDijkstra,
  reconstructPathCoordinates,
  pathDistanceMeters
}
