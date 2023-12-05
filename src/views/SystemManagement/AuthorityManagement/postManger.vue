<template>
  <!-- 岗位添加 -->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="container">
          <div class="postManger-box">
            <div class="dept-table">
              <sg-table
                v-if="true"

                selection
                border
                size="mini"
                :table-data="tableData"
                :columns="columns"
                :operate="operate"
                :pagination="pagination"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="handleSelectionChange"
                @operateClick="operateClick"
                @changeImg="changeImg"
                :hideSearchBar="hideSearchBar"
              >
                <div slot="searchBar" style="display: flex;align-items: center">
                  <div style="display: inline-block;margin-right: 10px;margin-top: -13px">
                    <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                  </div>
                  <el-form ref="searchForm" :model="searchData" :inline="true" size="mini" :show-message="false">
                    <el-form-item label="岗位编码" prop="postCode">
                      <el-input v-model="searchData.postCode" placeholder="请输入岗位编码" />
                    </el-form-item>
                    <el-form-item label="岗位名称" prop="postName">
                      <el-input v-model="searchData.postName" placeholder="请输入岗位名称" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="searchData.status" placeholder="岗位状态" filterable clearable size="small">
                        <el-option
                          v-for="dict in dict.type.sys_normal_disable"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button icon="el-icon-search" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div slot="header">
                  <el-button size="mini" plain icon="el-icon-plus" type="primary" @click="handleAdd" :disabled="addBan" v-hasPermi="['system:postManger:add']">新增</el-button>
                  <el-button size="mini" plain icon="el-icon-delete" :disabled="multiple" type="danger" @click="handleDelete" v-hasPermi="['system:postManger:remove']">批量删除
                  </el-button>
                  <el-button size="mini" plain icon="el-icon-upload2" type="info" @click="handleExport" v-hasPermi="['system:postManger:daochu']">导出</el-button>
                </div>
                <template #custom="data">
                  <div v-if="data.props === 'status'">
                    <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
                  </div>
                </template>
              </sg-table>
            </div>
            <sg-dialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
              <div slot="out">
                <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="80px">
                  <el-form-item label="归属公司" prop="deptId">
                    <treeselect v-model="form.deptId" :disable-branch-nodes="true" :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />
                  </el-form-item>
                  <el-form-item label="岗位名称" prop="postName">
                    <el-input v-model="form.postName" placeholder="请输入岗位名称" />
                  </el-form-item>
                  <el-form-item label="岗位编码" prop="postCode">
                    <el-select v-model="form.postCode" filterable style="width: 100%;" placeholder="请选择编码">
                      <el-option
                        v-for="dict in dict.type.post_code"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="岗位顺序" prop="postSort">
                    <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
                  </el-form-item>
                  <el-form-item label="岗位状态" prop="status">
                    <el-radio-group v-model="form.status">
                      <el-radio
                        v-for="dict in dict.type.sys_normal_disable"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入内容" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm">确认</el-button>
                    <el-button @click="showDialog = false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </sg-dialog>
          </div>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>

import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
import Treeselect from '@riophae/vue-treeselect'
export default {
  name: 'PostManger',
  dicts: ['sys_normal_disable', 'post_code'],
  components: {
    sgTable,
    sgDialog,
    Treeselect,
    Tree
  },
  data() {
    return {
      deptName: undefined,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 加载遮罩层
      loadingData: false,
      loading: false,
      // 弹窗
      dialogTitle: undefined,
      showDialog: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 搜索表单
      searchData: {
        deptId: undefined,
        postName: undefined,
        postCode: undefined,
        status: '0'
      },
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 表单数据
      form: {},
      // 表单校验规则
      rules: {
        postName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: '岗位编码不能为空', trigger: 'blur' }
        ],
        postSort: [
          { required: true, message: '岗位顺序不能为空', trigger: 'blur' }
        ]
      },
      operate: {
        name: '操作',
        width: '140',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:postManger:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['system:postManger:remove']
          }
        ]
      },
      columns: [
        {
          lab: '岗位编号',
          val: 'postId',
          width: 100
        },
        {
          lab: '岗位编码',
          val: 'postCode'
        },
        {
          lab: '岗位名称',
          val: 'postName'
        },
        {
          lab: '岗位排序',
          val: 'postSort'
        },
        {
          lab: '备注',
          val: 'remark',
          showOverflowTooltip: true
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status',
          width: 100
        },
        {
          lab: '创建时间',
          val: 'createTime',
          width: 145
        }
      ],
      tableData: [],
      hideSearchBar:false,
      addBan:true
    }
  },
  watch: {
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
    // this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
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
    changeImg(e){
      this.hideSearchBar=!e
    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.searchData.deptId=id
        this.addBan = false
        this.getData()
      }

    },
    /** 查询公司下拉树结构 */
    getTreeselect() {
      this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点点击事件
    handleNodeClick(data) {
      if ('children' in data) {
        console.log('只能点击根节点')
      } else if (this.searchData.deptId !== data.id) {
        this.searchData.deptId = data.id
        this.getData(true)
      }
    },
    resetForm(formName) {
      if (formName) {
        this.$refs[formName].resetFields()
        this.searchData = {
          postName: undefined,
          postCode: undefined,
          status: undefined
        }
        this.getData(true)
      } else {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
        this.form = {
          postId: undefined,
          postCode: undefined,
          postName: undefined,
          postSort: 0,
          status: '0',
          remark: undefined
        }
      }
    },
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        // console.log(this.deptId,'ddd')
        if (this.searchData.deptId==undefined){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.loadingData = true
      this.$api.post.postList({ ...this.searchData, ...this.pagination }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    /** 操作*/
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },

    /** 修改*/
    async handleUpdate(row) {
      const postId = row.postId || this.ids
      await this.$api.post.getPost(postId).then(res => {
        if (res) {
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
          })
          this.dialogTitle = '修改岗位'
          this.showDialog = true
        }
      })
    },

    // 表单多选
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.postId)
      this.single = selection[1].length !== 1
      this.multiple = !selection[1].length
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 添加
    async handleAdd() {
      this.$nextTick(() => {
        this.resetForm()
        this.form.deptId = this.searchData.deptId
      })
      this.dialogTitle = '添加岗位'
      this.showDialog = true
    },
    /** 提交表单*/
    async submitForm() {
      await this.$refs['form'].validate(valid => {
        if (valid) {
          this.$api.post.postOperate(this.form, this.form.postId ? 'put' : 'post').then(async res => {
            if (res) {
              this.$message.success(res.msg)
              await this.getData(true)
              this.showDialog = false
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      const postIds = row.postId || this.ids
      this.$confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.post.postOperate({}, 'delete', row.postId || this.ids).then(res => {
          if (res) {
            this.getData(true)
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    /** 导出按钮操作 */
    async handleExport() {
      await this.$api.post.exportPost(this.searchData)
    }
  }
}
</script>

<style scoped lang="scss">
.date-picker {
  width: 260px;
}
.container{
  .postManger-box {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
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
      width: calc(100% - 0px);
    }
  }
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
