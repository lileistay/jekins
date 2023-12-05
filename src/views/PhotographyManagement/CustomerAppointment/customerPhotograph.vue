<template>
  <!-- 待结账列表 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData"
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
          selection
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
              <p>客户: {{ coument }}
                &nbsp;&nbsp;
                <span>应付 : {{ placeorder }}元[{{ payableSigle }}单]</span>&nbsp;
                <!-- <span>应退 : {{checkOut}}元[{{payableSigle}}单]</span>-->
              </p>
            </div>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
            <el-button
              v-hasPermi="['system:dept:collection']"
              type="primary"
              size="mini"
              plain
              icon="el-icon-edit"
              style="float: right;"
              @click.stop.native="openManualDialog"
            >收款结账
            </el-button>
            <el-button
              v-hasPermi="['system:dept:repulse']"
              type="danger"
              size="mini"
              plain
              icon="el-icon-edit"
              style="float: right; margin-right: 10px"
              @click.stop.native="repulse"
            >打回
            </el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customerName'">
              <a @click="customerPhotograph(data.custom,data.custom)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                {{ data.custom.orderNumber }}
              </a>
            </div>
            <div v-else-if="data.props === 'billingStatus'">
              <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />
            </div>
            <div v-else-if="data.props === 'billType'">
              <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'totalExpenses'">
              <span style="color: #606266">{{ data.custom.totalExpenses == null ? 0: data.custom.totalExpenses }}</span>
            </div>
            <div v-else-if="data.props === 'amountPayable'">
              <span style="color: #606266">{{ data.custom.amountPayable == null ? 0: data.custom.amountPayable }}</span>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <!--打回-->
    <el-dialog
      title="打回单据"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="receipt" label-width="100px" :rules="rules" :model="receipt" size="mini">
        <el-form-item label="收费单单号:">
          <el-input v-model="receipt.orderNumber" disabled />
        </el-form-item>
        <el-form-item label="打回备注:" prop="returnComments">
          <el-input v-model="receipt.returnComments" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading" @click="repulseReceipt">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
      <template #custom="data">
        <div v-if="data.props === 'customerName'">
          <a @click="customerPhotograph(data.custom,data.custom)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
            {{ data.custom.orderNumber }}
          </a>
        </div>
        <div v-else-if="data.props === 'billingStatus'">
          <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />
        </div>
        <div v-else-if="data.props === 'billType'">
          <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
        </div>
        <div v-else-if="data.props === 'totalExpenses'">
          <span style="color: #606266">{{ data.custom.totalExpenses == null ? 0: data.custom.totalExpenses }}</span>
        </div>
        <div v-else-if="data.props === 'amountPayable'">
          <span style="color: #606266">{{ data.custom.amountPayable == null ? 0: data.custom.amountPayable }}</span>
        </div>
      </template>
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
  dicts: ['billing_status', 'billing_type', 'just_needed'],
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      tableDatas: [],
      submitLoadings: false,
      submitLoading: false,
      coument: '',
      payableSigle: 0,
      placeorder: 0, // 下单人数
      // checkOut: 0,
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      dialogVisible: false,
      receipt: {
        orderId: '',
        billingStatus: '2',
        orderNumber: '',
        returnComments: ''
      },
      rules: {
        returnComments: [
          { required: true, message: '请填写打回备注', trigger: 'change' }
        ]
      },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [
        {
          lab: '收费单号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '预约状态',
          val: 'billingStatus',
          custom: 'billingStatus'
        },
        {
          lab: '顾客名称',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '顾客电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '顾客卡号',
          val: 'customCardNumber',
          width: 160
        },
        {
          lab: '照片数量',
          val: 'amountPayable',
          custom: 'amountPayable'
        },
        // {
        //   lab: '是否折扣',
        //   val: 'discount'
        // },
        {
          lab: '精修数量',
          val: 'totalExpenses',
          custom: 'totalExpenses'
        },
        {
          lab: '媒介类型',
          val: 'typeName'
        },
        {
          lab: '媒介信息',
          val: 'channelName'
        },
        {
          lab: '开单备注',
          val: 'billingRemarks',
          width: 200,
          showOverflowTooltip: true
        },
        {
          lab: '下单人',
          val: 'dsingleUserName'
        },
        {
          lab: '下单时间',
          val: 'billTime',
          width: 144
        }
      ],
      // 查询出列表
      options: {
        orderNumber: {
          type: 'input',
          label: '收费单号:'
        },
        customerName: {
          type: 'input',
          label: '顾客姓名:'
        },
        customPhone: {
          type: 'input',
          label: '顾客电话:'
        },
        customCardNumber: {
          type: 'input',
          label: '顾客卡号:'
        },
        billType: {
          type: 'select',
          label: '收费单类型:',
          clearable: true,
          options: []
        },
        // billingStatus: {
        //   type: 'select',
        //   label: '收费单状态:',
        //   clearable: true,
        //   options: []
        // },
        billTime: {
          type: 'Tdatetime',
          label: '开单时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        billingRemarks: {
          type: 'input',
          label: '备注:'
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
    this.options.billType.options = this.dict.type.billing_type
    // this.options.billingStatus.options = this.dict.type.billing_status
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
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billingStatus', '1')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.finance.toBePaidList(data).then(res => {
        if (res) {
          this.tableDatas = res.rows
          // let arr = res.rows.filter(ite => {
          //   return ite.billingStatus === '2'
          // })
          // this.placeorder = arr.length
          // let arrcheck = res.rows.filter(ite => {
          //   return ite.billingStatus === '3'
          // })
          // this.checkOut = arrcheck.length
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '待结账列表')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },
    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
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
      this.dialogVisible = true
      this.receipt.orderNumber = this.selectionData[0].orderNumber
      this.receipt.orderId = this.selectionData[0].orderId
      this.getData()
    },
    repulseReceipt() {
      this.$refs.receipt.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$api.finance.repulseReceipt(this.receipt).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.submitLoading = false
              this.getData()
            }
          })
        }
      })
    },
    customer(personal, val) {
      const id = personal.id
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus }})
    },
    /**
     * @author 李尚
     * @date 17/5/2022
     * @Description: 搜索
     */
    getData() {
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
      data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billingStatus', '1')
      this.showDataDialog = true
      this.$api.finance.toBePaidList(data).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
          // let arr = res.rows.filter(ite => {
          //   return ite.billingStatus === '2'
          // })
          // this.placeorder = arr.length
          // let arrcheck = res.rows.filter(ite => {
          //   return ite.billingStatus === '3'
          // })
          // this.checkOut = arrcheck.length
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 弹框关闭
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
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
