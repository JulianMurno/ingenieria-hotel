const { ZodError } = require('zod');
const { HttpError } = require('../lib/httpError');

function notFound(req, res, next) {
  next(new HttpError(404, 'NOT_FOUND', 'Recurso no encontrado'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({ path: e.path.join('.'), message: e.message }));
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details },
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'CONFLICT', message: 'Recurso duplicado', details: [] },
    });
  }

  if (err.code === 'P2003') {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'La operación fue rechazada por una violación de integridad',
        details: [],
      },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno del servidor', details: [] },
  });
}

module.exports = { notFound, errorHandler };
