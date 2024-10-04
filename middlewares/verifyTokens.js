const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no auth header provided" });
  }
}

function verifyTokenAndCheckAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "this is only allowed for admins" });
    }
  });
}

function verifyTokenAndCheckUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Only this user can take this action" });
    }
  });
}

function verifyTokenAndCheckUserOrAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Only this user or admin can take this action" });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndCheckAdmin,
  verifyTokenAndCheckUser,
  verifyTokenAndCheckUserOrAdmin,
};
