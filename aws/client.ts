import { S3Client } from "@aws-sdk/client-s3"

const client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY || "",
  },
})
export default client
