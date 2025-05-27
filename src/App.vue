<template>
  <div class="flex">
    <!-- Sidebar solo si no estamos en /login -->
    <Sidebar v-if="!isLogin" :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Contenido principal -->
    <main class="w-full min-h-screen bg-gray-50 p-6 transition-all">
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

import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { isTokenExpired } from './utils/jwt';


const sidebarOpen = ref(false)
const route = useRoute()

const isLogin = computed(() => route.path === '/login')
</script>
