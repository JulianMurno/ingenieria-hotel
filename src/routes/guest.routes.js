const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { guestCreateSchema, guestQuerySchema } = require('../schemas/guest.schema');
const { idParamSchema } = require('../schemas/room.schema');
const { createGuest, listGuests, getGuest } = require('../controllers/guest.controller');

const router = Router();

router.use(requireAuth);

router.post('/', validate(guestCreateSchema), createGuest);
router.get('/', validate(guestQuerySchema, 'query'), listGuests);
router.get('/:id', validate(idParamSchema, 'params'), getGuest);

module.exports = router;
