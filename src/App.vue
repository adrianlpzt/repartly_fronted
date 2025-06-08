<template>
  <div class="flex">
    <!-- Sidebar solo si no estamos en /login -->
    <Sidebar
  v-if="!['/login', '/register', '/'].includes($route.path)"
  :isOpen="sidebarOpen"
  @close="sidebarOpen = false"
/>

    <!-- Contenido principal -->
    <main :class="['w-full min-h-screen bg-gray-50 transition-all', 
  !['/login', '/register', '/'].includes($route.path) ? 'p-6' : 'p-0']">
      <router-view v-slot="{ Component }">
        <component :is="Component" @onToggleSidebar="sidebarOpen = !sidebarOpen" />
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/common/Sidebar.vue'

const sidebarOpen = ref(false)
const route = useRoute()

const isLogin = computed(() => route.path === '/login')
</script>
