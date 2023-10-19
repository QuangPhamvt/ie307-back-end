import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
const url = process.env.DATABASE_URL || ""
const poolConnection = mysql.createPool(url)
export const db = drizzle(poolConnection)
