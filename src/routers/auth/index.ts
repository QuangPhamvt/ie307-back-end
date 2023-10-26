import jwt from "@elysiajs/jwt"
import Elysia, { t } from "elysia"
import authService from "./auth.service"
import authorizationMiddleware from "src/middleware/authorization"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "src/config/jwt"
const authRouter = new Elysia()
  .use(JWT_ACCESS_TOKEN)
  .use(JWT_REFRESH_TOKEN)
  .post(
    "/sign-in",
    ({ body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) =>
      authService.signIn(body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN),
    {
      body: t.Object({
        username: t.String({ default: "CustomAFK", description: "Username" }),
        password: t.String({ default: "123456", description: "Password" }),
      }),
      detail: {
        summary: "Sign in the user",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/sign-up",
    ({ set, body, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) =>
      authService.signUp(body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN),
    {
      body: t.Object({
        username: t.String({ default: "CustomAFK", description: "Username" }),
        password: t.String({ default: "123456", description: "Password" }),
      }),
      detail: {
        summary: "Sign up the user",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/refresh",
    ({ body, set, request, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) => {
      return authService.refresh(body, set, request, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN)
    },
    {
      body: t.Object({
        refresh: t.String(),
      }),
      detail: {
        tags: ["Auth"],
        responses: {
          "200": {
            description: "Ok",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh: { type: "string" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", description: "Unauthorized" },
                  },
                },
              },
            },
          },
        },
      },
    },
  )
  .use(authorizationMiddleware)
  .post(
    "/profile",
    ({ request: { headers } }) => {
      return {
        headers: headers.get("userId"),
      }
    },
    {
      detail: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post("/upload", () => {})
export default authRouter
