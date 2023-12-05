<template>
  <div class="print"   >
    <div v-for="(item,index) in codeArr" :key="index" style="width: 100vw;height: 100vh">
      <div class="title Font" ><span>{{message}}</span> {{ BillTypeName(print.billType) }}</div>
      <div class="header">
        <span >姓名：{{ print.customerName }}</span>
        <span >收费单号：{{ print.orderNumber }}</span>

        <span >结账时间：{{ print.billTime }}</span>
      </div>
      <div style="font-size: 12px;margin-left: 5px">
        <span >客户卡号：{{customCardNumberlist}}</span>
      </div>
      <div class="detailsTable">
        <el-table
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="产品名称" width="250" prop="projectName">
            <template slot-scope="scope">
              {{scope.row.billType=='10'?'交住院结算':scope.row.billType=='17'?'退住院结算':scope.row.projectName}}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="quantity" />
          <el-table-column label="合计金额" prop="discountAmount"  />
        </el-table>
      </div>
      <div class="table">
        <el-table
          :data="data"
          border
          size="mini"
          class="elTable"
          :show-header="false"
          style="font-size: 5px;"
        >
          <el-table-column label="项目合计" prop="name1"  />
          <el-table-column label="金额" width="100" prop="totalItemsAmount">
            <template>
              {{ modeltotal(item) }}
            </template>
          </el-table-column>
          <el-table-column label="应付金额"  prop="name2" />
          <el-table-column label="金额" prop="amountPayable">
<!--            <template>-->
<!--              {{ modeltotal(item) }}-->
<!--            </template>-->
          </el-table-column>
          <el-table-column label="实付金额"  prop="name3" />
          <el-table-column label="金额" prop="paidAmount" >
          <template>
            {{paidAmountlist}}
          </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="payMethodData.length==0?[{payMethodName:'',payMethod:''}]:payMethodData"
          border
          size="mini"
          class="elTable"
          :show-header="false"
        >
          <el-table-column label="结账方式" prop="payMethodName" width="20px" />
          <el-table-column label="结账方式" prop="payMethod" />
        </el-table>
        <el-table
          :data="amountWordData"
          border
          size="mini"
          class="elTable"
          :show-header="false"
        >
          <el-table-column label="金额大写" prop="amountWordsName" width="20px" />
          <el-table-column label="金额大写" prop="amountWords" >
            <template>
              {{Money}}
            </template>
          </el-table-column>
        </el-table>
        <div style="font-size: 13.5px;">
          <span class="total">开单人：{{ print.dsingleUserName }}</span>
          <span class="total">结账人：{{ print.cashierName }}</span>
          <span class="total">客服电话：</span>
          <span class="total" style="margin-left: 65px;">盖章：</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { math } from '@/utils/math'
export default {
  name: 'OrderDetailsPrint',
  dicts: ['billing_type'],
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    paidAmountlist:{
      type: Number,
      default: function() {
        return 0
      }
    },
    customCardNumberlist:{
      type:String,
      default:function (){
        return ''
      }
    },
    message:{
      type:String,
      default:function (){
        return ''
      }
    },
    details: {
      type: Array,
      default: function() {
        return []
      }
    },
    total: {
      type: String,
      default: '0'
    },
    finalPayData: {
      type: String,
      default: ''
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
      codedetail:'',
      codeArr:[],
      flag:false,
      Money:"",
    }
  },
  watch: {
    finalPayData: {
      handler(newValue, oldValue) {
        this.getPayMethod(newValue)
      },
      deep: true // 深度监听
    },
    paidAmountlist:{

      handler(newValue, oldValue) {
        this.Money=this.capAmountToString(this.paidAmountlist)
        // this.amountWord = {
        //   amountWordsName: '金额大写',
        //   amountWords: this.capAmountToString(this.paidAmountlist)
        // }
        // console.log(this.amountWord,'sadas')
        // this.amountWordData=[];
        // this.amountWordData.push(this.amountWord)
      },
      deep:true
    },
    total: {
      handler(newValue, oldValue) {
        this.codeArr=[];

        this.codedetail=Math.ceil(this.details.length/5);
        for(let i=0;i<this.codedetail;i++){
          this.codeArr.push(this.details.slice(i*5,i*5+5))
        }
        this.getTotal(newValue)
      },
      deep: true
    }
  },
  created() {

  },
  methods: {
    modeltotal(item){
        let num=0;
        item.forEach(value=>{
          num=math.add(num,value.discountAmount)
        })
        return num;
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
      } else if (capArr[1].length == 1) {
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 && rowIndex === 1) {
        return {
          rowspan: 1,
          colspan: 5
        }
      }
      if (columnIndex === 1 && rowIndex === 2) {
        return {
          rowspan: 1,
          colspan: 5
        }
      }
    },
    BillTypeName(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    getPayMethod(payMethodName) {
      this.payMethodData = []
      this.payMethod = {
        payMethodName: '结账方式',
        payMethod: payMethodName
      }
      this.payMethodData.push(this.payMethod)
    },
    getTotal(total) {
      this.data = []
      this.amountWordData = []
      this.tempData = {
        name1: '项目合计',
        totalItemsAmount: total,
        name2: '应付金额',
        amountPayable: total,
        name3: '实付金额',
        paidAmount: total
      }
      this.amountWord = {
        amountWordsName: '金额大写',
        amountWords: this.capAmountToString(total)
      }
      this.data.push(this.tempData)
      this.amountWordData.push(this.amountWord)
    }
  }
}
</script>

<style scoped lang="scss">
.Font{
  font-size: 16px !important;
}
::v-deep .detailsTable .el-table__header-wrapper tr th{
  font-weight: normal !important;
  padding: 0px !important;
  font-size: 5px !important;
}
::v-deep .table .el-table__body-wrapper tr td{
  font-weight: normal !important;
  padding: 0px !important;
  font-size: 5px !important;
  // font-size: 12px !important;
}

::v-deep .detailsTable .el-table__body-wrapper tr td{
  font-weight: normal !important;
  padding: 0px !important;
  font-size: 5px !important;
  // font-size: 12px !important;
}
::v-deep .el-table {
  table-layout: auto!important;
}
::v-deep .el-table__header {
  width: 100%!important;
}
::v-deep .el-table__body {
  width: 100%!important;
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
    font-size: 13px;
    span {
      margin: 0 6px;
    }
  }
  .detailsTable {
    width: 95%;
    font-size: 9px !important;
    margin-left: 20px;
    margin-top: 5px;
    .elTable {
      // border: 1px solid #000000;

    }
    .total {
      //float: right;
      margin-right: 50px;
      //font-weight: 400;
    }
  }
  .table {
    width: 95%;
    margin: 0 20px 0 20px;
    font-size: 9px !important;
    .elTable {
      // border: 1px solid #000000;
    }
    .total {
      //float: right;
      margin-right: 20px;
      //font-weight: 400;
    }
  }
  .footer {
    float: right;
    margin-top: 20px;
    margin-right: 90px;
    font-weight: 600;
  }
}
</style>
