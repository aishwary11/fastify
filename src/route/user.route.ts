import zodValidation from '@/common/utils/zodvalidation';
import { userSchema } from '@/common/validation/user.validation';
import { getUser, getUserId, signIn, signUp, verifyTotp } from '@/controller/user.controller';
import { FastifyInstance } from 'fastify';
const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', getUser);
  fastify.get('/:id', getUserId);
  fastify.post('/signin', { preValidation: [zodValidation(userSchema)] }, signIn);
  fastify.post('/signup', { preValidation: [zodValidation(userSchema)] }, signUp);
  fastify.post('/verify-totp', verifyTotp);
};
export default userRoutes;
