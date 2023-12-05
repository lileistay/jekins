<template>
  <!-- 我的接诊信息（公司） -->
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
          <el-form-item label="活动时间">
            <el-date-picker placeholder="选择日期" />至
            <el-date-picker placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="姓名:" prop="userPhone">
            <el-input />
          </el-form-item>
          <el-form-item label="电话:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="客户卡号:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="分诊备注:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="咨询备注:" prop="keshi">
            <el-input />
          </el-form-item>
          <el-form-item label="科室:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="科室状态:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="接诊状态:">
            <el-select  filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="分诊类型:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户状态:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否二次来院:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否成交:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="处理情况:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="美学顾问:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="医生:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="会员等级:">
            <el-select filterable placeholder="请选择活动区域">
              <el-option label="区域一" />
              <el-option label="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-arrow-down" type="primary" @click.stop.native="getData">更多</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click.stop.native="getData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click.stop.native="getData">搜索明细</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- ----------------------------------- -->
      <div slot="header" style="width: 100%;">
        <el-form style="float: left">
          <p>总人数: 0人</p>
          <p>实付总金额: 0</p>
          <p>老顾客: 0人    新顾客: 0人</p>
          <p>新客首次: 0人</p>
          <p>新客二次: 0人 </p>
        </el-form>
        <el-form style="float: left">
          <p>开单业绩: 0</p>
          <p>退款总额: 0</p>
          <p>老客成交: 0人</p>
          <p>首次成交: 0人</p>
          <p>二次成交: 0人 </p>
        </el-form>
        <el-form style="float: left">
          <p>不包括辅助治疗、检验和住院</p>
          <p>老客成交率: 0%</p>
          <p>首次成交率: 0%</p>
          <p>二次成交率: 0%</p>
        </el-form>
        <el-form style="float: right;  padding-left: 100px;">
          <el-button
            type="danger"
            size="mini"
            plain
            style="float: right;margin-top: 12px;width:121px"
            @click.stop="sendMessage"
          >加入黑名单</el-button>
          <br>
          <el-button
            type="danger"
            size="mini"
            plain
            style="float: right;margin-top: 12px;width:121px"
            @click.stop="sendMessage"
          >手工上报</el-button>
        </el-form>
        <el-form style="float: right; padding-left: 100px;">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            plain
            style="float: right;margin-top: 12px;width:121px"
            @click.stop.native="openManualDialog"
          >客户需求</el-button>
          <br>
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            plain
            style="float: right;margin-top: 12px;width:121px"
            @click.stop.native="openManualDialog"
          >补充客户信息</el-button>
        </el-form>
        <el-form style="float: right; padding-left: 10px;">
          <el-button
            icon="el-icon-edit"
            type="success"
            size="mini"
            plain
            style="float: right;margin-top: 12px; width:121px "
            @click.stop.native="openManualDialog"
          >客户标签</el-button>
          <br>
          <el-button
            icon="el-icon-edit"
            type="success"
            size="mini"
            plain
            style="float: right;margin-top: 12px"
            @click.stop="sendMessage"
          >补充接诊信息</el-button>
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
          lab: '会员等级',
          val: 'formalCustomerName'
        },
        {
          lab: '接待时间',
          val: 'hesuan'
        },
        {
          lab: '客户名称',
          val: 'viituserame'
        },
        {
          lab: '性别',
          val: 'visituserName'
        },
        {
          lab: '手机',
          val: 'visituserNme'
        },
        {
          lab: '客户卡号',
          val: 'visituseame'
        },
        {
          lab: '预约类型',
          val: 'channelName'
        },
        {
          lab: '客户状态',
          val: 'vsituName'
        },
        {
          lab: '科室',
          val: 'vitusrName'
        },
        {
          lab: '是否成交',
          val: 'viserName'
        },
        {
          lab: '处理情况',
          val: 'visituseame'
        },
        {
          lab: '二次来院',
          val: 'isituserName'
        },
        {
          lab: '是否黑名单',
          val: 'visName'
        },
        {
          lab: '咨询备注',
          val: 'visName'
        }
      ],
      operate: {}
    }
  },
  methods: {}
}
</script>

<style scoped>
p{
  font-size: 13px;
  color: #587fa1;
  padding-top: 5px;
  padding-left: 105px;
}
</style>
