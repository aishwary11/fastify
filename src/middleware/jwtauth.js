import { HTTP_STATUS_CODE } from "../utils/constant.js";
import responseHelper from "../utils/responsehelper.js";

const jwtAuth = async (request, reply) => {
  if (request.url !== "/login" && request.url !== "/register") {
    try {
      await request.jwtVerify();
    } catch (err) {
      responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, "Token is invalid");
    }
  }
};
export default jwtAuth;