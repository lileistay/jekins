<template>
  <!-- 皮肤排期分诊 -->
  <div class="container">
    <slideSearch :options="options" >
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @keydown.enter.native="getData(true)" @click.stop="getData(true)"
        >查询
        </el-button>
        <!-- <el-button v-has-permi="['confinement:customerReservationForm:exportguest']" size="mini" type="success"
                   icon="el-icon-upload2" plain :loading="submitLoading" @click="exportExcel">导出
        </el-button> -->
      </div>
     <slot>
      <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      size="mini"
      :selection="true"
      :border="true"
      index="序号"
      :highlight-current-row="true"
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      :header-style="{backgroundColor:'#f5eae4'}"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
    >
      <div slot="searchBar" class="searchBar">
        <!-- <el-form size="mini" :inline="true" label-width="120px">
          <el-form-item label="客户姓名：">
            <el-input v-model="form.customerName" :clearable="true" />
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="form.customPhone" :clearable="true" />
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input v-model="form.card" :clearable="true" />
          </el-form-item>
          <el-form-item label="客户卡号：">
            <el-input v-model="form.customCardNumber" :clearable="true" />
          </el-form-item>
          <el-form-item label="结账时间：">
            <el-date-picker
              v-model="form.checkoutTime"
              style="width: 70%;"
              :clearable="true"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-form-item label="收费单号：">
            <el-input v-model="form.orderNumber" :clearable="true" />
          </el-form-item>
          <el-form-item label="产品名称：">
            <el-input v-model="form.projectName" :clearable="true" />
          </el-form-item>
          <el-form-item style="margin-left: 50px">
            <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
          </el-form-item>
        </el-form> -->
      </div>
      <div slot="header" class="header">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de;cursor:pointer" @click="getDialogTriage" />列表清单</span>
          <span><i style="background-color:#ffffff" />未安排</span>
          <span><i style="background-color:#c6f9c3" />已安排</span>
        </div>
        <div>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click.stop.native="openManualDialog">手工上报</el-button>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="triage" v-has-permi="['payment:wforservice:paysay']">分诊登记</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props==='customerName'">
          <a style="color: #5f94de;cursor: pointer;" @click="customer(data.custom.id, data.custom,data.custom.numberId,data.custom.id)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props === 'schedulePrint'">
          <el-button size="mini" type="text" @click="printSchedule(data.custom)">打印排期表</el-button>
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
            {{ data.custom.orderNumber }}
          </a>
        </div>
      </template>
    </sg-table>
      </slot>
      </slideSearch>

    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <vue-easy-print ref="schedulePrint">
      <schedule-print :print="print" :details="details" />
    </vue-easy-print>
    <!--  列表排序弹框    -->
    <Dsort
      ref="Triage"
      :drow_table="'Triage'"
      :show-dialog-s="showDialogTriage"
      :sort-list="columns1"
      :select-enable="selectEnable"
      :table-row-class-name="tableRowClassName"
      :item-handle-selection-change="itemHandleSelectionChange"
      @showdialogT="showdialogT"
    />
  </div>
</template>

