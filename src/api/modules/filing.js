import { req } from '@/api/request'

// 第一级建档类型列表
function FilingOneList(data) {
  return req('/api/share/filingType/list', 'get', data)
}
// 一级项目
function departmentInfoList(data) {
  return req('/api/share/departmentInfo/list', 'get', data)
}
// 二级项目
function projectTypeInfoList(data) {
  return req('/api/share/projectTypeInfo/list', 'get', data)
}
// 获取上级类型 第三级
function getProjectTypeInfoList(data) {
  return req('/api/share/projectTypeInfo/getProjectTypeInfo', 'get', data)
}
// 获取上级类型 最后一级
function getProjectCategoryInfo(data) {
  return req('/api/share/projectCategoryInfo/getProjectCategoryInfo', 'get', data)
}
// 第一级建档类型的增删改
function filingOneOperate(data, methods, id) {
  if (id) {
    return req('/api/share/filingType/' + id, methods)
  }
  return req('/api/share/filingType', methods, data)
}

// 二级类型列表
function FilingTwoList(data) {
  return req('/api/share/filingTypeTwo/list', 'get', data)
}
// 第二级建档类型的增删改
function filingTwoOperate(data, methods, id) {
  if (id) {
    return req('/api/share/filingTypeTwo/' + id, methods)
  }
  return req('/api/share/filingTypeTwo', methods, data)
}

// 三级类型列表
function FilingThreeList(data) {
  return req('/api/share/filingTypeThree/list', 'get', data)
}
// 第三级建档类型的增删改
function filingThreeOperate(data, methods, id) {
  if (id) {
    return req('/api/share/filingTypeThree/' + id, methods)
  }
  return req('/api/share/filingTypeThree', methods, data)
}

// 关联部门建档类型接口
function deptFilingList(data) {
  return req('/api/share/deptFilingTypeRelation/list', 'get', data)
}
function deptFilingOperate(data, methods, id) {
  if (id) {
    return req('/api/share/deptFilingTypeRelation/' + id, methods)
  }
  return req('/api/share/deptFilingTypeRelation', methods, data)
}

// 获取建档类型
function getFilingType() {
  return req('/api/share/filingType/slectTree', 'get')
}

// 根据部门ID获取建档类型
function getFilingTypeById(data) {
  return req('/api/share/filingType/slectTree', 'get', data)
}

export default {
  FilingOneList,
  filingOneOperate,
  FilingTwoList,
  filingTwoOperate,
  FilingThreeList,
  filingThreeOperate,
  deptFilingList,
  deptFilingOperate,
  getFilingType,
  departmentInfoList,
  projectTypeInfoList,
  getFilingTypeById,
  getProjectTypeInfoList,
  getProjectCategoryInfo
}
