const { validationResult, body } = require('express-validator');

/**
 * Check validation results and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/**
 * Common validation rules
 */
const urlValidation = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .isURL().withMessage('Please provide a valid URL')
    .contains('youtube').withMessage('Only YouTube URLs are supported'),
];

const authValidation = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  login: [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
};

module.exports = { validate, urlValidation, authValidation };
