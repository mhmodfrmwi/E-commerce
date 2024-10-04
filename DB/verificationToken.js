const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const VerificationTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationToken = mongoose.model(
  "VerificationToken",
  VerificationTokenSchema
);
module.exports = {
  VerificationToken,
};
