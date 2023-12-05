<template>
  <el-table
     style="width: 1300px"
    size="mini"
     :header-cell-style="getRowClass"
    :cell-style="{'text-align':'center'}"
    @header-click="headerChange"
  >
    <el-table-column label="科室项目报表">
      <el-table-column :label="'时间：'+ form.timeData[0]+ '---' +form.timeData[1]">
        <el-table-column
          prop="province"
          label="二级分类"
          width="120"
        />
        <el-table-column
          prop="province"
          label="三级分类"
          width="120"
        />
        <el-table-column
          prop="province"
          label="新老客"
          width="127"
        />
        <el-table-column
          prop="province"
          label="门诊量"
          width="100"
        />
      </el-table-column>
      <el-table-column label="媒介分析">
        <el-table-column
          prop="province"
          label="成交量"
          width="100"
        />
      </el-table-column>
      <el-table-column label="渠道分析">
        <el-table-column
          prop="id"
          label="成交率"
          width="110"
        />
      </el-table-column>
      <el-table-column label="美学顾问">
        <el-table-column
          prop="address"
          label="成交金额"
          width="150"
        />
      </el-table-column>
      <el-table-column label="线上客服">
        <el-table-column
          prop="name"
          label="人均消费额"
          width="110"
        />
      </el-table-column>
      <el-table-column label="医生">
        <el-table-column
          prop="city"
          label="门诊量占比"
          width="120"
        />
      </el-table-column>
      <el-table-column label="年龄">
        <el-table-column
          prop="city"
          label="成交量占比"
          width="120"
        />
      </el-table-column>
      <el-table-column label="地区">
        <el-table-column
          prop="city"
          label="成交额占比"
          width="120"
        />
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'NavTable',
  props: ['form'],
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
    this.form = this.$route.query.item
    this.deptId = this.$store.getters.departmentId
  },
  methods: {
    headerChange(column, event) {
      this.item = {
        name: column.label,
      }
      // if (column.label === '媒介分析') {
      //   this.item = {
      //     deptId: this.deptId,
      //     name: column.label,
      //     type: '1'
      //   }
      //   this.$router.push({ path: 'analysisHeader', query: { item: this.item }})
      // } else if (column.label === '渠道分析') {
      //   this.item = {
      //     name: column.label,
      //     deptId: this.deptId,
      //     type: '2'
      //   }
      //   this.$router.push({ path: 'analysisHeader', query: { item: this.item }})
      // } else if (column.label === '美学顾问') {
      //   this.item = {
      //     name1: column.label,
      //     deptId: this.deptId,
      //     name: column.label + '分析',
      //     type: '3'
      //   }
      //   this.$router.push({ path: 'mxTableHeader', query: { item: this.item }})
      // } else if (column.label === '线上客服') {
      //   this.item = {
      //     name1: column.label,
      //     deptId: this.deptId,
      //     name: column.label + '分析',
      //     type: '3'
      //   }
      //   this.$router.push({ path: 'mxTableHeader', query: { item: this.item }})
      // } else if (column.label === '医生') {
      //   this.item = {
      //     name: column.label + '业绩统计',
      //     name1: column.label,
      //     deptId: this.deptId,
      //     type: '1'
      //   }
      //   this.$router.push({ path: 'NavAnalysis', query: { item: this.item }})
      // } else if (column.label === '年龄') {
      //   this.item = {
      //     name: '客户' + column.label + '统计',
      //     name1: '客户' + column.label,
      //     deptId: this.deptId,
      //     type: '2'
      //   }
      //   this.$router.push({ path: 'NavAnalysis', query: { item: this.item }})
      // } else if (column.label === '地区') {
      //   this.item = {
      //     name: column.label + '信息统计',
      //     deptId: this.deptId,
      //     type: '3'
      //   }
      //   this.$router.push({ path: 'NavAnalysis', query: { item: this.item }})
      // }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
          if (column.label == "科室项目报表"  ) {
              return {
                  // 头部标签
                  'text-align':'center',
                  'background-color': '#ccffff',
                  color: '#2161ab',
                  'font-size':"15px",
                  height:'60px'
              }
          }  else if(column.label.indexOf("时间") != -1 ){
              return {
                  'text-align':'center',
                  'background-color': '#99ffff',
                  color: '#000',
              }
          } if (  column.label == "媒介分析" || column.label == "渠道分析" || column.label == "美学顾问" || column.label == "线上客服" || column.label == "医生"|| column.label == "年龄" ||column.label == "地区" ) {
              return {
                  // 头部标签
                  'text-align':'center',
                  'background-color': '#00ffff',
                  'text-decoration': 'underline',
                  'cursor':' pointer',
                  color: '#1e64aa'
              }
          }  else {
              return {
                  'text-align':'center',
                  'background-color': '#c0c0c0',
                  color: '#000',
                  height:'15px'
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
