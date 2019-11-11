"use strict";

const boom = require("boom");
const createError = require("http-errors");
const UserService = require("../services/user.service");

class UserController {
  async createUser(req) {
    try {
      const data = req.body;
      const requiredParams = ["nome", "email", "senha", "telefones"];

      await req.validateParams(req.body, requiredParams);

      let conditions = { email: data.email };
      const options = { lean: 1 };

      const userAlreadyExists = await UserService.findOneByEmail(
        conditions,
        "_id",
        options
      );

      if (userAlreadyExists) throw createError(409, "E-mail já existente");

      data.token = await req.jwt({ email: data.email });

      const user = await UserService.create(data);
      if (!user) throw createError(400, "Error in user creation!");

      return user;
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async getUser(req) {
    try {
      const userIdentifier = req.params.id;

      const conditions = {};

      const identifierIsEmail = userIdentifier.indexOf("@") !== -1;

      if (!identifierIsEmail) {
        conditions._id = userIdentifier;
      }

      if (identifierIsEmail) {
        conditions.email = userIdentifier;
      }

      const options = {
        lean: 1
      };

      const user = identifierIsEmail
        ? await UserService.findOneByEmail(conditions, "-senha", options)
        : await UserService.findOneById(conditions, "-senha", options);

      if (!user) throw createError(404, "User not found");

      if (req.user.token !== user.token)
        throw createError(401, "Não autorizado");

      const session = await UserService.lessThan30minAgo(user.ultimo_login);
      if (!session) throw createError(401, "Sessão inválida");

      return user;
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async updateUser(req) {
    try {
      const userId = req.params.id;
      const data = req.body;

      const conditions = {
        _id: req.params.id
      };

      const options = {
        lean: 1
      };

      let user = await UserService.findOneById(conditions, "_id", options);
      if (!user) throw createError(404, "User not found");

      if (data.senha) data.senha = await UserService.cryptPassword(data.senha);

      data.data_atualizacao = new Date();

      user = await UserService.findOneAndUpdate(userId, data);
      if (!user) throw createError(400, "Error updating user");

      return user;
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async deleteUser(req) {
    try {
      const userId = req.params.id;
      const removeBy = req.user._id;
      const userWasRemoved = await UserService.delete(userId, removeBy);

      if (!userWasRemoved || userWasRemoved.nModified === 0) {
        throw createError(400, "Could not delete user");
      }

      return userWasRemoved;
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async signinUser(req) {
    const data = req.body;

    const requiredParams = ["email", "senha"];
    await req.validateParams(req.body, requiredParams);

    const conditions = {
      email: data.email
    };

    const options = {
      lean: 1
    };

    let user = await UserService.findOneByEmail(conditions, null, options);
    if (!user) throw createError(401, "Usuário e/ou senha inválidos");

    if (!UserService.validPassword(data.senha, user.senha))
      throw createError(401, "Usuário e/ou senha inválidos");

    const tokenCreated = await req.jwt({ email: user.email });

    const updateUser = {
      ultimo_login: new Date(),
      token: tokenCreated
    };

    user = await UserService.findOneAndUpdate(user._id, updateUser);
    if (!user) throw createError(400, "Error updating user");

    return user;
  }
}

module.exports = new UserController();
