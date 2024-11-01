import { HTTP_STATUS_CODE } from '@/common/constant';
import rateLimit, { errorResponseBuilderContext } from '@fastify/rate-limit';
import { FastifyInstance, FastifyRequest } from 'fastify';

const rateLimitMiddleware = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(rateLimit, {
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
  });
};

export default rateLimitMiddleware;
