import { followUser } from "./followUser.service"
import { unFollowUser } from "./unFollowUser.service"
import { getFollowing } from "./getFollowing.service"
const followService = {
  getFollowing,
  followUser,
  unFollowUser,
}
export default followService
