import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/blogController.js'

const router = Router()

// Public
router.get('/',       listPosts)
router.get('/:slug',  getPost)

// Admin only
router.post('/',          requireAuth, requireAdmin, createPost)
router.patch('/:slug',    requireAuth, requireAdmin, updatePost)
router.delete('/:slug',   requireAuth, requireAdmin, deletePost)

export default router
