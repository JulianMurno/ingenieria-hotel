const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRepo = require('../repositories/user.repository');
const { HttpError } = require('../lib/httpError');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

async function login(username, password) {
  const user = await userRepo.findByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Credenciales inválidas');
  }

  const token = jwt.sign({ sub: user.id, username: user.username, rol: user.rol }, JWT_SECRET, {
    expiresIn: '8h',
  });

  return {
    token,
    user: { id: user.id, username: user.username, rol: user.rol },
  };
}

module.exports = { login };
