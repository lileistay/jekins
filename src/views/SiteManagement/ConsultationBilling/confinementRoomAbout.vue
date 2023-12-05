<template>
  <!-- 月子房间预约列表 -->
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
          size="mini"
          type="success"
          plain
          icon="el-icon-upload2"
          :loading="submitLoadings"
          @click.stop="exportExcel"
        >导出</el-button>
      </div>
      <slot>
        <sg-table
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          :cell-class-name="cellClassName"
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          stripe
          highlight-current-row
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <div slot="searchBar" class="searchBar">
            <span><i class="el-icon-s-fold" /> 列表清单</span>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'checkStatus'">
              <show-dict-data :style="activation(data.custom.checkStatus)" :options="dict.type.Room_status" :value="data.custom.checkStatus" />
            </div>
            <!-- 点击姓名跳转路由 -->
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
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
        <div v-if="data.props === 'checkStatus'">
          <show-dict-data :options="dict.type.Room_status" :value="data.custom.checkStatus" />
        </div>
        <!-- 点击姓名跳转路由 -->
        <div v-else-if="data.props === 'customerName'">
          <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
        </div>
      </template>
      <!--      <template #custom="data">-->
      <!--        <div v-if="data.props === 'billingStatus'">-->
      <!--          <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />-->
      <!--        </div>-->
      <!--        <div v-else-if="data.props === 'totalExpenses'">-->
      <!--          <span style="color: #606266">{{ data.custom.totalExpenses == null ? 0: data.custom.totalExpenses }}</span>-->
      <!--        </div>-->
      <!--        <div v-else-if="data.props === 'amountPayable'">-->
      <!--          <span style="color: #606266">{{ data.custom.amountPayable == null ? 0: data.custom.amountPayable }}</span>-->
      <!--        </div>-->
      <!--      </template>-->
    </sg-table>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { todayTime,newgetData } from '@/utils/time'
import moment from 'moment'
// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils'

export default {
  name: 'ConfinementRoomAbout',
  dicts: ['Room_status'],
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      tableDatas: [],
      submitLoadings: false,
      // checkOut: 0,
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      //  序列清单
      columns: [
        {
          lab: '顾客姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '顾客电话',
          val: 'customPhone'
          // width: 120
        },
        {
          lab: '房间名称',
          val: 'roomName'
          // width: 120
        },
        {
          lab: '年龄',
          val: 'customAge'
          // width: 160
        },
        {
          lab: '民族',
          val: 'custmAemizu'
        },
        {
          lab: '顾客渠道',
          val: 'typeName'
        },
        {
          lab: '前台顾问',
          val: 'createBy'
        },
        {
          lab: '接待咨询',
          val: 'aestheticName'
        },
        {
          lab: '责任护士',
          val: 'nurseName'
        },
        {
          lab: '责任月嫂',
          val: 'maternityName'
        },
        {
          lab: '入住时间',
          val: 'createTime'
          // custom: 'payMoney',
          // width: 120
        },
        {
          lab: '入住状态',
          val: 'checkStatus',
          // width: 100
          custom: 'checkStatus'
        },
        {
          lab: '入住天数',
          val: 'remainingDays'
        },
        {
          lab: '离开时间',
          val: 'checkOutTime'
        },
        {
          lab: '开单备注',
          val: 'remark',
          width: 200,
          showOverflowTooltip: true
        }
      ],
      // 查询出列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '预约时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        checkReservationTime: {
          type: 'Tdatetime',
          label: '预计入住时间:',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'input',
          label: '顾客姓名:'
        },
        customPhone: {
          type: 'input',
          label: '顾客电话:'
        },
        roomName: {
          type: 'input',
          label: '房间名称:'
        },
        remainingDays: {
          type: 'input',
          label: '入住天数:'
        }
        // time: {
        //   type: 'Tdatetime',
        //   label: '已退房间时间:',
        //   clearable: true,
        //   values: []
        // }
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
    },
    activation() {
      return (icontent) => { // 使用JavaScript闭包，进行传值操作
        // console.log(icontent)
        if (icontent == "0") {
          return { 'color': '#f8cd05' } // 空闲
        } else if (icontent =="1") {
          return { 'color': '#ff6817' } // 已预约
        } else if (icontent == "2") {
          return { 'color': '#26A60C' } // 已入住
        } else if (icontent == "3") {
          return { 'color': '#21d9d9' } // 已退房
        } else if (icontent == "4") {
          return { 'color': '#215bd9' } // 已取消
        }
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
    this.deptId = this.$store.getters.departmentId
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
    // 导出
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
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.submitLoadings = true
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tselect') {
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
        } else if (this.options[k].type === 'Tinput') {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
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
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = false
      this.$api.medical.selectRoomReservation(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        /* 从表生成工作簿对象 */
        this.$export('#out-table', '月子房间预约列表')
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
    /**
     * @author 李尚
     * @date 17/5/2022
     * @Description: 搜索
     */
    async getData(isSearch) {
      this.showDataDialog = true
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        }
        else if (this.options[k].type === 'Tdatetime') {
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
        }
        else if (this.options[k].type === 'Tinput') {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
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
      this.$set(data, 'deptId', this.deptId)
      data = Object.assign(data, this.pagination)
      this.showDataDialog = false
      await this.$api.medical.selectRoomReservation(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
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
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
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
span {
  color: #999;
  font-size: 14px;
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
