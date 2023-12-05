<template>
  <!-- 二开推荐开单 -->
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
      <div slot="searchBar">
        <el-form ref="form" inline size="mini" :rules="rules" :show-message="false" :model="form" @submit.native.prevent="getData">
          <el-form-item label="客户姓名:" prop="userPhone">
            <el-input />
          </el-form-item>
          <el-form-item label="电话:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="客户卡号:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="新老客户:" prop="keshi">
            <el-select filterable placeholder="请选择">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否已开单:" prop="keshi">
            <el-select filterable placeholder="请选择">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="接待时间:" prop="keshi">
            <el-date-picker type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click.stop.native="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- ----------------------------------- -->
      <div slot="header" style="width: 100%;">
        <el-form style="float: left">
          <p class="kaidan">二开推荐开单</p>
        </el-form>
        <el-form class="headerTopPadding" style="float: left" />
        <el-button
          type="success"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >套餐开单</el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >检验开单</el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >辅助治疗开单</el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >交住院押金</el-button>
        <el-button
          type="warning"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >储值开卡</el-button>
        <el-button
          type="warning"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >交储值</el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >开单</el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >跨科</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >领取接诊单</el-button>
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
          lab: '二开推荐员工',
          width: 120,
          val: 'createTime'
        },
        {
          lab: '接待时间',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '接待状态',
          val: 'formalCustomerName'
        },
        {
          lab: '姓名',
          val: 'hesuan'
        },
        {
          lab: '顾客卡号',
          val: 'visituserName'
        },
        {
          lab: '性别',
          val: 'visituserName'
        },
        {
          lab: '电话',
          val: 'visituserName'
        },
        {
          lab: '新老顾客',
          val: 'visituserName'
        },
        {
          lab: '美学顾问',
          val: 'visituserName'
        },
        {
          lab: '会员等级',
          val: 'visituserName'
        },
        {
          lab: '科室',
          val: 'visituserName'
        },
        {
          lab: '顾客代表',
          val: 'visituserName'
        },
        {
          lab: '医生',
          val: 'visituserName'
        },
        {
          lab: '分诊备注',
          val: 'visituserName'
        },
        {
          lab: '二次来院',
          val: 'visituserName'
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
</style>
