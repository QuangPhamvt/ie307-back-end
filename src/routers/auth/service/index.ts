import { signIn } from "./signIn.service"
import { signUp } from "./signUp.service"
import { refresh } from "./refresh.service"
import { profile } from "./profile.service"
import { upload } from "./upload.service"
const authService = {
  signIn,
  signUp,
  refresh,
  profile,
  upload,
}
export default authService
