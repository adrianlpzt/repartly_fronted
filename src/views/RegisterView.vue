<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4 py-12">
    <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden">
      <img
        src="../assets/img/repartly_sin_fondo.png"
        alt="Logo Repartly"
        class="mx-auto mb-6 w-28 md:w-36 animate-fade-in"
      />
      <h1 class="text-3xl font-extrabold text-blue-800 text-center mb-4">Únete a Repartly</h1>
      <p class="text-center text-gray-600 mb-8">Control total de tus repartos, ingresos y gastos</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm text-gray-600" for="first_name">Nombre</label>
            <input v-model="form.first_name" id="first_name" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label class="block mb-1 text-sm text-gray-600" for="last_name">Apellidos</label>
            <input v-model="form.last_name" id="last_name" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm text-gray-600" for="telefono">Teléfono</label>
            <input v-model="form.telefono" id="telefono" type="tel" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label class="block mb-1 text-sm text-gray-600" for="nif">NIF</label>
            <input v-model="form.nif" id="nif" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm text-gray-600" for="username">Nombre de usuario</label>
          <input v-model="form.username" id="username" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
          <input
            v-model="form.fecha_nacimiento"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm text-gray-600" for="email">Correo electrónico</label>
          <input v-model="form.email" id="email" type="email" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm text-gray-600" for="password">Contraseña</label>
            <input v-model="form.password" id="password" type="password" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label class="block mb-1 text-sm text-gray-600" for="confirm">Confirmar contraseña</label>
            <input v-model="form.confirm" id="confirm" type="password" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
        <p v-if="mensajeExito" class="text-green-600 text-sm text-center font-medium">
            {{ mensajeExito }}
        </p>


        <button type="submit" class="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
          Solicitar acceso
        </button>
        <p v-if="success" class="text-green-600 text-sm text-center mt-4">
        ✅ Tu solicitud se ha enviado correctamente. En breves revisaremos tu cuenta y podrás comenzar a usar Repartly.
        </p>
      </form>

      <p class="text-sm text-gray-600 text-center mt-6">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="text-blue-600 font-semibold hover:underline">Inicia sesión</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const mensajeExito = ref('')
const success = ref(false)


const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirm: '',
  first_name: '',
  last_name: '',
  telefono: '',
  nif: '',
  fecha_nacimiento: ''
})


const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  if (form.value.password !== form.value.confirm) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    const response = await fetch('https://repartly-backend.onrender.com/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        password2: form.value.confirm,
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        telefono: form.value.telefono,
        nif: form.value.nif,
        fecha_nacimiento: form.value.fecha_nacimiento
      })

    })

    if (!response.ok) {
      const errData = await response.json()
      error.value = Object.values(errData).flat().join(' ')
      return
    }

    // ✅ Registro exitoso, mostramos aviso
    success.value = true
  } catch (err) {
    error.value = err.message || 'Error inesperado.'
  }
}


</script>

<style scoped>
input::placeholder {
  color: #a0aec0;
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
