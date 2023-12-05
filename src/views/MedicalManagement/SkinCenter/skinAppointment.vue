<template>
  <!--皮肤预约-->
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
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
              <el-form-item label="门诊病例：">
                <el-input />
              </el-form-item>
              <el-form-item label="皮肤病例：">
                <el-input />
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
            <el-col :span="4">
              <el-form-item label="姓名：">
                <el-input />
              </el-form-item>
              <el-form-item label="电话：">
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
              <el-form-item label="归属客户代表：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="预约美学顾问：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已发短信：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="线上客服：">
                <el-select filterable value="" />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="医助：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已接诊：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="项目：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="皮肤护理师：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已排期：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="服务助理：">
                <el-select filterable value="" />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="仪器：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否已治疗：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="归属美学：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否有效：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="会员等级：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" style="margin-left: 5px">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
          <span>总人数：6</span>
          <span><i style="background-color:#fde5d4" />已接诊</span>
          <span><i style="background-color:#aad7fd" />已排期</span>
          <span><i style="background-color:#c6f9c3" />已治疗</span>
          <span style="text-decoration: line-through"><i style="background-color:#fff8c6" />已取消</span>
          <span>人数：</span>
        </div>
        <div>
          <!-- <el-button size="mini" type="primary" icon="el-icon-edit-outline">预约批量发送短信</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus">批量发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus">手工上报</el-button>
          <el-button size="mini" type="primary" icon="el-icon-bank-card">登记预约</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close">取消预约</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus">登记预约(全屏)</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'SkinTreatment',
  components: {
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
          lab: '服务助理',
          val: ''
        },
        {
          lab: '医生',
          val: ''
        },
        {
          lab: '医助',
          val: '',
          width: 135
        },
        {
          lab: '皮肤护理师',
          val: '',
          width: 120
        },
        {
          lab: '下单人',
          val: ''
        },
        {
          lab: '美学顾问',
          val: '',
          width: 100
        },
        {
          lab: '归属客户代表',
          val: '',
          width: 135
        },
        {
          lab: '预约美学顾问',
          val: '',
          showOverflowTooltip: true,
          width: 135
        },
        {
          lab: '线上客服',
          val: '',
          width: 120
        },
        {
          lab: '预约项目',
          val: ''
        },
        {
          lab: '门诊病例',
          val: '',
          width: 135
        },
        {
          lab: '皮肤病例',
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
          lab: '备注',
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
          width: 120
        }
      ],
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
  overflow: auto;
}
.header {
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
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
