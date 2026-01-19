import { FastifyReply } from 'fastify';
import { HTTP_STATUS_CODE } from '../constant';

interface ResponseData {
  status: boolean;
  message: string;
  data?: any;
}

const responseHelper = (reply: FastifyReply, statusCode: number, message: string, data?: any): FastifyReply => {
  const response: ResponseData = {
    status: statusCode < HTTP_STATUS_CODE.BAD_REQUEST,
    message,
    ...(data !== undefined && { data })
  };
  return reply.status(statusCode).send(response);
};

export default responseHelper;
