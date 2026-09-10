const { z } = require('zod');

const guestCreateSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El email no es válido'),
  dni: z.string().min(1, 'El DNI es obligatorio'),
  telefono: z.string().optional(),
});

const guestQuerySchema = z.object({
  dni: z.string().optional(),
  nombre: z.string().optional(),
});

module.exports = { guestCreateSchema, guestQuerySchema };
