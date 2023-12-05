import { req } from '@/api/request'
import { praseStrEmpty } from '@/utils/shiguang'
import { download } from '@/utils/request'
import { putReq } from '@/api/request'

// 个人中心
// 个人信息
function getUserProfile() {
  return req('/api/system/user/profile', 'get')
}

// 修改密码

function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return putReq('/api/system/user/profile/updatePwd', 'put', data)
}

// 头像
function uploadAvatar(data) {
  return req('/api//system/user/profile/avatar', 'post', data)
}

// 查询用户列表
function userList(data, methods) {
  return req('/api/system/user/list', methods, data)
}

// 查询用户详细
function getUser(id, methods) {
  return req('/api/system/user/' + praseStrEmpty(id), methods)
}

// 用户增删改
function userOperator(data, methods, id) {
  if (id) {
    return req('/api/system/user/' + id, methods)
  }
  return req('/api/system/user', methods, data)
}

// 用户状态修改
function changeUserStatus(data) {
  return req('/api/system/user/changeStatus', 'put', data)
}

// 导出模板
function exportTemplete(data) {
  return download('/api/system/user/importTemplate', {
    ...data
  }, `user_template_${new Date().getTime()}.xlsx`)
}

// 导出用户
function userExport(data) {
  return download('/api/system/user/export', {
    ...data
  }, `user_${new Date().getTime()}.xlsx`)
}

// 重置密码
function resetUserPwd(data) {
  return req('/api/system/user/resetPwd', 'put', data)
}

// 查询授权角色
function getAuthRole(id) {
  return req('/api/system/user/authRole/' + id, 'get')
}

//
function updateAuthRole(data) {
  return req('/api/system/user/authRole', 'put', data)
}

// 获取系统用户列表
function getUserList(data) {
  return req('/api/system/user/userList', 'get', data)
}

// 根据用户电话/id查询顾客信息
function getUserInfoByPhone(data) {
  return req('api/confinement/customerCmt/selectNamePhone', 'get', data)
}

// 根据用户id查询顾客详情
function getUserInfoById(id) {
  return req('api/confinement/customerCmt/' + id, 'get')
}



// 修改
function updateUserInfo(data) {
  return req('api/confinement/customerCmt', 'put', data)
}

// 验证密码是否正确
function passwordValid(data) {
  return req('/api/system/user/pwdverifiers/' + data, 'get')
}
// 产品信息维护
// ---------------------
// 列表
function malist(data) {
  return req('/api/confinement/projectInfo/list', 'get', data)
}
// 新增
function productAdd(data) {
  return req('/api/confinement/projectInfo', 'post', data)
}
// 删除
function projdeles(id) {
  return req(`/api/confinement/projectInfo/${id}`, 'DELETE')
}
// 修 getinfo
function projecgetinfo(id) {
  return req(`/api/confinement/projectInfo/${id}`, 'get')
}
// 确定改
function projectedit(data) {
  return req('/api/confinement/projectInfo', 'put', data)
}
// 顾客回访 -- 已到院
function getinfo(id) {
  return req(`/api/confinement/customerCmt/${id}`, 'get')
}
// 次数
function totalConsumptionTimes(id) {
  return req(`/api/payment/orderInfo/totalConsumptionTimes/${id}`, 'get')
}
// 通过顾客id获取电话列表
function getPhonesByCustomerId(id) {
  return req(`/api/confinement/customPhoneList/getPhonesByCustomerId/?id=`+id, 'get')
}
function usrtlist(data) {
  return req('/api/confinement/customerLabelRelation/list', 'get', data)
}
// 已到院 跟进记录
function Follow_up_record(data) {
  return req('/api/confinement/followUpRecord/list', 'get', data)
}
// 已到院 未成交项目
function unsettledItems(data) {
  return req('/api/confinement/noDealProjecInfo/list', 'get', data)
}
// 临客预约记录列表
function customerReservationForm(customId) {
  return req(`/api/confinement/customerReservationForm/getCustom/${customId}`, 'get')
}
// 跟进记录
// 增
function recordAdd(data) {
  return req('/api/confinement/followUpRecord', 'post', data)
}
// 删
function recordremove(id) {
  return req(`/api/confinement/followUpRecord/${id}`, 'DELETE')
}
// 查
function recordlist(data) {
  return req('/api/confinement/followUpRecord/list', 'get', data)
}

// 临客列表
function customerCmtList(data) {
  return req('/api/confinement/customerCmt/guestList', 'get', data)
}

// 导出客户列表
function exportGuestList(data) {
  return download('/api/confinement/customerCmt/exportGuestList', {
    ...data
  }, `customer_${new Date().getTime()}.xlsx`)
}
function customerCmtput(data) {
  return req('/api/confinement/customerCmt', 'put', data)
}
// 修改
function customerCmt(id) {
  return req(`/api/confinement/customerCmt/${id}`, 'get')
}
// 根据id查询客户电话号码
function customidGetPhone(data) {
  return req('/api/confinement/customerCmt/customidGetPhone', 'get', data)
}
// 微信小程序
// 用户列表
function userInfoList(data) {
  return req('/api/nuclein/userInfo/list', 'get', data)
}
// 修改
function userInfoGetinfo(id) {
  return req(`/api/nuclein/userInfo/${id}`, 'get')
}
function userInfoEdit(data) {
  return req('/api/nuclein/userInfo', 'put', data)
}
// 核酸退款审核
function nucleinRefundInfoList(data) {
  return req('/api/nuclein/nucleinRefundInfo/list', 'get', data)
}
// 核酸检测订单表
function nucleinOrderInfoList(data) {
  return req('/api/nuclein/nucleinOrderInfo/list', 'get', data)
}
// 修改入住日期
function roomReservationStatus(data) {
  return req('/api/payment/roomReservationStatus/selectUpdateList', 'get', data)
}
// 修改 修改入住日期
function updateCheckTime(data) {
  return req('/api/payment/roomReservationStatus/updateCheckTime', 'get', data)
}

export default {
  userList,
  getUser,
  userOperator,
  changeUserStatus,
  exportTemplete,
  userExport,
  resetUserPwd,
  getAuthRole,
  updateAuthRole,
  getUserList,
  getUserInfoByPhone,
  getUserInfoById,
  updateUserInfo,
  passwordValid,
  productAdd,
  malist,
  projdeles,
  getinfo,
  projectedit,
  projecgetinfo,
  usrtlist,
  Follow_up_record,
  customerReservationForm,
  recordAdd,
  recordlist,
  recordremove,
  getUserProfile,
  updateUserPwd,
  uploadAvatar,
  unsettledItems,
  customerCmtList,
  customerCmt,
  exportGuestList,
  customerCmtput,
  customidGetPhone,
  userInfoList,
  userInfoGetinfo,
  nucleinRefundInfoList,
  nucleinOrderInfoList,
  userInfoEdit,
  roomReservationStatus,
  updateCheckTime,
  getPhonesByCustomerId,
  totalConsumptionTimes
}
