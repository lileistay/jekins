import { req } from '@/api/request'

// 渠道列表
function list(data) {
  return req('/api/share/channelInfo/list', 'get', data)
}

function noPageList(data) {
  return req('/api/share/channelInfo/list', 'get', data)
}

// 渠道类型 不分页
function noPageTypeList(data) {
  return req('/api/share/channelType/list', 'get', data)
}

// 渠道的增删改
function operate(data, methods, id) {
  if (id) {
    return req('/api/share/channelInfo/' + id, methods)
  }
  return req('/api/share/channelInfo', methods, data)
}

// 根据id获取
function getById(id) {
  return req('/api/share/channelInfo/' + id, 'get')
}

// 类型列表
function typeList(data) {
  return req('/api/share/channelType/list', 'get', data)
}

// 类型的增删改
function typeOperate(data, methods, id) {
  if (id) {
    return req('/api/share/channelType/' + id, methods)
  }
  return req('/api/share/channelType', methods, data)
}

// 根据id获取类型
function typeById(id) {
  return req('/api/share/channelType/' + id, 'get')
}

// 部门渠道的列表
function deptChannelList(data) {
  return req('/api/share/channelDeptTypeRelation/cdtrTypeChannelInfo', 'get', data)
}

// 部门渠道的增删改
function deptChannelOperate(data, methods, ids) {
  if (ids) {
    return req('/api/share/channelDeptTypeRelation/' + ids, methods)
  }
  return req('/api/share/channelDeptTypeRelation', methods, data)
}

// 获取渠道信息
function getChannelType(data) {
  return req('/api/share/channelType/channelType', 'get', data)
}
export default {
  list,
  typeList,
  typeOperate,
  typeById,
  operate,
  getById,
  deptChannelList,
  noPageTypeList,
  noPageList,
  deptChannelOperate,
  getChannelType
}
