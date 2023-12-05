<template>
  <!-- 二开推荐收费单 -->
  <div>
    <sg-table
      :header-style="{backgroundColor:'#f2f2f2'}"
      :table-data="tableData"
      :pagination="pagination"
      :pagination-style="{backgroundColor:'#f8f8f8'}"
      :columns="columns"
    >
      <div slot="searchBar" style="float:left;position:relative;">
        <el-form
          size="mini"
          label-width="100px"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item label="收费单号">
                <el-input />
              </el-form-item>
              <el-form-item label="二开推荐人">
                <el-select filterable>
                  <el-option>1</el-option>
                  <el-option value="1">2</el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="4">
              <el-form-item label="客户姓名">
                <el-input />
              </el-form-item>
              <el-form-item label="分诊类型">
                <el-select filterable>
                  <el-option>1</el-option>
                  <el-option>2</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="电话">
                <el-input />
              </el-form-item>
              <el-form-item label="下单人">
                <el-select filterable>
                  <el-option>1</el-option>
                  <el-option>2</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="收费类型">
                <el-select filterable>
                  <el-option>1</el-option>
                  <el-option>2</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开单时间">
                <el-date-picker
                  style="width:100%"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="收费单状态">
                <el-select filterable>
                  <el-option>1</el-option>
                  <el-option>2</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="退款原因">
                <el-select filterable>
                  <el-option>1</el-option>
                  <el-option>2</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-row
                type="flex"
                justify="end"
              >
                <el-button size="mini">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div
        slot="header"
        class="header"
      >
        <div>应付金额：</div>
        <div>实付金额：</div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'

export default {
  components: {
    SgTable

  },
  data() {
    return {
      tableData: [], // 表格数据
      pagination: {
        show: true// 显示底部分页组件
      },
      columns: [
        {
          lab: '打印',
          val: 'Print'
        },
        {
          lab: '收费编号',
          width: 120,
          val: 'Chargenumber'
        },
        {
          lab: '收费单状态',
          val: 'ChargingStatus'
        },
        {
          lab: '收费单类型',
          val: 'type'
        },
        {
          lab: '客户姓名',
          val: 'name'
        },
        {
          lab: '备注',
          val: 'remarks'
        },
        {
          lab: '费用合计',
          val: 'TotalExpenses'
        },
        {
          lab: '折扣',
          val: 'discount'
        },
        {
          lab: '应付款',
          val: 'copewith'
        },
        {
          lab: '实付款',
          val: 'ActualPayment'
        },
        {
          lab: '美学顾问',
          val: 'blacklistName'
        },
        {
          lab: '二开推荐人',
          width: 120,
          val: 'twoRecommender'
        },
        {
          lab: '分诊类型',
          val: 'Triagetype'
        },
        {
          lab: '是否领药',
          val: 'ReceivingMedicine'
        },
        {
          lab: '是否治疗',
          val: 'Treatmentornot'
        },
        {
          lab: '下单人',
          val: 'NextPerson'
        },
        {
          lab: '下单时间',
          val: 'Ordertime'
        }
      ]

    }
  }
}
</script>

<style scopde lang="scss">
.header {
  font-size: 14px;
}
</style>
