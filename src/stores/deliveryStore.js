// stores/deliveryStore.js
import { defineStore } from 'pinia'
import api from '../axios'

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    groupedDeliveries: []
  }),

  actions: {
    async fetchDeliveries() {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get('/entregas/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const agrupadas = {}

        response.data.forEach(entrega => {
          const fecha = entrega.fecha
          if (!agrupadas[fecha]) {
            agrupadas[fecha] = []
          }
          agrupadas[fecha].push(entrega)
        })

        this.groupedDeliveries = Object.entries(agrupadas).map(([fecha, items]) => ({
          fecha,
          items
        }))
      } catch (error) {
        console.error('❌ Error al obtener entregas:', error)
        this.groupedDeliveries = []
      }
    },

    async añadirEntrega(entrega) {
      try {
        const token = localStorage.getItem('accessToken')
        console.log('📦 Enviando entrega:', nuevaRecogida)
        await api.post('/entregas/', entrega, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchDeliveries()
      } catch (error) {
        console.error('❌ Error al añadir entrega:', error)
      }
    },

    async actualizarEntrega(entrega) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.put(`/entregas/${entrega.id}/`, entrega, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchDeliveries()
      } catch (error) {
        console.error('❌ Error al actualizar entrega:', error)
      }
    },

    async eliminarEntrega(id) {
      try {
        const token = localStorage.getItem('accessToken')
        await api.delete(`/entregas/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchDeliveries()
      } catch (error) {
        console.error('❌ Error al eliminar entrega:', error)
      }
    },

    setDeliveries(entregas){
      this.entregas = entregas
    }
  }
})
