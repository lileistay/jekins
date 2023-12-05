<template>
  <!---- 科室二级  ------>
  <!--点击科室的第二级页面-->
  <div>
    <div class="header">
      <el-button style="margin-left: 20px" type="danger" plain size="mini" @click="remode">返回</el-button>
      <div>
        <el-form ref="formdept" size="mini" :inline="true" :model="form" label-width="80px">
          <el-form-item>
            <el-date-picker
              v-model="form.timeData"
              type="daterange"
              style="width: 55%;"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="组织" prop="deptId">
            <treeselect v-model="form.deptId" style="width: 190px;" :options="deptOptions" :show-count="true" :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" />
          </el-form-item>
          <el-form-item label="科室" prop="deptId">
            <el-select v-model="form.queryId" filterable placeholder="请选择" @change="getConstructorName">
              <el-option
                v-for="item in depertmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="" @click="searchClick">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div />
    </div>
    <leftTableColun  :form="form"/>
    <cellTable
      ref="cellTable"
      :prop-data="propData"
      :list-data="tableDatalist"
      :heights="610"
      :summary="false"
      :cell-merge="cellMerge"
      :cell-name="cellnaem"
      :cell-back="cellBack"
      :itemName="itemName"
    >
      <template #custom="data">
        <div v-if="data.props === 'queryName'">
          <a style="color: #3aa1ff;cursor: pointer;text-decoration:underline" @click="clium(data.custom)">{{ data.custom.queryName }}</a>
        </div>

      </template>
    </cellTable>
  </div>
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTabletwos'
import leftTableColun from '@/views/ReportAnalysis/WholeHospital/leftTable/leftTableColun'
import Treeselect from "@riophae/vue-treeselect";
import vm from '@/utils/util'
import search from "../../../../layout/components/MenuBar/Search.vue";
export default {
  name: 'LeftTableColun',
  computed: {
    search() {
      return search
    }
  },
  components: {
    Treeselect,
    cellTable,
    leftTableColun
  },
  data() {
    return {
      form: {},
      list: [],
      tableDatalist: [],
      tableData: [],
      cellMerge: [0,1],
      cellnaem: 'queryName',
      cellBack: 'rowName,合计111,#666,#eee',
      propData: [

        {
          prop: 'queryName',
          custom: 'queryName',
          label: '二级分类',
          width: 120
        },

        {
          prop: 'totalName',
          label: '新老客',
          width: 127
        },
        {
          prop: 'hospitalVisits',
          label: '门诊量',
          width: 100
        },
        {
          prop: 'dealVisits',
          label: '成交量',
          width: 100
        },
        {
          prop: 'dealRatio',
          label: '成交率',
          width: 110
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
          width:120
        },
        {
          prop: 'dealVisitsRatio',
          label: '成交量占比',
          width:120
        },
        {
          prop: 'dealAmountRatio',
          label: '成交金额占比',
          width:120
        },

      ],
      deptOptions:[],
      deptId:'',
      depertmentList:[],
      itemName:''
    }
  },
  created() {
    this.form = this.$route.query.item
    this.getlist()
    this.getTreeselect()
    this.getDepartment()
    this.deptId = this.form.deptId
  },

  methods: {
    getConstructorName(val){
      this.itemName=this.depertmentList.filter(item=>item.departmentId==val)[0].departmentName
    },
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getDepartment() { // 获取科室接口
      const data = {
        deptId: this.form.deptId
      }
      this.$api.modules.filing.departmentInfoList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
        }
        this.depertmentList = this.unique(res.rows)
      })
    },
    searchClick(){
      this.getlist()
    },
    remode(){
      this.closeTag()
    },
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    getlist() {
      var data = {
        departmentId: this.form.queryId,
        deptId: this.form.deptId,
        endTime: this.form.timeData[1],
        startTime: this.form.timeData[0]
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

          // this.tableData = res.rows
          this.getData()
        }
      })
    },
    // 表头列
    clium(val) {
      // if (val.columnName !== '合计') {为了调样式先将条件改变
      if (val.queryName !== '合计') {
        this.$set(val, 'departmentId', this.form.queryId)
        this.$set(val, 'projectTypeId', val.queryId)
        this.$set(val, 'timeData', this.form.timeData)
        this.$set(val, 'deptId', this.form.deptId)
        this.$router.push({ path: 'navTableT', query: { item: val }})
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
      // 后端返回合计 就不用这些
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
      this.list.forEach(item => {
        this.tableDatalist.push({
          queryName: '合计',
          name: '合计',
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

<style scoped scoped lang="scss">
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1511px;
  padding-top: 15px;
}

>>> .el-dialog__header{
  height: 28px;
  background: #1abc9c;
}
</style>