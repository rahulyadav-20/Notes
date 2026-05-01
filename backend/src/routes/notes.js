import { Router } from 'express'
import { optionalAuth, requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/notesController.js'

const router = Router()

/* GET /api/v1/notes                            — list all notes metadata */
router.get('/', ctrl.listNotes)

/* GET /api/v1/notes/my-progress               — reading history (requires auth) */
router.get('/my-progress', requireAuth, ctrl.getMyNoteProgress)

/* GET /api/v1/notes/:slug                      — one note's metadata + part list */
router.get('/:slug', ctrl.getNote)

/* GET /api/v1/notes/:slug/parts/:partIndex     — full block content, records progress */
router.get('/:slug/parts/:partIndex', optionalAuth, ctrl.getNotePart)

/* GET /api/v1/notes/:slug/progress             — which parts the user has read */
router.get('/:slug/progress', requireAuth, ctrl.getNoteProgress)

/* DELETE /api/v1/notes/:slug/progress          — reset reading progress */
router.delete('/:slug/progress', requireAuth, ctrl.resetNoteProgress)

export default router
