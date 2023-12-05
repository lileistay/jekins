<template>
  <!--部门管理-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div >
          <sg-table
            size="mini"
            :table-data="tableData"
            :columns="columns"
            :operate="operate"
            :row-key="getRow"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :default-expand-all="isExpandAll"
            @operateClick="operateClick"
          >
            <div slot="searchBar" style="display: flex;align-items: center">
              <div style="display: inline-block;margin-right: 10px;">
                <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
              </div>
              <el-button v-hasPermi="['share:sectionInfo:add']" size="mini" plain type="primary" icon="el-icon-plus" :disabled="handleadd" @click="handleAdd">添加</el-button>
              <!--          部门：<el-input v-model="pagination.searchValue" clearable size="mini" class="header-search-item" style="width: 200px;" placeholder="请输入要搜索的部门名称" />-->
              <!--          <el-button icon="el-icon-search" size="mini" type="primary" @click="getData(true)">搜索</el-button>-->
              <!--          <el-button size="mini" @click="resetFormSearch">重置</el-button>-->
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
              </div>
            </template>
          </sg-table>
          <!--弹框-->
          <sgDialog :title="dialogTitle" size="400px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="80px">
                <el-form-item label="公司" prop="deptId">
                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" :disable-branch-nodes="true" placeholder="请选择归属公司" />
                </el-form-item>
                <el-form-item label="上级部门" prop="parentId">
                  <treeselect
                    v-model="form.parentId"
                    :options="menuOptions"
                    :normalizer="normalizer"
                    placeholder="选择上级部门"
                  />
                </el-form-item>
                <el-form-item label="部门名称" prop="sectionName">
                  <el-input v-model="form.sectionName" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in dict.type.sys_normal_disable"
                      :key="dict.value"
                      :label="dict.value"
                    >{{ dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                  <el-button @click="handleClose">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </sgDialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table'
import Treeselect from '@riophae/vue-treeselect'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  name: 'DepartmentManagement',
  dicts: ['sys_normal_disable'],
  components: {
    Tree,
    sgTable,
    Treeselect,
    sgDialog
  },
  data() {
    return {
      handleadd: true,
      deptName: undefined,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      submitLoading: false,
      dialogTitle: undefined,
      showDialog: false,
      // 折叠
      isExpandAll: false,
      // 分页 搜索
      pagination: {
        show: true,
        deptId: undefined,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      tableData: [],
      // 表单数据
      form: {
        deptId: '', // 公司
        parentId: null, // 上级部门
        sectionName: '', // 部门名称
        status: '0'
      },
      menuOptions: [],
      rules: {
        sectionName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不得为空', trigger: 'blur' }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '部门',
          val: 'sectionName'
        },
        {
          lab: '部门编码',
          val: 'sectionCode'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:sectionInfo:delete']
          },
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:sectionInfo:edit']
          }
        ]
      }
    }
  },
  // computed: {
  //   // eslint-disable-next-line vue/no-dupe-keys
  //   deptId: {
  //     get() {
  //       return this.$store.getters.departmentId
  //     },
  //     set(val) {
  //       val = this.$store.getters.departmentId
  //     }
  //   }
  // },
  watch: {
    deptId(val) {
      this.deptId = val
    },
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getData()
    this.getTreeselects()
  },
  methods: {
    fold(){
      if(this.trans=='rotate(-180deg)'){
        this.trans='rotate(0deg)'
        this.emitWidth='0px';
      }else{
        this.trans='rotate(-180deg)'
        this.emitWidth='250px';
      }

    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.handleadd = true
      }else {
        this.form.deptId=id
        this.pagination.deptId=id
        this.handleadd = false
        this.getData()
      }

    },
    // 获取数据
    getRow(row){
      return row.sectionId
    },
    getData: debounce(function(isSearch) {
      var data = {
        deptId: this.form.deptId
      }
      console.log(data,',,,')
      data = Object.assign(data, this.pagination)
      this.$api.post.sectionInfoList(data).then(res => {
        if (res && res.rows.length > 0) {
          this.tableData = this.handleTree(res.rows, 'sectionId')
        } else {
          this.tableData = []
        }
      })
      this.getTreeselect()
    }),
    /** 查询菜单下拉树结构 */
    async getTreeselect() {
      var dates = {
        deptId: this.form.deptId,
        status: '0'
      }
      await this.$api.post.sectionInfoList(dates).then(res => {
        if (res) {
          this.menuOptions = []
          const menu = { sectionId: 0, sectionName: '请选择', children: [] }
          menu.children = this.handleTree(res.rows, 'sectionId')
          this.menuOptions.push(menu)
        }
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.sectionId,
        label: node.sectionName,
        children: node.children
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.dialogTitle === '添加部门') {
            this.$api.post.sectionInfoAdd(this.form).then(res => {
              if (res) {
                this.showDialog = false
                this.$message.success(res.msg)
                this.getData()
                this.form = {
                  deptId: this.form.deptId, // 公司
                  parentId: null, // 上级部门
                  sectionName: '' // 部门名称
                }
              }
            })
          } else {
            this.$api.post.sectionInfoPut(this.form).then(res => {
              if (res) {
                this.showDialog = false
                this.$message.success(res.msg)
                this.getData()
                this.form = {
                  deptId: this.form.deptId, // 公司
                  parentId: null, // 上级部门
                  sectionName: '', // 部门名称
                }
              }
            })
          }
        }
      })
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '删除':
          this.handleDelete(e[1])
          break
        case '修改':
          this.handlecompile(e[1])
      }
    },
    handlecompile(e) {
      this.getTreeselect()
      this.dialogTitle = '修改部门'
      this.form = e
      this.showDialog = true
    },
    // 删除操作
    handleDelete(e) {
      const sectionId = e.sectionId
      this.$confirm('是否确认删除此条的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // await
        this.$api.post.sectionInfodelete(sectionId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.getData()
          }
        })
      }).catch(() => {
        console.log('成功了')
      })
    },
    // 关闭弹窗
    handleClose() {
      this.form = {
        deptId: this.form.deptId, // 公司
        parentId: '', // 上级部门
        sectionName: '' // 部门名称
      }
      this.showDialog = false
    },
    // 添加
    handleAdd() {
      this.getTreeselect()
      this.showDialog = true
      this.dialogTitle = '添加部门'
      // this.form.deptId = this.pagination.deptId
    },
    // 节点点击事件
    handleNodeClick(data) {
      // 判断是否在最底层
      if (data.children === undefined) {
        this.handleadd = false
      } else {
        this.handleadd = true
      }
      this.form.deptId = data.id
      if (this.pagination.deptId !== data.id) {
        this.pagination.deptId = data.id
        this.getData()
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 查询公司下拉树结构 */
    async getTreeselects() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
          this.getData()
        }
      })
    },
    resetFormSearch() {
      this.pagination.typeId = undefined
      this.getData(true)
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.department-list {
  width: 250px;
  padding: 5px;
  box-sizing: border-box;

  .down-tree {
    height: 730px;
    display: block;
    overflow-y: scroll;
  }

  .el-tree {
    background-color: #f8f8f8;
  }
}
.dept-table{
  width: calc(100% - 270px);
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
