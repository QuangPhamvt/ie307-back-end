import { getMe } from "./getMe.service"
import { uploadFollow } from "./uploadFollow.service"
import { getUserDetail } from "./getUserDetail.service"
import { uploadProfile } from "./uploadProfile.service"
const userService = {
  getUserDetail,
  getMe,
  uploadFollow,
  uploadProfile,
}
export default userService
