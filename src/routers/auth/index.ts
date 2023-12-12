import Elysia, { t } from "elysia"
import authorizationMiddleware from "src/middleware/authorization"
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "src/config/jwt"
import authModel from "./auth.model"
import authService from "./service"
const authRouter = new Elysia()
  .use(authModel)
  .use(JWT_ACCESS_TOKEN)
  .use(JWT_REFRESH_TOKEN)
  .post(
    "/signIn",
    ({ request: { headers }, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) => {
      return authService.signIn({ headers, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN })
    },
    {
      body: "signInBody",
      response: "signInResponse",
      detail: {
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/signUp",
    ({ request: { headers }, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) => {
      return authService.signUp({ headers, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN })
    },
    {
      body: "signUpBody",
      response: "signUpResponse",
      detail: {
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/refresh",
    ({ set, body, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN }) => {
      return authService.refresh({ set, body, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN })
    },
    {
      body: "refreshBody",
      response: "refreshResponse",
      detail: {
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/email-auth",
    ({ set, body }) => {
      return authService.emailAuth({ set, body })
    },
    {
      body: "emailAuthBody",
      response: "emailAuthResponse",
      detail: {
        tags: ["Auth"],
      },
    },
  )
  .use(authorizationMiddleware)
  .get(
    "/profile",
    ({ request: { headers }, set }) => {
      return authService.profile({ headers, set })
    },
    {
      response: "profileResponse",
      detail: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/upload",
    ({ request: { headers }, body, set }) => {
      return authService.upload({ headers, body, set })
    },
    {
      body: "uploadBody",
      response: "uploadResponse",
      detail: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default authRouter
