import Vue from 'vue'
import store from '@/store'
import api from '@/api/api'
import Local from '@/components/LocalScreen/index.vue'
import router from '@/router'

export default function() {
  const Constructor = Vue.extend(Local)
  const Instance = new Constructor()
  Instance.$mount()
  document.body.appendChild(Instance.$el)
  Instance.dom = Instance.$el
  Vue.prototype.$LocalScreen = () => {
    Instance.visible = true
    Instance.errorText = ''
    Instance.userInfo = store.getters.user
    store.dispatch('isLocalScreen')
    Instance.login = function() {
      if (Instance.password !== '') {
        Instance.checkPassword = true
        api.user.passwordValid(Instance.password).then(res => {
          if (res.data === 1) {
            Instance.visible = false
            store.dispatch('isUnLocalScreen')
          } else {
            Instance.errorText = res.msg
          }
        }).finally(() => {
          Instance.checkPassword = false
          Instance.password = ''
        })
      } else {
        Instance.errorText = '请输入密码'
      }
    }
    Instance.useOtherAccount = function() {
      store.dispatch('LogOut').then(() => {
        router.replace('/login')
        store.dispatch('isUnLocalScreen')
        Instance.visible = false
      })
    }
    return Instance.showLocal().then(res => {
      return Promise.resolve(res)
    }).catch(err => {
      return Promise.reject(err)
    })
  }
}

