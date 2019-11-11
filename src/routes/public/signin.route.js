"use strict";

const UserController = require("../../controllers/user.controller");

module.exports = function(fastify, opts, next) {
  fastify.post("/", opts, UserController.signinUser);

  next();
};
module.exports.autoPrefix = "/signin";
