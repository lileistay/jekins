<template>
  <div>
    <sg-table
      v-if="true"
      
      selection
      size="mini"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
      @operateClick="operateClick"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="handleSelectionChange"
    >
      <div slot="searchBar">
        <el-form
          ref="searchForm"
          :model="pagination"
          :inline="true"
          size="mini"
          :show-message="false"
        >
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              v-model="pagination.dictName"
              clearable
              style="width: 160px;"
              placeholder="请输入字典名称"
              @keyup.enter.native="keyupgetData"
            />
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input
              v-model="pagination.dictType"
              clearable
              style="width: 160px;"
              placeholder="请输入字典类型"
            />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="pagination.status"
              clearable filterable
              style="width: 160px;"
              placeholder="字典状态"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="create">
<!--            <el-date-picker-->
<!--              v-model="dateRange"-->
<!--              style="width: 220px;"-->
<!--              class="date-picker"-->
<!--              type="daterange"-->
<!--              size="mini"-->
<!--              clearable-->
<!--              value-format="yyyy-MM-dd"-->
<!--              range-separator="-"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--            />-->
            <el-date-picker
              v-model="dateRange" class="inputWidth"
              size="mini"
              type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;margin-right: 30px" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click.stop="getData(true)"
              @keydown.enter.native="getData(true)"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #custom="data">
<!--        <div v-if="data.props === 'status'">-->
<!--          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />-->
<!--        </div>-->
        <div v-if="data.props === 'type'">
          <router-link :to="{path: '/tag', query: { dictId: data.custom.dictId }}">{{ data.custom.dictType }}</router-link>
        </div>
      </template>
      <div slot="header">
        <el-button
          v-has-permi="['system:dict:add']"
          size="mini"
          plain
          icon="el-icon-plus"
          type="primary"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          v-has-permi="['system:dict:remove']"
          :loading="deleteLoading"
          size="mini"
          plain
          icon="el-icon-delete"
          :disabled="ids.length<=0"
          type="danger"
          @click="handleDelete"
        >批量删除</el-button>
        <el-button
          size="mini"
          plain
          icon="el-icon-upload2"
          disabled
          type="info"
        >导出（未做）</el-button>
        <el-button
          v-has-permi="['system:dict:remove']"
          :disabled="refreshLoading"
          size="mini"
          plain
          icon="el-icon-refresh"
          type="primary"
          @click="handleRefreshCache"
        >刷新缓存</el-button>
      </div>
    </sg-table>
    <sg-dialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="showDialog = false">
      <div slot="out">
        <el-form
          ref="form"
          :rules="rules"
          label-width="80px"
          size="mini"
          :model="form"
        >
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="form.dictName" placeholder="请输入字典名称" />
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典类型" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入备注内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
            <el-button @click="showDialog=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from "@/utils/time"; // 防抖
export default {
  name: 'Dict',
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog
  },
  data() {
    return {
      // 显示弹窗
      showDialog: false,
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      dialogTitle: undefined,
      showDataDialog: false,
      submitLoading: false,
      // 刷新加载
      refreshLoading: false,
      // 删除加载
      deleteLoading: false,
      dateRange: [],
      // 分页 搜索
      pagination: {
        show: true,
        total: 0,
        pageNum: 1,
        pageSize: 20,
        currentPage: 1,
        status:'0'
      },
      // 表单数据
      form: {},
      // 表单校验规则
      rules: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      },
      // 多选
      ids: [],
      // 表格操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:dict:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['system:dict:remove']
          }
        ]
      },
      // 表格数据列表
      columns: [
        {
          lab: '字典编号',
          val: 'dictId'
        },
        {
          lab: '字典名称',
          val: 'dictName'
        },
        {
          lab: '字典类型',
          val: 'type',
          custom: 'type'
        },
        // {
        //   lab: '状态',
        //   val: 'status',
        //   custom: 'status'
        // },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.getData()
    this.keyupgetData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    keyupgetData() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    // 刷新
    handleRefreshCache() {
      this.refreshLoading = true
      this.$api.dictType.refreshCache().finally(() => {
        this.refreshLoading = false
      })
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 表单选择
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.dictId)
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.showDataDialog = true
      this.$api.dictType.listType(this.addDateRange(this.pagination, this.dateRange)).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 操作点击
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 添加操作
    handleAdd() {
      this.showDialog = true
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加字典'
      })
    },
    // 修改操作
    async handleUpdate(dict) {
      await this.$api.dictType.getType(dict.dictId).then(res => {
        if (res) {
          this.form = res.data
          this.showDialog = true
          this.dialogTitle = '修改字典'
        }
      })
    },
    // 表单提交操作
    async submitForm() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          await this.$api.dictType.dictTypeOperate(this.form, this.form.dictId === undefined ? 'post' : 'put').then(async res => {
            if (res) {
              this.showDialog = false
              await this.getData()
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    // 删除操作
    async handleDelete(dict) {
      const dictId = dict.dictId || this.ids
      this.$confirm('是否确认删除编号为' + dictId + '的数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.deleteLoading = true
        await this.$api.dictType.dictTypeOperate({}, 'delete', dictId).then(async res => {
          if (res) {
            this.$message.success(res.msg)
            await this.getData()
          }
        }).finally(() => {
          this.deleteLoading = false
        })
      }).catch(() => {

      })
    },
    resetForm(formName) {
      if (formName) {
        this.$refs.searchForm.resetFields()
        this.pagination = {
          show: true,
          total: 0,
          pageSize: 20,
          pageNum: 1
        }
        this.dateRange = undefined
        this.getData()
      } else {
        this.$refs.form.resetFields()
        this.form = {
          dictName: undefined,
          dictType: undefined,
          status: '0',
          remark: undefined
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.date-picker {
  width: 260px;
}
</style>
