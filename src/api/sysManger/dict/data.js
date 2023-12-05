import { req } from '@/api/request'

// 查询字典数据列表
function menuList(data) {
  return req('/api/system/dict/data/list', 'get', data)
}

// 查询字典数据详细
function getData(data) {
  return req('/api/system/dict/data/' + data, 'get', {})
}

// 根据字典类型查询字典数据信息
export function getDicts(data) {
  return req('/api/system/dict/data/type/' + data, 'get', {})
}

// 增删改字典数据
function operateData(data, methods, id) {
  if (id) {
    return req('/api/system/dict/data/' + id, methods)
  }
  return req('/api/system/dict/data', methods, data)
}

export default {
  menuList,
  getData,
  getDicts,
  operateData
}
