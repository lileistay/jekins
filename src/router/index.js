import Vue from 'vue'
// import { MessageBox } from 'element-ui'
import Router from 'vue-router'

const routerPush = Router.prototype.push
const routerReplace = Router.prototype.replace
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
Router.prototype.replace = function replace(location) {
  return routerReplace.call(this, location).catch(error => error)
}
Vue.use(Router)

import { constantRoutes } from '@/router/modules/constantRoutes'

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
