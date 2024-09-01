import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import 'dotenv/config';
import Fastify from 'fastify';
import jwtAuth from './middleware/jwtauth';
import rateLimitMiddleware from './middleware/ratelimit';
import userRoutes from './route/user.route';
import { HTTP_STATUS_CODE } from './utils/constant';
import connectDB from './utils/db';
import responseHelper from './utils/responsehelper';

const fastify = Fastify({ logger: true, keepAliveTimeout: 5000, connectionTimeout: 5000 });

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

  fastify.post('/login', (request, reply) => {
    const token = fastify.jwt.sign(request.body as Object);
    return responseHelper(reply, HTTP_STATUS_CODE.OK, 'Login successful', { token });
  });

  fastify.get('/', async (request, reply) => {
    const { name, email } = request.user as User;
    return responseHelper(reply, HTTP_STATUS_CODE.OK, `Hello ${name}, Email ${email}`);
  });

  fastify.register(userRoutes, { prefix: '/user' });

  fastify.setNotFoundHandler((request, reply) => responseHelper(reply, HTTP_STATUS_CODE.NOT_FOUND, 'Route not found'));

  fastify.listen({ port: Number(process.env.PORT) }, (err: Error | null, address: string) => {
    if (err) {
      fastify.log.error('Error starting server:', err.message);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  });
})();
