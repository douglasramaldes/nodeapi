const boom = require("boom");
const createError = require("http-errors");
const User = require("../models/user.model");

class AuthorizationMiddleware {
  async verifyAuthorization(request) {
    try {
      const auth = request.headers.authorization;
      if (!auth) throw createError(401, "Não autorizado");

      const token = auth.split(" ")[1];
      const access = await request.authenticate(token);

      if (!access) throw createError(401, "Token not valid!");

      const conditions = {
        email: access.email
      };
      const options = { lean: true };
      const user = await User.findOne(conditions, "", options);

      if (!user) throw createError(404, "User not found!");

      return (request.user = user);
    } catch (err) {
      throw boom.boomify(err);
    }
  }
}

module.exports = new AuthorizationMiddleware();
