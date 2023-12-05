
// 获取路由
import { req } from '@/api/request'

function getRouters() {
  return req('/api/system/menu/getRouters', 'get')
}

export default {
  getRouters
}
