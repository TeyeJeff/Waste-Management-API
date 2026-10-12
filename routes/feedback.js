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
  (req, res, next) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Feedback entry details',
            required: true,
            schema: {
                userId: "650c1f1f1f1f1f1f1f1f1f1f",
                collectionId: "650c1f1f1f1f1f1f1f1f1f1f",
                rating: 5,
                comments: "Great service and timely pickup!"
            }
        } 
    */
    createFeedback(req, res, next);
  }
);

router.put(
  '/:id',
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Feedback fields to update',
            required: true,
            schema: {
                rating: 4,
                comments: "Updated feedback comments"
            }
        } 
    */
    updateFeedback(req, res, next);
  }
);

router.delete('/:id', deleteFeedback);

module.exports = router;