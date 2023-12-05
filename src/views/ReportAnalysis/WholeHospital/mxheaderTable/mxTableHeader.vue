<template>
  <!--- 美学顾问 线上客服（暂无）  --->
  <div>
    <div class="header">
      <el-button style="margin-left: 20px" type="danger" plain size="mini" @click="remode">返回</el-button>
      <div>
        <el-form ref="formdept" size="mini" :inline="true" :model="form" label-width="80px">
          <el-form-item>
            <el-date-picker
              v-model="form.timeData"
              type="daterange"
              style="width: 55%;"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              size="small"
              end-placeholder="结束日期">

            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="组织" prop="deptId">
            <treeselect v-model="form.deptId" style="width: 190px;" :options="deptOptions" :show-count="true" :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" />
          </el-form-item>


          <el-form-item>
            <el-button size="mini" type="" @click="searchClick">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div />
    </div>
    <el-table
      style="width: 1300px"
      size="mini"
      :header-cell-style="{'text-align':'center',color:'#1e64aa'}"
    >
      <el-table-column :label="form.name1" />
      <el-table-column label="新老客" />
      <el-table-column :label="form.name">
        <el-table-column :label="'时间：'+ form.time1+ '---' +form.time2">
          <el-table-column
            label="门诊量"
          />
          <el-table-column
            label="成交量"
          />
          <el-table-column
            label="成交率"
          />
          <el-table-column
            label="成交金额"
          />
          <el-table-column
            label="人均消费额	"
          />
          <el-table-column
            label="门诊量占比	"
          />
          <el-table-column
            label="成交量占比	"
          />
          <el-table-column
            label="成交金额占比	"
          />
        </el-table-column>
      </el-table-column>
    </el-table>
    <mx-table-nav ref="tables" :form="form" />
  </div>
</template>

<script>
import MxTableNav from '@/views/ReportAnalysis/WholeHospital/mxheaderTable/mxTableNav'
import Treeselect from "@riophae/vue-treeselect";
import vm from '@/utils/util'
export default {
  name: 'MxTable',
  components: {Treeselect, MxTableNav },
  data() {
    return {
      form: {
        timeData:[]
      },
      deptOptions:[]
    }
  },
  created() {
    this.form = this.$route.query.item
    this.form.timeData=[this.form.time1,this.form.time2]
    this.getTreeselect()
  },
  methods:{
    getConstructorName(val){
      this.itemName=this.depertmentList.filter(item=>item.departmentId==val)[0].departmentName
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },

    searchClick(){
      console.log(this.form, 'timeData',this.$refs.tables, this.form.timeData)
      this.$refs.tables.getList()
    },
    remode(){
      this.closeTag()
    },
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
  }
}
</script>

<style scoped>
::v-deep .el-table__empty-block {
  display: none;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1511px;
  padding-top: 15px;
}
</style>
