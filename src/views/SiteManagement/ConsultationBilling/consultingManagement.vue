<template>
  <!-- 开单管理（现咨管理岗） -->
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
      <div slot="searchBar" >
        <el-form ref="form" inline size="mini"  :rules="rules" :show-message="false" :model="form" @submit.native.prevent="getData">
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
            <el-select  placeholder="请选择" filterable>
              <el-option label="区域一" ></el-option>
              <el-option label="区域二" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否已开单:" prop="keshi">
            <el-select  placeholder="请选择" filterable>
              <el-option label="区域一" ></el-option>
              <el-option label="区域二" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接待时间:" prop="keshi">
            <el-date-picker type="date" placeholder="选择日期" ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click.stop.native="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- ----------------------------------- -->
      <div slot="header" style="width: 100%;">
        <el-form style="float: left">
          <p class="kaidan">开单管理列表</p>
        </el-form>
        <el-form class="headerTopPadding" style="float: left">
        </el-form>
        <el-button
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
        >开单</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >交预约金</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >交储值</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >储值开卡</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >叫住院押金</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >辅助治疗开单</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >检验开单</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop="sendMessage"
        >餐厅开单</el-button>
        <el-button
          size="mini"
          plain
          style="float: right;margin-top: 12px"
          @click.stop.native="openManualDialog"
        >微商城订单开单</el-button>
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
          lab: '接待时间',
          val: 'createTime'
        },
        {
          lab: '接诊状态',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '姓名',
          val: 'formalCustomerName'
        },
        {
          lab: '客户卡号',
          val: 'hesuan',
          width: 165
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
          lab: '客户意见',
          val: 'visituserName'
        },
        {
          lab: '医助描述',
          val: 'visituserName'
        },
        {
          lab: '二次来源',
          val: 'visituserName'
        },
        {
          lab: '二开推荐人',
          val: 'visituserName'
        },
        {
          lab: '分诊类型',
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
