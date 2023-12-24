import Elysia, { t } from "elysia"

const signInBodyDto = t.Object({
  email: t.String({ default: "quangpm220503vt@gmail.com", format: "email" }),
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
  email: t.String({ default: "quangpm220503vt@gmail.com", format: "email" }),
  password: t.String({ default: "12345678" }),
  code_digit: t.String({ default: "190256" }),
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
      email: t.Union([t.String(), t.Null()]),
      username: t.Union([t.String(), t.Null()]),
      avatar: t.Union([t.String(), t.Null()]),
      name: t.Union([t.String(), t.Null()]),
      pronouns: t.Union([t.String(), t.Null()]),
      bio: t.Union([t.String(), t.Null()]),
      gender: t.Union([t.Literal("male"), t.Literal("female"), t.Literal("Can not say"), t.Null()]),
    }),
  ),
})

const uploadBodyDto = t.Object({
  avatar: t.String({ contentEncoding: "base64" }),
})
const uploadResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Object({})),
})

const emailAuthBodyDto = t.Object({
  email: t.String({ default: "quangpm220503vt@gmail.com" }),
})
const emailAuthResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Object({})),
})

const sendChangePasswordResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Any()),
})
const changePasswordBodyDto = t.Object({
  code_digit: t.String(),
  password: t.String(),
})
const changePasswordResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Any()),
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

  sendChangePasswordResponse: sendChangePasswordResponseDto,

  changePasswordBody: changePasswordBodyDto,
  changePasswordResponse: changePasswordResponseDto,
})
export default authModel
