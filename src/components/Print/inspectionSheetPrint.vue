<template>
  <div class="print">
    <div style="width: 100%;height: 100%" v-for="item in codeArr">
      <div class="title">检验单</div>
      <div class="header">
        <span>姓名：{{ print.customName }}</span>
        <span>电话：{{ print.customPhone }}</span>
        <span>收费单号：{{ print.orderNumber }}</span>
      </div>
      <div class="table">
        <el-table
          v-if="print.billType === '6' || print.oldBillType === '6'"
          :data="item"
          style="width: 100%"
          size="mini"
          :header-cell-style="{'text-align':'center','padding':'0px','font-size':'12px'}"
          :cell-style="{'text-align':'center','padding':'0px'}"
        >
          <el-table-column prop="projectName" label="项目" />
          <el-table-column prop="quantity" label="数量" width="50" />
          <el-table-column prop="sumPrice" label="价格" />
          <el-table-column prop="discountNumber" label="折扣" width="50" />
          <el-table-column prop="discountAmount" label="合计" />
        </el-table>
        <el-table
          v-else
          :data="item"
          style="width: 100%"
          size="mini"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="projectName" label="项目|药品" />
          <el-table-column prop="quantity" label="数量" width="50" />
          <el-table-column prop="totalAmount" label="价格" />
          <el-table-column prop="discount" label="折扣" width="50" />
          <el-table-column prop="discountAmount" label="合计" />
        </el-table>
        <span style="margin-left: 55px">备注：{{ print.billingRemarks }}</span>
        <span class="total">合计：{{ modeltotal(item) }}</span><br>
      </div>
      <div class="footer">
        <span>客户签名：</span>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'ChargeSheetPrint',
  data(){
    return{
      codedetail:'',
      codeArr:[],
    }
  },
  methods:{
    modeltotal(item){
      let num=0;
      item.forEach(value=>{
        num+= value.discountAmount
      })
      return num;
    }
  },
  watch:{
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
  },
  props: {
    print: {
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
    total: {
      type: String,
      default: '0'
    }
  }
  // data() {
  //   return {
  //     total: 0
  //   }
  // },
  // created() {
  // }
}
</script>

<style scoped lang="scss">
::v-deep .table .el-table__header-wrapper tr th{
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
  margin: 0;
  padding: 0;
  .title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
  .header {
    margin: 30px 20px 0 20px;
    font-size: 16px;
    display: flex;
    justify-content: space-evenly;
    //span {
    //  margin: 0 55px;
    //}
  }
  .table {
    width: 100%;
    font-size: 14px;
    margin-left: 10px;
    margin-top: 10px;
    .total {
      float: right;
      margin-right: 60px;
      font-weight: 600;
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
