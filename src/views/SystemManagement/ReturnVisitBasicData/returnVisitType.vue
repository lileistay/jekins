<template>
  <!-- 回访类型管理 -->
  <div>
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['share:returnVisitTypeInfo:export']"
          
          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :operate="operate"
          :row-class-name="rowClassName"
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表</div>
            <div>
              <el-button v-has-permi="['share:returnVisitTypeInfo:add']" size="mini" icon="el-icon-plus" type="primary" @click="getAdd">新增</el-button>
            </div>
          </div>
          <!--字典-->
          <template #custom="data">
            <div v-if="data.props === 'returnVisitStage'">
              <show-dict-data :options="dict.type.return_stage" :value="data.custom.returnVisitStage" />
            </div>
            <div v-else-if="data.props === 'typeOfOperation'">
              <show-dict-data :options="dict.type.type_of_operation" :value="data.custom.typeOfOperation" />
            </div>
            <div v-else-if="data.props === 'templateCategory'">
              <show-dict-data :options="dict.type.template_type" :value="data.custom.templateCategory" />
            </div>
            <div v-else-if="data.props === 'status'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.status" />
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <!-- 弹框 -->
    <sgDialog :title="title" size="430px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" label-width="160px" size="mini">
          <el-form-item label="名称：" prop="typeName">
            <el-input v-model="form.typeName" style="width: 190px" clearable />
          </el-form-item>
          <el-form-item label="归属公司" prop="deptId">
            <treeselect v-model="form.deptId" :options="deptOptions" style="width: 190px" :show-count="true" :disable-branch-nodes="true" :clearable="false" placeholder="请选择归属公司" />
          </el-form-item>
          <el-form-item label="科室：" >
            <el-select v-model="form.departmentId" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in departmentname"
                :key="dict.departmentId"
                :label="dict.departmentName"
                :value="dict.departmentId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="回访阶段：" prop="returnVisitStage">
            <el-select v-model="form.returnVisitStage" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.return_stage"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="手术类型：">
            <el-select v-model="form.typeOfOperation" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.type_of_operation"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模板类型：">
            <el-select v-model="form.templateCategory" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.template_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用：" prop="status">
            <el-select v-model="form.status" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="desc">
            <el-input v-model="form.remark" type="textarea" style="width: 190px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
            <el-button @click="showdialog">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import sgDialog from '@/components/Dialog/index'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['whether', 'return_stage', 'type_of_operation', 'template_type'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    sgDialog,
    Treeselect
  },
  data() {
    return {
      title: '新增',
      tableData: [],
      departmentname: [],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:returnVisitTypeInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:returnVisitTypeInfo:remove']
          }
        ]
      },
      columns: [
        {
          lab: '类型名称',
          val: 'typeName'
        },
        // {
        //   lab: '状态',
        //   val: 'status',
        //   custom: 'status'
        // },
        {
          lab: '科室',
          val: 'departmentName'
          // custom: 'inFactAmount',
          // width: 110
        },
        {
          lab: '手术类型',
          val: 'typeOfOperation',
          custom: 'typeOfOperation'
        },
        {
          lab: '回访阶段',
          val: 'returnVisitStage',
          custom: 'returnVisitStage'
        },
        {
          lab: '模板类型',
          val: 'templateCategory',
          custom: 'templateCategory'
        },
        {
          lab: '是否启用',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '备注',
          val: 'remark'
        }
      ],
      selectionData: [],
      // 新增 弹框
      showDialog: false,
      // 公司树
      deptOptions: undefined,
      form: {
        typeName: '',
        departmentId: '',
        returnVisitStage: '',
        typeOfOperation: '',
        templateCategory: '',
        status: '',
        deptId: '',
        remark: ''
      },
      // 表单校验
      rules: {
        typeName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        returnVisitStage: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
      },
      options: {
        typeName: {
          type: 'input',
          label: '类型名称：'
        },
        departmentId: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        typeOfOperation: {
          type: 'select',
          label: '手术类型',
          clearable: true,
          options: []
        },
        returnVisitStage: {
          type: 'select',
          label: '回访阶段',
          clearable: true,
          options: []
        },
        templateCategory: {
          type: 'select',
          label: '模板类别',
          clearable: true,
          options: []
        },
        status: {
          type: 'select',
          label: '是否启用',
          clearable: true,
          options: []
        },
        remark: {
          type: 'input',
          label: '备注：'
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      }
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.Department()
      this.getData()
    },
    'form.deptId'(val) {
      // 库房科室的数据
      this.departmentname = []
      this.$api.dept.DepartmentList({ deptId: val || this.deptId, status: '0', isDepartment: '1'  }, 'get').then((res) => {
        if (res) {
          res.rows.forEach((item) => {
            item.value = item.departmentId
            item.label = item.departmentName
          })
          this.departmentname = res.rows
        }
      })
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.form.deptId = this.$store.getters.departmentId
    this.getData()
    this.Department()
    this.getTreeselect(true)
    this.options.status.options = this.dict.type.whether
    this.options.returnVisitStage.options = this.dict.type.return_stage
    this.options.typeOfOperation.options = this.dict.type.type_of_operation
    this.options.templateCategory.options = this.dict.type.template_type
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    Export(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      for (const k in this.options) {
        data[k] = this.options[k].values
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      this.$set(data, 'deptId', this.deptId)
      this.$api.medical.returnVisitTypeInfolist(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })   .finally(() => {
        this.$export('#out-table', '回访类型管理')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })  
    },
    // --------
    /** 查询公司下拉树结构 */
    async getTreeselect(isFirst) {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          // if (isFirst) {
          //   this.searchBar.deptId = res.data[0].id
          // }
          this.deptOptions = res.data
        }
      })
    },
    // ---------
    getAdd() {
      this.title = '新增'
      this.form.deptId = this.deptId
      this.showDialog = true
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      this.form = {
        typeName: '',
        departmentId: '',
        returnVisitStage: '',
        typeOfOperation: '',
        templateCategory: '',
        status: '',
        remark: ''
      }
    },
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
    // 修改列表
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
        case '删除':
          this.handledcopy(e[1])
      }
    },
    // 添加
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title === '新增') {
            this.$api.medical.addreturnVisitTypeInfo(this.form).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.getData()
                this.showDialog = false
                this.form = {
                  typeName: '',
                  departmentId: '',
                  returnVisitStage: '',
                  typeOfOperation: '',
                  templateCategory: '',
                  status: '',
                  remark: ''
                }
              }
            })
          } else {
            this.$api.medical.editreturnVisitTypeInfo(this.form).then(res => {
              if (res) {
                this.$message.success('修改成功')
                this.getData()
                this.showDialog = false
                this.form = {
                  typeName: '',
                  departmentId: '',
                  returnVisitStage: '',
                  typeOfOperation: '',
                  templateCategory: '',
                  status: '',
                  remark: ''
                }
              }
            })
          }
        }
      })
    },
    // 修改
    handlecompile(e) {
      this.title = '修改'
      this.form.deptId = this.$store.getters.departmentId
      this.$api.medical.getinforeturnVisitTypeInfo(e.returnTypeId).then(res => {
        if (res) {
          this.form = res.data
        }
      })
      this.showDialog = true
    },
    // 删除
    handledcopy(e) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.medical.removereturnVisitTypeInfo(e.returnTypeId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      var data = {}
      for (const k in this.options) {
        data[k] = this.options[k].values
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.$set(data, 'deptId', this.deptId)
      data = Object.assign(data, this.pagination)
      this.$api.medical.returnVisitTypeInfolist(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClassName({ row }) {
      if (row.isReachCourtyard === '1') {
        return 'success-row'
      }
      return ''
    },
    // 科室
    Department() {
      const data = {
        deptId: this.form.deptId,
        status: '0'
      }
      this.$api.modules.netPower.projectTreeselect(data).then(res => {
        if (res) {
          res.data.forEach((item) => {
            item.value = item.departmentId
            item.label = item.departmentName
          })
          this.options.departmentId.options = res.data
        }
      })
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 弹框取消按钮
    showdialog() {
      this.showDialog = false
      this.form = {
        typeName: '',
        departmentId: '',
        returnVisitStage: '',
        typeOfOperation: '',
        templateCategory: '',
        status: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

</style>
