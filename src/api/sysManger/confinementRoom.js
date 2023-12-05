import {putReq, req} from '@/api/request'

function roomInfoList(data) {
  return req('/api/share/roomInfo/list', 'get', data)
}
function addRoomInfo(data) {
  return req('/api/share/roomInfo', 'post', data)
}
//获取床位列表
function RoomInfoList(data) {
  return req('/api/share/inpatientBed/list', 'get', data)
}
//床位管理新增床位
function AddRoom(data){
  return req('/api/share/inpatientBed', 'post', data)
}
//上传图片
function unload(data){
  return req('/api/file/upload', 'post', data)
}
function companyMemberlist(data) {
  return req('/api/client/companyMember/list', 'get', data)
}

//新增成员
function companyMember(data){
  return req('/api/client/companyMember', 'post', data)
}
//新增图片
function photoInfo(data){
  return req('/api/client/photoInfo/addBatchPhotoInfo', 'post', data)
}
//新增企业
function companyBasicsInfo(data){
  return req('/api/client/companyBasicsInfo', 'post', data)
}

//获取床位编号
function GetroomNumber(data){
  return req('/api/share/roomInfo/list', 'get', data)
}
//修改床位信息
function EditroomNumber(data){
  return req('/api/share/inpatientBed', 'put', data)
}
//删除床位信息
function RemoveroomNumber(data){
  return req(`/api/share/inpatientBed/${data}`, 'delete')
}
//获取分床信息
function RoomTypeInfoList(data){
  return req('/api/share/inpatientBed/getInpatientBedList', 'get',data)
}
//获取护理左侧列表
function nurseLeft(data){
  return req('/api/hospital/hospitalInfo/list', 'get', data)
}
//获取右侧上部信息
function nurseRightTop(data){
  return req('/api/hospital/hospitalInfo/getHospitalInfoByCustomId', 'get', data)

}
//获取医嘱记录
function listGroup(data){
  return req('/api/hospital/hospitalMedicalAdvice/listGroup', 'get', data)
}
//添加医嘱
function addBatch(data){
  return req('/api/hospital/hospitalMedicalAdvice/addBatch', 'post', data)
}
//记录查询
function hospitalCopyRecord(data){

  return req('/api/hospital/hospitalMedicalAdvice/getMedicalAdviceList', 'get', data)
}
//费用树
function expenseTypeGroup(data){
  return req('/api/hospital/hospitalExpenseRecord/expenseTypeGroup', 'get', data)
}
//校对
function MedicalAdvice(data){
  return req('/api/hospital/hospitalMedicalAdvice/listGroup', 'get', data)
}
// 获取系统用户列表
function getUserList(data) {
  return req('/api/system/user/userList', 'get', data)
}
//修改医嘱校对状态 put
function editBatchState(data){
  return req('/api/hospital/hospitalMedicalAdvice/editBatchState', 'put', data)
}
//皮试列表
function skinList(data){
  return req('/api/hospital/hospitalSkinTest/list', 'get', data)
}
//添加皮试记录
function hospitalSkinTest(data){
  return req('/api/hospital/hospitalSkinTest', 'post', data)
}
//获取费用记录
function hospitalExpenseRecord(data){
  return req('/api/hospital/hospitalExpenseRecord/list', 'get', data)
}
//费用汇总
function expenseSummaryList(data){
  return req('/api/hospital/hospitalExpenseRecord/expenseSummaryList', 'get', data)
}
//退费记录

function backList(data){
  return req('/api/hospital/hospitalExpenseRecord/list', 'get', data)
}
//计价内容
function listPricingContent(data){
  return req('/api/hospital/hospitalMedicalAdvice/listPricingContent', 'get', data)
}
//抄送记录
function listByGroupNum(data){
  return req('/api/hospital/hospitalCopyRecord/listByGroupNum', 'get', data)
}
//执行记录
function listEnforcement(data){
  return req('/api/hospital/hospitalMedicalAdvice/listEnforcement', 'get', data)
}
//获取抄送列表
function listCopyMedicalAdvice(data){
  return req('/api/hospital/hospitalMedicalAdvice/listCopyMedicalAdvice', 'get', data)
}
//获取扣费执行列表

