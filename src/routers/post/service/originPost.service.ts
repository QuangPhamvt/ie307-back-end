import { s3ObjectUrl } from "aws/s3"
import { desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { comments, posts, users } from "src/database"

type originPostDto = {
  headers: Headers
  body: {
    post_id: string
  }
  set: SetElysia
}
export const originPost = async <T extends originPostDto>(props: T) => {
  const { headers, body, set } = props
  const { post_id } = body
  try {
    const [post] = await db.select().from(posts).where(like(posts.id, post_id))
    const sq = db
      .select({
        comment_id: comments.id,
        context: comments.context,
        create_at: comments.create_at,
        loves: comments.loves,
        post_id: comments.post_id,
        // author_id: users.id,
        // avatar: users.avatar,
        // email: users.email,
      })
      .from(comments)
      .groupBy(comments.post_id)
      .orderBy(desc(comments.create_at))
      .limit(1)
      .offset(0)
      // .innerJoin(users, like(users.id, comments.author_id))
      .as("sq")

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
      .where(like(posts.author_id, post.author_id))
      .innerJoin(users, like(users.id, posts.author_id))

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
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
