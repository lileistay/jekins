import {postReq, putReq, req} from '@/api/request'

// 开单管理(公司)
function BillingManagement(data) {
  return req('/api/confinement/receptionInformationList/billingList', 'get', data)
}
function BillingManagementlist(data) {
  return req('/api/confinement/receptionInformationList/yzFangJianList', 'get', data)
}
// 二开单管理(公司)
function secondbillingList(data) {
  return req('/api/confinement/receptionInformationList/secondbillingList', 'get', data)
}

// 套餐开单
function setMealInsert(data) {
  return req('/api/payment/orderInfo/setMealInsert', 'post', data)
}

// 开单查询
function orderInfo(data) {
  return req('/api/payment/orderInfo/list', 'get', data)
}

// 欠款明细
function debtDetailsList(data) {
  return req('/api/payment/debtInfoList/debtDetailsList', 'get', data)
}

// 还款明细
function repaymentOrderDetails(data) {
  return req('/api/payment/paymoneyInfo/repaymentOrderDetails', 'get', data)
}

// 订单详情
function getOrderInfo(orderId) {
  return req(`/api/payment/orderInfo/${orderId}`, 'get')
}

// 开单 修改
function editOrderInfo(data) {
  return req('/api/payment/orderInfo', 'put', data)
}

// 开单
function addOrderInfo(data) {
  return req('/api/payment/orderInfo', 'POST', data)
}

// 删除开单
function removeOrderInfo(data) {
  return postReq('/api/payment/orderInfo/remove', 'DELETE', data)
}

// /payment/toBePaidList/myPaymentInfo
function ChargeList(data) {
  return req('/api/payment/toBePaidList/myPaymentInfo', 'get', data)
}
//二开收费单列表
function myPaymentInfoTow(data) {
  return req('/api/payment/toBePaidList/myPaymentInfoTow', 'get', data)
}
// 还款管理 欠款明细
function debtList(data) {
  return req('/api/payment/debtInfoList/debtList', 'get', data)
}

// 收费明细
function orderDetailsList(data) {
  return req('/api/payment/orderDetails/list', 'get', data)
}
function neworderDetailsList(data) {
  return req('/api/payment/orderDetails/getRegularChargeSheetList', 'get', data)
}
// 从月子房间开辅助治疗获取用户信息
function getReceptionInformation(data) {
  return req('/api/confinement/receptionInformationList/getReceptionInformation', 'get', data)
}
// 套餐明细打印
function packageDetailPrint(data) {
  return req(`/api/payment/orderDetails/packageDetailPrint`, 'get', data)
}

// 预约金结算 预约产品列表
function reservationDataList(data) {
  return req('/api/payment/reservationData/list', 'get', data)
}

// 预约金收费单
function advanceConsumptionRecordList(data) {
  return req('/api/payment/advanceConsumptionRecord/list', 'get', data)
}

// 预约金额记录
function appentRecord(data) {
  return req(`/api/payment/advanceConsumptionRecord/appentRecord`, 'get', data)
}

// 预约金收费明细
function reservationDataDetailed(data) {
  return req('/api/payment/reservationData/list', 'get', data)
}

// 辅助治疗收费明细
function adjuvantBillingInfo(data) {
  return req('/api/payment/adjuvantBillingInfo/list', 'get', data)
}

// 辅助治疗收费明细
function adjuvantBillingList(data) {
  return req('/api/payment/adjuvantBillingList/list', 'get', data)
}

// 辅助治疗单，住院结算单及退款、还款 /payment/adjuvantBillingList/selectCusromerList
function selectCusromerList(data) {
  return req('/api/payment/wforservice/selectCusromerList', 'get', data)
}

// 住院押金记录
function hospitalizationDepositList(data) {
  return req('/api/payment/hospitalizationDepositRecord/list', 'get', data)
}

// 收费记录列表
function ChargeRecord(data) {
  return req('/api/payment/chargeRecordInfo/list', 'get', data)
}

