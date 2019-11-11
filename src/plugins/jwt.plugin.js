const fp = require("fastify-plugin");
const fastifyJwt = require("fastify-jwt");
const createError = require("http-errors");

module.exports = fp(async function(fastify, opts) {
  fastify.register(fastifyJwt, { secret: "superSecretJwt" });

  fastify.decorateRequest("jwt", body => {
    try {
      const token = fastify.jwt.sign(body);
      return token;
    } catch (err) {
      throw err;
    }
  });

  fastify.decorateRequest("authenticate", token => {
    try {
      return fastify.jwt.verify(token);
    } catch (err) {
      throw createError(401, "Token not valid!");
    }
  });
});
