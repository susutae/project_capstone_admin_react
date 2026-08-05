import { fetchUtils } from 'react-admin'
import { apiUrl } from './apiConfig'
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './authSession'

const authenticationError = (error) => {
  const message = error.body?.error || error.body?.message || error.message
  const loginError = new Error(message || 'Unable to sign in. Please try again.')
  loginError.status = error.status
  return loginError
}

export const authProvider = {
  login: async ({ email, password }) => {
    try {
      const { json } = await fetchUtils.fetchJson(`${apiUrl}/login`, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (!json?.token || !json?.user) {
        throw new Error('The authentication server returned an invalid response.')
      }

      saveAuthSession(json)
    } catch (error) {
      clearAuthSession()
      throw authenticationError(error)
    }
  },

  logout: () => {
    clearAuthSession()
    return Promise.resolve()
  },

  checkAuth: () =>
    getAuthSession()
      ? Promise.resolve()
      : Promise.reject(),

  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      clearAuthSession()
      return Promise.reject()
    }

    return Promise.resolve()
  },

  getIdentity: () => {
    const user = getAuthSession()?.user

    if (!user) return Promise.reject()

    return Promise.resolve({
      id: user.id,
      fullName: user.full_name || user.email,
    })
  },

  getPermissions: () =>
    Promise.resolve(getAuthSession()?.user?.membership_tier || 'authenticated'),
}
