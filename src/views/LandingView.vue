<template>
  <div>
<!-- HERO PRINCIPAL -->
    <section class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-blue-800 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-blue-100 to-white opacity-20 animate-fade-in"></div>
      <div class="z-10 flex flex-col items-center">
        <img src="../assets/img/repartly_sin_fondo.png" alt="Logo repartly" class="mx-auto max-w-xs md:max-w-sm mb-6 animate-fade-in" />
        <h1 class="text-3xl md:text-5xl font-extrabold animate-fade-in text-center">
          Claridad financiera para repartidores
        </h1>
        <p class="max-w-xl text-lg text-gray-700 mt-4 mb-8 animate-fade-in-up text-center">
          CControla entregas, gastos, ganancias y facturación desde un panel intuitivo y accesible desde cualquier dispositivo.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <RouterLink
            to="/login"
            class="bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow hover:scale-105 transition duration-300"
          >
            Iniciar sesión
          </RouterLink>
          <RouterLink
            to="/register"
            class="bg-black text-white font-semibold px-6 py-3 rounded-xl shadow hover:scale-105 transition duration-300"
          >
            Solicitar acceso
          </RouterLink>
        </div>
      </div>
    </section>


    <!-- QUÉ HACE REPARTLY -->
    <section class="py-24 px-6 bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      <div class="max-w-5xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-extrabold mb-4 text-blue-900">¿Qué puedes hacer con Repartly?</h2>
        <p class="text-lg text-gray-600">Diseñada para ayudarte a controlar cada céntimo de tu día a día como repartidor</p>
      </div>

      <div class="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div class="scroll-fade bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 class="text-xl font-bold mb-2">📦 Entregas & Recogidas</h3>
          <p>Registra tus paquetes al instante y ajusta tarifas según cada plataforma. Todo tu trabajo, perfectamente organizado.</p>
        </div>
        <div class="scroll-fade bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 class="text-xl font-bold mb-2">💰 Control de gastos</h3>
          <p>Registra gasolina, multas o reparaciones y descuéntalas automáticamente de tus ingresos para conocer tu beneficio real.</p>
        </div>
        <div class="scroll-fade bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 class="text-xl font-bold mb-2">📊 Dashboard inteligente</h3>
          <p>Consulta estadísticas por día, semana o mes, y visualiza tu evolución con gráficos comparativos y resúmenes claros.</p>
        </div>
        <div class="scroll-fade bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 class="text-xl font-bold mb-2">🧾 Facturas automáticas</h3>
          <p>Genera facturas mensuales con desglose de IVA. Perfectas para entregar a tu gestor o incluir en tu declaración.</p>
        </div>
        <div class="scroll-fade bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 class="text-xl font-bold mb-2">👤 Perfil personalizado</h3>
          <p>Edita tu información, selecciona plataformas activas y personaliza tus tarifas con solo unos clics.</p>
        </div>
        <div class="scroll-fade bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 class="text-xl font-bold mb-2">📱 100% Responsive</h3>
          <p>Desde el móvil, tablet o PC. Diseñada para usarse fácilmente incluso mientras trabajas o estás en ruta.</p>
        </div>
      </div>
    </section>

    <!-- SIMULACIÓN DE DASHBOARD -->
  <section class="bg-white py-20 text-center">
    <div class="max-w-5xl mx-auto px-4 scroll-fade">
      <h2 class="text-2xl font-bold mb-8 text-blue-800">Vista previa del Dashboard</h2>
      <div class="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm md:text-base">
          <div class="bg-gray-50 rounded-lg p-4 shadow">
            <p class="text-gray-500">Entregas del mes</p>
            <p ref="entregas" class="text-2xl font-semibold text-green-600">0</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 shadow">
            <p class="text-gray-500">Recogidas del mes</p>
            <p ref="recogidas" class="text-2xl font-semibold text-blue-600">0</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 shadow">
            <p class="text-gray-500">Ingresos del mes</p>
            <p ref="ingresos" class="text-2xl font-semibold text-gray-800">0 €</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 shadow">
            <p class="text-gray-500">Gastos del mes</p>
            <p ref="gastos" class="text-2xl font-semibold text-red-600">0 €</p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow text-center">
          <p class="text-sm uppercase tracking-wide">Beneficio neto mensual</p>
          <p ref="beneficio" class="text-3xl font-bold mt-2">0 €</p>
        </div>

        <div class="text-right">
          <button class="bg-blue-700 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition">
            Descargar factura en PDF
          </button>
        </div>
      </div>
    </div>
  </section>

    <!-- TESTIMONIO / LLAMADA FINAL -->
    <section class="py-20 px-6 bg-gradient-to-b from-blue-100 to-blue-50 text-center">
      <div class="max-w-3xl mx-auto scroll-fade">
        <p class="text-xl italic text-blue-900">“Gracias a Repartly por fin sé cuánto gano realmente y en qué se me va el dinero.”</p>
        <p class="mt-4 font-semibold text-gray-800">– Un repartidor satisfecho</p>
        <RouterLink
          to="/register"
          class="inline-block mt-8 bg-blue-700 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition"
        >
          Únete a Repartly hoy mismo
        </RouterLink>
      </div>
    </section>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'

const entregas = ref(null)
const recogidas = ref(null)
const ingresos = ref(null)
const gastos = ref(null)
const beneficio = ref(null)

function animateNumber(el, end, isCurrency = false) {
  let current = 0
  const duration = 1200
  const increment = end / (duration / 16)

  const step = () => {
    current += increment
    if (current >= end) {
      current = end
    }
    el.innerText = isCurrency
      ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(current)
      : Math.floor(current)
    if (current < end) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  // Animaciones scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0')
        // Si es el dashboard, disparar animaciones numéricas
        if (entry.target.contains(entregas.value)) {
          animateNumber(entregas.value, 122)
          animateNumber(recogidas.value, 89)
          animateNumber(ingresos.value, 1045, true)
          animateNumber(gastos.value, 312, true)
          animateNumber(beneficio.value, 733, true)
        }
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.scroll-fade').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700')
    observer.observe(el)
  })
})
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in 1.2s ease-out forwards;
  transform: translateY(10px);
}
</style>

<script>
export default {
  metaInfo: {
    title: 'Repartly – Control total para repartidores',
    meta: [
      { name: 'description', content: 'La herramienta definitiva para repartidores: controla tus entregas, ingresos, gastos y facturas desde una sola plataforma. Optimizada para móviles y pensada para trabajadores reales. Únete ya a Repartly.app' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'utf-8' }
    ]
  }
}
</script>

