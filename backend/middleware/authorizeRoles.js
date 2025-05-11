function authorizeRoles(...roles) {
    return (req, res, next) => {
      console.log('REQ.USER:', req.user); // 👈 log here
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  }
  
  module.exports = authorizeRoles;  