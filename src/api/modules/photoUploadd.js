import { req } from '@/api/request'

// 新增口腔照片信息
function addBatchDentalPhotoInfoAdd(data) {
  return req('/api/hospital/dentalPhotoInfo/addBatchDentalPhotoInfo', 'post', data)
}
// 列表
function dentalPhotoInfoList(data) {
  return req('/api/hospital/dentalPhotoInfo/list', 'get', data)
}
// 修改口腔照片信息
function dentalPhotoInfoEdit(data) {
  return req('/api/hospital/dentalPhotoInfo', 'put', data)
}
// 删除口腔照片信息
function dentalPhotoInfoDelete(data) {
  return req(`/api/hospital/dentalPhotoInfo/${data}`,'delete')
}
export default {
  addBatchDentalPhotoInfoAdd,
  dentalPhotoInfoList,
  dentalPhotoInfoEdit,
  dentalPhotoInfoDelete
}