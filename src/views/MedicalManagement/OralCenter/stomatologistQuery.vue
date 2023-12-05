<template>
  <!-- 口腔医生工作检查站 -->
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
            </div>
            <div>
              <span>客户人数：00</span>
            </div>
          </div>
          <div slot="header" class="header">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
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
          lab: '挂号编号',
          val: ''
        },
        {
          lab: '挂号时间',
          val: ''
        },
        {
          lab: '科室',
          val: ''
        },
        {
          lab: '挂号医生',
          val: ''
        },
        {
          lab: '客户姓名',
          val: ''
        },
        {
          lab: '客户状态',
          val: ''
        },
        {
          lab: '客户卡号',
          val: ''
        },
        {
          lab: '电话',
          val: 'customerName'
        },
        {
          lab: '挂号类型',
          val: 'custompone'
        },
        {
          lab: '是否已写病历',
          val: '',
          width: 120
        },
        {
          lab: '挂号备注',
          val: ''
        }
      ],
      options: {
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
          type: 'input',
          label: '挂号医生：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        label: {
          type: 'select',
          label: '挂号类型：',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        // 无
        xian: {
          type: 'select',
          label: '客户状态：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '是否已写病历：',
          clearable: true,
          options: []
        },
        receptionTimes: {
          type: 'Tdatetime',
          label: '挂号时间：',
          clearable: true,
          values: []
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
