import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
const url = process.env.DATABASE_URL || ""
const poolConnection = mysql.createPool(url)
const db = drizzle(poolConnection)

export default db
