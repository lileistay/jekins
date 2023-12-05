<template>
  <!-- 咨询量录入-->
  <div>
    <SgTable
      ref="table"

      :sg-ref="'multipleTable'"
      size="mini"
      selection
      border
      index="序号"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
      :table-data="tableData"
      @operateClick="operateClick"
      @size-change="sizeChange"
      @current-change="currentChange"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="130px">
          <el-row :gutter="18">
            <el-col :span="3">
              <el-form-item label="产品类型:" style="margin-bottom: 6px">
                <el-input style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="科室：" style="margin-bottom: 6px">
                <el-select  filterable placeholder="请选择" clearable style="width: 100px">
                  <el-option label="1" :value="1"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="媒介类型：" style="margin-bottom: 6px">
                <el-select filterable placeholder="请选择" clearable style="width: 100px;">
                  <el-option label="1" :value="1"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="产品类型:" style="margin-bottom: 6px">
                <el-date-picker
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 180px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="建档类型:" style="margin-bottom: 6px">
                <el-input style="width: 100px;" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="备注:" style="margin-bottom: 6px">
                <el-input style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-row>
                <el-button icon="el-icon-search" type="primary" plain size="mini" @click="getData">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- <template #custom="data">-->
      <!--   <div v-if="data.props === 'status'">-->
      <!--     <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />-->
      <!--   </div>-->
      <!--   <div v-else-if="data.props === 'prescriptionType'">-->
      <!--     <dict-tag :options="dict.type.prescription_print_type" :value="data.custom.prescriptionType" />-->
      <!--   </div>-->
      <!-- </template>-->
      <div slot="header" class="header">
        <div>
          <span style="color: #fffffc; font-size: 12px">咨询量: 0</span>
        </div>
        <div>
          <el-button size="mini" icon="el-icon-plus" type="primary" @click.stop="added">批量添加咨询量信息</el-button>
        </div>
      </div>
    </SgTable>
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
      loadingData: false,
      // 搜索框
      form: {
        drugDelivery: '',
        prescriptionType: '',
        status: ''
      },
      selectionData: [],
      // 弹框
      title: '新增',
      dialogVisible: false,
      eject: {
        drugId: '',
        drugDelivery: '',
        prescriptionType: '',
        status: '0'
      },
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      columns: [
        {
          lab: '创建人',
          val: 'drugDelivery'
        },
        {
          lab: '咨询日期',
          val: 'prescriptionType'
          // custom: 'prescriptionType'
        },
        {
          lab: '线上客服',
          val: 'status'
          // custom: 'status'
          // width: 110
        },
        {
          lab: '媒介类型',
          val: 'drugDelivery'
        },
        {
          lab: '媒介来源',
          val: 'drugDelivery'
        },
        {
          lab: '科室',
          val: 'drugDelivery'
        },
        {
          lab: '产品类型',
          val: 'drugDelivery'
        },
        {
          lab: '咨询量',
          val: 'drugDelivery'
        },
        {
          lab: '建档类型',
          val: 'drugDelivery'
        },
        {
          lab: '备注',
          val: 'remakrs'
        }
      ],
      operate: {
        name: '编辑',
        width: '140',
        cell: [
          {
            lab: '修改',
            type: 'warning'
          },
          {
            lab: '删除',
            type: 'danger'
          }
        ]
      },
      tableData: [] // 表格数据
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
