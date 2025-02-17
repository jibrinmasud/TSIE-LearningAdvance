const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('Role middleware - req.user:', req.user);
    console.log('Allowed roles:', allowedRoles);
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    next();
  };
};

module.exports = authorizeRoles;