const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: [true, 'Flight ID is required'],
    },
    seatsBooked: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Must book at least 1 seat'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked',
    },
  },
  {
    timestamps: true,
  }
);

// Index for user bookings lookup
bookingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
