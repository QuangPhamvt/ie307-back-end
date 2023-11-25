import { SetElysia } from "src/config"
import db, { follow } from "src/database"

type followUserDto = {
  headers: Headers
  body: {
    following_id: string
  }
  set: SetElysia
}
export const followUser = async <T extends followUserDto>(props: T) => {
  const { headers, body, set } = props
  const userId = headers.get("userId") || ""
  if (userId === body.following_id) {
    set.status === 400
    return {
      message: "Bad request",
    }
  }
  try {
    const newFollow = {
      follower_id: userId,
      following_id: body.following_id,
    }
    await db.insert(follow).values(newFollow)
    set.status = 201
    return {
      message: "Created",
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
    }
  }
}
