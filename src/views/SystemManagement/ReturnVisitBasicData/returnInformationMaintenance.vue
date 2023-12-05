<template>
  <!-- 回访基础信息维护 -->
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
          v-has-permi="['share:returnVisitTypeList:export']"
          
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
              <el-button v-has-permi="['share:returnVisitTypeList:add']" size="mini" icon="el-icon-plus" type="primary" @click="getAdd">新增</el-button>
              <el-button v-has-permi="['share:returnVisitTypeList:remove']" size="mini" icon="el-icon-close" type="danger" @click="handledcopy">删除</el-button>
            </div>
          </div>
          <!--字典-->
          <template #custom="data">
            <div v-if="data.props === 'isEnable'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isEnable" />
            </div>
            <div v-else-if="data.props === 'returnVisitLevel'">
              <show-dict-data :options="dict.type.grade" :value="data.custom.returnVisitLevel" />
            </div>
            <div v-else-if="data.props === 'visitorType'">
              <show-dict-data :options="dict.type.visitor_type" :value="data.custom.visitorType" />
            </div>
            <div v-else-if="data.props === 'returnVisitMethod'">
              <show-dict-data :options="dict.type.return_visit_method" :value="data.custom.returnVisitMethod" />
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <!-- 弹框 -->
    <sgDialog :title="title" size="430px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" label-width="160px" size="mini">
          <el-form-item label="回访类型：" prop="returnTypeId">
            <el-select v-model="form.returnTypeId" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in returntype"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="回访名称：" prop="returnVisitName">
            <el-input v-model="form.returnVisitName" style="width: 190px" clearable />
          </el-form-item>
          <el-form-item label="回访等级：" prop="returnVisitLevel">
            <el-select v-model="form.returnVisitLevel" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.grade"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="间隔天数" prop="intervalDays">
            <el-input v-model="form.intervalDays" oninput="value=value.replace(/[^0-9]/g,'')" style="width: 190px" clearable />
          </el-form-item>
          <el-form-item label="回访人类型：" prop="visitorType">
            <el-select v-model="form.visitorType" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.visitor_type"
                :key="Number(dict.value)"
                :label="dict.label"
                :value="Number(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="回访目的：">
            <el-input v-model="form.returnVisitPurpose" type="textarea" style="width: 190px;" />
          </el-form-item>
          <el-form-item label="回访方式：">
            <el-select v-model="form.returnVisitMethod" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.return_visit_method"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用：" prop="isEnable">
            <el-select v-model="form.isEnable" style="width: 190px" filterable clearable>
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
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
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['whether', 'grade', 'return_visit_type', 'return_visit_method', 'visitor_type'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    sgDialog
  },
  data() {
    return {
      title: '新增',
      tableData: [],
      departmentname: [],
      returntype: [],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:returnVisitTypeList:edit']
          }
        ]
      },
      columns: [
        {
          lab: '回访名称',
          val: 'returnVisitName'
        },
        {
          lab: '回访类型',
          val: 'typeName'
          // width: 110
        },
        {
          lab: '回访等级',
          val: 'returnVisitLevel',
          custom: 'returnVisitLevel'
        },
        {
          lab: '间隔天数',
          val: 'intervalDays'
        },
        {
          lab: '回访人类型',
          width: 130,
          val: 'visitorType',
          custom: 'visitorType'
        },
        {
          lab: '回访方式',
          val: 'returnVisitMethod',
          custom: 'returnVisitMethod'
        },
        {
          lab: '是否启用',
          val: 'isEnable',
          custom: 'isEnable'
        },
        {
          lab: '回访目的',
          val: 'returnVisitPurpose',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '备注',
          val: 'remark'
        }
      ],
      selectionData: [],
      // 新增 弹框
      showDialog: false,
      form: {
        returnVisitName: '',
        returnTypeId: '',
        intervalDays: '',
        returnVisitLevel: '',
        returnVisitMethod: '',
        returnVisitPurpose: '',
        visitorType: '',
        isEnable: '',
        remark: ''
      },
      // 表单校验
      rules: {
        returnVisitName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        returnTypeId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        returnVisitLevel: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        intervalDays: [
          { required: true, message: '间隔天数不能为空', trigger: 'blur' }
        ],
        visitorType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      options: {
        returnVisitName: {
          type: 'input',
          label: '回访名称：'
        },
        returnTypeId: {
          type: 'select',
          label: '回访类型',
          clearable: true,
          options: []
        },
        visitorType: {
          type: 'select',
          label: '回访人类型',
          clearable: true,
          options: []
        },
        returnVisitPurpose: {
          type: 'input',
          label: '回访目的'
        },
        returnVisitMethod: {
          type: 'select',
          label: '回访方式',
          clearable: true,
          options: []
        },
        isEnable: {
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
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.Department()
    this.returntypes()
    this.options.isEnable.options = this.dict.type.whether
    this.options.returnVisitMethod.options = this.dict.type.return_visit_method
    this.options.visitorType.options = this.dict.type.visitor_type
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
      data = Object.assign(data)
      this.$api.medical.returnVisitTypeList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }) .finally(() => {
        this.$export('#out-table', '回访基础类型维护')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })  
    },
    getAdd() {
      this.title = '新增'
      this.showDialog = true
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      this.form = {
        returnVisitName: '',
        returnTypeId: '',
        intervalDays: '',
        returnVisitLevel: '',
        returnVisitMethod: '',
        returnVisitPurpose: '',
        visitorType: '',
        isEnable: '',
        remark: ''
      }
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    returntypes() {
      const data = {
        status: '1',
        deptId: this.deptId
      }
      this.$api.medical.returnVisitTypeInfolist(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.typeName
            item.value = item.returnTypeId
          })
          this.options.returnTypeId.options = res.rows
          this.returntype = res.rows
        }
      })
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
      }
    },
    // 添加
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.deptId = this.deptId
          if (this.title === '新增') {
            this.$api.medical.addreturnVisitTypeList(this.form).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.getData()
                this.showDialog = false
                this.form = {
                  returnVisitName: '',
                  returnTypeId: '',
                  intervalDays: '',
                  returnVisitLevel: '',
                  returnVisitMethod: '',
                  returnVisitPurpose: '',
                  visitorType: '',
                  isEnable: '',
                  remark: ''
                }
              }
            })
          } else {
            this.$api.medical.editreturnVisitTypeList(this.form).then(res => {
              if (res) {
                this.$message.success('修改成功')
                this.getData()
                this.showDialog = false
                this.form = {
                  returnVisitName: '',
                  returnTypeId: '',
                  intervalDays: '',
                  returnVisitLevel: '',
                  returnVisitMethod: '',
                  returnVisitPurpose: '',
                  visitorType: '',
                  isEnable: '',
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
      this.$api.medical.getInforeturnVisitTypeList(e.visitId).then(res => {
        if (res) {
          this.form = res.data
        }
      })
      this.showDialog = true
    },
    // 删除
    handledcopy() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一条数据')
        return
      }
      const returnTypeIds = this.selectionData[0].visitId
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.medical.removereturnVisitTypeList(returnTypeIds).then(res => {
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
      var data = {
        deptId: this.deptId
      }
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
      data = Object.assign(data, this.pagination)
      this.$api.medical.returnVisitTypeList(data).then(res => {
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
      this.$api.modules.netPower.projectTreeselect({ deptId: this.deptId }).then(res => {
        if (res) {
          res.data.forEach((item) => {
            item.value = item.departmentId
            item.label = item.departmentName
          })
          this.departmentname = res.data
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
        returnVisitName: '',
        returnTypeId: '',
        intervalDays: '',
        returnVisitLevel: '',
        returnVisitMethod: '',
        returnVisitPurpose: '',
        visitorType: '',
        isEnable: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

</style>
