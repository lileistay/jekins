import { req } from '@/api/request'
import { download } from '@/utils/request'
// import { download } from '@/utils/request'

// 查询职位列表
function postList(data) {
  return req('/api/system/post/list', 'get', data)
}

// 职位增删改
function postOperate(data, methods, id) {
  if (id) {
    return req('/api/system/post/' + id, methods, data)
  }
  return req('/api/system/post', methods, data)
}

// 导出职务
function exportPost(data) {
  return download('/api/system/post/export', {
    ...data
  }, `post_${new Date().getTime()}.xlsx`)
}

// 查询岗位详细
function getPost(id) {
  return req('/api/system/post/' + id, 'get')
}
// 部门管理
function sectionInfoList(data) {
  return req('/api/share/sectionInfo/list', 'get', data)
}
// 部门管理-添加
function sectionInfoAdd(data) {
  return req('/api/share/sectionInfo', 'post', data)
}
// 部门管理-修改
function sectionInfoPut(data) {
  return req('/api/share/sectionInfo', 'put', data)
}
// 部门管理- 删除
function sectionInfodelete(id) {
  return req(`/api/share/sectionInfo/${id}`, 'delete')
}
export default {
  postList,
  postOperate,
  exportPost,
  getPost,
  sectionInfoList,
  sectionInfoAdd,
  sectionInfoPut,
  sectionInfodelete

}
