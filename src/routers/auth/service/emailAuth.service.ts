import sendEmail from "aws/ses"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { genDigit } from "src/utilities"

type TEmailAuth = {
  set: SetElysia
  body: {
    email: string
  }
}
export const emailAuth = async (props: TEmailAuth) => {
  const {
    set,
    body: { email },
  } = props
  try {
    const [user] = await db.select({ is_active: users.is_active }).from(users).where(like(users.email, email))

    if (user && !user.is_active) {
      set.status = "Bad Request"
      return {
        message: "We had sent for this email, please check again",
        data: [],
      }
    }
    if (user && user.is_active) {
      set.status = "Bad Request"
      return {
        message: "Email was exist my system",
        data: [],
      }
    }
    const code_digit = genDigit().toString()
    await sendEmail(email, code_digit)
    await db.insert(users).values({ email, password: "", is_active: false, code_digit })
    set.status = "Created"
    return {
      message: "Sent email",
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
