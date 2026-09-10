const {
  calculateNights,
  calculateTotal,
  overlaps,
} = require('../../src/services/business.service');

describe('calculateNights', () => {
  test('calcula las noches entre dos fechas', () => {
    expect(calculateNights('2026-09-08', '2026-09-11')).toBe(3);
  });

  test('lanza error si checkIn es posterior a checkOut', () => {
    expect(() => calculateNights('2026-09-11', '2026-09-08')).toThrow(/rango/i);
  });

  test('lanza error con rango de cero noches', () => {
    expect(() => calculateNights('2026-09-08', '2026-09-08')).toThrow(/rango/i);
  });
});

describe('calculateTotal', () => {
  test('multiplica noches por la tarifa por noche', () => {
    expect(calculateTotal(3, 10000)).toBe(30000);
  });
});

describe('overlaps', () => {
  test('detecta solapamiento de rangos', () => {
    expect(overlaps('2026-09-08', '2026-09-11', '2026-09-10', '2026-09-12')).toBe(true);
    expect(overlaps('2026-09-10', '2026-09-12', '2026-09-08', '2026-09-11')).toBe(true);
  });

  test('recambio el mismo día no se considera solapamiento', () => {
    expect(overlaps('2026-09-08', '2026-09-10', '2026-09-10', '2026-09-12')).toBe(false);
  });

  test('rangos disjuntos no se solapan', () => {
    expect(overlaps('2026-09-08', '2026-09-10', '2026-09-11', '2026-09-12')).toBe(false);
  });
});
