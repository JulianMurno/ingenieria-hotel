const roomRepo = require('../repositories/room.repository');
const { HttpError } = require('../lib/httpError');

async function createRoom(data) {
  const existing = await roomRepo.findByNumero(data.numero);
  if (existing) {
    throw new HttpError(409, 'CONFLICT', 'Ya existe una habitación con ese número');
  }
  return roomRepo.create(data);
}

async function listRooms() {
  return roomRepo.findMany();
}

async function getRoom(id) {
  const room = await roomRepo.findById(id);
  if (!room) {
    throw new HttpError(404, 'NOT_FOUND', 'Habitación no encontrada');
  }
  return room;
}

async function updateRoom(id, data) {
  if (!(await roomRepo.findById(id))) {
    throw new HttpError(404, 'NOT_FOUND', 'Habitación no encontrada');
  }
  if (data.numero) {
    const existing = await roomRepo.findByNumero(data.numero);
    if (existing && existing.id !== id) {
      throw new HttpError(409, 'CONFLICT', 'Ya existe una habitación con ese número');
    }
  }
  return roomRepo.update(id, data);
}

async function deleteRoom(id) {
  if (!(await roomRepo.findById(id))) {
    throw new HttpError(404, 'NOT_FOUND', 'Habitación no encontrada');
  }
  try {
    await roomRepo.remove(id);
  } catch (err) {
    if (err.code === 'P2003') {
      throw new HttpError(
        409,
        'CONFLICT',
        'La habitación tiene reservas asociadas y no puede eliminarse',
      );
    }
    throw err;
  }
}

module.exports = { createRoom, listRooms, getRoom, updateRoom, deleteRoom };
