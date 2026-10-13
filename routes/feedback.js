const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticate = require('../auth/authenticate');
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
    authenticate,
    body('userId').isMongoId().withMessage('Valid User Mongo ID is required'),
    body('collectionId').isMongoId().withMessage('Valid Collection Mongo ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Feedback entry details',
            required: true,
            schema: {
                userId: "650c1f1f1f1f1f1f1f1f1f1f",
                collectionId: "650c1f1f1f1f1f1f1f1f1f1f",
                rating: 5,
                comment: "Great service and timely pickup!"
            }
        } 
    */
    createFeedback(req, res, next);
  }
);

router.put(
  '/:id',
  [
    authenticate,
    body().custom((value, { req }) => {
      const fields = Object.keys(req.body || {});
      const allowedFields = ['userId', 'collectionId', 'rating', 'comment'];
      return fields.length > 0 && fields.every((field) => allowedFields.includes(field));
    }).withMessage('Provide at least one valid field for update'),
    body('userId').optional().isMongoId().withMessage('Valid User Mongo ID is required'),
    body('collectionId').optional().isMongoId().withMessage('Valid Collection Mongo ID is required'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Feedback fields to update',
            required: true,
            schema: {
                rating: 4,
                comment: "Updated feedback comment"
            }
        } 
    */
    updateFeedback(req, res, next);
  }
);

router.delete('/:id', authenticate, (req, res, next) => {
  /*  #swagger.security = [{ "bearerAuth": [] }] */
  deleteFeedback(req, res, next);
});

module.exports = router;