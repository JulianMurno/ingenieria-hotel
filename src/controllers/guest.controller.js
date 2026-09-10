const guestService = require('../services/guest.service');

async function createGuest(req, res, next) {
  try {
    const guest = await guestService.createGuest(req.body);
    return res.status(201).json(guest);
  } catch (err) {
    return next(err);
  }
}

async function listGuests(req, res, next) {
  try {
    const guests = await guestService.listGuests(req.query);
    return res.json(guests);
  } catch (err) {
    return next(err);
  }
}

async function getGuest(req, res, next) {
  try {
    const guest = await guestService.getGuest(req.params.id);
    return res.json(guest);
  } catch (err) {
    return next(err);
  }
}

module.exports = { createGuest, listGuests, getGuest };
