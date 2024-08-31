import { getUser, getUserId } from "../controller/user.controller.js";
const userRoutes = async (fastify) => {
  fastify.get('/', getUser);
  fastify.get('/:id', getUserId);
};
export default userRoutes;