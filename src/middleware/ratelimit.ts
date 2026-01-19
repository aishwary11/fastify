import rateLimit, { errorResponseBuilderContext } from '@fastify/rate-limit';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '../common/constant';

const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 10,
  TIME_WINDOW: '1 minute',
  CACHE_SIZE: 1000,
} as const;

const rateLimitMiddleware = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(rateLimit, {
    max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
    timeWindow: RATE_LIMIT_CONFIG.TIME_WINDOW,
    cache: RATE_LIMIT_CONFIG.CACHE_SIZE,
    errorResponseBuilder: (req: FastifyRequest, { max, after, ttl }: errorResponseBuilderContext) => ({
      statusCode: HTTP_STATUS_CODE.TOO_MANY_REQUESTS,
      error: 'Too Many Requests',
      message: `I only allow ${max} requests per ${after} to this Website. Try again soon.`,
      expiresIn: ttl,
      status: false,
    }),
  });
};

export default rateLimitMiddleware;
