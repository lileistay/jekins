<template>
  <!-- 库房基础信息 -->
  <div>
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          v-has-permi="['sorage:wpartment:list']"
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          v-has-permi="['sorage:wpartment:export']"
          type="success"
          size="mini"
          icon="el-icon-upload2"
          plain
          @click.stop="exportExcel()"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          id="out-table"
          :table-data="tableData"
          index="序号"
          size="mini"
          border
          selection
          :columns="columns"
          :operate="operate"
          :pagination="pagination"
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />库房列表</div>
            <div>
              <el-button v-hasPermi="['sorage:wpartment:add']" size="mini" icon="el-icon-plus" type="primary" @click="getAdd">新增</el-button>
            </div>
          </div>
          <!--字典-->
          <template #custom="data">
            <div v-if="data.props === 'isMedicine'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isMedicine" />
            </div>
            <div v-else-if="data.props === 'status'">
              <p>{{ data.custom.status == '0' ? '是' : '否' }}</p>
            </div>
            <div v-else-if="data.props === 'whouseLevel'">
              <p>{{ data.custom.whouseLevel == '0' ? '一级库房' : '二级库房' }}</p>
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <!-- 弹框 -->
    <sgDialog :title="title" size="430px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <el-form ref="form" label-width="160px" :rules="rules" :model="form" size="mini">
          <el-form-item label="库房名称：" prop="whouseName">
            <el-input v-model="form.whouseName" style="width: 190px" />
          </el-form-item>
          <el-form-item label="库房描述：" prop="remark">
            <el-input v-model="form.remark" clearable style="width: 190px" />
          </el-form-item>
          <el-form-item label="库房级别：" prop="whouseLevel">
            <el-select v-model="form.whouseLevel" filterable style="width: 190px">
              <el-option label="一级库房" value="0" />
              <el-option label="二级库房" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属公司" prop="deptId">
            <treeselect v-model="form.deptId" :options="deptOptions" style="width: 190px" :show-count="true" :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" />
          </el-form-item>
          <el-form-item label="库房科室：">
            <el-select v-model="form.departmentId" clearable filterable style="width: 190px">
              <el-option
                v-for="item in TriageDepartment"
                :key="item.departmentId"
                :value="item.departmentId"
                :label="item.departmentName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否领药库房：" prop="isMedicine">
            <el-radio-group v-model="form.isMedicine" clearable style="width: 190px">
              <el-radio
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="1">否</el-radio>
              <el-radio label="0">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoding" @click="submitForm">确认</el-button>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  dicts: ['whether'],
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
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:wpartment:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['sorage:wpartment:delete']
          }
        ]
      },
      columns: [
        {
          lab: '所属公司',
          val: 'deptName'
        },
        {
          lab: '库房代码',
          val: 'whouseCode'
        },
        // {
        //   lab: '状态',
        //   val: 'status',
        //   custom: 'status'
        // },
        {
          lab: '库房名称',
          val: 'whouseName'
          // custom: 'inFactAmount',
          // width: 110
        },
        {
          lab: '库房描述',
          val: 'remark'
        },
        {
          lab: '库房科室',
          val: 'departmentName'
        },
        {
          lab: '库房级别',
          val: 'whouseLevel',
          custom: 'whouseLevel'
        },
        {
          lab: '是否领药库房',
          val: 'isMedicine',
          custom: 'isMedicine',
          width: 130
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status'
        }
      ],
      selectionData: [],
      // 新增 弹框
      showDialog: false,
      form: {
        whouseName: '',
        remark: '',
        isMedicine: '1',
        departmentId: '',
        whouseLevel: '0',
        deptId: '',
        status: '0'
      },
      // 公司树
      deptOptions: undefined,
      TriageDepartment: [], // 库房科室数据
      // 表单校验
      // 表单校验
      rules: {
        whouseName: [
          { required: true, message: '库房名称不能为空', trigger: 'blur' }
        ],
        whouseLevel: [
          { required: true, message: '库房级别不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '库房描述不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否显示', trigger: 'blur' }
        ],
        isMedicine: [
          { required: true, message: '请选择是否领药库房', trigger: 'blur' }
        ]
      },
      options: {
        whouseCode: {
          type: 'input',
          label: '库房代码：'
        },
        whouseName: {
          type: 'input',
          label: '库房名称：'
        },
        remark: {
          type: 'input',
          label: '库房描述：'
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      submitLoding:false
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
      this.form.deptId = val
      this.getData()
    },
    'form.deptId'(val) {
      this.TriageDepartment = []
      // 库房科室的数据
      this.$api.dept.DepartmentList({ deptId: val || this.deptId, status: '0', isDepartment: '1' }, 'get').then((res) => {
        if (res) {
          this.TriageDepartment = res.rows
        }
      })
    }
  },
  created() {
    this.getData()
    // this.getDeptInfo()
    this.getTreeselect(true)
    this.deptId = this.$store.getters.departmentId
    this.form.deptId = this.$store.getters.departmentId
    // this.options.status.options = this.dict.type.sys_normal_disable
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {
        whouseCode: this.options.whouseCode.values,
        whouseName: this.options.whouseName.values,
        remark: this.options.remark.values,
        deptId: this.deptId
      }
      this.$api.storageRoom.wpartmentList(data).then(res => {
        if (res) {
          this.tableData = res.rows

          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '库房基础信息')
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
            this.submitLoding=true
            this.$api.storageRoom.wpartmentAdd(this.form).then(res => {
              if (res) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.submitLoding=false
                this.getData()
                this.showdialog()
              }
            })
          } else {
            this.$api.storageRoom.wpartmentPut(this.form).then(res => {
              if (res) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.submitLoding=false.
                this.getData()
                this.showdialog()
              }
            })
          }
        }
      })
    },
    // 修改
    handlecompile(e) {
      this.title = '修改'
      this.showDialog = true
      this.form = e
      // this.$api.storageRoom.wpartmentGetInfo(e.whouseId).then(res => {
      //   if (res) {
      //     this.form = res.data
      //   }
      // })
    },
    // 删除
    handledcopy(e) {
      this.$confirm('是否确认删除该的数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$api.storageRoom.wpartmentDelete(e.whouseId).then(res => {
          if (res) {
            this.getData()
          }
        })
      })
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      var data = {
        whouseCode: this.options.whouseCode.values,
        whouseName: this.options.whouseName.values,
        remark: this.options.remark.values,
        deptId: this.deptId
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.wpartmentList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    async getTreeselect(isFirst) {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 弹框取消按钮
    showdialog() {
      this.showDialog = false
      this.form = {
        deptId: this.deptId,
        whouseName: '',
        remark: '',
        isMedicine: '1',
        departmentId: '',
        whouseLevel: '0',
        status: '0'
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

</style>
