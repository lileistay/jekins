<template>
<!--  日志调度-->
  <div class="app-container">
    <sg-table
      v-if="true"
      selection
      size="mini"
      :table-data="tableData"
      :columns="columns"
      :pagination="searchBar"
      @size-change="sizeChange"
      @current-change="currentChange"
      @operateClick="operateClick"
      @selection-change="handleSelectionChange"
    >
      <div slot="searchBar" class="searchBar">
        <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="mini" :inline="true" label-width="68px">
          <el-form-item label="任务名称" prop="jobName">
            <el-input
              v-model="queryParams.jobName"
              placeholder="请输入任务名称"
              clearable
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="任务组名" prop="jobGroup">
            <el-select
              v-model="queryParams.jobGroup"
              placeholder="请选择任务组名"
              clearable filterable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_job_group"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择执行状态"
              clearable filterable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getData">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="header">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['monitor:job:remove']"
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              @click="handleClean"
            >清空</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['monitor:job:export']"
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="submitLoading"
              @click="handleExport"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-close"
              size="mini"
              @click="handleClose"
            >关闭</el-button>
          </el-col>
        </el-row>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <show-dict-data :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
        <div v-if="data.props === 'jobGroup'">
          <dict-tag :options="dict.type.sys_job_group" :value="data.custom.jobGroup" />
        </div>
      </template>
    </sg-table>
    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.status == 1" label="异常信息：">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
    </sg-table>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import { export_table_to_excel } from '@/utils/utils'
import vm from "@/utils/util";
import { todayTime, timeFmt } from '@/utils/time'
export default {
  name: 'JobLog',
  components: { sgTable },
  dicts: ['sys_common_status', 'sys_job_group', 'sys_normal_disable'],
  data() {
    return {
      jobId:"",
      submitLoading: false,

      // 表格显示列表
      columns: [
        {
          lab: '日志编号',
          val: 'jobLogId',

        },
        {
          lab: '任务名称',
          val: 'jobName'
        },
        {
          lab: '任务组名',
          val: 'jobGroup',
          custom: 'jobGroup'
        },
        {
          lab: '调用目标字符串',

          val: 'invokeTarget'
        },
        {
          lab: '日志信息',
          val: 'jobMessage'
          // custom: 'postList',
          // width: 280
        },
        {
          lab: '执行时间',
          val: 'createTime'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status',

        }
      ],

      // 选中数组
      ids: [],
      // 加载蒙版
      showDataDialog: false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      tableData: [],
      tableDatas: [],
      searchBar: {
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1
      },
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [new Date(todayTime()[0]), new Date(todayTime()[1])],
      queryParams: {},
      // 表单参数
      form: {}
    }
  },
  created() {
    const jobId = this.$route.query.jobId
    this.jobId=this.$route.query.jobId
    this.getData()
  },
  methods: {
    // 返回按钮
    handleClose() {
      this.closeTag()
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 更多操作触发
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
          break
      }
    },
    /** 搜索按钮操作 */
    getData() {
      this.showDataDialog = false
      var data = {}
      const params={
        beginTime:this.dateRange?timeFmt('YYYY-mm-dd',this.dateRange[0]):'',
        endTime:this.dateRange?timeFmt('YYYY-mm-dd',this.dateRange[1]):''
      }
      data = Object.assign(this.searchBar, this.queryParams)
      data.params=params
      data.jobId=this.jobId
      this.$api.log.listJobLog({...data}).then(res => {
        if (res) {
          // console.log('日志', res)
          this.tableData = res.rows
          this.searchBar.total = res.total
          this.showDataDialog = false
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.getData()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobLogId)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      // this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds =  row.jobLogId
      console.log(row , jobLogIds)
      this.$confirm('是否确认删除定时此日志的数据项？').then(() => {
        this.$api.log.delJobLog(jobLogIds).then(res => {
          if (res) {
            // console.log('删除', res)
            this.getData()
          }
        })
      }).then(() => {
        // this.$message.success('删除成功')
      }).catch(() => {})
    },
    /** 清空按钮操作 */
    handleClean() {
      if (this.tableData.length === 0) {
        this.$message('暂时无数据清空')
        return
      }
      this.$confirm('是否确认删除定时此日志的数据项？').then(() => {
        this.$api.log.cleanJobLog().then(res => {
          if (res) {
            this.getData()
          }
        })
      }).then(() => {
        // this.$message.success('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.submitLoading = true
      this.$api.log.listJobLog(this.queryParams).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        /* 从表生成工作簿对象 */
        export_table_to_excel('#out-table', '日志管理')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    sizeChange(e) {
      this.searchBar.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.searchBar.pageNum = e[1]
      this.getData()
    }
  }
}
</script>
