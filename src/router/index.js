import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import DeliveriesView from '../views/DeliveriesView.vue'
import CollectionsView from '../views/CollectionsView.vue'
import ExpensesView from '../views/ExpensesView.vue'
import PlatformsView from '../views/PlatformsView.vue'
import ProfileView from '../views/ProfileView.vue'
import Login from '../views/loginView.vue'
import ConfigView from '../views/configView.vue'


const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', component: DashboardView, meta: { requiereAuth: true }, },
  { path: '/entregas', component: DeliveriesView, meta: { requiereAuth: true }, },
  { path: '/recogidas', component: CollectionsView, meta: { requiereAuth: true }, },
  { path: '/gastos', component: ExpensesView, meta: { requiereAuth: true }, },
  { path: '/plataformas', component: PlatformsView, meta: { requiereAuth: true }, },
  { path: '/perfil', component: ProfileView, meta: { requiereAuth: true }, },
  { path: '/configuracion', component: ConfigView, meta: { requiereAuth: true }, },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken')
  if (to.meta.requiereAuth && !isAuthenticated) {
    next('/login')
  } else {

    next()
  }
})

export default router
