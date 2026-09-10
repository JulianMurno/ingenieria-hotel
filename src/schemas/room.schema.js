const { z } = require('zod');

const roomTypes = ['SINGLE', 'DOBLE', 'SUITE'];

const roomCreateSchema = z.object({
  numero: z.string().min(1, 'El número es obligatorio'),
  tipo: z.enum(roomTypes, { message: 'Tipo de habitación inválido' }),
  tarifa: z.number().int().positive('La tarifa debe ser un entero positivo'),
});

const roomUpdateSchema = roomCreateSchema.partial();

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('Id inválido'),
});

module.exports = { roomCreateSchema, roomUpdateSchema, idParamSchema, roomTypes };
