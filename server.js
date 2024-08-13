import cors from '@fastify/cors';
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST'],
});

await fastify.register(rateLimit, {
  max: 5,
  timeWindow: '1 minute',
  cache: 1000,
  onLimitExceeded: (request, reply) => reply.status(429).send({
    message: 'Too many requests, please try again later.',
  }),
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true,
    'retry-after': true
  }
});

fastify.get('/', async (request, reply) => reply.status(200).send('Hello World!'));

fastify.post('/home', async (request, reply) => {
  fastify.log.info(`Request body received: ${JSON.stringify(request.body)}`);
  return reply.status(200).send({
    message: 'Success',
    data: request.body
  });
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error('Error starting server:', err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});
