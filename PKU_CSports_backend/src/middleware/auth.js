const jwt = require('jsonwebtoken');

// 从请求头解析 Bearer token，附加 user 信息到 req.user
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供凭证' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: '凭证无效或已过期' });
  }
};

// 角色校验：仅允许 roles 列表中的角色访问
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: '无访问权限' });
  }
  next();
};

module.exports = { authMiddleware, allowRoles };

