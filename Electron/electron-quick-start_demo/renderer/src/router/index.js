import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: '首页',
    component: Home
  },
  {
    path: '/IPC',
    name: 'IPC',
    component: () => import('@/views/IPC.vue')
  },
  {
    path: '/Remote',
    name: 'Remote',
    component: () => import('@/views/Remote.vue')
  },
  {
    path: '/WebFrame',
    name: 'WebFrame',
    component: () => import('@/views/WebFrame.vue')
  },
  {
    path: '/DesktopCapturer',
    name: 'DesktopCapturer',
    component: () => import('@/views/DesktopCapturer.vue')
  },
  {
    path: '/Clipboard',
    name: 'Clipboard',
    component: () => import('@/views/Clipboard.vue')
  },
  {
    path: '/Shell',
    name: 'Shell',
    component: () => import('@/views/Shell.vue')
  },
  {
    path: '/Dialog',
    name: 'Dialog',
    component: () => import('@/views/Dialog.vue')
  },
  {
    path: '/other',
    name: '其他',
    component: () => import('@/views/other.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router