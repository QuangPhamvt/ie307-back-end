import { postList } from "./postList.service"
import { search } from "./search.service"
import { originPost } from "./originPost.service"
import { upload } from "./upload.service"
import { postListMain } from "./postListMain.service"
const postService = {
  postList,
  search,
  originPost,
  upload,
  postListMain,
}
export default postService
