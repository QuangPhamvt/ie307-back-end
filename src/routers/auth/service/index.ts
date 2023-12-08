import { signIn } from "./signIn.service"
import { signUp } from "./signUp.service"
import { refresh } from "./refresh.service"
import { profile } from "./profile.service"
import { upload } from "./upload.service"
import { emailAuth } from "./emailAuth.service"
const authService = {
  signIn,
  signUp,
  refresh,
  profile,
  upload,
  emailAuth,
}
export default authService
