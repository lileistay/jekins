<template>
  <!--第一个表 组件 表头-->
  <div>
    <el-table
      style="width: 1300px"
      size="mini"
      :header-cell-style="getRowClass"
      @header-click="headerChange"
    >
      <el-table-column label="科室"/>
      <el-table-column label="新老客" />
      <el-table-column label="全院分析报表">
        <el-table-column :label="form.timeData?'时间：'+ form.timeData[0]+ '---' +form.timeData[1]:''">
          <el-table-column
            label="来院量"
          />
          <el-table-column
            label="成交量"
          />
          <el-table-column
            label="成交率"
          />
          <el-table-column
            label="成交金额"
            width="150px"
          />
        </el-table-column>
        <el-table-column label="媒介分析">
          <el-table-column
            label="人均消费额	"
            width="110px"
          />
        </el-table-column>
        <el-table-column  label="渠道分析">
          <el-table-column
            label="来院量占比"
            width="110px"
          />
        </el-table-column>
        <el-table-column label="美学顾问">
          <el-table-column
            label="成交量占比"
            width="110px"
          />
        </el-table-column>
        <el-table-column label="线上客服">
          <el-table-column
            label="成交额占比	"
            width="110px"
          />
        </el-table-column>
        <el-table-column label="医生">
          <el-table-column
            label="日来院量"
            width="110px"
          />
        </el-table-column>
        <el-table-column label="年龄">
          <el-table-column
            label="日成交量"
          />
        </el-table-column>
        <el-table-column label="地区">
          <el-table-column
            label="日成交额"
          />
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {timeFmt} from "../../../utils/time";
export default {
  name: 'AllTable',
  props: ['form'],
  data() {
    return {
      item: {}
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
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    // if (this.form.timeData!=null){
    //   this.form.timeData[0]=this.form.timeData!=null ? timeFmt('YYYY-mm-dd',this.form.timeData[0]):''
    //   this.form.timeData[1]=this.form.timeData!=null ? timeFmt('YYYY-mm-dd',this.form.timeData[1]):''
    // }

  },
  methods: {
    headerChange(column, event) {
      if (column.label === '媒介分析') {
        this.item = {
          deptId: this.form.deptId,
          name: column.label,
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '1'
        }
        this.$router.push({ path: 'analysisHeader', query: { item: this.item }})
      } else if (column.label === '渠道分析') {
        this.item = {
          name1: column.label,
          deptId: this.form.deptId,
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '2'
        }
        this.$router.push({ path: 'mxTableHeader', query: { item: this.item }})
      } else if (column.label === '美学顾问') {
        this.item = {
          name1: column.label,
          deptId: this.form.deptId,
          name: column.label + '分析',
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '3'
        }
        this.$router.push({ path: 'mxTableHeader', query: { item: this.item }})
      } else if (column.label === '线上客服') {
        this.item = {
          name1: column.label,
          deptId: this.form.deptId,
          name: column.label + '分析',
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '3'
        }
        this.$router.push({ path: 'mxTableHeader', query: { item: this.item }})
      } else if (column.label === '医生') {
        this.item = {
          name: column.label + '业绩统计',
          name1: column.label,
          deptId: this.form.deptId,
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '4'
        }
        this.$router.push({ path: 'NavAnalysis', query: { item: this.item }})
      } else if (column.label === '年龄') {
        this.item = {
          name: '客户' + column.label + '统计',
          name1: '客户' + column.label,
          deptId: this.form.deptId,
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '5'
        }
        this.$router.push({ path: 'NavAnalysis', query: { item: this.item }})
      } else if (column.label === '地区') {
        this.item = {
          name: column.label + '信息统计',
          deptId: this.form.deptId,
          time1:this.form.timeData? this.form.timeData[0]:'',
          time2:this.form.timeData? this.form.timeData[1]:'',
          timeData: this.form.timeData,
          type: '6'
        }
        this.$router.push({ path: 'NavAnalyarea', query: { item: this.item }})
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (column.label == "全院分析报表"  ) {
        return {
          // 头部标签
            'text-align':'center',
            'background-color': '#fff',
             color: '#1e64aa',
          'font-size':"16px",
        }
      } if (column.label == "媒介分析" || column.label == "渠道分析" || column.label == "美学顾问" || column.label == "线上客服" || column.label == "医生"|| column.label == "年龄" ||column.label == "地区" ) {
        return {
          // 头部标签
          'text-align':'center',
          'background-color': '#AEEEEE',
          'text-decoration': 'underline',
          'cursor':' pointer',
          color: '#1e64aa'
        }
      }  else {
        return {
          'text-align':'center',
          'background-color': '#7fc0ec',
          color: '#1e64aa'
        }
      }

    },
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__empty-block {
  display: none;
}
</style>
