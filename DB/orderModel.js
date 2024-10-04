const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    shippingAddress1: {
      type: String,
      required: true,
    },
    shippingAddress2: {
      type: String,
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
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const validateCreateOrder = (obj) => {
  const schema = Joi.object({
    orderItems: Joi.array().items(Joi.object().required()).required(),
    shippingAddress1: Joi.string().min(5).max(100).required(),
    shippingAddress2: Joi.string().min(5).max(100).allow(""),
    city: Joi.string().min(2).max(50).required(),
    zip: Joi.string().min(2).max(20).required(),
    country: Joi.string().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^[0-9\-\+\s\(\)]{7,20}$/)
      .required(),
    status: Joi.string().valid(
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ),
    totalPrice: Joi.number().min(0),
  });
  return schema.validate(obj);
};
const validateUpdateOrderStatus = (obj) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("Pending", "Processing", "Shipped", "Delivered", "Cancelled")
      .required(),
  });
  return schema.validate(obj);
};
const Order = mongoose.model("Order", orderSchema);
module.exports = {
  Order,
  validateCreateOrder,
  validateUpdateOrderStatus,
};
