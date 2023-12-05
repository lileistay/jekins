<template>
  <div class="app-container">
    <sg-table
      v-if="true"
      size="mini"
      :table-data="tableData"
      :columns="columns"
      :pagination="searchBar"
      @size-change="sizeChange"
      @current-change="currentChange"
      @operateClick="operateClick"
    >
      <div slot="searchBar" class="searchBar">
        <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
          <el-form-item label="任务名称" prop="jobName">
            <el-input
              v-model="queryParams.jobName"
              placeholder="请输入任务名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="任务组名" prop="jobGroup">
            <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable filterable>
              <el-option
                v-for="dict in dict.type.sys_job_group"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable filterable>
              <el-option
                v-for="dict in dict.type.sys_job_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="header">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-has-permi="['job:job:add']"
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <!--            v-hasPermi="['monitor:job:export']"-->
            <el-button
              v-has-permi="['job:job:export']"
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="submitLoading"
              @click="handleExport"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <!--            v-hasPermi="['monitor:job:query']"-->
            <el-button
              v-has-permi="['job:job:query']"
              type="info"
              plain
              icon="el-icon-s-operation"
              size="mini"
              @click="handleJobLog"
            >日志</el-button>
          </el-col>
        </el-row>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <el-switch
            v-model="data.custom.status"
            active-value="0"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(data.custom)"
          />
        </div>
        <div v-if="data.props === 'jobGroup'">
          <dict-tag :options="dict.type.sys_job_group" :value="data.custom.jobGroup" />
        </div>
        <div v-if="data.props === 'edit'">
          <el-button size="mini" type="text" style="color: #E6A23C" @click="handleUpdate(data.custom)">修改</el-button>
          <el-button size="mini" type="text"style="color: #F56C6C;margin-right:7px" @click="handleDelete(data.custom)">删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, data.custom)" v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']">
            <el-button size="mini" type="text" style="color: #909399">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleRun" icon="el-icon-caret-right"
                                v-hasPermi="['monitor:job:changeStatus']">执行一次</el-dropdown-item>
              <el-dropdown-item command="handleView" icon="el-icon-view"
                                v-hasPermi="['monitor:job:query']">任务详细</el-dropdown-item>
              <el-dropdown-item command="handleJobLog" icon="el-icon-s-operation"
                                v-hasPermi="['monitor:job:query']">调度日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </sg-table>
    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择任务分组" filterable>
                <el-option
                  v-for="dict in dict.type.sys_job_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('ry')
                    <br>Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                    <br>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                <template slot="append">
                  <el-button type="primary" @click="handleShowCron">
                    生成表达式
                    <i class="el-icon-time el-icon--right" />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_job_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Cron表达式生成器" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
      <crontab :expression="expression" @hide="openCron=false" @fill="crontabFill" />
    </el-dialog>
    <!-- 任务日志详细 -->

    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <show-dict-data :options="dict.type.sys_job_status" :value="data.custom.status" />
        </div>
      </template>
    </sg-table>

    <sg-dialog title="日志详细" :dialog="open1"  width="650px" @handleClose="open1=false">
      <div slot="out">
        <el-form ref="form" :model="formList" label-width="120px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务编号：">{{ formList.jobId }}</el-form-item>
              <el-form-item label="任务名称：">{{ formList.jobName }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务分组：">{{ formList.jobGroup }}</el-form-item>
              <el-form-item label="创建时间：">{{ formList.createTime }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="cron表达式：">{{ formList.cronExpression }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次执行时间：">{{ parseTime(formList.nextValidTime) }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="调用目标方法：">{{ formList.invokeTarget }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态：">
                <div v-if="formList.status == 0">正常</div>
                <div v-else-if="formList.status == 1">失败</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否并发：">
                <div v-if="formList.concurrent == 0">允许</div>
                <div v-else-if="formList.concurrent == 1">禁止</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行策略：">
                <div v-if="formList.misfirePolicy == 0">默认策略</div>
                <div v-else-if="formList.misfirePolicy == 1">立即执行</div>
                <div v-else-if="formList.misfirePolicy == 2">执行一次</div>
                <div v-else-if="formList.misfirePolicy == 3">放弃执行</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>

import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
// import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from '@/api/monitor/job'
import Crontab from '@/components/Crontab'
// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils'

export default {
  name: 'Sceduledetask',

  components: { sgTable, sgDialog, Crontab },
  dicts: ['sys_job_group', 'sys_job_status'],
  data() {
    return {
      formList:{},
      submitLoading: false,
      operate: {
        name: '操作',
        width: 210,
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['job:job:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['job:job:remove']
          },
          {
            lab: '更多',
            type: 'info',
          permi: ['system:role']
          }
        ]
      },
      // 表格显示列表
      columns: [
        {
          lab: '任务编号',
          val: 'jobId',

        },
        {
          lab: '任务名称',
          val: 'jobName'
        },
        {
          lab: '任务祖名',
          val: 'jobGroup',
          custom: 'jobGroup'
        },
        {
          lab: '调用目标字符串',
          val: 'invokeTarget'
        },
        {
          lab: 'cron执行表达式',
          val: 'cronExpression'
          // custom: 'postList',
          // width: 280
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status',

        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit',
        }
      ],
      tableData: [],
      tableDatas: [],
      searchBar: {
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: '',
      // 查询参数
      queryParams: {
        jobGroup:'SYSTEM',
        status:'0'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        invokeTarget: [
          { required: true, message: '调用目标字符串不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: 'cron执行表达式不能为空', trigger: 'blur' }
        ]
      },
      open1:false
    }
  },
  created() {
    this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      // return this.selectDictLabel(this.dict.type.sys_job_group, row.jobGroup)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.form = {}
    },
    // 表单重置
    reset() {
      this.queryParams = {}
      this.getData()
    },
    /** 搜索按钮操作 */
    getData(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.searchBar.pageNum = 1
        this.searchBar.currentPage = 1
      }
      this.$api.log.jobList({...this.queryParams, ...this.searchBar}).then(res => {
        if (res) {
          this.tableData = res.rows
          this.searchBar.total = res.total
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {}
      this.getData()
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
        case '更多':
          this.handleMore(e[1])
          break
      }
    },
    // 任务状态修改
    handleStatusChange(row) {
      this.$confirm('确认要修改“' + row.jobName + '”的用户状态吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const data = {
          jobId: row.jobId,
          status: row.status
        }
        await this.$api.log.changeJobStatus(data).then(res => {
          if (res) {
            this.getData()
            this.$forceUpdate()
            this.$message.success(res.msg)
          } else {
            row.status = row.status === '0' ? '1' : '0'
          }
        })
      }).catch(() => {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 更多
    handleCommand(command, row) {
      console.log(command, row,'ggg')
      switch (command) {
        case "handleRun":
          this.handleRun(row);
          break;
        case "handleView":
          this.handleView(row);
          break;
        case "handleJobLog":
          this.handleJobLog(row);
          break;
        default:
          break;
      }
    },
    /* 立即执行一次 */
    handleRun(row) {
      const query={
        jobGroup:row.jobGroup,
        jobId:row.jobId
      }
      this.$api.log.run(query).then(res => {
        if (res) {
          this.$message.success(res.msg)
        }
      })
     },
    /** 任务详细信息 */
    handleView(row) {
      const jobId=row.jobId
      this.$api.log.logList(jobId).then(res => {
        if (res) {
          this.formList=res.data
        }
      })
      this.open1 = true
      console.log( this.open1,' this.open1 this.open1 this.open1')

    },
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.form.cronExpression
      this.openCron = true
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.form.cronExpression = value
    },
    /** 任务日志列表查询 */
    handleJobLog(row) {
      const jobId = row.jobId || 0
      this.$router.push({ path: 'jobLog', query: { jobId: jobId }})
      // this.$router.push({ path: 'jobLog' })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.form = {}
      this.reset()
      this.open = true
      this.title = '添加任务'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const jobId = row.jobId || this.ids
      this.$api.log.getJob(jobId).then(res => {
        if (res) {
          this.form = res.data
        }
      })
      this.open = true
      this.title = '修改任务'
      // const jobId = row.jobId || this.ids
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.title === '修改任务') {
            this.$api.log.updateJob(this.form).then(res => {
              if (res) {
                this.open = false
                this.getData()
                this.form = {}
              }
            })
          } else {
            this.$api.log.addJob(this.form).then(res => {
              if (res) {
                this.open = false
                this.getData()
                this.form = {}
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobIds = row.jobId || this.ids
      this.$confirm('是否确认删除定时任务名称为"' + row.jobName + '"的数据项？').then(() => {
        this.$api.log.delJob(jobIds).then(res => {
          if (res) {
            this.getData()
          }
        })
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.submitLoading = true
      this.$api.log.jobList(this.queryParams, this.searchBar).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        /* 从表生成工作簿对象 */
        export_table_to_excel('#out-table', '定时任务')
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
      this.searchBar.currentPage = e[1]
      this.getData()
    }
  }
}
</script>
