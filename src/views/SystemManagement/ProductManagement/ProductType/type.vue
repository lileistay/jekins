<template>
  <!-- 产品类型二级 -->
  <div>
    <sg-table
      v-if="true"
      
      :hide-search-bar="true"
      :table-data="tableData"
      :pagination="pagination"
      :columns="columns"
      :operate="operate"
      selection
      @operateClick="operateClick"
    >
      <div slot="header" style="display: flex;align-items: center">
        <div style="display: inline-block;margin-right: 10px">
          <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
        </div>
        <el-button
          size="mini"
          plain
          icon="el-icon-plus"
          type="primary"
          @click.stop="handleAdd"
        >新增</el-button>
        <el-button
          size="mini"
          plain
          icon="el-icon-delete"
          type="danger"
          @click.stop="handleDelete"
        >删除</el-button>

      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
        <div v-else-if="data.props === 'projectTypeName'">
          <a @click="treeOpen(data.custom)">{{ data.custom.projectTypeName }}</a>
          <!-- <el-button size="mini"
                     @click="treeOpen(data.custom)">{{ data.custom.projectTypeName}}</el-button> -->
        </div>
      </template>
    </sg-table>
    <sgDialog
      :title="dialogTitle"
      :dialog="showDialog"
      size="400px"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          size="mini"
          label-width="100px"
        >

          <el-form-item label="项目类型：" prop="projectTypeName">
            <el-input v-model="form.projectTypeName" placeholder="请输入项目类型" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
            <el-button @click="showDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import sgTable from '@/components/Table/index'
