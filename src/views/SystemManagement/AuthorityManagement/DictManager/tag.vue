<template>
  <div>
    <sg-table
      v-if="true"
      
      selection
      size="mini"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
      @operateClick="operateClick"
      @selection-change="handleSelectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar">
        <el-form ref="searchForm" :model="pagination" :inline="true" size="mini" :show-message="false">
          <el-form-item label="字典名称" prop="dictType">
            <el-select v-model="pagination.dictType" filterable size="mini">
              <el-option
                v-for="item in typeOptions"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictType"
                placeholder="请输入字典名称"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input v-model="pagination.dictLabel" clearable filterable style="width: 160px;" placeholder="请输入字典标签" />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="pagination.status" clearable filterable style="width: 160px;" placeholder="数据状态">
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="getData(true)">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
      </template>
      <div slot="header">
        <el-button size="mini" plain icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
        <el-button size="mini" plain icon="el-icon-delete" :disabled="ids.length<=0" type="danger" @click="handleDelete">删除</el-button>
        <el-button size="mini" plain icon="el-icon-upload2" disabled type="info">导出(未做)</el-button>
      </div>
    </sg-table>
    <sg-dialog :dialog="showDialog" size="500px" :title="dialogTitle" @handleClose="showDialog = false">
      <div slot="out">
        <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px">
          <el-row>
            <el-col>
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="form.dictType" disabled />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="数据标签" prop="dictLabel">
                <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="数据键值" prop="dictValue">
                <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="样式属性" prop="cssClass">
                <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="dictSort">
                <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回显样式" prop="listClass">
                <el-select v-model="form.listClass" filterable placeholder="请选择回显样式">
                  <el-option
                    v-for="item in listClassOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status" placeholder="请选择状态">
                  <el-radio
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" :rows="4" placeholder="请输入备注内容" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="submitForm">确认</el-button>
                <el-button @click="showDialog=false">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table/index'
import SgDialog from '@/components/Dialog'
export default {
  name: 'Tag',
  dicts: ['sys_normal_disable'],
  components: { SgDialog, SgTable },
  data() {
    return {
      // 表格加载的蒙版
      showDataDialog: false,
      // 表格数据
      tableData: [],
      // 页面传的id
      defaultDictType: '',
      // 数据标签回显样式
      listClassOptions: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'primary',
          label: '主要'
        },
        {
          value: 'success',
          label: '成功'
        },
        {
          value: 'info',
          label: '信息'
        },
        {
          value: 'warning',
          label: '警告'
        },
        {
          value: 'danger',
          label: '危险'
        }
      ],
      // 表格数据列
      columns: [
        {
          lab: '字典编码',
          val: 'dictCode'
        },
        {
          lab: '字典标签',
          val: 'dictLabel'
        },
        {
          lab: '字典键值',
          val: 'dictValue'
        },
        {
          lab: '字典排序',
          val: 'dictSort'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '创建时间',
          val: 'createTime',
          width: 180
        }
      ],
      // 表格操作列
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
      // 表单数据
      form: {},
      // 表单校验规则
      rules: {
        dictLabel: [
          { required: true, message: '数据标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '数据键值不能为空', trigger: 'blur' }
        ],
        dictSort: [
          { required: true, message: '数据顺序不能为空', trigger: 'blur' }
        ]
      },
      // 显示弹窗
      showDialog: false,
      dialogTitle: undefined,
      // 表格多选的数据
      ids: [],
      // 类型数据字典
      typeOptions: [],
      // 分页 搜索
      pagination: {
        show: true,
        total: 0,
        pageNum: 1,
        pageSize: 20,
        dictType: undefined,
        currentPage: 1
      }
    }
  },
  created() {
    const dictId = this.$route.query.dictId
    this.getType(dictId)
    this.getTypeList()
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
    // 表格操作
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 表格多选操作
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.dictCode)
    },
    // 查询字典类型列表
    getTypeList() {
      this.$api.dictType.listType({status: '0'}).then(res => {
        if (res) {
          this.typeOptions = res.rows
        }
      })
    },
    // 根据id 获取类型
    getType(id) {
      this.$api.dictType.getType(id).then(res => {
        if (res) {
          this.pagination.dictType = res.data.dictType
          this.defaultDictType = res.data.dictType
          this.getData()
        }
      })
    },
    // 获取列表数据
    getData(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.showDataDialog = true
      this.$api.dict.menuList(this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 重置表单
    resetForm(form) {
      if (form) {
        this.pagination = {
          pageNum: 1,
          dictType: this.defaultDictType,
          pageSize: 20,
          total: 0
        }
        this.getData()
      } else {
        this.$refs.form.resetFields()
        this.form = {
          dictCode: undefined,
          dictLabel: undefined,
          dictValue: undefined,
          cssClass: undefined,
          listClass: 'default',
          dictSort: 0,
          status: '0',
          remark: undefined
        }
      }
    },
    // 添加的操作
    handleAdd() {
      this.showDialog = true
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加字典数据'
        this.form.dictType = this.pagination.dictType
      })
    },
    // 修改操作
    handleUpdate(e) {
      this.$api.dict.getData(e.dictCode).then(res => {
        if (res) {
          this.form = res.data
          this.showDialog = true
        }
      })
    },
    // 删除的操作
    handleDelete(e) {
      const dictCode = e.dictCode || this.ids
      this.$confirm('是否确认删除编号为' + dictCode + '的数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.dict.operateData({}, 'delete', dictCode).then(async res => {
          if (res) {
            this.$message.success(res.msg)
            await this.getData()
          }
        })
      }).catch(() => {

      })
    },
    //  提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api.dict.operateData(this.form, this.form.dictCode ? 'put' : 'post').then(res => {
            if (res) {
              this.showDialog = false
              this.$message.success(res.msg)
              this.getData()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
