import login from '@/api/login/login'
import { removeToken, setToken } from '@/utils/auth'
const state = {
  userInfo: {},
  name: undefined,
  avatar: undefined,
  roles: [],
  user: {}
}
const mutations = {
  SET_USER_TOKEN: (state, view) => {
    state.userInfo.token = view
  },
  SET_USER_INFO: (state, view) => {
    for (const k in view) {
      state[k] = view[k]
    }
  },
  SET_NAME: (state, view) => {
    state.name = view
  },
  SET_AVATAR: (state, view) => {
    state.avatar = view
  },
  SET_USER: (state, view) => {
    state.user = view
  },
  SET_ROLES: (state, view) => {
    state.roles = view
  }
}
const actions = {
   
   clearCache(context, payload){
    return new Promise((resolve) => {
      context.commit('SET_ROLES', payload)
      resolve()
    })
   },
   
  userInfo(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_USER_INFO', payload)
      resolve()
    })
  },
  // 退出登录
  LogOut({ commit }) {
    return new Promise((resolve, reject) => {
      login.logout().then((res) => {
        commit('SET_USER_TOKEN', '')
        commit('SET_PERMISSIONS', [])
        commit('SET_ROLES', [])
        commit('SET_USER', {})
        commit('SET_AVATAR', '')
        commit('SET_ROUTES', [])
        removeToken()
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登录
  Login({ commit }, userInfo) {
    const username = userInfo.username.trim()
    const password = userInfo.password
    const code = userInfo.code
    const uuid = userInfo.uuid
    const type = userInfo.type
    return new Promise((resolve, reject) => {
      login.login(username, password, code, uuid, type).then((res) => {
        // 设置token
        commit('SET_USER_TOKEN', res.data.access_token)
        setToken(res.data.access_token)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      login.getInfo().then(res => {
        const user = res.user
        const avatar = user.avatar === '' ? require('@/assets/images/profile.jpg') : user.avatar
        user.avatar = avatar
        if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', res.roles)
          commit('SET_PERMISSIONS', res.permissions)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }
        commit('SET_NAME', user.userName)
        commit('SET_USER', user)
        commit('SET_AVATAR', avatar)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }

}
export default {
  state,
  mutations,
  actions
}
