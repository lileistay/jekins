<template>
  <!--采购供应商明细查询-->
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
      <div slot="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="3">
              <el-form-item label="单号：">
                <el-input v-model="form.inDocumentNo" clearable />
              </el-form-item>
              <el-form-item label="物资类型：">
                <el-cascader
                  v-model="form.matTypeIds"
                  :options="options"
                  :props="{label:'name',value:'id',children:'sonList',multiple: true}"
                  filterable
                  :show-all-levels="false"
                  expand-trigger="hover"
                  class="w100_pidR30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="执行人：">
                <el-select v-model="form.executeUserId" :filter-method="executeFilter" filterable clearable @change="$forceUpdate()">
                  <el-option
                    v-for="(item, index) in esthetics"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="库房单据类型：">
                <el-select v-model="form.documentType" filterable clearable>
                  <el-option label="正常入库单" value="1" />
                  <el-option label="退供应商" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="供应商：">
                <el-select v-model="form.supplierNo" filterable clearable>
                  <el-option
                    v-for="(item, index) in supplier"
                    :key="index"
                    :label="item.companyName"
                    :value="item.supplierNo"
                  />
                </el-select>
              </el-form-item>
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
            </el-col>
            <el-col :span="4">
              <el-form-item label="退料数量：">
                <el-input v-model="form.beginreturnNumber" style="width: 45%" clearable />-
                <el-input v-model="form.endreturnNumber" style="width: 45%" clearable />
              </el-form-item>
              <el-form-item label="进货数量：">
                <el-input v-model="form.begininsertNumber" style="width: 45%" clearable />-
                <el-input v-model="form.endinsertNumber" style="width: 45%" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="执行日期：">
