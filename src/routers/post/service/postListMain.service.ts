import { s3ObjectUrl } from "aws/s3"
import { desc, like, or } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { comments, posts, users } from "src/database"

type TPostListMain = {
  headers: Headers
  body: {
    user_id: Array<string>
  }
  set: SetElysia
}
export const postListMain = async (props: TPostListMain) => {
  const { headers, body, set } = props
  const user_id = headers.get("userId") || ""
  const user = body.user_id
  try {
    const postList = await db
      .select({
        id: posts.id,
        title: posts.title,
        loves: posts.loves,
        comments: posts.comments,
        create_at: posts.create_at,
        slug: posts.slug,
        images: posts.images,
        author_id: users.id,
        avatar: users.avatar,
        email: users.email,
      })
      .from(posts)
      .where(
        or(
          like(posts.author_id, user[0] || ""),
          like(posts.author_id, user[1] || ""),
          like(posts.author_id, user[2] || ""),
          like(posts.author_id, user[3] || ""),
          like(posts.author_id, user[4] || ""),
        ),
      )
      .innerJoin(users, like(users.id, posts.author_id))
      .limit(5)
      .orderBy(desc(posts.create_at))
    let data: any[] = []
    await Promise.all(
      postList.map(async (post) => {
        const images = JSON.parse(post.images).map((item: string) => s3ObjectUrl(item))
        const [comment] = await db
          .select()
          .from(comments)
          .where(like(comments.id, post.id))
          .innerJoin(users, like(comments.author_id, users.id))
          .orderBy(desc(comments.create_at))
        if (!data.length) {
          data = [
            {
              id: post.id,
              title: post.title,
              images,
              loves: post.loves,
              comments: post.comments,
              create_at: post.create_at,
              author_id: post.author_id,
              email: post.email,
              avatar: post.avatar ? s3ObjectUrl(post.avatar) : null,
              comment: comment
                ? {
                    author_id: comment.users.id,
                    avatar: comment.users.avatar,
                    email: comment.users.email,
                    context: comment.comments.context,
                    loves: comment.comments.loves,
                    create_at: comment.comments.create_at,
                  }
                : null,
            },
          ]
        } else {
          data = [
            ...data,
            {
              id: post.id,
              title: post.title,
              images,
              loves: post.loves,
              comments: post.comments,
              create_at: post.create_at,
              author_id: post.author_id,
              email: post.email,
              avatar: post.avatar ? s3ObjectUrl(post.avatar) : null,
              comment: comment
                ? {
                    author_id: comment.users.id,
                    avatar: comment.users.avatar,
                    email: comment.users.email,
                    context: comment.comments.context,
                    loves: comment.comments.loves,
                    create_at: comment.comments.create_at,
                  }
                : null,
            },
          ]
        }
      }),
    )
    return {
      message: "Oke",
      data: data,
    }
  } catch (error) {
    set.status = "Internal Server Error"
    console.log(error)
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
