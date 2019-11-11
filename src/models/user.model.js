const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcrypt");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: uuidv1() },
  nome: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  senha: { type: String, required: true },
  telefones: [
    {
      numero: { type: String, required: false },
      ddd: { type: String, required: false }
    }
  ],
  data_criacao: { type: Date, required: true, default: Date.now },
  ultimo_login: { type: Date, default: Date.now },
  data_atualizacao: { type: Date },
  token: { type: String }
});

userSchema.pre("save", async function preSave(next) {
  const user = this;

  if (!user.isModified("senha")) {
    return next();
  }

  const passwordEncrypted = await bcrypt.hashSync(
    user.senha,
    bcrypt.genSaltSync(8),
    null
  );

  if (!passwordEncrypted) throw Error("Password was not encrypted!");

  user.senha = passwordEncrypted;

  return next(null);
});

userSchema.methods.validatePassword = function validatePassword(password) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.senha, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      resolve(isMatch);
    });
  });
};

userSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true
});
module.exports = mongoose.model("User", userSchema);
