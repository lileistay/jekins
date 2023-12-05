import Vue from 'vue'
import DataDictC from '@/utils/dictC'
import {  getDicts } from '@/api/sysManger/dict/dataC'


function installC() {
  Vue.use(DataDictC, {
    
    metas: {
      '*': {
        labelField: 'details',
        valueField: 'detailsId',
        request(dictMetaC) {
          return  getDicts(dictMetaC.type).then(res => {
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
  installC
}
