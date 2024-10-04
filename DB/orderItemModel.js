const { default: mongoose } = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = {
  OrderItem,
};
