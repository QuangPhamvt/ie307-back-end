import { Resend } from "resend"

const RESEND = new Resend(process.env.RESEND_KEY || "")
/**
 *
 * @param {string} email email user, u want to send
 * @param {string} subject text string when send for email
 * @param {string} text text string when send
 */
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
      html: `${text}`,
    })
  } catch (error) {
    console.error(error)
  }
}
export default resend
