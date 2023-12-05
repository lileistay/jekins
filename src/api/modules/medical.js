import { req } from '@/api/request'
import { putReq } from '@/api/request'
import data from '@/api/sysManger/dict/data'
import qs from 'qs'
// 皮肤排期分诊
function skinTriageList(data) {
  return req('/api/payment/wforservice/skinTriageList', 'get', data)
}
function addDeductionRecord(data) {
  return req('/api/scribing/deductionRecord', 'post', data)
}
function addDeductionRecords(data) {
  return req('/api/scribing/deductionRecord/adds', 'post', data)
}

//科室挂号
function deptRegnInfo(data){
  return req('/api/hospital/deptRegnInfo', 'post', data)
}

// 直接治疗
function directTreatment(data) {
  return req('/api/scribing/deductionRecord/directTreatment', 'post', data)
}
function directTreatments(data) {
  return req('/api/scribing/deductionRecord/directTreatments', 'post', data)
}

function editDeductionRecord(data) {
  return req('/api/scribing/deductionRecord', 'put', data)
}

function editDeductionRecords(data) {
  return req('/api/scribing/deductionRecord/edits', 'put', data)
}
// 划扣记录
function selectTreatment(data) {
  return req('/api/scribing/deductionRecord/selectTreatment', 'get', data)
}
// 复诊查询
function deductionOperationFollowup(data) {
  return req('/api/scribing/deductionOperationFollowup/list', 'get', data)
}
// 复诊查询
function deductionOperationFollowupAdd(data) {
  return req('/api/scribing/deductionOperationFollowup', 'post', data)
}
// 划扣记录 修改
function deductionRecordedit(data) {
  return req('/api/scribing/deductionRecord', 'put', data)
}
// 仪器管理
function deviceManagementlist(data) {
  return req('/api/share/deviceManagement/list', 'get', data)
}
function deptRegnInfolist(data){
  return req('/api/hospital/deptRegnInfo/list', 'get', data)
}
// 添加
function adddeviceManagement(data) {
  return req('/api/share/deviceManagement', 'post', data)
}
// 修改
function getinfodeviceManagement(deviceId) {
  return req(`/api/share/deviceManagement/${deviceId}`, 'get')
}
function putdeviceManagement(data) {
  return req('/api/share/deviceManagement', 'put', data)
}
// 删除
function removedeviceManagement(deviceIds) {
  return req(`/api/share/deviceManagement/${deviceIds}`, 'delete')
}
// 回访类型管理
function returnVisitTypeInfolist(data) {
  return req('/api/share/returnVisitTypeInfo/list', 'get', data)
}
// 新增
function addreturnVisitTypeInfo(data) {
  return req('/api/share/returnVisitTypeInfo', 'post', data)
}
// 修改
function getinforeturnVisitTypeInfo(returnTypeId) {
  return req(`/api/share/returnVisitTypeInfo/${returnTypeId}`, 'get')
}
function editreturnVisitTypeInfo(data) {
  return req('/api/share/returnVisitTypeInfo', 'put', data)
}
// 删除
function removereturnVisitTypeInfo(returnTypeIds) {
  return req(`/api/share/returnVisitTypeInfo/${returnTypeIds}`, 'delete')
}
// 回访基础信息维护
function returnVisitTypeList(data) {
  return req('/api/share/returnVisitTypeList/list', 'get', data)
}
// 新增
function addreturnVisitTypeList(data) {
  return req('/api/share/returnVisitTypeList', 'post', data)
}
// 修改
function getInforeturnVisitTypeList(visitId) {
  return req(`/api/share/returnVisitTypeList/${visitId}`, 'get')
}
function editreturnVisitTypeList(data) {
  return req('/api/share/returnVisitTypeList', 'put', data)
}
// 删除
function removereturnVisitTypeList(visitIds) {
  return req(`/api/share/returnVisitTypeList/${visitIds}`, 'delete')
}
// 月子房间预约列表
function selectRoomReservation(data) {
  return req('/api/payment/roomReservationStatus/selectRoomReservation', 'get', data)
}
// 整形首诊登记 发起治疗
function hospitalInfoPost(data) {
  return req('/api/hospital/hospitalInfo', 'post', data)
}
// 整形首诊登记 住院管理
function hospitalInfoList(data) {
  return req('/api/hospital/hospitalInfo/list', 'get', data)
}
// 整形首诊登记 住院管理-修改住院休息
function hospitalInfoEdit(data) {
  return req('/api/hospital/hospitalInfo', 'put', data)
}

// 获取药品领取/退药列表(药房)
function getDispenseMedicineLists(data) {
  return req('api/hospital/hospitalMedicalAdvice/getDispenseMedicineList', 'get', data)
}
// 获取配药/退药列表详情
function getDispenseMedicineInfo(data) {
  return req('api/hospital/hospitalMedicalAdvice/getDispenseMedicineInfo', 'get', data)
}
// 通过产品主键查询库存
function getListByItemId(data) {
  return req('api/confinement/projectInfo/getListByItemId', 'get', data)
}
// .住院领药 get
function addHospitalReceive(data) {
  return req('api/sorage/outInfo/addHospitalReceive', 'post', data)
}
export default {
  skinTriageList,
  addDeductionRecord,
  addDeductionRecords,
  deviceManagementlist,
  adddeviceManagement,
  removedeviceManagement,
  getinfodeviceManagement,
  putdeviceManagement,
  selectTreatment,
  deductionRecordedit,
  editDeductionRecord,
  directTreatment, // 直接治疗
  directTreatments, // 直接治疗
  editDeductionRecords,
  returnVisitTypeInfolist,
  addreturnVisitTypeInfo,
  getinforeturnVisitTypeInfo,
  editreturnVisitTypeInfo,
  removereturnVisitTypeInfo,
  returnVisitTypeList,
  addreturnVisitTypeList,
  getInforeturnVisitTypeList,
  editreturnVisitTypeList,
  removereturnVisitTypeList,
  selectRoomReservation,
  hospitalInfoPost,
  hospitalInfoList,
  hospitalInfoEdit,
  getDispenseMedicineLists,
  getDispenseMedicineInfo,
  getListByItemId,
  addHospitalReceive,
  deductionOperationFollowup,
  deductionOperationFollowupAdd, //新增复诊,
  deptRegnInfo,
  deptRegnInfolist
}
