import { req } from '@/api/request'

// 科室列表
function getBookDeptProjectList(data) {
  return req('/api/share/appointmentDeptPeojectInfo/list', 'get', data)
}

// 科室的增删改查
function BookDeptProjectOperate(data, methods, id) {
  if (id) {
    return req('/api/share/appointmentDeptPeojectInfo/' + id, methods)
  }
  return req('/api/share/appointmentDeptPeojectInfo', methods, data)
}

// 预约项目类型
function getBookDeptProjectTypeList(data) {
  return req('/api/share/appointmentPeojectTypeInfo/list', 'get', data)
}

// 预约项目类型增删改
function BookDeptProjectTypeOperate(data, methods, id) {
  if (id) {
    return req('/api/share/appointmentPeojectTypeInfo/' + id, methods)
  }
  return req('/api/share/appointmentPeojectTypeInfo', methods, data)
}

// 预约项目列表
function getBookProjectList(data) {
  return req('/api/share/appointmentBookingPeoject/list', 'get', data)
}

//
function BookProjectOperate(data, methods, id) {
  if (id) {
    return req('/api/share/appointmentBookingPeoject/' + id, methods)
  }
  return req('/api/share/appointmentBookingPeoject', methods, data)
}

// 部门预约项目
function DeptBookProject(data) {
  return req('/api/share/appointmentDeptPeojectRelation/list', 'get', data)
}

function DeptBookProjectOperate(data, methods, id) {
  if (id) {
    return req('/api/share/appointmentDeptPeojectRelation/' + id, methods)
  }
  return req('/api/share/appointmentDeptPeojectRelation', methods, data)
}

// 基本信息 --> 跟进记录
function followuprecord(data) {
  return req('/api/confinement/followUpRecord/list', 'get', data)
}
// 基本信息 --> 添加跟进记录
function addrecord(data) {
  return req('/api/confinement/followUpRecord', 'POST', data)
}

// 基本信息 --> 删除信息
function delet(id) {
  return req(`/api/confinement/followUpRecord/${id}`, 'DELETE')
}

//礼品类型列表
function giftTypeInfo(data) {
  return req('/api/share/giftTypeInfo/list', 'get', data)
}
//礼品类型新增
function giftTypeInfoAdd(data) {
  return req('/api/share/giftTypeInfo', 'post', data)
}
//礼品类型修改
function giftTypeInfoEdit(data) {
  return req('/api/share/giftTypeInfo', 'put', data)
}
//礼品类型删除
function giftTypeInfoDelete(id) {
  return req(`/api/share/giftTypeInfo/${id}`, 'DELETE')
}
//礼品基本信息列表
function giftBasicInfo(data) {
  return req('/api/share/giftTypeList/list', 'get', data)
}
//礼品基本信息新增
function giftBasicInfoAdd(data) {
  return req('/api/share/giftTypeList', 'post', data)
}
//礼品基本信息修改
function giftBasicInfoEdit(data) {
  return req('/api/share/giftTypeList', 'put', data)
}
//礼品基本信息修改
function giftBasicInfoDelete(id) {
  return req(`/api/share/giftTypeList/${id}`,'DELETE')
}
//会员级别维护列表
function membershipLevelInfo(data) {
  return req('/api/confinement/membershipLevelInfo/list','get',data)
}
//会员级别维护列表新增
function membershipLevelInfoAdd(data) {
  return req('/api/confinement/membershipLevelInfo','post',data)
}
//会员级别维护列修改
function membershipLevelInfoEdit(data) {
  return req('/api/confinement/membershipLevelInfo','put',data)
}
//会员级别维护列表删除
function membershipLevelInfoDelete(data) {
  return req(`/api/confinement/membershipLevelInfo/${data}`,'DELETE')
}

//老带新分成类型列表
function dividendTypeList(data) {
  return req('/api/confinement/dividendType/list','get',data)
}
//老带新分成类型新增
function dividendTypeAdd(data) {
  return req('/api/confinement/dividendType','post',data)
}
//老带新分成类型编辑
function dividendTypeEdit(data) {
  return req('/api/confinement/dividendType','put',data)
}
//老带新分成类型删除
function dividendTypeDelete(data) {
  return req(`/api/confinement/dividendType/${data}`,'DELETE')
}
//老带新分成比例列表
function dividendRatioList(data) {
  return req('/api/confinement/dividendRatio/list','get',data)
}
//老带新分成比例新增
function dividendRatioAdd(data) {
  return req('/api/confinement/dividendRatio','post',data)
}
//老带新分成类型修改
function dividendRatioEdit(data) {
  return req('/api/confinement/dividendRatio','put',data)
}
//老带新分成类型删除
function dividendRatioDelete(data) {
  return req(`/api/confinement/dividendRatio/${data}`,'DELETE')
}
//老带新收益审核
function getPromotionCommissionlist(data) {
  return req('/api/confinement/earningApply/getPromotionCommissionlist','get',data)
}
//老带新收益审核
function earningApply(data) {
  return req('/api/confinement/earningApply','put',data)
}
export default {
  getBookDeptProjectList,
  BookDeptProjectOperate,
  getBookDeptProjectTypeList,
  BookDeptProjectTypeOperate,
  getBookProjectList,
  BookProjectOperate,
  DeptBookProject,
  DeptBookProjectOperate,
  addrecord,
  delet,
  followuprecord,
  giftTypeInfo,
  giftTypeInfoAdd,
  giftTypeInfoEdit,
  giftTypeInfoDelete,
  giftBasicInfo,
  giftBasicInfoAdd,
  giftBasicInfoEdit,
  giftBasicInfoDelete,
  membershipLevelInfo,
  membershipLevelInfoAdd,
  membershipLevelInfoEdit,
  membershipLevelInfoDelete,
  dividendTypeList,
  dividendTypeAdd,
  dividendTypeEdit,
  dividendTypeDelete,
  dividendRatioList,
  dividendRatioAdd,
  dividendRatioEdit,
  dividendRatioDelete,
  getPromotionCommissionlist,
  earningApply
}
