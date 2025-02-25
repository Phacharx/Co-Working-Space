const express = require('express');
const { getSpaces, getSpace, createSpace, updateSpace, deleteSpace } = require('../controllers/spaces');

const reservationRouter = require('./reservations');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use('/:spaceId/reservations', reservationRouter);

router.route('/')
    .get(getSpaces)
    .post(protect, authorize("admin"), createSpace);
router.route('/:id')
    .get(getSpace)
    .put(protect, authorize("admin"), updateSpace)
    .delete(protect, authorize("admin"), deleteSpace);
module.exports = router;