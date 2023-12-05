import { req } from '@/api/request'
import { re } from 'mathjs'

function dept(data, methods, id) {
  if (id) {
    return req('/api/system/dept' + '/' + id, methods, data)
  } else {
    return req('/api/system/dept', methods, data)
  }
}

function deptList(data, methods) {
  return req('/api/system/dept/list', methods, data)
}

function deptTree(data, methods) {
  return req('/api/system/dept/treeselect', methods, data)
}

function roleDeptTreeselect(id) {
  return req('/api/system/dept/roleDeptTreeselect/' + id, 'get')
}

function deptExclude(data, methods, id) {
  return req('/api/system/dept/list/exclude/' + id, methods, data)
}
// 添加科室增删改查
function Department(data, methods, id) {
  if (id) {
    return req('/api/share/departmentInfo/' + id, methods)
  }
  return req('/api/share/departmentInfo', methods, data)
}

// 获取科室列表的数据
function DepartmentList(data) {
  return req('/api/share/departmentInfo/list', 'get', data)
}
// /share/departmentInfo/{departmentIds}
// 删除科室
function DelectDepartment(id, methods) {
  return req('/api/share/departmentInfo/' + id, methods)
}
// 科室的树形结构接口
function TreeDepartment(data) {
  return req('/api/share/departmentInfo/projectTreeselect', 'get', data)
}

// 添加类型管理增删改查
function addType(data, methods, id) {
  if (id) {
    return req('/api/share/projectTypeInfo/' + id, methods)
  }
  return req('/api/share/projectTypeInfo', methods, data)
}
// 获取类型管理列表
function TypeList(data) {
  return req('/api/share/projectTypeInfo/list', 'get', data)
}
// /share/projectCategoryInfo
// 添加类目增删改查
function addCategory(data, methods, id) {
  if (id) {
    return req('/api/share/projectCategoryInfo/' + id, methods)
  }
  return req('/api/share/projectCategoryInfo', methods, data)
}
// 类目列表
function CategoryList(data) {
  return req('/api/share/projectCategoryInfo/list', 'get', data)
}
// 接诊列表
function ReceptionTriagelist(data, methods) {
  return req('/api/confinement/customerCmt/triageQueryData', 'get', data, methods)
}
// 接待列表信息
function Receptiondata(id, methods) {
  return req('/api/confinement/receptionInformationList/selectReceptionList/' + id, methods)
}

// 接待列表list\
function ReceptionResults(data) {
  return req('/api/confinement/receptionInformationList/list', 'get', data)
}

// 补充接诊信息
function ReceptionSupplementary(data) {
  return req('/api/confinement/receptionInformationList/supplementary', 'put', data)
}

// 顾客管理中个人领取接诊单
function receiveReceptionSheet(id, methods) {
  return req('/api/confinement/customerCmt/' + id, methods)
}

// 根据用户phoen查询顾客详情
function getUserInfoPhone(data) {
  return req('/api/confinement/customerCmt/getUserInfoPhone', 'get', data)
}

// 临客信息列表
function GuestInformation(id, methods) {
  return req('/api/confinement/customerReservationForm/selectReservation', id, methods)
}
// 保存领取接诊单的接口
function addReceptiondata(data) {
  return req('/api/confinement/receptionInformationList', 'post', data)
}
// 保存领取接诊单的接口
function editReceptiondata(data) {
  return req('/api/confinement/receptionInformationList', 'put', data)
}
// 我的接诊信息
function ReceptionList(data, methods) {
  return req('/api/confinement/receptionInformationList/selectAllReceptionList', data, methods)
}
// 我的接诊信息
function CustomerInfoReception(data) {
  return req('/api/confinement/receptionInformationList/selectAllReceptionList', data)
}
// 我的接诊列表统计
function selectReceptionStatistics(data) {
  return req('/api/confinement/receptionInformationList/selectReceptionStatistics', 'get', data)
}
// 接诊列表
function MyReception(data, methods) {
  return req('/api/confinement/receptionInformationList/selectReceptionAll', methods, data)
}
function receptionInformationList(id) {
  return req(`/api/confinement/customerCmt/${id}`, 'get')
}
// 顾客标签关系
function CustomerLabel(data, methods) {
  return req('/api/confinement/customerLabelRelation/list', data, methods)
}
// 删除顾客标签
function removeCustomerLabel(id) {
  return req('/api/confinement/customerLabelRelation/' + id, 'delete')
}

// 接待列表中会员等级
function MembershipLevel(params) {
  return req('/api/confinement/membershipLevelInfo/list', 'get', params)
}

// 更新缓存
function refresh() {
  return req('/api/share/departmentInfo/updateDeptCache', 'post')
}

export default {
  dept,
  deptList,
  deptTree,
  deptExclude,
  roleDeptTreeselect,
  Department,
  DepartmentList,
  addType,
  TypeList,
  addCategory,
  CategoryList,
  DelectDepartment,
  ReceptionTriagelist,
  Receptiondata,
  // obtainList
  receiveReceptionSheet,
  GuestInformation,
  addReceptiondata,
  editReceptiondata,
  ReceptionList,
  MyReception,
  CustomerLabel,
  ReceptionResults,
  TreeDepartment,
  MembershipLevel,
  removeCustomerLabel,
  ReceptionSupplementary,
  CustomerInfoReception,
  refresh,
  receptionInformationList,
  selectReceptionStatistics,
  getUserInfoPhone
}
