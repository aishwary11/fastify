const jwtAuth = async (request, reply) => {
  if (request.url !== "/login" || request.url !== "/register") {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ msg: "Token is invalid" });
    }
  }
};
export default jwtAuth;