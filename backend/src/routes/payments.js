import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/paymentsController.js'

const router = Router()

/* ── GET /api/v1/payments/plans  (public) ── */
router.get('/plans', ctrl.getPlans)

/* All routes below require auth */
router.use(requireAuth)

/* ── POST /api/v1/payments/create-order ── */
router.post('/create-order', ctrl.createOrder)

/* ── POST /api/v1/payments/verify ── */
router.post('/verify', ctrl.verifyPayment)

/* ── GET  /api/v1/payments/history ── */
router.get('/history', ctrl.getHistory)

/* ── GET  /api/v1/payments/my-purchases ── */
router.get('/my-purchases', ctrl.myPurchases)

export default router
