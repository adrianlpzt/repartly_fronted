<script setup>
import { computed, onMounted, nextTick, ref } from 'vue'
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import ApexCharts from 'vue3-apexcharts'
import EntregasMesChart from '../components/Dashboard/EntregasMesChart.vue'
import { useDeliveryStore } from '../stores/deliveryStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useExpensesStore } from '../stores/expensesStore'
import InformesDiarios from '../components/Dashboard/informesDiarios.vue'
import InformesMensuales from '../components/Dashboard/informesMensuales.vue'

const deliveryStore = useDeliveryStore()
const collectionStore = useCollectionStore()
const expensesStore = useExpensesStore()
const vista = ref('diario')
const hoy = new Date().toISOString().split('T')[0]
const mesActualClave = new Date().toISOString().slice(0, 7)  // Ej: '2025-05'


// ✅ Función centralizada para cargar datos

async function refetchDatos() {
  await deliveryStore.fetchDeliveries()
  await collectionStore.fetchCollections()
  await expensesStore.fetchExpenses()
  await nextTick()
}

const isReady = ref(false)

onMounted(async () => {
  await deliveryStore.fetchDeliveries()
  await collectionStore.fetchCollections()
  await expensesStore.fetchExpenses()
  isReady.value = true
})

//ERG HOY

const entregasHoy = computed(() => {
  const grupo = deliveryStore.groupedDeliveries.find(g => g.fecha === hoy || g.clave === hoy)
  return grupo ? grupo.items : []
})

const recogidasHoy = computed(() => {
  const grupo = collectionStore.groupedCollections.find(g => g.fecha === hoy || g.clave === hoy)
  return grupo ? grupo.items : []
})

const gastosHoy = computed(() => {
  const grupo = expensesStore.groupedExpenses.find(g => g.fecha === hoy || g.clave === hoy)
  return grupo ? grupo.items : []
})

//ERG MES

const entregasMes = computed(() => {
  return deliveryStore.groupedDeliveries
    .flatMap(g => g.items)
})

const recogidasMes = computed(() => {
  return collectionStore.groupedCollections
    .flatMap(g => g.items)
})

const gastosMes = computed(() => {
  return expensesStore.groupedExpenses
    .flatMap(g => g.items)
})

</script>

<template>

  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">Dashboard</ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>

    <!-- Selector + Contenido -->
    <div class="bg-white p-6 rounded-2xl shadow border space-y-6">

      <!-- Fallback mientras se carga -->
    <div v-if="!isReady" class="text-center text-gray-400 mt-10">
      Cargando perfil...
    </div>

      <!-- Botones de vista -->
      <div class="flex gap-4">
        <button
          @click="vista = 'diario'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            vista === 'diario'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          Informe Diario
        </button>
        <button
          @click="vista = 'mensual'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            vista === 'mensual'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          Informes mensuales
        </button>
      </div>

      <!-- Informes -->
        <InformesDiarios
          v-if="vista === 'diario' && isReady"
          :entregas="entregasHoy"
          :recogidas="recogidasHoy"
          :gastos="gastosHoy"
        />

        <InformesMensuales
          v-if="vista === 'mensual' && isReady"
          :entregas="entregasMes"
          :recogidas="recogidasMes"
          :gastos="gastosMes"
        />
    </div>  
    <div class="bg-white p-6 rounded-2xl shadow border space-y-6">
      <EntregasMesChart
        :entregas="entregasMes"
        :recogidas="recogidasMes"
        :gastos="gastosMes"
      />
    </div>
  </div>
</template>
