<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useUserStore } from '../../stores/userStore'

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['close'])

const userStore = useUserStore()

const formData = reactive({
  first_name: '',
  last_name: '',
  email: '',
  avatar: '',
  telefono: '',
  fecha_nacimiento: '',
  nif: ''
})

if (open && userStore.user && userStore.profile) {
  Object.assign(formData, {
    first_name: userStore.user.first_name || '',
    last_name: userStore.user.last_name || '',
    email: userStore.user.email || '',
    avatar: userStore.profile.avatar || '',
    telefono: userStore.profile.telefono || '',
    fecha_nacimiento: userStore.profile.fecha_nacimiento || '',
    nif: userStore.profile.nif || '',
  })
}



const avatars = [
  'avatar1.png',
  'avatar2.png',
  'avatar3.png',
  'avatar4.png',
  'avatar5.png',
  'avatar6.png'
]

// Rellenar datos cuando se abre el modal
watch(() => props.isOpen, (open) => {
  if (open && userStore.user && userStore.profile) {
    Object.assign(formData, {
      email: userStore.user.email || '',
      avatar: userStore.profile.avatar || '',
      telefono: userStore.profile.telefono || '',
      fecha_nacimiento: userStore.profile.fecha_nacimiento || ''
    })
  }
}, { immediate: true })

const getAvatarPath = (avatar) =>
  new URL(`../../assets/avatars/${avatar}`, import.meta.url).href

async function guardarCambios() {
  try {
    // 1. Actualiza nombre y apellido del usuario
    await userStore.updateUser({
      first_name: formData.first_name,
      last_name: formData.last_name
    })

    // 2. Actualiza el perfil
    await userStore.updateProfile({
      email: formData.email,
      avatar: formData.avatar,
      telefono: formData.telefono,
      fecha_nacimiento: formData.fecha_nacimiento,
      nif: formData.nif 
    })

    emit('close')
  } catch (err) {
    console.error('❌ Error al guardar cambios de perfil:', err)
  }
}

</script>


<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <!-- Cerrar -->
        <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          &times;
        </button>

        <h2 class="text-xl font-semibold text-gray-800 mb-4">Editar perfil</h2>

        <form @submit.prevent="guardarCambios" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="formData.first_name" type="text" class="w-full px-3 py-2 border rounded-lg" />
          </div>

          <!-- Apellidos -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Apellidos</label>
            <input v-model="formData.last_name" type="text" class="w-full px-3 py-2 border rounded-lg" />
          </div>


          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="formData.email" type="email" class="w-full px-3 py-2 border rounded-lg" required />
          </div>

          <!-- Avatar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <div class="grid grid-cols-4 gap-3">
              <img
                v-for="avatar in avatars"
                :key="avatar"
                :src="getAvatarPath(avatar)"
                :alt="avatar"
                class="w-16 h-16 rounded-full border cursor-pointer hover:ring-2 hover:ring-emerald-500"
                :class="formData.avatar === avatar ? 'ring-2 ring-emerald-600' : ''"
                @click="formData.avatar = avatar"
              />
            </div>
            <div class="mb-4">
              <label for="nif" class="block text-sm font-medium text-gray-700">NIF</label>
              <input
                v-model="formData.nif"
                type="text"
                id="nif"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Ej. 12345678A"
              />
            </div>
          </div>

          <!-- Botón -->
          <div class="pt-4 text-right">
            <button
              type="submit"
              class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
