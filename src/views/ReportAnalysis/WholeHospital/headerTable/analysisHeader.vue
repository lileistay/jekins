<template>
  <!----  媒介分析 渠道分析   ----->
  <!--- 点击四个字的子组件表头 全院报表分析表头数据 --->
  <div>
    <div class="header">
      <el-button style="margin-left: 20px;margin-bottom: 13px;margin-right: 442px;" type="danger" plain size="mini" @click="remode">返回</el-button>
      <div>
        <el-form ref="formdept" size="mini" style="margin-top: 13px;" :inline="true" :model="formdept" label-width="80px">
          <el-form-item>
            <el-date-picker
              v-model="formdept.timeData"
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
            <treeselect v-model="formdept.deptId" style="width: 190px;" :options="deptOptions" :show-count="true" :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" plain @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
    <el-table
      style="width: 1300px"
      size="mini"

      :header-cell-style="{'text-align':'center','color':'#1e64aa'}"
    >
      <el-table-column :label="form.name"/>
      <el-table-column :label="'二级'+form.name"/>
      <el-table-column label="新老客" />
      <el-table-column :label="'全院'+form.name+'报表'">
        <el-table-column :label="'时间：'+ form.time1+ '---' +form.time2">
          <el-table-column
            prop="province"
            label="门诊量"
          />
          <el-table-column
            prop="id"
            label="成交量"
          />
          <el-table-column
            prop="address"
            label="成交率"
          />
          <el-table-column
            prop="name"
            label="成交金额"
          />
          <el-table-column
            prop="city"
            label="人均消费额	"
          />
          <el-table-column
            prop="city"
            label="门诊量占比	"
          />
          <el-table-column
            prop="city"
            label="成交量占比	"
          />
          <el-table-column
            prop="city"
            label="成交金额占比	"
          />
        </el-table-column>
      </el-table-column>
    </el-table>
    <analysisNav ref="tables" :form="form" />
  </div>
</template>

<script>
import analysisNav from '@/views/ReportAnalysis/WholeHospital/headerTable/analysisNav'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'AnalysisHeader',
  components: { analysisNav, Treeselect },
  data() {
    return {
      form: {},
      formdept: {},
      // 公司树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
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
      this.handleNodeClick(val) // 监听表头公司
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.form = this.$route.query.item
    this.formdept = this.$route.query.item
    this.getTreeselect()
  },
  methods: {
    getData() {
      this.form = this.formdept
      this.$refs.tables.getList()
      console.log()
    },
      // 退出
      remode() {
          this.$router.go(-1)
      },
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header{
  display: flex;
  //justify-content: space-between;
  align-items: center;
}
::v-deep .el-table__empty-block {
  display: none;
}
</style>
