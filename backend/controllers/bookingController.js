const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// @desc    Book a flight
// @route   POST /api/bookings
// @access  Private
exports.bookFlight = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { flightId, seatsBooked } = req.body;

    // Find the flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found.',
      });
    }

    // Check seat availability
    if (flight.seatsAvailable < seatsBooked) {
      return res.status(400).json({
        success: false,
        message: `Only ${flight.seatsAvailable} seats available on this flight.`,
      });
    }

    // Calculate total price
    const totalPrice = flight.price * seatsBooked;

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      flightId,
      seatsBooked,
      totalPrice,
      status: 'booked',
    });

    // Reduce available seats
    flight.seatsAvailable -= seatsBooked;
    await flight.save();

    // Populate flight details in response
    const populatedBooking = await Booking.findById(booking._id).populate(
      'flightId'
    );

    res.status(201).json({
      success: true,
      message: 'Flight booked successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('flightId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Verify the booking belongs to the user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    // Restore seats to the flight
    const flight = await Flight.findById(booking.flightId);
    if (flight) {
      flight.seatsAvailable += booking.seatsBooked;
      await flight.save();
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate(
      'flightId'
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been restored.',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};
