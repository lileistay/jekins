import Vue from 'vue'
import App from './App.vue'

import store from './store'

Vue.config.productionTip = false
Vue.config.devtools = true

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import api from '@/api/api'
Vue.prototype.$api = api





import router from './router'
import './permission'
import './assets/icons'
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
