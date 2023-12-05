<template>
  <!-- 收银交接单 -->
  <el-scrollbar>
    <div>
      <sg-table
        size="mini"
        border
        :pagination="pagination"
        selection
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
        :header-style="{backgroundColor:'#1abc9c'}"
        @size-change=" sizeChange"
        @current-change="change"
        @selection-change="handleSelectionChange"
        :cell-class-name="cellClassName"
      >
        <!--搜索框 -->
        <div slot="searchBar" class="searchBar">
          <div>
            <el-form size="mini" :inline="true" label-width="100px" style="height:100%">
              <el-form-item label="收银员:">
                <el-select v-model="form.cashier" filterable placeholder="请选择" clearable :filter-method="cashierFilter">
                  <el-option
                    v-for="item in Cashier"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="结账时间:">
                <el-date-picker
                  v-model="form.createTime"
                  style="width: 180px"
                  clearable
                  placeholder="选择日期"
                  type="datetime"
                />至
                <el-date-picker
                  v-model="form.endcreateTime"
                  style="width: 180px"
                  clearable
                  placeholder="选择日期"
                  type="datetime"
                />
<!--                <el-date-picker-->
<!--                  v-model="dataTime" class="inputWidth"-->
<!--                  type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"-->
<!--                  value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"-->
<!--                  :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 190px" />-->
              </el-form-item>
              <el-form-item>
                <el-checkbox-group v-model="form.isAll">
                  <el-checkbox label="是否打印所有结账方式" name="type" />
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="margin-bottom: 13px">
            <el-button
              icon="el-icon-search"
              size="mini"
              type="primary"
              style="margin-right:3px"
              @click.stop.native="getData(true)"
              @keydown.enter.native="getData(true)"
            >查询</el-button>
          </div>
        </div>
        <!-- ----------------- 按钮  ------------------ -->
        <div slot="header" style="width: 100%;">
          <p style="float: left" class="kaidan">实收金额合计: {{ totals }} 退款笔数合计：{{ debtorNumer }} 退款金额合计：{{ totalArrears }}</p>
          <el-button
            size="mini"
            plain
            style="float: right;margin-left: 10px"
            type="primary"
            icon="el-icon-bank-card"
            @click="payMethodPrint"
          >结账方式汇总打印</el-button>
          <el-button
            size="mini"
            plain
            style="float: right;"
            type="primary"
            icon="el-icon-bank-card"
            @click="chargeTypePrint"
          >收费类型打印</el-button>
          <el-button
            size="mini"
            plain
            type="primary"
            style="float: right;"
            @click="AdvancePayment"
          >打印</el-button>
        </div>
        <template #custom="data">
          <div v-if="data.props==='customSex'">
            <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
          </div>
        </template>
      </sg-table>
      <vue-easy-print ref="payMethodPrint">
        <pay-method-print :print="payMethodData" :message="newmessage" :details="payMethodTableData" :one-page-row="onePageRow" />
      </vue-easy-print>
      <vue-easy-print ref="handoverPrint">
        <handoverPrint
          :print="print"
          :message="newmessage"
          :details="tableList"
        />
      </vue-easy-print>
      <vue-easy-print ref="chargeTypePrint">
        <charge-type-print :print="print" :message="newmessage" :details="details" />
      </vue-easy-print>
    </div>
  </el-scrollbar>
</template>

