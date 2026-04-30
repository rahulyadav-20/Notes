/* =====================================================
   INTERVIEW DATA
   Static UI config (colors, category shells) stays here.
   Actual questions are fetched from the backend API.
   ===================================================== */
import { api } from '../../api/client'

export const DIFFICULTY_COLOR = {
  Easy:   '#10B981',
  Medium: '#F59E0B',
  Hard:   '#EF4444',
}

// Kept as UI fallback / skeleton config. The authoritative list comes
// from GET /api/v1/interview/topics — use loadInterviewTopics() below.
// totalQuestions and freeQuestions start at 0 — live values come from GET /api/v1/interview/topics
export const INTERVIEW_CATEGORIES = [
  { id: 'dsa',              name: 'DSA & Algorithms', icon: '📐', color: '#EC4899', desc: 'Arrays, trees, graphs, dynamic programming — patterns that crack top-tier interviews', totalQuestions: 0, freeQuestions: 0 },
  { id: 'system-design',    name: 'System Design',    icon: '🏛️', color: '#6366F1', desc: 'Design scalable distributed systems — the make-or-break round for senior engineers',  totalQuestions: 0, freeQuestions: 0 },
  { id: 'data-engineering', name: 'Data Engineering', icon: '🗄️', color: '#4A90D9', desc: 'Kafka, Spark, pipeline design & data architecture questions from top data teams',       totalQuestions: 0, freeQuestions: 0 },
  { id: 'sql',              name: 'SQL',              icon: '🗃️', color: '#336791', desc: 'Window functions, CTEs, joins & query optimisation — asked everywhere',                  totalQuestions: 0, freeQuestions: 0 },
  { id: 'machine-learning', name: 'Machine Learning', icon: '🤖', color: '#8B5CF6', desc: 'Model evaluation, feature engineering, MLOps & ML system design',                        totalQuestions: 0, freeQuestions: 0 },
  { id: 'behavioral',       name: 'Behavioral',       icon: '💬', color: '#F59E0B', desc: 'STAR stories, Amazon leadership principles & situational judgment',                       totalQuestions: 0, freeQuestions: 0 },
]

/* ─────────────────────────────────────────────────────
   API LOADERS  (replaced Vite static-import chunks)
───────────────────────────────────────────────────── */

/** Fetch all topic metadata from the backend. */
export async function loadInterviewTopics() {
  const { data } = await api.getInterviewTopics()
  return data.topics
}

/**
 * Fetch all questions for a category.
 * Free users receive only free questions; premium/purchased users get all.
 * Returns { topic, questions, access }
 */
export async function loadCategoryQuestions(categoryId) {
  const { data } = await api.getInterviewQuestions(categoryId)
  return data.questions
}

/**
 * Fetch a single question + prev/next context.
 * Returns { question, category, prevSlug, prevTitle, nextSlug, nextTitle }
 */
export async function loadQuestionBySlug(categoryId, slug) {
  const { data } = await api.getInterviewQuestion(categoryId, slug)
  return {
    question:  data.question,
    category:  data.category,
    prevSlug:  data.prevSlug,
    prevTitle: data.prevTitle,
    nextSlug:  data.nextSlug,
    nextTitle: data.nextTitle,
  }
}

/**
 * Load all questions across all categories — used by AdminQuestions.
 * Returns a flat array with categoryLabel + categoryId attached to each question.
 */
export async function loadAllQuestions() {
  const arrays = await Promise.all(
    INTERVIEW_CATEGORIES.map(cat =>
      loadCategoryQuestions(cat.id).then(qs =>
        qs.map(q => ({ ...q, categoryLabel: cat.name, categoryId: cat.id }))
      )
    )
  )
  return arrays.flat()
}
