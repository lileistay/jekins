<template>
  <!--  领料出库打印-->
  <div class="print">
    <div class="title" style="margin-top: 20px">退供应商出库单</div>
    <div>
      <el-row>
        <el-col :span="10">
          <div>
            <div style="margin-left: 20px">出库单号：{{ print.outDocumentNo }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>执行人：{{ print.executeUserName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <div>执行日期：{{ print.executeData }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div style="margin-left: 20px">领料人：{{ print.executeUserName }}</div>
        </el-col>
        <el-col :span="8">
          <div>供应商：{{ print.companyName }}</div>
        </el-col>
        <el-col :span="8">
          <template v-for="item in dict.type.document_type">
            <span v-if="item.value === print.documentType" :key="item.value">出库单类型：{{ item.label }}</span>
          </template>
        </el-col>
      </el-row>
    </div>
    <div class="detailsTable">
      <el-table
        :data="templateList"
        size="mini"
        border
        class="elTable"
        style="width: 100%"
        :header-cell-style="{'color':'#000', 'text-align':'left', 'font-size':'14px','padding':'0', 'font-weight': 'bold','border-left':'1px solid #000','border-top':'1px solid #000'}"
        :cell-style="{'text-align':'left', 'font-size':'14px','padding':'0','border-left':'1px solid #000','border-top':'1px solid #000'}"
      >
        <el-table-column prop="inBatchNumber" label="入库批次号" width="150" />
        <el-table-column prop="matTypeName" label="物资类型" width="100" />
        <el-table-column prop="materialName" label="物资名称" width="150" />
        <el-table-column prop="materialSpec" label="规格" width="80" />
        <el-table-column prop="unitName" label="单位" width="80" />
        <el-table-column prop="outNumber" label="出库数量" width="80" />
        <el-table-column prop="purchasePrice" label="价格" width="80" />
        <el-table-column prop="materialPrice" label="金额" width="80" />
      </el-table>
      <el-table
        :data="total"
        border
        size="mini"
        class="elTable"
        :show-header="false"
        :header-cell-style="{'text-align':'center','font-size':'16px','padding':'0','border-left':'1px solid #000','border-top':'1px solid #000'}"
        :cell-style="{'text-align':'left','font-size':'16px','padding':'0','border-left':'1px solid #000'}"
      >
        <el-table-column prop="label" width="720" />
        <el-table-column prop="totalMoney" width="80" />
      </el-table>
    </div>
    <!--    <div style="font-size: 16px;">-->
    <!--      <el-row>-->
    <!--        <el-col :span="12">-->
    <!--          <div>领料人签名：</div>-->
    <!--        </el-col>-->
    <!--        <el-col :span="12">-->
    <!--          <div>库管员：</div>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
  </div>
</template>

<script>

export default {
  dicts: ['document_type'],
  name: 'OutsourcingReturnToSupplier',
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    templateList: {
      type: Array,
      default: function() {
        return []
      }
    },
    total: {
      type: Array,
      default: function() {
        return [{ label: '合计金额', totalMoney: 0 }]
      }
    }
  },
  data() {
    return {
      refundList: []
    }
  },
  watch: {
    'print.totalMoney': function(newValue, oldValue) {
      console.log('newValue', newValue)
      // console.log('newValue.totalMoney', newValue.totalMoney)
      this.getChange(newValue)
      // console.log('this.refundList', this.refundList)
    }
  },
  methods: {
    getChange(newValue) {
      this.refundList = []
      const temp = {
        name1: '合计金额',
        totalMoney: newValue
      }
      this.refundList.push(temp)
      // console.log(this.refundList)
    }
  }
  // watch: {
  //   print: {
  //     handler(newValue, oldValue) {
  //       this.refundList = []
  //       const temp = {
  //         name1: '合计金额',
  //         totalMoney: newValue.totalMoney
  //       }
  //       this.refundList.push(temp)
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style scoped lang="scss">
.print {
  //height: 297mm;
  width: 210mm;
  margin: 0;
  padding: 0;
  font-size: 16px;

  .title {
    margin: 5px 0;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
}

.detailsTable {
  width: 100%;
  margin: 0;
  font-size: 16px;

  .elTable {
    border: 1px solid #000000;
  }
}

</style>
