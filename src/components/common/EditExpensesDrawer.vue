<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  gasto: Object
})

const emit = defineEmits(['close', 'save'])

const maxFecha = new Date().toISOString().split('T')[0]
const conceptosBase = ['Gasolina', 'Parking', 'Multa', 'Otros']

const localGasto = reactive({
  id: null,
  concepto: '',
  cantidad: 0,
  fecha: maxFecha,
  observaciones: ''
})

watch(() => props.gasto, (nuevo) => {
  if (nuevo) {
    Object.assign(localGasto, nuevo)
  } else {
    Object.assign(localGasto, {
      id: null,
      concepto: '',
      cantidad: 0,
      fecha: maxFecha,
      observaciones: ''
    })
  }
}, { immediate: true })

const guardar = () => {
  emit('save', { ...localGasto })
}

const maxCantidadPermitida = 9999.99

const cantidadExcedida = computed(() => {
  return localGasto.cantidad > maxCantidadPermitida
})


</script>

<template>
  <transition name="slide">
    <div v-if="isOpen" class="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ localGasto.id ? 'Editar gasto' : 'Añadir gasto' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>

      <form @submit.prevent="guardar" class="space-y-4">
        <div>
          <label class="text-sm font-medium">Concepto</label>
          <select v-model="localGasto.concepto" class="w-full border px-3 py-2 rounded-lg">
            <option disabled value="">Selecciona una opción</option>
            <option v-for="opcion in conceptosBase" :key="opcion" :value="opcion">{{ opcion }}</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium">Importe</label>
          <input
            v-model.number="localGasto.cantidad"
            type="number"
            min="0"
            :max="maxCantidadPermitida"
            step="0.01"
            class="w-full border px-3 py-2 rounded-lg"
            required
          />
          <p v-if="cantidadExcedida" class="text-xs text-rose-600 mt-1">
            ⚠️ El importe máximo permitido es 9.999,99 €
          </p>
        </div>


        <div>
          <label class="text-sm font-medium">Fecha</label>
          <input type="date" v-model="localGasto.fecha" :max="maxFecha" class="w-full border px-3 py-2 rounded-lg" required />
        </div>

        <div>
          <label class="text-sm font-medium">Observaciones</label>
          <textarea v-model="localGasto.observaciones" class="w-full border px-3 py-2 rounded-lg" rows="2" />
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="cantidadExcedida"
            class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </transition>
</template>