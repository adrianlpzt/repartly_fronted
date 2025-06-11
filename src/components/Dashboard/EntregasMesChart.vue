<script setup>
import { computed, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'

const props = defineProps({
  entregas: { type: Array, required: true },
  recogidas: { type: Array, required: true }
})


const isReady = ref(false)

const mesSeleccionado = ref('')

// Función para agrupar por mes
function agruparPorMes(array, campo) {
  const resumen = {}
  array.forEach(item => {
    const clave = item.fecha.slice(0, 7) // 'YYYY-MM'
    const valor = item[campo] || 0
    resumen[clave] = (resumen[clave] || 0) + valor
  })
  return resumen
}

// Agrupaciones
const entregasMes = computed(() => agruparPorMes(props.entregas, 'cantidad'))
const recogidasMes = computed(() => agruparPorMes(props.recogidas, 'cantidad'))

const todosLosMeses = computed(() => {
  const meses = new Set([
    ...Object.keys(entregasMes.value),
    ...Object.keys(recogidasMes.value)
  ])
  return Array.from(meses).sort()
})

// Series filtradas
const series = computed(() => {
  const meses = mesSeleccionado.value ? [mesSeleccionado.value] : todosLosMeses.value
  return [
    {
      name: 'Entregas',
      data: meses.map(m => entregasMes.value[m] || 0)
    },
    {
      name: 'Recogidas',
      data: meses.map(m => recogidasMes.value[m] || 0)
    }
  ]
})

const chartOptions = computed(() => ({
  chart: {
    id: 'resumen-mensual',
    type: 'bar',
    stacked: false,
    toolbar: { show: true }
  },
  xaxis: {
    categories: mesSeleccionado.value ? [mesSeleccionado.value] : todosLosMeses.value,
    labels: { rotate: -45 }
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '40%'
    }
  },
  dataLabels: { enabled: true },
  colors: ['#10b981', '#3b82f6'],
  title: {
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        chart: {
          height: 400
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
}))
</script>

<template>

     <!-- Fallback mientras se carga -->
    <div v-if="!isReady" class="text-center text-gray-400 mt-10">
      Cargando estadisticas...
    </div>

  <div class="bg-white mt-6 p-4 rounded-xl border shadow space-y-4">
    <!-- Filtro por mes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por mes</label>
      <select v-model="mesSeleccionado" class="w-full border rounded-md px-3 py-2">
        <option value="">Todos los meses</option>
        <option v-for="mes in todosLosMeses" :key="mes" :value="mes">
          {{ mes }}
        </option>
      </select>
    </div>

    <!-- Gráfico -->
    <ApexCharts
      width="100%"
      height="360"
      type="bar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
