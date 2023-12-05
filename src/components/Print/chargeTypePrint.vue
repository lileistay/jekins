<template>
  <div class="print">
    <div class="title">{{message}}收银交接单</div>
    <div class="header">
      <span>结账时间：{{ print.createTime }}&nbsp;&nbsp;至&nbsp;&nbsp;{{ print.endcreateTime }}</span>
    </div>
    <div class="detailsTable">
      <el-table
        :data="details"
        border
        size="mini"
        class="elTable"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column prop="billTypeName" label="收费类型" />
        <el-table-column prop="paymentAmount" label="实付金额" />
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
        <el-table-column label="汇总" prop="name" />
        <el-table-column label="汇总" prop="total" />
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChargeTypePrint',
  dicts: ['billing_type'],
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
      sumData: []
    }
  },
  watch: {
    details: {
      handler(newValue, oldValue) {
        this.getChange(newValue)
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    BillTypeName(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    getChange(data) {
      this.sumData = []
      let total = 0
      data.forEach(item => {
        total += item.paymentAmount
        this.$set(item, 'billTypeName', this.BillTypeName(item.billType))
      })
      const temp = {
        name: '汇总',
        total: total
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
}
</style>
