import { Router } from 'express'
import { body } from 'express-validator'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import * as ctrl from '../controllers/adminController.js'

const router = Router()

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin)

/* ── GET  /api/v1/admin/users ── */
router.get('/users', ctrl.listUsers)

/* ── PATCH /api/v1/admin/users/:id/role ── */
router.patch('/users/:id/role',
  [
    body('role').isIn(['user','premium']).withMessage('role must be user | premium (admin requires direct DB access)'),
    validate,
  ],
  ctrl.updateUserRole
)

/* ── DELETE /api/v1/admin/users/:id ── */
router.delete('/users/:id', ctrl.deactivateUser)

/* ── GET  /api/v1/admin/analytics ── */
router.get('/analytics', ctrl.getAnalytics)

/* ── GET  /api/v1/admin/audit-logs ── */
router.get('/audit-logs', ctrl.getAuditLogs)

/* ── GET  /api/v1/admin/posts ── */
router.get('/posts', ctrl.listAllPosts)

/* ── PATCH /api/v1/admin/questions/:slug ── */
router.patch('/questions/:slug', ctrl.updateQuestion)

/* ── DELETE /api/v1/admin/questions/:slug ── */
router.delete('/questions/:slug', ctrl.deleteQuestion)

/* ── Pricing ── */
router.get('/pricing',                          ctrl.getPricing)
router.patch('/pricing/note/:slug',             ctrl.updateNotePrice)
router.patch('/pricing/course/:slug',           ctrl.updateCoursePrice)
router.patch('/pricing/interview/:slug',        ctrl.updateInterviewPrice)

/* ── User access grants ── */
router.get('/users/:id/access',                 ctrl.getUserAccess)
router.post('/users/:id/grant',                 ctrl.grantAccess)
router.delete('/users/:id/revoke',              ctrl.revokeAccess)

export default router
