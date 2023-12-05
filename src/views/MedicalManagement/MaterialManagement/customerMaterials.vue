<template>
  <!--客户物资-->
  <div class="coneter">
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
      <div slot="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="3">
              <el-form-item label="姓名：">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="客户卡号：">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="开单美学顾问：">
                <el-select filterable></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="物资类型：">
                <el-select filterable></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="物资名称：">
                <el-select filterable></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="收费单号：">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-row type="flex" justify="end"> <el-button size="mini">搜索</el-button></el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div></div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  name: "customerMaterials",
  components: {
    SgTable
  },
  data() {
    return {
      columns: [
        {
          lab: '收费单号',
          val: ''
        },
        {
          lab: '开单美学顾问',
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
          lab: '物资类型',
          val: ''
        },
        {
          lab: '物资名称',
          val: ''
        },
        {
          lab: '单位',
          val: ''
        },
        {
          lab: '总数量',
          val: ''
        },
        {
          lab: '已领取',
          val: ''
        },
        {
          lab: '已使用',
          val: ''
        },
        {
          lab: '剩余数量',
          val: ''
        },
        {
          lab: '操作',
          val: ''
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
.header {
  width: 100%;
  background-color: red;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
</style>