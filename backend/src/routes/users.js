import { Router } from 'express'
import { body } from 'express-validator'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import * as ctrl from '../controllers/usersController.js'

const router = Router()

// All user routes require auth
router.use(requireAuth)

/* ── GET /api/v1/users/me ── */
router.get('/me', ctrl.getMe)

/* ── PATCH /api/v1/users/me ── */
router.patch('/me',
  [
    body('name').optional().trim().isLength({ min: 2, max: 60 })
      .withMessage('Name must be 2–60 characters.'),
    body('avatar_url').optional().isURL().withMessage('avatar_url must be a valid URL.'),
    validate,
  ],
  ctrl.updateMe
)

/* ── DELETE /api/v1/users/me ── */
router.delete('/me', ctrl.deleteAccount)

/* ── GET /api/v1/users/me/bookmarks ── */
router.get('/me/bookmarks', ctrl.getBookmarks)

/* ── POST /api/v1/users/me/bookmarks/:slug ── */
router.post('/me/bookmarks/:slug', ctrl.addBookmark)

/* ── DELETE /api/v1/users/me/bookmarks/:slug ── */
router.delete('/me/bookmarks/:slug', ctrl.removeBookmark)

export default router
