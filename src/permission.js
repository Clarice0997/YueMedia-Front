// import modules
import router from './router'
import { getCookie, setCookie, deleteCookie } from '@/utils/cookie'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { verify, getProfile } from '@/apis/loginAPI'
import { getRoutesAPI } from '@/apis/routesAPI'
import store from './store'
import { findRoutePath, routeHandle } from '@/utils/routeHandle'
import { refreshTokenAPI } from '@/apis/userAPI'

// 配置Nprogress项 关闭右上角螺旋加载提示
NProgress.configure({ showSpinner: false })

// 全局路由前置 （鉴权）
router.beforeEach(async (to, from, next) => {
  // 启动 NProgress 加载
  NProgress.start()

  // 判断是否存在 Token
  let hasToken = await getCookie('Access-Token')

  // 如果不存在 Token，尝试从 localStorage 中获取
  if (!hasToken) {
    let localToken = localStorage.getItem('Access-Token')
    if (localToken) {
      hasToken = localToken
      await setCookie('Access-Token', localToken)
    }
  }

  // 如果不存在 Access-Token，则尝试无感刷新
  if (!hasToken) {
    let refreshToken = await getCookie('Refresh-Token')
    if (refreshToken) {
      await refreshTokenAPI()
      return next()
    }
  }

  // 判断 Token 是否有效，失效则清空 Token
  if (hasToken) {
    try {
      await verify()
    } catch ({ response }) {
      if (response.data.code !== 200) {
        await deleteCookie('Access-Token')
        await localStorage.removeItem('Access-Token')
        await store.dispatch('dynamicRoutes/asyncClearRoutes')
        return next('/login/login')
      }
    }
  }

  // 判断跳转界面是否需要权限
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (hasToken) {
      // 存在 Token 则放行，否则跳转登录页
      NProgress.done()
      return next()
    } else {
      Message({
        message: '登录已过期，请重新登录',
        type: 'error',
        duration: 1500
      })
      await store.dispatch('dynamicRoutes/asyncClearRoutes')
      NProgress.done()
      return next('/login/login')
    }
  }

  // 判断 Vuex 中是否存在路由数据（处于登录状态）
  if (store.getters['dynamicRoutes/getDynamicRoutes'].length === 0 && getCookie('Access-Token')) {
    // 获取动态路由菜单
    const {
      data: { routes }
    } = await getRoutesAPI()
    // 处理返回路由对象
    const Routes = await routes.map(route => {
      const originRoute = {
        path: route.path,
        name: route.name,
        redirect: route.redirect ? route.redirect : undefined,
        component: () => import(`@/${route.component}`),
        meta: JSON.parse(route.meta),
        children: []
      }
      // 为元路由对象添加标签
      if (route.parent_name) {
        originRoute.meta.parentName = route.parent_name
      } else {
        originRoute.meta.isParentRoute = true
      }
      return originRoute
    })
    // 保存返回路由树
    await store.dispatch('dynamicRoutes/asyncAddRoutes', await routeHandle(Routes))
    // 插入路由树
    store.getters['dynamicRoutes/getDynamicRoutes'].forEach(route => {
      router.addRoute(route)
    })
    return router.replace(to.path)
  }

  // 判断页面是否存在 页面不存在跳转 404 页面
  if (!(await findRoutePath(store.getters['dynamicRoutes/getRoutes'], to.path))) {
    return next('/404')
  }

  // 获取用户信息
  if (to.matched.some(record => record.meta.requireAuth && !store.state.userProfile.userData)) {
    const {
      data: { data }
    } = await getProfile()
    await store.dispatch('userProfile/saveUserData', data)
    return next()
  }

  return next()
})

// 全局路由后置
router.afterEach(() => {
  // 停止NProgress加载
  NProgress.done()
})
