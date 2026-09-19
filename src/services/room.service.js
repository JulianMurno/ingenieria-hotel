const roomRepo = require('../repositories/room.repository');
const { HttpError } = require('../lib/httpError');
const resRepo = require('../repositories/reservation.repository');
const { toDate } = require('./business.service');

async function createRoom(data) {
  const existing = await roomRepo.findByNumero(data.numero);
  if (existing) {
    throw new HttpError(409, 'CONFLICT', 'Ya existe una habitación con ese número');
  }
  return roomRepo.create(data);
}

async function listRooms(query = {}) {
  const { tipo, disponible, tarifaMin, tarifaMax, checkIn, checkOut, page = 1, limit = 10 } = query;

  const where = {};
  if (tipo) where.tipo = tipo;
  if (tarifaMin || tarifaMax) {
    where.tarifa = {};
    if (tarifaMin) where.tarifa.gte = Number(tarifaMin);
    if (tarifaMax) where.tarifa.lte = Number(tarifaMax);
  }

  let excludedIds = [];
  if (disponible === 'true' || disponible === true) {
    where.estado = 'DISPONIBLE';
    if (checkIn && checkOut) {
      const bookedRoomIds = await resRepo.findBookedRoomIds({
        checkIn: toDate(checkIn),
        checkOut: toDate(checkOut),
      });
      excludedIds = bookedRoomIds;
    }
  }
  if (excludedIds.length > 0) where.id = { notIn: excludedIds };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    roomRepo.findMany({ where, skip, take: limitNum }),
    roomRepo.count(where),
  ]);

  return {
    data,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  };
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
