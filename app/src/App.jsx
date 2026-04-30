import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute    from './components/auth/ProtectedRoute'
import AdminRoute        from './components/auth/AdminRoute'
import { usePageTracking } from './hooks/usePageTracking'

/* ── Lazy-loaded routes (each becomes its own JS chunk) ── */
const Home                 = lazy(() => import('./pages/Home'))
const Notes                = lazy(() => import('./pages/notes/Notes'))
const CategoryPage         = lazy(() => import('./pages/notes/CategoryPage'))
const NotePage             = lazy(() => import('./pages/notes/NotePage'))
const Courses              = lazy(() => import('./pages/courses/Courses'))
const CourseCategoryPage   = lazy(() => import('./pages/courses/CourseCategoryPage'))
const CoursePage           = lazy(() => import('./pages/courses/CoursePage'))
const Interview            = lazy(() => import('./pages/interview/Interview'))
const InterviewCategoryPage = lazy(() => import('./pages/interview/InterviewCategoryPage'))
const QuestionPage         = lazy(() => import('./pages/interview/QuestionPage'))
const Blog                 = lazy(() => import('./pages/blog/Blog'))
const BlogPost             = lazy(() => import('./pages/blog/BlogPost'))
const Login                = lazy(() => import('./pages/auth/Login'))
const Signup               = lazy(() => import('./pages/auth/Signup'))
const Callback             = lazy(() => import('./pages/auth/Callback'))
const Dashboard            = lazy(() => import('./pages/dashboard/Dashboard'))
const Settings             = lazy(() => import('./pages/settings/Settings'))
const Upgrade              = lazy(() => import('./pages/upgrade/Upgrade'))
const Checkout             = lazy(() => import('./pages/upgrade/Checkout'))
const PaymentSuccess       = lazy(() => import('./pages/upgrade/PaymentSuccess'))
const AdminDashboard       = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers           = lazy(() => import('./pages/admin/AdminUsers'))
const AdminContent         = lazy(() => import('./pages/admin/AdminContent'))
const AdminAnalytics       = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminQuestions       = lazy(() => import('./pages/admin/AdminQuestions'))
const AdminSettings        = lazy(() => import('./pages/admin/AdminSettings'))
const AdminPricing         = lazy(() => import('./pages/admin/AdminPricing'))

/* Minimal fallback shown while a route chunk loads */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c1e]">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-accent animate-spin"/>
    </div>
  )
}

export default function App() {
  usePageTracking()
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Home */}
      <Route path="/"                                       element={<Home />} />

      {/* Auth */}
      <Route path="/login"                                  element={<Login />} />
      <Route path="/signup"                                 element={<Signup />} />
      <Route path="/auth/callback"                          element={<Callback />} />

      {/* Dashboard — requires login */}
      <Route path="/dashboard"                              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings"                               element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/upgrade"                                element={<Upgrade />} />
      <Route path="/checkout"                               element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/payment/success"                        element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

      {/* Notes */}
      <Route path="/notes"                                  element={<Notes />} />
      <Route path="/notes/:categoryId"                      element={<CategoryPage />} />
      <Route path="/notes/:categoryId/:slug"                element={<NotePage />} />

      {/* Courses */}
      <Route path="/courses"                                element={<Courses />} />
      <Route path="/courses/:categoryId"                    element={<CourseCategoryPage />} />
      <Route path="/courses/:categoryId/:slug"              element={<CoursePage />} />

      {/* Interview */}
      <Route path="/interview"                              element={<Interview />} />
      <Route path="/interview/:categoryId"                  element={<InterviewCategoryPage />} />
      <Route path="/interview/:categoryId/:slug"            element={<QuestionPage />} />

      {/* Blog */}
      <Route path="/blog"                                   element={<Blog />} />
      <Route path="/blog/:slug"                             element={<BlogPost />} />

      {/* Admin — requires admin role */}
      <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users"      element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/content"    element={<AdminRoute><AdminContent /></AdminRoute>} />
      <Route path="/admin/analytics"  element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/questions"  element={<AdminRoute><AdminQuestions /></AdminRoute>} />
      <Route path="/admin/settings"   element={<AdminRoute><AdminSettings /></AdminRoute>} />
      <Route path="/admin/pricing"    element={<AdminRoute><AdminPricing /></AdminRoute>} />
    </Routes>
    </Suspense>
  )
}
