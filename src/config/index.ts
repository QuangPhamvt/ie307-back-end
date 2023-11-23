import { Prettify } from "elysia/dist/types"
import { HTTPStatusName } from "elysia/dist/utils"
import { CookieOptions } from "elysia/dist/cookie"

export type SetElysia = {
  headers: Record<string, string> & {
    "Set-Cookie"?: string | string[]
  }
  status?: number | HTTPStatusName
  redirect?: string
  cookie?: Record<
    string,
    Prettify<
      {
        value: string
      } & CookieOptions
    >
  >
}

export { default as document } from "./documents"
