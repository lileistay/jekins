import { req } from '@/api/request'

// 客户需求关系表接口
function DemandRelationship(data) {
  return req('/api/confinement/customerDemandInfo/list', 'get', data)
}
// 需求管理接口
function DemandManagement(data) {
  return req('/api/confinement/demandInfo/list', 'get', data)
}
// 获取单条的需求管理数据
function getInfoDemandManagement(id) {
  return req('/api/confinement/demandInfo/' + id, 'get')
}
// 添加需求管理的接口
function addDemandManagement(data) {
  return req('/api/confinement/demandInfo', 'post', data)
}
// 修改需求管理的接口
function editDemandManagement(data) {
  return req('/api/confinement/demandInfo', 'put', data)
}
// 删除需求管理
function removeDemandManagement(id) {
  return req('/api/confinement/demandInfo/' + id, 'delete')
}

// 添加需求类型
function addDemandType(data) {
  return req('/api/confinement/demandTypeInfo', 'post', data)
}

// 需求类型接口
function DemandType(data) {
  return req('/api/confinement/demandTypeInfo/list', 'get', data)
}
// 删除需求类型

function removeDemandType(id) {
  return req('/api/confinement/demandTypeInfo/' + id, 'delete')
}
// 编辑需求类型
function editDemandType(data) {
  return req('/api/confinement/demandTypeInfo', 'put', data)
}
// 获取单条的数据类型
function getInfoDemandType(id) {
  return req('/api/confinement/demandTypeInfo/' + id, 'get')
}
// /confinement/customerDemandInfo

// 获取单条数据
function getInfoDemandRelationship(id) {
  return req('/api/confinement/customerDemandInfo/' + id, 'get')
}
// 添加和修改客户需求关系表接口
function addDemandRelationship(data) {
  return req('/api/confinement/customerDemandInfo', 'post', data)
}
// 编辑接口
function putDemandRelationship(data) {
  return req('/api/confinement/customerDemandInfo', 'put', data)
}

//业绩查询接口
function performanceManagement(data){
  return req('/api/payment/wforservice/performanceManagement', 'get', data)
}

//业务划扣
function deductionRecord(data){
  return req('/api/scribing/deductionRecord/ampHand','get',data)
}

function deductionRecordList(data){
  return req('/api/scribing/deductionRecord','post',data)
}
// 业绩冲减
function perDeduction(data){
  return req('api/scribing/deductionRecord','post',data)
}
// 分配业绩
function perDeductionPut(data){
  return req('api/scribing/deductionRecord','post',data)
}
export default {
  DemandRelationship,
  DemandManagement,
  DemandType,
  addDemandRelationship,
  putDemandRelationship,
  getInfoDemandRelationship,
  addDemandType,
  addDemandManagement,
  removeDemandType,
  getInfoDemandType,
  editDemandType,
  removeDemandManagement,
  getInfoDemandManagement,
  editDemandManagement,
  performanceManagement,
  deductionRecord,
  deductionRecordList,
  perDeduction,
  perDeductionPut
}
