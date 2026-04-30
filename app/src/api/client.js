import axios from 'axios'

/**
 * Axios instance pointed at the Express backend.
 * Base URL comes from VITE_API_URL in .env (falls back to local dev).
 */
const client = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  timeout:         15_000,
  withCredentials: true,   // send httpOnly refresh-token cookie automatically
})

/* ── Request interceptor: attach access token ── */
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('enginotes_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Response interceptor: auto-refresh on 401 ── */
let isRefreshing  = false
let refreshQueue  = []   // queued requests while refreshing

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  )
  refreshQueue = []
}

client.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config

    // Only attempt refresh once per request, and only on 401
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh-token') &&
      !original.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue this request until the ongoing refresh finishes
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }

      original._retry  = true
      isRefreshing     = true

      try {
        const { data } = await client.post('/auth/refresh-token')
        const newToken = data.accessToken
        localStorage.setItem('enginotes_token', newToken)
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        // Refresh failed → clear token, let auth store handle redirect
        localStorage.removeItem('enginotes_token')
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default client

/* ── Typed helper wrappers (optional convenience) ── */
export const api = {
  // Auth
  register:       (data)       => client.post('/auth/register', data),
  login:          (data)       => client.post('/auth/login', data),
  logout:         ()           => client.post('/auth/logout'),
  refreshToken:   ()           => client.post('/auth/refresh-token'),
  devGoogleLogin: (role)       => client.post('/auth/dev/google', { role }),

  // Users
  getMe:          ()       => client.get('/users/me'),
  updateMe:       (data)   => client.patch('/users/me', data),
  deleteAccount:  (data)   => client.delete('/users/me', { data }),
  changePassword: (data)   => client.patch('/auth/change-password', data),
  getBookmarks: ()             => client.get('/users/me/bookmarks'),
  addBookmark:  (slug)         => client.post(`/users/me/bookmarks/${slug}`),
  delBookmark:  (slug)         => client.delete(`/users/me/bookmarks/${slug}`),

  // Courses
  getCourses:   ()             => client.get('/courses'),
  getCourse:    (slug)         => client.get(`/courses/${slug}`),
  getLesson:    (slug, id)     => client.get(`/courses/${slug}/lessons/${id}`),

  // Payments
  getPlans:       ()     => client.get('/payments/plans'),
  createOrder:    (data) => client.post('/payments/create-order', data),
  verifyPayment:  (data) => client.post('/payments/verify', data),
  getPayments:    ()     => client.get('/payments/history'),
  myPurchases:    ()     => client.get('/payments/my-purchases'),

  // Notes
  getNotes:       (category)     => client.get('/notes', { params: { category } }),
  getNote:        (slug)         => client.get(`/notes/${slug}`),
  getNotePart:    (slug, idx)    => client.get(`/notes/${slug}/parts/${idx}`),

  // Public stats
  getPlatformStats: () => client.get('/stats'),

  // Tracking
  trackPageview:   (data)  => client.post('/track/pageview', data),
  getPageViewStats:()      => client.get('/track/stats'),

  // Blog
  getBlogPosts:   (category)     => client.get('/blog', { params: { category } }),
  getBlogPost:    (slug)         => client.get(`/blog/${slug}`),
  createBlogPost: (data)         => client.post('/blog', data),
  updateBlogPost: (slug, data)   => client.patch(`/blog/${slug}`, data),
  deleteBlogPost: (slug)         => client.delete(`/blog/${slug}`),

  // Interview
  getInterviewTopics:    ()                       => client.get('/interview/topics'),
  getInterviewQuestions: (topicSlug)              => client.get(`/interview/${topicSlug}/questions`),
  getInterviewQuestion:  (topicSlug, questionSlug)=> client.get(`/interview/${topicSlug}/${questionSlug}`),

  // Admin — Users
  adminUsers:      (params)      => client.get('/admin/users', { params }),
  adminSetRole:    (id, role)    => client.patch(`/admin/users/${id}/role`, { role }),
  adminDelUser:    (id)          => client.delete(`/admin/users/${id}`),
  // Admin — Analytics & Logs
  adminStats:      ()            => client.get('/admin/analytics'),
  adminLogs:       (params)      => client.get('/admin/audit-logs', { params }),
  // Admin — Blog posts
  adminAllPosts:   (params)      => client.get('/admin/posts', { params }),
  adminPublishPost:(slug, flag)  => client.patch(`/blog/${slug}`, { is_published: flag }),
  adminDeletePost: (slug)        => client.delete(`/blog/${slug}`),
  // Admin — Questions
  adminUpdateQ:        (slug, data)       => client.patch(`/admin/questions/${slug}`, data),
  adminDeleteQ:        (slug)             => client.delete(`/admin/questions/${slug}`),
  // Admin — Pricing
  adminGetPricing:     ()                 => client.get('/admin/pricing'),
  adminUpdateNotePrice:(slug, price)      => client.patch(`/admin/pricing/note/${slug}`,      { price }),
  adminUpdateCoursePrice:(slug, price)    => client.patch(`/admin/pricing/course/${slug}`,    { price }),
  adminUpdateIQPrice:  (slug, price)      => client.patch(`/admin/pricing/interview/${slug}`, { price }),
  // Admin — User access
  adminGetUserAccess:  (id)               => client.get(`/admin/users/${id}/access`),
  adminGrantAccess:    (id, data)         => client.post(`/admin/users/${id}/grant`, data),
  adminRevokeAccess:   (id, data)         => client.delete(`/admin/users/${id}/revoke`, { data }),
}
