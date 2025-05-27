<script setup>
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

defineEmits(['onToggleSidebar'])
const router = useRouter()
const userStore = useUserStore()

function cerrarSesion() {
  userStore.clearUser()
  localStorage.removeItem('accessToken')
  router.push('/login')
}
</script>

<template>
  <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">Configuración</ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>
  <div class="space-y-6 max-w-3xl mx-auto mt-6">
    <!-- Sección: Soporte -->
    <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Soporte técnico</h2>
      <p class="text-sm text-gray-600">¿Tienes algún problema o sugerencia?</p>
      <p class="text-sm">
        Puedes contactar con nosotros en:
        <a href="mailto:soporte@repartly.app" class="text-emerald-600 font-medium hover:underline">soporte@repartly.app</a>
      </p>
    </div>

    <!-- Sección: Idioma -->
    <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Idioma</h2>
      <select class="w-full border px-3 py-2 rounded-lg text-sm text-gray-700">
        <option>Español</option>
        <option disabled>Inglés (próximamente)</option>
      </select>
    </div>

    <!-- Sección: Legal -->
    <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Legal</h2>
      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
        <li><a href="#" class="hover:underline">Política de privacidad</a></li>
        <li><a href="#" class="hover:underline">Términos y condiciones</a></li>
      </ul>
    </div>

    <!-- Cerrar sesión -->
    <div class="text-center">
      <button
        @click="cerrarSesion"
        class="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</template>
