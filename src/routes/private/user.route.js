"use strict";

const UserController = require("../../controllers/user.controller");

module.exports = function(fastify, opts, next) {
  fastify.post("/", opts, UserController.createUser);

  fastify.get("/:id", opts, UserController.getUser);

  fastify.put("/:id", opts, UserController.updateUser);

  fastify.delete("/:id", opts, UserController.deleteUser);

  next();
};
module.exports.autoPrefix = "/users";
