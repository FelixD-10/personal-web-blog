const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const xss = require('xss');

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Validation Error Handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// XSS Sanitizer
const sanitizeXSS = (req, res, next) => {
  console.log('1. sanitizeXSS called');
  console.log('req.body:', req.body);
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};

// Validation Rules
const validateLogin = [
  (req, res, next) => { console.log('2. validateLogin - before body validation'); next(); },
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

const validateCreatePost = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (1-200 chars)'),
  body('slug').trim().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with dashes'),
  body('content').isLength({ min: 1 }).withMessage('Content is required'),
  body('categoryId').isMongoId().withMessage('Valid category ID is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('coverImage').optional().isURL().withMessage('Cover image must be a valid URL'),
  handleValidation
];

const validateUpdatePost = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('slug').optional().trim().matches(/^[a-z0-9-]+$/),
  body('content').optional().isLength({ min: 1 }),
  body('categoryId').optional().isMongoId(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('coverImage').optional().isURL(),
  handleValidation
];

const validateCreateCategory = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required (1-100 chars)'),
  body('slug').trim().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with dashes'),
  handleValidation
];

const validateUpdateCategory = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('slug').optional().trim().matches(/^[a-z0-9-]+$/),
  handleValidation
];

module.exports = {
  authenticate,
  sanitizeXSS,
  validateLogin,
  validateCreatePost,
  validateUpdatePost,
  validateCreateCategory,
  validateUpdateCategory
};
