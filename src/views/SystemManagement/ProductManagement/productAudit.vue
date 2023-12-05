<template>
  <!-- 产品信息审核 -->
  <div>
    <SgTable
      :table-data="tableData"
      :columns="columns"
      index="序号"
      border
      :pagination-style="{backgroundColor:'#fff'}"
      :pagination="pagination"
      selection
    >
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="100px">
          <el-row>
            <el-col :span="3">
              <el-form-item label="产品项目分类">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="二级项目">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="价格1">
                <el-input />
              </el-form-item>
              <el-form-item label="三级项目">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="价格2">
                <el-input />
              </el-form-item>
              <el-form-item label="产品名称">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="次数">
                <el-input />
              </el-form-item>
              <el-form-item label="业务类型">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="是否打折">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否重点产品">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="折扣">
                <el-input />
              </el-form-item>
              <el-form-item label="科室">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="一级项目">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="费用类型">
                <el-select filterable>
                  <el-option>是</el-option>
                  <el-option>否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-row type="flex" justify="end">
                <el-button size="mini">搜索</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="hrader">
        <div>
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
          lab: '操作',
          val: 'operation'
        },

        {
          lab: '产品',
          val: 'typeThreeName'
        },

        {
          lab: '产品项目分类',
          val: 'dsingleTime',
          width: 140
        },
        {
          lab: '产品代码',
          val: 'createTime'
        },
        {
          lab: '一级',
          val: 'one'
        },
        {
          lab: '二级',
          val: 'two'
        },
        {
          lab: '三级',
          val: 'three'
        },
        {
          lab: '价格1',
          val: 'Priceone'
        },
        {
          lab: '价格2',
          val: 'Pricetwo'
        },
        {
          lab: '产品单位',
          val: 'Productunit'
        },
        {
          lab: '次数',
          val: 'frequency'
        },
        {
          lab: '是否打折',
          val: 'Discount'
        },
        {
          lab: '折扣',
          val: 'discount'
        },
        {
          lab: '状态',
          val: 'state'
        },
        {
          lab: '科室',
          val: 'Department'
        },
        {
          lab: '费用类型',
          val: 'ExpenseType'
        },
        {
          lab: '业务类型',
          val: 'BusinessType'
        },
        {
          lab: '是否重点产品',
          width: 130,
          val: 'Keyproducts'
        },
        {
          lab: '自定义分类',
          width: 130,
          val: 'Customclassification'
        }
      ],
      // dialogVisible: false,//显示弹层
      pagination: {
        show: true
      } // 显
    }
  }
}
</script>

<style scoped lang="scss">
</style>
