import jwt from "@elysiajs/jwt"

export const JWT_ACCESS_TOKEN = jwt({
  name: "JWT_ACCESS_TOKEN",
  secret: "ACCESS_KEY",
  exp: "360s",
})
export const JWT_REFRESH_TOKEN = jwt({
  name: "JWT_REFRESH_TOKEN",
  secret: "REFRESH_TOKEN",
  exp: "10d",
})
