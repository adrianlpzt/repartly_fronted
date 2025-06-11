// src/stores/expensesStore.js
import { defineStore } from 'pinia'
import api from '../axios'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    groupedExpenses: []
  }),

  actions: {
    async fetchExpenses() {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get('/gastos/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const agrupadas = {}
        response.data.forEach(gasto => {
          const fecha = gasto.fecha
          if (!agrupadas[fecha]) {
            agrupadas[fecha] = []
          }
          agrupadas[fecha].push(gasto)
        })

        this.groupedExpenses = Object.entries(agrupadas).map(([fecha, items]) => ({ fecha, items }))
      } catch (error) {
        console.error('❌ Error al obtener gastos:', error)
      }
    },

    async añadirGasto(gasto) {
      const token = localStorage.getItem('accessToken')
      await api.post('/gastos/', gasto, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.fetchExpenses()
    },

    async actualizarGasto(gasto) {
      const token = localStorage.getItem('accessToken')
      await api.put(`/gastos/${gasto.id}/`, gasto, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.fetchExpenses()
    },

    async eliminarGasto(id) {
      const token = localStorage.getItem('accessToken')
      await api.delete(`/gastos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.fetchExpenses()
    },

    setExpenses(gasto) {
      this.gasto = gasto
    }
  }
})
