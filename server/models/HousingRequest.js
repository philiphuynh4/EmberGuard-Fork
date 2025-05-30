const mongoose = require('mongoose');

const HousingRequestSchema = new mongoose.Schema({
  adults: Number,
  children: Number,
  infants: Number,
  pets: Number,
  accessibilityNeeds: String,
  durationType: String,
  stayDuration: String,
  selectedMonth: String,
  selectedDates: [String],
  dateFlexibility: String,
  preferredLocations: String,
  housingType: [String],
  sameEmail: String,
  additionalInfo: String,
}, { timestamps: true });

module.exports = mongoose.model('HousingRequest', HousingRequestSchema);
