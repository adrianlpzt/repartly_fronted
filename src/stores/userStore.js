// src/stores/userStore.js
import { defineStore } from 'pinia'
import api from '../axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      first_name: '',
      last_name: '',
      username: '',
      email: ''
    },
    profile: {
      is_premium: false,
      telefono: '',
      fecha_nacimiento: '',
      avatar: '',
      nif: ''
    }
  }),

  getters: {
    isPremium: (state) => state.profile?.is_premium || false,
    username: (state) => state.user?.username || '',
    email: (state) => state.user?.email || '',
  },

  actions: {
    

    setUser(user) {
      this.user = user
    },
    setProfile(profile) {
      this.profile = profile
    },
    clearUser() {
      this.user = null
      this.profile = null
    },
    async fetchUserData() {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await api.get('/me/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.user = res.data.user
        this.profile = res.data.profile
      } catch (error) {
        console.error('❌ Error al obtener datos del usuario:', error)
      }
    },

    async updateProfile(datos) {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.put(
          `/perfil/${this.profile.id}/`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        // Actualiza el store con la nueva info
        this.profile = response.data
        return response.data
      } catch (error) {
        console.error('❌ Error al actualizar perfil:', error)
        throw error
      }
    },
    async updateUser(datosUsuario) {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await api.put('/me/update_user/', datosUsuario, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.user = res.data
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error)
        throw error
      }
    }
  }
})
