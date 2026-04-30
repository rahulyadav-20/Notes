import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css'
import './styles/app.css'
import App from './App.jsx'
import { useAuthStore } from './store/authStore'
import { initTheme } from './store/themeStore'

// Apply saved theme before first paint (prevents flash)
initTheme()

// Validate any stored token before the first render
useAuthStore.getState().init()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
