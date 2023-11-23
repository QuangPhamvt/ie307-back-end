export const accessToken = async (JWT_ACCESS_TOKEN: any, payload: Object) => {
  return await JWT_ACCESS_TOKEN.sign(payload)
}
export const refreshToken = async (JWT_REFRESH_TOKEN: any, payload: Object) => {
  return await JWT_REFRESH_TOKEN.sign(payload)
}
