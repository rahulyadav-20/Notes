import { Router } from 'express'
import { optionalAuth } from '../middleware/auth.js'
import { listTopics, listQuestions, getQuestion } from '../controllers/interviewController.js'

const router = Router()

// Topics are public
router.get('/topics', listTopics)

// Questions respect premium gate — optionalAuth populates req.user if logged in
router.get('/:topicSlug/questions',          optionalAuth, listQuestions)
router.get('/:topicSlug/:questionSlug',       optionalAuth, getQuestion)

export default router
