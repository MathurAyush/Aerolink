const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, 'Flight number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    airline: {
      type: String,
      required: [true, 'Airline name is required'],
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Source city is required'],
      trim: true,
      uppercase: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true,
      uppercase: true,
    },
    departureTime: {
      type: Date,
      required: [true, 'Departure time is required'],
    },
    arrivalTime: {
      type: Date,
      required: [true, 'Arrival time is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    seatsAvailable: {
      type: Number,
      required: [true, 'Seats available is required'],
      min: [0, 'Seats cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient searching
flightSchema.index({ source: 1, destination: 1, departureTime: 1 });

module.exports = mongoose.model('Flight', flightSchema);
