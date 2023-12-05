<template>
  <div class="print">
    <div class="title">{{ packageOrderDetail.deptName }}</div>
    <div class="header">
      <span>客户姓名：{{ packageOrderDetail.customerName }}</span>
      <span>收费单号：{{ packageOrderDetail.orderNumber }}</span>
      <span>收费单类型：{{ BillTypeName(packageOrderDetail.billType) }}</span>
      <span>结账时间：{{ packageOrderDetail.checkoutTime }}</span>
    </div>
    <table border="" style="border-collapse: collapse" class="table">
      <thead>
        <tr>
          <td colspan="2">产品名称</td>
          <td colspan="1">数量</td>
          <td colspan="3">合计金额</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in packageItems" :key="index">
          <td colspan="2">
            {{ item.projectName }}
          </td>
          <td>
            {{ item.quantitySum }}
          </td>
          <td colspan="3">
            {{ item.discountAmount }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="1"> 项目合计：</td>
          <td colspan="1"> {{ total.finalPrice }}</td>
          <td colspan="1"> 应付金额：</td>
          <td colspan="1"> {{ total.discountAmount }}</td>
          <td colspan="1"> 实付金额：</td>
          <td colspan="1"> {{ total.totalPayment }}</td>
        </tr>
        <tr>
          <td colspan="1">结账方式：</td>
          <td colspan="5">
            <span v-for="(item,index) in paymentMethods" :key="index">
              {{ item.payName + ' ' + item.paymentAmount + '; ' }}
            </span>
          </td>
        </tr>
        <tr>
          <td>金额大写：</td>
          <td colspan="5">{{ capAmountToString(total.totalPayment) }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="header">
      <span>开单人：{{ packageOrderDetail.dsingleUser }}</span>
      <span>结账人：{{ packageOrderDetail.cashierName }}</span>
      <span>客服电话：{{ packageOrderDetail.deptPhone }}</span>
      <span>盖章：</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SetMealPrint',
  dicts: ['billing_type'],
  props: {
    packageOrderDetail: {
      type: Object,
      default: function() {
        return {}
      }
    },
    packageItems: {
      type: Array,
      default: function() {
        return []
      }
    },
    paymentMethods: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      tempData: {},
      payMethod: {},
      amountWord: {},
      data: [],
      payMethodData: [],
      amountWordData: [],
      payMethodName: '',
      showList: []
    }
  },
  computed: {
    total: {
      get() {
        let totalPayment = 0 // 实付金额
        let finalPrice = 0 // 项目合计
        let discountAmount = 0 // 应付金额
        this.packageItems.forEach(item => {
          totalPayment = totalPayment + item.totalPayment
          finalPrice = finalPrice + item.finalPrice
          discountAmount = discountAmount + item.discountAmount
        })
        return { totalPayment: totalPayment, finalPrice: finalPrice, discountAmount: discountAmount }
      }
    }},
  watch: {

  },
  created() {

  },
  methods: {
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {}
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj !== 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      // 引用类型
      // 数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i]
          if (typeof new_obj[i] === 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { // 对象
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] === 'object') {
              new_obj[key] = this.deepClone(obj[key])
            } else { // 对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj
    },
    capAmountToString(values) {
      if (values === null || values === '') {
        return ''
      }
      values = values.toString()
      const reg = new RegExp(',')
      values = values.replace(reg, '')
      // 不足两位小数补零
      const capArr = values.split('.')
      if (capArr.length < 2) {
        capArr[1] = '00'
      } else if (capArr[1].length === 1) {
        capArr[1] = capArr[1][0] + '0'
      }

      const len = capArr[0].length // 整数长度
      const len2 = capArr[1].length // 小数长度
      let arr = []
      let arr2 = []
      const chin_list = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] // 所有的数值对应的汉字
      const chin_lisp = ['仟', '佰', '拾', '兆', '仟', '佰', '拾', '亿', '仟', '佰', '拾', '万', '仟', '佰', '拾'] // 进制
      const chin_lisp2 = ['角', '分'] // 进制

      // 数字转大写，添加进制
      for (let i = 0; i < len; i++) {
        arr.push(parseInt(capArr[0][i])) // 输入的数据按下标存进去   存进去的只是数字
        arr[i] = chin_list[arr[i]] // 是根据我们输入的输入的数字，对应着我们的chin_list这个数组
      }
      for (let i = len - 1, j = 1; i > 0; i--) {
        // i =2	1		//倒序		为了添加进制，方便我们去观看
        arr.splice(i, 0, chin_lisp[chin_lisp.length - j++]) // j=2
      }
      for (let n = 0; n < len2; n++) {
        arr2.push(parseInt(capArr[1][n])) // 输入的数据按下标存进去   存进去的只是数字
        arr2[n] = chin_list[arr2[n]] // 是根据我们输入的输入的数字，对应着我们的chin_list这个数组
      }
      for (let i = len2, j = 1; i > 0; i--) {
        // i =2	1		//倒序		为了添加进制，方便我们去观看
        arr2.splice(i, 0, chin_lisp2[chin_lisp2.length - j++]) // j=2
      }

      arr = arr.join('')
      // 整数位处理
      if (len >= 1) {
        arr += '元'
      }// 1234510001=>壹拾贰亿叁仟肆佰伍拾壹万零壹元
      arr = arr
        .replace(/零[仟佰拾]/g, '零')// 100051231 =>壹亿零零零伍万壹仟贰佰叁拾壹
      arr = arr.replace(/零{2,}/g, '零')// 壹亿零零零伍万壹仟贰佰叁拾壹  =>壹亿零伍万壹仟贰佰叁拾壹
      arr = arr.replace(/零([兆|亿|万|元])/g, '$1')// 12300000壹仟贰佰叁拾零万零元 =>壹仟贰佰叁拾万元
      arr = arr.replace(/亿零{0,3}万/, '亿')// 10000000123 =>壹佰亿万零壹佰贰拾叁元
      arr = arr.replace(/兆零{0,3}亿/, '兆')// 10000000000123 壹拾零兆亿零壹佰贰拾叁元 =>
      arr = arr.replace(/^元/, '零元') // 0 ->零元

      // 小数位处理
      arr2 = arr2.join('')
      arr = arr + arr2
      arr = arr.replace(/零角/, '零') // 11.01 壹拾壹元零角壹分 =>壹拾壹元零壹分
      arr = arr.replace(/零{1,2}分/, '整') //

      return arr
    },

    BillTypeName(str) {
      // console.log(this.dict.type.billing_type)
      const obj = this.dict.type.billing_type.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    getPayMethod(payMethodName) {
      this.payMethodData = []
      this.payMethod = {
        payMethodName: '结账方式',
        payMethod: payMethodName
      }
      this.payMethodData.push(this.payMethod)
    }
  }
}
</script>

