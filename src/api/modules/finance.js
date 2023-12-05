import { req } from '@/api/request'
import { putReq } from '@/api/request'

// 收费单打回
function repulseReceipt(data) {
  return putReq('/api/payment/orderInfo/repulseOrderList', 'put', data)
}

function toBePaidList(data) {
  return req('/api/payment/toBePaidList/toBePaidList', 'get', data)
}

function nucleinOrderInfoList(data) {
  return req('/api/nuclein/nucleinOrderInfo/list', 'get', data)
}


function getCustomerWforservice(data) {
  return req('api/payment/wforservice/getCustomerWforservice', 'get', data)
}
function toBePaid(data) {
  return req('/api/payment/toBePaidList/toBePaid', 'get', data)
}

// 收费渠道
function paymentChannelList(data) {
  return req('/api/share/paymentChannel/list', 'get', data)
}

// 公司收费渠道
function payDeptChannelRecord(data) {
  return req('/api/share/payDeptChannelRecord/list', 'get', data)
}

// 公司收费渠道 添加
function payDeptChannelAdd(data) {
  return req('/api/share/payDeptChannelRecord', 'post', data)
}

// 公司收费渠道 编辑
function payDeptChannelEdit(data) {
  return req('/api/share/payDeptChannelRecord', 'put', data)
}

// 公司收费渠道获取详情
function payDeptChannelInfo(deptPayChannelId) {
  return req(`/api/share/payDeptChannelRecord/${deptPayChannelId}`, 'get')
}

// 添加
function paymentChannelAdd(data) {
  return req('/api/share/paymentChannel', 'post', data)
}

// 删除
function paymentChannelRemove(payIds) {
  return req(`/api/share/paymentChannel/${payIds}`, 'DELETE')
}

function payDeptChannelRecordRemove(deptChannel) {
  return req(`/api/share/payDeptChannelRecord/${deptChannel}`, 'DELETE')
}

function paymentChannelEdit(data) {
  return req('/api/share/paymentChannel', 'put', data)
}

// 修改成功
function paymentChannelGetInfo(payId) {
  return req(`/api/share/paymentChannel/${payId}`, 'get')
}

// 预约金列表
function advancePaymentRecordList(data) {
  return req('/api/payment/advancePaymentRecord/list', 'get', data)
}

// 结账
function checkOut(data) {
  return req('/api/payment/chargeRecordInfo/checkOut', 'post', data)
}

// 已结账列表
function paidList(data) {
  return req('/api/payment/toBePaidList/paidList', 'get', data)
}

// 已结账列表明细
function paidListDetails(data) {
  return req('/api/payment/toBePaidList/selectPaidDetails', 'get', data)
}

// 收银交接单
function cashierHandover(data) {
  return req('/api/payment/toBePaidList/cashierHandover', 'get', data)
}

// 收费类型统计打印
function chargeTypeStatistics(data) {
  return req('/api/payment/toBePaidList/chargeTypeStatistics', 'get', data)
}

// 财务获取顾客住院押金
function hospitalizationDepositRecord(data) {
  return req('api/payment/hospitalizationConsumptionRecord/selectHospitalization', 'get', data)
}

// 财务点击查询详情
function selectHospitalizationRecord(data) {
  return req('api/payment/hospitalizationConsumptionRecord/selectHospitalizationRecord', 'get', data)
}

// 结账获取顾客住院押金
function hospitalizationDepositRecordList(data) {
  return req('api/payment/hospitalizationDepositRecord/list', 'get', data)
}

// 收费单药品查询
function wfBillList(data) {
  return req('api/payment/wforservice/wfBillList', 'get', data)
}

// 收费单药品查询
function getMaterialList(orderNumber) {
  return req(`api/payment/wforservice/getMaterialList?orderNumber=${orderNumber}`, 'get')
}

// // 领药药品清单查询
// function drugList(data) {
//   return req('api/payment/wforservice/chargeSheetDrug', 'get', data)
// }

// 领药药品清单查询
function drugList(data) {
  return req('api/payment/orderMaterialsReceive/chargeSheetDrug', 'get', data)
}

// 退药药品清单查询
function drugListMedic(data) {
  return req('api/sorage/outList/drugWithdrawal', 'get', data)
}

// 退药确定按钮
function drugSure(data) {
  return req('api/sorage/insertList/addDrugWithdrawal', 'post', data)
}
//住院退药
function newdrugSure(data) {
  return req('api/hospital/hospitalMedicalAdvice/addRefundDrug', 'post', data)
}


// 预约金查询
function advanceConsumptionRecord(data) {
  return req('api/payment/advanceConsumptionRecord/selectStatistics', 'get', data)
}

// 储值查询
function chargeRecordInfo(data) {
  return req('api/payment/chargeRecordInfo/queryCardStoredValue', 'get', data)
}

// 储值查询
function rechargeConsumptionInfo(data) {
  return req('api/payment/rechargeConsumptionInfo/selectStatistics', 'get', data)
}

// 住院押金查询
function hospitalizationConsumptionRecordList(data) {
  return req('api/payment/hospitalizationConsumptionRecord/list', 'get', data)
}

function hospitalizationConsumptionRecord(data) {
  return req('api/payment/hospitalizationConsumptionRecord/selectStatistics', 'get', data)
}

// 欠款明细 还款明细
function debtInfoList(data) {
  return req('api/payment/debtInfoList/list', 'get', data)
}

// 还款list
function paymoneyInfoList(data) {
  return req('api/payment/paymoneyInfo/list', 'get', data)
}

// 欠款查询 欠款明细
function selectSumStatisticsList(data) {
  return req('api/payment/debtInfoList/selectSumStatisticsList', 'get', data)
}

// 住院 退款
function drugWithdrawal(data) {
  return req('api/sorage/outList/outmedicinewarehousehospital', 'get', data)
}
function signinInfoList(data) {
  return req('/api/confinement/signinInfo/list', 'get', data)
}
// 反结账
function antiSettlement(data) {
  return putReq('/api/payment/orderInfo/antiSettlement', 'put', data)
}

export default {
  paidList,
  toBePaidList,
  paymentChannelList,
  paymentChannelAdd,
  paymentChannelRemove,
  paymentChannelGetInfo,
  paymentChannelEdit,
  payDeptChannelRecord,
  payDeptChannelAdd,
  payDeptChannelEdit,
  payDeptChannelRecordRemove,
  repulseReceipt,
  advancePaymentRecordList,
  checkOut,
  paidListDetails,
  nucleinOrderInfoList,
  cashierHandover,
  chargeTypeStatistics,
  wfBillList,
  getMaterialList,
  hospitalizationDepositRecord,
  advanceConsumptionRecord,
  chargeRecordInfo,
  rechargeConsumptionInfo,
  hospitalizationConsumptionRecordList,
  hospitalizationConsumptionRecord,
  debtInfoList,
  selectSumStatisticsList,
  paymoneyInfoList,
  drugList,
  drugListMedic,
  drugSure,
  drugWithdrawal,
  selectHospitalizationRecord,
  hospitalizationDepositRecordList,
  newdrugSure,
  signinInfoList,
  getCustomerWforservice,
  antiSettlement
}
