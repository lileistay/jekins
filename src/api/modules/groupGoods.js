import { req } from '@/api/request'
import { putReq } from '@/api/request'
// 收费单打回
function groupGoodsInfoList(data) {
  return req('/api/client/groupGoodsInfo/list', 'get', data)
}
function groupGoodsInfoListAdd(data) {
  return req('/api/client/groupGoodsInfo', 'post', data)
}
function groupGoodsInfoListEdit(data) {
  return req('/api/client/groupGoodsInfo', 'put', data)
}
function groupGoodsInfo(data) {
  return req(`/api/client/groupGoodsInfo/${data}`, 'get')
}
function groupGoodsInfoDelete(data) {
  return req(`/api/client/groupGoodsInfo/${data}`, 'delete')
}
//查询客户归属关系表列表- 分页
function customerBelongList(data) {
  return req('/api/client/customerBelong/list', 'get', data)
}
//修改客户归属关系表列表- 分页
function customerBelongEdit(data) {
  return req('/api/client/customerBelong', 'PUT', data)
}
//拼团
function activityOrdersList(data) {
  return req('/api/client/pintuanActivityOrders/activityOrdersList', 'get', data)
}
export default {
  groupGoodsInfoList,
  groupGoodsInfoListAdd,
  groupGoodsInfoListEdit,
  groupGoodsInfo,
  groupGoodsInfoDelete,
  customerBelongList,
  customerBelongEdit,
  activityOrdersList
}