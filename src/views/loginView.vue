<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <img src="../assets/img/repartly_sin_fondo.png" alt="Repartly logo" class="mb-6 mx-auto w-32 md:w-40" />
      <h1 class="text-xl font-bold text-center text-blue-800 mb-6">Bienvenido de nuevo</h1>
      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p v-if="mensajeError" class="text-red-500 text-sm text-center">{{ mensajeError }}</p>
        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-blue-700 hover:bg-blue-800 transition text-white py-2 rounded-lg font-semibold shadow-md"
        >
          {{ cargando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Enlace a registro -->
      <p class="mt-6 text-sm text-center text-gray-600">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="text-blue-600 hover:underline font-semibold">
          Regístrate aquí
        </RouterLink>
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { usePlatformStore } from '../stores/platformStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useDeliveryStore } from '../stores/deliveryStore'
import { useExpensesStore } from '../stores/expensesStore'

const auth = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const collectionStore = useCollectionStore()
const deliveryStore = useDeliveryStore()
const expensesStore = useExpensesStore()
const platformStore = usePlatformStore()

const username = ref('')
const password = ref('')
const mensajeError = ref('')
const cargando = ref(false)

const login = async () => {
  if (!username.value || !password.value) {
    mensajeError.value = 'Introduce usuario y contraseña'
    return
  }

  cargando.value = true
  mensajeError.value = ''

  try {
    const { data } = await api.post('/token/', {
      username: username.value,
      password: password.value
    })

    const access = data.access
    const refresh = data.refresh

    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)

    const me = await api.get('/me/', {
      headers: {
        Authorization: `Bearer ${access}`
      }
    })

    const { user, profile, plataformas, entregas, recogidas, gastos } = me.data

    auth.setToken(access, refresh)
    platformStore.setPlataformas(plataformas)
    collectionStore.setCollections(recogidas)
    deliveryStore.setDeliveries(entregas)
    expensesStore.setExpenses(gastos)
    userStore.setUser(user)
    userStore.setProfile(profile)

    router.push('/dashboard')
  } catch (error) {
    console.error('❌ Error de login:', error)
    mensajeError.value = 'Credenciales incorrectas o servidor no disponible.'
  } finally {
    cargando.value = false
  }
}
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>
