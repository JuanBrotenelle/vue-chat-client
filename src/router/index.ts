import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth.vue')
    },
    {
      path: '/',
      name: 'chat',
      component: () => import('../views/Main.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        userStore.isAuthenticated === true ? next() : next("/auth");
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        userStore.isAuthenticated === true ? userStore.role === "admin" ? next() : next("/") : next("/auth");
      }
    },
    
  ]
})

export default router
