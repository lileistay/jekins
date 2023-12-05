<template>
  <!---- 全院月度报表       ----->
  <div class="header">
    <div><el-row>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-col :span="4">
          <input style="visibility: hidden">
        </el-col>
        <el-col :span="4">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="form.time"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="form.time"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="组织">
            <el-select filterable v-model="form.region" placeholder="请选择活动区域">
              <el-option label="兰州时光" value="0" />
              <el-option label="西宁时光" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button size="mini">查询</el-button>
        </el-col>
      </el-form>
    </el-row></div>
    <div>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        :summary-method="getSummaries"
        show-summary
        border
        size="mini"
      >
        <el-table-column
          prop="date"
          label="日期"
          width="150"
        />
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="amount1"
          label="省份"
        />
        <el-table-column
          prop="amount2"
          label="市区"
        />
        <el-table-column
          prop="amount3"
          label="地址"
        />
        <el-table-column
          prop="zip"
          label="邮编"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlyReport',
  data() {
    return {
      form: {},
      tableData: [{
        date: '月',
        id: '12987122',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        date: '月',
        id: '12987123',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        date: '月',
        id: '12987124',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '12987125',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }, {
        id: '12987125',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }]
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  }
}
</script>

<style scoped lang="scss">
.header{
  padding: 10px 10px 0 10px ;
}

</style>
