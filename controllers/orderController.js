const asyncHandler = require("express-async-handlr");
const {
  Order,
  validateCreateOrder,
  validateUpdateOrderStatus,
} = require("../DB/orderModel");
const { OrderItem } = require("../DB/orderItemModel");
const statusArray = require("../utils/status");

/**------------------------------------------------
 * @desc get all orders
 * @route /api/v1/orders/
 * @method GET
 * @access private
 --------------------------------------------------*/

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}, ["-__v"])
    .populate("user")
    .populate({ path: "orderItems", populate: "product" });
  res.status(200).json({
    status: statusArray.SUCCESS,
    orders,
  });
});

/**------------------------------------------------
 * @desc create new order
 * @route /api/v1/orders/
 * @method POST
 * @access public
 --------------------------------------------------*/

const createOrder = asyncHandler(async (req, res) => {
  const { error } = validateCreateOrder(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusArray.FAIL, message: error.details[0].message });
  }

  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      const newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      return orderItem.product.price * orderItem.quantity;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  const order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice: totalPrice,
    user: req.user.id,
  });

  await order.save();

  res.status(201).json({
    status: statusArray.SUCCESS,
    order,
  });
});

/**------------------------------------------------
 * @desc update order status
 * @route /api/v1/orders/:orderId
 * @method PUT
 * @access public
 --------------------------------------------------*/

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { error } = validateUpdateOrderStatus(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusArray.FAIL, message: error.details[0].message });
  }

  const order = await Order.findById(req.params.orderId, ["-__v"])
    .populate("user")
    .populate({ path: "orderItems", populate: "product" });
  if (!order) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Order not found" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.orderId,
    req.body,
    { new: true }
  );
  res.status(200).json({
    status: statusArray.SUCCESS,
    updatedOrder,
  });
});

/**------------------------------------------------
 * @desc delete order
 * @route /api/v1/orders/:orderId
 * @method DELETE
 * @access public
 --------------------------------------------------*/

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);
  if (!order) {
    return res
      .status(404)
      .json({ status: statusArray.FAIL, message: "Order not found" });
  }
  order.orderItems.map(async (orderItem) => {
    await OrderItem.findByIdAndDelete(orderItem);
  });
  res.status(200).json({
    status: statusArray.SUCCESS,
    message: "Order deleted successfully",
    order,
  });
});

/**------------------------------------------------
 * @desc total sales
 * @route /api/v1/orders/totalSales
 * @method GET
 * @access private
 --------------------------------------------------*/

const totalSales = asyncHandler(async (req, res) => {
  const total = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  res.status(200).json({
    status: statusArray.SUCCESS,
    total,
  });
});
/**------------------------------------------------
 * @desc total sales
 * @route /api/v1/orders/users/:userId
 * @method GET
 * @access private
 --------------------------------------------------*/

const userOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }, ["-__v"])
    .populate("user")
    .populate({ path: "orderItems", populate: "product" });
  res.status(200).json({
    status: statusArray.SUCCESS,
    orders,
  });
});

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  totalSales,
  userOrders,
};
