/**
 * v-hasPermi 操作权限处理
 */

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = store.getters && store.getters.permissions;
    if (permissions.length !== 1) {
      if (permissions.indexOf('showerOrdernumber:button') !== -1) {
        store.dispatch('setbutton', { setShowButton: true })
      } else {
        store.dispatch('setbutton', { setShowButton: false })
      }
      let index = permissions.indexOf('payment:billing:time');
      let newindex = permissions.indexOf('confinement:listTime');
      if (index > 0) {
        localStorage.setItem('WhetherDisable', true)
      } else {
        localStorage.setItem('WhetherDisable', false)
      }
      if (newindex > 0) {
        localStorage.setItem('WhetherDisableflag', true)
      } else {
        localStorage.setItem('WhetherDisableflag', false)
      }
    } else {
      store.dispatch('setbutton', { setShowButton: true })
      localStorage.setItem('WhetherDisable', true);
      localStorage.setItem('WhetherDisableflag', true)
    }
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      // console.log(hasPermissions,'dasdasdhashd')
      if (!hasPermissions) {
        console.log('没有权限')
        el.parentNode && el.parentNode.removeChild(el)
        //setChildrenDisabled(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}

export function setChildrenDisabled(el) {
  for (let i = 0; i < el.childNodes.length; i++) {// 遍历当前节点的所有子节点
    setChildrenDisabled(el.childNodes[i]);// 所有子节点进行递归
  }
  console.log(el)
  if (el.classList !== undefined) {
    el.classList.add("is-disabled")
    el.setAttribute('disabled', true)
  }
}
