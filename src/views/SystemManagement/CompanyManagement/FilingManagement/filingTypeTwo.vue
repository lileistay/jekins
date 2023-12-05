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
        <el-input v-model="pagination.typeTwoName" clearable class="header-search-item" style="width: 200px;" size="mini" placeholder="请输入类型名称" />
        <el-button icon="el-icon-search" size="mini" type="primary" @click="getData(true)">搜索</el-button>
        <el-button size="mini" @click="resetFormSearch">重置</el-button>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'typeTwoName'">
          <a @click="filing(data)" >{{ data.custom.typeTwoName }}</a>
        </div>
      </template>
    </sg-table>
    <sgDialog :title="dialogTitle" size="600px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="80px">
          <el-form-item label="类型名称" prop="typeTwoName">
            <el-input v-model="form.typeTwoName" placeholder="请输入二级建档类型名称" />
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
  name: 'FilingTypeTwo',
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
      fatherType: undefined,
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        typeTwoName: [
          { required: true, message: '渠道类型名称不能为空', trigger: 'blur' }
        ]
      },
      // 分页 搜索
      pagination: {
        show: true,
        typeTwoName: undefined,
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
          lab: '二级类型编号',
          width: 130,
          val: 'typeTwoId'
        },
        {
          lab: '二级类型名称',
          width: 130,
          val: 'typeTwoName',
          custom: 'typeTwoName'
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
    let item = sessionStorage.getItem('filingTypeTwoitem')
    this.pagination.filingId = item
    this.fatherType = item
    this.getData()
  },
  methods: {
    filing(data) {
      this.$router.push({ path: 'filingTypeThree'})
      const query={
        id: data.custom.filingId,
        typeTwoId: data.custom.typeTwoId
      }
      console.log(query,'急急急就')
      sessionStorage.setItem('filingTypeThreeitem',JSON.stringify(query))

    },
    // 分页
    sizeChange(e) {
      this.searchBar.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.searchBar.pageNum = e[1]
      this.searchBar.currentPage = e[1]
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
        this.dialogTitle = '添加二级建档类型'
        this.form.filingId = this.fatherType
      })
    },
    // 修改
    async handleUpdate(e) {
      await this.$api.modules.filing.filingTwoOperate({}, 'get', e.typeTwoId).then(res => {
        if (res) {
          this.showDialog = true
          this.$nextTick(() => {
            this.resetForm()
            this.form = res.data
            this.dialogTitle = '修改二级建档类型'
          })
        }
      })
    },
    // 删除
    handleDelete(e) {
      this.$confirm('是否确认删除名称为"' + e.typeTwoName + '"的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.filing.filingTwoOperate({}, 'delete', e.typeTwoId).then(res => {
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
          filingId: this.fatherType,
          typeTwoName: undefined
        }
      } else {
        this.$refs.form.resetFields()
        this.form = {
          typeTwoName: undefined
        }
      }
    },
    resetFormSearch() {
      this.pagination.typeTwoName = undefined
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
      this.$api.modules.filing.FilingTwoList(this.pagination).then(res => {
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
          await this.$api.modules.filing.filingTwoOperate(this.form, this.form.typeTwoId !== undefined ? 'put' : 'post').then(res => {
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
