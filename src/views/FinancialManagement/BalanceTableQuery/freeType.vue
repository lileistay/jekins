<template>
    <!-- 费用类型查询 -->
    <div class="box">
      <div class="header" style="border-bottom: 1px solid #f2f2f2">
        <div>
          <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
            <el-form-item label="费用类型：">
            <el-select v-model="form.aestheticConsultant" filterable clearable >
              <el-option
                v-for="item in newsysUserList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
            <!-- <el-form-item label="预收：">
              <el-input v-model="form.customPhone" clearable />
            </el-form-item>
            <el-form-item label="划扣：">
              <el-input v-model="form.customPhone" clearable />
            </el-form-item> -->
            <el-form-item label="时间">
<!--              <el-date-picker-->
<!--                v-model="form.createTime"-->
<!--                clearable-->
<!--                type="daterange"-->
<!--                format="yyyy-MM-dd"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期"-->
<!--                style="width: 230px"-->
<!--              />-->
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
            id="out-table"
            :sg-ref="'multipleTable'"
            size="mini"
            selection
            border
            index="序号"
            highlight-current-row
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            max-height="640px"
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            @table-current-change="handleCurrentChange"
            :cell-class-name="cellClassName"
          >
            <div slot="searchBar" class="searchBar" style="background-color: #1abc9c">
              <div class="rights">
                <p class="itemfont">费用查询列表</p>
              </div>
              <div class="rights">
                <el-button style="margin-right: 10px" size="mini" @click="newexport">导出</el-button>
              </div>
            </div>
          </sg-table>
        </div>
        <div class="right">
          <div v-if="rights">
            <div style="margin-bottom: 20px">
              <div class="rights">
                <p class="itemfont">预收费用明细</p>
              </div>
              <el-table
                :data="tableList"
                border
                size="mini"
                style="width: 100%"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                max-height="300px"
                :cell-class-name="newcellClassName"
              >
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column prop="orderNumber" width="165" label="收费单编号">
                  <template slot-scope="scope">
                    <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(scope.row)">
                      {{ scope.row.orderNumber }}
                    </a>
                  </template>
                </el-table-column>
                <el-table-column prop="projectName" label="项目名称" />
                <el-table-column prop="customerName" label="姓名" />
                <el-table-column prop="customPhone" label="电话" />
                <el-table-column prop="billType" label="收费单类型">
                  <template slot-scope="scope">
                    <dict-tag :options="dict.type.billing_type" :value="scope.row.billType" />
                  </template>
                </el-table-column>
                <el-table-column prop="thisAmount" label="结账金额" />
                <el-table-column prop="nickName" label="下单人" />
              </el-table>
            </div>
            <div class="rights">
              <p class="itemfont">划扣费用明细</p>
            </div>
            <el-table
              :data="ListData"
              max-height="300px"
              border
              size="mini"
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :cell-class-name="newcellClassNames"
            >
              <el-table-column label="序号" type="index" width="50" />
              <el-table-column prop="orderNumber" width="155" label="收费单编号">
                <template slot-scope="scope">
                  <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(scope.row)">
                    {{ scope.row.orderNumber }}
                  </a>
                </template>
              </el-table-column>
             <el-table-column prop="projectName" label="项目名称" />
              <el-table-column prop="customerName" label="姓名" />
              <el-table-column prop="customPhone" label="电话" />
              <el-table-column prop="billType" label="收费单类型">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.billing_type" :value="scope.row.billType" />
                </template>
              </el-table-column>
              <el-table-column prop="deductionAmount" label="划扣金额" />
              <el-table-column prop="nickName" label="下单人" />
            </el-table>
          </div>
        </div>
      </div>
      <!-- <sg-table
            ref="table"
            id="out-table"
            :sg-ref="'multipleTable'"
            size="mini"
            selection
            border
            index="序号"
            highlight-current-row
            :table-data="newtableData"
            :columns="columns"
            :pagination="pagination"
            max-height="640px"
            stripe
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            @table-current-change="handleCurrentChange"
            style="visibility: hidden;"
          >
            <div slot="searchBar" class="searchBar" style="background-color: #1abc9c">
              <div class="rights">
                <p class="itemfont">收银查询列表</p>
              </div>
              <div class="rights">
                <el-button style="margin-right: 10px" size="mini" @click="newexport">导出</el-button>
              </div>
            </div>
          </sg-table> -->
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
  import PinyinMatch from 'pinyin-match'
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
        sysUserList: [], // 美学顾问
        newsysUserList:[],
        newtableData:[],
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
            lab: '类型名称',
            val: 'expenseTypeName'
          },
          {
            lab: '预收',
            val: 'thisAmount'
          },
          {
            lab: '划扣',
            val: 'deductionAmount'
          },
        //   {
        //     lab: '消费出',
        //     val: 'consumptionOut'
        //   },
        //   {
        //     lab: '退款出',
        //     val: 'refundOut'
        //   },
        //   {
        //     lab: '期末',
        //     val: 'beginPeriod'
        //   },
        //   {
        //     lab: '电话',
        //     val: 'customPhone'
        //   },
        //   {
        //     lab: '美学顾问',
        //     val: 'acName'
        //   }
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
      this.$api.product.expenseList({deptId:this.deptId}).then(res => {
                console.log(res)
                res.rows.forEach(value=>{
                    value.value=value.expenseTypeId
                    value.label=value.expenseTypeName
                })
                 this.newsysUserList=res.rows
            }
      )
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods: {
      newcellClassNames({row,rowIndex}){
        if(rowIndex%2==0){
          return 'normal-row'
        }
      },
      newcellClassName({row,rowIndex}){
        if(rowIndex%2==0){
          return 'normal-row'
        }
      },
      cellClassName({row,rowIndex}){
         if(rowIndex%2==0){
           return 'normal-row'
         }
      },
        newexport(){
            var data = {
          deptId: this.deptId,
          costType:this.form.aestheticConsultant,
          startTime:this.form.createTime ? this.form.createTime[0] : null,
          endTime:this.form.createTime ? this.form.createTime[1] : null
        }
        this.$api.confinementRoom.getExpenseTypeList(data).then(res => {
            this.newtableData=res.rows;
            if(res.rows.length==0){
            this.$message.warning('导出数据为空，请重新筛选')
          }else {
            this.$export('#out-table', '费用类型查询')
          }
        })
        },
      aesFilter(val) {
        if (val) {

        }
      },
      // 编号跳转
      orderNumber(data) {
        this.$router.push({ path: 'billDetails'})
        sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
      },
      getData: debounce(function(isSearch) {
        if (this.form.createTime == null) {
          this.$message('请选择时间')
          return
        }
        var data = {
          deptId: this.deptId,
          costType:this.form.aestheticConsultant,
          startTime:this.form.createTime ? this.form.createTime[0] : null,
          endTime:this.form.createTime ? this.form.createTime[1] : null
        }
        if (isSearch) {
          this.pagination.pageNum = 1
          this.pagination.currentPage = 1
        }
        data = Object.assign(data, this.pagination)

        this.$api.confinementRoom.getExpenseTypeList(data).then(res => {
            this.tableData=res.rows;
            this.pagination.total = res.total
        })
      }),
      // 点击拿到这一行的数据
      async handleCurrentChange(val) {
        this.tableList = []
        this.ListData = []
          var data = {
            deptId: this.deptId,
          costType:val[1].costType,
          startTime:this.form.createTime ? this.form.createTime[0] : null,
          endTime:this.form.createTime ? this.form.createTime[1] : null
          }

        await  this.$api.confinementRoom.getAdvancesReceivedList(data).then(res => {
          if (res) {
            this.tableList=res.rows;
          }
        })
        await  this.$api.confinementRoom.getConsumptionList(data).then(res => {
          if (res) {
            this.ListData=res.rows;
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
