import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function applyTheme(theme) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (theme === 'dark' || (theme === 'system' && prefersDark)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',   // 'light' | 'dark' | 'system'
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
    }),
    { name: 'enginotes_theme' }
  )
)

/** Call once on app boot to restore saved theme. */
export function initTheme() {
  const stored = JSON.parse(localStorage.getItem('enginotes_theme') || '{}')
  const theme  = stored?.state?.theme || 'light'
  applyTheme(theme)

  // Keep system mode in sync if OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = JSON.parse(localStorage.getItem('enginotes_theme') || '{}')?.state?.theme
    if (current === 'system') applyTheme('system')
  })
}
