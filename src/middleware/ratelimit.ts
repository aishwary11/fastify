import { HTTP_STATUS_CODE } from '@/common/constant';
import rateLimit, { errorResponseBuilderContext, FastifyRateLimitOptions } from '@fastify/rate-limit';
import { FastifyInstance, FastifyRequest } from 'fastify';

const rateLimitMiddleware = async (fastify: FastifyInstance): Promise<void> => {
  const options: FastifyRateLimitOptions = {
    max: 5,
    timeWindow: '1 minute',
    cache: 1000,
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
    errorResponseBuilder: (req: FastifyRequest, context: errorResponseBuilderContext) => ({
      statusCode: HTTP_STATUS_CODE.TOO_MANY_REQUESTS,
      error: 'Too Many Requests',
      message: `I only allow ${context.max} requests per ${context.after} to this Website. Try again soon.`,
      date: Date.now(),
      expiresIn: context.ttl,
      status: false,
    }),
  };
  await fastify.register(rateLimit, options);
};

export default rateLimitMiddleware;
