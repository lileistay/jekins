<template>
  <!-- 订单 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
        >查询
        </el-button>
        <el-button
          v-has-permi="['payment:toBePaidList:export']"
          size="mini"
          type="success"
          :loading="submitLoadings"
          @click.stop="exportExcel"
        >导出</el-button>
      </div>
      <slot>
        <sg-table
          ref="table"
     
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          stripe
          highlight-current-row
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
            <div>
              <!--<p>客户: {{ coument }}-->
              <!--  &nbsp;&nbsp;-->
              <!--  <span>应付 : {{ placeorder }}元[{{ payableSigle }}单]</span>&nbsp;-->
              <!--</p>-->
              <p>
                <span>总订单数:{{total}}</span>&nbsp;&nbsp;
                <span>总检测数量:{{frequency}}</span>&nbsp;&nbsp;
                <!--<span>单检次数:99</span>&nbsp;&nbsp;-->
                <!--<span>混检次数:99</span>&nbsp;&nbsp;-->
                <span>已付订单:{{closedOrder}}</span>&nbsp;&nbsp;
                <span>总收入:{{sumMoney}}</span>&nbsp;&nbsp;
              </p>
            </div>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'paymentStatus'">
              <span :style="{color: data.custom.paymentStatus == 0 ? 'red' : '#1abc9c'}">{{ data.custom.paymentStatus == 0 ? '待付款': '已付款' }}</span>
            </div>
            <div v-else-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-else-if="data.props === 'region'">
              <show-dict-data :options="dict.type.nucleic_acid_test" :value="data.custom.region" />
            </div>
            <div v-else-if="data.props === 'payMoney'">
              <span style="color: #444343">{{ data.custom.payTime === null ? '' : data.custom.payMoney }}</span>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
<!--      <template #custom="data">-->
<!--        <div v-if="data.props === 'billingStatus'">-->
<!--          <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />-->
<!--        </div>-->
<!--      </template>-->
    </sg-table>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import moment from 'moment'
// import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import { math } from '@/utils/math'
import { todayTime } from '@/utils/time'

export default {
  dicts: ['sys_user_sex', 'nucleic_acid_test'],
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      tableDatas: [],
      submitLoadings: false,
      coument: '',
      payableSigle: 0,
      placeorder: 0, // 下单人数
      // checkOut: 0,
      total: 0, // 总订单数
      sumMoney: 0, // 已支付
      frequency: 0, // 总检测数量
      closedOrder: 0, // 已付订单
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      paymentStatus: [
        { label: '待支付', value: '0' },
        { label: '已支付', value: '1' }
      ],
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [
        {
          lab: '项目名称',
          val: 'productName',
          width: 140
        },
        {
          lab: '订单编号',
          val: 'orderNumber',
          width: 140
        },
        {
          lab: '创建时间',
          val: 'orderTime',
          width: 140
        },
        {
          lab: '顾客姓名',
          val: 'customerName'
          // custom: 'billingStatus'
        },
        {
          lab: '顾客电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
          width: 120
        },
        {
          lab: '付费时间',
          val: 'payTime',
          width: 160
        },
        {
          lab: '实付金额',
          val: 'payMoney',
          custom: 'payMoney',
          width: 120
        },
        {
          lab: '购买数量',
          val: 'purchaseNum',
          width: 100
          // custom: 'totalExpenses'
        },
        {
          lab: '单位',
          val: 'purchaseUnit'
        },
        {
          lab: '区域',
          val: 'region',
          custom: 'region'
        },
        {
          lab: '支付状态',
          val: 'paymentStatus',
          custom: 'paymentStatus',
          width: 120
        }
        // {
        //   lab: '开单备注',
        //   val: 'billingRemarks',
        //   width: 200,
        //   showOverflowTooltip: true
        // },
      ],
      // 查询出列表
      options: {
        projectName: {
          type: 'input',
          label: '项目名称'
        },
        orderNumber: {
          type: 'input',
          label: '订单编号:'
        },
        customerName: {
          type: 'input',
          label: '微信昵称:'
        },
        customSex: {
          type: 'select',
          label: '性别:',
          clearable: true,
          options: []
        },
        paymentStatus: {
          type: 'select',
          label: '支付状态:',
          clearable: true,
          options: []
        },
        customPhone: {
          type: 'input',
          label: '支付账号:'
        },
        customCardNumber: {
          type: 'input',
          label: '订单数:'
        },
        region: {
          type: 'select',
          label: '区域:',
          clearable: true,
          options: []
        },
        payTime: {
          type: 'Tdatetime',
          label: '支付时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        billTime: {
          type: 'Tdatetime',
          label: '订单时间:',
          clearable: true,
          values: []
        }
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
      this.getData()
    }
  },
  created() {
    this.options.paymentStatus.options = this.paymentStatus
    this.options.region.options = this.dict.type.nucleic_acid_test
    this.options.customSex.options = this.dict.type.sys_user_sex
    this.getData()
  },
  methods: {
    exportExcel() {
      var data = {}
      this.submitLoadings = true
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
      // this.$set(data, 'deptId', this.deptId)
      // this.$set(data, 'billingStatus', '1')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.finance.toBePaidList(data).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '待结账列表')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      this.coument = this.selectionData[0].customerName
      let totals = 0
      let temp = []
      this.tableData.forEach(item => {
        if (item.id === this.selectionData[0].id) {
          totals = math.add(item.amountPayable, totals)
        }
      })
      temp = this.tableData.filter(item => {
        return item.id === this.selectionData[0].id
      })
      this.payableSigle = temp.length
      this.placeorder = totals
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.coument = e[1].customerName
      let totals = 0
      let temp = []
      this.tableData.forEach(item => {
        if (item.id === e[1].id) {
          totals = math.add(item.amountPayable, totals)
        }
      })
      temp = this.tableData.filter(item => {
        return item.id === e[1].id
      })
      this.payableSigle = temp.length
      this.placeorder = totals
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 收款结账
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
    },
    // 打回
    repulse() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.receipt.orderNumber = this.selectionData[0].orderNumber
      this.receipt.orderId = this.selectionData[0].orderId
      this.getData()
    },
    /**
     * @author 李尚
     * @date 17/5/2022
     * @Description: 搜索
     */
    getData(isSearch) {
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
      this.showDataDialog = true
      this.$api.finance.nucleinOrderInfoList(data).then(res => {
        if (res) {
          this.closedOrder = res.data.closedOrder
          this.frequency = res.data.frequency
          this.sumMoney = res.data.sumMoney
          this.total = res.total
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
a{
  color: #7b95ef;
}
.container {
  width: 100%;
  height: 100%;
}
::v-deep .el-dialog__header{
  background-color: #1abc9c;
}
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}

.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
span {
  color: #999;
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
</style>
