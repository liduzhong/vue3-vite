import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('../views/register/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('../views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('../views/error/401.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'User',
  //       component: () => import('../views/system/user/index.vue')
  //     },
  //     {
  //       path: 'profile',
  //       name: 'Profile',
  //       component: () => import('../views/system/user/profile/index.vue')
  //     }
  //   ]
  // },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('../views/system/menu/index.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/system/user/index.vue'),
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('../views/system/user/profile/index.vue')
          },
        ]
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
