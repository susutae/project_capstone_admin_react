const AUTH_STORAGE_KEY = 'capstone-admin-authenticated'
const ADMIN_PASSWORD = 'admin'

export const authProvider = {
  login: ({ password }) => {
    if (password !== ADMIN_PASSWORD) {
      return Promise.reject(new Error('Incorrect password. Please try again.'))
    }

    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
    return Promise.resolve()
  },

  logout: () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return Promise.resolve()
  },

  checkAuth: () =>
    sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
      ? Promise.resolve()
      : Promise.reject(),

  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
      return Promise.reject()
    }

    return Promise.resolve()
  },

  getIdentity: () =>
    Promise.resolve({
      id: 'administrator',
      fullName: 'Administrator',
    }),

  getPermissions: () => Promise.resolve('administrator'),
}
