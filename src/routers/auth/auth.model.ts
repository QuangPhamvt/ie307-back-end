import Elysia, { t } from "elysia"

const signInBodyDto = t.Object({
  email: t.String({ default: "email@example.com", format: "email" }),
  password: t.String({ default: "12345678" }),
})
const signInResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      access_token: t.String(),
      refresh_token: t.String(),
    }),
  ),
})

const signUpBodyDto = t.Object({
  email: t.String({ default: "email@example.com", format: "email" }),
  username: t.String({ default: "CustomAFK" }),
  password: t.String({ default: "12345678" }),
})
const signUpResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      access_token: t.String(),
      refresh_token: t.String(),
    }),
  ),
})

const refreshBodyDto = t.Object({
  refresh: t.String(),
})
const refreshResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      access_token: t.String(),
      refresh_token: t.String(),
    }),
  ),
})

const profileResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      id: t.String(),
      username: t.String(),
      avatar: t.Union([t.String(), t.Null()]),
    }),
  ),
})

const uploadBodyDto = t.Object({
  avatar: t.String({ contentEncoding: "base64" }),
})
const uploadResponseDto = t.Object({
  message: t.String(),
})

const emailAuthBodyDto = t.Object({
  email: t.String({ default: "quangpm220503vt@gmail.com" }),
})
const emailAuthResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Object({})),
})

const authModel = new Elysia().model({
  signInBody: signInBodyDto,
  signInResponse: signInResponseDto,

  signUpBody: signUpBodyDto,
  signUpResponse: signUpResponseDto,

  refreshBody: refreshBodyDto,
  refreshResponse: refreshResponseDto,

  profileResponse: profileResponseDto,

  uploadBody: uploadBodyDto,
  uploadResponse: uploadResponseDto,

  emailAuthBody: emailAuthBodyDto,
  emailAuthResponse: emailAuthResponseDto,
})
export default authModel
