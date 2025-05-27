<script setup>
import { reactive, watch, computed, onMounted } from 'vue'
import { usePlatformStore } from '../../stores/platformStore'

onMounted(() => {
  platformStore.fetchPlataformas()
})

const props = defineProps({
  isOpen: Boolean,
  entrega: Object,
  tipo: {
    type: String,
    default: 'entrega'  // puede ser 'entrega' o 'recogida'
  }
})

const emit = defineEmits(['close', 'save'])
const platformStore = usePlatformStore()

const localEntrega = reactive({
  id: null,
  plataforma: '',
  cantidad: 1,
  fecha: new Date().toISOString().split('T')[0],
  observaciones: '',
  total: 0
})

const maxFecha = new Date().toISOString().split('T')[0]

watch(() => props.entrega, (nueva) => {
  if (nueva) {
    Object.assign(localEntrega, nueva)
  } else {
    Object.assign(localEntrega, {
      id: null,
      plataforma: '',
      cantidad: 1,
      fecha: new Date().toISOString().split('T')[0],
      observaciones: '',
      total: 0
    })
  }
}, { immediate: true })

const totalCalculado = computed(() => {
  return props.tipo === 'recogida'
    ? Number(localEntrega.cantidad) * platformStore.getPrecioRecogida(localEntrega.plataforma)
    : Number(localEntrega.cantidad) * platformStore.getPrecioEntrega(localEntrega.plataforma)
})

function guardarCambios() {

  emit('save', {
  ...localEntrega,
  total: totalCalculado.value
})
}

const maxCantidadPermitida = computed(() => {
  const plataforma = platformStore.plataformas.find(p => p.id === localEntrega.plataforma)
  if (!plataforma) return 999

  const precio = props.tipo === 'recogida'
    ? plataforma.precio_recogida
    : plataforma.precio_entrega

  return precio > 0 ? Math.floor(9999.99 / precio) : 999
})

const cantidadExcedida = computed(() => {
  return localEntrega.cantidad > maxCantidadPermitida.value
})


</script>

<template>
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-50 p-6 overflow-y-auto"
    >
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ localEntrega.id ? `Editar ${tipo}` : `Añadir ${tipo}` }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="guardarCambios">
        <div class="space-y-4">
          <!-- Plataforma -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Plataforma</label>
            <select
              v-model="localEntrega.plataforma"
              class="w-full border px-3 py-2 rounded-lg"
              required
            >
              <option value="" disabled>Selecciona una plataforma</option>
              <option
                v-for="plataforma in platformStore.plataformas"
                :key="plataforma.id"
                :value="plataforma.id"
              >
                {{ plataforma.nombre }}
              </option>
            </select>
          </div>

          <!-- Cantidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              v-model.number="localEntrega.cantidad"
              type="number"
              :max="maxCantidadPermitida"
              min="1"
              class="w-full border px-3 py-2 rounded-lg"
              required
            />
            <p v-if="cantidadExcedida" class="text-xs text-rose-600 mt-1">
              ⚠️ La cantidad supera el límite permitido por el sistema.
            </p>
          </div>


          <!-- Fecha -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              v-model="localEntrega.fecha"
              type="date"
              class="w-full border px-3 py-2 rounded-lg"
              :max="maxFecha"
              required
            />
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              v-model="localEntrega.observaciones"
              class="w-full border px-3 py-2 rounded-lg"
              rows="3"
            />
          </div>

          <!-- Total -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Total</label>
            <input
              :value="totalCalculado.toFixed(2) + ' €'"
              disabled
              class="w-full border px-3 py-2 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <!-- Botón -->
        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            :disabled="cantidadExcedida"
            class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Guardar {{ tipo }}
          </button>
        </div>
      </form>
    </div>
  </transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
