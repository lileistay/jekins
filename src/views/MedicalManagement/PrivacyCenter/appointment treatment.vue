<template>
  <!--科室预约-->
  <div class="container">
    <sg-table
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
    >
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
              <el-form-item label="下单日期：">
                <el-input style="width: 45%" />-
                <el-input style="width: 45%" />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="姓名：">
                <el-input />
              </el-form-item>
              <el-form-item label="是否有效：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="会员等级：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="预约日期：">
                <el-date-picker
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="是否已治疗：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已发短信：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="项目：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="归属美学顾问：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="归属客户代表：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="仪器：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已接诊：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="预约美学顾问：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已排期：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span><i style="background-color:#fde5d4" />已接诊</span>
          <span><i style="background-color:#aad7fd" />已排期</span>
          <span><i style="background-color:#c6f9c3" />已治疗</span>
          <span style="text-decoration: line-through"><i style="background-color:#fff8c6" />已取消</span>
          <span>人数：</span>
        </div>
        <div>
          <!-- <el-button size="mini" plain type="primary" icon="el-icon-plus">预约批量发送短信</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">批量发送短信</el-button> -->
          <el-button size="mini" plain type="danger" icon="el-icon-plus">手工上报</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">登记预约</el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-close">取消预约</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'DepartmentReatment',
  components: {
    SgTable
  },
  data() {
    return {
      pagination: {
        show: true
      },
      columns: [
        {
          lab: '预约日期',
          val: ''
        },
        {
          lab: '预约时段',
          val: ''
        },
        {
          lab: '是否到院',
          val: ''
        },
        {
          lab: '姓名',
          val: ''
        },
        {
          lab: '电话',
          val: ''
        },
        {
          lab: '客户卡号',
          val: ''
        },
        {
          lab: '性别',
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
          width: 120
        },
        {
          lab: '预约美学顾问',
          val: '',
          width: 120
        },
        {
          lab: '医生',
          val: '',
          width: 120
        },
        {
          lab: '预约类型',
          val: '',
          width: 120
        },
        {
          lab: '预约项目',
          val: ''
        },
        {
          lab: '下单人',
          val: ''
        },
        {
          lab: '下单日期',
          val: ''
        },
        {
          lab: '备注',
          val: ''
        },
        {
          lab: '仪器',
          val: ''
        },
        {
          lab: '护士',
          val: ''
        },
        {
          lab: '医助',
          val: ''
        },
        {
          lab: '预约单号',
          val: ''
        },
        {
          lab: '缴费方式',
          val: ''
        },
        {
          lab: '会员等级',
          val: ''
        },
        {
          lab: '是否已发短信',
          val: '',
          width: 150
        },
        {
          lab: '操作',
          val: ''
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
    margin-right: 15px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
</style>
