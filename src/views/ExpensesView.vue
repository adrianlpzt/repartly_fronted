<script setup>
import { ref, computed, onMounted } from 'vue'
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import EditExpenseDrawer from '../components/common/EditExpensesDrawer.vue'
import { useExpensesStore } from '../stores/expensesStore'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const expenseStore = useExpensesStore()
const search = ref('')
const groupBy = ref('daily')
const isDrawerOpen = ref(false)
const gastoSeleccionado = ref(null)

onMounted(() => {
  console.log('🎯 Componente montado: llamando a fetchExpenses()')
  expenseStore.fetchExpenses()
})

const crearGastoNuevo = () => {
  gastoSeleccionado.value = {
    id: null,
    concepto: '',
    cantidad: 0,
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  }
  isDrawerOpen.value = true
}

const editarGasto = (gasto) => {
  gastoSeleccionado.value = { ...gasto }
  isDrawerOpen.value = true
}

const guardarGasto = async (gasto) => {
  if (gasto.id) {
    await expenseStore.actualizarGasto(gasto)
  } else {
    await expenseStore.añadirGasto(gasto)
  }
  isDrawerOpen.value = false
}

const eliminarGasto = async (id) => {
  await expenseStore.eliminarGasto(id)
}

const formatGrupo = (clave) => {
  const fecha = new Date(clave)
  return groupBy.value === 'monthly'
    ? format(fecha, 'MMMM yyyy', { locale: es })
    : format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
}

const gastosFiltrados = computed(() => {
  const resultados = []

  expenseStore.groupedExpenses.forEach(grupo => {
    const filtrados = grupo.items.filter(gasto =>
      gasto.concepto.toLowerCase().includes(search.value.toLowerCase()) ||
      (gasto.observaciones || '').toLowerCase().includes(search.value.toLowerCase())
    )

    filtrados.forEach(gasto => {
      const fechaOriginal = new Date(grupo.fecha)
      const clave = groupBy.value === 'daily'
        ? format(fechaOriginal, 'yyyy-MM-dd')
        : format(fechaOriginal, 'yyyy-MM-01')

      let existente = resultados.find(r => r.clave === clave)
      if (!existente) {
        existente = { clave, items: [] }
        resultados.push(existente)
      }

      existente.items.push({ ...gasto, fecha: grupo.fecha })
    })
  })
  resultados.sort((a, b) => new Date(b.clave) - new Date(a.clave))
  return resultados
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">Gastos</ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>

    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar gasto o nota..."
        class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
      <select
        v-model="groupBy"
        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg"
      >
        <option value="daily">Diario</option>
        <option value="monthly">Mensual</option>
      </select>
      <button
        class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
        @click="crearGastoNuevo"
      >
        <Plus class="w-4 h-4" />
        Añadir gasto
      </button>
    </div>

    <div v-for="grupo in gastosFiltrados" :key="grupo.clave" class="space-y-4">
      <div class="flex items-center gap-3 text-sm text-gray-500 font-medium mt-8 mb-2 border-b pb-1">
        <span class="uppercase tracking-wide">{{ formatGrupo(grupo.clave) }}</span>
        <div class="flex-1 border-t border-gray-200"></div>
      </div>

      <div
        v-for="gasto in grupo.items"
        :key="gasto.id"
        class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
      >
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ gasto.concepto }}</p>
          <p v-if="gasto.observaciones" class="text-xs text-gray-500 mt-1">{{ gasto.observaciones }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-rose-600 bg-rose-100 px-3 py-1 text-sm rounded-full font-medium">
            {{ gasto.cantidad }} €
          </span>
          <button @click="editarGasto(gasto)" class="text-gray-500 hover:text-blue-600">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="eliminarGasto(gasto.id)" class="text-gray-500 hover:text-red-600">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <EditExpenseDrawer
      :isOpen="isDrawerOpen"
      :gasto="gastoSeleccionado"
      @close="isDrawerOpen = false"
      @save="guardarGasto"
    />
  </div>
</template>
