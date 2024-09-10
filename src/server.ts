import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import 'dotenv/config';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { HTTP_STATUS_CODE } from './common/constant';
import connectDB from './common/utils/db';
import responseHelper from './common/utils/responsehelper';
import './common/utils/socketio';
import jwtAuth from './middleware/jwtauth';
import rateLimitMiddleware from './middleware/ratelimit';
import userRoutes from './routes/user.route';

const fastify: FastifyInstance = Fastify({ logger: true, keepAliveTimeout: 5000, connectionTimeout: 5000 });

fastify.register(helmet, { contentSecurityPolicy: false });
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST'],
});
fastify.register(fastifySocketIO, {
  cors: {
    origin: '*',
  },
});

const startServer = async () => {
  try {
    await connectDB();
    await rateLimitMiddleware(fastify);
    fastify.register(fastifyJwt, { secret: process.env.SECRET_KEY! });
    fastify.ready().then(() => {
      fastify.io.on('connection', socket => {
        fastify.log.info('Client connected:', socket.id);
        socket.on('disconnect', () => fastify.log.info('Client disconnected:', socket.id));
        socket.on('message', msg => {
          fastify.log.info('Message received:', msg);
          fastify.io.emit('message', msg);
        });
      });
    });
    fastify.addHook('onRequest', jwtAuth);
    fastify.register(userRoutes, { prefix: '/user' });

    fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => responseHelper(reply, HTTP_STATUS_CODE.NOT_FOUND, 'Route not found'));
    await fastify.listen({ port: Number(process.env.PORT) });
    fastify.log.info(`Server listening on port ${process.env.PORT}`);
  } catch (error) {
    fastify.log.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

const shutdown = () => {
  fastify
    .close()
    .then(() => {
      fastify.log.error('Fastify server closed');
      process.exit(0);
    })
    .catch(err => {
      fastify.log.error('Error closing Fastify server:', err);
      process.exit(1);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
