import { req } from '@/api/request'

// 通过id得到顾客信息
function getInfoById(guestId) {
  return req('/api/confinement/customerCmt/' + guestId, 'get')
}

// 修改客户信息
function editCustomerCmt(data) {
  return req('/api/confinement/customerCmt', 'put', data)
}

// 设置主号码
function setCustomMainPhone(data) {
  return req('/api/confinement/customerCmt/updatePhoneMajor', 'put', data)
}

// 获取顾客手机列表
function getCustomPhoneList(data) {
  return req('/api/confinement/customPhoneList/list', 'get', data)
}

// 获取顾客手机列表
function deleteCustomPhones(deleteIds) {
  return req('/api/confinement/customPhoneList/' + deleteIds, 'delete')
}

// 添加顾客手机号
function addCustomPhone(data) {
  return req('/api/confinement/customPhoneList', 'post', data)
}

// 修改客户归属、建档、媒介
function modifyAscription(data) {
  return req('api/confinement/customerCmt/modifyAscription', 'post', data)
}

// 修改客户电话
function changePhone(data) {
  return req('api/confinement/customerCmt/changePhone', 'post', data)
}

// 临客合并
function mergeCustomer(data) {
  return req('api/confinement/customerCmt/mergeCustomer', 'post', data)
}

// 查询临客合并记录
function customerMergeRecord(data) {
  return req('api/confinement/customerMergeRecord/list', 'get', data)
}

// 修改正客归属媒介介绍人
// 修改客户归属、建档、媒介
function formalModifyAscription(data) {
  return req('api/confinement/customerCmt/formalModifyAscription', 'put', data)
}

export default {
  getInfoById,
  editCustomerCmt,
  getCustomPhoneList,
  addCustomPhone,
  deleteCustomPhones,
  setCustomMainPhone,
  modifyAscription, // 修改客户归属、建档、媒介
  changePhone, // 修改客户电话
  mergeCustomer, // 临客合并
  customerMergeRecord, // 查询临客合并记录
  formalModifyAscription // 修改正客媒介、推荐人等等
}
