"use strict";

const UserController = require("../../controllers/user.controller");

module.exports = function(fastify, opts, next) {
  fastify.post("/", opts, UserController.createUser);

  next();
};
module.exports.autoPrefix = "/signup";
