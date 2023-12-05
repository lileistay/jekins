import { req } from '@/api/request'

// 未成交项目
// 未成交项目列表
function NoDealList(data) {
  return req('/api/confinement/noDealProjecInfo/list', 'get', data)
}
export default {
  NoDealList
}
