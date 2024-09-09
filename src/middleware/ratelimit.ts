import { HTTP_STATUS_CODE } from '@/common/constant';
import rateLimit, { errorResponseBuilderContext, FastifyRateLimitOptions } from '@fastify/rate-limit';
import { FastifyInstance, FastifyRequest } from 'fastify';

const rateLimitMiddleware = async (fastify: FastifyInstance): Promise<void> => {
  const options: FastifyRateLimitOptions = {
    max: 10,
    timeWindow: '1 minute',
    cache: 1000,
    errorResponseBuilder: (req: FastifyRequest, { max, after, ttl }: errorResponseBuilderContext) => ({
      statusCode: HTTP_STATUS_CODE.TOO_MANY_REQUESTS,
      error: 'Too Many Requests',
      message: `I only allow ${max} requests per ${after} to this Website. Try again soon.`,
      expiresIn: ttl,
      status: false,
    }),
  };
  await fastify.register(rateLimit, options);
};

export default rateLimitMiddleware;
