import { Resend } from "resend"

const RESEND = new Resend(process.env.RESEND_KEY || "")
type TResend = {
  email: string
  subject: string
  text: string
}
const resend = async (payload: TResend) => {
  const { email, subject, text } = payload
  try {
    await RESEND.emails.send({
      from: "Customafk <quangpm@customafk.com>",
      to: [`${email}`],
      subject: `${subject}`,
      text: `${text}`,
    })
  } catch (error) {
    console.error(error)
  }
}
export default resend
