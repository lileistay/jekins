<template>
  <!---操作日志--->
  <el-scrollbar>
    <Tree :showDefault="showDefault" @changeCompay="changeCompay" :isShowfile="isShowfile">
      <template v-slot:company>
        <div >
          <SgTable
            :columns="columns"
            :pagination="pagination"
            :table-data="tableData"
            size="mini"
            selection
            border
            index="序号"
            :operate="operate"
            @operateClick="operateClick"
            @size-change="sizeChange"
            @current-change="currentChange"
            @selection-change="handleSelectionChange"
          >
            <div slot="searchBar" class="header">
              <div >
                <el-form :inline="true" ref="form" :model="form" size="mini" label-width="70px">
                  <el-form-item label="系统模块">
                    <el-input v-model="form.title" clearable />
                  </el-form-item>
                  <el-form-item label="操作人员">
                    <el-input v-model="form.operName" clearable />
                  </el-form-item>
                  <el-form-item label="类型">
                    <el-select v-model="form.businessType" clearable filterable placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.sys_oper_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="form.status" filterable clearable placeholder="请选择">
                      <el-option
                        v-for="dict in dict.type.sys_job_status"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="操作时间">
<!--                    <el-date-picker-->
<!--                      v-model="form.operTime"-->
<!--                      style="width: 200px"-->
<!--                      clearable-->
<!--                      type="datetimerange"-->
<!--                      format="yyyy-MM-dd HH:mm:ss"-->
<!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                      start-placeholder="开始日期"-->
<!--                      end-placeholder="结束日期"-->
<!--                      :default-time="['00:00:00', '23:59:59']"-->
                    <el-date-picker
                      v-model="form.operTime" class="inputWidth"
                      size="mini"
                      type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                      :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;margin-right: 30px" />
<!--                    />-->
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <el-button icon="el-icon-search" type="primary" plain size="mini" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
                <el-button icon="el-icon-delete" type="info" plain size="mini" @click="resetting">重置</el-button>
              </div>
            </div>
            <div slot="header" class="header">
              <div>
                <el-button
                  v-has-permi="['productPackageInformation:createPackage']"
                  size="mini"
                  type="danger"
                  plain
                  :disabled="single"
                  @click="deleteAll"
                >删除
                </el-button>
                <el-button
                  v-has-permi="['confinement:packageManagementInfo:StepDown']"
                  size="mini"
                  type="danger"
                  plain
                  @click="empty"
                >清空
                </el-button>
              </div>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
              </div>
              <div v-else-if="data.props === 'businessType'">
                <dict-tag :options="dict.type.sys_oper_type" :value="data.custom.businessType" />
              </div>
            </template>
          </SgTable>
        </div>
        <sg-dialog title="操作日志详细" size="800px" :dialog="showDialog" @handleClose="handleClose">
          <div slot="out">
            <el-card class="box-card">
              <el-row>
                <el-col :span="12">
                  <p><span class="bold">操作模块：</span><span>{{ item.title }}</span></p>
                </el-col>
                <el-col>
                  <p><span class="bold">登录信息：</span><span>{{ item.operParam }}</span></p>
                </el-col>
                <el-col :span="12">
                  <p><span class="bold">请求地址：</span><span>{{ item.operUrl }}</span></p>
                  <p><span class="bold">请求方式：</span><span>{{ item.requestMethod }}</span></p>
                </el-col>
              </el-row>
              <p><span class="bold">操作方法：</span><span>{{ item.method }}</span></p>
              <p><span class="bold">请求参数：</span><span>{{ item.operatorType }}</span></p>
              <el-row>
                <el-col :span="12">
                  <p><span class="bold">返回参数：</span><span>{{ item.jsonResult }}</span></p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <p><span class="bold">操作状态：</span><span>{{ status(item.status) }}</span></p>
                </el-col>
                <el-col :span="12">
                  <p><span class="bold">操作时间：</span><span>{{ item.operTime }}</span></p>
                </el-col>
              </el-row>
            </el-card>
            <el-button size="mini" @click="handleClose">关闭</el-button>
          </div>
        </sg-dialog>
      </template>
    </Tree>

  </el-scrollbar>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'

