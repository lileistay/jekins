<template>
  <!--全院报表分析-->
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      :span-method="arraySpanMethod"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <el-table-column
        prop="date"
        label="科室"
        style="background-color: #3aa1ff"
      />
      <el-table-column
        prop="name"
        label="新老客"
      />
      <el-table-column label="全院分析">
        <el-table-column label="时间：2022-10-01-----2022-10-19">
          <el-table-column
            prop="province"
            label="来院量"
          />
          <el-table-column
            prop="id"
            label="成交量"
          />
          <el-table-column
            prop="address"
            label="成交率"
          />
          <el-table-column
            prop="name"
            label="成交金额"
          />
        </el-table-column>
        <el-table-column label="媒介分析">
          <el-table-column
            prop="city"
            label="人均消费额	"
          />
        </el-table-column>
        <el-table-column label="渠道分析">
          <el-table-column
            prop="amount1"
            label="来院量占比"
          />
        </el-table-column>
        <el-table-column label="美学顾问">
          <el-table-column
            prop="city"
            label="成交量占比"
          />
        </el-table-column>
        <el-table-column label="线上客服">
          <el-table-column
            prop="amount2"
            label="成交额占比	"
          />
        </el-table-column>
        <el-table-column label="医生">
          <el-table-column
            prop="city"
            label="日来院量"
          />
        </el-table-column>
        <el-table-column label="年龄">
          <el-table-column
            prop="amount3"
            label="日成交量"
          />
        </el-table-column>
        <el-table-column label="地区">
          <el-table-column
            prop="city"
            label="日成交额"
          />
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Analysisreportwholehospital',
  data() {
    return {
      tableData: [
        {
          date: '测试',
          id: '12987122',
          name: '板子',
          province: '12',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        },
        {
          date: '测试',
          id: '12987122',
          name: '板子',
          province: '12',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        },
        {
          id: '12987122',
          name: '王小虎',
          province: '12',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        },
        {
          id: '12987122',
          name: '王小虎',
          province: '12',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        },
        {
          name: '合计1',
          id: '12',
          province: '48',
          amount1: '121212',
          amount2: '121212',
          amount3: '121212'
        },
        {
          date: '测试',
          id: '12987122',
          name: '成板子',
          province: '12',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        },
        {
          date: '测试',
          id: '12987122',
          name: '成板子',
          province: '12',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        },
        {
          id: '12987122',
          name: '王小虎',
          province: '12',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        },
        {
          id: '12987122',
          name: '王小虎',
          province: '12',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          name: '合计2',
          id: '25',
          province: '49',
          amount1: '121212',
          amount2: '121212',
          amount3: '121212'
        }
      ],
      colArr1: [5, 0, 0, 0, 0, 5]
    }
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 合拼第一二列的行
      if (columnIndex === 0 || columnIndex === 0 || columnIndex === 0) {
        const _row = this.colArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        // 返回行和列的合拼数
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>

<style scoped>

</style>