const roomRepo = require('../repositories/room.repository');
const resRepo = require('../repositories/reservation.repository');
const { toDate } = require('../services/business.service');

async function getAvailableRooms({ checkIn, checkOut, type }) {
  const start = toDate(checkIn);
  const end = toDate(checkOut);
  const bookedRoomIds = await resRepo.findBookedRoomIds({ checkIn: start, checkOut: end });
  const rooms = await roomRepo.findMany();

  return rooms.filter((room) => !bookedRoomIds.includes(room.id) && room.estado !== 'MANTENIMIENTO' && (!type || room.tipo === type));
}

module.exports = { getAvailableRooms };
