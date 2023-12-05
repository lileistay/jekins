<template>
  <!--- 医生  年龄  区域 --->
  <!--- 两个字的 表头组件 全院报表分析表头数据 --->
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
      :header-cell-style="getRowClass"
    >
      <el-table-column :label="form.name">
        <el-table-column :label="'时间：'+ form.time1+ '---' +form.time2">
<!--          form.name1-->
          <el-table-column
            label="医生"
          />
          <el-table-column
            label="新老客"
          />
          <el-table-column
            label="门诊量"
          />
        </el-table-column>
          <el-table-column label="项目">
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
    <navNavtable ref="tables" :form="form" />
  </div>
</template>

<script>
import navNavtable from '@/views/ReportAnalysis/WholeHospital/mxheaderTable/mxTableNav'
import Treeselect from "@riophae/vue-treeselect";
import vm from '@/utils/util'
export default {
  name: 'AnalysisHeadertwo',
  components: {
    Treeselect,
    navNavtable
  },
  data() {
    return {
      form: {
      },
      deptOptions:[],

    }
  },
  created() {
    this.form = this.$route.query.item
    this.getTreeselect()
    // this.form.timeData=[this.form.time1,this.form.time2]
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (column.label == "医生业绩统计" || column.label == "客户年龄统计" ) {
        return {
          // 头部标签
          'text-align':'center',
          'background-color': '#ccffff',
          color: '#2161ab',
          'font-size':"15px",
          height:'60px'
        }
      }  else  if (  column.label == "媒介分析" || column.label == "渠道分析" || column.label == "美学顾问" || column.label == "线上客服" || column.label == "医生1"|| column.label == "年龄" ||column.label == "地区" ) {
        return {
          // 头部标签
          'text-align':'center',
          'background-color': '#00ffff',
          'text-decoration': 'underline',
          'cursor':' pointer',
          color: '#1e64aa'
        }
      }  else {
        return {
          'text-align':'center',
          'background-color': '#c0c0c0',
          color: '#000',
          height:'15px'
        }
      }

    },
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    getConstructorName(val){
      this.itemName=this.depertmentList.filter(item=>item.departmentId==val)[0].departmentName
    },
    searchClick(){
      console.log(this.form,'ppp')
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

<style scoped lang="scss">
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

