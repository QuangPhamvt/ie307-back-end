import { uploadObject } from "aws/s3"
import { SetElysia } from "src/config"
import db, { stories } from "src/database"
import { v4 as uuidv4 } from "uuid"

type TUploadStory = {
  headers: Headers
  body: {
    image: string
  }
  set: SetElysia
}
const uploadStory = async (props: TUploadStory) => {
  const { headers, set, body } = props
  const user_id = headers.get("userId") || ""
  const { image } = body
  try {
    const id = uuidv4()
    const url = `ie307/users/${user_id}/stories/${id}.webp`
    const blob = await fetch(image).then((res) => res.blob())
    await uploadObject(url, blob, "image/webp")
    await db.insert(stories).values({ image: url, author_id: user_id })
    set.status = "Created"
    return {
      message: "Created",
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
export default uploadStory
