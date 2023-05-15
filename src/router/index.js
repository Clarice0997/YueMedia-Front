import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由
import introduction from '@/views/Introduction/index.vue'
import login from '@/views/Login'
import notFound from '@/views/NotFound/index.vue'
import { getCookie } from '@/utils/cookie'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'introduction',
    component: introduction
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    redirect: '/login/login',
    beforeEnter: async (to, from, next) => {
      // 独享路由守卫 登录状态则无需登录
      const token = await getCookie('Access-Token')
      if (token) {
        Message({
          message: '用户已登录，无需登录',
          type: 'warning',
          duration: 1500
        })
        next('/home')
      } else {
        next()
      }
    },
    children: [
      {
        path: 'login',
        component: () => import(/* webpackChunkName: "loginComponent" */ '@/components/login/loginForm.vue'),
        meta: {
          title: '登录页面'
        }
      },
      {
        path: 'register',
        component: () => import(/* webpackChunkName: "registerComponent" */ '@/components/login/registerForm.vue'),
        meta: {
          title: '注册页面'
        }
      }
    ]
  },
  {
    path: '/404',
    name: 'notFound',
    component: notFound
  }
]

const router = new VueRouter({
  routes
})

export default router
