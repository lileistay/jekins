<!--礼品类型·-->
<template>
  <div class="container">
    <sg-table
        ref="table"
        :sg-ref="'multipleTable'"
        :pagination="pagination"
        size="mini"
        selection
        border
        index="序号"
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
        @size-change=" sizeChange"
        @current-change="change"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
    >
      <div slot="searchBar" >
        <div>
          <el-form size="mini" :model="form" label-width="120px"  :inline="true" :show-message="false">
            <el-form-item label="礼品类型：">
              <el-select v-model="form.giftType" style="width: 140px;"  placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in giftTypeList"
                    :key="item.giftTypeId"
                    :label="item.giftTypeName"
                    :value="item.giftTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="礼品名称：">
              <el-select v-model="form.giftName" style="width: 140px;"  placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in giftNameList"
                    :key="item.giftTypeListId"
                    :label="item.giftName"
                    :value="item.giftTypeListId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行时间：">
<!--              <el-date-picker-->
<!--                  style="width: 230px"-->
<!--                  v-model="form.value1"-->
<!--                  type="datetimerange"-->
<!--                  format="yyyy-MM-dd HH:mm:ss"-->
<!--                  value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                  range-separator="至"-->
<!--                  start-placeholder="开始日期"-->
<!--                  end-placeholder="结束日期"-->
<!--                  :default-time="['00:00:00', '23:59:59']">-->
<!--              </el-date-picker>-->
              <el-date-picker
                v-model="form.value1" class="inputWidth"
                type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 190px" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="search" @click.stop="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <template #custom="data">
        <div v-if="data.props === 'outStorage'">
          <div  v-if="data.custom.outStorage < 0">{{-(data.custom.outStorage)}}</div>
           <div  v-if="data.custom.outStorage >= 0">{{data.custom.outStorage}}</div>
        </div>
        <div v-if="data.props === 'exchangeNum'">
          <div  v-if="data.custom.exchangeNum < 0">{{-(data.custom.exchangeNum)}}</div>
          <div  v-if="data.custom.exchangeNum >= 0">{{data.custom.exchangeNum}}</div>
        </div>
      </template>
    </sg-table>
  </div>
</template>
<script>
import SgTable from '@/components/Table'
import {
  timeFmt,
  beforeDayTime,
  todayTime,
  beforeWeek,
  thisWeek,
  lastMonth,
  monthData,
  lastQuarter,
  thisQuarter, lastYear, thisYear
} from '@/utils/time'

export default {
  components: {
    SgTable,
  },
  data(){
    return{
      tableData:[],
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
      columns:[

        {
          lab: '礼品类型',
          val: 'giftTypeName'
        },
        {
          lab: '礼品名称',
          val: 'giftName'
        },{
          lab: '礼品型号',
          val: 'model',
        },
        {
          lab: '单位',
          val: 'unit',
        },
        {
          lab: '期初库存',
          val: 'beginStorage',
        },
        {
          lab: '入库数量',
          val: 'inStorage',
        },
        {
          lab: '退领数量',
          val: 'refundNum',
        },
        {
          lab: '出库数量',
          val: 'outStorage',
          custom:'outStorage'
        },
        {
          lab: '兑换数量',
          val: 'exchangeNum',
          custom:'exchangeNum'
        },
        {
          lab: '期末库存',
          val: 'endStorage',
        },
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      form:{
        // value1:[new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        value1:todayTime()
      },
      selectionData:[],
      giftTypeList:[],
      giftNameList:[],
      userlist:[]
    }
  },
  created() {
    this.getInOutInventoryList()
    this.followUpRecordList()
    this.giftBasicInfo()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.search()
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
      this.getInOutInventoryList()
      this.followUpRecordList()
      this.giftBasicInfo()
    },
  },
  methods:{
    //获取礼品类型列表
    followUpRecordList(){
      const query={
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftTypeInfo(query).then(res => {
        if (res) {
          this.giftTypeList = res.rows
        }
      })
    },
    //获取礼品基本信息列表
    giftBasicInfo(){
      const query={
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftBasicInfo(query).then(res => {
        if (res) {
          this.giftNameList = res.rows
        }
      })
    },
    //搜锁按钮
    search(){
      this.getInOutInventoryList()
    },
    //获取礼品出入库信息
    getInOutInventoryList(){
      const query={
        pageNum:this.pagination.pageNum,
        pageSize:this.pagination.pageSize,
        giftTypeId:this.form.giftType,
        giftTypeListId:this.form.giftName,
        changeTimeStart:this.form.value1?this.form.value1[0]:'',
        changeTimeEnd:this.form.value1?this.form.value1[1]:'',
        executorId:this.form.user,
        deptId:this.deptId
      }
      this.$api.modules.activityManagement.getInOutInventoryLists(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },

    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.getInOutInventoryList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getInOutInventoryList()
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
  }
}
</script>
<style>
.footer{
  margin-top: 10px;
  text-align: right;
}
.header{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>