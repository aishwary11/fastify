import { getUser, getUserId } from '@/controller/user.controller';
import { FastifyInstance } from 'fastify';
const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', getUser);
  fastify.get('/:id', getUserId);
};
export default userRoutes;
