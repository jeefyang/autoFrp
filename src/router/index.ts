import { createRouter, createWebHistory } from 'vue-router'
import MainMsgView from "@/views/MainMsgView.vue"
import ProxyListView from "@/views/ProxyListView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainMsgView
    },
    {
      path: '/list',
      name: 'list',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ProxyListView
    }
  ]
})

export default router
