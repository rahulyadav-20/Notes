import { Router } from 'express'
import { body } from 'express-validator'
import passport from 'passport'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/authController.js'

const router = Router()

/* ── POST /api/v1/auth/register ── */
router.post('/register',
  [
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    validate,
  ],
  ctrl.register
)

/* ── POST /api/v1/auth/login ── */
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password required.'),
    validate,
  ],
  ctrl.login
)

/* ── POST /api/v1/auth/verify-email ── */
router.post('/verify-email',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('6-digit OTP required.'),
    validate,
  ],
  ctrl.verifyEmail
)

/* ── POST /api/v1/auth/resend-otp ── */
router.post('/resend-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    validate,
  ],
  ctrl.resendOtp
)

/* ── POST /api/v1/auth/logout ── */
router.post('/logout', requireAuth, ctrl.logout)

/* ── POST /api/v1/auth/refresh-token ── */
router.post('/refresh-token', ctrl.refreshToken)

/* ── GET  /api/v1/auth/google ── */
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

/* ── GET  /api/v1/auth/google/callback ── */
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  ctrl.googleCallback
)

/* ── POST /api/v1/auth/forgot-password ── */
router.post('/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    validate,
  ],
  ctrl.forgotPassword
)

/* ── POST /api/v1/auth/reset-password ── */
router.post('/reset-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('6-digit code required.'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    validate,
  ],
  ctrl.resetPassword
)

/* ── PATCH /api/v1/auth/change-password ── */
router.patch('/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password required.'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
    validate,
  ],
  ctrl.changePassword
)

/* ── POST /api/v1/auth/dev/google  (development only) ──
   Body: { role?: 'user' | 'premium' | 'admin' }
   Returns a real JWT for a test account — no Google credentials needed. */
router.post('/dev/google', ctrl.devGoogleLogin)

export default router
