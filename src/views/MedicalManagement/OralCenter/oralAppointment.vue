<template>
  <!-- 口腔预约 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search">查询</el-button>
        <el-button size="mini" type="success" icon="el-icon-d-arrow-right">导出</el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"

          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @operateClick="operateClick"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
              <span>总人数：0</span>
              <span><i style="background-color:#fde5d4" />已接诊：0</span>
              <span><i style="background-color:#aad7fd" />已排期：0</span>
              <span><i style="background-color:#c6f9c3" />已治疗：0</span>
              <span><i style="background-color:#fff8c6" />已取消：0</span>
            </div>
            <div>
              <!-- <el-button size="mini" plain type="primary" icon="el-icon-plus">预约批量发送短信</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">批量发送短信</el-button> -->
              <el-button size="mini" plain type="primary" icon="el-icon-plus">手工上报</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus">登记预约</el-button>
              <el-button size="mini" plain type="danger" icon="el-icon-close">取消预约</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>
            </div>
          </div>
        </sg-table>
      </slot>
    </SlideSearch>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
export default {
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          lab: '操作',
          val: ''
        },
        {
          lab: '预约单号',
          val: ''
        },
        {
          lab: '预约日期',
          val: ''
        },
        {
          lab: '预约时段',
          val: ''
        },
        {
          lab: '预约状态',
          val: ''
        },
        {
          lab: '是否接诊',
          val: ''
        },
        {
          lab: '是否排期',
          val: ''
        },
        {
          lab: '是否治疗',
          val: ''
        },
        {
          lab: '姓名',
          val: 'customerName'
        },
        {
          lab: '电话',
          val: 'custompone'
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '是否有欠款',
          val: '',
          width: 120
        },
        {
          lab: '欠款金额',
          val: ''
        },
        {
          lab: '会员等级',
          val: '',
          width: 100
        },
        {
          lab: '病历号',
          val: ''
        },
        {
          lab: '备注',
          val: '',
          showOverflowTooltip: true
        },
        {
          lab: '预约美学顾问',
          val: '',
          width: 120
        },
        {
          lab: '医生',
          val: ''
        },
        {
          lab: '预约项目',
          val: ''
        },
        {
          lab: '仪器',
          val: ''
        },
        {
          lab: '医助',
          val: ''
        },
        {
          lab: '护士',
          val: ''
        },
        {
          lab: '归属美学顾问',
          val: '',
          width: 120
        },
        {
          lab: '归属客户代表',
          val: '',
          width: 130
        },
        {
          lab: '下单人',
          val: '',
          width: 130
        },
        {
          lab: '下单日期',
          val: '',
          width: 130
        },
        {
          lab: '预约取消操作人',
          val: '',
          width: 130
        },
        {
          lab: '最终操作人',
          val: '',
          width: 140
        },
        {
          lab: '是否已发短信',
          val: '',
          width: 130
        },
        {
          lab: '单据明细备注',
          val: '',
          width: 135,
          showOverflowTooltip: true
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '预约时间',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        customerStatus: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        xiangmu: {
          type: 'select',
          label: '预约项目：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'select',
          label: '预约美学顾问',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        label: {
          type: 'select',
          label: '预约状态：',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        tade: {
          type: 'Tdatetime',
          label: '下单时间',
          clearable: true,
          values: []
        },
        // 无
        xian: {
          type: 'select',
          label: '仪器：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '是否已接诊：',
          clearable: true,
          options: []
        },
        // 无
        createuserId: {
          type: 'select',
          label: '是否已排期：',
          clearable: true,
          options: []
        },
        visituserId: {
          type: 'select',
          label: '是否以治疗：',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '是否有效：',
          clearable: true,
          options: []
        },
        remarks: {
          type: 'select',
          label: '是否有欠款：',
          clearable: true,
          options: []
        },
        huiyuan: {
          type: 'select',
          label: '会员等级：'
        },
        meixue: {
          type: 'select',
          label: '归属美学顾问：'
        },
        daibiao: {
          type: 'select',
          label: '归属客户代表：'
        },
        men: {
          type: 'input',
          label: '门诊病历：'
        },
        kouqianng: {
          type: 'input',
          label: '口腔病历：'
        },
        xinxi: {
          type: 'select',
          label: '是否已发短信：'
        }
      },
      pagination: {
        show: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}
   span {
    font-size: 14px;
    margin-right: 15px;
  }
   i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
</style>
