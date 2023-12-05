import Vue from 'vue'
import App from './App.vue'

import store from './store'

Vue.config.productionTip = false
Vue.config.devtools = true

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import api from '@/api/api'
Vue.prototype.$api = api
//全局导出方法挂载
import { export_table_to_excel } from '@/utils/utils';
Vue.prototype.$export = export_table_to_excel

//引入webwork创建新进程导出excel;
import VueWorker from 'vue-worker'
Vue.use(VueWorker)

//挂在全局导出excel插件
import XLSX  from 'xlsx'
Vue.prototype.$xlsx=XLSX;

import comustMsg from '@/utils/errorCode'
Vue.prototype.$msg = comustMsg

import { download } from '@/utils/request'
Vue.prototype.download = download
//全局加载loading
import loading from '@/components/loading.vue'
Vue.component('Loading', loading)
//全局祛除drag
import delLoding from '@/components/delloading.vue'
Vue.component('Delloding', delLoding)
import collapse from '@/views/collapse/index.vue'
Vue.component('Sollapse', collapse);
// 字典数据组件

import DictDataC from '@/components/DictDataC'
DictDataC.installC()
import DictData from '@/components/DictData'
DictData.install()
// 防抖
import { debounce } from '@/utils/throttleAndDebounce'
Vue.prototype.debounce = debounce
// 节流
import { throttle } from '@/utils/throttleAndDebounce'
Vue.prototype.debounce = throttle
//注册拖动自定义指令
import newdirective from '@/utils/directive'
Vue.use(newdirective)

// 字典标签组件
import DictTag from '@/components/DictTag'
Vue.component('DictTag', DictTag)

// 显示字典中的对应数据
import ShowDictData from '@/components/ShowDictData'
Vue.component('ShowDictData', ShowDictData)

// 引入锁屏组件
import localScreen from '@/components/LocalScreen/index.js'
Vue.use(localScreen)

// 全局实现数字千位分隔符格式
import { numberToCurrencyNo } from '@/utils/numberToCurrency'
// 配置全局过滤器，实现数字千分位格式
Vue.filter('numberToCurrency', numberToCurrencyNo)

// 引入时间格式化组件
import moment from 'moment'
// 定义全局过滤器
Vue.filter('dateformat', function (dataStr, pattern = 'YYY-MM-DD HH:mm:ss') {
  if (dataStr === null || dataStr === '') {
    return ''
  }
  return moment(dataStr).format(pattern)
  // filter两个参数  第一个是函数名，第二个是时间格式化处理的函数
  // (函数里面的参数 第一个是传递的数据，第二个是需要转换的时间格式)
})

// 引入echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引入 'mathjs'
// import * as math from 'mathjs'
import { handleTree, addDateRange, parseTime } from '@/utils/shiguang'
Vue.prototype.handleTree = handleTree
Vue.prototype.addDateRange = addDateRange
Vue.prototype.parseTime = parseTime

// Vue.prototype.$math = math

import directive from './directive' // directive
Vue.use(directive)

import router from './router'
import './permission'
import './assets/icons'
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
