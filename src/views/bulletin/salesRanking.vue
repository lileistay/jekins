<template>
  <!--产品售卖排行-->
  <div>
    <div class="achievement">
      <div class="briefing_header">
        <div style="font-size: 14px;color: #666;margin-left: 20px;margin-top: 10px;font-weight: bold;">产品售卖排行</div>
        <div>
          <el-form :inline="true" :model="form" size="mini" class="form">
            <el-form-item>
              <el-select filterable v-model="form.user" placeholder="请选择" style="width: 150px;" @change="loadmore">
                <el-option label="订单排行" value="singular" />
                <el-option label="总业绩" value="amount" />
                <el-option label="人均消费" value="monomer" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="morep">查看更多 <i class="el-icon-arrow-right" /></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table
          element-loading-text="正在加载"
          :data="tableData"
          style="width: 100%"
          size="mini"
          height="358"
          :show-header="false"
          :cell-style="{ textAlign: 'left' }"
          :load-more-disabled="disabledLoad"
          :cell-class-name="className"
        >
          <el-table-column prop="projectName"  width="200" :show-overflow-tooltip="true" label="名称" />
          <el-table-column   label="单数" style="text-align: right !important;">
            <template slot-scope="scope">
              {{ scope.row.singular }} 单
            </template>
          </el-table-column>
          <el-table-column   label="总金额">
            <template slot-scope="scope">
              {{ scope.row.amount|numberToCurrency }}
            </template>
          </el-table-column>
          <el-table-column  label="价格/人" >
            <template slot-scope="scope">
              {{ scope.row.monomer|numberToCurrency }}  元/人
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import templete from 'vue'
export default {
  name: 'SalesRanking',
    components:{},
  data() {
    return {
      form: {
        user: 'singular'
      },
      billingPageNum: 1,
      billingPageSize: 8,
      tableData: [],
    }
  },
  computed: {
    disabledLoad() {
      return false
    },
      deptId: {
          get() {
              return this.$store.getters.departmentId
          },
          set(val) {
              val = this.$store.getters.departmentId
          }
      }
  },
  watch: {
      deptId(val) {
          this.deptId = val
          this.loadmore()
      }
  },
  created() {
    this.loadmore()
  },
  methods: {
      className({row, column, rowIndex, columnIndex}){
        if (columnIndex==3){
            return 'className'
        }
          if (columnIndex==2 || columnIndex==1){
              return 'className1'
          }
      },
    loadmore() {
      var data = {
        orderType: this.form.user,
        deptId: this.deptId
      }
      this.tableData = []
      this.$api.deptId.productList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.singular = item.singular
              item.monomer = (Number(item.monomer)).toFixed(0)
            item.amount = (Number(item.amount)).toFixed(0)
          })
          res.rows.some((v, i) => {
            if (i >= 10) {
              return
            }
            this.tableData.push(v)
          })
        }
      })
    },
    morep() {
      // 节流
      this.$router.push({ path: 'newannouncement' })
      // setTimeout(() => {

      // }, 500)
      // this.$router.push({ path: 'moreProducts' })
    }
  }
}
</script>

<style scoped>
.header{
  justify-content: space-between;
  padding: 0 8%;
  overflow: hidden;
}
p{
  font-weight: 650;
  font-size: 16px;
}
.briefing_header{
  height: 40px;
    width: 100%;
  background-color: #F9F9F9;
  border-bottom: 1px solid #e5e3e3;
  /*border-radius: 10px 10px 0 0;*/
  display: flex;
  justify-content: space-between;
  /*padding: 0 100px;*/
}
.form{
  margin-top: 5px;
}
.achievement{
  float: left;
  width: 100%;
  height: 400px;
  background-color: #ffffff;
  border-radius: 10px;
    /*border: 1px solid #e5e3e3;*/
}
::v-deep .el-table__body-wrapper{
   overflow-y: hidden !important;
}
::v-deep .el-table .cell.el-tooltip {
    white-space: nowrap;
    min-width: 50px;
    margin-left: 11px;
}

</style>
<style>
.className{
    text-align: right !important;
    display: block;
    margin-right: 8px;
}
.className1{
    text-align: center !important;
}
</style>