// 时间类型
const TimeTypeList = [
  {
    value: 'treat',
    label: '治疗时间'
  },
  {
    value: 'create',
    label: '生成业绩时间'
  },
  {
    value: 'checkout',
    label: '结账时间'
  },
  {
    value: 'putRecord',
    label: '建档时间'
  }
]

// 麻醉方式
const anesthesiaTypeList = [
  {
    value: '1',
    label: '局部'
  },
  {
    value: '2',
    label: '全麻'
  },
  {
    value: '3',
    label: '强化麻'
  },
  {
    value: '4',
    label: '输血费'
  },
  {
    value: '5',
    label: '输氧费'
  },
  {
    value: '6',
    label: '手术费'
  }
]

// 当天时间
const getCurrentTime = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const resultDate = `${year}-${month}-${day}`
  return [`${resultDate} 00:00:00`, `${resultDate} 23:59:59`]
}

// 治疗单业绩生成
const columns = [
  {
    lab: '客户姓名',
    val: 'customerName',
    custom: 'customerName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '电话',
    val: 'customPhone',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '客户卡号',
    val: 'customCardNumber',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '收费单号',
    val: 'orderNumber',
    width: 165,
    custom: 'orderNumber',
    showOverflowTooltip: true
  },
  {
    lab: '结账时间',
    val: 'checkoutTime',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '治疗时间',
    val: 'treatStartTime',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '开单业绩',
    val: 'billingPerformance',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '执行业绩',
    val: 'deductionAmount',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '当前治疗次数',
    val: 'thisScribingNum',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '本次执行业绩',
    val: 'performance',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '欠款金额',
    val: 'debtAmount',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '项目名称',
    val: 'projectName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '原价',
    val: 'finalPrice', // 后端没有返回数据
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '产品数量',
    val: 'quantity', // 后端没有返回数据
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '产品次数',
    val: 'priceNum',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '退款次数',
    val: 'refundNum',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '折后（应付总金额度）',
    val: 'totalAmount', // 后端没有返回数据
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '科室',
    val: 'departmentName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '一级类型',
    val: 'departmentName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '二级类型',
    val: 'projectTypeName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '三级类型',
    val: 'categoryName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '是否生成执行业绩',
    val: 'isExecute',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '生成业绩时间',
    val: 'genAmentTime',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '实际执行医生',
    val: 'aueName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '医生',
    val: 'doctorName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '医助',
    val: 'dassName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '麻醉方式',
    val: 'anesthesiaMethod',
    width: 200,
    custom: 'anesthesiaMethod',
    showOverflowTooltip: true
  },
  {
    lab: '麻醉师',
    val: 'alName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '护士',
    val: 'cnName',
    width: 200,
    showOverflowTooltip: true
  },
  // {
  //   lab: '巡回护士',
  //   val: 'circulatingNurse',
  //   width: 200,
  //   showOverflowTooltip: true
  // },
  {
    lab: '美学顾问',
    val: 'acName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '客户代表',
    val: 'crName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '仪器',
    val: 'equipmentName',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '治疗时长',
    val: 'treatmentLength',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '是否体检',
    val: 'isExperience',
    width: 200,
    showOverflowTooltip: true
  },
  {
    lab: '治疗备注',
    val: 'remark',
    width: 200,
    showOverflowTooltip: true
  }
]

// 所有是否的选项
const yesAndNoType = [
  {
    value: '0',
    label: '否'
  },
  {
    value: '1',
    label: '是'
  }
]

const textChangeArr = ['isExperience', 'isExecute']

export {
  TimeTypeList,
  anesthesiaTypeList,
  getCurrentTime,
  columns,
  yesAndNoType,
  textChangeArr
}
