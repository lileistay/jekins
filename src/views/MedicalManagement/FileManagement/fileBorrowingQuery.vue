<template>
  <!-- 档案借阅查询记录 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search">查询</el-button>
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
        >
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />统计信息</span>
            </div>
          </div>
          <div slot="header" class="header-float">
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
          lab: '姓名',
          val: '',
          width: 150
        },
        {
          lab: '卡号',
          val: '',
          width: 150
        },
        {
          lab: '手机号',
          val: '',
          width: 150
        },
        {
          lab: '病历号',
          val: ''
        },
        {
          lab: '病历科室',
          val: ''
        },
        {
          lab: '借阅部门',
          val: ''
        },
        {
          lab: '借阅申请人',
          val: '',
          width: 150
        },
        {
          lab: '借阅申请时间',
          val: '',
          width: 150
        },
        {
          lab: '申请状态',
          val: '',
          width: 150
        },
        {
          lab: '备注',
          val: '',
          width: 150
        },
        {
          lab: '领取人',
          val: '',
          width: 150
        },
        {
          lab: '领取部门',
          val: '',
          width: 150
        },
        {
          lab: '审批时间',
          val: '',
          width: 150
        },
        {
          lab: '审批人',
          val: ''
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '申请时间：',
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
        customerNuber: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        xiangmu: {
          type: 'input',
          label: '审核状态：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'input',
          label: '备注',
          clearable: true,
          options: []
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
.container {
  width: 100%;
  height: 100%;
}
  span {
    font-size: 12px;
    margin-right: 15px;
  }
  i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
.el-input__prefix{
  display: none;
}
</style>
