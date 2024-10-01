const { default: mongoose } = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
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
    street: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profilePhoto: {
      url: {
        type: String,
        default: "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      },
      publicId: {
        type: String,
        default: null,
      },
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
    {
      id: this._id,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
};

const validateRegister = (obj) => {
  const schema = Joi.object({
    username: Joi.string().min(8).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: passwordComplexity().required(),
    street: Joi.string().min(3).max(50).required(),
    apartment: Joi.string().min(1).max(50).required(),
    city: Joi.string().min(2).max(50).required(),
    zip: Joi.string().min(2).max(20).required(),
    country: Joi.string().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^[0-9()+\- ]+$/)
      .min(3)
      .max(30)
      .required(),
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

const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().min(8).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: passwordComplexity(),
    street: Joi.string().min(3).max(50),
    apartment: Joi.string().min(1).max(50),
    city: Joi.string().min(2).max(50),
    zip: Joi.string().min(2).max(20),
    country: Joi.string().min(2).max(50),
    phone: Joi.string()
      .pattern(/^[0-9()+\- ]+$/)
      .min(3)
      .max(30),
  });
  return schema.validate(obj);
};

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validateRegister,
  validateLogin,
  validateUpdateUser,
};
