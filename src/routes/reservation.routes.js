const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  reservationCreateSchema,
  reservationUpdateSchema,
  reservationQuerySchema,
} = require('../schemas/reservation.schema');
const { idParamSchema } = require('../schemas/room.schema');
const {
  createReservation,
  listReservations,
  getReservation,
  updateReservation,
  cancelReservation,
} = require('../controllers/reservation.controller');

const router = Router();

router.use(requireAuth);

router.post('/', validate(reservationCreateSchema), createReservation);
router.get('/', validate(reservationQuerySchema, 'query'), listReservations);
router.get('/:id', validate(idParamSchema, 'params'), getReservation);
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(reservationUpdateSchema),
  updateReservation,
);
router.post('/:id/cancel', validate(idParamSchema, 'params'), cancelReservation);

module.exports = router;