import sgDialog from '@/components/Dialog/index'
export default {
  name: 'BookProjectType',
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog
  },
  props: {
    deptId: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 加载
      loadingData: false,
      trans:'rotate(-180deg)',
      // 表格数据
      tableData: [],

      dialogTitle: undefined,
      showDialog: false,
      // 表单数据
      form: {

        projectTypeName: '', // 项目名称
        status: 0
      },
      // 表单校验
      rules: {
        projectTypeName: [
          { required: true, message: '项目类型不能为空', trigger: 'blur' }
        ]
      },
      // 多选数据
      ids: [],
      // 分页 搜索
      pagination: {
        show: true,
        projectTypeName: undefined,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning'
          },
          {
            lab: '删除',
            type: 'danger'
          }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '编号',
          val: 'projectTypeId',
          width: 100
        },
        {
          lab: '项目类型',
          val: 'projectTypeName',
          custom: 'projectTypeName'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        }

      ]
    }
  },
  created() {
    this.TypeList(this.deptId.departmentId);
    this.$nextTick(function (){
      let int=parseInt(getComputedStyle(document.querySelector('.TreeLeft'),null).width);
      if(int==250){
        this.trans='rotate(-180deg)'
      }else{
        this.trans='rotate(0deg)'
      }
    })
  },

  methods: {
    fold(){
      if(this.trans=='rotate(-180deg)'){
        this.trans='rotate(0deg)'
        this.$emit('fold','0px')
      }else{
        this.trans='rotate(-180deg)'
        this.$emit('fold','250px')
      }

    },
    treeOpen(node) {
      this.$emit('updata', node)
    },
    handleAdd() {
      this.showDialog = true
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加项目类型'
      })
    },
    // 关闭弹层
    handleClose() {
      this.showDialog = false
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 删除
    handleDelete(e) {
      // departmentId
      const projectTypeIds = e.projectTypeId
      this.$confirm('是否删除此条数据？').then(async() => {
        await this.$api.dept.addType({}, 'delete', projectTypeIds).then((res) => {
          if (res) {
            this.$message.warning('删除成功')
            this.TypeList(this.deptId.departmentId)
          }
        })
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.dept.addType({}, 'get', e.projectTypeId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改类型'
          })
        }
      })
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 重置表单
    resetForm(form) {
      if (form) {
        this.pagination = {
          pageNum: 1,
          pageSize: 20,
          show: true,
          total: 0,
          peojectName: undefined
        }
      } else {
        this.$refs.form.resetFields()
        this.form = {
          projectTypeName: undefined,
          status: '0'
        }
      }
    },
    resetFormSearch() {
      this.pagination.peojectName = undefined
      this.getData(true)
    },
    // 点击确定按钮
    async submitForm() {
      await this.$refs.form.validate(async(isOk) => {
        if (isOk) {
          if (this.form.departmentId) {
            await this.$api.dept.addType(this.form, 'put').then((res) => {
              if (res) {
                this.$message.success('修改成功')
                this.showDialog = false// 关闭弹层
                this.TypeList(this.deptId.departmentId)
              }
            })
          } else {
            await this.$api.dept.addType({ ...this.form, departmentId: this.deptId.departmentId }, 'post').then((res) => {
              if (res) {
                this.$message.success('添加成功')
                this.showDialog = false// 关闭弹层
                this.TypeList(this.deptId.departmentId)
              }
            })
          }
        }
      })
    },
    // 获取列表
    async TypeList(id) {
      if (id) {
        await this.$api.dept.TypeList({ departmentId: id }, 'get').then((res) => {
          if (res) {
            this.tableData = res.rows
            this.pagination.total = res.total
          }
        })
      }
    }
  }

  // methods: {
  //   // 表单选择
  //   handleSelectionChange (selection) {
  //     this.ids = selection[1].map(item => item.projectTypeId)
  //   },
  //   // 分页
  //   sizeChange (e) {
  //     this.pagination.pageSize = e[1]
  //     this.getData()
  //   },
  //   currentChange (e) {
  //     this.pagination.pageNum = e[1]
  //     this.getData()
  //   },
  //   // 操作列
  //   operateClick (e) {
  //     switch (e[0].lab) {
  //       case '修改':
  //         this.handleUpdate(e[1])
  //         break
  //       case '删除':
  //         this.handleDelete(e[1])
  //     }
  //   },
  //   // 添加
  //   handleAdd () {
  //     this.showDialog = true
  //     this.$nextTick(() => {
  //       this.resetForm()
  //       this.dialogTitle = '添加预约项目类型'
  //     })
  //   },
  //   // 修改
  //   async handleUpdate (e) {
  //     await this.$api.modules.bookProject.BookDeptProjectTypeOperate({}, 'get', e.projectTypeId).then(res => {
  //       if (res) {
  //         this.showDialog = true
  //         this.$nextTick(() => {
  //           this.resetForm()
  //           this.form = res.data
  //           this.dialogTitle = '修改预约项目类型'
  //         })
  //       }
  //     })
  //   },
  //   // 删除
  //   handleDelete (e) {
  //     const projectTypeId = e.projectTypeId || this.ids
  //     this.$confirm('是否确认删除编号为"' + projectTypeId + '"的数据项？', '警告', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(async () => {
  //       await this.$api.modules.bookProject.BookDeptProjectTypeOperate({}, 'delete', projectTypeId).then(res => {
  //         if (res) {
  //           this.getData()
  //           this.$message.success(res.msg)
  //         }
  //       })
  //     }).catch(() => {

  //     })
  //   },
  //   // 关闭弹窗
  //   handleClose () {
  //     this.showDialog = false
  //   },

  //   resetFormSearch () {
  //     this.pagination.projectTypeName = undefined
  //     this.getData(true)
  //   },
  //   // 获取数据
  //   async getData (isSearch) {
  //     if (isSearch) {
  //       this.pagination.pageNum = 1
  //     }
  //     this.loadingData = true
  //     await this.$api.modules.bookProject.getBookDeptProjectTypeList(this.pagination).then(res => {
  //       if (res) {
  //         this.tableData = res.rows
  //         this.pagination.total = res.total
  //       }
  //     }).finally(() => {
  //       this.loadingData = false
  //     })
  //   },
  //   // 提交表单
  //   async submitForm () {
  //     await this.$refs.form.validate(async valid => {
  //       if (valid) {
  //         this.form.departmentId = this.pagination.departmentId
  //         await this.$api.modules.bookProject.BookDeptProjectTypeOperate(this.form, this.form.projectTypeId !== undefined ? 'put' : 'post').then(res => {
  //           if (res) {
  //             this.$message.success(res.msg)
  //             this.showDialog = false
  //             this.getData()
  //           }
  //         })
  //       }
  //     })
  //   }
  // }
}
</script>
