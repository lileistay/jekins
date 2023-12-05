<template>
  <!-- 产品套餐信息审核 -->
  <div>
    <SgTable
      :columns="columns"
      index="序号"
      :table-data="tableData"
      border
      :pagination="pagination"
      selection
    >
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="100px">
          <el-row>
            <el-col :span="3">
              <el-form-item label="套餐代码">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="套餐名称">
                <el-input />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="套餐简码">
                <el-input />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="套餐状态">
                <el-input />
              </el-form-item>

            </el-col>
            <el-col :span="3">
              <el-form-item label="产品名称">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>

            </el-col>

            <el-col :span="9">
              <el-row type="flex" justify="end">
                <el-button size="mini">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="hrader">
        <div class="title">
          待审核产品项目列表查询
          <span>总数：</span>
        </div>

      </div>

    </SgTable>
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
      columns: [
        {
          lab: '套餐代码',
          val: 'operation'
        },
        {
          lab: '套餐名称',
          val: 'typeThreeName'
        },
        {
          lab: '产品项目分类',
          width: 130,
          val: 'dsingleTime'
        },
        {
          lab: '套餐描述',
          val: 'createTime'
        },

        {
          lab: '产品名称',
          val: 'one'
        },
        {
          lab: '套餐价格',
          val: 'two'
        },

        {
          lab: '是否打折',
          val: 'Productunit'
        },
        {
          lab: '是否下架',
          val: 'frequency'
        },
        {
          lab: '操作',
          val: 'Discount'
        }
      ],
      // dialogVisible: false,//显示弹层
      pagination: {
        show: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.title{
  font-size: 14px;
  color: #fffffc;
  padding-left: 8px;
}
</style>
