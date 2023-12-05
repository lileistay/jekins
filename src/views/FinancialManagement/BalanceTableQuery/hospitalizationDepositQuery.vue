<template>
  <!-- 住院押金查询 -->
  <div class="box">
    <div class="header" style="border-bottom: 1px solid #f2f2f2">
      <div>
        <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
          <el-form-item label="客户：">
            <el-input v-model="form.customerName" clearable />
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="form.customPhone" clearable />
          </el-form-item>
          <el-form-item label="美学顾问：">
            <el-select v-model="form.aestheticConsultant" filterable clearable :filter-method="aesFilter">
              <el-option
                v-for="item in sysUserList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="时间：">
<!--            <el-date-picker-->
<!--              v-model="form.createTime"-->
<!--              type="daterange"-->
<!--              format="yyyy-MM-dd"-->
<!--              value-format="yyyy-MM-dd"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              style="width: 230px"-->
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
          id="out-table"
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
          :cell-class-name="cellClassNames"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
            <template #custom="data">
                <div v-if="data.props === 'customerName'">
                    <a style="color: #5f94de;cursor: pointer;" @click="customer(data.custom,data.custom)">
                        {{ data.custom.customerName }}
                    </a>
                </div>
            </template>
          <div slot="searchBar" class="searchBar" style="background-color: #1abc9c">
            <div class="rights">
              <p class="itemfont">住院押金查询列表</p>
            </div>
            <div class="rights">
              <el-button size="mini" @click="exportExcel" style="margin-right: 10px">导出</el-button>
            </div>
          </div>
        </sg-table>
      </div>
      <div class="right">
        <div v-if="rights">
          <div style="margin-bottom: 20px">
            <div class="rights">
              <p class="itemfont">住院押金收入明细</p>
            </div>
            <el-table :data="tableList" size="mini" style="width: 100%"  :cell-class-name="cellClassName">
              <el-table-column label="序号" type="index" width="50" />
              <el-table-column prop="orderNumber" width="165" label="收费单编号">
                <template slot-scope="scope">
                  <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(scope.row)">
                    {{ scope.row.orderNumber }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="customerName" label="姓名" />
              <el-table-column prop="customPhone" label="电话" />
              <el-table-column prop="billType" label="收费单类型">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.billing_type" :value="scope.row.billType" />
                </template>
              </el-table-column>
              <el-table-column prop="rechargeAmount" label="结账金额" />
              <el-table-column prop="acName" label="下单人" />
            </el-table>
          </div>
          <div class="rights">
            <p class="itemfont">住院押金支出明细</p>
          </div>
          <el-table :data="ListData" size="mini" style="width: 100%"  :cell-class-name="newcellClassNames">
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="orderNumber"  width="165" label="收费单编号">
              <template slot-scope="scope">
                <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(scope.row)">
                  {{ scope.row.orderNumber }}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="customerName" label="姓名" />
            <el-table-column prop="customPhone" label="电话" />
            <el-table-column prop="billType" label="收费单类型">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.billing_type" :value="scope.row.billType" />
              </template>
            </el-table-column>
            <el-table-column prop="rechargeAmount" label="结账金额" />
            <el-table-column prop="acName" label="下单人" />
          </el-table>
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
import {export_table_to_excel} from "../../../utils/utils";
export default {
  dicts: ['billing_type'],
  components: {
    SgTable
  },
  data() {
    return {
      rights: false,
      sysUserList: [], // 美学顾问
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
      sysUser: [],
      // 搜索
      form: {
        customerName: '',
        customPhone: '',
        createTime: todayTime(),
        aestheticConsultant: ''
      },
      // 显示
      tableData: [],
      tableList: [],
      ListData: [],
      columns: [
        // width: 150
        // custom: 'customerName'
        {
          lab: '客户',
          val: 'customerName',
          custom:'customerName'
        },
        {
          lab: '期初',
          val: 'endPeriod'
        },
        {
          lab: '本期进',
          val: 'currentInsert'
        },
        {
          lab: '消费出',
          val: 'consumptionOut'
        },
        {
          lab: '退款出',
          val: 'refundOut'
        },
        {
          lab: '期末',
          val: 'beginPeriod'
        },
        {
          lab: '电话',
          val: 'customPhone'
        },
        {
          lab: '美学顾问',
          val: 'acName'
        }
      ],
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
      // 顾客
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
    newcellClassNames({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
      customer(personal, val) {
          const id = personal.id
          this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus }})
      },
      exportExcel(){
          this.$message({
              message: '稍等一下，马上就好',
              type: 'success'
          })
          var data = {
              deptId: this.deptId,
              aestheticConsultant: this.form.aestheticConsultant,
              params: {
                  beginTime: this.form.createTime ? this.form.createTime[0] : null,
                  endTime: this.form.createTime ? this.form.createTime[1] : null,
                  customerName: this.form.customerName,
                  customPhone: this.form.customPhone,
              }
          }
          this.$api.finance.hospitalizationDepositRecord(data).then(res => {
              if (res) {
                  this.tableData = res.rows
              }
          }).finally(() => {
              export_table_to_excel('#out-table', '住院押金查询列表')
          })
      },
    aesFilter(val) {
      if (val) {
        this.sysUserList = this.sysUser.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          // console.log(this.sysUserList,'嘿嘿')
          // console.log(PinyinMatch.match(item.label, val),'啊哈哈哈')
          return PinyinMatch.match(item.nickName, val)
        })

      } else {
        this.sysUserList = this.sysUser
      }
    },
    // 编号跳转
    orderNumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    getData: debounce(function(isSearch) {
      if (this.form.createTime === null) {
        this.$message('请选择时间')
        return
      }
      var data = {
        deptId: this.deptId,

        aestheticConsultant: this.form.aestheticConsultant,
        params: {
          beginTime: this.form.createTime ? this.form.createTime[0] : null,
          endTime: this.form.createTime ? this.form.createTime[1] : null,
          customerName: this.form.customerName,
          customPhone: this.form.customPhone,
        }
      }
        data = Object.assign(data, this.pagination)
      this.$api.finance.hospitalizationDepositRecord(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    handleCurrentChange(val) {
      this.tableList = []
      this.ListData = []
        var query = {
            id:val[1].id,
            beginTime:this.form.createTime[0],
            endTime: this.form.createTime[1],
        }
      this.$api.finance.selectHospitalizationRecord(query).then(res => {
        if (res) {
            this.tableList = []
            this.ListData = []
            res.data.forEach(res => {
                if (res.status==1 ||res.status==3){
                    this.ListData.push(res)
                }else {
                    this.tableList.push(res)
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
      this.getData()
    },
    // 行内点击
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      if (this.selectionData[0] === undefined) {
        this.rights = false
      } else {
        this.rights = true
      }
      this.$delete(this.selectionData, 1)
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 获取用户列表
    getUserList(deptId) {
      // 人员添加公司Id  添加状态  添加岗位
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
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.sysUserList.push(item)
              this.sysUser = this.sysUserList
            }
          })
        }
      })
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
          width: 52%;
        }
        .right{
          width: 45%;
        }
      }
    }
    .rights {
      height: 35px;
      line-height: 35px;
      padding-left: 8px;
      background-color: #1abc9c;
      .itemfont {
        font-size: 12px;
      }
    }
    ::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
      height: 100%;
    }
  </style>
