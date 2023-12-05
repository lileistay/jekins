import { req } from '@/api/request'
import { postDownload, postReq, putReq } from '../request'
import { download } from '@/utils/request'

// 获取预约项目列表
// function getBookProjectList () {
//   return req('/api/share/appointmentDeptPeojectInfo/DeptPeojectInfo', 'get')
// }

// 小标签
function returnVisitRecord(data) {
  return req('/api/confinement/returnVisitRecord/returnVisit', 'get', data)
}
function returnVisitHospital(data) {
  return req('/api/confinement/returnVisitHospital/returnVisit', 'get', data)
}

// 预约单查询导出
function ComsultExport(data) {
  return postDownload('/api/confinement/customerCmt/export', 'post', data)
}

// 提交建档信息
function submitComsultInput(data) {
  return req('/api/confinement/customerCmt', 'post', data)
}

// 提交预约信息
function customerReservationForm(data) {
  return req('/api/confinement/customerReservationForm', 'post', data)
}

// 查询预约信息
function queryCustomInfo(data) {
  return req('/api/confinement/customerCmt/customInfos', 'get', data)
}

// 查询未成交原因
function notDealReason(data) {
  return req('/api/confinement/notDealReason/list', 'get', data)
}
// 删除未成交原因
function notRemove(id) {
  return req('/api/confinement/notDealReason/' + id, 'delete')
}
// 预约查询列表
function queryBookCustomerList(data) {
  return req('/api/confinement/customerCmt/list', 'get', data)
}

// 预约项目列表
function projectTreeselect(data) {
  return req('/api/share/departmentInfo/projectTreeselect', 'get', data)
}

// 根据部门获取产品名称
function getProjectListItemId(data) {
  return req('/api/confinement/projectInfo/getProjectListItemId', 'get', data)
}

// 获取客户基本信息
function getUserInfo(data) {
  return req('/api/share/customerInfo/list', 'get', data)
}

// 获取客户标签信息以及基本信息
function getUserLabelInfo(data) {
  return req('/api/confinement/customerCmt/customerLabel', 'get', data)
}

// 添加顾客标签
function addUserLabel(data) {
  return req('/api/confinement/customerLabelRelation', 'post', data)
}

// 删除顾客标签
function deleteCustomerLabel(id) {
  return req('/api/confinement/customerLabelRelation/' + id, 'delete')
}

// 获取顾客的预约项目信息
function getUserBookProjectInfo(data) {
  return req('/api/confinement/customerReservationForm/list', 'get', data)
}

// 修改顾客预约项目
function updateCustomerBookProject(data) {
  return req('/api/confinement/customerReservationForm/installUpdate', 'post', data)
}

// 刪除顧客預約項目信息

// function deleteCustomerBookProject (ids) {
//   return req('/api/confinement/customerReservationForm/' + ids, 'delete')
// }

// 修改顧客預約信息
function editCustomerBookInfo(data) {
  return req('/api/confinement/customerCmt', 'put', data)
}

// 修改顧客預約信息
function editCustomerBook(data) {
  return req('/api/confinement/customerReservationForm/updateReservationForm', 'post', data)
}

// 添加客户跟进
function followUpRecord(data) {
  return req('api/confinement/followUpRecord', 'post', data)
}

// 客户跟进记录列表
function followUpRecordList(data) {
  return req('api/confinement/followUpRecord/list', 'get', data)
}

// 手工上报
function addManualData(data) {
  return req('/api/confinement/returnVisitRecord', 'post', data)
}
// 删除回访计划接口
function remove(id) {
  return req('/api/confinement/returnVisitRecord/' + id, 'delete')
}
// 计划回访
function returnVisitPlan(data) {
  return req('/api/confinement/returnVisitRecord/list', 'get', data)
}

// 获取顾客地址列表
function customerCityList() {
  return req('/api/share/customerInfo/cityList', 'get')
}
// 回访计划编辑
function ReturnVisit(data) {
  return req('/api/confinement/returnVisitRecord', 'put', data)
}
// 回访记录
// function ReturnVisitRecord (id) {
//   return req('/api/confinement/returnVisitRecord/selectList', 'get', id)
// }
// 临客信息的接口
function GuestInformation(data) {
  return req('/api/confinement/followUpRecord/list', 'get', data)
}
// 添加黑名单的方法
function blacklist(data) {
  return req('/api/confinement/customerCmt', 'put', data)
}

// 未回访重新分配(未到院)
function noReturnVisit(data) {
  return postReq('/api/confinement/returnVisitRecord/noReturnVisit', 'post', data)
}

