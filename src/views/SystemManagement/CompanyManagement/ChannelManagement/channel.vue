<template>
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
        <el-button size="mini" plain icon="el-icon-plus" type="primary" @click.stop="handleAdd" >新增</el-button>
        <el-button size="mini" :disabled="ids.length<=0" plain icon="el-icon-delete" type="danger" @click.stop="handleDelete">删除</el-button>
        <el-input v-model="pagination.channelName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输入渠道名称" />
        <el-button size="mini" type="primary" @click="getData(true)">搜索</el-button>
        <el-button size="mini" @click="resetFormSearch">重置</el-button>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
      </template>
    </sg-table>
    <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="80px">
          <el-form-item label="渠道名称" prop="channelName">
            <el-input v-model="form.channelName" placeholder="请输入渠道名称" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item label="渠道状态" prop="status">
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
export default {
  name: 'Channel',
  dicts: ['sys_normal_disable'],
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
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        channelName: [
          { required: true, message: '渠道名称不能为空', trigger: 'blur' }
        ]
      },
      // 多选数据
      ids: [],
      // 分页 搜索
      pagination: {
        show: true,
        channelName: undefined,
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
          lab: '渠道编号',
          val: 'channelId'
        },
        {
          lab: '渠道名称',
          val: 'channelName'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
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
    this.pagination.typeId = this.$route.query.typeId
    this.getData()
  },
  methods: {
    // 表单选择
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.channelId)
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
        this.dialogTitle = '添加渠道'
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.modules.channel.getById(e.channelId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改渠道'
          })
        }
      })
    },
    // 删除
    handleDelete(e) {
      const channelId = e.channelId || this.ids
      this.$confirm('是否确认删除编号为"' + channelId + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.channel.operate({}, 'delete', channelId).then(res => {
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
          channelName: undefined
        }
      } else {
        this.$refs.form.resetFields()
        this.form = {
          channelName: undefined,
          status: '0'
        }
      }
    },
    resetFormSearch() {
      this.pagination.channelName = undefined
      this.getData(true)
    },
    // 获取数据
    getData(isSearch) {
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
      this.$api.modules.channel.list(this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    // 提交表单
    async submitForm() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          this.form.typeId = this.pagination.typeId
          await this.$api.modules.channel.operate(this.form, this.form.channelId !== undefined ? 'put' : 'post').then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialog = false
              this.submitLoading = false
              this.getData()
            }
          })
        }
      })
    }
  }
}
</script>
