const asyncHandler = require("express-async-handlr");
const { User, validateUpdateUser } = require("../DB/userModel");
const bcrypt = require("bcrypt");
const path = require("path");
const { uploadToCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
/**------------------------------------------------
 * @desc get all users
 * @route /api/v1/users/
 * @method GET
 * @access private
 --------------------------------------------------*/

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, ["-password", "-__v"]);
  res.status(200).json(users);
});

/**------------------------------------------------
 * @desc get user
 * @route /api/v1/users/:userId
 * @method GET
 * @access private
 --------------------------------------------------*/

const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId, ["-password", "-__v"]);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

/**------------------------------------------------
 * @desc update user
 * @route /api/v1/users/:userId
 * @method PUT
 * @access private
 --------------------------------------------------*/

const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.body,
      },
    },
    { new: true }
  );
  res.status(200).json(updatedUser);
});

/**------------------------------------------------
 * @desc update user profile photo using cloudinary platform
 * @route /api/v1/users/profilePhoto
 * @method POST
 * @access private
 --------------------------------------------------*/

const updateUserProfilePhot = asyncHandler(async (req, res) => {
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const photo = await uploadToCloudinary(imagePath);

  const user = await User.findById(req.user.id);
  if (user.profilePhoto.publicId) {
    await removeFromCloudinary(user.profilePhoto.publicId);
  }
  user.profilePhoto.url = photo.url;
  user.profilePhoto.publicId = photo.public_id;
  await user.save();
  fs.unlinkSync(imagePath);
  res.status(200).json({ message: "your profile photo uploaded successfully" });
});

/**------------------------------------------------
 * @desc delete user profile photo
 * @route /api/v1/users/:userId
 * @method DELETE
 * @access private
 --------------------------------------------------*/

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  return res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserProfilePhot,
};
