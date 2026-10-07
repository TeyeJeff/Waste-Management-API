const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Routes
router.get('/', getAllFeedback);
router.get('/:id', getFeedbackById);

router.post(
  '/',
  [
    body('userId').isMongoId().withMessage('Valid User Mongo ID is required'),
    body('collectionId').isMongoId().withMessage('Valid Collection Mongo ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    validate,
  ],
  createFeedback
);

router.put(
  '/:id',
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    validate,
  ],
  updateFeedback
);

router.delete('/:id', deleteFeedback);

module.exports = router;