export default {
  name: 'OperationLog',
  dicts: ['sys_normal_disable', 'sys_job_status', 'sys_oper_type'],
  components: {
    SgTable,
    sgDialog,
    Tree
  },
  data() {
    return {
      showDataDialog: false,
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
      showDefault:false,
      isShowfile:true,
      showDialog: false,
      single: true,
      departmentId: [],
      form: {
        title: '',
        operName: '',
        businessType: '',
        status: '0',
        operTime:[new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
      },
      item: {
        title: '', // 操作模块
        operUrl: '', // 请求地址
        operParam: '', // 登录信息
        requestMethod: '', // 请求方式
        method: '', // 操作方法
        // 请求参数
        jsonResult: '', // 返回参数
        status: '', // 状态
        operTime: ''// 时间
      },
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columns: [
        {
          lab: '日志编码',
          val: 'operId'
        },
        {
          lab: '系统模块',
          val: 'title'
        },
        {
          lab: '操作类型',
          val: 'businessType',
          custom: 'businessType'
        },
        {
          lab: '请求方式',
          val: 'requestMethod'
        },
        {
          lab: '操作人员',
          val: 'operName'
        },
        {
          lab: '操作地址',
          val: 'operUrl'
        },
        {
          lab: '操作地点',
          val: 'operLocation'
        },
        {
          lab: '操作状态',
          custom: 'status',
          val: 'status'
        },
        {
          lab: '操作日期',
          val: 'operTime'
        }
      ],
      // 操作
      operate: {
        name: '操作',
        cell: [
          {
            lab: '详细',
            type: 'warning'
          }
        ]
      },
      tableData: [] // 表格数据
    }
  },
  created() {
    this.getData(true)
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    changeCompay(id,item){
      if(!item.children){
        this.getData(true,id)
      }
    },
    newgetData(value) {
      let DateObj = new Date(value)
      // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
      let year = DateObj.getFullYear()
      let month = DateObj.getMonth() + 1
      let day = DateObj.getDate()
      let hh = DateObj.getHours()
      let mm = DateObj.getMinutes()
      let ss = DateObj.getSeconds()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      if (hh >= 0 && hh <= 9) {
        hh = "0" + hh;
      }
      if (mm >= 0 && mm <= 9) {
        mm = "0" + mm;
      }
      if (ss >= 0 && ss <= 9) {
        ss = "0" + ss;
      }
      // 最终时间
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },
    getData(isSearch,deptId) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const query={
        params:{
          beginTime: this.form.operTime ? this.newgetData(this.form.operTime[0]) : null,
          endTime: this.form.operTime ? this.newgetData(this.form.operTime[1]) : null
        },
        ...this.pagination,
        title:this.form.title,
        operName:this.form.operName,
        businessType:this.form.businessType,
        status:this.form.status,
        deptId:deptId==undefined?'':deptId
      }
      this.$api.log.operlogList(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    resetting() {
      this.form = {
        title: '',
        operName: '',
        businessType: '',
        status: '',
        // operTime: todayTime()
      }
      this.getData()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.departmentId = selection[1].map(item => item.operId)
      this.single = selection[1].length === 0
    },
    // 删除
    deleteAll() {
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const itemIds = this.departmentId
        this.$api.log.operlogdelete(itemIds).then(res => {
          if (res) {
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    empty() {
      this.$confirm('此操作将全部删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.log.operlogEmpty().then(res => {
          if (res) {
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    status(str) {
      if (str === 0) {
        return '正常'
      } else {
        return '停用'
      }
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '详细':
          this.handleUpdate(e[1])
      }
    },
    handleUpdate(val) {
      this.item = val
      this.showDialog = true
    },
    handleClose() {
      this.showDialog = false
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
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-drawer__header{
  color: #1abc9c;
  font-size: 18px;
}
.header {
  width: 100%;
  height: 43px;
  font-size: 14px;
  color: #fffffc;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card{
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
}
.el-form-item{
  margin-bottom: 0;
}
//弹框
.bold{
  font-size: 16px;
  line-height: 50px;
}
</style>
