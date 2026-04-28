import { Routes, Route } from 'react-router-dom'
import ProtectedRoute           from './components/auth/ProtectedRoute'
import Home                    from './pages/Home'
import Notes                   from './pages/notes/Notes'
import CategoryPage             from './pages/notes/CategoryPage'
import NotePage                 from './pages/notes/NotePage'
import Courses                  from './pages/courses/Courses'
import CourseCategoryPage       from './pages/courses/CourseCategoryPage'
import CoursePage               from './pages/courses/CoursePage'
import Interview                from './pages/interview/Interview'
import InterviewCategoryPage    from './pages/interview/InterviewCategoryPage'
import QuestionPage             from './pages/interview/QuestionPage'
import Blog                     from './pages/blog/Blog'
import BlogPost                 from './pages/blog/BlogPost'
import Login                    from './pages/auth/Login'
import Signup                   from './pages/auth/Signup'
import Dashboard                from './pages/dashboard/Dashboard'

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/"                                       element={<Home />} />

      {/* Auth */}
      <Route path="/login"                                  element={<Login />} />
      <Route path="/signup"                                 element={<Signup />} />

      {/* Dashboard — requires login */}
      <Route path="/dashboard"                              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

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
    </Routes>
  )
}
