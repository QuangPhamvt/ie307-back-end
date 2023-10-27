import jwt from "@elysiajs/jwt"

export const JWT_ACCESS_TOKEN = jwt({
  name: "JWT_ACCESS_TOKEN",
  secret: process.env.JWT_ACCESS_SECRETKEY || "access_token",
  exp: process.env.JWT_ACCESS_EXPIRY || "30s",
})
export const JWT_REFRESH_TOKEN = jwt({
  name: "JWT_REFRESH_TOKEN",
  secret: process.env.JWT_REFRESH_SECRETKEY || "refresh_token",
  exp: process.env.JWT_REFRESH_EXPIRY || "3d",
})
