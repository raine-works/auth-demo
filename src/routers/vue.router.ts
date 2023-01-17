import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { clientAxios } from '../plugin/axios.plugin'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import NotFound from '../pages/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      private: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach(async (r) => {
  if (r.meta.private) {
    clientAxios.get('/verify').catch(() => {
      router.push('/login')
    })
  }
})
