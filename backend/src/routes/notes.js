import { Router } from 'express'
import { optionalAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/notesController.js'

const router = Router()

/* GET /api/v1/notes                         — list all notes metadata */
router.get('/', ctrl.listNotes)

/* GET /api/v1/notes/:slug                   — one note's metadata + part list */
router.get('/:slug', ctrl.getNote)

/* GET /api/v1/notes/:slug/parts/:partIndex  — full block content for one part */
router.get('/:slug/parts/:partIndex', optionalAuth, ctrl.getNotePart)

export default router
