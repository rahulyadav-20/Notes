import { Router } from 'express'
import { search } from '../controllers/searchController.js'

const router = Router()

/* GET /api/v1/search?q=kafka */
router.get('/', search)

export default router
