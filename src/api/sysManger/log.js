import { req } from '@/api/request'

// 登录日志
function getLoginInfo(data) {
  return req('/api/system/logininfor/list', 'get', data)
}

// 在线用户
function getOnlineInfo(data) {
  return req('/api/system/online/list', 'get', data)
}

// 强退用户
function getOutOnline(tokenId) {
  return req('/api/system/online/' + tokenId, 'delete')
}

// // 定时任务
function jobList(data) {
  return req('/api/job/job/list', 'get', data)
}

// // 查询定时任务调度详细
// function getJob(jobId) {
//   return req('/api/monitor/job/' + jobId, 'get')
// }

// 新增定时任务调度
function addJob(data) {
  return req('/api/job/job', 'post', data)
}

// 查询定时任务调度详细
function getJob(jobId) {
  return req(`/api/job/job/${jobId}`, 'get')
}

// 修改定时任务调度
function updateJob(data) {
  return req('/api/job/job', 'put', data)
}

// 删除定时任务调度
function delJob(jobId) {
  return req(`/api/job/job/${jobId}`, 'delete')
}

// 任务状态修改
function changeJobStatus(data) {
  return req('/api/job/job/changeStatus', 'put', data)
}

// 日志管理
// 查询调度日志列表
function listJobLog(data) {
  return req('/api/job/job/log/list', 'get', data)
}
// 删除调度日志
function delJobLog(jobLogId) {
  return req(`/api/job/job/log/${jobLogId}`, 'delete')
}

// 清空调度日志
function cleanJobLog() {
  return req('/api/job/job/log/clean', 'delete')
}
// 操作日志 列表
function operlogList(data) {
  return req('/api/system/operlog/list', 'get', data)
}
// 操作日志 删除
function operlogdelete(id) {
  return req(`/api/system/operlog/${id}`, 'delete')
}
// 操作日志 清空
function operlogEmpty() {
  return req('/api/system/operlog/clean', 'delete')
}
function run(data) {
  return req('/api/job/job/run', 'put',data)
}
function logList(data) {
  return req(`/api/job/job/${data}`, 'get')
}
export default {
  getLoginInfo,
  getOnlineInfo,
  getOutOnline,
  jobList,
  addJob,
  updateJob,
  getJob,
  delJob,
  changeJobStatus,
  listJobLog,
  delJobLog,
  cleanJobLog,
  operlogList,
  operlogdelete,
  operlogEmpty,
  run,
  logList
}
