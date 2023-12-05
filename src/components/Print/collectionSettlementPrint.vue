<template>
  <div class="print" v-if="Print">
    <div style="width: 100vw;height: 100vh" v-for="item in codeArr">
      <div class="title Font">结账单</div>
      <div style="width: 100%;height: 20px;text-align: center" v-if="print.billType=='2'">定金（临时）收据</div>
      <div class="header">
        <span>姓名：{{ print.customerName }}</span>
        <span>收费单号：{{ print.orderNumber }}</span>
        <span>客户卡号：{{ customCardNumberlist }}</span>
        <span>结账时间：{{ getTime }}</span>
      </div>
      <div class="table">
        <el-table
          v-if="print.billType === '13'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
          :row-style="{height:'5px'}"
        >
          <el-table-column label="总储值金额" prop="totalAmount" />
          <el-table-column label="储值金额" prop="priceOne" />
          <el-table-column label="赠送金额" prop="priceTwo" />
          <el-table-column label="应退金额" prop="discountAmount" />
          <el-table-column label="储值类型" prop="itemId">
            <template slot-scope="scope">
              <span v-if="scope.row.itemId === 3">{{ scope.row.itemId === 3 ? '集团' : '' }}</span>
              <span v-for="item in dict.type.recharge_card_type" v-else :key="item.value">
              <span>{{ scope.row.itemId === parseInt(item.value) ? item.label : '' }}</span>
            </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="print.billType === '14'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="储值金额" prop="totalAmount" />
          <el-table-column label="剩余金额" prop="remainingAmount" />
          <el-table-column label="应退金额" prop="discountAmount" />
        </el-table>
        <el-table
          v-if="print.billType === '12'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="总预约金" prop="totalAmount" />
          <el-table-column label="剩余预约金" prop="remainingAmount" />
          <el-table-column label="应退预约金" prop="discountAmount" />
        </el-table>
        <el-table
          v-if="print.billType === '3'|| print.billType === '4'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="储值金额" prop="amountPayable" />
          <el-table-column label="赠送金额" prop="giftAmount" />
          <el-table-column label="储值类型" prop="rechargeCardType">
            <template slot-scope="scope">
              <span v-if="scope.row.rechargeCardType === '3'">{{ scope.row.rechargeCardType === '3' ? '集团' : '' }}</span>
              <span v-for="item in dict.type.recharge_card_type" v-else :key="item.value">
              <span>{{ scope.row.rechargeCardType === item.value ? item.label : '' }}</span>
            </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="print.billType === '1' || print.billType === '2' || print.billType === '7' || print.billType === '8'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="产品名称" width="300" prop="projectName" />
          <el-table-column label="数量" prop="quantity" />
          <el-table-column label="金额" prop="discountAmount" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
        <el-table
          v-if="print.billType === '6'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="产品名称" width="150" prop="projectName" />
          <el-table-column label="数量" prop="quantity" />
          <el-table-column label="金额" prop="discountAmount" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
        <el-table
          v-if="print.billType === '9' && print.oldBillType !== '6'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="产品名称" width="150" prop="projectName" />
          <el-table-column label="数量" prop="quantity" />
          <el-table-column label="金额" prop="discountAmount" />
        </el-table>
        <el-table
          v-if="print.billType === '9' && print.oldBillType === '6'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="产品名称" width="150" prop="projectName" />
          <el-table-column label="数量" prop="quantity" />
          <el-table-column label="金额" prop="discountAmount" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
        <el-table
          v-if="print.billType === '11'"
          :data="item"
          border
          index="序号"
          size="mini"
          class="elTable"
        >
          <el-table-column label="产品名称" prop="projectName" />
          <el-table-column label="数量" prop="quantity" />
          <el-table-column label="金额" prop="discountAmount" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
        <div>
          <el-table
            :data="data"
            border
            size="mini"
            class="elTable"
            :show-header="false"
          >
            <el-table-column label="项目合计" prop="name1" />
            <el-table-column label="金额" prop="totalItemsAmount" >
              <!--              <template>-->
              <!--                {{ modeltotal(item) }}-->
              <!--              </template>-->
            </el-table-column>
            <el-table-column label="应付金额" prop="name2" />
            <el-table-column label="金额" prop="amountPayable" >
              <!--              <template>-->
              <!--                {{ modeltotal(item) }}-->
              <!--              </template>-->
            </el-table-column>
            <el-table-column label="实付金额" prop="name3" />
            <el-table-column label="金额" prop="paidAmount" >
              <template>
                {{ totalPricedata }}
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="payMethodData"
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
            <el-table-column label="金额大写" prop="amountWords" />
          </el-table>
          <div style="font-size: 8px;margin-top:5px">
            <span class="total">开单人：{{ print.dsingleUserName }}</span>
            <span class="total">结账人：{{ userInfo.nickName }}</span>
            <span class="total">客服电话：</span>
            <!-- <span class="total">客服电话：{{ userInfo.phonenumber }}</span> -->
            <span class="total">盖章：</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>客户签名：</span>
      </div>
    </div>

  </div>
