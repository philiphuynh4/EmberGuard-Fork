const mongoose = require('mongoose');

const HousingRequestSchema = new mongoose.Schema({
  adults: Number,
  children: Number,
  infants: Number,
  pets: Number,
  accessibilityNeeds: String,
  stayLength: String,
  stayStartDate: String, // could be a Date too
  sameEmail: Boolean,
  extraNotes: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HousingRequest', HousingRequestSchema);