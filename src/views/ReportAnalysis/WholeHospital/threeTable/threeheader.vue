<template>
  <!---  科室三级 --->
  <!--点击科室的第三级页面-->
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
          <el-form-item label="上级类型" prop="deptId">
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
    <!--表头-->
    <navTable :form="form" />
    <!--      表身-->
    <cellTable
      ref="cellTable"
      :prop-data="propData"
      :list-data="tableDatalist"
      :heights="0"
      :summary="false"
      :cell-merge="cellMerge"
      :cell-name="cellnaem"
      :cell-back="cellBack"
      :itemName="itemName"
    >
      <template #custom="data">
        <div v-if="data.props === 'queryName'">
          <span style="color: #3aa1ff;">{{ data.custom.queryName }}</span>
        </div>
      </template>
    </cellTable>
  </div>
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTabletwos'
import navTable from '@/views/ReportAnalysis/WholeHospital/threeTable/threeNav'
import Treeselect from "@riophae/vue-treeselect";
import vm from '@/utils/util'
export default {
  name: 'NavTableT',
  components: {
    Treeselect,
    cellTable,
    navTable
  },
  data() {
    return {
      form: {},
      tableDatalist: [],
      tableData: [],
      cellMerge: [0],
      cellnaem: 'queryName',
      cellBack: 'rowName,合计,#666,#eee',
      propData: [

        {
          prop: 'queryName',
          custom: 'queryName',
          label: '三级分类',
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
      this.itemName=this.depertmentList.filter(item=>item.categoryId==val)[0].categoryName
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
    getDepartment() { // 获取上级类型
      const data = {
        deptId: this.form.deptId,
        projectTypeId: this.form.projectTypeId
      }
      this.$api.modules.filing.getProjectCategoryInfo(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
        }
        this.depertmentList = this.unique(res.data)
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
        departmentId: this.form.departmentId,
        projectTypeId: this.form.projectTypeId,
        categoryId:this.form.categoryId,
        endTime: this.form.timeData[1],
        startTime: this.form.timeData[0],
        deptId: this.form.deptId
        // projectTypeId:
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
