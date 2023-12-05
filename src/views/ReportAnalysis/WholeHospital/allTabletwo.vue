<template>
  <!--第一个表 两个字的 复杂表身 汇总-->
  <cellTable
    ref="cellTable"
    :prop-data="propData"
    :list-data="tableDatalist"
    :heights="0"
    :summary="false"
    :cell-merge="cellMerge"
    :cell-name="cellnaem"
    :cell-back="cellBack"
  >
    <template #custom="data">
      <div v-if="data.props === 'columnName'">
        <a style="color: #3aa1ff;cursor: pointer;" @click="clium(data.custom)">{{ data.custom.columnName }}</a>
      </div>
    </template>
  </cellTable>
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTable'
export default {
  name: 'AllTabletwo',
  components: {
    cellTable
  },
  props: ['form'],
  data() {
    return {
      tableDatalist: [],
      tableData: [],
      list: [],
      cellMerge: [0],
      hosAll: 0, // 来院占比合计 计算
      turnAll: 0, // 来院量占比 计算
      sactionAll: 0, // 成交额占比 计算
      cellnaem: 'columnName',
      cellBack: 'rowName,合计,#666,#eee',
      propData: [
        {
          prop: 'columnName',
          custom: 'columnName',
          label: '科室'
        },
        {
          prop: 'rowName',
          label: '新老客'
        },
        {
          prop: 'hospitalVisits',
          label: '门诊量'
        },
        {
          prop: 'turnover',
          label: '成交量'
        },
        {
          prop: 'hospTion',
          label: '成交率'
        },
        {
          prop: 'transactionAmount',
          label: '成交金额'
        },
        {
          prop: 'consumption',
          label: '人均消费额'
        },
        {
          prop: 'outpatient',
          label: '门诊量占比'
        },
        {
          prop: 'turnoverTion',
          label: '成交量占比'
        },
        {
          prop: 'transactionAmountTion',
          label: '成交金额占比'
        },
        {
          prop: 'datcome',
          label: '日来院量'
        },
        {
          prop: 'dayC',
          label: '日成交量'
        },
        {
          prop: 'daymony',
          label: '日成交额'
        }
      ]
    }
  },
  watch: {
    form() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      var data = {
        deptId: this.form.deptId,
        endTime: this.form.timeData[1],
        startTime: this.form.timeData[0]
      }
      this.$api.product.reportCenter(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.transactionAmount = item.transactionAmount.toFixed(2)
            // 成交率 hospTion
            if (item.hospitalVisits !== 0 & item.turnover !== 0) {
              item.hospTion = math.multiply(math.divide(item.turnover, item.hospitalVisits).toFixed(2), 100) + '%'
            } else {
              item.hospTion = 0
            }
            // 人均消费额
            if (item.transactionAmount !== 0 & item.turnover !== 0) {
              item.consumption = math.divide(item.transactionAmount, item.turnover).toFixed(2)
            } else {
              item.consumption = 0
            }
            // 门诊量占比 outpatient
            if (item.comeHopAuxiliary !== 0 && item.hospitalVisits !== 0) {
              item.outpatient = math.multiply(math.divide(item.hospitalVisits, item.comeHopAuxiliary).toFixed(2), 100) + '%'
            } else {
              item.outpatient = 0
            }
            // 成交量占比
            if (item.turnoverAuxiliary !== 0 && item.turnover !== 0) {
              item.turnoverTion = math.multiply(math.divide(item.turnover, item.turnoverAuxiliary).toFixed(2), 100) + '%'
            } else {
              item.turnoverTion = 0
            }
            // 成交金额占比
            if (item.tamAuxiliary !== 0 && item.transactionAmount !== 0) {
              item.transactionAmountTion = math.multiply(math.divide(item.transactionAmount, item.tamAuxiliary).toFixed(2), 100) + '%'
            } else {
              item.transactionAmountTion = 0
            }
            // 日来院量
            if (item.dayNum !== 0 && item.hospitalVisits !== 0) {
              item.datcome = math.divide(item.dayNum, item.hospitalVisits).toFixed(2)
            } else {
              item.datcome = 0
            }
            // 日成交量
            if (item.dayNum !== 0 && item.turnover !== 0) {
              item.dayC = math.divide(item.dayNum, item.turnover).toFixed(2)
            } else {
              item.dayC = 0
            }
            // 日成交额
            if (item.dayNum !== 0 && item.transactionAmount !== 0) {
              item.daymony = math.divide(item.transactionAmount, item.dayNum).toFixed(2)
            } else {
              item.daymony = 0
            }
          })
          this.list = res.data.sum
          this.list.forEach(item => {
            // 成交率 hospTion
            if (item.hospitalVisits !== 0 & item.turnover !== 0) {
              item.hospTion = math.multiply(math.divide(item.turnover, item.hospitalVisits).toFixed(2), 100) + '%'
            } else {
              item.hospTion = 0
            }
            // 人均消费额
            if (item.transactionAmount !== 0 & item.turnover !== 0) {
              item.consumption = math.divide(item.transactionAmount, item.turnover).toFixed(2)
            } else {
              item.consumption = 0
            }
            // 门诊量占比 outpatient
            if (item.comeHopAuxiliary !== 0 && item.hospitalVisits !== 0) {
              item.outpatient = math.multiply(math.divide(item.hospitalVisits, item.comeHopAuxiliary).toFixed(2), 100) + '%'
            } else {
              item.outpatient = 0
            }
            // 成交量占比
            if (item.turnoverAuxiliary !== 0 && item.turnover !== 0) {
              item.turnoverTion = math.multiply(math.divide(item.turnover, item.turnoverAuxiliary).toFixed(2), 100) + '%'
            } else {
              item.turnoverTion = 0
            }
            // 成交金额占比
            if (item.tamAuxiliary !== 0 && item.transactionAmount !== 0) {
              item.transactionAmountTion = math.multiply(math.divide(item.transactionAmount, item.tamAuxiliary).toFixed(2), 100) + '%'
            } else {
              item.transactionAmountTion = 0
            }
            // 日来院量
            if (item.dayNum !== 0 && item.hospitalVisits !== 0) {
              item.datcome = math.divide(item.dayNum, item.hospitalVisits).toFixed(2)
            } else {
              item.datcome = 0
            }
            // 日成交量
            if (item.dayNum !== 0 && item.turnover !== 0) {
              item.dayC = math.divide(item.dayNum, item.turnover).toFixed(2)
            } else {
              item.dayC = 0
            }
            // 日成交额
            if (item.dayNum !== 0 && item.transactionAmount !== 0) {
              item.daymony = math.divide(item.transactionAmount, item.dayNum).toFixed(2)
            } else {
              item.daymony = 0
            }
          })
          this.tableData = res.rows
          this.getData()
        }
      })
    },
    // 表头列
    clium(val) {
      if (val.columnName !== '合计') {
        this.$set(val, 'deptId', this.form.deptId)
        this.$set(val, 'timeData', this.form.timeData)
        this.$router.push({ path: 'columnTable', query: { item: val }})
      }
    },
    getData() {
      var map = {}
      var dest = []
      // this.tableData后端返回的数据
      for (var i = 0; i < this.tableData.length; i++) {
        var ai = this.tableData[i]
        if (!map[ai.departmentId]) {
          dest.push({
            departmentId: ai.departmentId,
            data: [ai]
          })
          map[ai.departmentId] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.departmentId === ai.departmentId) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
      var arr = []
      dest.forEach(v => {
        v.data.forEach(c => {
          arr.push(c)
        })
      })
      this.tableDatalist = arr
      this.list.forEach(item => {
        this.tableDatalist.push({
          columnName: '合计',
          hospTion: item.hospTion,
          consumption: item.consumption,
          outpatient: item.outpatient,
          turnoverTion: item.turnoverTion,
          transactionAmountTion: item.transactionAmountTion,
          daymony: item.daymony,
          dayC: item.dayC,
          datcome: item.datcome,
          comeHopAuxiliary: item.comeHopAuxiliary,
          dayNum: item.dayNum,
          departmentId: item.departmentId,
          hospitalVisits: item.hospitalVisits,
          rowName: item.rowName,
          tamAuxiliary: item.tamAuxiliary,
          transactionAmount: item.transactionAmount,
          turnover: item.turnover,
          turnoverAuxiliary: item.turnoverAuxiliary
        })
      })
      this.$refs.cellTable.queryData()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