<script>
import vueEasyPrint from 'vue-easy-print'
import {beforeDayTime, newgetData, todayTime} from '@/utils/time'
import SgTable from '@/components/Table'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import schedulePrint from '@/components/Print/schedulePrint'
import Dsort from '@/components/Dsort'
import Sortable from 'sortablejs' // 排序拖拽
import slideSearch from '@/components/SlideSearchBar/index'
import moment from 'moment'
export default {
  components: {
    vueEasyPrint,
    SgTable,
    ManualSubmission,
    schedulePrint,
    Dsort,
    slideSearch
  },
  data() {
    return {
      Action: {},
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone:{
          type: 'input',
          label: '电话号码'
        },
        card: {
          type: 'input',
          label: '身份账号'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号'
        },
        orderNumber: {
          type: 'input',
          label: '收费单号'
        },
        projectName: {
          type: 'input',
          label: '产品名称'
        },
        
      },
      loadingData: false,
      selectionData: [], // 选择的数据
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      sysUserList: [], // 医生
      // 列表
      tableData: [],
      columns: [
        {
          lab: '打印',
          val: 'schedulePrint',
          width: 100,
          custom: 'schedulePrint'
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          width: 100,
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '科室',
          val: 'billingDepartmentName',
          width: 140
        },
        {
          lab: '产品名称',
          val: 'projectName',
          width: 150,
          showOverflowTooltip: true
        },
        {
          lab: '产品单位',
          val: 'company',
          width: 80
        },
        {
          lab: '总次数',
          width: 120,
          val: 'quantitySum'
        },
        {
          lab: '剩余次数',
          width: 90,
          val: 'surplusQuantity'
        },
        {
          lab: '治疗次数',
          width: 90,
          val: 'treatmentNum'
        },
        {
          lab: '已退款次数',
          width: 90,
          val: 'refundNum'
        },
        {
          lab: '退款金额',
          width: 90,
          val: 'refundAmount'
        },
        {
          lab: '退款原因',
          width: 150,
          val: 'refundReason',
          showOverflowTooltip: true
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 90
        },
        {
          lab: '巡回护士',
          val: 'circulatingName',
          width: 90
        },
        {
          lab: '护理',
          val: 'dtrnursingName',
          width: 90
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 90
        },
        {
          lab: '金额',
          width: 90,
          val: 'discountAmount'
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '是否安排',
          val: 'isArrange',
          width: 90
        },
        {
          lab: '备注',
          val: 'billingRemarks',
          showOverflowTooltip: true
        }
      ],
      columns1: [
        {
          lab: '打印',
          val: 'schedulePrint',
          width: 100,
          custom: 'schedulePrint'
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          width: 100,
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '科室',
          val: 'billingDepartmentName',
          width: 140
        },
        {
          lab: '产品名称',
          val: 'projectName',
          width: 150,
          showOverflowTooltip: true
        },
        {
          lab: '产品单位',
          val: 'company',
          width: 80
        },
        {
          lab: '总次数',
          width: 120,
          val: 'quantitySum'
        },
        {
          lab: '剩余次数',
          width: 90,
          val: 'surplusQuantity'
        },
        {
          lab: '治疗次数',
          width: 90,
          val: 'treatmentNum'
        },
        {
          lab: '已退款次数',
          width: 90,
          val: 'refundNum'
        },
        {
          lab: '退款金额',
          width: 90,
          val: 'refundAmount'
        },
        {
          lab: '退款原因',
          width: 150,
          val: 'refundReason',
          showOverflowTooltip: true
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 90
        },
        {
          lab: '巡回护士',
          val: 'circulatingName',
          width: 90
        },
        {
          lab: '护理',
          val: 'dtrnursingName',
          width: 90
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 90
        },
        {
          lab: '金额',
          width: 90,
          val: 'discountAmount'
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '是否安排',
          val: 'isArrange',
          width: 90
        },
        {
          lab: '备注',
          val: 'billingRemarks',
          showOverflowTooltip: true
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 搜索框
      form: {
        customerName: '', // 姓名
        customPhone: '', // 电话
        customCardNumber: '', // 卡号
        card: '', // 身份证
        checkoutTime: todayTime(), // 结账时间
        orderNumber: '',
        projectName: ''
      },
      print: {
        customName: undefined,
        departmentName: undefined,
        customCardNumber: undefined
      },
      details: [],
      // 排序弹框
      showDialogTriage: false,
      selectionDataSortList: [], // 选中的列表数据
      xflagList: [],
      cancelList: []
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
      this.getData()
      this.getUserList(val)
    }
  },
  created() {
    this.columns = JSON.parse(localStorage.getItem('flagListTriage')) ? JSON.parse(localStorage.getItem('flagListTriage')) : this.columns
    this.columns1 = JSON.parse(localStorage.getItem('sortListTriage')) ? JSON.parse(localStorage.getItem('sortListTriage')) : this.columns1
    this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionTriage')) ? JSON.parse(localStorage.getItem('selectionTriage')) : this.selectionDataSortList
    this.cancelList = JSON.parse(localStorage.getItem('cancelListTriage')) ? JSON.parse(localStorage.getItem('cancelListTriage')) : this.cancelList

    this.getData()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 弹出顺序弹框
    getDialogTriage() {
      this.showDialogTriage = true
      this.$nextTick(() => {
        this.$refs.Triage.$refs.sortRef.$refs.sortRefs.toggleRowSelection(this.columns1[0], true)
      })
      if (this.selectionDataSortList.length) {
        this.columns.forEach(item => {
          this.columns1.forEach(items => {
            if (item.lab === items.lab) {
              this.$nextTick(() => {
                this.$refs.Triage.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
              })
            }
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs.Triage.$refs.sortRef.$refs.sortRefs.toggleAllSelection()
        })
      }
      this.$nextTick(() => {
        this.rowDrop()
      })
    },
    // 在行拖拽的方法进行querySelector的查找时，需对查询到dialog的el-table的类中
    rowDrop() {
      const tbody = document.querySelector('.Triage .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
        group: {
          name: 'words',
          pull: true,
          put: true,
          sort: true,
          filter: '.flagclass'
        },
        animation: 150, // ms, number 单位：ms，定义排序动画的时间
        onEnd({ newIndex, oldIndex }) { // 结束拖拽
          const currRow = _this.columns1.splice(oldIndex, 1)[0]
          _this.columns1.splice(newIndex, 0, currRow)
          if (_this.cancelList.length) {
            _this.columns = _this.columns1
            _this.cancelList.forEach(iten => {
              _this.columns = _this.columns.filter(mm => mm.lab != iten.lab)
            })
          } else {
            _this.columns = _this.columns1
            _this.columns1 = _this.columns1
          }
          localStorage.setItem('sortListTriage', JSON.stringify(_this.columns1))
          localStorage.setItem('flagListTriage', JSON.stringify(_this.columns))
        }
      })
    },
    // 在点击列的时候被触发
    itemHandleSelectionChange(selection) {
      this.xflagList = this.columns1
      this.selectionDataSortList = selection[1]
      // localStorage.setItem('sortList',JSON.stringify(this.sortList))
      const selected = selection[1].length && selection[1].indexOf(selection[2]) !== -1
      if (selected === false) {
        this.cancelList.push(selection[2])
        this.cancelList = this.unique1(this.cancelList)
        this.xflagList = []
        this.cancelList.forEach((item1, index1) => {
          this.columns = this.columns.filter(itemm => itemm.lab !== item1.lab)
          this.columns = this.unique1(this.columns)
          localStorage.setItem('flagListTriage', JSON.stringify(this.columns))
          localStorage.setItem('cancelListTriage', JSON.stringify(this.cancelList))
        })
      } else {
        this.cancelList = this.cancelList.filter(item => item.val != selection[2].val)
        this.columns1.forEach((item1, index1) => {
          if (item1.lab == selection[2].lab) {
            if (this.cancelList.length) {
              this.cancelList.forEach(item => {
                this.xflagList = this.xflagList.filter(mm => mm.lab != item.lab)
                this.xflagList.splice(index1, 0, selection[2])
                this.columns = this.xflagList
              })
            } else {
              this.columns.splice(index1, 0, selection[2])
            }
            this.columns = this.unique1(this.columns)
            localStorage.setItem('flagListTriage', JSON.stringify(this.columns))
          }
        })
      }
      localStorage.setItem('selectionTriage', JSON.stringify(this.selectionDataSortList))
    },
    // 取消禁用
    selectEnable(row, rowIndex) {
      if (row.lab === '打印') { // 禁用
        return false
      } else {
        return true
      }
    },
    // 去重
    unique1(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.lab) && res.set(arr.lab, 1))
    },
    // 弹窗关闭
    showdialogT() {
      this.showDialogTriage = false
    },
    // 顺序禁止点击
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'flagclass'
      }
    },
    /**
     * @author Nevin
     * @date 2022/7/26
     * @Description: 打印排期表
    */
    printSchedule(data) {
      this.details = []
      this.print.customName = data.customerName
      this.print.departmentName = data.departmentName
      this.print.customCardNumber = data.customCardNumber
      this.$api.medical.skinTriageList({ id: data.id }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            const temp = {
              projectName: item.projectName,
              surplusQuantity: item.surplusQuantity
            }
            this.details.push(temp)
          })
          this.$nextTick(() => {
            this.$refs.schedulePrint.print()
          })
        }
      })
    },
    // 搜索
    getData(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
       var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
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
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data.billingStatus='3';
      data.deptId=this.deptId
      this.loadingData = true
      this.$api.medical.skinTriageList({
        ...this.pagination, ...data,
        billingDepartment: this.$route.query.departmentId
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            if (item.state === '1' || item.state === '2') {
              item.isArrange = '是'
            } else {
              item.isArrange = '否'
            }
          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    // 姓名跳转
    customer(id, val, numberId) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
    },
    // 分诊登记
    triage() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行分诊登记')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量登记')
        return
      }
      // 选择的数据是否有剩余治疗次数 并且 已经登记的次数是否大于剩余次数
      const find = this.selectionData.find(item => item.surplusQuantity === 0 || item.arrangeNumber >= item.surplusQuantity || item.surplusQuantity<=0)
      if (find) {
        this.$message.warning('部分项目剩余治疗次数不足或已登记次数大于剩余次数，无法发起登记，请重新选择或取消旧登记')
        return
      }
      // 选择的数据存储到store,防止登记页面刷新页面数据丢失
      this.$store.dispatch('setTriageSelectionData', this.selectionData)
      this.$router.push({ name: 'TriageRegistrations' })
    },
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行手工上报')
        return
      }
      this.Action = this.selectionData[0]
      this.showManualDialog = true
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 分页组件
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // ---
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          this.sysUserList = res.data
        }
      })
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row }) {
      if (row.state === '1' || row.state === '2') {
        return 'success-row'
      }
    },
    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header{
 width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
  font-size: 14px;
  margin-right: 15px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height:0px !important;
}
::v-deep .el-range-editor.el-input__inner {
  padding: 3px 5px;
}
::v-deep .el-table .warning-row {
  background: #ffff00;
}
::v-deep .el-table .success-row {
  background: #c6f9c3;
}
</style>