<style scoped lang="scss">

@page print {
  margin-top: 0;
  margin-bottom: 0;
}

::v-deep .el-table {
  table-layout: auto !important;
}

::v-deep .el-table__header {
  width: 100% !important;
}

::v-deep .el-table__body {
  width: 100% !important;
}

.print {
  height: 50%;
  margin: 0;
  padding: 0;

  .title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }

  .header {
    margin: 20px 0px 10px 0px;
    font-size: 12px;

    span {
      margin: 0 6px;
    }
  }

  //.detailsTable {
  //  width: 95%;
  //  margin: 20px 20px 0 20px;
  //  font-size: 13px;
  //
  //  .elTable {
  //    border: 1px solid #000000;
  //  }
  //
  //  .total {
  //    //float: right;
  //    margin-right: 50px;
  //    //font-weight: 400;
  //  }
  //}

  table {
    width:95%;
    table-layout:fixed;
    margin: 0 10px 0 10px;
    font-size: 13px !important;

    td{
      padding: 4px 5px;
    }
    //
    //.elTable {
    //  border: 1px solid #000000;
    //}
    //
    //.total {
    //  //float: right;
    //  margin-right: 50px;
    //  //font-weight: 400;
    //}
  }

  .footer {
    float: right;
    margin-top: 20px;
    margin-right: 90px;
    font-weight: 600;
  }
}
</style>
