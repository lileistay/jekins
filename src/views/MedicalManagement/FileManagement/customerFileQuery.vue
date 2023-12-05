<template>
  <!--客户档案查询-->
  <div class="box">
    <sg-table
      :header-style="{backgroundColor:'#587fa1'}"
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
              <el-form-item label="客户姓名：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="会员等级：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-row type="flex" justify="end">
                <el-button size="mini" style="margin-left: 15px" type="primary" icon="el-icon-search">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>档案查询</span>
        </div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-search">手工上报</el-button>
          <el-button size="mini" type="primary" icon="el-icon-search">档案登记</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: 'FileQuery',
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
          lab: '会员等级',
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
          lab: '性别',
          val: ''
        },
        {
          lab: '门诊病历',
          val: ''
        },
        {
          lab: '住院病历',
          val: ''
        },
        {
          lab: '口腔病历',
          val: ''
        },
        {
          lab: '整形病历',
          val: ''
        },
        {
          lab: '皮肤病历',
          val: ''
        },
        {
          lab: '无创病历',
          val: ''
        },
        {
          lab: '中医病历',
          val: ''
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

  span {
    font-size: 14px;
    color: #ffffff;
    margin-right: 15px;
  }
  i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }

</style>
