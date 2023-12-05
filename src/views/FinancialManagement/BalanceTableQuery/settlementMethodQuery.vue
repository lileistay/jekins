<template>
  <!-- 结账方式查询 -->
  <div class="box">
    <div class="header" style="border-bottom: 1px solid #f2f2f2">
      <div>
        <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
          <el-form-item label="结账时间">
<!--            <el-date-picker-->
<!--                v-model="form.createTime"-->
<!--                clearable-->
<!--                type="datetimerange"-->
<!--                format="yyyy-MM-dd HH:mm:ss"-->
<!--                value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期"-->
<!--                :default-time="['00:00:00', '23:59:59']"-->
<!--                style="width: 207px"-->
<!--            />-->
            <el-date-picker
              v-model="form.createTime" class="inputWidth"
              type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 210px" />
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button size="mini" type="primary" @click="getData" @keydown.enter.native="getData(true)">查询</el-button>
      </div>
    </div>
    <div class="header listdata">
      <div class="left">
        <sg-table
            ref="table"
            :sg-ref="'multipleTable'"
            size="mini"
            selection
            border
            index="序号"
            highlight-current-row
            :table-data="tableData"
            :columns="columns"
            max-height="680px"
            :cell-class-name="cellClassNames"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div style="font-size: 12px">结账方式查询列表</div>
            <div>
              <span style="font-size: 12px; color: #999">合计金额：{{ amount }}元</span>
            </div>
          </div>
        </sg-table>
      </div>
      <div class="right">
        <div v-if="rights">
          <sg-table
              size="mini"
              border
              index="序号"
              highlight-current-row
              :table-data="tableDat"
              :columns="column"
              max-height="680px"
              :cell-class-name="cellClassNames"
          >
            <div slot="searchBar" class="searchBar">
              <div style="font-size: 12px">账单明细：</div>
              <div>
                <span style="font-size: 12px; color: #999">结账金额合计：{{ check }}(元)</span>
              </div>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'orderNumber'">
                <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                  {{ data.custom.orderNumber }}
                </a>
              </div>
              <div v-else-if="data.props === 'billType'">
                <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType"/>
              </div>
            </template>
          </sg-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
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
import {debounce} from '@/utils/throttleAndDebounce'

export default {
  dicts: ['billing_type'],
  components: {
    SgTable
  },
  data() {
    return {
      rights: false,
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
      amount: '', // 合计
      check: '', // 结账金额合计
      sysUserList: [], // 分诊科室数据
      // 搜索
      form: {
        createTime: todayTime()
      },
      // 显示
      tableData: [],
      columns: [
        {
          lab: '结账方式',
          val: 'payName'
          // width: 150
        },
        {
          lab: '金额',
          val: 'paymentAmount'
        }
      ],
      // 分页
      // pagination: {
      //   pageSize: 20, // 每页显示的条数
      //   total: 0, // 总条数
      //   pageNum: 1,
      //   show: true
      // },
      // 隐藏的
      listData: {},
      tableDat: [],
      column: [
        {
          lab: '日期',
          val: 'createTime',
          width: 140
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          width: 165,
          custom: 'orderNumber'
        },
        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '姓名',
          val: 'customerName',
          width: 90
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '结账金额',
          val: 'paymentAmount',
          width: 80
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 100
        },
        {
          lab: '下单人',
          val: 'dsingleUserName',
          width: 90
        },
        {
          lab: '结账备注',
          val: 'remark',
          width: 90,
          showOverflowTooltip: true
        }
      ]
      // paginations: {
      //   pageSizes: 20, // 每页显示的条数
      //   total: 0, // 总条数
      //   pageNums: 1,
      //   show: true
      // }
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
    cellClassNames({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    cellClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    // 编号跳转
    orderNumber(data) {
      this.$router.push({path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 搜索
    getData: debounce(function () {
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(this.form, 'deptId', this.deptId)
      this.$api.billingList.settlementMethod({
        ...this.pagination,
        deptId: this.deptId,
        createTime: this.form.createTime ? this.form.createTime[0] : null,
        endcreateTime: this.form.createTime ? this.form.createTime[1] : null
      }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.tableDat = []
          this.rights = false
          this.amount = res.data
        }
      })
    }),
    // 对应搜索出的列表
    getDatas() {
      const data = Object.assign(this.listData)
      this.$api.billingList.settlementMethodDetails({
        ...data,
        deptId: this.deptId,
        createTime: this.form.createTime ? this.form.createTime[0] : null,
        endcreateTime: this.form.createTime ? this.form.createTime[1] : null
      }).then(res => {
        if (res) {
          this.rights = true
          this.tableDat = res.rows
          let totle = 0
          this.tableDat.forEach(res => {
            totle = res.paymentAmount + totle
          })
          this.check = totle
        }
      })
    },
    // 行内点击 传值
    handleCurrentChange(val) {
      this.rowTable = val[1]
      this.listData.paymentChannel = val[1].paymentChannel // 支付方式
      this.getDatas()
    },
    // 获取用户列表
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 行内点击 选中勾对
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  //width: 100%;
  padding: 10px 10px 0 10px;

  .header, .searchBar {
    display: flex;
    justify-content: space-between;

    .left {
      width: 40%;
    }

    .right {
      width: 58%;
    }
  }
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
