<template>
  <!-- 还款管理(公司) -->
  <div >
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button type="primary" size="mini" plain icon="el-icon-search"  @keydown.enter.native="getData(true)" @click.stop="getData(true)">查询</el-button>
        <el-button v-has-permi="['payment:toBePaidList:export']" size="mini" icon="el-icon-upload2" type="success" plain
          :loading="submitLoading" @click="exportExcel">导出</el-button>
      </div>
      <slot>
        <sg-table ref="table" id="out-table" :sg-ref="'multipleTable'" size="mini" selection border index="序号"
          :expand-row-keys="expands" :row-key="getRowKey" highlight-current-row :table-data="tableData" :columns="columns"
          :pagination="pagination" @size-change="sizeChange" @current-change="currentChange" @row-click="rowClick"
          @selection-change="handleSelectionChange" @expand-change="expandChange" :row-class-name="rowClassName">
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
            <div>
              <span>欠款总额：{{ sumDeptPrice }}</span>
            </div>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px">
              <span><i class="el-icon-s-fold" /> 列表清单</span>
              &nbsp;
              <span><span class="color-block-danger1" />&nbsp;已到约定还款日期</span>
              &nbsp;
              <span><span class="color-block-danger" />&nbsp;逾期未还</span>
            </span>
            <el-button v-has-permi="['payment:toBePaidList:repayment']" type="primary" size="mini" plain
              style="float: right;" icon="el-icon-refresh-right" @click.stop.native="repayment">还款</el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'billingStatus'">
              <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de" @click="orderNumber(data.custom)">
                {{ data.custom.orderNumber }}
              </a>
            </div>
            <div v-else-if="data.props === 'customerName'">
              <a style="color: #5f94de" @click="customerName(data.custom.id, data.custom)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-else-if="data.props === 'billType'">
              <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
          </template>
          <template #expands="data">
            <span style="font-size: 14px;padding: 0 10px">
              <span style="margin-left: 12px" class="newdetail">{{ }}</span>
            </span>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sg-table id="out-table" size="mini" index="序号" style="display: none" :table-data="tableDatas" :columns="columns">
      <template #custom="data">
        <div v-if="data.props === 'billingStatus'">
          <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />
        </div>
        <div v-else-if="data.props === 'detailed'">
          <el-button size="mini">查看</el-button>
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #5f94de" @click="orderNumber(data.custom)">{{ data.custom.orderNumber }}</a>
        </div>
        <div v-else-if="data.props === 'customerName'">
          <a style="color: #5f94de" @click="customerName(data.custom.id, data.custom)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props === 'billType'">
          <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
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
import { debounce } from '@/utils/throttleAndDebounce'
import moment from 'moment'
import { timeFmt, todayTime,newgetData } from '@/utils/time'
import { index } from 'mathjs'
export default {
  dicts: ['billing_status', 'billing_type'],
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      expands: [],
      tableDatas: [], // 导出
      submitLoading: false,
      // 加载蒙版
      showDataDialog: false,
      sumDeptPrice: 0,
      tableData: [],
      // 多选数据
      selectionData: [],
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      //  序列清单
      columns: [
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '欠款明细',
          val: 'detailed',
          width: 80,
          expands: {}
        },
        {
          lab: '收费单状态',
          val: 'billingStatus',
          custom: 'billingStatus',
          width: 100
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 100
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 100
        },
        {
          lab: '卡号',
          val: 'customCardNumber',
          width: 160
        },
        {
          lab: '电话号码',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '备注',
          val: 'billingRemarks',
          width: 135,
          showOverflowTooltip: true
        },
        {
          lab: '费用合计',
          val: 'totalExpenses'
        },
        // 临时隐藏
        // {
        //   lab: '折扣',
        //   val: 'discount'
        // },
        {
          lab: '应付款',
          val: 'amountPayable'
        },
        {
          lab: '欠款金额',
          val: 'deptPrice'
        },
        {
          lab: '结账时间',
          val: 'createTime',
          width: 140
        },
        {
          lab: '预计还款时间',
          val: 'prepaymentTime',
          width: 100
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
        }
      ],
      // 查询出列表
      options: {
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
          label: '卡号:',
          clearable: true
        },
        prepaymentTime: {
          type: 'Tdatetime',
          label: '预计还款时间:',
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        departmentOne: {
          type: 'select',
          label: '一级项目:',
          options: [],
          values: '',
          clearable: true
        },
        departmentTwo: {
          type: 'select',
          label: '二级项目:',
          options: [],
          values: '',
          clearable: true
        },
        departmentThree: {
          type: 'select',
          label: '三级项目:',
          options: [],
          values: '',
          clearable: true
        },
        visituserName: {
          type: 'Tdatetime',
          label: '结账时间:',
          values: [],
          clearable: true
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
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
      this.getDepartmentOne()
      this.getData()
      this.getUserList(val)
    },
    'options.departmentOne.values'() {
      this.options.departmentTwo.values = ''
      this.getDepartmentTwo(this.options.departmentOne.values)
    },
    'options.departmentTwo.values'() {
      this.options.departmentThree.values = ''
      this.getDepartmentThree(this.options.departmentTwo.values)
    }
  },
  created() {
    this.getData()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getDepartmentOne()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    getRowKey(row) {
      return row.id
    },

    // 打印
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      this.submitLoading = true
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
      this.$set(data, 'orderStatus', '1')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.modules.billingList.ChargeList(data).then((res) => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        this.$export('#out-table', '还款管理')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 列表数据
    */
    getData: debounce(async function (isSearch) {
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
      this.$set(data, 'orderStatus', '1')
      this.showDataDialog = true

      await this.$api.modules.billingList.ChargeList(data).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          if (res.data !== null) {
            this.sumDeptPrice = res.data.sumDeptPrice
          }
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 订单号点击
    */
    orderNumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 客户姓名点击
    */
    customerName(id, val) {
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus } })
    },
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 还款按钮点击
    */
    repayment() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客！')
        return
      }
      if (this.selectionData[0].deptPrice === 0) {
        this.$message.warning('该订单无需还款!')
        return
      }
      this.$router.push({ path: 'repayment', query: { data: JSON.stringify(this.selectionData[0]) } })
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 分页
    */
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 欠款明细
    expandChange(row) {
      let flag = false;
      let Index = ''
      this.tableData.forEach((value, index) => {
        if (value.orderNumber == row[1].orderNumber) {
          Index = index;
        }
      })
      this.$api.modules.billingList.debtList({ orderNumber: row[1].orderNumber }).then(res => {
        if (res) {
          let flag = false;
          let childrens = document.querySelector("tbody").children;
          for (let j = 0; j < childrens.length; j++) {
            if (childrens[j].className == '') {

            } else {

              let y = childrens[j].children[2].children[0].children[0].children[0].innerHTML;
              let newy = y.replace(/\s*/g, "");
              if (String(newy) === String(row[1].orderNumber)) {
                if (childrens[j].children[3].children[0].children[0].className == 'el-table__expand-icon') {
                  flag = true
                }
              }
            }
          }
          if (flag) {
            return
          }
          let newstr = '';
          res.data.forEach((value,index) => {
             if(index==res.data.length-1){
              newstr += value
             }else{
              newstr+=value+' '+'/'+' '
             }

          })
          let children = document.querySelectorAll('.newdetail');
          for (let i = 0; i < children.length; i++) {
            if (document.querySelectorAll('.newdetail')[i].innerHTML=='') {
              document.querySelectorAll('.newdetail')[i].innerHTML = '欠款明细：' + newstr
            }
          }

        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/24
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
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },

    // row背景颜色
    rowClassName({ row,rowIndex }) {
      const compareDate = (d1, d2) => {
        return ((new Date(d1.replace(/\-/g, "\/"))) > (new Date(d2.replace(/\-/g, "\/"))));
      }
      const compareDate1 = (d1, d2) => {
        return ((new Date(d1.replace(/\-/g, "\/"))) < (new Date(d2.replace(/\-/g, "\/"))));
      }
      const d1 = timeFmt('YYYY-mm-dd', new Date())
      const d2 = row.prepaymentTime
      // 如果今天日期大于于预计还款日期
      if (row.repaymentState == 0 && compareDate(d1, d2)) {
        return 'color-block-reds' //逾期未还
      }
      else if (row.repaymentState == 0 && compareDate1(d1, d2)) {
        // 如果今天日期小于预计还款日期
        return ''
      } else if (row.repaymentState == 0 && !compareDate(d1, d2) && !compareDate1(d1, d2)) {
        // 如果今天日期等于预计还款日期，到了还款日
        return 'color-block-yellow'
      }

    },

    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 获取用户列表
    */
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
        if (res.code === 200) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.aestheticConsultant.options.push(item)
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 查询科室一级
     */
    async getDepartmentOne() {
      await this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentOne.options = res.rows
        }
      })
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
          this.options.departmentTwo.options = res.rows
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
          this.options.departmentThree.options = res.rows
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
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
}

.color-block-danger {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 2px;
  border: 1px solid red;
}

.color-block-danger1 {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #f1ec92;
  border-radius: 2px;
  border: 1px solid #f1ec92;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .color-block-reds {
  background: red !important;
}

::v-deep .color-block-yellow {
  background: #f1ec92 !important;
}
</style>
<style>
.el-input__prefix {
  display: none;

}
</style>
