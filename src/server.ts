import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import 'dotenv/config';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from './common/constant';
import connectDB from './common/utils/db';
import responseHelper from './common/utils/responsehelper';
import jwtAuth from './middleware/jwtauth';
import rateLimitMiddleware from './middleware/ratelimit';
import userRoutes from './route/user.route';

const fastify: FastifyInstance = Fastify({ logger: true, keepAliveTimeout: 5000, connectionTimeout: 5000 });

(async () => {
  await connectDB();
  fastify.register(helmet, { contentSecurityPolicy: false });
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  });
  fastify.register(fastifyJwt, {
    secret: process.env.SECRET_KEY!,
  });
  await rateLimitMiddleware(fastify);
  fastify.addHook('onRequest', jwtAuth);
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email } = request.user as User;
    return responseHelper(reply, HTTP_STATUS_CODE.OK, `Hello ${name}, Email ${email}`);
  });
  fastify.register(userRoutes, { prefix: '/user' });
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => responseHelper(reply, HTTP_STATUS_CODE.NOT_FOUND, 'Route not found'));
  fastify.listen({ port: Number(process.env.PORT) }, (err: Error | null, address: string) => {
    if (err) {
      fastify.log.error('Error starting server:', err.message);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  });
})();
