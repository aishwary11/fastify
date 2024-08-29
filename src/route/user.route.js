import { getUser, getUserId } from "../controller/user.controller.js";

export default async function userRoutes(fastify) {
  fastify.get('/', getUser);
  fastify.get('/:id', getUserId)
}