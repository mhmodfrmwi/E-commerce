const asyncHandler = require("express-async-handlr");
const { validateRegister, validateLogin, User } = require("../DB/userModel");
const bcrypt = require("bcrypt");

/**------------------------------------------------
 * @desc Register new user
 * @route /api/v1/auth/register
 * @method POST
 * @access public
 --------------------------------------------------*/

const Register = asyncHandler(async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User is already exist" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const generatedUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await generatedUser.save();

  //send email verification
  res
    .status(200)
    .json({ message: "We sent you a verefication email, check your inbox" });
});

/**------------------------------------------------
 * @desc Login user
 * @route /api/v1/auth/login
 * @method POST
 * @access public
 --------------------------------------------------*/

const Login = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Email or Password is not correct" });
  }

  const comparedPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!comparedPassword) {
    return res
      .status(400)
      .json({ message: "Email or Password is not correct" });
  }
  //send email verification if not verified

  const token = user.generateAuthToken();

  return res.status(200).json({
    _id: user._id,
    username: user.username,
    profilePhoto: user.profilePhoto,
    token,
    isAdmin: user.isAdmin,
  });
});
module.exports = {
  Register,
  Login,
};
