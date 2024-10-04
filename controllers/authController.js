const asyncHandler = require("express-async-handlr");
const { validateRegister, validateLogin, User } = require("../DB/userModel");
const bcrypt = require("bcrypt");
const statusArray = require("../utils/status");
const { VerificationToken } = require("../DB/verificationToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
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
    phone: req.body.phone,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
  });
  await generatedUser.save();
  const verificationToken = new VerificationToken({
    userId: generatedUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();

  const link = `${process.env.DOMAIN_LINK}/users/${generatedUser._id}/verify/${verificationToken.token}`;
  const htmlTemplate = `
    <div>
    <p>Click on the link below to verify your email</p>
    <a href="${link}">Verify</a>
    </div>
  `;
  await sendEmail(generatedUser.email, "Verify your email", htmlTemplate);
  res.status(200).json({
    message: "We sent you a verefication email, check your inbox",
  });
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
    return res.status(400).json({
      status: statusArray.FAIL,
      message: "Email or Password is not correct",
    });
  }
  //send email verification if not verified

  const token = user.generateAuthToken();

  return res.status(200).json({
    status: statusArray.SUCCESS,
    user: {
      _id: user._id,
      username: user.username,
      profilePhoto: user.profilePhoto,
      token,
      isAdmin: user.isAdmin,
    },
  });
});

const verifyUserAcount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "invalid link user not found" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationToken) {
    return res.status(400).json({ message: "invalid link" });
  }

  user.isVerified = true;
  await user.save();

  await verificationToken.deleteOne();
  res.status(200).json({ message: "Your account has been verfied" });
});
module.exports = {
  Register,
  Login,
  verifyUserAcount,
};
