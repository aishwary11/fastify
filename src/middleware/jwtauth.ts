import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '../common/constant';
import responseHelper from '../common/utils/responsehelper';
import UserModel from '../models/user';

const PUBLIC_APIS = new Set(['/user/signin', '/user/signup', '/user/verify-totp']);

const jwtAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  if (PUBLIC_APIS.has(request.url)) return;
  try {
    const { name, email }: User = await request.jwtVerify();
    const user = await UserModel.findOne({ name, email });
    if (!user) {
      return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'User not found');
    }
  } catch (err) {
    request.log.error({ err }, 'JWT verification failed');
    return responseHelper(reply, HTTP_STATUS_CODE.UNAUTHORIZED, 'Token is invalid');
  }
};

export default jwtAuth;
