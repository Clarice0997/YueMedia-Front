import router from '@/router'
import VueRouter from 'vue-router'

/**
 * 构建路由树 （递归实现，多级适配）
 * @param {Array} routes
 * @param {String} parentName
 * @returns {Array}
 */
export const routeHandle = (routes, parentName) => {
  const result = []
  routes.forEach(route => {
    if (route.meta.parentName === parentName) {
      const children = routeHandle(routes, route.name)
      if (children.length) {
        route.children = children
      }
      result.push(route)
    }
  })
  return result
}

/**
 * 重置路由对象
 * @returns
 */
export const resetRouter = async () => {
  // 获取初始路由
  const initialRoutes = router.options.routes
  // 构建初始路由对象
  const newRouter = new VueRouter({
    routes: initialRoutes
  })
  router.matcher = newRouter.matcher
}

/**
 * 递归路由树 判断是否存在匹配路径
 * @param routeTree
 * @param targetPath
 * @param parentPath
 * @returns
 */
export const findRoutePath = async (routeTree, targetPath, parentPath) => {
  let result = null

  for (let i = 0; i < routeTree.length; i++) {
    let fullPath
    if (parentPath) {
      fullPath = `${parentPath}/${routeTree[i].path}`
    } else {
      fullPath = routeTree[i].path
    }

    if (fullPath === targetPath) {
      result = routeTree[i]
      break
    } else if (routeTree[i].children) {
      const childResult = await findRoutePath(routeTree[i].children, targetPath, fullPath)
      if (childResult) {
        result = childResult
        break
      }
    }
  }

  return result
}
