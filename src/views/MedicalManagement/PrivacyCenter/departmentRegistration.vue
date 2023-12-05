<template>
  <!--科室治疗登记-->
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
              <el-form-item label="姓名：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="">
                <el-select filterable style="width: 45%" />-
                <el-select filterable style="width: 45%" />
              </el-form-item>
              <el-form-item label="">
                <el-select filterable style="width: 45%" />-
                <el-select filterable style="width: 45%" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="分诊时间：">
                <el-date-picker
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="治疗时间：">
                <el-date-picker
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="是否有退款：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="服务助理：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="是否填写分值：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="美学顾问：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="治疗状态：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="状态：">
                <el-select filterable value="" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="科室：">
                <el-select filterable value="" />
              </el-form-item>
              <el-form-item label="回访类型：">
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
          <span>治疗登记</span>
          <span><i style="background-color:#ffffff" />未安排</span>
          <span><i style="background-color:#c6f9c3" />已安排</span>
          <span><i style="background-color:#ffff00" />有退款</span>
          <span>人数：</span>
        </div>
        <div>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">客户需求</el-button>
          <!-- <el-button size="mini" plain type="primary" icon="el-icon-plus">发送短信</el-button> -->
          <el-button size="mini" plain type="danger" icon="el-icon-plus">手工上报</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-bank-card">护理分值</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-bank-card">医助分值</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">年卡</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">套餐</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">取消</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">发起治疗</el-button>
          <el-button size="mini" plain type="primary" icon="el-icon-plus">扫码签名</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'DepartmentRegistration',
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
          lab: '操作',
          val: ''
        },
        {
          lab: '客户',
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
          lab: '客户类型',
          val: ''
        },
        {
          lab: '门诊病历',
          val: ''
        },
        {
          lab: '状态',
          val: ''
        },
        {
          lab: '项目',
          val: ''
        },
        {
          lab: '回访类型',
          val: ''
        },
        {
          lab: '治疗状态',
          val: ''
        },
        {
          lab: '计划治疗次数',
          val: '',
          width: 120
        },
        {
          lab: '当此治疗次数',
          val: '',
          width: 120
        },
        {
          lab: '科室',
          val: ''
        },
        {
          lab: '医生',
          val: ''
        },
        {
          lab: '美学顾问',
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
          lab: '分诊人',
          val: ''
        },
        {
          lab: '分诊时间',
          val: ''
        },
        {
          lab: '分诊备注',
          val: ''
        },
        {
          lab: '治疗时间',
          val: ''
        },
        {
          lab: '是否有填写分值',
          val: '',
          width: 150
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
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
