import router from '@/router'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import auth from '@/plugins/auth'
import InnerLink from '@/components/InnerLink'
import { constantRoutes } from '@/router/modules/constantRoutes'
import menu from '@/api/menu'
import Vue from 'vue'

const state = {
  routes: [],
  defaultRoutes: [],
  topbarRouters: [],
  sidebarRouters: [],
  permission: undefined,
  isFresh: false,
  isLocalScreen: false,

}
const mutations = {
  SET_FRESH: (state) => {
    state.isFresh = !state.isFresh
  },
  SET_LOCAL_SCREEN: (state) => {
    state.isLocalScreen = true
  },
  SET_UNLOCAL_SCREEN: (state) => {
    state.isLocalScreen = false
  },
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  },
  SET_DEFAULT_ROUTES: (state, routes) => {
    state.defaultRoutes = constantRoutes.concat(routes)
  },
  SET_TOPBAR_ROUTES: (state, routes) => {
    // 顶部导航菜单默认添加统计报表栏指向首页
    const index = [{
      path: 'index',
      meta: { title: '统计报表', icon: 'dashboard' }
    }]
    state.topbarRouters = routes.concat(index)
  },
  SET_SIDEBAR_ROUTERS: (state, routes) => {
    state.sidebarRouters = routes
  },
  SET_PERMISSION: (state, permissions) => {
    for (const k in permissions) {
      state[k] = permissions[k]
    }
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permission = permissions
  }
}
const actions = {
  isLocalScreen(context) {
    return new Promise((resolve) => {
      context.commit('SET_LOCAL_SCREEN')
      resolve()
    })
  },
  isUnLocalScreen(context) {
    return new Promise((resolve) => {
      context.commit('SET_UNLOCAL_SCREEN')
      resolve()
    })
  },
  setFresh(context) {
    return new Promise((resolve) => {
      context.commit('SET_FRESH')
      resolve()
    })
  },

  permission(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_PERMISSION', payload)
      resolve()
    })
  },
  GenerateRoutes({ commit }) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      console.log('进入')
      menu.getRouters().then(res => {
        const sdata = JSON.parse(JSON.stringify(res.data))
        const rdata = JSON.parse(JSON.stringify(res.data))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        // rewriteRoutes.push({ path: '*', redirect: '/not-find', hidden: true })
        commit('SET_ROUTES', rewriteRoutes)
        const menu = []
        constantRoutes.concat(sidebarRoutes).forEach(item => {
          if (!item.hidden && item.meta) {
            menu.push(dealHiddenMenu(item))
          } else if (!item.meta && item.children && item.children.length > 0 && item.children[0].meta && !item.hidden) {
            menu.push(item.children[0])
          }
        })
        const menus = JSON.parse(JSON.stringify(menu))
        commit('SET_SIDEBAR_ROUTERS', menus)
        commit('SET_DEFAULT_ROUTES', sidebarRoutes)
        commit('SET_TOPBAR_ROUTES', sidebarRoutes)
        var arr = []
        getRouters(rewriteRoutes, arr);
        const homeRouter = [
          {
            path: '/',
            component: Layout,
            redirect: 'index',
            children: removal(arr)
          }
        ]
        //新版本写法
        router.addRoute('/', homeRouter[0]);

        //老版本写法
        // router.addRoutes(homeRouter)
        resolve(homeRouter)
      })
    })
  }
}

// 出来隐藏菜单
function dealHiddenMenu(menu) {
  const arr = Object.assign({}, menu)
  arr.children = []
  menu.children.forEach(item => {
    if (!item.hidden) {
      arr.children.push(item)
    }
  })
  return arr
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

// // 去除多余的/组件
function removal(arr) {
  const data = [];
  let Routercount = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].path !== '/') {
      //解决路由名重复问题
      if (arr[i].name == 'Index') {
        Routercount++
        if (Routercount>1) {
          arr[i].name = 'newIndex'
          Routercount = 0;
        }
      }
      if (arr[i].name == 'ReturnVisitRecordList') {
        arr[i].name = 'newReturnVisitRecordList'
      }
      if (arr[i].name == 'CustomerDemand') {
        Routercount++
        if (Routercount > 1) {
          arr[i].name = 'newCustomerDemand'
          Routercount = 0;
        }
      }
      if (arr[i].name == 'NotInHospital') {
        Routercount++
        if (Routercount > 1) {
          arr[i].name = 'newNotInHospital'
        }
      }
      if (arr[i].name == 'Import') {
        Routercount++
        if (Routercount > 1) {
          arr[i].name = 'newImport'
        }
      }

      data.push((arr[i]))
    }
  }
  return data
}
function getRouters(routers, arr) {
  routers.forEach(item => {
    if (item.children && item.children.length > 0) {
      getRouters(item.children, arr)
    }
    arr.push(item)
    item.children = null
  })
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
      delete route['redirect']
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          // c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    // return (resolve) => require([`@/views/${view}`], resolve)
    return ()=> import(`@/views/${view}`)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default {
  state,
  mutations,
  actions
}
