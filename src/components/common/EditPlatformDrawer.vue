<template>
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-50 p-6 overflow-y-auto"
    >
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ localPlataforma.id ? 'Editar plataforma' : 'Añadir plataforma' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="guardarCambios">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              v-model="localPlataforma.nombre"
              type="text"
              class="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Precio entrega</label>
            <input
              v-model.number="localPlataforma.precio_entrega"
              type="number"
              :max="maxPrecioPermitido"
              min="0"
              step="0.01"
              class="w-full border px-3 py-2 rounded-lg"
              required
            />
            <p v-if="entregaExcedida" class="text-xs text-rose-600 mt-1">
              ⚠️ El precio no puede superar los 99.99 €
            </p>
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700">Precio recogida</label>
            <input
              v-model.number="localPlataforma.precio_recogida"
              type="number"
              :max="maxPrecioPermitido"
              min="0"
              step="0.01"
              class="w-full border px-3 py-2 rounded-lg"
              required
            />
            <p v-if="recogidaExcedida" class="text-xs text-rose-600 mt-1">
              ⚠️ El precio no puede superar los 99.99 €
            </p>
          </div>

        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            :disabled="entregaExcedida || recogidaExcedida"
            class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Guardar cambios
          </button>

        </div>
      </form>
    </div>
  </transition>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  plataforma: Object
})

const emit = defineEmits(['close', 'save'])

const localPlataforma = reactive({
  id: null,
  nombre: '',
  precio_entrega: 0,
  precio_recogida: 0
})

const maxPrecioPermitido = 99.99

const entregaExcedida = computed(() => localPlataforma.precio_entrega > maxPrecioPermitido)
const recogidaExcedida = computed(() => localPlataforma.precio_recogida > maxPrecioPermitido)

const guardarCambios = () => {
  emit('save', { ...localPlataforma })
}

watch(() => props.plataforma, (nueva) => {
  if (nueva) {
    Object.assign(localPlataforma, nueva)
  } else {
    Object.assign(localPlataforma, {
      id: null,
      nombre: '',
      precio_entrega: 0,
      precio_recogida: 0
    })
  }
}, { immediate: true })
</script>

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
