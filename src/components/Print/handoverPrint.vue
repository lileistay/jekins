<template>
  <div class="print">
    <div class="title">{{message}}收银交接单</div>
    <div class="header">
      <span>结账时间：{{ print.createTime }}&nbsp;&nbsp;至&nbsp;&nbsp;{{ print.endcreateTime }}</span>
    </div>
    <div class="detailsTable">
      <el-table
        :data="header"
        border
        size="mini"
        class="elTable"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="收银员" prop="cashierName" />
        <el-table-column label="结账方式" prop="payName" />
        <el-table-column label="实收金额" prop="paymentAmount" />
        <el-table-column label="结算金额" prop="settlementAmount" />
      </el-table>
      <el-table
        v-for="(item, index) in tableData"
        :key="index"
        :data="item"
        border
        size="mini"
        class="elTable"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :span-method="objectSpanMethod"
        :show-header="false"
      >
        <el-table-column label="收银员" prop="cashierName" />
        <el-table-column label="结账方式" prop="payName" />
        <el-table-column label="实收金额" prop="paymentAmount" />
        <el-table-column label="结算金额" prop="settlementAmount" />
      </el-table>
    </div>
    <div class="table">
      <el-table
        :data="sumData"
        border
        size="mini"
        class="elTable"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :show-header="false"
      >
        <el-table-column label="汇总" prop="name1" />
        <el-table-column label="汇总" prop="name2" />
        <el-table-column label="汇总" prop="total1" />
        <el-table-column label="汇总" prop="total2" />

      </el-table>
      <el-table
        :data="refundList"
        border
        size="mini"
        class="elTable"
        :show-header="false"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="退款笔数" prop="name1" />
        <el-table-column label="退款笔数" prop="debtorNumer" />
        <el-table-column label="退款金额" prop="name2" />
        <el-table-column label="退款金额" prop="totalArrears" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { math } from '@/utils/math'

export default {
  name: 'HandoverPrint',
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    message:{
      type:String,
      default: function() {
        return ''
      }
    },
    details: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      refundList: [],
      mergeObj: {},
      mergeArr: ['cashierName'],
      sumData: [],
      tableData: [],
      header: {} // 空对象，只为了显示表头
    }
  },
  watch: {
    print: {
      handler(newValue, oldValue) {
        this.getChange(newValue)
      },
      deep: true
    },
    details: {
      handler(newValue, oldValue) {
        this.getSpanArr(newValue)
      }
    }
  },
  mounted() {
    // this.getSpanArr(this.details)
  },
  methods: {
    getSpanArr(data) {
      this.sumData = []
      let total1 = 0
      let total2 = 0
      data.forEach(item => {
        total1 += item.paymentAmount
        total2 += item.settlementAmount
      })
      const temp = {
        name1: '',
        name2: '汇总',
        total1: total1,
        total2: total2
      }
      this.sumData.push(temp)
      this.tableData = this.sortClass(data)
      this.tableData.forEach(items => {
        let temp = {}
        let total1 = 0
        let total2 = 0
        items.forEach(item => {
          total1 = math.add(total1, item.paymentAmount)
          total2 = math.add(total2, item.settlementAmount)
          temp = {
            cashierName: item.cashierName,
            payName: '汇总',
            paymentAmount: total1,
            settlementAmount: total2
          }
        })
        items.push(temp)
        this.span(items)
      })
      console.log(this.tableData)
    },
    span(data) {
      this.mergeArr.forEach((key, index1) => {
        let count = 0 // 用来记录需要合并行的起始位置
        this.mergeObj[key] = [] // 记录每一列的合并信息
        data.forEach((item, index) => {
          // index == 0表示数据为第一行，直接 push 一个 1
          if (index === 0) {
            this.mergeObj[key].push(1)
          } else {
            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
            if (item[key] === data[index - 1][key]) {
              this.mergeObj[key][count] += 1
              this.mergeObj[key].push(0)
            } else {
              // 如果当前行和上一行其值不相等
              count = index // 记录当前位置
              this.mergeObj[key].push(1) // 重新push 一个 1
            }
          }
        })
      })
    },
    sortClass(data) {
      const groupBy = (array, f) => {
        const groups = {}
        array.forEach(o => {
          const group = JSON.stringify((f(o)))
          groups[group] = groups[group] || []
          groups[group].push(o)
        })
        return Object.keys(groups).map(group => {
          return groups[group]
        })
      }
      return groupBy(data, (item) => {
        return item.cashier
      })
    },
    getChange(data) {
      this.refundList = []
      const temp = {
        name1: '退款笔数',
        debtorNumer: data.refundnum,
        name2: '退款金额',
        totalArrears: data.refundmuch
      }
      this.refundList.push(temp)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 判断列的属性
      if (this.mergeArr.indexOf(column.property) !== -1) {
        // 判断其值是不是为0
        if (this.mergeObj[column.property][rowIndex]) {
          const num = math.subtract(this.tableData[0].length, this.mergeObj[column.property][rowIndex])
          return [this.mergeObj[column.property][rowIndex] + 2, 1]
        } else {
          // 如果为0则为需要合并的行
          return [0, 0]
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

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
  height: 100%;
  margin: 0;
  padding: 0;
  .title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
  .header {
    margin: 30px 20px 0 20px;
    font-size: 14px;
    span {
      margin: 0 6px;
    }
  }
  .detailsTable {
    width: 95%;
    margin: 20px 20px 0 20px;
    font-size: 14px;
    .elTable {
      border: 1px solid #000000;
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
    font-size: 14px;
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
    margin-top: 20px;
    margin-right: 90px;
    font-weight: 600;
  }
}
</style>
