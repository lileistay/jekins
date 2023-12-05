<template>
  <!--盘点查询-->
  <div class="box">
    <sg-table
      size="mini"
      index="序号"
      border
      :pagination="pagination"
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#1abc9c'}"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar" class="header-float">
        <div style="margin-top: 10px">
          <el-form size="mini" label-width="120px">
            <el-form-item label="日期：">
<!--              <el-date-picker-->
<!--                v-model="createTime"-->
<!--                style="width: 100%"-->
<!--                type="datetimerange"-->
<!--                range-separator="至"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期"-->
<!--                format="yyyy-MM-dd HH:mm:ss"-->
<!--                value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                :default-time="['00:00:00', '23:59:59']"-->
<!--              />-->
              <el-date-picker
                v-model="createTime" class="inputWidth"
                type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button type="primary" plain icon="el-icon-search" size="mini" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
        </div>
      </div>
      <div slot="header" class="header">
        <div>
          <span>盘点查询</span>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
// 节流
import { debounce } from '@/utils/throttleAndDebounce'
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
export default {
  name: 'PurchaseReceiptQuery',
  components: {
    SgTable
  },
  data() {
    return {
      createTime: todayTime(), // 日期
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
      tableData: [],
      columns: [
        {
          lab: '库房',
          val: 'whouseName'
        },
        {
          lab: '期初金额',
          val: 'cmaterialPrice'
        },
        {
          lab: '期末金额',
          val: 'mmaterialPrice'
        },
        {
          lab: '盘盈金额',
          val: 'yinventoryLossPrice'
        },
        {
          lab: '盘亏金额',
          val: 'kinventoryLossPrice'
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
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
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      let data = {
        params: {
          begincreateTime: this.createTime === null ? null : this.createTime[0],
          endcreateTime: this.createTime === null ? null : this.createTime[1]
        },
        deptId: this.deptId
      }
      // 正在加载
      this.$api.storageRoom.inventorylistCountQueryList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }, 500),
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.header {
  width: 100%;
  & span {
    font-size: 14px;
  }
}
</style>
