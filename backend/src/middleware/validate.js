import { validationResult } from 'express-validator'

/**
 * Drop this after your express-validator chains to auto-respond 400 on errors.
 *
 * Usage:
 *   router.post('/register', [
 *     body('email').isEmail(),
 *     body('password').isLength({ min: 8 }),
 *     validate,
 *   ], authController.register)
 */
export function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error:  'Validation failed.',
      fields: errors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}
