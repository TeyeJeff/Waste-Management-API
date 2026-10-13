const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(503).json({
      success: false,
      message: 'Authentication is not configured on this server',
    });
  }

  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'A valid Bearer token is required',
    });
  }

  try {
    req.auth = jwt.verify(token, secret);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'The Bearer token is invalid or expired',
      });
    }
    next(error);
  }
};

module.exports = authenticate;
