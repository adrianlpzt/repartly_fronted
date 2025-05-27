// stores/collectionStore.js
import { defineStore } from 'pinia'
import api from '../axios'


export const useCollectionStore = defineStore('collection', {
  state: () => ({
    groupedCollections: []
  }),

  actions: {
    async fetchCollections() {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get('/recogidas/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const agrupadas = {}
        response.data.forEach(recogida => {
          const fecha = recogida.fecha
          if (!agrupadas[fecha]) agrupadas[fecha] = []
          agrupadas[fecha].push(recogida)
        })

        this.groupedCollections = Object.entries(agrupadas).map(([fecha, items]) => ({
          fecha,
          items
        }))
      } catch (error) {
        console.error('Error al obtener recogidas:', error)
      }
    },

    async añadirRecogida(nuevaRecogida) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.post('/recogidas/', nuevaRecogida, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.fetchCollections()
      } catch (error) {
        console.error('Error al añadir recogida:', error)
      }
    },

    async actualizarRecogida(recogidaActualizada) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.put(`/recogidas/${recogidaActualizada.id}/`, recogidaActualizada, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.fetchCollections()
      } catch (error) {
        console.error('Error al actualizar recogida:', error)
      }
    },

    async eliminarRecogida(id) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.delete(`/recogidas/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.fetchCollections()
      } catch (error) {
        console.error('Error al eliminar recogida:', error)
      }
    },

    setCollections(recogidas) {
      this.recogidas=recogidas
    }
  }
})
