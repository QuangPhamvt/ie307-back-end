import { like } from "drizzle-orm"
import resend from "email/index"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { genDigit } from "src/utilities"

type TSendEmailChangePassword = {
  headers: Headers
  set: SetElysia
}
export const sendEmailChangePassword = async (props: TSendEmailChangePassword) => {
  const { headers, set } = props
  const user_id = headers.get("userId") || ""
  try {
    const [user] = await db.select().from(users).where(like(users.id, user_id))
    const code = genDigit().toString()
    await resend({
      email: user.email || "",
      subject: "Code to change password Application",
      text: `
      This is code to change Password, please don't share for anyone.<br/> 
      <b>${code}</b>`,
    })
    await db.update(users).set({ code_change_password: code }).where(like(users.id, user_id))
    return {
      message: "Please check your mail. We have sent you an email",
      data: [],
    }
  } catch (error) {
    console.log(error)
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
