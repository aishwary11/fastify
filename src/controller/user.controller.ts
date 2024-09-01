import { HTTP_STATUS_CODE } from '@/utils/constant';
import responseHelper from '@/utils/responsehelper';
import { FastifyReply, FastifyRequest } from 'fastify';

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name } = request.user as User;
  return responseHelper(reply, HTTP_STATUS_CODE.OK, `Hello ${name}`);
};

export const getUserId = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string; };
  return responseHelper(reply, HTTP_STATUS_CODE.OK, `ID: ${id}`);
};
