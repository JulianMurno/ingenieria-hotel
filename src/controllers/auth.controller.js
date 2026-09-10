const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { login };
