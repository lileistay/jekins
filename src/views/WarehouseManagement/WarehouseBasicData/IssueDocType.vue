<template>
  <!--出库单类型-->
  <div class="box">
    <sg-table
      size="mini"
      index="序号"
      border
      stripe
      :pagination="pagination"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#1abc9c'}"
      @size-change=" sizeChange"
      @current-change="change"
    >
      <div slot="searchBar" class="header-float">
        <div style="margin-top: 12px">
          <el-form :inline="true" size="mini" label-width="120px">
            <el-form-item label="库房：">
              <el-select v-model="form.whouseId" filterable clearable>
                <el-option
                  v-for="(item, index) in RoomList"
                  :key="index"
                  :label="item.whouseName"
                  :value="item.whouseId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出库日期：">
<!--              <el-date-picker-->
<!--                v-model="form.executeDate"-->
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
                v-model="form.executeDate" class="inputWidth"
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
          <span>进价汇总：{{ Summary|numberToCurrency }}</span>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'documentType'">
          <show-dict-data :options="dict.type.document_type" :value="data.custom.documentType" />
        </div>
      </template>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import { math } from '@/utils/math'
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
  dicts: ['document_type'],
  components: {
    SgTable
  },
  data() {
    return {
      Summary: 0,
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
      form: {
        whouseId: '',
        executeDate: todayTime()
      },
      tableData: [],
      RoomList: [],
      columns: [
        {
          lab: '出库单类型',
          val: 'documentType',
          custom: 'documentType'
        },
        {
          lab: '库房',
          val: 'whouseName'
        },
        {
          lab: '张数',
          val: 'zhangshu'
        },
        {
          lab: '进价金额',
          val: 'materialRrice'
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
    this.getUserList()
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
      var data = {
        params: {
          beginexecuteDate: this.form.executeDate === null ? null : this.form.executeDate[0],
          endexecuteDate: this.form.executeDate === null ? null : this.form.executeDate[1]
        },
        whouseId: this.form.whouseId,
        deptId: this.deptId
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.selectOutinfoTypeLsit(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.Summary = res.data
        }
      })
    }, 500),
    getUserList() {
      // 库房
      this.$api.storageRoom.wpartmentList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.RoomList = res.rows
        }
      })
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
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
