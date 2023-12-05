import login from '@/api/login/login'
import dept from '@/api/sysManger/dept'
import role from '@/api/sysManger/role'
import menu from '@/api/sysManger/menu'
import dict from '@/api/sysManger/dict/data'
import dataC from '@/api/sysManger/dict/dataC'
import dictType from '@/api/sysManger/dict/type'
import user from '@/api/sysManger/user'
import config from '@/api/sysManger/config'
import post from '@/api/sysManger/post'
import product from '@/api/sysManger/product'
import demand from '@/api/sysManger/demand'
import storageRoom from '@/api/modules/storageRoom'
import netPower from '@/api/modules/netPower' // 建档预约数据
import billingList from '@/api/modules/billingList' // 开单
import UnsettledItems from '@/api/sysManger/UnsettledItems' // 未成交项目
import RechargeableCard from '@/api/sysManger/RechargeableCard' // 充值
import finance from '@/api/modules/finance' // 财务
import log from '@/api/sysManger/log' // log
import basicMedicalData from '@/api/sysManger/basicMedicalData' // 医疗基础数据
import medical from '@/api/modules/medical' // 医务管理
import confinementRoom from '@/api/sysManger/confinementRoom' // 医务管理
import deptId from '@/api/index/deptId' // 首页
import treatmentMoney from '@/api/modules/treatmentMoney'
import customerCmt from '@/api/sysManger/customerCmt' // 治疗单业绩
import caseTemplateInfo from '@/api/sysManger/caseTemplateInfo'
import changePhoneRecord from '@/api/modules/confinement/changeRecord/changePhoneRecord' // 修改电话记录
import changeAscriptionRecord from '@/api/modules/confinement/changeRecord/changeAscriptionRecord' // 归属修改记录
import filing from '@/api/modules/filing'
import channel from '@/api/modules/channel'
import activityManagement from './modules/activityManagement' // 活动管理
import storageStatistic from '@/api/modules/statistic/storageStatistic' // 库房首页统计
import imports from  '@/api/imports/import'
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default {
  login,
  dept,
  role,
  menu,
  dict,
  dictType,
  user,
  post,
  config,
  netPower,
  modules,
  product,
  demand,
  UnsettledItems,
  billingList,
  RechargeableCard,
  finance,
  log,
  basicMedicalData,
  medical,
  confinementRoom,
  deptId,
  storageRoom, // 库房
  treatmentMoney, // 治疗单业绩生成
  // 客户管理
  customerCmt,
  caseTemplateInfo,
  // 修改电话记录
  changePhoneRecord,
  // 归属修改记录
  changeAscriptionRecord,
  // 建档类型
  filing,
  // 媒介
  channel,
  // 活动管理
  activityManagement,
  // 库房首页统计
  storageStatistic,
  imports,
  dataC
}
