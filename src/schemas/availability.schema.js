const { z } = require('zod');
const { roomTypes } = require('./room.schema');

const availabilityQuerySchema = z
  .object({
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
    type: z.enum(roomTypes, { message: 'Tipo de habitación inválido' }).optional(),
  })
  .refine((d) => d.checkIn < d.checkOut, {
    message: 'checkIn debe ser anterior a checkOut',
    path: ['checkOut'],
  });

module.exports = { availabilityQuerySchema };
