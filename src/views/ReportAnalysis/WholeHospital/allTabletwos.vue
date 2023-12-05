<template>
  <!--第一个表 两个字的 复杂表身 汇总-->
  <cellTable
    ref="cellTable"
    :prop-data="propData"
    :list-data="tableDatalist"
    :heights="610"
    :summary="false"
    :cell-merge="cellMerge"
    :cell-name="cellnaem"
    :cell-back="cellBack"

  >
    <template #custom="data">

      <div v-if="data.props === 'queryName'">
        <a style="color: #1E64AA;cursor: pointer;text-decoration:underline;" @click="clium(data.custom)">{{ data.custom.queryName }}</a>
      </div>
    </template>
  </cellTable>
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTables'
import {timeFmt} from "../../../utils/time";
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
      cellnaem: 'queryName',
      cellBack: 'rowName,合计,#666,#eee',
      propData: [
        {
          prop: 'queryName',
          custom: 'queryName',
          label: '科室',
          width: 90

        },
        {
          prop: 'totalName',
          label: '新老客',
          width: 85

        },
        {
          prop: 'hospitalVisits',
          label: '门诊量'
        },
        {
          prop: 'dealVisits',
          label: '成交量'
        },
        {
          prop: 'dealRatio',
          label: '成交率'
        },
        {
          prop: 'dealAmount',
          label: '成交金额',
          width:150
        },
        {
          prop: 'perCapita',
          label: '人均消费额',
          width:110
        },
        {
          prop: 'hospitalVisitsRatio',
          label: '门诊量占比',
          width:110
        },
        {
          prop: 'dealVisitsRatio',
          label: '成交量占比',
          width:110
        },
        {
          prop: 'dealAmountRatio',
          label: '成交金额占比',
          width:110
        },
        {
          prop: 'dayHospitalVisits',
          label: '日来院量',
          width:110
        },
        {
          prop: 'daydealVisits',
          label: '日成交量',

        },
        {
          prop: 'daydealAmount',
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
        endTime: this.form.timeData!=null?timeFmt('YYYY-mm-dd',this.form.timeData[1]):'',
        startTime: this.form.timeData!=null?timeFmt('YYYY-mm-dd',this.form.timeData[0]):''
      }
      let lietmm=[]
      this.$api.product.getWholeHospitalAnalysisList(data).then(res => {
        if (res) {
          res.data.resultCollect.forEach(item=>{
            if (item.resultCollect){
              item.resultCollect.forEach(mm=>{
                mm.queryName=item.queryName
                mm.queryId=item.queryId
                lietmm.push(mm)
              })
            }

          })
          this.tableData = lietmm
          this.getData()
        }
      })
    },
    // 表头列
    clium(val) {
      if (val.queryName !== '合计') {
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
          queryName: '合计',
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
