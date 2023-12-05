import hasRole from '@/directive/permission/hasRole'
import hasPermi from '@/directive/permission/hasPermi'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
}

export default install
