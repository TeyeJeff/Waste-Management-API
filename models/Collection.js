const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    wasteRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteRequest",
      required: [true, "Waste request ID is required"],
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Collector ID is required"],
    },
    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
    },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Collection", collectionSchema);