<script>
import vueEasyPrint from 'vue-easy-print'
import payMethodPrint from '@/components/Print/payMethodPrint'
import chargeTypePrint from '@/components/Print/chargeTypePrint'
import handoverPrint from '@/components/Print/handoverPrint'
import SgTable from '@/components/Table'
import { math } from '@/utils/math'
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
} from "@/utils/time";
export default {
  dicts: ['whether_Newguest'],
  components: { SgTable, vueEasyPrint, handoverPrint, payMethodPrint, chargeTypePrint },
  data() {
    return {
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
      selectionData: [], // 选择的数据
      dataTime:[this.getNowTime(),this.getNowTimes() ],
      newmessage:"",
      form: {
        cashier: '', // 收银员
        isAll: 1, // 结账方式
        createTime: this.getNowTime(), // 开始接待时间
        endcreateTime: this.getNowTimes() // 结束接待时间
      },
      debtorNumer: 0, // 退款笔数合计
      totals: 0, // 实收金额合计
      totalArrears: 0, // 退款金额合计
      tableData: [
        { cashierName: '123', payName: '支付', paymentAmount: '123', settlementAmount: 0.00 }
      ],
      // 打印
      print: {},
      tableList: [],
      Summary: 0,
      details: [],
      Cashier: [],
      Cashierlist: [],
      // 表头
      columns: [
        {
          lab: '收银员',
          val: 'cashierName'
          // width: 150
        },
        {
          lab: '结账方式',
          val: 'payName'
          // custom: 'receptionStatus'
        },
        {
          lab: '结账金额',
          val: 'settlementAmount'
        },
        {
          lab: '实收金额',
          val: 'paymentAmount'
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      payMethodData: {},
      onePageRow: 25,
      payMethodTableData: []
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
      this.getData();
      this.getUserList(this.deptId);
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData() // 页面加载显示数据
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
    newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
    cashierFilter(val) {
      if (val) {
        this.Cashier = this.Cashierlist.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.Cashier = this.Cashierlist
      }
    },
    /**
     * @author Nevin
     * @date 2022/9/1
     * @Description: 收费类型打印
    */
    chargeTypePrint() {
      if (this.form.createTime === null || this.form.endcreateTime === null) {
        this.$message('开始时间和结束时间不能为空')
        return
      }
      var timee = ''
      if (this.form.createTime === null) {
        timee = null
      } else {
        const cTime = new Date(this.form.createTime)
        const year = cTime.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = cTime.getMonth() + 1 < 10 ? '0' + (cTime.getMonth() + 1) : cTime.getMonth() + 1
        var day = cTime.getDate() < 10 ? '0' + cTime.getDate() : cTime.getDate()
        var hours = cTime.getHours() < 10 ? '0' + cTime.getHours() : cTime.getHours()
        var minutes = cTime.getMinutes() < 10 ? '0' + cTime.getMinutes() : cTime.getMinutes()
        var seconds = cTime.getSeconds() < 10 ? '0' + cTime.getSeconds() : cTime.getSeconds()
        // 拼接
        timee = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
      var endtime = {}
      if (this.form.endcreateTime === null) {
        endtime = null
      } else {
        // end
        const endTime = new Date(this.form.endcreateTime)
        const years = endTime.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var months = endTime.getMonth() + 1 < 10 ? '0' + (endTime.getMonth() + 1) : endTime.getMonth() + 1
        var days = endTime.getDate() < 10 ? '0' + endTime.getDate() : endTime.getDate()
        var hourss = endTime.getHours() < 10 ? '0' + endTime.getHours() : endTime.getHours()
        var minutess = endTime.getMinutes() < 10 ? '0' + endTime.getMinutes() : endTime.getMinutes()
        var secondss = endTime.getSeconds() < 10 ? '0' + endTime.getSeconds() : endTime.getSeconds()
        // 拼接
        endtime = years + '-' + months + '-' + days + ' ' + hourss + ':' + minutess + ':' + secondss
      }
      if (this.form.isAll === true) {
        var all = 0
      } else {
        all = 1
      }
      var datacharge = {
        cashier: this.form.cashier,
        isAll: all,
        deptId: this.deptId,
        createTime: timee,
        endcreateTime: endtime
      }
      this.$api.finance.chargeTypeStatistics(datacharge).then(res => {
        if (res) {
          this.details = res.rows
          this.print = {
            createTime: timee,
            endcreateTime: endtime
          }
          let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
          let newstr=str.split('<')[0]
          this.newmessage=newstr;
          this.$nextTick(() => {
            this.$refs.chargeTypePrint.print()
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/9/1
     * @Description: 结账方式汇总打印
    */
    payMethodPrint() {
      if (this.form.createTime === null || this.form.endcreateTime === null) {
        this.$message('开始时间和结束时间不能为空')
        return
      }
      var timee = ''
      if (this.form.createTime === null) {
        timee = ''
      } else {
        const cTime = new Date(this.form.createTime)
        const year = cTime.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = cTime.getMonth() + 1 < 10 ? '0' + (cTime.getMonth() + 1) : cTime.getMonth() + 1
        var day = cTime.getDate() < 10 ? '0' + cTime.getDate() : cTime.getDate()
        var hours = cTime.getHours() < 10 ? '0' + cTime.getHours() : cTime.getHours()
        var minutes = cTime.getMinutes() < 10 ? '0' + cTime.getMinutes() : cTime.getMinutes()
        var seconds = cTime.getSeconds() < 10 ? '0' + cTime.getSeconds() : cTime.getSeconds()
        // 拼接
        timee = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
      var endtime = {}
      if (this.form.endcreateTime === null) {
        endtime = ''
      } else {
        // end
        const endTime = new Date(this.form.endcreateTime)
        const years = endTime.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var months = endTime.getMonth() + 1 < 10 ? '0' + (endTime.getMonth() + 1) : endTime.getMonth() + 1
        var days = endTime.getDate() < 10 ? '0' + endTime.getDate() : endTime.getDate()
        var hourss = endTime.getHours() < 10 ? '0' + endTime.getHours() : endTime.getHours()
        var minutess = endTime.getMinutes() < 10 ? '0' + endTime.getMinutes() : endTime.getMinutes()
        var secondss = endTime.getSeconds() < 10 ? '0' + endTime.getSeconds() : endTime.getSeconds()
        // 拼接
        endtime = years + '-' + months + '-' + days + ' ' + hourss + ':' + minutess + ':' + secondss
      }
      if (this.form.isAll === true) {
        var all = 0
      } else {
        all = 1
      }
      var datacashier = {
        cashier: this.form.cashier,
        isAll: all,
        deptId: this.deptId,
        createTime: timee,
        endcreateTime: endtime
      }
      this.$api.finance.cashierHandover(datacashier).then(res => {
        if (res) {
          this.payMethodTableData = res.rows
          this.payMethodData = {
            debtorNumer: res.data.debtorNumer,
            totalArrears: res.data.totalArrears === undefined ? 0 : res.data.totalArrears,
            createTime: timee,
            endcreateTime: endtime
          }
          let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
          let newstr=str.split('<')[0]
          this.newmessage=newstr;
          this.$nextTick(() => {
            this.$refs.payMethodPrint.print()
          })
        }
      })
    },
    // 打印
    AdvancePayment() {
      if (this.form.createTime === null || this.form.endcreateTime === null) {
        this.$message('开始时间和结束时间不能为空')
        return
      }
      var timee = ''
      if (this.form.createTime === null) {
        timee = ''
      } else {
        const cTime = new Date(this.form.createTime)
        const year = cTime.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = cTime.getMonth() + 1 < 10 ? '0' + (cTime.getMonth() + 1) : cTime.getMonth() + 1
        var day = cTime.getDate() < 10 ? '0' + cTime.getDate() : cTime.getDate()
        var hours = cTime.getHours() < 10 ? '0' + cTime.getHours() : cTime.getHours()
        var minutes = cTime.getMinutes() < 10 ? '0' + cTime.getMinutes() : cTime.getMinutes()
        var seconds = cTime.getSeconds() < 10 ? '0' + cTime.getSeconds() : cTime.getSeconds()
        // 拼接
        timee = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
      var endtime = {}
      if (this.form.endcreateTime === null) {
        endtime = ''
      } else {
      // end
        const endTime = new Date(this.form.endcreateTime)
        const years = endTime.getFullYear()
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var months = endTime.getMonth() + 1 < 10 ? '0' + (endTime.getMonth() + 1) : endTime.getMonth() + 1
        var days = endTime.getDate() < 10 ? '0' + endTime.getDate() : endTime.getDate()
        var hourss = endTime.getHours() < 10 ? '0' + endTime.getHours() : endTime.getHours()
        var minutess = endTime.getMinutes() < 10 ? '0' + endTime.getMinutes() : endTime.getMinutes()
        var secondss = endTime.getSeconds() < 10 ? '0' + endTime.getSeconds() : endTime.getSeconds()
        // 拼接
        endtime = years + '-' + months + '-' + days + ' ' + hourss + ':' + minutess + ':' + secondss
      }
      if (this.form.isAll === true) {
        var all = 0
      } else {
        all = 1
      }
      var datadover = {
        cashier: this.form.cashier,
        isAll: all,
        deptId: this.deptId,
        createTime: timee,
        endcreateTime: endtime
      }
      this.$api.finance.cashierHandover(datadover).then(res => {
        if (res) {
          this.tableList = res.rows
          this.print = {
            refundnum: res.data.debtorNumer, // 退款笔数
            refundmuch: res.data.totalArrears === undefined ? 0 : res.data.totalArrears, // 退款金额
            createTime: timee,
            endcreateTime: endtime
          }
          let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
          let newstr=str.split('<')[0]
          this.newmessage=newstr;
          this.$nextTick(() => {
            this.$refs.handoverPrint.print()
          })
        }
      })
    },
    getNowTime() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      var hour = '00:00:00'
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date} ${hour}`
      return defaultDate
      // this.$set(this.form, "createTime", defaultDate)
      // this.$set(this.form, "endcreateTime", defaultDate)
    },
    getNowTimes() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      var hour = '23:59:59'
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date} ${hour}`
      return defaultDate
      // this.$set(this.form, "createTime", defaultDate)
      // this.$set(this.form, "endcreateTime", defaultDate)
    },
    // 获取列表数据
    getData(isSearch) {
      if (this.form.isAll === true) {
        var all = 0
      } else {
        all = 1
      }
      var date = {
        deptId: this.deptId,
        cashier: this.form.cashier,

        isAll: all,
        createTime:this.form.createTime!==null?this.newgetData(this.form.createTime):"",
        endcreateTime: this.form.endcreateTime!==null?this.newgetData(this.form.endcreateTime):""
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      // this.$set(date, 'deptId', this.deptId)
      date = Object.assign(date, this.pagination)
      this.$api.finance.cashierHandover(date).then(res => {
        if (res) {
          // console.log('res', res.data.total)
          this.debtorNumer = res.data.debtorNumer
          this.totals = res.data.total === undefined ? 0 : res.data.total
          this.totalArrears = res.data.totalArrears === undefined ? 0 : res.data.totalArrears
          // -------
          this.tableData = res.rows
          let hui = 0
          res.rows.forEach(res => {
            hui = math.add(hui, res.paymentAmount)
          })
          this.Summary = hui
          this.pagination.total = res.total
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
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    /**
      * @author 李尚
      * @date 2022/8/23
      * @Description: 获取用户列表
    */
    getUserList(deptId) {
      const dataList = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(dataList).then(res => {
        if (res) {
          this.Cashier=[]
          if(res.data.length==0){
           return
          }
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // this.Cashier = res.data
          // ------------
          res.data.forEach(item => {
            if (item.postCode === 'cashier') {
              this.Cashier.push(item)
              this.Cashierlist.push(item)
            }
          }) // 助理
        }
      })
    }
  }

}
</script>

<style lang='scss' scoped>
.searchBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 5px 20px !important;
}

.el-row .el-col {
  height: 100% !important;
  .el-form-item {
    margin: 0 !important;
  }
}

.kaidan {
  padding-top: 5px;
  font-size: 14px;
  color: #fff;
}
</style>
