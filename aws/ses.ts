import aws from "@aws-sdk/client-ses"
import { createTransport } from "nodemailer"

// Create SES service object
const ses = new aws.SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY || "",
  },
})
let transporter = createTransport({
  SES: { ses, aws },
})
// send some mail
const sendEmail = async (email: string, code_digit: string) => {
  const mailOption = {
    from: "quangpm@customafk.com",
    to: `${email}`,
    subject: `${code_digit} is your Instagram code`,
    text: `${code_digit} is your Instagram code`,
    html: "<b>Hi, thank for use my application. Have a good day!</b>",
  }
  try {
    const info = await transporter.sendMail(mailOption)
    console.log("Email sent successfully!", info.messageId)
  } catch (error) {
    console.log(error)
  }
}
export default sendEmail
