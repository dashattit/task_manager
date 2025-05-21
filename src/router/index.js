import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import Login from '@/components/Auth/Login.vue'
import Register from '@/components/Auth/Register.vue'
import { LocalStorageService } from '@/utils/localStorageService'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    component: AuthView,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'register',
        name: 'register',
        component: Register
      }
    ]
  },
  {
    path: '/register',
    redirect: '/auth/register'
  },
  {
    path: '/login',
    redirect: '/auth/login'
  },

  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = token && LocalStorageService.getCurrentUser(token)

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth/login')
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

