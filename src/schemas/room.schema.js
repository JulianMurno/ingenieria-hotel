const { z } = require('zod');

const roomTypes = ['SINGLE', 'DOBLE', 'SUITE'];

const roomCreateSchema = z.object({
  numero: z.string().min(1, 'El número es obligatorio'),
  tipo: z.enum(roomTypes, { message: 'Tipo de habitación inválido' }),
  tarifa: z.number().int().positive('La tarifa debe ser un entero positivo'),
  estado: z.enum(['DISPONIBLE', 'MANTENIMIENTO'], {message: 'Estado inválido' }).optional().default('DISPONIBLE'),
  capacidad: z.number().int().min(1, 'La capacidad debe ser al menos 1').optional().default(1),
  descripcion: z.string().optional(),
  comodidades: z.string().optional(),
  fotos: z.string().optional(),
});

const roomUpdateSchema = roomCreateSchema.partial();

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('Id inválido'),
});

module.exports = { roomCreateSchema, roomUpdateSchema, idParamSchema, roomTypes };
