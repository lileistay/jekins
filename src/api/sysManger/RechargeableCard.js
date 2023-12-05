// 4/19
// L
// 充值方面
import { req } from '@/api/request'

// 充值卡列表
function rechargeCardInfolist(data) {
  return req('/api/confinement/rechargeCardInfo/list', 'get', data)
}
// 充值卡修改
function rechargeCardInfo(data) {
  return req('/api/confinement/rechargeCardInfo', 'put', data)
}
// 充值卡添加
function addRecharge(data) {
  return req('/api/confinement/rechargeCardInfo', 'post', data)
}
// 充值卡删除
function deleterechargeCardInfo(rechargeCardIds) {
  return req(`/api/confinement/rechargeCardInfo/${rechargeCardIds}`, 'delete')
}
// 充值卡确认修改
function getInforechargeCardInfo(rechargeCardId) {
  return req(`/api/confinement/rechargeCardInfo/${rechargeCardId}`, 'get')
}

// 充值记录
function customCardlist(data) {
  return req('/api/payment/rechargeRecordInfo/list', 'get', data)
}
// 充值开卡
function customCardAdd(data) {
  return req('/api/payment/rechargeRecordInfo', 'post', data)
}

// 用户充值记录
function customCardSum(data) {
  return req('/api/payment/customCardSum/list', 'get', data)
}

// 充值卡（集团）
function groupRechargeList(data) {
  return req('/api/share/groupRecharge/list', 'get', data)
}
// 添加充值卡（集团）
function addGroupRecharge(data) {
  return req('/api/share/groupRecharge', 'post', data)
}
// 编辑充值卡（集团）
function editGroupRecharge(data) {
  return req('/api/share/groupRecharge', 'put', data)
}
// 充值卡删除
function deleteGroupRecharge(rechargeCardIds) {
  return req(`/api/share/groupRecharge/${rechargeCardIds}`, 'delete')
}
// 充值卡单个信息
function groupRechargeInfo(rechargeCardIds) {
  return req(`/api/share/groupRecharge/${rechargeCardIds}`, 'get')
}

export default {
  addRecharge,
  rechargeCardInfo,
  rechargeCardInfolist,
  deleterechargeCardInfo,
  getInforechargeCardInfo,
  customCardlist,
  customCardAdd,
  customCardSum,
  groupRechargeList,
  addGroupRecharge,
  editGroupRecharge,
  deleteGroupRecharge,
  groupRechargeInfo
}
