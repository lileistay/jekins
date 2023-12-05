<template>
  <!-- 临客顾客预约未来院查询 -->
  <div >

    <slideSearch :options="options" @getDatakeyup=getDatakeyup >
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          v-has-permi="['confinement:customerCmt:exportfuture']"
          size="mini"
          icon="el-icon-upload2"
          plain
          :loading="submitLoading"
          @click.stop="exportExcel"
          type="success"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          ref="table"
          id="out-table"
          :table-data="tableData"
          :sg-ref="'multipleTable'"
          index="序号"
          size="mini"
          border
          selection
          :columns="columns"
          :pagination="pagination"
          :row-class-name="rowClassName"
          :cell-class-name="cellClassName"
          @row-click="rowClick"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float ">
            <div style="font-size: 14px;">统计信息</div>
            <div style="font-size: 14px; color: darkgrey;">
              <span>客户数量：{{ allcut }}人</span>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单</div>
            <div>
              <el-button
                v-hasPermi="['system:chargeType:add']"
                size="mini"
                icon="el-icon-plus"
                type="primary"
                @click.stop.native="openManualDialog"
              >手工上报</el-button>
              <!-- <el-button-->
              <!--   size="mini"-->
              <!--   icon="el-icon-back"-->
              <!--   type="success"-->
              <!--   v-hasPermi="['system:chargeType:add']"-->
              <!--   @click="sendMessage"-->
              <!-- >批量发送短信</el-button>-->
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props==='customerName'">
              <a style="color: #5f94de;cursor: pointer;" @click="customer(data.custom.id, data.custom,data.custom.numberId,data.custom.id)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-else-if="data.props==='degreeIntention'">
              <show-dict-data :options="dict.type.degree_intention_list" :value="data.custom.degreeIntention" />
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <!-- 未到院手工上报-->
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <send-message
      :show-send-message-dialog="showSendMessageDialog"
      :selection-data="selectionData"
      @closeDialog="closeDialog"
    />
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
      <template #custom="data">
        <div v-if="data.props==='customerName'">
          <a style="color: #5f94de;cursor: pointer;" @click="customer(data.custom.id, data.custom,data.custom.numberId,data.custom.id)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props==='degreeIntention'">
          <show-dict-data :options="dict.type.degree_intention_list" :value="data.custom.degreeIntention" />
        </div>
      </template>
    </sg-table>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import ManualSubmission from '@/components/ManualSubmission'
