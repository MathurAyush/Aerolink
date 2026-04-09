const express = require('express');
const { body } = require('express-validator');
const {
  searchFlights,
  getAllFlights,
  getFlightById,
  addFlight,
} = require('../controllers/flightController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/flights
router.get('/', searchFlights);

// @route   GET /api/flights/all
router.get('/all', getAllFlights);

// @route   GET /api/flights/:id
router.get('/:id', getFlightById);

// @route   POST /api/flights
router.post(
  '/',
  auth,
  [
    body('flightNumber')
      .trim()
      .notEmpty()
      .withMessage('Flight number is required'),
    body('airline').trim().notEmpty().withMessage('Airline is required'),
    body('source').trim().notEmpty().withMessage('Source is required'),
    body('destination')
      .trim()
      .notEmpty()
      .withMessage('Destination is required'),
    body('departureTime')
      .notEmpty()
      .withMessage('Departure time is required')
      .isISO8601()
      .withMessage('Invalid departure time format'),
    body('arrivalTime')
      .notEmpty()
      .withMessage('Arrival time is required')
      .isISO8601()
      .withMessage('Invalid arrival time format'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('seatsAvailable')
      .notEmpty()
      .withMessage('Seats available is required')
      .isInt({ min: 0 })
      .withMessage('Seats must be a non-negative integer'),
  ],
  addFlight
);

module.exports = router;
