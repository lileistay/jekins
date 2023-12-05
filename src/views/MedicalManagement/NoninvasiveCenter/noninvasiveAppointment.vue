<template>
  <!--无创预约-->
  <div class="container">
    <sg-table
      size="mini"
      selection
      border
      :search-bar-style="SearchBarStyle"
      highlight-current-row
      :header-style="{'backgroundColor':'#587fa1'}"
      :pagination="pagination"
      :table-data="tableData"
      :columns="columns"
    >
      <div slot="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="姓名：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
              <el-form-item label="无创病历：">
                <el-input />
              </el-form-item>
              <el-form-item label="是否已治疗：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
              <el-form-item label="门诊病历：">
                <el-input />
              </el-form-item>
              <el-form-item label="项目：">
                <el-input />
              </el-form-item>
              <el-form-item label="归属客户代表：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="会员等级：">
                <el-select filterable>
                  <el-option />
                </el-select>
              </el-form-item>
              <el-form-item label="服务助理：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否有效：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="医生：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="仪器：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否已接诊：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否已排期：">
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
              <el-form-item label="归属客户代表：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="预约美学顾问：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否已短信：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="下单日期：">
                <el-input style="width: 45%" />
                -
                <el-input style="width: 45%" />
              </el-form-item>
              <el-form-item label="预约日期：" label-width="140px">
                <el-date-picker
                  style="width: 100%"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button size="mini" icon="el-icon-search" type="primary">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>总数：</span>
          <span><i style="background-color:#fde5d4 " />已接诊：0</span>
          <span><i style="background-color: #aad7fd" />已排期：0</span>
          <span><i style="background-color:#c6f9c3" />已治疗：0</span>
        </div>
        <div>
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus">预约批量发送短信</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus">批量发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus">手工上报</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus">等级预约</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close">取消预约</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus">等级预约(全屏)</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'NoninvasiveAppointment',
  components: {
    SgTable
  },
  data() {
    return {
      SearchBarStyle: {
        height: '160px'
      },
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
          lab: '是否导员',
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
          lab: '服务助理',
          val: ''
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
          lab: '门诊病历',
          val: ''
        },
        {
          lab: '无创病历',
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
          lab: '医助',
          val: ''
        },
        {
          lab: '护士',
          val: ''
        }
      ]
    }
  },
  methods: {

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
    margin-right: 20px;
    font-size: 12px;
    & i{
      display: inline-block;
      width:10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