// 储值列表
function rechargeConsumptionInfoList(data) {
  return req('/api/payment/rechargeConsumptionInfo/list', 'get', data)
}

// 查询储值卡记录
function storedRecordList(data) {
  return req('/api/payment/rechargeConsumptionInfo/storedRecord', 'get', data)
}

function StoredValue(data) {
  return req('/api/payment/rechargeRecordInfo/list', 'get', data)
}

// 欠款列表
function debtInfoList(data) {
  return req('/api/payment/debtInfo/list', 'get', data)
}

// 欠款详情列表
function debtDetailsInfoList(data) {
  return req('/api/payment/wforservice/list', 'get', data)
}

// 待服务列表
function wforserviceList(data) {
  return req('/api/payment/wforservice/list', 'get', data)
}

// 顾客需求查询
function queryCustomerDemand(data) {
  return req('/api/confinement/customerDemandInfo/queryCustomerDemand', 'get', data)
}

// 收银查询
function chargeRecordInfo(data) {
  return req('/api/payment/chargeRecordInfo/selectsettlement', 'get', data)
}

// 收银明细查询
function chargeRecordInfoDetails(data) {
  return req('/api/payment/chargeRecordInfo/selectSettlementDetails', 'get', data)
}

// 结账方式查询
function settlementMethod(data) {
  return req('/api/payment/chargeRecordInfo/settlementMethod', 'get', data)
}

// 结账方式明细查询
function settlementMethodDetails(data) {
  return req('/api/payment/chargeRecordInfo/settlementMethodDetails', 'get', data)
}

// 查询退款数据
function selectOldPayRecords(data) {
  return req('/api/payment/chargeRecordInfo/selectOldPayRecords', 'get', data)
}

// 查询顾客预约天数
function queryAppointment(data) {
  return req('/api/payment/roomReservationStatus/queryAppointment', 'get', data)
}

// 查询房间预约信息
function selectRoomAppointment(data) {
  return req('/api/payment/roomReservationStatus/selectRoomAppointment', 'get', data)
}

// 暂停划扣
function updateRoomStart(data) {
  return putReq('/api/payment/roomReservationStatus/updateRoomStart', 'post', data)
}

// 月子房间 未预约
function roomBill(data) {
  return putReq('/api/payment/wforservice/roomBill', 'get', data)
}
// 收费记录·列表
function chargeRecordInfoList(data) {
  return putReq('/api/payment/chargeRecordInfo/channelRecords', 'get', data)
}
// 收费记录修改
function chargeRecordInfoEdit(data) {
  return req('/api/payment/chargeRecordInfo', 'put', data)
}
export default {
  BillingManagement,
  secondbillingList, // 二开
  orderInfo,
  BillingManagementlist,
  addOrderInfo,
  ChargeList,
  myPaymentInfoTow,
  debtList,
  orderDetailsList,
  neworderDetailsList,
  editOrderInfo,
  removeOrderInfo,
  reservationDataDetailed,
  adjuvantBillingInfo,
  adjuvantBillingList,
  ChargeRecord,
  rechargeConsumptionInfoList,
  setMealInsert,
  debtInfoList,
  wforserviceList,
  debtDetailsInfoList,
  getOrderInfo,
  hospitalizationDepositList,
  queryCustomerDemand,
  chargeRecordInfo,
  chargeRecordInfoDetails,
  settlementMethod,
  settlementMethodDetails,
  selectOldPayRecords,
  queryAppointment,
  advanceConsumptionRecordList,
  selectCusromerList,
  StoredValue,
  selectRoomAppointment,
  updateRoomStart,
  roomBill,
  debtDetailsList,
  repaymentOrderDetails,
  appentRecord,
  storedRecordList,
  reservationDataList,
  packageDetailPrint,
  getReceptionInformation,
  chargeRecordInfoList,
  chargeRecordInfoEdit
}
