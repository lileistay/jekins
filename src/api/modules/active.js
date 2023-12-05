import { req } from '@/api/request'
// 活动列表
function eventsTypeList(data) {
  return req('api/client/eventsType/list', 'get', data)
}
// 活动列表-新增
function eventsTypeAdd(data) {
  return req('api/client/eventsType', 'post', data)
}
// 活动列表-修改
function eventsTypeEdit(data) {
  return req('api/client/eventsType', 'put', data)
}
// 活动列表-删除
function eventsTypeDelete(data) {
  return req(`api/client/eventsType/${data}`, 'delete')
}
// 活动基本信息列表
function eventsBasicInfoList(data) {
  return req('api/client/eventsBasicInfo/list', 'get', data)
}
// 活动活动基本信息-新增
function eventsBasicInfoAdd(data) {
  return req('api/client/eventsBasicInfo', 'post', data)
}
// 活动基本信息-修改
function eventsBasicInfoEdit(data) {
  return req('api/client/eventsBasicInfo', 'put', data)
}
// 活动基本信息-删除
function eventsBasicInfoDelete(data) {
  return req(`api/client/eventsBasicInfo/${data}`, 'delete')
}
export default {
  eventsTypeList,
  eventsTypeAdd,
  eventsTypeEdit,
  eventsTypeDelete,
  eventsBasicInfoList,
  eventsBasicInfoAdd,
  eventsBasicInfoEdit,
  eventsBasicInfoDelete
}