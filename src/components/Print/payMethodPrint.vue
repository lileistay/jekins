<template>
  <div>
    <div v-for="page in pages" :key="page" class="print">
      <div class="title">{{message}}收银交接单</div>
      <div class="header">
        <span>结账时间：{{ print.createTime }}&nbsp;&nbsp;至&nbsp;&nbsp;{{ print.endcreateTime }}</span>
      </div>
      <div class="detailsTable">
        <el-table
          :data="details.slice((page-1)*onePageRow,page*onePageRow)"
          border
          size="mini"
          class="elTable"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="payName" label="结账方式" />
          <el-table-column prop="paymentAmount" label="实付金额" />
          <el-table-column prop="settlementAmount" label="结账金额" />
        </el-table>
      </div>
      <div v-if="page === pages" class="table">
        <el-table
          :data="sumData"
          border
          size="mini"
          class="elTable"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :show-header="false"
        >
          <el-table-column label="汇总" prop="name" />
          <el-table-column label="汇总" prop="total1" />
          <el-table-column label="汇总" prop="total2" />
        </el-table>
        <el-table
          :data="refundData"
          border
          size="mini"
          class="elTable"
          :show-header="false"
        >
          <el-table-column label="退款笔数" prop="name1" />
          <el-table-column label="退款笔数" prop="debtorNumer" />
          <el-table-column label="退款金额" prop="name2" />
          <el-table-column label="退款金额" prop="totalArrears" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PayMethodPrint',
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    message:{
       type:String,
       default:function (){
         return '';
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
    onePageRow: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      refundData: [],
      sumData: []
    }
  },
  computed: {
    pages() {
      var pages_ = Math.ceil(this.details.length / this.onePageRow)
      return pages_ <= 0 ? 1 : pages_
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
        this.getTotal(newValue)
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    getChange(data) {
      this.refundData = []
      const temp = {
        name1: '退款笔数',
        debtorNumer: data.debtorNumer,
        name2: '退款金额',
        totalArrears: data.totalArrears
      }
      this.refundData.push(temp)
    },
    getTotal(data) {
      this.sumData = []
      let total1 = 0
      let total2 = 0
      data.forEach(item => {
        total1 += item.paymentAmount
        total2 += item.settlementAmount
      })
      const temp = {
        name: '汇总',
        total1: total1,
        total2: total2
      }
      this.sumData.push(temp)
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
