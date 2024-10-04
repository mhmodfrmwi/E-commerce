const express = require("express");
const route = express.Router();
const {
  verifyToken,
  verifyTokenAndCheckAdmin,
  verifyTokenAndCheckUserOrAdmin,
} = require("../middlewares/verifyTokens");
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  totalSales,
  userOrders,
} = require("../controllers/orderController");
route
  .route("/")
  .post(verifyToken, createOrder)
  .get(verifyTokenAndCheckAdmin, getOrders);
route
  .route("/:orderId")
  .put(verifyTokenAndCheckUserOrAdmin, updateOrderStatus)
  .delete(verifyTokenAndCheckUserOrAdmin, deleteOrder);

route.get("/totalSales", verifyTokenAndCheckAdmin, totalSales);
route.get("/users/:userId", verifyTokenAndCheckAdmin, userOrders);
module.exports = route;
