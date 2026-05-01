import { Router } from 'express'
import { requireAuth, requirePremium, optionalAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/coursesController.js'

const router = Router()

/* ── GET /api/v1/courses ── public */
router.get('/', ctrl.listCourses)

/* ── GET /api/v1/courses/my-progress ── requires auth */
router.get('/my-progress', requireAuth, ctrl.getMyProgress)

/* ── GET /api/v1/courses/:slug ── public, optionalAuth for enrollment/progress */
router.get('/:slug', optionalAuth, ctrl.getCourse)

/* ── GET /api/v1/courses/:slug/lessons/:lessonId ── premium/enrolled */
router.get('/:slug/lessons/:lessonId', requireAuth, ctrl.getLesson)

/* ── POST /api/v1/courses/:slug/lessons/:lessonId/complete ── requires auth */
router.post('/:slug/lessons/:lessonId/complete', requireAuth, ctrl.markLessonComplete)

export default router
