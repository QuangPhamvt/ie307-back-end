import { like } from "drizzle-orm"
import db, { profiles, users } from "src/database"
const generateUsername: (name: string) => Promise<string> = async (name) => {
  let username: string = name
  let isUsername: boolean
  let number: string = ""

  const [user] = await db.select().from(profiles).where(like(profiles.username, username))

  isUsername = user ? true : false

  async function loop() {
    while (isUsername == true) {
      number = Math.floor(100 + Math.random() * 900).toString()
      username = name + number
      let [isUser] = await db.select().from(profiles).where(like(profiles.username, username))

      if (!isUser) {
        isUsername = false
      } else {
        isUsername = true
      }
    }
  }
  await loop()
  return username
}

export default generateUsername
