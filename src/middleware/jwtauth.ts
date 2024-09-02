import UserModel from '@/models/user';
import { HTTP_STATUS_CODE } from '@/utils/constant';
import responseHelper from '@/utils/responsehelper';
import { FastifyReply, FastifyRequest } from 'fastify';

const jwtAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  if (request.url !== '/user/login' && request.url !== '/user/register') {
    try {
      const { name, email }: User = await request.jwtVerify();
      const user = await UserModel.findOne({ name, email });
      if (!user) return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'User not found');
    } catch (err) {
      return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'Token is invalid');
    }
  }
};
export default jwtAuth;
