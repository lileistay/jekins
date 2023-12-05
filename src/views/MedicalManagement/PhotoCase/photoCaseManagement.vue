<template>
  <!--照片案例管理-->
  <div class="container">
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
              <el-form-item label="星级案例：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="案例添加人：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="实际治疗医生：">
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
              <el-form-item>
                <el-button size="mini" style="margin-left: 15px" type="primary" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div />
        <div>
          <el-button size="mini" type="primary" icon="el-icon-search">添加案列</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close">删除</el-button>
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
          lab: '客户类型',
          val: ''
        },
        {
          lab: '收费单编号',
          val: ''
        },
        {
          lab: '项目名称',
          val: ''
        },
        {
          lab: '案例星级',
          val: ''
        },
        {
          lab: '案例描述',
          val: ''
        },
        {
          lab: '案例添加人',
          val: ''
        },
        {
          lab: '案例添加时间',
          val: ''
        },
        {
          lab: '结账时间',
          val: ''
        },
        {
          lab: '治疗时间',
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
          lab: '客户代表',
          val: ''
        },
        {
          lab: '实际治疗医生',
          val: ''
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
    color: #ffffff;
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
