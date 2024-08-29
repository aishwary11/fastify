import responseHelper from "../helper/responsehelper.js";

const jwtAuth = async (request, reply) => {
  if (request.url !== "/login" && request.url !== "/register") {
    try {
      await request.jwtVerify();
    } catch (err) {
      responseHelper(reply, 401, "Token is invalid");
    }
  }
};
export default jwtAuth;