function listPricingExecute(data){
  return req('/api/hospital/hospitalMedicalAdvice/listPricingExecute', 'get', data)
}
//修改抄送数据
function editBatchStates(data){
  return req('/api/hospital/hospitalMedicalAdvice/editBatchState', 'put', data)
}
//配药列表
function getPharmacyDispensingList(data){
  return req('/api/hospital/hospitalMedicalAdvice/getPharmacyDispensingList', 'get', data)
}
//护理列表
function getNursingPrintList(data){
  return req('/api/hospital/hospitalMedicalAdvice/getNursingPrintList', 'get', data)
}
//护理打印
function getInfusionCard(data){
    return req('/api/hospital/hospitalCopyRecord/getInfusionCard', 'get', data);
}
//申请出院出院情况
function cure_result(){
  return req('/api/system/dict/data/type/cure_result', 'get')
}
//申请出院出院方式
function leave_flag(){
  return req('/api/system/dict/data/type/leave_flag', 'get')
}
//申请出院
function updatedto(data){
  return req('/api/hospital/hospitalInfo/updatedto', 'put', data)
}
//修改住院信息
function hospitalInfo(data){
  return req('/api/hospital/hospitalInfo', 'put', data)
}
//获取产品列表
function  projectList(data){
  return req('/api/confinement/projectInfo/list', 'get', data);
}
//发起住院修改
function getCustomerHospitalInfo(data){
  return req('/api/hospital/hospitalInfo/getCustomerHospitalInfo', 'get', data);
}
//给药途径
function Route(){
  return req('/api/share/drugDeliveryRoute/list', 'get');

}
//好多呀
function RemoveroomNumbers(data){
  return req(`/api/hospital/hospitalMedicalAdvice/${data}`, 'delete')
}
//添加护理记录
function hospitalFirstnursingRecord(data){
  return req('/api/hospital/hospitalFirstnursingRecord', 'post', data)
}
function newhospitalFirstnursingRecord(data){
  return req('/api/hospital/hospitalFirstnursingRecord', 'put', data)
}
//修改护理记录
function hospitalNursingRecords(data){
  return req('/api/hospital/hospitalNursingRecords', 'post', data)
}
//护理记录列表
function singRecords(data){
  return req('/api/hospital/hospitalNursingRecords/list', 'get', data);
}
//获取电子病历模板
 function caseTemplateClassifyList(data) {
  return req('/api/hospital/caseTemplateClassify/list', 'get', data)
}

//新添加护理记录
function addBatchNursingRecords(data){
  return req('/api/hospital/hospitalNursingRecords/addBatchNursingRecords', 'post', data)
}
//修改护理记录

function editBatchNursingRecords(data){
  return req('/api/hospital/hospitalNursingRecords/editBacthNursingRecords', 'put', data)
}
//获取住院信息
function getHospitalInfoList(data){
  return req('/api/hospital/hospitalInfo/getHospitalInfoList', 'get', data)
}
//修改长期医嘱
function  cqeditBatch(data){
  return req('/api/hospital/hospitalMedicalAdvice/editBatch', 'put', data)
}

function getInfoByInHospitalId(data){
  return req('/api/hospital/hospitalFirstnursingRecord/getInfoByInHospitalId', 'get', data)
}
//提交出院
function hospitalInfot(data){
  return req('/api/hospital/hospitalInfo/submitHospitalInfo', 'get', data)

}
//获取楼层接口
function getFloorInfoTree(){
  return req('/api/share/floorInfo/getFloorInfoTree', 'get')
}
//电子病历个人模板
function hospitalCaseTemplate(data){
  return req('/api/hospital/hospitalCaseTemplate/list', 'get',data)
}
//删除电子病历模板
function hospitalCaseTemplateDel(data){
  return req(`/api/hospital/hospitalCaseTemplate/${data}`, 'delete')
}
function roomReservationStatus(data){
  return req('/api/payment/roomReservationStatus', 'put', data)
}
//获取会员信息
function getInfoById(data){
  return req('/api/confinement/memberPoints/getInfoById', 'get',data)
}
//积分兑换列表
function listById(data){
  return req('/api/confinement/memberPointsExchange/listById', 'get',data)
}
//积分变动信息
function getListByIdChange(data){
  return req('/api/confinement/memberPointsInfo/getListById', 'get',data)
}
//住院费用清单打印
function getHospitalExpenseRecordList(data){
  return req('/api/hospital/hospitalExpenseRecord/getHospitalExpenseRecordList', 'get',data)
}

function hospitalCaseTemplateDelel(data){
  return req(`/api/client/companyMember/${data}`, 'delete')
}
function getOutListTota(data){
  return req('/api/sorage/outList/getOutListTotal', 'get',data)
}


//收费批量打印
// function adc(data){
//   return req('/api/hospital/hospitalNursingRecords', 'post', data)
// }





// //费用记录汇总
// function expenseSummaryList(data){
//   return req('/api/hospital/hospitalExpenseRecord/expenseSummaryList', 'get', data)
// }













function editRoomInfo(data) {
  return req('/api/share/roomInfo', 'put', data)
}
function removeRoomInfo(roomIds) {
  return req(`/api/share/roomInfo/${roomIds}`, 'delete')
}

function roomTypeInfoList(data) {
  return req('/api/share/roomTypeInfo/list', 'get', data)
}
function addRoomTypeInfo(data) {
  return req('/api/share/roomTypeInfo', 'post', data)
}
function editRoomTypeInfo(data) {
  return req('/api/share/roomTypeInfo', 'put', data)
}
function removeRoomTypeInfo(roomTypeIds) {
  return req(`/api/share/roomTypeInfo/${roomTypeIds}`, 'delete')
}

function floorInfoList(data) {
  return req('/api/share/floorInfo/list', 'get', data)
}
function addfloorInfo(data) {
  return req('/api/share/floorInfo', 'post', data)
}
function editfloorInfo(data) {
  return req('/api/share/floorInfo', 'put', data)
}
function removefloorInfo(floorIds) {
  return req(`/api/share/floorInfo/${floorIds}`, 'delete')
}

function roomReservationList(data) {
  return req('/api/payment/roomReservationStatus/list', 'get', data)
}
function addRoomReservation(data) {
  return req('/api/payment/roomReservationStatus', 'post', data)
}
function editRoomReservation(data) {
  return req('/api/payment/roomReservationStatus', 'put', data)
}

function roomList(data) {
  return req('/api/share/roomInfo/roomInfoList', 'get', data)
}

function selectRoomInfoAll(data) {
  return req('/api/share/roomInfo/selectRoomInfoAll', 'get', data)
}

function selectRoomInfo(data) {
  return req('/api/payment/roomReservationStatus/selectRoomInfo', 'get', data)
}

function selectRoomInfoByTime(data) {
  return req('/api/payment/roomReservationStatus/selectDateRoomIdList', 'get', data)
}
// 月子 点击换房
function selectRoommodify(data) {
  return req('/api/payment/roomReservationStatus/selectRoommodify', 'get', data)
}
// 月子确定换房
function insertRoommodify(data) {
  return putReq('/api/payment/roomReservationStatus/insertRoommodify', 'put', data)
}

function companyMemberdetail(memberId) {
  return req(`/api/client/companyMember/${memberId}`, 'get')
}

function companyMemberedit(data){
  return req('/api/client/companyMember', 'put', data)
}
//获取企业详情
function getCompanyInfoByDeptIdedit(data){
  return req('/api/client/companyBasicsInfo/getCompanyInfoByDeptId', 'get', data)
}
//修改企业信息
function getCompanyInfoByDeptIdedits(data){
  return req('/api/client/companyBasicsInfo', 'put', data)
}
//新增商品
function productInfoadd(data){
  return req('/api/client/productInfo', 'post', data)
}


function customCardSum(data){
  return req('/api/payment/customCardSum/getCustomCardInfo', 'get', data)
}

function onlineOrderInfo(data){
  return req('/api/client/onlineOrderInfo/list', 'get', data)
}

//产品详情
function  productInfo(data){
  return req('/api/client/productInfo/list', 'get', data)
}
//删除照片
function photoInfodel(photoIds){
  return req(`/api/client/photoInfo/${photoIds}`, 'delete')
}
//新增产品分类
 function productCategory(data){
  return req('/api/client/productCategory', 'post', data)
 }
 //产品分类列表
 function productCategorylist(data){
  return req('/api/client/productCategory/list', 'get', data)
 }
//修改产品分类

function productCategoryedit(data){
  return req('/api/client/productCategory', 'put', data)
 }

//删除产品分类
function productCategorydel(photoIds){
  return req(`/api/client/productCategory/${photoIds}`, 'delete')
}
//
function editProductInfoShelf(data){
  return req('/api/client/productInfo/editProductInfoShelf', 'put', data)
 }
//删除产品
function editProductInfoShelfdel(productIds){
  return req(`/api/client/productInfo/${productIds}`, 'delete')
 }

 //修改商品
 function productInfoedit(data){
  return req('/api/client/productInfo', 'put', data)
 }
//修改权重
function editWeightSort(data){
  return req('/api/client/productInfo/editWeightSort', 'put', data)
}
 //获取核销码
 function getCancelCode(data){
  return req('/api/client/onlineOrderInfo/getCancelCode', 'get', data)
 }
 //修改核销期
 function editCancel(data){
  return req('/api/client/onlineOrderInfo/editCancel', 'get', data)
 }
 //导出订单
 function newexport(data){
  return req('/api/client/onlineOrderInfo/export', 'get', data)
 }
 //优惠券列表
 function listlong(data){
  return req('/api/client/couponInfo/list', 'get', data)
 }

//新增优惠券
function couponInfo(data){
  return req('/api/client/couponInfo', 'post', data)
 }
//修改状态
function couponInfoedit(data){
  return req('/api/client/couponInfo', 'put', data)
 }
 //优惠券详情列表
 function couponReceive(data){
  return req('/api/client/couponReceive/list', 'get', data)
 }
 // 查询企业标签库
 function companyLabel(data){
  return req('/api/client/companyLabel/list', 'get', data)
 }
  // 批量新增企业标签库
  function companyLabeladd(data){
    return req('/api/client/companyLabel/addBatchCompanyLabel', 'post', data)
   }
 //新增个人名片
 function companyEmployeeInfo(data){
  return req('/api/client/companyEmployeeInfo', 'post', data)
 }
//  查询个人列表
function companyEmployeeInfolist(data){
  return req('/api/client/companyEmployeeInfo/list', 'get', data)
 }
 
 function editProductInfoShelfdelem(employeeIds){
  return req(`/api/client/companyEmployeeInfo/${employeeIds}`, 'delete')
 }
 function companyEmployeeInfoedit(data){
  return req('/api/client/companyEmployeeInfo', 'put', data)
 }
 function syncClientAndService(data){
  return req('/api/share/customerInfo/syncClientAndService', 'get', data)
 }
 
 //导出网购订单
 function companyEmployeeInfoexport(data){
  return req('/api/client/onlineOrderInfo/export', 'post', data)
 }

 //费用类型
 function getExpenseTypeList(data){
  return req('/api/payment/orderInfo/getExpenseTypeListByDeptId', 'get', data)
 }
 //预收
 function getAdvancesReceivedList(data){
  return req('/api/payment/orderInfo/getAdvancesReceivedList', 'get', data)
 }
 //划扣
 function getConsumptionList(data){
  return req('/api/scribing/deductionRecord/getConsumptionList', 'get', data)
 }
 //退款申请
 function updateRefundApproval(data){
  return req('/api/client/onlineOrderInfo/updateRefundApproval', 'get', data)
 }
 //发货单号
 function onlineOrderInfowrite(data){
  return req('/api/client/onlineOrderInfo', 'PUT', data)
 }
 //查询退款记录
 function listback(data){
  return req('/api/client/orderRefundRecord/getOrderRefundRecordList', 'get', data)
 }
//接诊指标
function getReceptionList(data){
  return req('/api/confinement/receptionInformationList/getReceptionList', 'get', data)
 }
 //修改记录列表
 function getReceptionListedit(data){
  return req('/api/share/functionOperationInfo/list', 'get', data)
 }
  //修改记录
  function receptionInformationList(data){
    return req('/api/confinement/receptionInformationList/editReceptionInformation', 'put', data)
   }
 //设置无效
 function updateReceptionEffective(data){
  return req('/api/confinement/receptionInformationList/updateReceptionEffective', 'get', data)
 }
 //治疗记录修改列表
 function getTreatmentRecordList(data){
  return req('/api/scribing/deductionRecord/getTreatmentRecordList', 'get', data)
 }
//治疗记录取消
function getTreatmentRecordCancel(data){
  return req('/api/scribing/deductionRecord/getTreatmentRecordCancel', 'get', data)
 }
 //修改治疗记录
 function deductionRecord(data){
  return req('/api/scribing/deductionRecord/editDeductionRecordInfo', 'put', data)
 }
 
 //批量修改服务助理
 function editBatchServiceAssistant(data){
  return req('/api/scribing/deductionRecord/editBatchServiceAssistant', 'post', data)
 }
//获取退款详情
function getInfoByOrderInfoId(data){
  return req('/api/client/orderRefundRecord/getInfoByOrderInfoId', 'get', data)
 }

 function serviceGuaranteeInfo(data){
  return req('/api/client/serviceGuaranteeInfo/list', 'get', data)
 }

 function addBatchServiceGuarantee(data){
  return req('/api/client/serviceGuaranteeInfo/addBatchServiceGuarantee', 'post', data)
 }

 function editBatchServiceGuarantee(data){
  return req('/api/client/serviceGuaranteeInfo/editBatchServiceGuarantee', 'put', data)
 }
 function serviceGuaranteeInfodelte(employeeIds){
  return req(`/api/client/serviceGuaranteeInfo/${employeeIds}`, 'delete')
 }
 function addBatchCarouselInfo(data){
  return req('/api/client/carouselInfo/addBatchCarouselInfo', 'post', data)
 }
 function carouselInfo(data){
  return req('/api/client/carouselInfo/list', 'get', data)
 }
 function editBatchCarouselInfo(data){
  return req('/api/client/carouselInfo/editBatchCarouselInfo', 'put', data)
 }
 function serviceGuaranteeInfodeltedelete(employeeIds){
  return req(`/api/client/carouselInfo/${employeeIds}`, 'delete')
 }
 //平台保障新增
 function platformSupportType(data){
  return req('/api/client/platformSupportType/addBatchPlatformSupport', 'post', data)
 }
 //平台保障修改
 function platformSupportTypeedit(data){
  return req('/api/client/platformSupportType/editBatchPlatformSupport', 'put', data)
 }
 //平台保障删除
 function platformSupportTypedelete(supportTypeIds){
  return req(`/api/client/platformSupportType/${supportTypeIds}`, 'delete')
 }
 //查询平台分类
 function listplatform(data){
  return req('/api/client/platformSupportType/list', 'get', data)
 }
 
 //删除图片
 function deleteLocalFile(supportTypeIds){
  return req(`/api/file/deleteLocalFile`, 'get',supportTypeIds)
 }
 //修改上线
 function updateDisplay(data){
  return req('/api/client/carouselInfo/updateDisplay', 'put', data)
 }
//上传base64图片
function uploadlist(data){
  return req('/api/file/upload', 'post', data)
 }
// 活动新增
function activity(data){
  return req('/api/hospital/hospitalNursingRecords', 'post', data)
}
//活动编辑
function activityedit(data){
  return req('/api/hospital/hospitalNursingRecords', 'put', data)
}

//新增活动
function disManageList(data){
  return req('/api/client/disManageList', 'post', data)
}
//查询活动
function listactivity(data){
  return req('/api/client/disManageList/list', 'get', data)
 }

//删除活动

function disManageListremove(dmIds){
  return req(`/api/client/disManageList/${dmIds}`, 'delete')
 }
//编辑活动
function disManageListedit(data){
  return req('/api/client/disManageList', 'put', data)
}
//更多商品新增
function homeProductDisplay(data){
  return req('/api/client/homeProductDisplay', 'post', data)
}
//更多商品列表
function homeProductDisplaylist(data){
  return req('/api/client/homeProductDisplay/list', 'get', data)
 }
//编辑更多商品
function homeProductDisplayedit(data){
  return req('/api/client/homeProductDisplay', 'put', data)
}
//删除更更多商品
function disManageListremoves(hpdIds){
  return req(`/api/client/homeProductDisplay/${hpdIds}`, 'delete')
 }

//查询产品规格信息列表- 分页
function productSpecInfo(data){
  return req(`/api/client/productSpecInfo/list` , 'get', data)
}

function hospitalizationDepositRecord(data){
  return req(`/api/payment/hospitalizationDepositRecord/getCustomCardInfo` , 'get', data)
}

function pinRefundPay(data){
  return req(`/api/client/orderRefundRecord/getPinOrderRefundRecordList` , 'get', data)
}

function updateProductsOrShipments(data){
  return req(`/api/client/pintuanActivityOrders/updateProductsOrShipments`, 'get', data)
}

function settlementPrinting(data){
  return req(`/api/payment/wforservice/settlementPrinting`, 'get', data)
}

function isCheckout(data){
  return req(`/api/payment/roomReservationStatus/isCheckout/${data}`, 'get')
}

//发送消息
function sendmessge(data){
  return req('/api/share/chatHistoryInfo', 'post', data)
}
//获取聊天记录
function chatHistoryInfoList(data){
  return req('/api/share/chatHistoryInfo/chatHistoryInfoList', 'get', data)
}
//获取聊天记录
function getCustomerInfoByDeptId(data){
  return req('/api/confinement/customerCmt/getCustomerInfoByDeptId', 'get', data)
}
//获取员工
function getCustomerInfoByDeptIdeo(data){
  return req('/api/system/user/getSysUserByDeptId', 'get', data)
}
//获取拼团信息
function activityOrdersList(data){
  return req(`/api/client/pintuanActivityOrders/idPintuan/${data}`, 'get', data)
}
//新增话术
function chatMessageBody(data){
  return req('/api/share/chatMessageBody', 'post', data)
}
//修改话术
function chatMessageBodyedit(data){
  return req('/api/share/chatMessageBody', 'put', data)
}
//删除话术
function messageBodyIds(dmIds){
  return req(`/api/share/chatMessageBody/${dmIds}`, 'delete')
 }

//查询话术内容
function listchat(data){
  return req('/api/share/chatMessageBody/list', 'get', data)
}
//查询消息分类
function listType(data){
  return req('/api/share/chatMessageType/list', 'get', data)
}
//新增分类
function chatMessageType(data){
  return req('/api/share/chatMessageType', 'post', data)
}
//删除分类
function messageTypeIds(dmIds){
  return req(`/api/share/chatMessageType/${dmIds}`, 'delete')
 }
 //编辑分类
 function chatMessageTypeedit(data){
  return req('/api/share/chatMessageType', 'put', data)
}
 
function updateCancelsExecutedRecord(data){
  return req('/api/hospital/hospitalMedicalAdvice/updateCancelsExecutedRecord', 'get', data)
}

function settlementPrintingHospital(data){
  return req('/api/hospital/hospitalMedicalAdvice/settlementPrintingHospital', 'get', data)
}
//用户下单商城订单
function pcOnlineOrderInfoList(data){
  return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
//获取核销订单
function getOrderInfoByCancelCode(data){
  return req(`/api/client/onlineOrderInfo/getOrderInfoByCancelCode`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
//获取秒杀拼团总订单量
function pcPinTuanOrderList(data){
  return req(`/api/client/pintuanActivityOrders/pcPinTuanOrderList`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
//获取住院清单
function getHospitalExpensesSettlementList(data){
  return req(`/api/hospital/hospitalExpenseRecord/getHospitalExpensesSettlementList`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function getHospitalizationExpenses(data){
  return req(`/api/hospital/hospitalInfo/getHospitalizationExpenses`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function getExpenseByExpenseType(data){
  return req(`/api/hospital/hospitalExpenseRecord/getExpenseByExpenseType`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function getHospitalPerformance(data){
  return req(`/api/hospital/hospitalInfo/getHospitalPerformance`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function giftIncomingOutgoingInfo(data){
  return req('/api/share/giftIncomingOutgoingInfo', 'post', data)
}
function list(data){
  return req(`/api/share/departmentInfo/list`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function departmentSubsidiaryInfo(data){
  return req('/api/share/departmentSubsidiaryInfo', 'post', data)
}
function departmentSubsidiaryInfoedit(data){
  return req('/api/share/departmentSubsidiaryInfo', 'put', data)
}
function lists(data){
  return req(`/api/share/departmentSubsidiaryInfo/list`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function messageTypeIdsdel(subsidiaryId){
  return req(`/api/share/departmentSubsidiaryInfo/${subsidiaryId}`, 'delete')
 }
 function subsidiaryIddec(subsidiaryId){
  return req(`/api/share/departmentSubsidiaryInfo/${subsidiaryId}`, 'get')
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function subsidiaryIddecl(data){
  return req(`/api/client/reservationProjectOrder/list`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function subsidiaryIddeclp(data){
  return req(`/api/client/reservationDeptOrder/list`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function skinTriageList(data){
  return req(`/api/payment/wforservice/skinTriageList`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function configInfo(data){
  return req(`/api/client/configInfo/list`, 'get',data)
  // return req(`/api/client/onlineOrderInfo/pcOnlineOrderInfoList`, 'get')
}
function configInfoadd(data){
  return req('/api/client/configInfo', 'post', data)
}
function configInfoedit(data){
  return req('/api/client/configInfo', 'put', data)
}
//新增类目
function deptCategory(data){
  return req('/api/childbirth/deptCategory', 'post', data)
}
//查询分类
function deptCategorylist(data){
  return req('/api/childbirth/deptCategory/list', 'get', data)
}
//编辑类目
function deptCategoryedit(data){
  return req('/api/childbirth/deptCategory', 'put', data)
}
//删除类目
function deptCategorydelete(categoryIds){
  return req(`/api/childbirth/deptCategory/${categoryIds}`, 'delete')
}
//返日结
function backDayJunction(data){
  return req('/api/payment/orderInfo/backDayJunction', 'put', data)
}
//取消出院
function exitTheRoom(data){
  return req('/api/payment/roomReservationStatus/exitTheRoom', 'put', data)
}
//辅助治疗待执行
function auxiliaryExecution(data){
  return req('/api/payment/wforservice/auxiliaryExecution', 'put', data)
}
//辅助治疗待执行列表
function auxiliaryTreatList(data){
  return req('/api/payment/wforservice/auxiliaryTreatList', 'get', data)
}
function catalogLevelTowlist(data){
  return req('/api/childbirth/catalogLevelTow/list', 'get', data)
}
function catalogLevelTow(data){
  return req('/api/childbirth/catalogLevelTow', 'post', data)
}
function catalogLevelTowedit(data){
  return req('/api/childbirth/catalogLevelTow', 'put', data)
}
function deptCategorydeleteremove(catalogLevelIds){
  return req(`/api/childbirth/catalogLevelTow/${catalogLevelIds}`, 'delete')
}
// 专家团队列表
function expertTeamlist(data){
  return req('/api/childbirth/expertTeam/list', 'get', data)
}
//新增专家
function expertTeamadd(data){
  return req('/api/childbirth/expertTeam', 'post', data)
}
//编辑专家
function expertTeamedit(data){
  return req('/api/childbirth/expertTeam', 'put', data)
}
function expertTeamremove(expertTeamIds){
  return req(`/api/childbirth/expertTeam/${expertTeamIds}`, 'delete')
}
//新增门店
function storeInfo(data){
  return req('/api/childbirth/storeInfo', 'post', data)
}
function storeInfoedit(data){
  return req('/api/childbirth/storeInfo', 'put', data)
}
//查询门店
function storeInfolist(data){
  return req('/api/childbirth/storeInfo/list', 'get', data)
}
function storeInforemove(storeIds){
  return req(`/api/childbirth/storeInfo/${storeIds}`, 'delete')
}
//新增房间类型
function roomTypeInfo(data){
  return req('/api/childbirth/roomTypeInfo', 'post', data)
}
function roomTypeInfoedit(data){
  return req('/api/childbirth/roomTypeInfo', 'put', data)
}
//查询房间类型
function roomTypeInflist(data){
  return req('/api/childbirth/roomTypeInfo/list', 'get', data)
}
//删除房间
function roomTypeInforemove(roomTypeIds){
  return req(`/api/childbirth/roomTypeInfo/${roomTypeIds}`, 'delete')
}
//添加房间详情
function storeDetailsList(data){
  return req('/api/childbirth/storeDetailsList', 'post', data)
}
function storeDetailsListedit(data){
  return req('/api/childbirth/storeDetailsList', 'put', data)
}
function listthree(data){
  return req('/api/childbirth/storeDetailsList/list', 'get', data)
}
function roomTypeInforemovelist(storeDetailsIds){
  return req(`/api/childbirth/storeDetailsList/${storeDetailsIds}`, 'delete')
}
function scheduleVisitInfo(data){
  return req('/api/childbirth/scheduleVisitInfo/list', 'get', data)
}
function delay(data){
  return req('/api/payment/roomReservationStatus/delay', 'post', data)
}
function firstScreenDisplay(data){
  return req('/api/childbirth/firstScreenDisplay/list', 'get', data)
}
function firstScreenDisplayAdd(data){
  return req('/api/childbirth/firstScreenDisplay', 'post', data)
}
function firstScreenDisplayedit(data){
  return req('/api/childbirth/firstScreenDisplay', 'put', data)
}
function roomTypeInforemovelistremove(fsdIds){
  return req(`/api/childbirth/firstScreenDisplay/${fsdIds}`, 'delete')
}
function exploreInfo(data){
  return req('/api/childbirth/exploreInfo/list', 'get', data)
}
function exploreInfoadd(data){
  return req('/api/childbirth/exploreInfo', 'post', data)
}
function exploreInfoedit(data){
  return req('/api/childbirth/exploreInfo', 'put', data)
}
function exploreInforemove(eiIds){
  return req(`/api/childbirth/exploreInfo/${eiIds}`, 'delete')
}
//清除退款单
function refundCancellation(data){
  return req('/api/payment/toBePaidList/refundCancellation', 'post', data)
}
function shownList(data){
  return req('/api/childbirth/shownList/list', 'get', data)
}
function shownListadd(data){
  return req('/api/childbirth/shownList', 'post', data)
}
function shownListedit(data){
  return req('/api/childbirth/shownList', 'put', data)
}
function shownListremove(shownListIds){
  return req(`/api/childbirth/shownList/${shownListIds}`, 'delete')
}
function customInfoImg(data){
  return req('/api/facebody/customInfoImg/list', 'get', data)
}
function cName(data){
  return req('/api/payment/orderInfo/modifyAdvisor', 'put', data)
}
//开发票
function orderInfoList(data){
  return req('/api/assist/orderInfo/orderInfoList', 'get', data)
}
//取消开发票
function deleteOrderList(data){
  return req(`/api/assist/orderInfo/deleteOrderList/${data}`, 'delete')
}
//修改出库时间
function updateOutTime(data){
  return req('/api/sorage/outInfo/updateOutTime', 'get', data)
}
//修改入库时间和数量
function updateInsertListTimeAndData(data){
  return req('/api/sorage/insertList/updateInsertListTimeAndData', 'get', data)
}
//修改入库时间
function updateInsertTime(data){
  return req('/api/sorage/insertInfo/updateInsertTime', 'get', data)
}
//修改出库时间和数量
function updateOutListTimeAndData(data){
  return req('/api/sorage/outList/updateOutListTimeAndData', 'get', data)
}
function updateBatchPayChannel(data){
  return req(`/api/share/payDeptChannelRecord/updateBatchPayChannel/${data}`, 'get', )
}

// 查询积分兑换比例
function memberPointsExchangeRatio(data){
  return req('/api/confinement/memberPointsExchangeRatio/list', 'get', data)
}
// 新增积分比例

function memberPointsExchangeRatioAdd(data){
  return req('/api/confinement/memberPointsExchangeRatio', 'post', data)
}
// 编辑积分比例
function memberPointsExchangeRatioedit(data){
  return req('/api/confinement/memberPointsExchangeRatio', 'put', data)
}
//删除积分比例
function memberPointsExchangeRatiodel(data){
  return req(`/api/confinement/memberPointsExchangeRatio/${data}`, 'delete')
}
//查询积分详细
function memberPointsExchangeRatiodetail(data){
  return req(`/api/confinement/memberPointsExchangeRatio/${data}`, 'get')
}

//设置回访
function AlreadyArrivedAdd(data) {
  return req('/api/confinement/returnVisitHospital/insertUpdateHospital', 'post', data)
}

 //查询订单
//  function onlineOrderInfo(data){
//   return req('/api/client/onlineOrderInfo/list', 'get', data)
//  }

export default {
  shownList,
  deleteOrderList,
  updateOutListTimeAndData,
  memberPointsExchangeRatioAdd,
  memberPointsExchangeRatioedit,
  memberPointsExchangeRatiodetail,
  AlreadyArrivedAdd,
  memberPointsExchangeRatiodel,
  updateBatchPayChannel,
  updateOutTime,
  updateInsertTime,
  updateInsertListTimeAndData,
  memberPointsExchangeRatio,
  orderInfoList,
  cName,
  customInfoImg,
  shownListadd,
  shownListedit,
  shownListremove,
  getOutListTota,
  productInfoedit,
  exploreInforemove,
  refundCancellation,
  exploreInfoadd,
  exploreInfoedit,
  roomTypeInforemovelist,
  firstScreenDisplay,
  exploreInfo,
  roomTypeInforemovelistremove,
  firstScreenDisplayAdd,
  firstScreenDisplayedit,
  scheduleVisitInfo,
  delay,
  storeInfoedit,
  listthree,
  storeDetailsListedit,
  storeDetailsList,
  roomTypeInflist,
  roomTypeInforemove,
  roomTypeInfoedit,
  roomTypeInfo,
  storeInforemove,
  deptCategorydeleteremove,
  catalogLevelTowedit,
  storeInfolist,
  expertTeamremove,
  expertTeamadd,
  expertTeamedit,
  storeInfo,
  catalogLevelTow,
  backDayJunction,
  expertTeamlist,
  giftIncomingOutgoingInfo,
  catalogLevelTowlist,
  auxiliaryExecution,
  auxiliaryTreatList,
  exitTheRoom,
  chatMessageType,
  configInfoedit,
  deptCategoryedit,
  deptCategorydelete,
  deptCategorylist,
  configInfo,
  deptCategory,
  configInfoadd,
  skinTriageList,
  subsidiaryIddeclp,
  messageTypeIdsdel,
  subsidiaryIddecl,
  departmentSubsidiaryInfoedit,
  list,
  lists,
  subsidiaryIddec,
  departmentSubsidiaryInfo,
  getHospitalizationExpenses,
  getHospitalPerformance,
  getExpenseByExpenseType,
  chatMessageBody,
  getHospitalExpensesSettlementList,
  pcPinTuanOrderList,
  settlementPrintingHospital,
  pcOnlineOrderInfoList,
  updateCancelsExecutedRecord,
  disManageList,
  messageTypeIds,
  chatMessageTypeedit,
  getOrderInfoByCancelCode,
  listchat,
  messageBodyIds,
  listType,
  chatMessageBodyedit,
  activityOrdersList,
  getCustomerInfoByDeptIdeo,
  sendmessge,
  isCheckout,
  hospitalizationDepositRecord,
  disManageListremoves,
  updateProductsOrShipments,
  settlementPrinting,
  pinRefundPay,
  activity,
  listactivity,
  homeProductDisplayedit,
  homeProductDisplaylist,
  homeProductDisplay,
  disManageListremove,
  activityedit,
  editBatchServiceGuarantee,
  getExpenseTypeList,
  uploadlist,
  deleteLocalFile,
  updateDisplay,
  disManageListedit,
  editBatchCarouselInfo,
  listplatform,
  platformSupportTypedelete,
  platformSupportTypeedit,
  platformSupportType,
  serviceGuaranteeInfodeltedelete,
  carouselInfo,
  serviceGuaranteeInfodelte,
  addBatchCarouselInfo,
  updateReceptionEffective,
  serviceGuaranteeInfo,
  editBatchServiceAssistant,
  getTreatmentRecordCancel,
  getInfoByOrderInfoId,
  addBatchServiceGuarantee,
  getTreatmentRecordList,
  deductionRecord,
  getReceptionListedit,
  receptionInformationList,
  listback,
  getReceptionList,
  onlineOrderInfowrite,
  updateRefundApproval,
  getConsumptionList,
  getAdvancesReceivedList,
  companyEmployeeInfoexport,
  companyEmployeeInfoedit,
  syncClientAndService,
  editProductInfoShelfdelem,
  companyEmployeeInfolist,
  companyEmployeeInfo,
  companyLabel,
  companyLabeladd,
  couponReceive,
  couponInfoedit,
  listlong,
  couponInfo,
  newexport,
  editCancel,
  getCancelCode,
  editProductInfoShelf,
  editProductInfoShelfdel,
  productCategorylist,
  productCategorydel,
  productCategoryedit,
  productCategory,
  photoInfodel,
  productInfoadd,
  productInfo,
  getCompanyInfoByDeptIdedits,
  onlineOrderInfo,
  customCardSum,
  getCompanyInfoByDeptIdedit,
  companyMemberedit,
  roomInfoList,
  addRoomInfo,
  editRoomInfo,
  removeRoomInfo,
  roomTypeInfoList,
  addRoomTypeInfo,
  editRoomTypeInfo,
  removeRoomTypeInfo,
  floorInfoList,
  addfloorInfo,
  editfloorInfo,
  removefloorInfo,
  roomReservationList,
  addRoomReservation,
  editRoomReservation,
  roomList,
  selectRoomInfoAll,
  selectRoomInfo,
  selectRoomInfoByTime,
  selectRoommodify,
  insertRoommodify,
  AddRoom,
  RoomInfoList,
  GetroomNumber,
  EditroomNumber,
  RemoveroomNumber,
  RoomTypeInfoList,
  nurseLeft,
  nurseRightTop,
  listGroup,
  addBatch,
  hospitalCopyRecord,
  expenseTypeGroup,
  MedicalAdvice,
  getUserList,
  editBatchState,
  skinList,
  hospitalSkinTest,
  hospitalExpenseRecord,
  expenseSummaryList,
  backList,
  listPricingContent,
  listByGroupNum,
  listEnforcement,
  listCopyMedicalAdvice,
  listPricingExecute,
  editBatchStates,
  getPharmacyDispensingList,
  getNursingPrintList,
  getInfusionCard,
  cure_result,
  leave_flag,
  updatedto,
  hospitalInfo,
  projectList,
  getCustomerHospitalInfo,
  Route,
  RemoveroomNumbers,
  hospitalFirstnursingRecord,
  hospitalNursingRecords,
  singRecords,
  caseTemplateClassifyList,
  addBatchNursingRecords,
  editBatchNursingRecords,
  getHospitalInfoList,
  cqeditBatch,
  getInfoByInHospitalId,
  newhospitalFirstnursingRecord,
  hospitalInfot,
  getFloorInfoTree,
  hospitalCaseTemplate,
  hospitalCaseTemplateDel,
  roomReservationStatus,
  getInfoById,
  listById,
  getListByIdChange,
  getHospitalExpenseRecordList,
  unload,
  companyMember,
  photoInfo,
  companyBasicsInfo,
  companyMemberlist,
  hospitalCaseTemplateDelel,
  companyMemberdetail,
  editWeightSort,
  productSpecInfo,
  chatHistoryInfoList,
  getCustomerInfoByDeptId
}
