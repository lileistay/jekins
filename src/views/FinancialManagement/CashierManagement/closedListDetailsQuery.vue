<template>
  <!-- 已结账列表明细查询  -->
  <div class="container">
    <slideSearch :options="options">
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
          v-has-permi="['payment:toBePaidList:export']"
          type="success"
          size="mini"
          icon="el-icon-upload2"
          plain
          :loading="submitLoading"
          @click.stop="exportExcel"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          :cell-class-name="cellClassName"
        >
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
            <div>
              <p>
                实付汇总：{{ paidAmountSum }}
              </p>
            </div>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="color: #7ec5b7; font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'isPackage'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isPackage" />
            </div>
            <div v-else-if="data.props === 'billType'">
              <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'customerName'">
              <a style="color: #66b1ff;cursor: pointer;" @click="customer(data.custom,data.custom)">{{ data.custom.customerName }}</a>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #0066cc; cursor: pointer;" @click="orderNumber(data.custom)">
                {{ data.custom.orderNumber }}
              </a>
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
      <template #custom="data">
        <div v-if="data.props === 'isPackage'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isPackage" />
        </div>
        <div v-else-if="data.props === 'billType'">
          <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
        </div>
        <div v-else-if="data.props === 'customerName'">
          <a style="color: #66b1ff;cursor: pointer;" @click="customer(data.custom,data.custom)">{{ data.custom.customerName }}</a>
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #0066cc; cursor: pointer;" @click="orderNumber(data.custom)">
            {{ data.custom.orderNumber }}
          </a>
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
import { todayTime,newgetData } from '@/utils/time'
import moment from 'moment'

export default {
  dicts: ['whether', 'billing_type'],
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      tableDatas: [], // 导出
      submitLoading: false,
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      paidAmountSum: 0,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单类型',
          val: 'billType',
          width: 90,
          custom: 'billType'
        },
        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 100
        },
        {
          lab: '下单人',
          val: 'dsingleUserName',
          width: 100
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '结账方式',
          val: 'payNameAmount',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '媒介类型',
          val: 'channelTypeName'
        },
        {
          lab: '媒介信息',
          val: 'channelName',
          width: '120'
        },
        {
          lab: '费用类型',
          val: 'costTypeName'
        },
        {
          lab: '原价',
          val: 'priceOne'
        },
        {
          lab: '数量',
          val: 'quantity'
        },
        {
          lab: '折前合计',
          val: 'totalAmount',
          width: 100
        },
        {
          lab: '折扣',
          val: 'discount'
        },
        {
          lab: '折后金额',
          val: 'discountAmount',
          width: 100
        },
        {
          lab: '开单业绩',
          val: 'billingPerformance',
          width: 100
        },
        {
          lab: '科室业绩',
          val: 'departmentPerformance',
          width: 100
        },
        {
          lab: '渠道来源',
          val: 'typeThreeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '是否套餐',
          val: 'isPackage',
          custom: 'isPackage'
        },
        {
          lab: '套餐名称',
          val: 'pmIdsName'
        }
      ],
      // 查询出列表
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        orderNumber: {
          type: 'input',
          label: '收费单号:',
          clearable: true
        },
        customerName: {
          type: 'input',
          label: '客户姓名:',
          clearable: true
        },
        customPhone: {
          type: 'input',
          label: '电话:',
          clearable: true
        },
        customCardNumber: {
          type: 'input',
          label: '顾客卡号:',
          clearable: true
        },
        billType: {
          type: 'select',
          label: '收费单类型:',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '科室:',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        dsingleUser: {
          type: 'select',
          label: '下单人',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'cascader',
          label: '渠道来源',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        paymentChannel: {
          type: 'select',
          label: '结账方式',
          clearable: true,
          options: []
        },
        projectName: {
          type: 'input',
          label: '项目:',
          clearable: true
        },
        costType: {
          type: 'select',
          label: '费用类型',
          clearable: true,
          options: []
        },
        channel: {
          type: 'Tselect',
          label: '媒介类型',
          clearable: true,
          values: [],
          options: []
        },
        isPackage: {
          type: 'select',
          label: '是否套餐',
          clearable: true,
          options: []
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
      this.getChannelInfo()
      this.getDepartmentList()
      this.getDeptFilingList()
      this.getUserList(val)
    },
    // 媒介
    'options.channel.values'() {
      if (this.options.channel.values[0]) {
        this.options.channel.options[1] = this.channelType.filter(filter => {
          return filter.typeId === this.options.channel.values[0]
        })[0].channelInfo
      } else {
        this.options.channel.options[1] = []
      }
    },
    'options.channel.values.0'() {
      this.options.channel.values[1] = ''
    }
  },
  created() {
    this.options.billType.options = this.dict.type.billing_type
    this.options.isPackage.options = this.dict.type.whether
    this.getChargeType()
    this.getChannelInfo()
    this.getCostType()
    this.getDepartmentList()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getDeptFilingList()
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
    cellClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      this.submitLoading = true
      for (const k in this.options) {
        if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
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
      this.$set(data, 'billingStatus', '3')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.finance.paidListDetails(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '已结账列表明细查询')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    // 客户姓名
    customer(personal, val) {
      const id = personal.id
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus }})
    },
    // 收费单编号
    orderNumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取数据
     */
    getData(isSearch) {
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
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
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        else {
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
      this.$set(data, 'billingStatus', '3')
      this.showDataDialog = true
      this.$api.finance.paidListDetails(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          // let temp = ''
          // this.tableData.forEach(items => {
          //   items.payName = ''
          //   items.payList.forEach(item => {
          //     temp = item.payName + '：' + item.paymentAmount
          //     items.payName += temp + '，'
          //   })
          //   items.payName = items.payName.substr(0, items.payName.length - 1)
          // })
          this.paidAmountSum = res.data === null ? 0 : res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取收费单类型
     */
    getChargeType() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.finance.paymentChannelList(data).then(res => {
        if (res) {
          this.options.paymentChannel.options = res.rows
          res.rows.forEach((item) => {
            item.value = item.payId
            item.label = item.payName
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取媒介来源
     */
    getChannelInfo() {
      this.$api.modules.channel.getChannelType({
        'deptId': this.deptId,
        'status': 0
      }).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            this.channelType = res.data
            this.respliceNameLabel(res.data)
            this.options.channel.options.splice(0, 0, res.data)
          } else {
            this.options.channel.options = []
            this.options.channel.values = []
          }
        }
      })
    },
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取费用类型
     */
    getCostType() {
      this.$api.product.expenseList().then(res => {
        if (res) {
          res.rows.forEach((item) => {
            item.value = item.expenseTypeId
            item.label = item.expenseTypeName
          })
          this.options.costType.options = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取科室列表
     */
    getDepartmentList() {
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentId.options = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取用户列表
     */
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.options.dsingleUser.options = arr1
          this.options.aestheticConsultant.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取渠道类型
     */
    getDeptFilingList() {
      this.$api.modules.filing.getFilingTypeById({
        deptId: this.deptId
      }).then(res => {
        if (res.data) {
          this.options.typeThreeIds.options = res.data
        }
      })
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
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 复选框点击选中
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    }
  }
}
</script>

<style scoped lang="scss">
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
::v-deep .el-input__prefix{
  display: none;
}
</style>
