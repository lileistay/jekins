<template>
  <!--会所预约-->
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
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户姓名：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="门诊病历：">
                <el-input />
              </el-form-item>
              <el-form-item label="预约美学顾问：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="预约日期：">
                <el-date-picker
                  style="width: 100%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="项目：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="仪器：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="医生：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="是否已接诊：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否已排期：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否已发短息：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="下单日期：">
                <el-date-picker
                  style="width: 100%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="归属客户代表：" label-width="140px">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="中医病历：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="会员等级：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否有效">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否已治疗：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="归属美学顾问：">
                <el-select filterable/>
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
          <span>总人数：</span>
          <span><i style="background-color:#fde5d4" />已接诊：0</span>
          <span><i style="background-color:#aad7fd" />已排期：0</span>
          <span><i style="background-color:#c6f9c3" />已治疗：0</span>
          <span style="text-decoration: line-through"><i style="background-color:#ffff00" />已取消：0</span>
          <span>人数：</span>
        </div>
        <div>
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus">预约批量发送短信</el-button> -->
          <!-- <el-button size="mini" type="primary" icon="el-icon-position">批量发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus">手工上报</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">登记预约</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close">取消预约</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">登记预约(全屏)</el-button>
        </div>
      </div>
    </sg-table>
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
      tableData: [],
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
          val: '',
          width: 120
        },
        {
          lab: '是否到院',
          val: '',
          width: 150
        },
        {
          lab: '姓名',
          val: '',
          width: 120
        },
        {
          lab: '电话',
          val: ''
        },
        {
          lab: '卡号',
          val: ''
        },
        {
          lab: '性别',
          val: ''
        },
        {
          lab: '归属美学顾问',
          val: '',
          width: 150
        },
        {
          lab: '归属客户代表',
          val: '',
          width: 150
        },
        {
          lab: '预约美学顾问',
          val: '',
          width: 150
        },
        {
          lab: '医生',
          val: ''
        },
        {
          lab: '中医项目',
          val: '',
          width: 150
        },
        {
          lab: '预约项目',
          val: '',
          width: 150
        },
        {
          lab: '下单人',
          val: '',
          width: 120
        },
        {
          lab: '门诊病历',
          val: '',
          width: 150
        },
        {
          lab: '中医病历',
          val: '',
          width: 150
        },
        {
          lab: '下单日期',
          val: '',
          width: 150
        },
        {
          lab: '备注',
          val: ''
        },
        {
          lab: '仪器',
          val: '',
          width: 150
        },
        {
          lab: '医助',
          val: '',
          width: 150
        },
        {
          lab: '护士',
          val: ''
        },
        {
          lab: '预约单号',
          val: '',
          width: 120
        }
      ]
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
  }
  & i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
