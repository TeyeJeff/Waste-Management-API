const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['Organic', 'Recyclable', 'Hazardous', 'General', 'Electronic'],
    },
    location: {
      type: String,
      required: [true, 'Pickup location address is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);