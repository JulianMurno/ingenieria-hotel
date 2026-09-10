const availabilityService = require('../services/availability.service');

async function getAvailableRooms(req, res, next) {
  try {
    const rooms = await availabilityService.getAvailableRooms(req.query);
    return res.json(rooms);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAvailableRooms };
