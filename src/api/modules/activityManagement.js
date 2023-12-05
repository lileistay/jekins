import { req } from '@/api/request'

//获取礼品出入库列表
function getInOutInventoryList(data) {
    return req('/api/share/giftTypeList/getInOutInventoryList','get',data)
}
//获取礼品出入库
function giftIncomingOutgoingInfo(data) {
    return req('/api/share/giftIncomingOutgoingInfo','post',data)
}
// 礼品出入库流水查询列表
function giftIncomingOutgoingInfoList(data) {
    return req('/api/share/giftIncomingOutgoingInfo/list','get',data)
}
// 礼品库存查询
function getInOutInventoryLists(data) {
    return req('/api/share/giftTypeList/getInOutInventoryList','get',data)
}

//老带新

function extensionCustomer(data) {
    return req('/api/confinement/extensionCustomer/list','get',data)
}
//分成级别
function selectRecommend(data) {
    return req('/api/confinement/dividendRatio/list','get',data)
}
//模糊查询
function selectRecommendadd(data) {
    return req('/api/confinement/customerCmt/selectRecommend','get',data)
}

//
//新增分成客户
function extensionCustomeradd(data) {
    return req('/api/confinement/extensionCustomer','post',data)
}
//修改分成级别
function extensionDividendChangeInfo(data) {
    return req('/api/confinement/extensionDividendChangeInfo','post',data)
}
//抵扣
function getIncomeDeduction(data) {
    return req('/api/confinement/extensionCustomer/getIncomeDeduction','post',data)
}
//转积分

function getRevenueConversionCredits(data) {
    return req('/api/confinement/extensionCustomer/getRevenueConversionCredits','post',data)
}
//增加收益
function getIncreaseIncome(data) {
    return req('/api/confinement/extensionCustomer/getIncreaseIncome','post',data)
}
//收益变动详情
function getIncreaseIncomenews(data) {
    return req('/api/confinement/extensionIncomeInfo/list','get',data)
}
//分成级别修改记录
function extensionDividendChangeInfoedit(data) {
    return req('/api/confinement/extensionDividendChangeInfo/list','get',data)
}

//老带新下级客户
function getSubordinateCustomerList(data) {
    return req('/api/confinement/earningApply/getSubordinateCustomerList','get',data)
}



// 会员管理列表
function memberPointsgetMemberList(data) {
    return req('/api/confinement/memberPoints/getMemberList','get',data)
}
//绑定会员的
function batchBindCustomer(data) {
    return req('/api/confinement/memberPoints/batchBindCustomer','get',data)
}
// 等级调整的
function lmemberPoints(data) {
    return req('/api/confinement/memberPoints','put',data)
}
// 积分调整的
function memberPointsInfo(data) {
    return req('/api/confinement/memberPointsInfo','post',data)
}
//领卡
function memberPointsCard(data) {
    return req('/api/confinement/memberPoints','put',data)
}
//积分兑换保存
function giftIncomingOutgoingInfoa(data) {
    return req('/api/share/giftIncomingOutgoingInfo','post',data)
}
//积分兑换保存
function memberUpgradeAdd(data) {
    return req('/api/confinement/memberUpgrade','post',data)
}
export default {
    getInOutInventoryList,
    giftIncomingOutgoingInfo,
    giftIncomingOutgoingInfoList,
    getInOutInventoryLists,
    memberPointsgetMemberList,
    batchBindCustomer,
    lmemberPoints,
    memberPointsCard,
    memberPointsInfo,
    giftIncomingOutgoingInfoa,
    memberUpgradeAdd,
    extensionCustomer,
    selectRecommend,
    extensionCustomeradd,
    selectRecommendadd,
    extensionDividendChangeInfo,
    getIncomeDeduction,
    getRevenueConversionCredits,
    getIncreaseIncome,
    getIncreaseIncomenews,
    extensionDividendChangeInfoedit,
    getSubordinateCustomerList
}