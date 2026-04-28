import axios from 'axios'
// Phase 2 — replace with real API base URL from env
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
})
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('engynotes_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export default client
