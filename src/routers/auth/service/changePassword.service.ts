import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"

type TChangePassword = {
  headers: Headers
  body: {
    code_digit: string
    password: string
  }
  set: SetElysia
}
export const changePassword = async (props: TChangePassword) => {
  const { headers, body, set } = props
  const user_id = headers.get("userId") || ""
  const { code_digit, password } = body
  try {
    const [user] = await db.select().from(users).where(like(users.id, user_id))
    if (user.code_change_password === code_digit) {
      const hashPassword = await Bun.password.hash(password)
      await db.update(users).set({ code_change_password: null, password: hashPassword })
      return {
        message: "We had change your password",
        data: [],
      }
    }
    if (user.code_change_password === null) {
      set.status = 400
      return {
        message: "You haven't verity email",
        data: [],
      }
    }
    set.status = 400
    return {
      message: "Please Check your code digit again. Code is wrong",
      data: [],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