<!--                <el-date-picker-->
<!--                  v-model="form.executeDate"-->
<!--                  style="width: 200px"-->
<!--                  clearable-->
<!--                  type="datetimerange"-->
<!--                  format="yyyy-MM-dd HH:mm:ss"-->
<!--                  value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                  start-placeholder="开始日期"-->
<!--                  end-placeholder="结束日期"-->
<!--                  :default-time="['00:00:00', '23:59:59']"-->
<!--                />-->
                <el-date-picker
                  v-model="form.executeDate" class="inputWidth"
                  type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                  :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
              </el-form-item>
              <el-form-item label="物资名称：">
                <el-input v-model="form.materialName" clearable style="width: 120px;" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="简码：">
                <el-input v-model="form.shortCode" clearable />
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click="getData(true)">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>库存明细列表</span>
          <span>入库金额汇总：{{ Summary.materialPrice|numberToCurrency }}</span>
          <span>退供应商金额汇总：{{ Summary.returnAmount|numberToCurrency }}</span>
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
import PinyinMatch from 'pinyin-match'
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
      options: [],
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
      Summary: {
        materialPrice: 0, // 入库金额汇总
        returnAmount: 0 // 退供应商金额汇总
      },
      form: {
        executeDate: todayTime(), // 执行时间
        // executeDate:getDate(),
        begininsertNumber: null,
        endinsertNumber: null,
        beginreturnNumber: null,
        endreturnNumber: null,
        materialName: '', // 物资名称
        inDocumentNo: '', // 单号
        matTypeIds: [], // 物资类型
        executeUserId: '', // 执行人
        whouseId: '', // 库房
        supplierNo: '', // 供应商
        shortCode: '' // 简码
      },
      RoomList: [], // 库房
      supplier: [], // 供应商
      esthetics: [], // 执行人
      estheticsList: [],
      tableData: [],
      columns: [
        {
          lab: '单号',
          val: 'inDocumentNo',
          width: 140
        },
        {
          lab: '执行人',
          val: 'executeUserName',
          width: 120
        },
        {
          lab: '执行日期',
          val: 'executeDate',
          width: 140
        },
        {
          lab: '供应商',
          val: 'companyName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '库房',
          val: 'whouseName',
          width: 120
        },
        {
          lab: '单据类型',
          val: 'documentType',
          custom: 'documentType',
          width: 120
        },
        {
          lab: '简码',
          val: 'shortCode'
        },
        {
          lab: '物资类型',
          val: 'matTypeName'
        },
        {
          lab: '物资编码',
          val: 'materialCode'
        },
        {
          lab: '物资名称',
          val: 'materialName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '规格',
          val: 'materialSpec'
        },
        {
          lab: '物资单位',
          val: 'unitName'
        },
        {
          lab: '入库数量',
          val: 'insertNumber'
        },
        {
          lab: '进价单价',
          val: 'purchasePrice'
        },
        {
          lab: '总额',
          val: 'materialPrice'
        },
        {
          lab: '售价',
          val: 'drugPriceOne'
        },
        {
          lab: '批次号',
          val: 'inBatchNumber',
          width: 140
        },
        {
          lab: '注册证号',
          val: 'certificateNo',
          width: 140
        },
        {
          lab: '生产批次号',
          val: 'productionBatch',
          width: 140
        },
        {
          lab: '产地',
          val: 'place'
        },
        {
          lab: '备注',
          val: 'remark'
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
    },
    userId: {
      get() {
        return this.$store.getters.user.userId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getData()
      this.getTree()
      this.getUserList()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getTree()
    this.getUserList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
    // console.log(this.form.executeDate,'hjasjd`1')
    // this.form.executeDate=this.getDate()
  },
  methods: {
    getDate() {
      var date = new Date() // 获取时间
      var year = date.getFullYear() // 获取年
      var month = date.getMonth() + 1 // 获取月
      var strDate = date.getDate() // 获取日
      const newmonth = month < 10 ? '0' + month : month
      return year + '-' + newmonth + '-' + strDate
    },
    executeFilter(val) {
      if (val) {
        this.esthetics = this.estheticsList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.esthetics = this.estheticsList
      }
    },
    getData: debounce(async function(isSearch) {
      console.log('executeDate', this.form.executeDate)
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const arr = []
      this.form.matTypeIds.forEach(res => {
        arr.push(res[res.length - 1])
      })
      console.log(this.form.executeDate, 'dsaghudsagdgas')
      var date = {
        deptId: this.deptId,
        executeUserId: this.form.executeUserId, // 执行人
        inDocumentNo: this.form.inDocumentNo, // 单号
        documentType: this.form.documentType, // 库房单据类型
        whouseId: this.form.whouseId, // 库房
        supplierNo: this.form.supplierNo, // 供应商
        shortCode: this.form.shortCode, // 简码
        materialName: this.form.materialName, // 物资名称
        beginexecuteDate: this.form.executeDate == null ? '' : this.form.executeDate[0], // 执行日期
        endexecuteDate: this.form.executeDate == null ? '' : this.form.executeDate[1],
        begininsertNumber: this.form.begininsertNumber, // 进货数量
        endinsertNumber: this.form.endinsertNumber,
        beginreturnNumber: this.form.beginreturnNumber, // 退货数量
        endreturnNumber: this.form.endreturnNumber,
        matTypeIds: this.form.matTypeIds.length === 0 ? [] : arr.join(',')
      }

      date = Object.assign(date, this.pagination)
      this.tableData = []
      await this.$api.storageRoom.selectSupplierDetailedLsit(date).then(res => {
        if (res) {
          this.tableData = res.rows
          if (res.data !== null) {
            this.Summary = res.data
          }

          this.pagination.total = res.total
        }
      })
    }, 500),
    getTree() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          this.options = res.data
        }
      })
    },
    async getUserList() {
      // 库房
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      await this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          this.RoomList = res.data
        }
      })
      // 供应商
      await this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
      // 执行人
      await this.$api.user.getUserList({ deptId: this.deptId, status: '0' }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.esthetics = arr1
          this.estheticsList = this.esthetics
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
    }
  }
}
</script>

<style scoped lang="scss">
.box{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header {
  width: 100%;
  & span {
    font-size: 14px;
    margin-right: 10px;
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 10px;
  /* margin-right: 10px; */
  /* right: 10px; */
}
.el-cascader-node__label{
  margin-left: 10px;
}
/* 这个样式针对IE有用，不考虑IE的可以不用管*/
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
</style>
