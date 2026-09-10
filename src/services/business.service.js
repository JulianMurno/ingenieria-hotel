const { HttpError } = require('../lib/httpError');

function toDate(value) {
  if (value instanceof Date) return value;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(422, 'VALIDATION_ERROR', 'Fecha inválida');
  }
  return date;
}

function calculateNights(checkIn, checkOut) {
  const start = toDate(checkIn);
  const end = toDate(checkOut);
  const nights = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  if (!Number.isInteger(nights) || nights < 1) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      'El rango de fechas es inválido (checkIn debe ser anterior a checkOut)',
    );
  }
  return nights;
}

function calculateTotal(nights, nightlyRate) {
  return nights * nightlyRate;
}

function overlaps(aCheckIn, aCheckOut, bCheckIn, bCheckOut) {
  const aStart = toDate(aCheckIn).getTime();
  const aEnd = toDate(aCheckOut).getTime();
  const bStart = toDate(bCheckIn).getTime();
  const bEnd = toDate(bCheckOut).getTime();
  return aStart < bEnd && bStart < aEnd;
}

module.exports = { calculateNights, calculateTotal, overlaps, toDate };
