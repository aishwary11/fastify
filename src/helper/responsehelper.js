const responseHelper = (reply, statusCode, message, data = null) => reply.status(statusCode).send({ status: statusCode < 400, message, data });

export default responseHelper;