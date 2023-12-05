<template>
  <!-- 产品自定义分类 -->
  <el-scrollbar>
    <div class="box">
      <SgTable
        :columns="columns"
        :table-data="tableData"
        border
        :pagination-style="{backgroundColor:'#fff'}"
        :pagination="pagination"
        selection
        @selection-change="handleSelectionChange"
      >
        <div slot="searchBar" class="searchBar">
          <el-form size="mini" label-width="100px">
            <el-row>
              <el-col :span="4">
                <el-form-item label="自定义编码">
                  <el-input v-model="formData.productCustomTypeId" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="是否显示">
                  <el-select filterable v-model="formData.status" value="" clearable>
                    <el-option
                      v-for="item in dict.type.sys_show_hide"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-row type="flex" justify="end">
                  <el-button size="mini" @click="ProductList">搜索</el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="header" class="hrader">
          <div>
            <el-button
              v-hasPermi="['productCustomization:add']"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              plain
              @click.stop="putBtn"
            >新增
            </el-button>
            <el-button
              v-hasPermi="['productCustomization:remove']"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="Butdelete"
            >删除
            </el-button>
          </div>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'status'">
            <dict-tag :options="dict.type.sys_show_hide" :value="data.custom.status" />
          </div>
          <div v-if="data.props === 'concerns'">
            <el-button size="mini" @click="Putproduct(data.custom)">编辑</el-button>
            <!--          <a @click="treeOpen(data.custom)">编辑</a>-->
          </div>
        </template>
      </SgTable>
      <!-- 点击新增显示弹层 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        @close="Productclose"
      >
        <el-form
          ref="form"
          label-width="130px"
          :rules="rules"
          :model="form"
          size="small "
        >
          <el-form-item label="自定义类型名称" prop="productCustomTypeName">
            <el-input v-model="form.productCustomTypeName" style="width:50%" />
          </el-form-item>
          <el-form-item label="自定义类型描述">
            <el-input v-model="form.remark" style="width:50%" />
          </el-form-item>
          <el-form-item label="是否显示" prop="status">
            <!--          <el-select v-model="form.status" size="mini">-->
            <!--            <el-option v-for="item in dict.type.sys_show_hide" :key="item.value" :value="item.value" :label="item.label"></el-option>-->
            <!--          </el-select>-->
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_show_hide"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Productclose">取 消</el-button>
          <el-button type="primary" @click="addDetermine">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>
<script>

import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖

export default {
  name: 'ProductCustomization',
  dicts: ['sys_show_hide'],
  components: {
    SgTable
  },
  data() {
    return {
      tableData: [],
      formData: {
        productCustomTypeId: '', // 自定义编码
        status: '' // 是否显示
      },
      form: {
        productCustomTypeName: '', //  自定义类型名称
        remark: '', // 自定义类型描述
        status: '0' // 状态
      },
      columns: [
        // {
        //   lab: '自定义类型编码',
        //   val: 'productCustomTypeId'
        // },
        {
          lab: '自定义类型名称',
          width: 130,
          val: 'productCustomTypeName'
        },

        {
          lab: '自定义类型描述',
          val: 'remark',
          width: 140
        },
        {
          lab: '显示/隐藏',
          width: 130,
          val: 'status',
          custom: 'status'
        },
        {
          lab: '操作',
          val: 'concerns',
          custom: 'concerns'
        }

      ],
      selectionData: [],
      dialogVisible: false, // 显示弹层
      rules: {
        productCustomTypeName: [
          { required: true, message: '请输入产品类型编码', trigger: 'blur' }
        ]
        // status: [
        //   { required: true, message: '请输入是否显示', trigger: 'change' }
        // ]
      },
      pagination: {
        show: true
      } // 显示底部分页组件
    }
  },
  created() {
    this.ProductList()
  },
  methods: {
    // 新增按钮
    putBtn() {
      this.dialogVisible = true
    },
    // 点击删除按钮
    Butdelete() {
      if (this.selectionData < 1) {
        this.$message.warning('请选择一项后删除')
        return
      }
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const productCustomTypeIds = this.selectionData.map(item => item.productCustomTypeId)
        this.$api.product.productCustomRemove(productCustomTypeIds).then((res) => {
          if (res) {
            this.$message.success(res.msg)
            this.ProductList()
          }
        })
      }).catch(() => {
      })
    },
    // 获取数据列表
    ProductList: debounce(function() {
      this.$api.product.productCustomList(this.formData).then((res) => {
        if (res) {
          this.tableData = res.rows
        }
      })
    }),
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 编辑按钮
    Putproduct(selectios) {
      const productCustomTypeId = selectios.productCustomTypeId
      this.$api.product.productCustominfo(productCustomTypeId).then((res) => {
        if (res) {
          this.form = res.data
        }
      })
      this.dialogVisible = true
    },
    // 点击取消后
    Productclose() {
      this.$refs.form.clearValidate() // 重置表单校验
      this.form = {
        productCustomTypeName: '', //  自定义类型名称
        remark: '', // 自定义类型描述
        status: '0' // 状态
      }
      this.dialogVisible = false // 关闭弹层
    },
    // 点击确定按钮
    addDetermine() {
      this.$refs.form.validate((isOk) => {
        if (isOk) {
          if (this.form.productCustomTypeId) {
            // 编辑状态
            this.$api.product.productCustomedit(this.form).then((res) => {
              if (res) {
                this.$message.success('修改成功')
                this.dialogVisible = false // 关闭弹层
                this.ProductList() // 重新拉取数据
              }
            })
          } else {
            // 添加状态
            this.$api.product.productCustomAdd(this.form).then((res) => {
              if (res) {
                this.$message.success('添加成功')
                this.ProductList() // 添加成功后重新拉取列表
              }
            })
          }
          this.dialogVisible = false // 关闭弹层
        }
      })
    }
  }
}
</script>

<style lang="scss">
.hrader {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.box {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.el-dialog__header {
  background-color: #1abc9c !important;
}
</style>
