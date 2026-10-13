const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticate = require('../auth/authenticate');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.post(
  '/',
  [
    authenticate,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['citizen', 'collector', 'admin']).withMessage('Invalid role'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'User registration details',
            required: true,
            schema: {
                name: "Jeff Teye",
                email: "jeff@example.com",
                password: "password123",
                role: "citizen",
                phone: "0240000000"
            }
        } 
    */
    createUser(req, res, next);
  }
);

router.put(
  '/:id',
  [
    authenticate,
    body().custom((value, { req }) => Object.keys(req.body || {}).length > 0)
      .withMessage('At least one field must be provided for update'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role').optional().isIn(['citizen', 'collector', 'admin']).withMessage('Invalid role'),
    validate,
  ],
  (req, res, next) => {
    /*  #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'User fields to update',
            required: true,
            schema: {
                name: "Jeff Teye Updated",
                email: "jeff.updated@example.com",
                role: "citizen",
                phone: "0249999999"
            }
        } 
    */
    updateUser(req, res, next);
  }
);

router.delete('/:id', authenticate, (req, res, next) => {
  /*  #swagger.security = [{ "bearerAuth": [] }] */
  deleteUser(req, res, next);
});

module.exports = router;