</template>

<script>
import { math } from '@/utils/math'
export default {
  name: 'ChargeSheetPrint',
  dicts: ['billing_type', 'recharge_card_type'],
  props: {
    totalPricedata:{
      type: Number,
      default: function() {
        return 0
      }
    },
    customCardNumberlist:{
      type: String,
      default: function() {
        return ''
      }
    },
    newamountPayable:{
      type: Number,
      default: function() {
        return 0
      }
    },
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    userInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    details: {
      type: Array,
      default: function() {
        return []
      }
    },
    finalPayData: {
      type: Array,
      default: function() {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      getTime: '',
      tempData: {},
      payMethod: {},
      amountWord: {},
      data: [],
      payMethodData: [],
      amountWordData: [],
      payMethodName: '',
      codedetail:'',
      codeArr:[],
      Print:false,

    }
  },
  watch: {
    totalPricedata:{
      handler(newValue, oldValue) {
        this.amountWordData=[];
        this.amountWord = {
          amountWordsName: '金额大写',
          amountWords: this.capAmountToString(this.totalPricedata)
        }
        this.amountWordData.push(this.amountWord)
        if(localStorage.getItem('orderTypelistnew')=='true'){
          this.codeArr=[];
          this.codedetail=Math.ceil(this.details.length/5);
          for(let i=0;i<this.codedetail;i++){
            this.codeArr.push(this.details.slice(i*5,i*5+5))
          }
        }
        this.Print=true;

      },
      deep:true,
    },
    total: {
      handler(newValue, oldValue) {
        this.data=[];
        this.tempData = {
          name1: '项目合计',
          totalItemsAmount: newValue,
          name2: '应付金额',
          amountPayable: newValue,
          name3: '实付金额',
          paidAmount:newValue
        }
        this.data.push(this.tempData)
      },
      deep: true // 深度监听
    },
    details: {
      handler(newValue, oldValue) {
        this.codeArr=[];
        this.codedetail=Math.ceil(this.details.length/5);
        for(let i=0;i<this.codedetail;i++){
          this.codeArr.push(this.details.slice(i*5,i*5+5))
        }
      },
      deep: true // 深度监听
    },
    finalPayData: {
      handler(newValue, oldValue) {
        this.getChange(newValue)
      },
      deep: true // 深度监听
    },

  },
  created() {
    this.tempData = {
      name1: '项目合计',
      totalItemsAmount: this.total,
      name2: '应付金额',
      amountPayable: this.total,
      name3: '实付金额',
      paidAmount: this.total
    }
    this.payMethod = {
      payMethodName: '结账方式',
      payMethod: this.payMethodName
    }
    this.amountWord = {
      amountWordsName: '金额大写',
      amountWords: this.capAmountToString(this.totalPricedata)
    }
    this.data.push(this.tempData)
    this.amountWordData.push(this.amountWord)
    this.payMethodData.push(this.payMethod)
    this.getCurrentTime()
  },
  methods: {
    modeltotal(item){
      let num=0;
      item.forEach(value=>{
        num=math.add(num,value.discountAmount)
        // num+= value.discountAmount
      })
      return num;
    },
    getChange(payData) {
      payData.forEach(item => {
        this.payMethodName += item.payName + ':' + item.paymentAmount
      })
      this.payMethodData.forEach(item => {
        item.payMethod = this.payMethodName
        this.$forceUpdate()
      })
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
    getCurrentTime() {
      // 获取当前时间并打印
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    }
  }
}
</script>

<style scoped lang="scss">
.Font{
  font-size: 16px !important;
}
::v-deep .table .el-table__header-wrapper tr th{
  font-weight: normal !important;
  padding: 0px !important;
  font-size: 5px !important;
  height: 3px !important;
}
::v-deep .table .el-table__body-wrapper tr td{
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

    font-size: 5px;
    span {
      margin: 0 6px;
    }
  }
  .table {
    width: 95%;
    margin-left: 20px;
    font-size: 8px;
    margin-top: 5px;
    .elTable {
      border: 1px solid #000000;
    }
    .total {
      //float: right;
      margin-right: 50px;
      //font-weight: 400;
    }
  }
  .footer {
    float: right;
    margin-right: 90px;
    font-weight: 600;
    margin-top: -15px;
  }
}
</style>
