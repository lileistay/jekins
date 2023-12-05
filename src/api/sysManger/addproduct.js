import { req } from '@/api/request'

function obtain(data) {
  return req('/api/confinement/projectInfo/export', 'post', data)
}

export default {
  obtain
}
