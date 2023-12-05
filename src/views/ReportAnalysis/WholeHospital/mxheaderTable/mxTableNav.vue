<template>
  <div>
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
    </cellTable>
  </div>
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTables'
export default {
  name: 'AnalysisNav',
  components: {
    cellTable
  },
  props: ['form'],
  data() {
    return {
      tableDatalist: [],
      tableData: [],
      cellMerge: [0],
      cellnaem: 'queryName',
      cellBack: 'rowName,合计,#666,#eee',
      propData: [
        {
          prop: 'queryName',
          label: '渠道分析'
        },
        {
          prop: 'totalName',
          label: '新老客'
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
          label: '成交金额'
        },
        {
          prop: 'perCapita',
          label: '人均消费额'
        },
        {
          prop: 'hospitalVisitsRatio',
          label: '门诊量占比'
        },
        {
          prop: 'dealVisitsRatio',
          label: '成交量占比'
        },
        {
          prop: 'dealAmountRatio',
          label: '成交金额占比'
        }
      ]
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      var data = {
        deptId: this.form.deptId,
        startTime: this.form.timeData[0],
        endTime: this.form.timeData[1],
        orderType:''
      }
      if (this.form.type === '2') {
        data.orderType='channel'
      }else if (this.form.type === '3'){
        data.orderType='aesthetician'
      }else  if (this.form.type === '4'){
        data.orderType='doctor'
      }
      else if (this.form.type === '5'){
        data.orderType='age'
      }
      else if (this.form.type === '6'){
        data.orderType='area'
      }

      let lietmm = []
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
          if (res.data.queryName=='总合计'){
            res.data.resultCollect.forEach(item=>{
              item.queryName = res.data.queryName
            })
            this.tableData = res.data.resultCollect
          }
          this.getData()
        }
      })
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
      // dest.forEach(item => {
      //   var hospitalVisits = 0
      //   var turnover = 0
      //   var hospTion = 0 // 成交率
      //   var traRate = 0 // 成交金额
      //   var dayTransactionAmount = 0
      //   var columnName = item.data[0].columnName
      //   var departmentId = item.data[0].departmentId
      //   const rowName = '合计'
      //   item.data.forEach(c => {
      //     traRate = math.add(traRate, c.traRate)
      //     hospitalVisits = math.add(hospitalVisits, c.hospitalVisits)
      //     turnover = math.add(turnover, c.turnover)
      //   })
      //   item.data.push({
      //     hospitalVisits: hospitalVisits,
      //     turnover: turnover,
      //     rowName: rowName,
      //     hospTion: hospTion,
      //     traRate: traRate, // 成交金额
      //     departmentId: departmentId,
      //     columnName: columnName,
      //     dayTransactionAmount: dayTransactionAmount
      //   })
      // })
      var arr = []
      dest.forEach(v => {
        v.data.forEach(c => {
          arr.push(c)
        })
      })
      this.tableDatalist = arr
      this.$refs.cellTable.queryData()
    }
  }
}
</script>

<style scoped>

</style>