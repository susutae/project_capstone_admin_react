export const apiUrl = (
  import.meta.env.VITE_API_URL ||
  'https://capstone-project-backend-delta.vercel.app/api'
).replace(/\/$/, '')
