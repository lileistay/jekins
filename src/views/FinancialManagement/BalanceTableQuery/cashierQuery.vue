<template>
  <!-- 收银查询 -->
  <div class="box">
    <div class="header" style="border-bottom: 1px solid #f2f2f2">
      <div>
        <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
          <el-form-item label="结账方式：">
            <el-input v-model="form.payName" clearable />
          </el-form-item>
          <el-form-item label="收银员：">
            <el-select v-model="form.cashier" filterable clearable :filter-method="may">
              <el-option
                v-for="item in sysUserList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="结账时间">
<!--            <el-date-picker-->
<!--              v-model="form.createTime"-->
<!--              style="width:320px"-->
<!--              clearable-->
<!--              type="datetimerange"-->
<!--              format="yyyy-MM-dd HH:mm:ss"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              :default-time="['00:00:00', '23:59:59']"-->
<!--            />-->
            <el-date-picker
              v-model="form.createTime" class="inputWidth"
              type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 210px" />
          </el-form-item>
        </el-form>
      </div>
      <div><el-button size="mini" type="primary" @click="getData(true)" @keydown.enter.native="getData(true)">查询</el-button></div>
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
          :pagination="pagination"
          max-height="670px"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
          :cell-class-name="cellClassName"
        >
          <div slot="searchBar" class="searchBar">
            <div style="font-size: 12px">收银查询列表</div>
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
            selection
            border
            index="序号"
            highlight-current-row
            :table-data="tableDat"
            :columns="column"
            :pagination="paginations"
            max-height="670px"
            @size-change="sizeChanges"
            @current-change="currentChanges"
            :cell-class-name="cellClassNames"
          >
            <div slot="searchBar" class="searchBar">
              <div style="font-size: 12px">费用明细</div>
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
                <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
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
import { debounce } from '@/utils/throttleAndDebounce'
import PinyinMatch from "pinyin-match";
export default {
  dicts: ['billing_type'],
  components: {
    SgTable
  },
  data() {
    return {
      rights: false,
      newsysUserList:[],
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
      amount: 0.00, // 合计
      check: '', // 结账金额合计
      sysUserList: [], // 分诊科室数据
      // 搜索
      form: {
        payName: '',
        cashier: '',
        createTime: todayTime()
      },
      // 显示
      tableData: [],
      columns: [
        {
          lab: '收银员',
          val: 'cashierName'
          // custom: 'customerName'
        },
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
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 隐藏的
      listData: {},
      tableDat: [],
      column: [
        {
          lab: '收费单编号',
          val: 'orderNumber',
          width: 165,
          custom: 'orderNumber'
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
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 100
        },
        {
          lab: '结账方式',
          val: 'payName'
          // width: 150
        },
        {
          lab: '结账金额',
          val: 'paymentAmount',
          width: 80
        },
        // {
        //   lab: '本金',
        //   val: 'principalMoney',
        //   width: 80
        // },
        {
          lab: '下单人',
          val: 'dsingleUserName',
          width: 90
        },
        {
          lab: '结账时间',
          val: 'createTime',
          width: 140
        },
        {
          lab: '结账备注',
          val: 'remark',
          width: 90,
          showOverflowTooltip: true
        }
      ],
      paginations: {
        pageSizes: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNums: 1,
        show: true
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
    cellClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    cellClassNames({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    may(val){
      if (val) {
        this.sysUserList = this.newsysUserList.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.sysUserList = this.newsysUserList
      }

  },
    orderNumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(this.form, 'deptId', this.deptId)
      this.$api.billingList.chargeRecordInfo({
        ...this.pagination, ...this.form,
        createTime: this.form.createTime ? this.form.createTime[0] : null,
        endcreateTime: this.form.createTime ? this.form.createTime[1] : null
      }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.tableDat = []
          this.rights = false
          this.pagination.total = res.total
          if (res.data === null) {
            this.amount = 0.00
          } else {
            this.amount = res.data
          }
        }
      })
    }),
    getDatas() {
      const data = Object.assign(this.listData, this.paginations)
      this.$api.billingList.chargeRecordInfoDetails({
        ...data,
        createTime: this.form.createTime ? this.form.createTime[0] : null,
        endcreateTime: this.form.createTime ? this.form.createTime[1] : null
      }).then(res => {
        if (res) {
          this.rights = true
          this.tableDat = res.rows
          this.paginations.total = res.total
          this.check = res.data
        }
      })
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
      this.listData = {
        paymentChannel: val[1].paymentChannel, // 支付方式
        cashier: val[1].cashier // 收银员
        // checkoutTime:
      }
      this.getDatas()
    },
    // 获取用户列表
    async getUserList(deptId) {
      // 人员添加公司Id  添加状态  添加岗位
      let data = {
        deptId: deptId,
        status: '0'
      }
      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach(item => {
            if (item.postCode === 'cashier') {
              this.sysUserList.push(item)
               this.newsysUserList.push(item)
            }
          })
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
    sizeChanges(e) {
      this.paginations.pageSizes = e[1]
      this.handleCurrentChange()
    },
    currentChanges(e) {
      this.paginations.pageNums = e[1]
      this.paginations.currentPages = e[1]
      this.handleCurrentChange()
    },
    // 行内点击
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
.box{
  //width: 100%;
  padding: 10px 10px 0 10px;
  .header, .searchBar {
    display: flex;
    justify-content: space-between;
    .left{
      width: 40%;
    }
    .right{
      width: 58%;
    }
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
