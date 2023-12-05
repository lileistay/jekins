<template>
  <!-- 部门数据查询 -->
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
          lab: '网点咨询师业绩',
          val: ''
          // width: 135,
          // showOverflowTooltip: true
        },
        {
          lab: '网点咨询师业绩明细',
          val: ''
        },
        {
          lab: '正是客户二次预约业绩',
          val: ''
        },
        {
          lab: '开单业绩',
          val: ''
        },
        {
          lab: '开单业绩明细',
          val: ''
        },
        {
          lab: '来院业绩明细',
          val: ''
        },
        {
          lab: '来院消费',
          val: ''
        },
        {
          lab: '推荐人业绩',
          val: ''
        },
        {
          lab: '医生业绩',
          val: ''
        },
        {
          lab: '医生划扣明细',
          val: 'customCardNumber'
        }
      ],
      options: {
        // receptionTimes: {
        //   type: 'Tdatetime',
        //   label: '业绩查询',
        //   clearable: true,
        //   values: []
        // },
        customerName: {
          type: 'input',
          label: '网点咨询师业绩：'
        },
        customPhone: {
          type: 'input',
          label: '网点咨询师业绩明细：'
        },
        customerStatus: {
          type: 'input',
          label: '正是客户二次预约业绩：'
        },
        xiangmu: {
          type: 'input',
          label: '开单业绩：'
        },
        label: {
          type: 'input',
          label: '开单业绩明细：'
        },
        onlineUserId: {
          type: 'input',
          label: '来院业绩明细'
        },
        tionTimes: {
          type: 'Tdatetime',
          label: '下单时间',
          clearable: true,
          values: []
        },
        xian: {
          type: 'input',
          label: '来院业绩明细：'
        },
        aestheticConsultant: {
          type: 'input',
          label: '来院消费：'
        },
        // 无
        createuserId: {
          type: 'input',
          label: '推荐人业绩：'
        },
        visituserId: {
          type: 'input',
          label: '医生业绩：'
        },
        isSecondary: {
          type: 'input',
          label: '医生划扣明细：'
        }
        // remarks: {
        //   type: 'select',
        //   label: '是否有欠款：',
        //   clearable: true,
        //   options: []
        // },
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
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
