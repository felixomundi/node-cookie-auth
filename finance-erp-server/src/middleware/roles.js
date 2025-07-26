export function requireRole(roles = []) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
}