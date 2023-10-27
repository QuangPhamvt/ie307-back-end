import jwt from "@elysiajs/jwt"
import Elysia, { t } from "elysia"
import authService from "./auth.service"
import authorizationMiddleware from "src/middleware/authorization"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "src/config/jwt"
const authRouter = new Elysia()
  .use(JWT_ACCESS_TOKEN)
  .use(JWT_REFRESH_TOKEN)
  .post(
    "",
    ({ body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, request }) => {
      if (!!body.signIn) {
        return authService.signIn(body.signIn, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN)
      }
      if (!!body.signUp) {
        return authService.signUp(body.signUp, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN)
      }
      if (!!body.refresh) {
        return authService.refresh(body.refresh, set, request, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN)
      }
    },
    {
      body: t.Partial(
        t.Object({
          signIn: t.Object({
            username: t.String({ default: "CustomAFK" }),
            password: t.String({ default: "12345678" }),
          }),
          signUp: t.Object({
            username: t.String({ default: "CustomAFK" }),
            password: t.String({ default: "12345678" }),
          }),
          refresh: t.Object({
            refresh: t.String(),
          }),
        }),
      ),
      detail: {
        tags: ["Auth"],
      },
    },
  )
  .use(authorizationMiddleware)
  .get(
    "/profile",
    ({ request: { headers }, set }) => {
      return authService.profile(headers, set)
    },
    {
      detail: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/upload",
    ({ request: { headers }, body, set }) => {
      return authService.upload(headers, body, set)
    },
    {
      body: t.Partial(
        t.Object({
          username: t.String({ example: "CustomAFK" }),
          password: t.String({ example: "123456" }),
          avatar: t.File({ type: "image" }),
        }),
      ),
      detail: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default authRouter
