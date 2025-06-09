<script setup>
import { ref, onMounted } from 'vue'
import ToggleSidebarButton from '../components/common/ToggleSidebarButton.vue'
import PlanStatusBanner from '../components/common/PlanStatusBanner.vue'
import EditProfileModal from '../components/common/EditProfileModal.vue'
import { useUserStore } from '../stores/userStore'

defineEmits(['onToggleSidebar'])

const userStore = useUserStore()
const isEditing = ref(false)
const isReady = ref(false)

const avatarImages = {
  "avatar1.png": new URL('@/assets/avatars/avatar1.png', import.meta.url).href,
  "avatar2.png": new URL('@/assets/avatars/avatar2.png', import.meta.url).href,
  "avatar3.png": new URL('@/assets/avatars/avatar3.png', import.meta.url).href,
  "avatar4.png": new URL('@/assets/avatars/avatar4.png', import.meta.url).href,
  "avatar5.png": new URL('@/assets/avatars/avatar5.png', import.meta.url).href,
  "avatar6.png": new URL('@/assets/avatars/avatar6.png', import.meta.url).href,
}

onMounted(async () => {
  try {
    await userStore.fetchUserData()
  } catch (e) {
    console.error("❌ Error cargando el perfil:", e)
  } finally {
    isReady.value = true
  }
})
</script>

<template>
  <div class="space-y-6 max-w-3xl mx-auto">

    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <ToggleSidebarButton @onToggleSidebar="$emit('onToggleSidebar')">Perfil</ToggleSidebarButton>
      <!-- <PlanStatusBanner /> -->
    </div>

    <!-- Fallback mientras se carga -->
    <div v-if="!isReady" class="text-center text-gray-400 mt-10">
      Cargando perfil...
    </div>

    <!-- Tarjeta de perfil -->
    <div v-else-if="userStore.profile && userStore.user" class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div class="flex items-center gap-4">
        <img
          :src="avatarImages[userStore.profile.avatar] || avatarImages['avatar1.png']"
          alt="Avatar"
          class="w-16 h-16 rounded-full border border-emerald-300 object-cover"
        />
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ userStore.user.first_name + " " + userStore.user.last_name }}</h2>
          <p class="text-sm text-gray-500">
            Plan:
            <span class="font-medium">
              {{ userStore.profile.is_premium ? 'Premium' : 'Gratis' }}
            </span>
          </p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500">Email</label>
          <p class="text-sm text-gray-800">{{ userStore.user.email || 'usuario@ejemplo.com' }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500">Teléfono</label>
          <p class="text-sm text-gray-800">{{ userStore.profile.telefono || 'No especificado' }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500">Fecha nacimiento</label>
          <p class="text-sm text-gray-800">
            {{ userStore.profile.fecha_nacimiento ? new Date(userStore.profile.fecha_nacimiento).toLocaleDateString('es-ES') : 'Sin especificar' }}
          </p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500">NIF</label>
          <p class="text-sm text-gray-800">{{ userStore.profile.nif || 'Sin especificar' }}</p>
        </div>
      </div>

      <div class="mt-6">
        <button
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          @click="isEditing = true"
        >
          Editar perfil
        </button>
      </div>
    </div>

    <!-- Modal de edición -->
    <EditProfileModal
      :isOpen="isEditing"
      @close="isEditing = false"
    />
  </div>
</template>
