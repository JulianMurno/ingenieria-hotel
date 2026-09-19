const roomService = require('../services/room.service');

async function createRoom(req, res, next) {
  try {
    const room = await roomService.createRoom(req.body);
    return res.status(201).json(room);
  } catch (err) {
    return next(err);
  }
}

async function listRooms(req, res, next) {
  try {
    const result = await roomService.listRooms(req.query);
    return res.json(result);    
  } catch (err) {
    return next(err);
  }
}

async function updateRoom(req, res, next) {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    return res.json(room);
  } catch (err) {
    return next(err);
  }
}

async function deleteRoom(req, res, next) {
  try {
    await roomService.deleteRoom(req.params.id);
    return res.json({ message: 'Habitación eliminada' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createRoom, listRooms, updateRoom, deleteRoom };
