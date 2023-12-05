import { req } from '@/api/request'

// 获取顾客标签类型列表
function custLabelTypeList(data) {
  return req('/api/share/customerLabelType/list', 'get', data)
}

// 顾客标签操作
function custLabelTypeOperate(data, methods, id) {
  if (id) {
    return req('/api/share/customerLabelType/' + id, methods)
  }
  return req('/api/share/customerLabelType', methods, data)
}

// 根据id获取顾客标签类型
function custLabelTypeById(id) {
  return req('/api/share/customerLabelType/' + id, 'get')
}

// 获取顾客标签
function custLabelData(data) {
  return req('/api/share/customerLabelData/list', 'get', data)
}

// 根据id获取标签详情
function custLabelById(id) {
  return req('/api/share/customerLabelData/' + id, 'get')
}

// 标签的增删改
function custLabelOperate(data, methods, id) {
  if (id) {
    return req('/api/share/customerLabelData/' + id, methods)
  }
  return req('/api/share/customerLabelData', methods, data)
}

// 部门标签
function custDeptLabelTypeList(data) {
  return req('/api/share/customerLabelTypeRelation/list', 'get', data)
}

// 部门标签的增删改
function custDeptLabelOperate(data, methods, id) {
  if (id) {
    return req('/api/share/customerLabelTypeRelation/' + id, methods)
  }
  return req('/api/share/customerLabelTypeRelation', methods, data)
}

// 客户标签
function customerLabelType(data) {
  return req('/api/share/customerLabelType/labelTypeName', 'get', data)
}

export default {
  custLabelTypeList,
  custLabelData,
  custLabelTypeOperate,
  custLabelTypeById,
  custLabelById,
  custLabelOperate,
  custDeptLabelTypeList,
  custDeptLabelOperate,
  customerLabelType
}

