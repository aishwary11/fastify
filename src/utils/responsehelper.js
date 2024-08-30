import { HTTP_STATUS_CODE } from "./constant.js";

const responseHelper = (reply, statusCode, message, data = null) => reply.status(statusCode).send({ status: statusCode < HTTP_STATUS_CODE.BAD_REQUEST, message, data });

export default responseHelper;