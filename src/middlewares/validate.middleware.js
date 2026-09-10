const { HttpError } = require('../lib/httpError');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source] ?? {});
    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return next(new HttpError(422, 'VALIDATION_ERROR', 'Datos inválidos', details));
    }
    req[source] = parsed.data;
    return next();
  };
}

module.exports = { validate };
