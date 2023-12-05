import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
router.beforeEach((to, from, next) => {
  // 有token 的情况

  if (getToken()) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (store.getters.roles.length === 0) {
      // 判断当前用户是否已经拉取完user_info信息
        store.dispatch('GetInfo').then(async() => {
          await store.dispatch('GenerateRoutes').then(() => {
            next({ ...to, replace: true })
          })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
})
