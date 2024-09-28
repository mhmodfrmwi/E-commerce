const express = require("express");
const authController = require("../controllers/authController");
const route = express.Router();
route.post("/register", authController.Register);
route.post("/login", authController.Login);
module.exports = route;
