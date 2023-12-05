import { req } from '@/api/request'
import { download } from '@/utils/request'

// 查询角色列表
function roleList(data, methods) {
  return req('/api/system/role/list', methods, data)
}

// 查询角色详细
function getRole(id, methods) {
  return req('/api/system/role/' + id, methods)
}

// 角色的增删改
function roleOperate(data, methods, id) {
  if (id) {
    return req('/api/system/role/' + id, methods, data)
  }
  return req('/api/system/role', methods, data)
}

// 角色数据权限
function dataScope(data, methods) {
  return req('/api/system/role/dataScope', methods, data)
}

function exportRole(data) {
  return download('/api/system/role/export', {
    ...data
  }, `role_${new Date().getTime()}.xlsx`)
}

export default {
  roleList,
  roleOperate,
  getRole,
  dataScope,
  exportRole
}
