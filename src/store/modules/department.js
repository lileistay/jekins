const state = {
  departmentId: undefined,
  //设置新树改变公司后的存储
  treedepartmentId: undefined,
  //加载loading
  isReload: undefined,
  //取消loading
  FalseisReload: undefined,
  //首页头部数据进行刷新
  Homepage: undefined,
  //设置连接
  Loginconnect: undefined,
  //设置全局左侧搜索框
  reloadSearch: "",
  //全局接收wensock信息
  loadmessage: '',
  //接收上线用户
  onlinelist: [],
  //设置上下线
  onlineuplist: '',
  //设置全局拦截
  istrueShowFlag: '',

}
const mutations = {
  SET_DEPARTMENT: (state, view) => {
    state.departmentId = view.departmentId
  },
  SET_DEPARTMENTTREE: (state, view) => {
    state.treedepartmentId = view.treedepartmentId
  },
  //设置全局拦截
  SET_ISTRUESHOWFLAG: (state, view) => {
    state.istrueShowFlag = view.istrueShowFlag
  },
  //全局设置loading
  SET_RELOAD: (state, view) => {
    state.isReload = view.isReload
  },
  //全局取消loading
  REDUCE_SET_RELOAD: (state, view) => {
    state.FalseisReload = view.FalseisReload
  },
  //设置刷新首页功能
  HOMEPAGERELOAD: (state, view) => {
    state.Homepage = view.Homepage
  },
  //设置登录状态
  SET_LOGIN: (state, view) => {
    state.Loginconnect = view.Loginconnect
  },
  //设置websocket
  SETLOADMESSAGE: (state, view) => {
    state.loadmessage = view.loadmessage
  },
  //设置上线
  ONLINE(state, view) {
    state.onlinelist = view.online;
  },
  //设置上下线
  ONLINEUP(state, view) {
    state.onlineuplist = view.online;
  }

}
const actions = {
  department(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_DEPARTMENT', payload)
      resolve()
    })
  },
  treedepartment(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_DEPARTMENTTREE', payload)
      resolve()
    })
  },
  //异步设置全局拦截
  setTrueShow(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_ISTRUESHOWFLAG', payload)
      resolve()
    })
  },
  //异步设置全局loding
  setLoadment(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_RELOAD', payload)
      resolve()
    })
  },
  //异步去掉全局loding
  reduceLoadment(context, payload) {
    return new Promise((resolve) => {
      context.commit('REDUCE_SET_RELOAD', payload)
      resolve()
    })
  },
  //异步触发首页刷新功能
  homepageReload(context, payload) {
    return new Promise((resolve) => {
      context.commit('HOMEPAGERELOAD', payload)
      resolve()
    })
  },
  //异步登录
  setLogin(context, payload) {
    return new Promise((resolve) => {
      context.commit('SET_LOGIN', payload)
      resolve()
    })
  },
  //异步接收websocket信息
  setloadmessage(context, payload) {
    return new Promise((resolve) => {
      context.commit('SETLOADMESSAGE', payload)
      resolve()
    })
  },
  //接收上线
  online(context, payload) {
    return new Promise((resolve) => {
      context.commit('ONLINE', payload)
      resolve()
    })
  },
  //设置上下线
  onlineup(context, payload) {
    return new Promise((resolve) => {
      context.commit('ONLINEUP', payload)
      resolve()
    })
  },

}
export default {
  state,
  mutations,
  actions
}
