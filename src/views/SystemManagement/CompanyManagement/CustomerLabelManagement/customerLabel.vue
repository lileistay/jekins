<template>
  <!-- 类型名称 -- - >标签名称 -->
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
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="handleSelectionChange"
    >
      <div slot="header">
        <el-button size="mini" plain icon="el-icon-plus" type="primary" @click.stop="handleAdd">新增</el-button>
        <el-button size="mini" :disabled="ids.length<=0" plain icon="el-icon-delete" type="danger" @click.stop="handleDelete">删除</el-button>
        <el-input v-model="pagination.labelDataName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输入标签名称" />
        <el-button size="mini" type="primary" @click="getData(true)">搜索</el-button>
        <el-button size="mini" @click="resetFormSearch">重置</el-button>
      </div>
    </sg-table>
    <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="80px">
          <el-form-item label="标签名称" prop="labelDataName">
            <el-input v-model="form.labelDataName" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入备注" />
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
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  name: 'Label',
  components: {
    sgTable,
    sgDialog
  },
  data() {
    return {
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      dialogTitle: undefined,
      showDialog: false,
      // 表单数据
      form: {},
      ids: [],
      // 表单校验
      rules: {
        labelDataName: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
        ]
      },
      // 分页 搜索
      pagination: {
        show: true,
        labelDataName: undefined,
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
          lab: '标签编号',
          val: 'labelDataId'
        },
        {
          lab: '标签名称',
          val: 'labelDataName'
        },
        {
          lab: '备注',
          val: 'remark',
          // showOverflowTooltip: true
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ]
    }
  },
  created() {
    this.pagination.customerLabelTypeId = this.$route.query.customerLabelTypeId
    this.getData()
  },
  methods: {
    // 表单选择
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.labelDataId)
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
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
    // 添加
    handleAdd() {
      this.showDialog = true
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加标签'
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.modules.custLabel.custLabelById(e.labelDataId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改标签'
          })
        }
      })
    },
    // 删除
    handleDelete(e) {
      const labelDataId = e.labelDataId || this.ids
      this.$confirm('是否确认删除编号为"' + labelDataId + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.custLabel.custLabelOperate({}, 'delete', labelDataId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

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
          labelDataName: undefined
        }
      } else {
        this.$refs.form.resetFields()
        this.form = {
          labelDataName: undefined,
          status: '0'
        }
      }
    },
    resetFormSearch() {
      this.pagination.labelDataName = undefined
      this.getData(true)
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.loadingData = true
      this.$api.modules.custLabel.custLabelData(this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    // 提交表单
    async submitForm() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          this.form.customerLabelTypeId = this.pagination.customerLabelTypeId
          await this.$api.modules.custLabel.custLabelOperate(this.form, this.form.labelDataId !== undefined ? 'put' : 'post').then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialog = false
              this.getData()
            }
          })
        }
      })
    }
  }
}
</script>
