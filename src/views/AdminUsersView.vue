<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

    <table class="min-w-full border text-sm text-left">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Username</th>
          <th class="p-2 border">Email</th>
          <th class="p-2 border">Estado</th>
          <th class="p-2 border">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="p-2 border">{{ user.id }}</td>
          <td class="p-2 border">{{ user.username }}</td>
          <td class="p-2 border">{{ user.email }}</td>
          <td class="p-2 border">
            <span :class="user.is_active ? 'text-green-600' : 'text-red-600'">
              {{ user.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="p-2 border">
            <button
              @click="toggleUser(user.id)"
              class="px-3 py-1 rounded text-white"
              :class="user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
            >
              {{ user.is_active ? 'Desactivar' : 'Activar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const users = ref([])

const fetchUsers = async () => {
  try {
    const response = await api.get('/users/')
    users.value = response.data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

const toggleUser = async (id) => {
  try {
    const response = await api.post(`/activate_user/${id}/`)
    console.log(response.data)
    // Vuelvo a cargar usuarios para refrescar la tabla
    fetchUsers()
  } catch (error) {
    console.error('Error al activar/desactivar usuario:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
