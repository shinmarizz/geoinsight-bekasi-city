import pg from "pg"
import { configDotenv } from "dotenv"
import fs from "fs"

configDotenv()

const { Pool } = pg

const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { 
        rejectUnauthorized: true,
    ca:fs.readFileSync('./back-end/prod-ca-2021.crt') } })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL);

export default pool