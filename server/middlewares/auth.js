const { UnauthorizedError } = require("../utils/errors");
const { verifyAccessToken } = require("../utils/token");

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("Unauthorized");
    }

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer") {
      throw new UnauthorizedError("Unauthorized");
    }
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedError("Unauthorized");
    }

    req.user = payload;
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  requireAuth,
};
