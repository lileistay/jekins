import { req } from '@/api/request'

// 根据参数键名查询参数值
function getConfigKey(configKey) {
  return req('/api/system/config/configKey/' + configKey, 'get')
}

export default {
  getConfigKey
}
