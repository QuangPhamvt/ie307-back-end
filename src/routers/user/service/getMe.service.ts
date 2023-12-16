import { s3ObjectUrl } from "aws/s3"
import { desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { follows, posts, profiles, users } from "src/database"

type TGetMe = {
  headers: Headers
  set: SetElysia
}
export const getMe = async (props: TGetMe) => {
  const { headers, set } = props
  const user_id = headers.get("userId") || ""
  console.log(user_id)
  try {
    const [user] = await db
      .select({
        user_id: users.id,
        email: users.email,
        avatar: users.avatar,
        username: profiles.username,
        bio: profiles.bio,
        follows: {
          follows: follows.follows,
          following: follows.following,
          following_id: follows.following_id,
        },
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
    const Posts = post.map((post) => {
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
          posts: Posts,
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
