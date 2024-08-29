const jwtAuth = async (request, reply) => {
  if (request.url !== "/login") {
    try {
      await request.jwtVerify();
    } catch (err) {
      fastify.log.error(err);
      reply.send(err);
    }
  }
};
export default jwtAuth