const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const secret_key = "thisismysecretkeyforfinanceappok";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  contact_number: { type: Number, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is is not valid.");
      }
    },
  },
  password: { type: String, required: true, minlength: 6 },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthtoken = async function () {
  try {
    let generatedToken = jwt.sign({ _id: this._id }, secret_key, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: generatedToken });
    await this.save();
    return generatedToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

const userdb = new mongoose.model("users", userSchema);

module.exports = userdb;