<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h1>

    <!-- Contenedor responsivo -->
    <div class="overflow-x-auto rounded shadow">
      <table class="min-w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
        <thead class="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th scope="col" class="p-3 border">ID</th>
            <th scope="col" class="p-3 border">Username</th>
            <th scope="col" class="p-3 border">Email</th>
            <th scope="col" class="p-3 border">Estado</th>
            <th scope="col" class="p-3 border text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="p-3 border">{{ user.id }}</td>
            <td class="p-3 border font-medium">{{ user.username }}</td>
            <td class="p-3 border">{{ user.email }}</td>
            <td class="p-3 border">
              <span
                class="inline-block px-2 py-1 text-xs font-semibold rounded"
                :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ user.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="p-3 border text-center">
              <button
                @click="toggleUser(user.id)"
                class="px-4 py-2 text-sm font-semibold rounded shadow focus:outline-none focus:ring transition"
                :class="user.is_active
                  ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300'
                  : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300'"
              >
                {{ user.is_active ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

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
    fetchUsers()
  } catch (error) {
    console.error('Error al activar/desactivar usuario:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
