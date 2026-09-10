const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { availabilityQuerySchema } = require('../schemas/availability.schema');
const { getAvailableRooms } = require('../controllers/availability.controller');

const router = Router();

router.get('/', requireAuth, validate(availabilityQuerySchema, 'query'), getAvailableRooms);

module.exports = router;
