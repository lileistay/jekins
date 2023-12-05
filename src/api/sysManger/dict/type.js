import { req } from '@/api/request'

// 查询字典类型列表
function listType(data) {
  return req('/api/system/dict/type/list', 'get', data)
}

// 查询字典类型详细
function getType(id) {
  return req('/api/system/dict/type/' + id, 'get')
}
//参数列表
export function parameter(data){
  return req('/api/system/config/list', 'get', data)
}
//参数增加修改
export function parameteradd(data, methods, id){
  if (id) {
    return req('/api/system/config/' + id, methods)
  }
  return req('/api/system/config', methods, data)
}
// 字典类型增删改
function dictTypeOperate(data, methods, id) {
  if (id) {
    return req('/api/system/dict/type/' + id, methods)
  }
  return req('/api/system/dict/type', methods, data)
}

// 刷新字典缓存
function refreshCache() {
  return req('/api/system/dict/type/refreshCache', 'delete')
}

// 获取字典选择框列表
function optionselect() {
  return req('/api/system/dict/type/optionselect', 'get')
}

export default {
  listType,
  getType,
  dictTypeOperate,
  refreshCache,
  optionselect,
  parameter,
  parameteradd
}
