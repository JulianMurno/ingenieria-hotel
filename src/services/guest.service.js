const guestRepo = require('../repositories/guest.repository');
const { HttpError } = require('../lib/httpError');

async function createGuest(data) {
  const existing = await guestRepo.findByDni(data.dni);
  if (existing) {
    throw new HttpError(409, 'CONFLICT', 'Ya existe un huésped con ese DNI');
  }
  return guestRepo.create(data);
}

async function listGuests({ dni, nombre }) {
  return guestRepo.findMany({ dni, nombre });
}

async function getGuest(id) {
  const guest = await guestRepo.findById(id);
  if (!guest) {
    throw new HttpError(404, 'NOT_FOUND', 'Huésped no encontrado');
  }
  return guest;
}

module.exports = { createGuest, listGuests, getGuest };
