<script setup>

import { computed } from 'vue';

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


const ingresosHoy = computed(() => {
  const totalEntregas = props.entregas.reduce((sum, e) => sum + Number(e.total), 0)
  const totalRecogidas = props.recogidas.reduce((sum, r) => sum + Number(r.total), 0)
  return totalEntregas + totalRecogidas
})

const totalEntregas = computed(() =>
  props.entregas.reduce((sum, e) => sum + Number(e.cantidad), 0)
)

const totalRecogidas = computed(() =>
  props.recogidas.reduce((sum, r) => sum + Number(r.cantidad), 0)
)

const totalGastos = computed(() =>
  props.gastos.reduce((sum, g) => sum + Number(g.cantidad), 0)
)

const beneficio = computed(() => ingresosHoy.value - totalGastos.value)
</script>

<template>
  <div class="space-y-6">
    <!-- Tarjetas -->
    <div class="grid md:grid-cols-4 gap-6">
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Entregas hoy</p>
        <h2 class="text-2xl font-bold text-emerald-600">{{ totalEntregas }}</h2>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Recogidas hoy</p>
        <h2 class="text-2xl font-bold text-blue-600">{{ totalRecogidas }}</h2>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Ingresos hoy</p>
        <h2 class="text-2xl font-bold text-gray-800">{{ ingresosHoy.toFixed(2) }} €</h2>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border shadow-sm">
        <p class="text-sm text-gray-500">Gastos hoy</p>
        <h2 class="text-2xl font-bold text-rose-600">-{{ totalGastos.toFixed(2) }} €</h2>
      </div>
    </div>

    <!-- Beneficio -->
    <div class="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white p-6 rounded-2xl shadow text-center">
      <h3 class="text-lg font-semibold mb-1">Beneficio neto de hoy</h3>
      <p class="text-3xl font-bold tracking-wide">
        {{ beneficio.toFixed(2) }} €
      </p>
    </div>
  </div>
</template>
