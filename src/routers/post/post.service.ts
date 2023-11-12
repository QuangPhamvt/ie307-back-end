import { s3ObjectUrl, uploadObject } from "aws/s3"
import { asc, desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { posts } from "src/database"

type TBodyPostList = {
  page?: number
  limit?: number
}
type TBodySearch = {
  search?: string
}
type TBodyUpload = {
  title?: string
  image?: string
}
type TBodyOriginPost = {
  postId?: string
}
/* Enhanced from: https://codepen.io/trongthanh/pen/rmYBdX */
function toSlug(str: string) {
  // Convert to lower case
  str = str.toLowerCase()

  // delete sign
  str = str
    .normalize("NFD") // convert string to unicode
    .replace(/[\u0300-\u036f]/g, "") // delete sign

  // replace đĐ to d
  str = str.replace(/[đĐ]/g, "d")

  //  delete special characters
  str = str.replace(/([^0-9a-z-\s])/g, "")

  // replace key space to "-"
  str = str.replace(/(\s+)/g, "-")
  str = str.replace(/-+/g, "-")
  str = str.replace(/^-+|-+$/g, "")

  // return
  return str
}

const postService: {
  [x: string]: <TBody extends TBodyPostList & TBodyUpload & TBodySearch & TBodyOriginPost>(
    body: TBody,
    headers?: Headers,
    set?: SetElysia,
  ) => unknown
} = {
  postList: async (body) => {
    const { page = 1, limit = 5 } = body
    const postList = await db
      .select({
        id: posts.id,
        image: posts.image,
      })
      .from(posts)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(posts.createAt))
    return {
      message: "Ok",
      postList: postList.map((item) => {
        return {
          ...item,
          image: s3ObjectUrl(item.image || ""),
        }
      }),
    }
  },
  search: async (body, headers, set) => {
    const { search } = body
    if (!search) {
      set && (set.status = 400)
      return {
        message: "Bad request",
      }
    }
    const postList = await db
      .select({
        id: posts.id,
        author: {
          username: users.username,
          avatar: users.avatar,
        },
        image: posts.image,
        createAt: posts.createAt,
        slug: posts.slug,
        published: posts.published,
        loves: posts.loves,
        shares: posts.shares,
      })
      .from(posts)
      .innerJoin(users, like(posts.authorId, users.id))
      .where(like(posts.slug, `%${toSlug(search)}%`))
      .orderBy(desc(posts.createAt))
    return {
      message: "Ok",
      posts: postList.map((item) => {
        return {
          ...item,
          author: {
            ...item.author,
            avatar: item.author.avatar && s3ObjectUrl(item.author.avatar),
          },
          image: s3ObjectUrl(item.image || ""),
        }
      }),
    }
  },
  upload: async (body, headers, set) => {
    const { title, image } = body

    if (!title || !image) {
      set && (set.status = 400)
      return {
        messaga: "Bad request",
      }
    }

    const [user] = await db
      .select()
      .from(users)
      .where(like(users.id, headers?.get("userId") || ""))
    const newPost = {
      authorId: user.id,
      title,
      slug: toSlug(title),
    }
    await db.insert(posts).values(newPost)
    const [post] = await db
      .select()
      .from(posts)
      .where(like(posts.authorId, user.id))
      .limit(1)
      .orderBy(desc(posts.createAt))

    const url = `ie307/users/${user.id}/posts/${post.id}.webp`

    const blob = await fetch(image).then((res) => res.blob())
    await db.update(posts).set({ image: url }).where(like(posts.id, post.id))
    await uploadObject(url, blob, "image/webp")

    set && (set.status = 201)
    return {
      message: "Created",
    }
  },
  originPost: async (body) => {
    const { postId = "" } = body
    const [data] = await db
      .select({
        id: posts.id,
        title: posts.title,
        image: posts.image,
        authorId: users.id,
        authorUsername: users.username,
        authorAvatar: users.avatar,
      })
      .from(posts)
      .where(like(posts.id, postId))
      .innerJoin(users, like(posts.authorId, users.id))
    return {
      originPost: {
        ...data,
        image: data.image && s3ObjectUrl(data.image),
        authorAvatar: data.authorAvatar && s3ObjectUrl(data.authorAvatar),
      },
    }
  },
}

export default postService
