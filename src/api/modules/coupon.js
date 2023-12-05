import { req } from '@/api/request'
// 查询口腔材质信息列表- 分页
function couponInfoList(data) {
  return req('/api/client/couponInfo/list', 'get', data)
}
// 口腔材质信息新增
function couponInfoAdd(data) {
  return req('/api/client/couponInfo', 'post', data)
}
// 口腔材质信息修改
function couponInfoEdit(data) {
  return req('/api/client/couponInfo', 'put', data)
}
// 详情
function couponInfo(data) {
  return req(`/api/client/couponInfo/${data}`, 'get')
}
// 删除
function couponInfoDelete(data) {
  return req(`/api/client/couponInfo/${data}`, 'delete')
}
//导出
function couponInfoExport(data) {
  return req(`/api/client/couponInfo/export`, 'POST',data)
}
//
// 查询优惠券领用表列表- 分页
function couponReceiveList(data) {
  return req('/api/client/couponReceive/list', 'get', data)
}
// 优惠券领用表新增
function couponReceiveAdd(data) {
  return req('/api/client/couponReceive', 'post', data)
}
// 优惠券领用表修改
function couponReceiveEdit(data) {
  return req('/api/client/couponReceive', 'put', data)
}
// 优惠券领用表详情
function couponReceive(data) {
  return req(`/api/client/couponReceive/${data}`, 'get')
}
// 优惠券领用表删除
function couponReceiveDelete(data) {
  return req(`/api/client/couponReceive/${data}`, 'delete')
}
//优惠券领用表导出
function couponReceiveExport(data) {
  return req(`/api/client/couponReceive/export`, 'POST',data)
}
export default {
  couponInfoList,
  couponInfo,
  couponInfoAdd,
  couponInfoEdit,
  couponInfoDelete,
  couponInfoExport,
  couponReceiveList,
  couponReceive,
  couponReceiveAdd,
  couponReceiveEdit,
  couponReceiveDelete,
  couponReceiveExport,
}