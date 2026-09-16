const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'instituto_estudiantil_secret_token_2026_super_seguro_key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      code: 'TOKEN_MISSING',
      message: 'Acceso denegado: Token de autenticación no suministrado'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      code: 'TOKEN_INVALID_OR_EXPIRED',
      message: 'Token de acceso inválido o expirado'
    });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'No se encontraron permisos de rol en la sesión'
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        status: 'error',
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `Acceso restringido: Se requiere rol [${allowedRoles.join(', ')}]. Tu rol actual es: ${req.user.rol}`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
  JWT_SECRET
};
