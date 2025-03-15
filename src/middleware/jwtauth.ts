import { HTTP_STATUS_CODE } from '@/common/constant';
import responseHelper from '@/common/utils/responsehelper';
import UserModel from '@/models/user';
import { FastifyReply, FastifyRequest } from 'fastify';

const jwtAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const publicApis = ['/user/signin', '/user/signup', '/user/verify-totp'];
  if (!publicApis.includes(request.url)) {
    try {
      const { name, email }: User = await request.jwtVerify();
      const user = await UserModel.findOne({ name, email });
      if (!user) {
        return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'User not found');
      }
    } catch (err) {
      return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'Token is invalid');
    }
  }
};
export default jwtAuth;
