const jwt = require('jsonwebtoken');
const { HttpError } = require('../lib/httpError');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Token requerido'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, username: payload.username, rol: payload.rol };
  } catch {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Token inválido o vencido'));
  }

  return next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return next(new HttpError(403, 'FORBIDDEN', 'No autorizado para esta operación'));
    }
    return next();
  };
}

module.exports = { requireAuth, authorize, JWT_SECRET };
