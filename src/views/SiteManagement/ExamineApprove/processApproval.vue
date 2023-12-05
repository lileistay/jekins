<template>
  <!-- 流程审查  -->
  <el-scrollbar>
    <div class="box">
      <div class="">
        <sg-table :tableData="tableData" size="mini"  border :columns="columns" :pagination="pagination" :headerStyle="{backgroundColor:'#587fa1'}">
          <div slot="searchBar" class="tou">
            <el-form ref="form" size="mini" label-width="100px">
              <el-row>
                <el-col :span="3">
                  <el-form-item label="收费单号:">
                    <el-input v-model="form.customPhone" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="客户姓名:">
                    <el-input v-model="form.customPhone" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="电话:">
                    <el-input v-model="form.customPhone" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="处理状态:">
                    <el-select >
                      <el-option />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="开单日期:">
                    <el-date-picker
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 197px;"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="审批日期:">
                    <el-date-picker
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 197px;"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-button icon="el-icon-search" size="mini" type="primary" plain>搜索</el-button>
              </el-row>
            </el-form>
          </div>
          <div slot="header" class="header">
            <div style="margin-right:10px">审批流程</div>
            <div>
              <el-button style="text-align:right" icon="el-icon-edit" type="success" plain size="mini">审批</el-button>
            </div>
          </div>
        </sg-table>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>

import SgTable from '@/components/Table'
export default {
  dicts: ['new_guest'],
  name: 'ReceptionList',
  components: {
    SgTable
  },
  data() {
    return {
      form: {
      },
      tableData: [],
      columns: [
        {
          lab: '收费单编号',
          val: 'gradeName',
          width: 165
        },
        {
          lab: '收费单类型',
          val: 'receptionTime'
        },
        {
          lab: '顾客姓名',
          val: 'customerName'
        },
        {
          lab: '备注',
          val: 'customSex',
          custom: 'customSex'
        },
        {
          lab: '费用合计',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '折扣',
          val: 'customerStatus'
        },
        {
          lab: '应付款',
          val: 'isSecondary'
        },
        {
          lab: '下单人',
          val: 'departmentName',
          width: 100
        },
        {
          lab: '下单时间',
          val: 'receptionStatu'
        },
        {
          lab: '可审批人',
          val: 'appointmentTime'
        },
        {
          lab: '审批状态',
          val: 'isDeal'
        },
        {
          lab: '审批结果',
          val: 'acName'
        },
        {
          lab: '最终审批人',
          val: 'crName'
        },
        {
          lab: '审批时间',
          val: 'saName'
        }
      ],
      // 分页组件数据
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" >
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box {
  height: 100%;
}
.color-block-success {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  background-color: #3eee3e;
  border-radius: 2px;
  border: 1px solid #3eee3e;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
