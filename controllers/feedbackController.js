const Feedback = require('../models/Feedback');

// @desc    Get all feedback entries
// @route   GET /api/feedback
exports.getAllFeedback = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find();
    res.status(200).json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
exports.getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback entry not found' });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
exports.updateFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback entry not found' });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback entry
// @route   DELETE /api/feedback/:id
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback entry not found' });
    }
    res.status(200).json({ success: true, message: 'Feedback entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};