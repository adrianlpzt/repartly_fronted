// src/stores/platformStore.js
import { defineStore } from 'pinia'
import api from '../axios'

export const usePlatformStore = defineStore('platform', {
  state: () => ({
    plataformas: []
  }),

  actions: {
    async fetchPlataformas() {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get('/plataformas/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.plataformas = response.data
      } catch (error) {
        console.error('❌ Error al cargar plataformas:', error)
      }
    },

    async añadirPlataforma(nueva) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.post('/plataformas/', nueva, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchPlataformas()
      } catch (error) {
        console.error('❌ Error al añadir plataforma:', error)
      }

    },

    

    async actualizarPlataforma(actualizada) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.put(`/plataformas/${actualizada.id}/`, actualizada, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchPlataformas()
      } catch (error) {
        console.error('❌ Error al actualizar plataforma:', error)
      }
    },

    async eliminarPlataforma(id) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.delete(`/plataformas/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchPlataformas()
      } catch (error) {
        console.error('❌ Error al eliminar plataforma:', error)
      }
    },

    getPrecioEntrega(id) {
      const plataforma = this.plataformas.find(p => p.id === id)
      return plataforma ? plataforma.precio_entrega : 0
    },

    getPrecioRecogida(id) {
      const plataforma = this.plataformas.find(p => p.id === id)
      return plataforma ? plataforma.precio_recogida : 0
    },

    getTodas() {
      return this.plataformas.map(p => p.nombre)
    },

    setPlataformas(plataformas) {
      this.plataformas = plataformas
    }
  }
})
