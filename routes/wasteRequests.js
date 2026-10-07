const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getAllWasteRequests,
  getWasteRequestById,
  createWasteRequest,
  updateWasteRequest,
  deleteWasteRequest,
} = require('../controllers/wasteRequestController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.get('/', getAllWasteRequests);
router.get('/:id', getWasteRequestById);

router.post(
  '/',
  [
    body('userId').isMongoId().withMessage('Valid User Mongo ID is required'),
    body('wasteType')
      .isIn(['Organic', 'Recyclable', 'Hazardous', 'General', 'Electronic'])
      .withMessage('Invalid waste type'),
    body('location').notEmpty().withMessage('Pickup location is required'),
    body('status')
      .optional()
      .isIn(['Pending', 'Assigned', 'Completed', 'Cancelled'])
      .withMessage('Invalid status value'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Waste collection request details',
            required: true,
            schema: {
                userId: "650c1f1f1f1f1f1f1f1f1f1f",
                wasteType: "Recyclable",
                location: "Accra, Ghana",
                status: "Pending",
                notes: "Plastic bottles ready for collection"
            }
        } 
    */
    createWasteRequest(req, res, next);
  }
);

router.put(
  '/:id',
  [
    body('wasteType')
      .optional()
      .isIn(['Organic', 'Recyclable', 'Hazardous', 'General', 'Electronic'])
      .withMessage('Invalid waste type'),
    body('status')
      .optional()
      .isIn(['Pending', 'Assigned', 'Completed', 'Cancelled'])
      .withMessage('Invalid status value'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Waste request fields to update',
            required: true,
            schema: {
                wasteType: "Recyclable",
                status: "Assigned",
                notes: "Updated pickup instructions"
            }
        } 
    */
    updateWasteRequest(req, res, next);
  }
);

router.delete('/:id', deleteWasteRequest);

module.exports = router;