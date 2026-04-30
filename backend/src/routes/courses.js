import { Router } from 'express'
import { requireAuth, requirePremium } from '../middleware/auth.js'
import * as ctrl from '../controllers/coursesController.js'

const router = Router()

/* ── GET /api/v1/courses ── public */
router.get('/', ctrl.listCourses)

/* ── GET /api/v1/courses/:slug ── public (video_url hidden for non-premium) */
router.get('/:slug', ctrl.getCourse)

/* ── GET /api/v1/courses/:slug/lessons/:lessonId ── premium/enrolled */
router.get('/:slug/lessons/:lessonId', requireAuth, ctrl.getLesson)

export default router