// 未回访重新分配(已到院)
function noReassignment(data) {
  return postReq('/api/confinement/returnVisitHospital/noReassignment', 'post', data)
}

// 回访合并(已到院)
function returnVisitHospitalMerge(data) {
  return putReq('/api/confinement/returnVisitHospital/returnVisitMerge', 'put', data)
}

// 回访合并(未到院)
function returnVisitRecordMerge(data) {
  return putReq('/api/confinement/returnVisitRecord/returnVisitMerge', 'put', data)
}

// 已到院手工上报
function AlreadyArrivedAdd(data) {
  return req('/api/confinement/returnVisitHospital', 'post', data)
}

// 获取已到院个人数据
function returnVisitHospitalList(data) {
  return req('/api/confinement/returnVisitHospital/list', 'get', data)
}
// 获取已到院回访列表
function AlreadyArrivedList(data) {
  return req('/api/confinement/returnVisitHospital/list', 'get', data)
}
// 获取未到院个人数据
function getNoArrivedInfoList(data) {
  return req('/api/confinement/returnVisitRecord/list', 'get', data)
}
// 获取未到院回访列表
function noArrivedList(data) {
  return req('/api/confinement/returnVisitRecord/list', 'get', data)
}

// 删除
function deleteList(id) {
  return req('/api/confinement/returnVisitHospital/' + id, 'delete')
}
// 已到院回访保存接口添加
function AlreadyArrived(data) {
  return req('/api/confinement/returnVisitHospital', 'put', data)
}

// 建档预约

function selectRecommend(data) {
  return req('/api/confinement/customerCmt/selectRecommend', 'get', data)
}
function getRelevancyCompanyStaff(data) {
  return req('/api/confinement/customerCmt/getRelevancyCompanyStaff', 'get', data)
}
// 来院列表
function AdmissionList(data) {
  return req('/api/confinement/customerCmt/customerList', 'get', data)
}
function UnsettledItems(data) {
  return req('/api/confinement/noDealProjecInfo/list', 'get',data)
}
// 临时顾客预约未来院查询
function casualcustomer(data) {
  return req('/api/confinement/customerCmt/casualCustomer', 'get', data)
}

// 来院查询统计
function selectQueryStatisticsHospital(data) {
  return req('/api/confinement/customerCmt/selectQueryStatisticsHospital', 'get', data)
}

// 下载用户列表模板
function importTemplate(data) {
  return download('/api/system/user/importTemplate', {
    ...data
  }, `user_template_${new Date().getTime()}.xlsx`)
}
// 下载用户列表模板1
function importSysUserTemplate(data) {
  return download('/api/system/user/importSysUserTemplate', {
    ...data
  }, `user_template_${new Date().getTime()}.xlsx`)
}
// 查询会员升级记录列表
function memberUpgradeList(data) {
  return req('/api/confinement/memberUpgrade/list', 'get', data)
}
// 查询积分兑换查询列表
function getPointsExchangeList(data) {
  return req('/api/confinement/memberPointsExchange/getPointsExchangeList', 'get', data)
}

export default {
  returnVisitRecord,
  returnVisitHospital,
  getRelevancyCompanyStaff,
  // getBookProjectList,
  submitComsultInput,
  customerReservationForm,
  queryCustomInfo,
  queryBookCustomerList,
  getUserInfo,
  getUserLabelInfo,
  addUserLabel,
  deleteCustomerLabel,
  getUserBookProjectInfo,
  updateCustomerBookProject,
  // deleteCustomerBookProject,
  editCustomerBookInfo,
  editCustomerBook,
  followUpRecord,
  followUpRecordList,
  addManualData,
  returnVisitPlan,
  customerCityList,
  ReturnVisit,
  // ReturnVisitRecord,
  GuestInformation,
  blacklist,
  remove,
  AlreadyArrived,
  AlreadyArrivedList,
  AlreadyArrivedAdd,
  returnVisitHospitalList,
  getNoArrivedInfoList,
  deleteList,
  selectRecommend,
  projectTreeselect,
  getProjectListItemId,
  noReturnVisit,
  noReassignment,
  returnVisitHospitalMerge,
  returnVisitRecordMerge,
  ComsultExport,
  noArrivedList,
  notDealReason,
  notRemove,
  AdmissionList,
  UnsettledItems,
  casualcustomer,
  selectQueryStatisticsHospital,
  importTemplate,
  memberUpgradeList,
  getPointsExchangeList,
importSysUserTemplate
}
