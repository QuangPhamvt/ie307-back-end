import { s3ObjectUrl } from "aws/s3"
import { and, desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { follows, posts, profiles, users } from "src/database"

type TGetUserDetail = {
  headers: Headers
  body: {
    user_id: string
  }
  set: SetElysia
}
export const getUserDetail = async <T extends TGetUserDetail>(props: T) => {
  const { headers, set, body } = props
  const authId = headers.get("userId") || ""
  const { user_id } = body
  console.log(user_id)

  try {
    const [user] = await db
      .select({
        user_id: users.id,
        avatar: users.avatar,
        email: users.email,
        username: profiles.username,
        bio: profiles.bio,
        follows: follows.follows,
        following: follows.following,
      })
      .from(users)
      .where(like(users.id, user_id))
      .innerJoin(profiles, like(profiles.user_id, users.id))
      .leftJoin(follows, like(follows.id, users.id))

    const post = await db
      .select({
        post_id: posts.id,
        images: posts.images,
        create_at: posts.create_at,
      })
      .from(posts)
      .where(like(posts.author_id, user_id))
      .orderBy(desc(posts.create_at))
    const User = {
      ...user,
      avatar: user.avatar ? s3ObjectUrl(user.avatar) : null,
    }
    const Post = post.map((post) => {
      const images: Array<string> = JSON.parse(post.images)
      return {
        ...post,
        images: images.map((image) => s3ObjectUrl(image)),
      }
    })
    return {
      message: "Oke",
      data: [
        {
          user: User,
          posts: Post,
        },
      ],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
