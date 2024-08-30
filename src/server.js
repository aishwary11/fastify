import cors from '@fastify/cors';
import helmet from "@fastify/helmet";
import fastifyJwt from '@fastify/jwt';
import rateLimit from "@fastify/rate-limit";
import 'dotenv/config';
import Fastify from "fastify";
import jwtAuth from './middleware/jwtauth.js';
import userRoutes from './route/user.route.js';
import { HTTP_STATUS_CODE } from './utils/constant.js';
import responseHelper from './utils/responsehelper.js';

const fastify = Fastify({ logger: true, keepAliveTimeout: 5000, connectionTimeout: 5000 });

(async () => {
  fastify.register(helmet, { contentSecurityPolicy: false });
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  });

  fastify.register(fastifyJwt, {
    secret: process.env.SECRET_KEY
  });

  await fastify.register(rateLimit, {
    max: 10,
    timeWindow: '1 minute',
    cache: 1000,
    onLimitExceeded: (request, reply) => responseHelper(reply, HTTP_STATUS_CODE.TOO_MANY_REQUESTS, 'Too many requests, please try again later.'),
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true
    }
  });

  fastify.addHook('onRequest', jwtAuth);

  fastify.post('/login', (request, reply) => {
    const token = fastify.jwt.sign(request.body);
    return responseHelper(reply, HTTP_STATUS_CODE.OK, 'Login successful', { token: token });
  });

  fastify.get('/', async (request, reply) => {
    const { name, designation } = request.user;
    return responseHelper(reply, HTTP_STATUS_CODE.OK, `Hello ${name}, position ${designation}`);
  });

  fastify.register(userRoutes, { prefix: '/user' });

  fastify.setNotFoundHandler((request, reply) => responseHelper(reply, HTTP_STATUS_CODE.NOT_FOUND, 'Route not found'));

  fastify.listen({ port: process.env.PORT }, (err, address) => {
    if (err) {
      fastify.log.error('Error starting server:', err.message);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  });
})();
