import { getUser, getUserId, signIn, signUp, verifyTotp } from '@/controller/user.controller';
import { FastifyInstance } from 'fastify';
const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', getUser);
  fastify.get('/:id', getUserId);
  fastify.post('/signin', signIn);
  fastify.post('/verify-totp', verifyTotp);
  fastify.post('/signup', signUp);
};
export default userRoutes;
