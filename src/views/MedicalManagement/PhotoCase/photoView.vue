<template>
  <!--照片案例查看-->
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
      <div slot="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户姓名：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="案例描述：">
                <el-input />
              </el-form-item>
              <el-form-item label="案例添加时间：">
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
            </el-col>
            <el-col :span="3">
              <el-form-item label="一级项目：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="二级项目：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="三级项目：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="案例类型：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="案例添加人：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="实际执行人：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="结账时间：">
                <el-date-picker
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="项目名称：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户代表：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="美学顾问：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="案例标签">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-row type="flex" justify="end">
                <el-button size="mini" style="margin-left: 15px" type="primary" icon="el-icon-search">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>注：只显示【五星】案例数据</span>
        </div>
        <div />
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
          lab: '操作',
          val: ''
        },
        {
          lab: '客户姓名',
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
          lab: '项目名称',
          val: ''
        },
        {
          lab: '医生',
          val: ''
        },
        {
          lab: '案例描述',
          val: ''
        },
        {
          lab: '案例添加时间',
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