import SendMessage from '@/components/SendMessage'
import { todayTime,newgetData } from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce'
import moment from 'moment'
export default {
  dicts: ['whether', 'degree_intention_list'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    ManualSubmission,
    SendMessage
  },
  data() {
    return {
      istrue:false,
      tableDatas: [], // 导出
      submitLoading: false,
      allcut: 0, // 客户人数
      tableData: [],
      selectionData: [], // 表格单选存放
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      columns: [
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 90
        },
        // {
        //   lab: '预约单号',
        //   val: 'reservationNumber'
        //   // custom: 'status'
        // },
        {
          lab: '回访人',
          val: 'visituserName',
          // custom: 'inFactAmount',
          showOverflowTooltip: true,
          width: 110
        },
        {
          lab: '意向度',
          val: 'degreeIntention',
          custom: 'degreeIntention',
          showOverflowTooltip: true,
          width: 140
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          showOverflowTooltip: true,
          width: 120
        },
        {
          lab: '网电回访人',
          val: 'visituserName',
          showOverflowTooltip: true,
          width: 120
        },
        {
          lab: '预约时间',
          val: 'appointmentTime',
          width: 140
        },
        {
          lab: '未到院原因',
          val: 'notArrived',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '关注问题',
          val: 'concerns',
          showOverflowTooltip: true
        },
        {
          lab: '一级产品',
          val: 'departmentName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '二级产品',
          val: 'projectTypeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '三级产品',
          val: 'bookingPeojectName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 140
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          showOverflowTooltip: true
        }
      ],
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '建档时间：',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        appointmentTime: {
          type: 'Tdatetime',
          label: '预约时间',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'input',
          label: '客户姓名',
          clearable: true,
          options: []
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        typeThreeName: {
          type: 'cascader',
          label: '建档类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '线上客服：',
          clearable: true,
          options: []
        },
        visituserId: {
          type: 'select',
          label: '回访人',
          clearable: true,
          options: []
        },
        degreeIntention: {
          type: 'select',
          label: '意向度',
          clearable: true,
          options: []
        },
        reservationNumber: {
          type: 'input',
          label: '预约单号'
        },
        departmentId: {
          type: 'select',
          label: '一级项目:',
          options: [],
          values: '',
          clearable: true
        },
        projectTypeId: {
          type: 'select',
          label: '二级项目:',
          options: [],
          values: '',
          clearable: true
        },
        bookingPeojectId: {
          type: 'select',
          label: '三级项目:',
          options: [],
          values: '',
          clearable: true
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
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
      this.deptFilingList()
      this.getDepartmentOne()
      this.getUserList(val)
    },
    'options.departmentId.values'() {
      this.options.projectTypeId.values = ''
      this.getDepartmentTwo(this.options.departmentId.values)
    },
    'options.projectTypeId.values'() {
      this.options.bookingPeojectId.values = ''
      this.getDepartmentThree(this.options.projectTypeId.values)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getDepartmentOne()
    this.getUserList(this.deptId)
    this.deptFilingList()
    this.options.degreeIntention.options = this.dict.type.degree_intention_list
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData(true)
        }
      }
    },
    // 打印
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      this.submitLoading = true
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else if (this.options[k].type === 'cascader') {
          let filingId = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingId.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingId', filingId.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingId = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$api.netPower.casualcustomer(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
      /* 从表生成工作簿对象 */
        this.$export('#out-table', '临客顾客预约未来院查询')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    cellClassName({ row, rowIndex }) {
      if (row.isDeal === '1') {
        return 'warning-row'
      } else if (row.isDeal === '2') {
        return 'success-row'
      }
      return ''
    },
    // 手工上报
    // 上报未到院
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客发送短信')
        return
      }
      this.showManualDialog = true
    },
    // 批量发送短信
    sendMessage() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客发送短信')
        return
      }
      this.showSendMessageDialog = true
    },
    // 手工上报 关闭
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭发送短信弹窗
    closeDialog() {
      this.showSendMessageDialog = false
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 获取数据
    getData: debounce(async function(isSearch) {
      this.istrue=true
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else if (this.options[k].type === 'cascader') {
          let filingId = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingId.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingId', filingId.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingId = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      await this.$api.netPower.casualcustomer(data).then(res => {
        if (res) {
          this.istrue=false
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      this.selectionData = !this.selectionData[0] ?  [] : this.selectionData
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row,rowIndex }) {
      if (row.isReachCourtyard === '1') {
        return 'success-row'
      }
      if(rowIndex%2==0){
        return  'normal-row'
      }
      return ''
    },
    // 搜索栏 线上客服...
    async getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }

      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.options.onlineUserId.options = arr1
          this.options.visituserId.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 建档类型
    deptFilingList() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.filing.getFilingTypeById(data).then(res => {
        if (res.data) {
          this.options.typeThreeName.options = res.data
        }
      })
    },
    getDepartmentOne() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentId.options = res.rows
        }
      })
    },
    // 路由
    customer(id, val, numberId) {
      this.$router.push({ path: '/notInHospital', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 查询科室二级
     */
    async getDepartmentTwo(id) {
      await this.$api.dept.TypeList({ departmentId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.projectTypeName
            item.value = item.projectTypeId
          })
          this.options.projectTypeId.options = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 查询科室二级
     */
    async getDepartmentThree(id) {
      await this.$api.dept.CategoryList({ projectTypeId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.options.bookingPeojectId.options = res.rows
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
<style>
.el-input__prefix{
  display: none;
}
::v-deep .el-table .warning-row {
  background: #ffffff;
}
::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
