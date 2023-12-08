import { or, like } from "drizzle-orm"
import db, { users } from "src/database"

type NewUser = typeof users.$inferInsert
export const insertUser = async (newUser: NewUser) => {
  return await db.insert(users).values(newUser)
}
export const existUser = async (email: string) => {
  const [isExist] = await db
    .select()
    .from(users)
    .where(or(like(users.email, email)))
  return !!isExist
}
