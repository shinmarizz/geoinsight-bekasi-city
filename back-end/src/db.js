import pg from "pg"
import { configDotenv } from "dotenv"

configDotenv()

const { Pool } = pg

const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000, idleTimeoutMillis: 30000, max: 10 })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })

export default pool