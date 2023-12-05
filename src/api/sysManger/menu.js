import { req } from '@/api/request'

function menuList(data, methods) {
  return req('/api/system/menu/list', methods, data)
}

function menuOperate(data, methods, id) {
  if (id) {
    return req('/api/system/menu/' + id, methods, data)
  }
  return req('/api/system/menu', methods, data)
}

function menuTree(data) {
  return req('/api/system/menu/treeselect', 'get', data)
}

function roleMenuTreeselect(id) {
  return req('/api/system/menu/roleMenuTreeselect/' + id, 'get')
}
function getRouters() {
  return req('/api/system/menu/getRouters', 'get')
}
// 通知公告列表
function noticeList(data) {
  return req('/api/system/notice/list', 'get',data)
}
// 通知公告列表-新增
function noticeListAdd(data) {
  return req('/api/system/notice', 'post',data)
}
// 通知公告列表-修改
function noticeListEdit(data) {
  return req('/api/system/notice','put', data)
}
// 通知公告列表-修改
function noticeListInfo(data) {
  return req(`/api/system/notice/${data}`,'get')
}
function noticeListDelete(data) {
  return req(`/api/system/notice/${data}`,'delete')
}
export default {
  menuList,
  menuOperate,
  menuTree,
  roleMenuTreeselect,
  getRouters,
  noticeList,
  noticeListAdd,
  noticeListEdit,
  noticeListInfo,
  noticeListDelete

}
