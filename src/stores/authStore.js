// stores/authStore.js
import { defineStore } from 'pinia'
import api from '../axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },

  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/token/', {
          username,
          password
        })

        this.accessToken = response.data.access
        this.refreshToken = response.data.refresh

        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)

        const dashboard = useDashboardStore()
        const me = await api.get('/me/', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })

        dashboard.setUser(me.data.user)
        dashboard.setProfile(me.data.profile)
        dashboard.setPlataformas(me.data.plataformas)

        return true
      } catch (error) {
        console.error('Error en login:', error)
        return false
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = "/login";

    },

    setToken(token) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    }
  }
})
