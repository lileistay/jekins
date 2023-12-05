import Vue from 'vue'
import DataDict from '@/utils/dict'
import { getDicts } from '@/api/sysManger/dict/data'
function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {

          return getDicts(dictMeta.type).then(res => {
            if (res) {
              return res.data
            }
          })
        }
      }
    }
  })
}

export default {
  install
}
