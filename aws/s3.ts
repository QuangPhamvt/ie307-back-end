import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import client from "./client"
import { Upload } from "@aws-sdk/lib-storage"
import {
  NodeJsRuntimeStreamingBlobTypes,
  BrowserRuntimeStreamingBlobTypes,
} from "@smithy/types/dist-types/streaming-payload/streaming-blob-common-types"

export const s3ObjectUrl = (url: string) =>
  `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` + url
export const getObject = async (key: string) => {
  const input = {
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: key,
  }
  const command = new GetObjectCommand(input)
  const url = await getSignedUrl(client, command, { expiresIn: 3600 })
  return url
}
export const uploadObject = async (
  key: string,
  body: NodeJsRuntimeStreamingBlobTypes | BrowserRuntimeStreamingBlobTypes,
  contentType: string,
) => {
  try {
    const paralleUploads3 = new Upload({
      client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME || "",
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      tags: [],
      /**
       * The size of the concurrent queue manager to upload parts in parallel. Set to 1 for synchronous uploading of parts.
       * Note that the uploader will buffer at most queueSize * partSize bytes into memory at any given time.
       * default: 4
       */
      queueSize: 4,
      /**
       * Default: 5 mb
       * The size in bytes for each individual part to be uploaded.
       * Adjust the part size to ensure the number of parts does not exceed maxTotalParts.
       * See 5mb is the minimum allowed part size.
       */
      partSize: 1024 * 1024 * 5,
      /**
       * Default: false
       * Whether to abort the multipart upload if an error occurs.
       * Set to true if you want to handle failures manually. If set to false (default)
       * the upload will drop parts that have failed.
       */
      leavePartsOnError: false,
    })
    await paralleUploads3.done()
  } catch (error) {
    console.log("🚀 ~ file: s3.ts:55 ~ error:", error)
  }
}
