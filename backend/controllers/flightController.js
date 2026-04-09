const { validationResult } = require('express-validator');
const Flight = require('../models/Flight');

// @desc    Search flights by source, destination, and optional date
// @route   GET /api/flights
// @access  Public
exports.searchFlights = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;

    // Build query
    const query = {};

    if (source) {
      query.source = source.toUpperCase();
    }

    if (destination) {
      query.destination = destination.toUpperCase();
    }

    if (date) {
      // Match flights on the given date (start of day to end of day)
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.departureTime = {
        $gte: searchDate,
        $lt: nextDay,
      };
    }

    // Only show flights with available seats
    query.seatsAvailable = { $gt: 0 };

    const flights = await Flight.find(query).sort({ departureTime: 1 });

    res.json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all flights (no filters)
// @route   GET /api/flights/all
// @access  Public
exports.getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find().sort({ departureTime: 1 });
    res.json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single flight by ID
// @route   GET /api/flights/:id
// @access  Public
exports.getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found.',
      });
    }
    res.json({
      success: true,
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new flight (admin)
// @route   POST /api/flights
// @access  Private
exports.addFlight = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const flight = await Flight.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Flight added successfully!',
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};
