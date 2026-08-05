const AUTH_STORAGE_KEY = 'capstone-admin-session'

const readTokenExpiry = (token) => {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(normalized))
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null
  } catch {
    return null
  }
}

export const saveAuthSession = ({ token, user }) => {
  const expiresAt = readTokenExpiry(token)
  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ token, user, expiresAt }),
  )
}

export const clearAuthSession = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export const getAuthSession = () => {
  try {
    const session = JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY))

    if (!session?.token || (session.expiresAt && Date.now() >= session.expiresAt)) {
      clearAuthSession()
      return null
    }

    return session
  } catch {
    clearAuthSession()
    return null
  }
}

export const getAuthToken = () => getAuthSession()?.token
