<template>
  <!-- 类型名称 -->
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
        <el-button size="mini" plain icon="el-icon-plus" type="primary" @click.stop="handleAdd" v-hasPermi="['filingTypeOne:add']">新增</el-button>
        <el-input v-model="pagination.filingName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输入类型名称" />
        <el-button icon="el-icon-search" size="mini" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
        <el-button size="mini" @click="resetFormSearch">重置</el-button>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'filingName'">
          <a @click="filing(data)">{{ data.custom.filingName }}</a>
        </div>
      </template>
    </sg-table>
    <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="80px">
          <el-form-item label="类型名称" prop="filingName">
            <el-input v-model="form.filingName" placeholder="请输入一级建档类型名称" />
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
  name: 'FilingTypeOne',
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
      // 表单校验
      rules: {
        filingName: [
          { required: true, message: '渠道类型名称不能为空', trigger: 'blur' }
        ]
      },
      // 分页 搜索
      pagination: {
        show: true,
        filingName: undefined,
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
            permi: ['filingTypeOne:add']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['filingTypeOne:remove']
          }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '类型编号',
          val: 'filingId'
        },
        {
          lab: '类型名称',
          val: 'filingName',
          custom: 'filingName'
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
    this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    filing(data) {
      this.$router.push({ path: 'filingTypeTwo'})
      sessionStorage.setItem('filingTypeTwoitem',data.custom.filingId)
    },
    // 分页
    sizeChange(e) {
      this.searchBar.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.searchBar.pageNum = e[1]
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
        this.dialogTitle = '添加一级建档类型'
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.modules.filing.filingOneOperate({}, 'get', e.filingId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改一级建档类型'
          })
        }
      })
    },
    // 删除
    handleDelete(e) {
      this.$confirm('是否确认删除名称为"' + e.filingName + '"的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.filing.filingOneOperate({}, 'delete', e.filingId).then(res => {
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
          filingName: undefined
        }
      } else {
        this.$refs.form.resetFields()
        this.form = {
          filingName: undefined
        }
      }
    },
    resetFormSearch() {
      this.pagination.filingName = undefined
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
      this.$api.modules.filing.FilingOneList(this.pagination).then(res => {
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
          await this.$api.modules.filing.filingOneOperate(this.form, this.form.filingId !== undefined ? 'put' : 'post').then(res => {
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
