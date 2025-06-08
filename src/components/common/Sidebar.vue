<script setup>
import {Cog, User, Network, HandCoins, Download, PackageCheck, LayoutDashboard , Menu, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { onMounted, computed } from 'vue'

const userStore = useUserStore()

defineProps(['isOpen'])
defineEmits(['close'])

onMounted(() => {
  if (!userStore.user || !userStore.profile) {
    userStore.fetchUserData() // <- asegúrate de tenerlo implementado
  }
})

const router = useRouter()

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}

const showAdminLink = computed(() => {
  return userStore.user?.username === 'adrianlpzt' || userStore.profile?.is_admin_panel
})

</script>


<template>
  <aside
    :class="[
      'bg-white border-r shadow-sm fixed top-0 left-0 h-full z-50 transition-transform duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'w-80 md:translate-x-0 md:static md:block'
    ]"
  >

  <!-- Encabezado del logo -->
<div class="h-16 flex items-center justify-center border-b px-4 gap-2">
  <img src="../../assets/img/repartly_sin_fondo.png" alt="Repartly Logo" class="h-8 w-auto" />
</div>


    <!-- Botón cerrar solo en móviles -->
    <div class="md:hidden flex justify-end p-2">
      <!-- Botón cerrar solo en móviles -->
    <button
      @click="$emit('close')"
      class="md:hidden absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-full p-2 shadow transition"
      title="Cerrar menú"
    >
      <X class="w-6 h-6" />
    </button>


    </div>

    <div class="h-16 flex items-center justify-center text-xl border-b">
      {{ userStore.user.first_name + " " + userStore.user.last_name }}
    </div>

    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li><RouterLink to="/dashboard" class="nav-link" @click="$emit('close')"><LayoutDashboard class="w-5 h-5 text-gray-600" />Dashboard</RouterLink></li>
        <li class="text-gray-300">Navegación</li>
        <li><RouterLink to="/entregas" class="nav-link" @click="$emit('close')"><PackageCheck class="w-5 h-5 text-gray-600"/>Entregas</RouterLink></li>
        <li><RouterLink to="/recogidas" class="nav-link" @click="$emit('close')"><Download class="w-5 h-5 text-gray-600"/>Recogidas</RouterLink></li>
        <li><RouterLink to="/gastos" class="nav-link" @click="$emit('close')"><HandCoins class="w-5 h-5 text-gray-600"/>Gastos</RouterLink></li>
        <li><RouterLink to="/plataformas" class="nav-link" @click="$emit('close')"><Network class="w-5 h-5 text-gray-600"/>Plataformas</RouterLink></li>
        <li class="text-gray-300">Configuración</li>
        <li><RouterLink to="/perfil" class="nav-link" @click="$emit('close')"><User class="w-5 h-5 text-gray-600"/>Perfil</RouterLink></li>
        <li><RouterLink to="/configuracion" class="nav-link" @click="$emit('close')"><Cog class="w-5 h-5 text-gray-600"/>Configuración</RouterLink></li>
        <li class="text-gray-300"></li>
        <li v-if="showAdminLink">
          <RouterLink to="/admin/usuarios" class="nav-link" @click="$emit('close')">
            <User class="w-5 h-5 text-gray-600"/> Panel de Usuarios
          </RouterLink>
        </li>    
        <li>
          <button
            @click="logout"
            class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
          >
            <X class="w-5 h-5" />
            Cerrar sesión
          </button>
        </li>  
      </ul>
    </nav>
  </aside>
</template>


<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition;
}
</style>
