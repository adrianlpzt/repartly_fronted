<script setup>
import { ref } from 'vue'
import { usePlatformStore } from '../stores/platformStore'
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import EditPlatformDrawer from '../components/common/EditPlatformDrawer.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'

import { onMounted } from 'vue'

onMounted(() => {
  platformStore.fetchPlataformas()
})


defineEmits(['onToggleSidebar'])

const platformStore = usePlatformStore()
const isDrawerOpen = ref(false)
const plataformaSeleccionada = ref(null)

const editarPlataforma = (plataforma) => {
  plataformaSeleccionada.value = { ...plataforma }
  isDrawerOpen.value = true
}

const eliminarPlataforma = async (id) => {
  await platformStore.eliminarPlataforma(id)
}


const nuevaPlataforma = () => {
  plataformaSeleccionada.value = {
    id: null,
    nombre: '',
    precio_entrega: 0,
    precio_recogida: 0
  }
  isDrawerOpen.value = true
}

const guardarPlataforma = (plataforma) => {
  if (plataforma.id) {
    platformStore.actualizarPlataforma(plataforma)
  } else {
    platformStore.añadirPlataforma(plataforma)
  }
  isDrawerOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">
        Plataformas
      </ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>

    <!-- Botón añadir -->
    <div class="flex justify-start">
      <button
        class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
        @click="nuevaPlataforma"
      >
        <Plus class="w-4 h-4" />
        Añadir plataforma
      </button>
    </div>

    <!-- Listado -->
    <div class="grid gap-4">
      <div
        v-for="plataforma in platformStore.plataformas"
        :key="plataforma.id"
        class="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition group"
      >
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition">
            {{ plataforma.nombre }}
          </h3>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-medium">
              📦 Entrega: {{ parseFloat(plataforma.precio_entrega || 0).toFixed(2) }} €
            </span>
            <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">
              📥 Recogida: {{ parseFloat(plataforma.precio_recogida || 0).toFixed(2) }} € 
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button @click="editarPlataforma(plataforma)" class="text-gray-500 hover:text-blue-600 transition" title="Editar">
            <Edit class="w-5 h-5" />
          </button>
          <button @click="eliminarPlataforma(plataforma.id)" class="text-gray-500 hover:text-red-600 transition" title="Eliminar">
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Drawer lateral -->
    <EditPlatformDrawer
      :isOpen="isDrawerOpen"
      :plataforma="plataformaSeleccionada"
      @close="isDrawerOpen = false"
      @save="guardarPlataforma"
    />
  </div>
</template>
