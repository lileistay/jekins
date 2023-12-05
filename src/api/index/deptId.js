import { req } from '@/api/request'
// 首页 日月数据
function fomePageStatistics(data) {
  return req('/api/statistics/fomePageStatistics/statisticalCashier', 'get', data)
}
// 数据简报
function dataBriefing(data) {
  return req('/api/statistics/fomePageStatistics/dataBriefing', 'get', data)
}
//数据简报
function customerVisits(data){
  return req('/api/statistics/fomePageStatistics/customerVisits', 'get', data)
  
}
// 
// 个人成交排行
function reception(data) {
  return req('/api/statistics/fomePageStatistics/reception', 'get', data)
}

// 个人业绩排行
function performanceRanking(data) {
  return req('/api/statistics/fomePageStatistics/performanceRanking', 'get', data)
}
// 整体趋势
function overallTrend(data) {
  return req('/api/statistics/fomePageStatistics/overallTrend', 'get', data)
}
// 业绩分布排行
function companyObjectives(data) {
  return req('/api/statistics/fomePageStatistics/companyObjectives', 'get', data)
}
// 科室业绩及占比
function companyObjectivesdeptPrmce(data) {
  return req('/api/statistics/fomePageStatistics/deptPrmce', 'get', data)
}

// 产品售卖排行
function productList(data) {
  return req('/api/statistics/fomePageStatistics/productList', 'get', data)
}
// 业绩趋势
function moneyTrend(data) {
  return req('/api/statistics/fomePageStatistics/moneyTrend', 'get', data)
}
//头部数据
function statisticalHeader(data) {
  return req('/api/statistics/fomePageStatistics/statisticalHeader', 'get', data)
}

// 目标管理 --- 列表
function atTargetList(data) {
  return req('/api/share/atTarget/list', 'get', data)
}
// 目标管理 -- 添加
function atTargetAdd(data) {
  return req('/api/share/atTarget', 'post', data)
}
// 目标管理 -- 修改
function atTargetEdit(data) {
  return req('/api/share/atTarget', 'put', data)
}
// 目标管理 -- 删除
function atTarremove(id) {
  return req(`/api/share/atTarget/${id}`, 'delete')
}
function salesPipeline(data){
  return req('/api/statistics/fomePageStatistics/salesPipeline', 'get', data)
}
// 前台首页第一行统计
function reonStatis(data){
  return req('/api/statistics/receptionStatistics/reonStatis', 'get', data)
}

// 前台首页饼图统计
function receptionVolume(data){
  return req('/api/statistics/receptionStatistics/receptionVolume', 'get', data)
}
// 预计到院数据
function preArrivalList(data){
  return req('/api/statistics/receptionStatistics/preArrivalList', 'get', data)
}
// 门店数据
function listStoreinfo(data){
  return req('/api/statistics/dnwStatistics/listStoreinfo', 'get', data)
}
// 痘你完饼图·
function getRegistrSheetStore(data){
  return req('/api/statistics/dnwStatistics/getRegistrSheetStore', 'get', data)
}
// 痘你完数据
function turnoverIncome(data){
  return req('/api/statistics/dnwStatistics/turnoverIncome', 'get', data)
}
// 痘你完数据
function dnwStatistics(data){
  return req('/api/statistics/dnwStatistics/select1', 'get', data)
}
export default {
  fomePageStatistics,
  dataBriefing,
  performanceRanking,
  overallTrend,
  atTargetList,
  atTargetAdd,
  atTargetEdit,
  atTarremove,
  companyObjectives,
  productList,
  moneyTrend,
  salesPipeline,
  customerVisits,
  companyObjectivesdeptPrmce,
  statisticalHeader,
  reception,
  reonStatis,
  receptionVolume,
  preArrivalList,
  listStoreinfo,
  getRegistrSheetStore,
  turnoverIncome,
  dnwStatistics
}
