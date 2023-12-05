import { req } from '@/api/request'

// 查询正畸检查字典详情列表- 分页
export function getDicts(data) {
  return req(`/api/hospital/dentalDictDetails/getDentalDictDetailsByTypeCode/`+ data, 'get', {})
}
// export default {
//   getDicts
// }
