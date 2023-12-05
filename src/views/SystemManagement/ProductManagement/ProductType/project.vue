<template>
  <!-- 产品类型三级 -->
  <div>
    <sg-table
      v-if="true"
      
      :hide-search-bar="true"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
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
      </template>
    </sg-table>
    <sgDialog
      :title="dialogTitle"
      size="400px"
      :dialog="showDialog"
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
          <el-form-item label="类目名称：" prop="categoryName">
            <el-input v-model="form.categoryName" placeholder="请输入项目名称" />
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
  name: 'BookProject',
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
        categoryName: '', // 类目名称
        status: 0 // 状态
      },
      // 表单校验
      rules: {
        categoryName: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ]
      },
      // // 多选数据
      // ids: [],
      // 分页 搜索
      pagination: {
        show: true,
        peojectName: undefined,
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
          val: 'categoryId',
          width: 100
        },
        {
          lab: '项目目录',
          val: 'categoryName'
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
    this.CategoryList(this.deptId.projectTypeId);
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
    //  添加
    handleAdd() {
      this.showDialog = true
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加类目'
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
      const categoryIds = e.categoryId
      this.$confirm('是否删除此条数据？').then(async() => {
        await this.$api.dept.addCategory({}, 'delete', categoryIds).then((res) => {
          if (res) {
            this.$message.warning('删除成功')
            this.CategoryList(this.deptId.projectTypeId)
          }
        })
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.dept.addCategory({}, 'get', e.categoryId).then(res => {
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
    // 点击确定
    async submitForm() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.form.projectTypeId) {
            await this.$api.dept.addCategory(this.form, 'put').then((res) => {
              if (res) {
                this.$message.success('修改成功')
                this.showDialog = false
                this.CategoryList(this.deptId.projectTypeId)
              }
            })
          } else {
            await this.$api.dept.addCategory({ ...this.form, projectTypeId: this.deptId.projectTypeId }, 'post').then((res) => {
              if (res) {
                this.$message.success('添加成功')
                this.showDialog = false
                this.CategoryList(this.deptId.projectTypeId)
              }
            })
          }
        }
      })
    },
    // 获取类目列表
    async CategoryList(id) {
      if (id) {
        await this.$api.dept.CategoryList({ projectTypeId: id }, 'get').then((res) => {
          if (res) {
            this.tableData = res.rows;
            this.pagination.total = res.total
          }
        })
      }
    }
  }
  // methods: {
  //   // 表单选择
  //   handleSelectionChange(selection) {
  //     this.ids = selection[1].map(item => item.bookingPeojectId)
  //   },
  //   // 分页
  //   sizeChange(e) {
  //     this.pagination.pageSize = e[1]
  //     this.getData()
  //   },
  //   currentChange(e) {
  //     this.pagination.pageNum = e[1]
  //     this.getData()
  //   },
  //   // 操作列
  //   operateClick(e) {
  //     switch (e[0].lab) {
  //       case '修改':
  //         this.handleUpdate(e[1])
  //         break
  //       case '删除':
  //         this.handleDelete(e[1])
  //     }
  //   },
  //   // 添加
  //   handleAdd() {
  //     this.showDialog = true
  //     this.$nextTick(() => {
  //       this.resetForm()
  //       this.dialogTitle = '添加预约项目'
  //     })
  //   },
  //   // 修改
  //   async handleUpdate(e) {
  //     await this.$api.modules.bookProject.BookProjectOperate({}, 'get', e.bookingPeojectId).then(res => {
  //       if (res) {
  //         this.showDialog = true
  //         this.$nextTick(() => {
  //           this.resetForm()
  //           this.form = res.data
  //           this.dialogTitle = '修改预约项目'
  //         })
  //       }
  //     })
  //   },
  //   // 删除
  //   handleDelete(e) {
  //     const bookingPeojectId = e.bookingPeojectId || this.ids
  //     this.$confirm('是否确认删除编号为"' + bookingPeojectId + '"的数据项？', '警告', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(async() => {
  //       await this.$api.modules.bookProject.BookProjectOperate({}, 'delete', bookingPeojectId).then(res => {
  //         if (res) {
  //           this.getData()
  //           this.$message.success(res.msg)
  //         }
  //       })
  //     }).catch(() => {

  //     })
  //   },
  //   // 关闭弹窗
  //   handleClose() {
  //     this.showDialog = false
  //   },
  //   // 重置表单
  //   resetForm(form) {
  //     if (form) {
  //       this.pagination = {
  //         pageNum: 1,
  //         pageSize: 20,
  //         show: true,
  //         total: 0,
  //         peojectName: undefined
  //       }
  //     } else {
  //       this.$refs.form.resetFields()
  //       this.form = {
  //         peojectName: undefined,
  //         status: '0'
  //       }
  //     }
  //   },
  //   resetFormSearch() {
  //     this.pagination.peojectName = undefined
  //     this.getData(true)
  //   },
  //   // 获取数据
  //   async getData(isSearch) {
  //     if (isSearch) {
  //       this.pagination.pageNum = 1
  //     }
  //     this.loadingData = true
  //     await this.$api.modules.bookProject.getBookProjectList(this.pagination).then(res => {
  //       if (res) {
  //         this.tableData = res.rows
  //         this.pagination.total = res.total
  //       }
  //     }).finally(() => {
  //       this.loadingData = false
  //     })
  //   },
  //   // 提交表单
  //   async submitForm() {
  //     await this.$refs.form.validate(async valid => {
  //       if (valid) {
  //         this.form.projectTypeId = this.pagination.projectTypeId
  //         await this.$api.modules.bookProject.BookProjectOperate(this.form, this.form.bookingPeojectId !== undefined ? 'put' : 'post').then(res => {
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

