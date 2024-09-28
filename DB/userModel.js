const { default: mongoose } = require("mongoose");
const Joi = require("joi");
const passwordComplixity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        publicId: null,
      },
    },
    token: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, token: this.token },
    process.env.JWT_SECRET_KEY
  );
};
const validateRegister = (obj) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: passwordComplixity().required(),
  });
  return schema.validate(obj);
};
const validateLogin = (obj) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required(),
  });
  return schema.validate(obj);
};
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validateRegister,
  validateLogin,
};
