const UserRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const moment = require("moment");

class UserService {
  async find(conditions, projection, options) {
    return UserRepository.find(conditions, projection, options);
  }

  async findOne(conditions, projection, options) {
    return UserRepository.findOne(conditions, projection, options);
  }

  async findOneByEmail(conditions, projection, options) {
    return UserRepository.findOne(conditions, projection, options);
  }

  async findOneById(conditions, projection, options) {
    return UserRepository.findOne(conditions, projection, options);
  }

  async create(user) {
    user = await UserRepository.create(user);
    return user;
  }

  async update(user) {
    return UserRepository.update({ _id: user._id }, user);
  }

  async findOneAndUpdate(userId, data) {
    return UserRepository.findOneAndUpdate({ _id: userId }, data, {
      new: true
    });
  }

  async delete(userDeactivateId, userId) {
    return UserRepository.delete(userDeactivateId, userId);
  }

  async findOneByToken(data, fields) {
    return UserRepository.findOne(data, fields);
  }

  async lessThan30minAgo(date) {
    return moment(date).isAfter(moment().subtract(30, "minutes"));
  }

  async cryptPassword(password) {
    const passwordEncrypted = await bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(8),
      null
    );

    return passwordEncrypted;
  }

  validPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

module.exports = new UserService();
