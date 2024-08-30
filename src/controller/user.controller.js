import { HTTP_STATUS_CODE } from "../utils/constant.js";
import responseHelper from "../utils/responsehelper.js";

export const getUser = async (request, reply) => responseHelper(reply, HTTP_STATUS_CODE.OK, `Hello ${request.user.name}`);
export const getUserId = async (request, reply) => responseHelper(reply, HTTP_STATUS_CODE.OK, `ID: ${request.params.id}`);