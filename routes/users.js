const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
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
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['citizen', 'collector', 'admin']).withMessage('Invalid role'),
    validate,
  ],
  (req, res, next) => {
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
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role').optional().isIn(['citizen', 'collector', 'admin']).withMessage('Invalid role'),
    validate,
  ],
  (req, res, next) => {
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

router.delete('/:id', deleteUser);

module.exports = router;