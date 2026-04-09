const express = require('express');
const { body } = require('express-validator');
const {
  bookFlight,
  getUserBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(auth);

// @route   POST /api/bookings
router.post(
  '/',
  [
    body('flightId')
      .notEmpty()
      .withMessage('Flight ID is required')
      .isMongoId()
      .withMessage('Invalid flight ID'),
    body('seatsBooked')
      .notEmpty()
      .withMessage('Number of seats is required')
      .isInt({ min: 1, max: 10 })
      .withMessage('Seats must be between 1 and 10'),
  ],
  bookFlight
);

// @route   GET /api/bookings/user
router.get('/user', getUserBookings);

// @route   DELETE /api/bookings/:id
router.delete('/:id', cancelBooking);

module.exports = router;
