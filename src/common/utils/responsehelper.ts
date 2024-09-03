import { FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE } from '../constant';

const responseHelper = (reply: FastifyReply, statusCode: number, message: string, data?: any) => reply.status(statusCode).send({ status: statusCode < HTTP_STATUS_CODE.BAD_REQUEST, message, data });

export default responseHelper;
