<script setup>
import { ref, computed, onMounted } from 'vue'
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import EditDeliveryDrawer from '../components/common/EditDeliveryDrawer.vue'
import { useCollectionStore } from '../stores/collectionStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'

defineEmits(['onToggleSidebar'])

const collectionStore = useCollectionStore()
const search = ref('')
const groupBy = ref('daily')
const isDrawerOpen = ref(false)
const recogidaSeleccionada = ref(null)

onMounted(() => {
  collectionStore.fetchCollections()
})

const crearRecogidaNueva = () => {
  recogidaSeleccionada.value = {
    id: null,
    plataforma: '',
    cantidad: 1,
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    total: 0
  }
  isDrawerOpen.value = true
}

const editarRecogida = (recogida) => {
  recogidaSeleccionada.value = { ...recogida }
  isDrawerOpen.value = true
}

const eliminarRecogida = async (id) => {
  await collectionStore.eliminarRecogida(id)
}

const guardarRecogida = async (recogidaActualizada) => {
  if (recogidaActualizada.id) {
    await collectionStore.actualizarRecogida(recogidaActualizada)
  } else {
    await collectionStore.añadirRecogida(recogidaActualizada)
  }
  isDrawerOpen.value = false
}

const formatGrupo = (clave) => {
  const fecha = new Date(clave)
  return groupBy.value === 'monthly'
    ? format(fecha, 'MMMM yyyy', { locale: es })
    : format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
}

const recogidasFiltradas = computed(() => {
  const resultados = []

  collectionStore.groupedCollections.forEach(grupo => {
    const recogidasFiltradas = grupo.items.filter(recogida =>
      (recogida.plataforma?.toLowerCase?.() || '').includes(search.value.toLowerCase()) ||
      (recogida.observaciones || '').toLowerCase().includes(search.value.toLowerCase())
    )

    recogidasFiltradas.forEach(recogida => {
      const fecha = new Date(grupo.fecha)

      const clave = groupBy.value === 'daily'
        ? format(fecha, 'yyyy-MM-dd')
        : format(fecha, 'yyyy-MM-01')

      let grupoExistente = resultados.find(g => g.clave === clave)

      if (!grupoExistente) {
        grupoExistente = { clave, items: [] }
        resultados.push(grupoExistente)
      }

      grupoExistente.items.push({ ...recogida, fecha: grupo.fecha })
    })
  })

  // Ordenar de más reciente a más antigua
  resultados.sort((a, b) => new Date(b.clave) - new Date(a.clave))

  return resultados
})


</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">Recogidas</ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>

    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar observación o plataforma..."
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
        @click="crearRecogidaNueva"
      >
        <Plus class="w-4 h-4" />
        Añadir recogida
      </button>
    </div>

    <div v-for="grupo in recogidasFiltradas" :key="grupo.clave" class="space-y-4">
      <div class="flex items-center gap-3 text-sm text-gray-500 font-medium mt-8 mb-2 border-b pb-1">
        <span class="uppercase tracking-wide">{{ formatGrupo(grupo.clave) }}</span>
        <div class="flex-1 border-t border-gray-200"></div>
      </div>

      <div
        v-for="recogida in grupo.items"
        :key="recogida.id"
        class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
      >
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ recogida.plataforma_nombre }} – {{ recogida.cantidad }} recogidas
          </p>
          <p v-if="recogida.observaciones" class="text-xs text-gray-500 mt-1">
            {{ recogida.observaciones }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-emerald-600 bg-emerald-100 px-3 py-1 text-sm rounded-full font-medium">
            {{ recogida.total }} €
          </span>
          <button @click="editarRecogida(recogida)" class="text-gray-500 hover:text-blue-600" title="Editar">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="eliminarRecogida(recogida.id)" class="text-gray-500 hover:text-red-600" title="Eliminar">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <EditDeliveryDrawer
      :tipo="'recogida'"
      :isOpen="isDrawerOpen"
      :entrega="recogidaSeleccionada"
      @close="isDrawerOpen = false"
      @save="guardarRecogida"
    />
  </div>
</template>
