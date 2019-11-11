"use strict";

const path = require("path");
const AutoLoad = require("fastify-autoload");
const mongoose = require("mongoose");
const swagger = require("./src/config/swagger");
const AuthorizationMiddleware = require("./src/middleware/authorization.middleware");

module.exports = function(fastify, opts, next) {
  fastify.register(require("fastify-formbody"));

  fastify.register(require("fastify-cors"), { origin: "*" });

  fastify.register(require("fastify-swagger"), swagger.options);

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "./src/plugins/"),
    options: Object.assign({}, opts)
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "./src/routes/public/"),
    options: Object.assign({ prefix: "v1" }, opts)
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "./src/routes/private/"),
    options: Object.assign(
      {
        prefix: "v1",
        preValidation: AuthorizationMiddleware.verifyAuthorization
      },
      opts
    )
  });

  mongoose
    .connect(process.env.MONGOOSE_DB, {
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

  fastify.ready(err => {
    if (err) throw err;
    fastify.swagger();
  });

  next();
};
