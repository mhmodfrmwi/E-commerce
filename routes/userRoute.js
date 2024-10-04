const express = require("express");
const usersControllers = require("../controllers/userController");
const verifyTokens = require("../middlewares/verifyTokens");
const route = express.Router();
const validateObjectId = require("../middlewares/validateObjectId");
const { upload } = require("../middlewares/uploadPhoto");
route
  .route("/")
  .get(verifyTokens.verifyTokenAndCheckAdmin, usersControllers.getUsers);
route
  .route("/:userId")
  .get(validateObjectId, usersControllers.getUser)
  .put(
    validateObjectId,
    verifyTokens.verifyTokenAndCheckUser,
    usersControllers.updateUser
  )
  .delete(
    validateObjectId,
    verifyTokens.verifyTokenAndCheckUserOrAdmin,
    usersControllers.deleteUser
  );
route
  .route("/profilePhoto")
  .post(
    verifyTokens.verifyToken,
    upload.single("image"),
    usersControllers.updateUserProfilePhot
  );
module.exports = route;
