<template>
  <!--整形预约-->
  <div class="container">
    <sg-table
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
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="姓名：">
                <el-input />
              </el-form-item>
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="住院病例：">
                <el-input />
              </el-form-item>
              <el-form-item label="整形病例：">
                <el-input />
              </el-form-item>
              <el-form-item label="预约日期：">
                <el-date-picker
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="归属美学顾问：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="归属客户代表：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否有效：">
                <el-select  filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="预约美学顾问：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已治疗：">
                <el-input />
              </el-form-item>
              <el-form-item label="是否已发短信：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否已排期：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="会员等级：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="下单日期：">
                <el-date-picker
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="项目：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已接诊：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-row type="flex" justify="end">
                <el-button size="mini">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
          <span><i style="background-color: #ffffff" />已接诊</span>
          <span><i style="background-color: #ffff00" />进行中</span>
          <span><i style="background-color: #c6f9c3" />已结束</span>
          <span style="text-decoration:line-through"><i style="background-color: #8f9295" />已结束</span>
        </div>
        <div>
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus">预约批量发送短信</el-button>
          <el-button size="mini" type="success" icon="el-icon-check">批量发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus">手术上报</el-button>
          <el-button size="mini" type="danger" icon="el-icon-refresh-right">登记预约</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus">取消预约</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'ShapingConvention',
  components: {
    SgTable
  },
  data() {
    return {
      tableData: [],
      pagination: {
        show: true
      },
      columns: [
        {
          lab: '操作',
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
          lab: '会员等级',
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
          val: ''
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
          lab: '住院病历',
          val: ''
        },
        {
          lab: '整形病历',
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
          lab: '麻醉方式',
          val: ''
        },
        {
          lab: '手术室',
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
          lab: '预约单号',
          val: ''
        },
        {
          lab: '缴费方式',
          val: ''
        },
        {
          lab: '是否已发短信',
          val: '',
          width: 120
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
  overflow: auto;
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
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
