import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { accessToken, existUser, insertUser, refreshToken } from "src/utilities"

type signUpDto = {
  headers: Headers
  body: {
    email: string
    username: string
    password: string
  }
  set: SetElysia
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
}
export const signUp = async <T extends signUpDto>(props: T) => {}
