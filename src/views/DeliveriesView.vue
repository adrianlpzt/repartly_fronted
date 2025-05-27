<script setup>
import { ref, computed, onMounted } from 'vue'
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import { useDeliveryStore } from '../stores/deliveryStore'
import EditDeliveryDrawer from '../components/common/EditDeliveryDrawer.vue'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'

defineEmits(['onToggleSidebar'])

const search = ref('')
const groupBy = ref('daily')
const deliveryStore = useDeliveryStore()

const isDrawerOpen = ref(false)
const entregaSeleccionada = ref(null)

onMounted(() => {
  deliveryStore.fetchDeliveries()
})

const crearEntregaNueva = () => {
  entregaSeleccionada.value = {
    id: null,
    plataforma: '',
    cantidad: 1,
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    total: 0
  }
  isDrawerOpen.value = true
}

const editarEntrega = (entrega) => {
  entregaSeleccionada.value = { ...entrega }
  isDrawerOpen.value = true
}

const eliminarEntrega = async (id) => {
  await deliveryStore.eliminarEntrega(id)
}

const guardarEntregaActualizada = async (entregaActualizada) => {
  if (entregaActualizada.id) {
    await deliveryStore.actualizarEntrega(entregaActualizada)
  } else {
    await deliveryStore.añadirEntrega(entregaActualizada)
  }
  isDrawerOpen.value = false
}

const formatGrupo = (clave) => {
  const fecha = new Date(clave)
  return groupBy.value === 'monthly'
    ? format(fecha, 'MMMM yyyy', { locale: es })
    : format(fecha, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })
}

const entregasFiltradas = computed(() => {
  const resultados = []
  deliveryStore.groupedDeliveries.forEach(grupo => {
    const filtradas = grupo.items.filter(entrega =>
      entrega.plataforma_nombre.toLowerCase().includes(search.value.toLowerCase()) ||
      (entrega.observaciones || '').toLowerCase().includes(search.value.toLowerCase())
    )

    filtradas.forEach(entrega => {
      const fechaOriginal = new Date(grupo.fecha)
      const clave = groupBy.value === 'daily'
        ? format(fechaOriginal, 'yyyy-MM-dd')
        : format(fechaOriginal, 'yyyy-MM-01')

      let existente = resultados.find(r => r.clave === clave)
      if (!existente) {
        existente = { clave, items: [] }
        resultados.push(existente)
      }

      existente.items.push({ ...entrega, fecha: grupo.fecha })
    })
  })
  resultados.sort((a, b) => new Date(b.clave) - new Date(a.clave))
  return resultados
})


</script>



<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">
        Entregas
      </ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>

    <!-- Filtros -->
    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar observación o plataforma..."
        class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
      />
      <select
        v-model="groupBy"
        class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
      >
        <option value="daily">Diario</option>
        <option value="monthly">Mensual</option>
      </select>
      <button @click="crearEntregaNueva" class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm">
        <Plus class="w-4 h-4" />
        Añadir entrega
      </button>
    </div>

    <!-- Lista agrupada -->
    <div v-for="grupo in entregasFiltradas" :key="grupo.clave" class="space-y-4">
      <div class="flex items-center gap-3 text-sm text-gray-500 font-medium mt-8 mb-2 border-b pb-1">
        <span class="uppercase tracking-wide">{{ formatGrupo(grupo.clave) }}</span>
        <div class="flex-1 border-t border-gray-200"></div>
      </div>

      <div
        v-for="entrega in grupo.items"
        :key="entrega.id"
        class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
      >
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ entrega.plataforma_nombre }} – {{ entrega.cantidad }} entregas
          </p>
          <p v-if="entrega.observaciones" class="text-xs text-gray-500 mt-1">
            {{ entrega.observaciones }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-emerald-600 bg-emerald-100 px-3 py-1 text-sm rounded-full font-medium">
            {{entrega.total}}
          </span>
          <button @click="editarEntrega(entrega)" class="text-gray-500 hover:text-blue-600" title="Editar">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="eliminarEntrega(entrega.id)" class="text-gray-500 hover:text-red-600" title="Eliminar">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Drawer lateral -->
    <EditDeliveryDrawer
      :tipo="'entrega'"
      :isOpen="isDrawerOpen"
      :entrega="entregaSeleccionada"
      @close="isDrawerOpen = false"
      @save="guardarEntregaActualizada"
    />
  </div>
</template>
