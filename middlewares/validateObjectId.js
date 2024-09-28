const { default: mongoose } = require("mongoose");

module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "invalid object id" });
  }
  next();
};
