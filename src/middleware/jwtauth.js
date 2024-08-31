import User from "../models/user.js";
import { HTTP_STATUS_CODE } from "../utils/constant.js";
import responseHelper from "../utils/responsehelper.js";

const jwtAuth = async (request, reply) => {
  if (request.url !== "/login" && request.url !== "/register") {
    try {
      const { name, email } = await request.jwtVerify();
      const user = await User.findOne({ name, email });
      if (!user) return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, "User not found");
    } catch (err) {
      return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, "Token is invalid");
    }
  }
};
export default jwtAuth;