<script setup>
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  entregas: {
    type: Array,
    default: () => []
  },
  recogidas: {
    type: Array,
    default: () => []
  },
  gastos: {
    type: Array,
    default: () => []
  }
})

// 1. Selector de mes
const mesSeleccionado = ref(format(new Date(), 'yyyy-MM'))

// 2. Filtrar por mes seleccionado
const entregasFiltradas = computed(() =>
  props.entregas.filter(e => e.fecha.startsWith(mesSeleccionado.value))
)

const recogidasFiltradas = computed(() =>
  props.recogidas.filter(r => r.fecha.startsWith(mesSeleccionado.value))
)

const gastosFiltrados = computed(() =>
  props.gastos.filter(g => g.fecha.startsWith(mesSeleccionado.value))
)

// 3. Cálculos
const totalEntregas = computed(() =>
  entregasFiltradas.value.reduce((sum, e) => sum + Number(e.cantidad), 0)
)

const totalRecogidas = computed(() =>
  recogidasFiltradas.value.reduce((sum, r) => sum + Number(r.cantidad), 0)
)

const ingresosMes = computed(() => {
  const totalEntregasEur = entregasFiltradas.value.reduce((sum, e) => sum + Number(e.total), 0)
  const totalRecogidasEur = recogidasFiltradas.value.reduce((sum, r) => sum + Number(r.total), 0)
  return totalEntregasEur + totalRecogidasEur
})

const totalGastos = computed(() =>
  gastosFiltrados.value.reduce((sum, g) => sum + Number(g.cantidad), 0)
)

const beneficio = computed(() => ingresosMes.value - totalGastos.value)



//DESCARGA FACTURA MENSUAL

const descargarFactura = async () => {
  const mes = mesSeleccionado.value  // ej: '2024-05'
  const token = localStorage.getItem('accessToken')

  const response = await fetch(`${import.meta.env.VITE_API_BASE}/factura/?mes=${mes}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `repartly_factura_${mes}.pdf`
  link.click()
}


</script>

<template>
  <div class="space-y-6">

    <!-- Selector de mes -->
    <div class="flex items-center justify-end">
      <label for="mes" class="mr-2 text-sm font-medium text-gray-600">Mes:</label>
      <input
        type="month"
        id="mes"
        v-model="mesSeleccionado"
        class="border rounded px-2 py-1 text-sm"
      />
    </div>

    <!-- Tarjetas -->
    <div class="grid md:grid-cols-4 gap-6">
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Entregas del mes</p>
        <h2 class="text-2xl font-bold text-emerald-600">{{ totalEntregas }}</h2>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Recogidas del mes</p>
        <h2 class="text-2xl font-bold text-blue-600">{{ totalRecogidas }}</h2>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Ingresos del mes</p>
        <h2 class="text-2xl font-bold text-gray-800">{{ ingresosMes.toFixed(2) }} €</h2>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Gastos del mes</p>
        <h2 class="text-2xl font-bold text-rose-600">-{{ totalGastos.toFixed(2) }} €</h2>
      </div>
    </div>

    <!-- Beneficio -->
    <div class="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-2xl shadow text-center">
      <h3 class="text-lg font-semibold mb-1">Beneficio neto mensual</h3>
      <p class="text-3xl font-bold tracking-wide">
        {{ beneficio.toFixed(2) }} €
      </p>
    </div>

    <!-- Botón para descargar factura -->
    <div class="flex justify-end mt-4">
      <button
        @click="descargarFactura"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow"
      >
        Descargar factura en PDF
      </button>
    </div>
  </div>
</template>
