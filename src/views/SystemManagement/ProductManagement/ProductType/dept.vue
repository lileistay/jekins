<template>
  <!-- 产品类型一级 -->
  <div>
    <sg-table
      v-if="true"
      
      :hide-search-bar="true"
      :table-data="tableData"
      :pagination="pagination"
      :columns="columns"
      :operate="operate"
      @operateClick="operateClick"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="handleSelectionChange"
    >
      <div slot="header" style="display: flex;align-items: center">
        <div style="display: inline-block;margin-right: 10px">
          <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
        </div>

        <el-button
          v-has-permi="['share:departmentInfo:add']"
          size="mini"
          plain
          icon="el-icon-plus"
          type="primary"
          :disabled="btnDisabled"
          @click.stop="handleAdd"
        >新增</el-button>
        <el-button
          size="mini"
          plain
          icon="el-icon-refresh"
          type="primary"
          @click.stop="handleRefresh"
        >更新缓存</el-button>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
        <div v-if="data.props === 'isOperateDepartment'">
          <el-switch
  v-model="data.custom.isOperateDepartment"
  active-color="#13ce66"
  inactive-color="#ff4949" @change="change($event,data.custom)">
</el-switch>
        </div>
        
        <div v-else-if="data.props === 'departmentName'">
          <a @click="uptop(data.custom)">{{ data.custom.departmentName }}</a>
        </div>
        <div v-else-if="data.props === 'departmentType'">
          <dict-tag :options="dict.type.department_type" :value="data.custom.departmentType" />
        </div>
        <div v-else-if="data.props === 'isDepartment'">
          <dict-tag :options="dict.type.whether" :value="data.custom.isDepartment" />
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
          <el-form-item label="科室名称:" prop="departmentName">
            <el-input v-model="form.departmentName" placeholder="请输入科室名称" style="width: 240px" clearable/>
          </el-form-item>
          <el-form-item label="科室类型:" prop="departmentType">
            <el-select v-model="form.departmentType" filterable clearable>
              <el-option
                v-for="item in dict.type.department_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                placeholder="请选择科室类型"
                style="width: 240px"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否科室" prop="isDepartment">
            <el-radio-group v-model="form.isDepartment">
              <el-radio v-for="dict in dict.type.whether" :key="dict.value" :label="dict.value">{{ dict.label }}
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
  name: 'Department',
  dicts: ['sys_normal_disable', 'department_type', 'whether'],
  components: {
    sgTable,
    sgDialog
  },
  props: {
    deptId: {
      type: Number,
      default: null
    },
    btnDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled: true,
      trans:'rotate(-180deg)',
      // // 加载
      showDataDialog: false,
      // // 表格数据
      tableData: [],
      dialogTitle: undefined,
      showDialog: false, // 弹层控制
      // // 表单数据
      form: {
        projectTypeName: '',
        status: '0',
        departmentType: '',
        isDepartment: ''
      },
      // // 表单校验
      rules: {
        departmentName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ]
      },
      // 多选数据
      ids: [],
      // 分页 搜索
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:user:modify']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:departmentInfo:delete']
          }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '编号',
          val: 'departmentId',
          width: 100
        },
        {
          lab: '名称',
          val: 'departmentName',
          custom: 'departmentName'
        },
        {
          lab: '科室类型',
          val: 'departmentType',
          custom: 'departmentType'
        },
        {
          lab: '是否科室',
          val: 'isDepartment',
          custom: 'isDepartment'
        },
        {
          lab: '是否操作科室',
          val: 'isOperateDepartment',
          custom: 'isOperateDepartment'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        }
      ]
    }
  },
  watch: {
    async deptId(ne) {
      // eslint-disable-next-line vue/no-mutating-props
      this.btnDisabled = false
      await this.$api.dept.DepartmentList({ deptId: ne ,...this.pagination}, 'get').then((res) => {
        if (res) {
          res.rows.forEach(value=>{
            if(value.isOperateDepartment=='1'){
              value.isOperateDepartment=true
            }

          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }
  },
  created() {
    this.Department(this.deptId);
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
    change(e,row){
      this.$api.dept.Department({
              deptId: this.deptId,
              departmentId:row.departmentId,
              departmentType: row.departmentType,
              departmentName:row.departmentName,
              isOperateDepartment:row.isOperateDepartment==true?1:0
            },'put').then((res) => {
              if (res) {
                this.$message.success(res.msg)
                this.Department(this.deptId)
              }
            })
    console.log(e,row)
    },
    // 获取科室的数据
    Department(id) {
      // 如果值不为空再获取 不然会获取到所有的数据
      if (id) {
        this.showDataDialog = true
        this.$api.dept.DepartmentList({ deptId: id ,...this.pagination}, 'get').then((res) => {
          if (res) {
            res.rows.forEach(value=>{
              if(value.isOperateDepartment=='1'){
                  value.isOperateDepartment=true
              }
              
            })
            this.tableData = res.rows;
            this.pagination.total = res.total
          }
        }).finally(() => {
          this.showDataDialog = false
        })
      }
    },
    // 表单选择
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.bookingPeojectId)
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.Department(this.deptId)
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.Department(this.deptId)
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
    // 删除按钮
    handleDelete(e) {
      const departmentIds = e.departmentId
      this.$confirm('是否删除此条数据？').then(async() => {
        await this.$api.dept.DelectDepartment(departmentIds, 'DELETE').then((res) => {
          if (res) {
            this.$message.warning('删除成功')
            this.Department(this.deptId)
          }
        })
      })
    },
    handleRefresh() {
      this.$api.dept.refresh().then(res => {
        if (res) {
          this.$message.success('缓存更新成功！')
        }
      })
    },
    //   // 修改
    async handleUpdate(e) {
      await this.$api.dept.Department({}, 'get', e.departmentId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改科室'
          })
        }
      })
    },

    //     handleDelete(e) {
    //   const bookingPeojectId = e.bookingPeojectId || this.ids
    //   this.$confirm('是否确认删除编号为"' + bookingPeojectId + '"的数据项？', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async() => {
    //     await this.$api.modules.bookProject.BookProjectOperate({}, 'delete', bookingPeojectId).then(res => {
    //       if (res) {
    //         this.getData()
    //         this.$message.success(res.msg)
    //       }
    //     })
    //   }).catch(() => {

    //   })
    // },
    // 新增接口
    handleAdd() {
      this.showDialog = true// 打开弹层
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '新增'
      })
    },
    // 点击第二层后父元素接受一个自定义元素
    uptop(deptId) {
      this.$emit('xiehuan', deptId)
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
          projectTypeName: null,
          status: '0',
          isDepartment: '0'
        }
      }
    },
    resetFormSearch() {
      this.pagination.peojectName = undefined
      this.Department(true)
    },
    // 点击确定按钮
    async submitForm() {
      // 校验表单
      await this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          if (this.form.departmentId) {
            await this.$api.dept.Department(this.form, 'put').then((res) => {
              if (res) {
                this.showDialog = false// 关闭弹层
                this.Department(this.deptId)
              }
            })
          } else {
            await this.$api.dept.Department({
              status: this.form.status,
              departmentName: this.form.departmentName,
              deptId: this.deptId,
              isDepartment: this.form.isDepartment,
              departmentType: this.form.departmentType
            }, this.form.departmentId ? 'put' : 'post').then((res) => {
              if (res) {
                this.showDialog = false// 关闭弹层
                this.Department(this.deptId)
              }
            })
          }
          // deptId: this.deptId
          // this.form.projectTypeId = this.pagination.projectTypeId
        }
      })
    }
  }

}
</script>
