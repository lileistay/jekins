<template>
  <!--点击四个字的子组件表头 全院报表分析表头数据 表头点击 四字跳转-->
  <cellTable
    ref="cellTable"
    :prop-data="propData"
    :list-data="tableDatalist"
    :heights="610"
    :summary="false"
    :cell-merge="cellMerge"
    :cell-name="cellnaem"
    :cell-back="cellBack"
  />
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTablesthrees'
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
      list: [],
      cellMerge: [0,1,2],
      cellnaem: 'queryName',
      cellBack: 'queryName2,合计,#666,#eee',
      propData: [
        {
          prop: 'queryName',
          label: '科室'
        },
        {
          prop: 'queryName2',
          label: '科室'
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
        startTime: this.form.timeData[0],
        endTime: this.form.timeData[1],
        orderType:''
      }
      if (this.form.type === '1') {
        data.orderType='media'
      }else if (this.form.type === '6'){
        data.orderType='area'
      }
     let lietmm = []
      this.$api.product.getWholeHospitalAnalysisList(data).then(res => {
        if (res) {
          res.data.resultCollect.forEach(item=>{
            if (item.resultCollect){
              item.resultCollect.forEach(mm=>{
                if (mm.resultCollect){
                  mm.queryName1=item.queryName
                  mm.queryId1=item.queryId
                  mm.resultCollect.forEach(val=>{
                    val.queryName2=mm.queryName
                    val.queryId2=mm.queryId
                    val.queryName=mm.queryName1
                    val.queryId=mm.queryId1
                    lietmm.push(val)
                  })
                }
              })
            }
          })
          this.tableData = lietmm
          if (res.data.queryName=='总合计'){
            res.data.resultCollect.forEach(item=>{
              item.queryName = res.data.queryName
              item.queryName2 = res.data.queryName
            })

            this.tableData = res.data.resultCollect
          }
          console.log(this.tableData ,'this.tableData this.tableData ')
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
