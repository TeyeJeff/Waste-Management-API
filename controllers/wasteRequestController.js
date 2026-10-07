const WasteRequest = require('../models/WasteRequest');

// @desc    Get all waste requests
// @route   GET /api/wasteRequests
exports.getAllWasteRequests = async (req, res, next) => {
  try {
    const requests = await WasteRequest.find().populate('userId', 'name email phone');
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get waste request by ID
// @route   GET /api/wasteRequests/:id
exports.getWasteRequestById = async (req, res, next) => {
  try {
    const request = await WasteRequest.findById(req.params.id).populate('userId', 'name email phone');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Waste request not found' });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new waste request
// @route   POST /api/wasteRequests
exports.createWasteRequest = async (req, res, next) => {
  try {
    const request = await WasteRequest.create(req.body);
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Update waste request
// @route   PUT /api/wasteRequests/:id
exports.updateWasteRequest = async (req, res, next) => {
  try {
    const request = await WasteRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Waste request not found' });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete waste request
// @route   DELETE /api/wasteRequests/:id
exports.deleteWasteRequest = async (req, res, next) => {
  try {
    const request = await WasteRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Waste request not found' });
    }
    res.status(200).json({ success: true, message: 'Waste request deleted successfully' });
  } catch (error) {
    next(error);
  }
};