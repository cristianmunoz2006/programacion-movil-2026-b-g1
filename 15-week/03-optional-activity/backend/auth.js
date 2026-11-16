const jwt = require('jsonwebtoken');

// En un proyecto real el secreto va en una variable de entorno (JWT_SECRET).
const SECRETO = process.env.JWT_SECRET || 'secreto-solo-para-pruebas';

// Usuario de prueba fijo (suficiente para esta actividad)
const USUARIO_PRUEBA = { correo: 'viajero@huella.com', clave: '1234' };

// POST /login: si las credenciales son correctas, entrega un token que dura 1 hora
function login(req, res) {
  const { correo, clave } = req.body || {};

  if (correo !== USUARIO_PRUEBA.correo || clave !== USUARIO_PRUEBA.clave) {
    return res.status(401).json({ error: 'Correo o clave incorrectos' });
  }

  const token = jwt.sign({ correo }, SECRETO, { expiresIn: '1h' });
  res.json({ token });
}

// Middleware: deja pasar solo las peticiones con "Authorization: Bearer <token>" valido
function exigirToken(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const [tipo, token] = cabecera.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Falta iniciar sesión' });
  }

  try {
    req.usuario = jwt.verify(token, SECRETO);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o vencida' });
  }
}

module.exports = { login, exigirToken };
