import rateLimit from "@fastify/rate-limit";

const rateLimitMiddleware = async (fastify) => {
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
};
export default rateLimitMiddleware;