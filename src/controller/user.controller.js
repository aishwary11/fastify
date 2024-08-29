import responseHelper from "../helper/responsehelper.js";

export const getUser = async (request, reply) => responseHelper(reply, 200, `Hello ${request.user.name}`);
export const getUserId = async (request, reply) => responseHelper(reply, 200, `ID: ${request.params.id}`);