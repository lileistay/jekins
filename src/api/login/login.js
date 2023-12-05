import { req } from '@/api/request'

// 登录
function login(username, password, code, uuid, type) {
  return req('/api/auth/login', 'post', { username, password, code, uuid, type })
}

// 退出登录
function logout(data) {
   localStorage.setItem('isTrue',false)
  return req('/api/auth/logout', 'delete', data)
}

// 获取用户详细信息
function getInfo() {
  return req('/api/system/user/getInfo', 'get')
}

// 登录成功调用这个
function judgePassword() {
  return req('/api/auth/judgePassword', 'get')
}

export default {
  login,
  logout,
  getInfo,
  judgePassword
}
