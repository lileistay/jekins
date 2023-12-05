<template>
  <!--  物资部位-->
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
              <span><i class="el-icon-s-data" style="color: #5f94de" />统计信息</span>
            </div>
            <div>
              <span>客户人数：00</span>
              <span>部位使用总量：00</span>
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
          lab: '客户姓名',
          val: '',
          width: 120
        },
        {
          lab: '电话',
          val: ''
        },
        {
          lab: '客户卡号',
          val: '',
          width: 120
        },
        {
          lab: '客户状态',
          val: ''
        },
        {
          lab: '治疗时间',
          val: ''
        },
        {
          lab: '美学顾问',
          val: ''
        },
        {
          lab: '项目名称',
          val: '',
          width: 150
        },
        {
          lab: '物资类型',
          val: '',
          width: 150
        },
        {
          lab: '物资名称',
          val: '',
          width: 150
        },
        {
          lab: '物资单位',
          val: '',
          width: 150
        },
        {
          lab: '部位',
          val: '',
          width: 150
        },
        {
          lab: '用量单位',
          val: ''
        },
        {
          lab: '使用数量',
          val: ''
        },
        {
          lab: '主诊医生',
          val: ''
        },
        {
          lab: '实际执行人',
          val: '',
          width: 120
        },
        {
          lab: '服务助理',
          val: ''
        },
        {
          lab: '护士',
          val: ''
        },
        {
          lab: '治疗状态',
          val: ''
        },
        {
          lab: '当次治疗次数',
          val: '',
          width: 120
        },
        {
          lab: '客户代表',
          val: '',
          width: 120
        },
        {
          lab: '备注',
          val: '',
          width: 150
        }
      ],
      options: {
        receptionTimes: {
          type: 'Tdatetime',
          label: '最后治疗时间：',
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
        paiqi: {
          type: 'select',
          label: '物资类型：',
          clearable: true,
          options: []
        },
        name: {
          type: 'input',
          label: '物资名称：',
          clearable: true,
          options: []
        },
        zhiliao: {
          type: 'select',
          label: '部位：',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'select',
          label: '客户状态',
          clearable: true,
          options: []
        },
        // 无
        xian: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          options: []
        },
        one: {
          type: 'select',
          label: '主诊医生：',
          clearable: true,
          values: []
        },
        two: {
          type: 'select',
          label: '实际执行人：',
          clearable: true,
          values: []
        },
        projectOne: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          values: []
        },
        projectTwo: {
          type: 'select',
          label: '护士：',
          clearable: true,
          values: []
        },
        projectTherr: {
          type: 'select',
          label: '治疗状态：',
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
