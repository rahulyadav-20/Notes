import { Router } from 'express'
import { optionalAuth, requireAuth, requireAdmin } from '../middleware/auth.js'
import { trackPageview, getPageViewStats } from '../controllers/trackController.js'

const router = Router()

// Public — fired by the frontend on every route change
router.post('/pageview', optionalAuth, trackPageview)

// Admin only — used by analytics dashboard
router.get('/stats', requireAuth, requireAdmin, getPageViewStats)

export default router
