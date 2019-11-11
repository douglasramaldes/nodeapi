const User = require("../models/user.model");

class UserRepository {
  async find(conditions, projection, options) {
    return User.find(conditions, projection, options);
  }
  async findOne(conditions, projection, options) {
    return User.findOne(conditions, projection, options);
  }

  async create(user) {
    return User.create(user);
  }

  async update(conditions, data, options) {
    return User.update(conditions, data, options);
  }

  async findOneAndUpdate(conditions, data, options) {
    return User.findOneAndUpdate(conditions, data, options);
  }

  async delete(userId) {
    return User.deleteById(userId);
  }
}

module.exports = new UserRepository();
