<template>
  <!-- 二开推荐收费单 -->
  <div>
    <sg-table
      size="mini"
      index="序号"
      border
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
    >
      <!--搜索框 -->
      <div slot="searchBar" style="float:left;position:relative;">
        <el-form ref="form" inline size="mini" :rules="rules" :show-message="false" :model="form" @submit.native.prevent="getData">
          <el-form-item label="收费单号:" prop="userPhone">
            <el-input />
          </el-form-item>
          <el-form-item label="顾客性名:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="电话:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="收费单类型:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="收费单状态:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="二开推荐人:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="分诊类型:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="下单人:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="接待时间:" prop="keshi">
            <el-date-picker type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="退款原因:" prop="keshi">
            <el-select placeholder="请选择" filterable>
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click.stop.native="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- ----------------------------------- -->
      <div slot="header" style="width: 100%;">
        <el-form style="float: left">
          <div>
            <p>应付金额:0.00</p>
            <p>实付金额:0.00</p>
          </div>
        </el-form>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  components: { SgTable },
  data() {
    return {
      form: {
        userPhone: undefined
      },
      tableData: [],
      rowTable: undefined,
      // 表头
      columns: [
        {
          lab: '打印',
          val: 'createTime'
        },
        {
          lab: '收费单编号',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '收费单状态',
          val: 'formalCustomerName'
        },
        {
          lab: '客户姓名',
          val: 'hesuan'
        },
        {
          lab: '备注',
          val: 'visituserName'
        },
        {
          lab: '费用合计',
          val: 'visituserName'
        },
        {
          lab: '折扣',
          val: 'visituserName'
        },
        {
          lab: '应付款',
          val: 'visituserName'
        },
        {
          lab: '实付款',
          val: 'visituserName'
        },
        {
          lab: '美学顾问',
          val: 'visituserName'
        },
        {
          lab: '二开推荐人',
          val: 'visituserName'
        },
        {
          lab: '分诊类型',
          val: 'visituserName'
        },
        {
          lab: '是否领药',
          val: 'visituserName'
        },
        {
          lab: '是否治疗',
          val: 'visituserName'
        },
        {
          lab: '下单人',
          val: 'visituserpor'
        },
        {
          lab: '下单时间',
          val: 'visitrName'
        },
        {
          lab: '退款原因',
          val: 'visuseame'
        }
      ],
      operate: {}
    }
  },
  methods: {}
}
</script>

<style scoped>
.kaidan{
  padding-top: 10px;
}
p{
    font-size: 14px;
    padding-left: 15px;
}
</style>
