<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { initAfterLogin } from '../composables/useAppInitializer'
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
    // 1. Obtener tokens
    const { data } = await api.post('/token/', {
      username: username.value,
      password: password.value
    })

    const access = data.access
    const refresh = data.refresh

    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)

    // 2. Obtener datos del usuario
    const me = await api.get('/me/', {
      headers: {
        Authorization: `Bearer ${access}`
      }
    })

    const { user, profile, plataformas, entregas, recogidas, gastos } = me.data

    // 3. Guardar datos en los stores
    auth.setToken(access, refresh)
    platformStore.setPlataformas(plataformas)
    collectionStore.setCollections(recogidas)
    deliveryStore.setDeliveries(entregas)
    expensesStore.setExpenses(gastos)
    userStore.setUser(user)
    userStore.setProfile(profile)

    // 4. Redirigir al dashboard
    router.push('/dashboard')

  } catch (error) {
    console.error('❌ Error de login:', error)
    mensajeError.value = 'Credenciales incorrectas o servidor no disponible.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <img src="../assets/img/repartly_sin_fondo.png" alt="Repartly logo" class="mb-5 mx-auto" />
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Usuario</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <p v-if="mensajeError" class="text-red-500 text-sm">{{ mensajeError }}</p>
        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold"
        >
          {{ cargando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>
