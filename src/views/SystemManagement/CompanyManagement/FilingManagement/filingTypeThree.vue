<template>
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
    >
      <div slot="header">
        <el-button size="mini" plain icon="el-icon-plus" type="primary" @click.stop="handleAdd">新增</el-button>
        <el-input v-model="pagination.typeThreeName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输入类型名称" />
        <el-button size="mini" type="primary" @click="getData(true)">搜索</el-button>
        <el-button size="mini" @click="resetFormSearch">重置</el-button>
      </div>
    </sg-table>
    <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="80px">
          <el-form-item label="类型名称" prop="typeThreeName">
            <el-input v-model="form.typeThreeName" placeholder="请输入渠道类型名称" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
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
  name: 'FilingTypeThree',
  components: {
    sgTable,
    sgDialog
  },
  data() {
    return {
      submitLoading: false,
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      dialogTitle: undefined,
      showDialog: false,
      fatherType: undefined,
      fatherTypeone: undefined,
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        typeThreeName: [
          { required: true, message: '渠道类型名称不能为空', trigger: 'blur' }
        ]
      },
      // 分页 搜索
      pagination: {
        show: true,
        typeTwoName: undefined,
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
          lab: '三级类型编号',
          width: 130,
          val: 'typeThreeId'
        },
        {
          lab: '三级类型名称',
          width: 130,
          val: 'typeThreeName'
        },
        {
          lab: '备注',
          val: 'remark'
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
    let item = JSON.parse(sessionStorage.getItem('filingTypeThreeitem'))
    this.pagination.filingId = item.typeTwoId
    this.pagination.typeTwoId = item.typeTwoId
    this.fatherType = item.typeTwoId
    this.fatherTypeone = item.filingId
    this.getData()
  },
  methods: {
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
        this.dialogTitle = '添加三级建档类型'
        this.form.typeTwoId = this.fatherType
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.modules.filing.filingThreeOperate({}, 'get', e.typeThreeId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改三级建档类型'
          })
        }
      })
    },
    // 删除
    handleDelete(e) {
      this.$confirm('是否确认删除名称为"' + e.typeThreeName + '"的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.filing.filingThreeOperate({}, 'delete', e.typeThreeId).then(res => {
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
          filingId: this.fatherTypeone,
          typeTwoName: this.fatherType
        }
      } else {
        this.$refs.form.resetFields()
        this.form = {
          typeTwoName: undefined
        }
      }
    },
    resetFormSearch() {
      this.pagination.typeThreeName = undefined
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
      this.$api.modules.filing.FilingThreeList(this.pagination).then(res => {
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
          this.submitLoading = true
          await this.$api.modules.filing.filingThreeOperate(this.form, this.form.typeThreeId !== undefined ? 'put' : 'post').then(res => {
            if (res) {
              this.submitLoading = false
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
