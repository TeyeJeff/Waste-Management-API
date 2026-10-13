const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticate = require('../auth/authenticate');
const {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Routes
router.get('/', getAllCollections);
router.get('/:id', getCollectionById);

router.post(
  '/',
  [
    authenticate,
    body('wasteRequestId').isMongoId().withMessage('Valid Waste Request Mongo ID is required'),
    body('collectorId').isMongoId().withMessage('Valid Collector Mongo ID is required'),
    body('scheduledDate').isISO8601().toDate().withMessage('Valid scheduled date is required'),
    body('status')
      .optional()
      .isIn(['Scheduled', 'In Progress', 'Completed', 'Cancelled'])
      .withMessage('Invalid status value'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Waste collection entry details',
            required: true,
            schema: {
                wasteRequestId: "650c1f1f1f1f1f1f1f1f1f1f",
                collectorId: "650c1f1f1f1f1f1f1f1f1f1f",
                scheduledDate: "2026-10-15T10:00:00.000Z",
                status: "Scheduled"
            }
        } 
    */
    createCollection(req, res, next);
  }
);

router.put(
  '/:id',
  [
    authenticate,
    body().custom((value, { req }) => {
      const fields = Object.keys(req.body || {});
      const allowedFields = ['wasteRequestId', 'collectorId', 'scheduledDate', 'status', 'notes'];
      return fields.length > 0 && fields.every((field) => allowedFields.includes(field));
    }).withMessage('Provide at least one valid field for update'),
    body('wasteRequestId').optional().isMongoId().withMessage('Valid Waste Request Mongo ID is required'),
    body('collectorId').optional().isMongoId().withMessage('Valid Collector Mongo ID is required'),
    body('scheduledDate').optional().isISO8601().toDate().withMessage('Valid scheduled date is required'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('status')
      .optional()
      .isIn(['Scheduled', 'In Progress', 'Completed', 'Cancelled'])
      .withMessage('Invalid status value'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Waste collection fields to update',
            required: true,
            schema: {
                scheduledDate: "2026-10-16T12:00:00.000Z",
                status: "Completed"
            }
        } 
    */
    updateCollection(req, res, next);
  }
);

router.delete('/:id', authenticate, (req, res, next) => {
  /*  #swagger.security = [{ "bearerAuth": [] }] */
  deleteCollection(req, res, next);
});

module.exports = router;