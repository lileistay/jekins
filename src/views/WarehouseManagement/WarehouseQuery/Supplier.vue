<template>
  <!-- 供应商信息 -->
  <div>
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          v-has-permi="['sorage:supplier:list']"
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          type="success"
          size="mini"
          icon="el-icon-upload2"
          plain
          v-has-permi="['sorage:supplier:export']"
          
          @click.stop="exportExcel()"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          :table-data="tableData"
          id="out-table"
          index="序号"
          size="mini"
          border
          :columns="columns"
          :operate="operate"
          :pagination="pagination"
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />供应商列表</div>
            <div>
              <el-button v-hasPermi="['sorage:supplier:add']" size="mini" icon="el-icon-plus" type="primary" @click="getAdd">新增</el-button>
            </div>
          </div>
          <!--字典-->
          <template #custom="data">
            <div v-if="data.props === 'status'">
              <p>{{ data.custom.status == '0' ? '是' : '否' }}</p>
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <!-- 弹框 -->
    <sgDialog :title="title" size="430px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <el-form ref="form" label-width="160px" :rules="rules" :model="form" size="mini">
          <el-form-item label="供应商名称：" prop="companyName">
            <el-input v-model="form.companyName" style="width: 190px" />
          </el-form-item>
          <el-form-item label="供应商描述：" prop="remark">
            <el-input v-model="form.remark" style="width: 190px" />
          </el-form-item>
          <el-form-item label="是否显示：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="1">否</el-radio>
              <el-radio label="0">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系人：" prop="contactsName">
            <el-input v-model="form.contactsName" style="width: 190px" />
          </el-form-item>
          <el-form-item label="联系人电话：" prop="supplierPhone">
            <el-input v-model="form.supplierPhone" max="11" style="width: 190px" />
          </el-form-item>
          <el-form-item label="供应商地址：" prop="address">
            <el-input v-model="form.address" style="width: 190px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoding"  @click="submitForm">确认</el-button>
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
  dicts: ['whether', 'sys_job_status'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    sgDialog
  },
  data() {
    return {
      submitLoding:false,
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
            permi: ['sorage:supplier:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['sorage:supplier:delete']
          }
        ]
      },
      columns: [
        {
          lab: '供应商名称',
          val: 'companyName',
          showOverflowTooltip: true
        },
        {
          lab: '供应商代码',
          val: 'supplierCode',
          showOverflowTooltip: true
        },
        // {
        //   lab: '状态',
        //   val: 'status',
        //   custom: 'status'
        // },
        {
          lab: '供应商描述',
          val: 'remark',
          showOverflowTooltip: true
        },
        {
          lab: '联系人',
          val: 'contactsName',
        },
        {
          lab: '联系人电话',
          width: 130,
          val: 'supplierPhone'
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status',
          width: 80
        },
        {
          lab: '地址',
          val: 'address',
          width: 200,
          showOverflowTooltip: true
        },
        {
          lab: '创建日期',
          val: 'createTime',
          width: 150
        }
      ],
      selectionData: [],
      // 新增 弹框
      showDialog: false,
      form: {
        companyName: '',
        remark: '',
        status: '0',
        contactsName: '',
        supplierPhone: '',
        address: '',
        deptId: ''
      },
      // 表单校验
      rules: {
        contactsName: [
          { required: true, message: '请填写供应商名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      options: {
        supplierCode: {
          type: 'input',
          label: '供应商代码：'
        },
        companyName: {
          type: 'input',
          label: '供应商名称：'
        },
        supplierPhone: {
          type: 'input',
          label: '供应商电话：'
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
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
      this.getData()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
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
    exportExcel(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {
        supplierCode: this.options.supplierCode.values,
        companyName: this.options.companyName.values,
        supplierPhone: this.options.supplierPhone.values,
        deptId: this.deptId
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.supplierList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '供应商信息')
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
      if (this.title === '新增') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.form.deptId = this.deptId
            this.submitLoding=true
            this.$api.storageRoom.supplierAdd(this.form).then(res => {
              if (res) {
                this.showdialog()
                this.submitLoding=false

                this.getData()
              }
            })
          }
        })
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitLoding=true
            this.form.deptId = this.deptId
            this.$api.storageRoom.supplierPut(this.form).then(res => {
              if (res) {
                this.showdialog()
                this.submitLoding=false
                this.$message.success(res.msg)
                this.getData()
              }
            })
          }
        })
      }
    },
    // 修改
    handlecompile(e) {
      this.title = '修改'
      this.$api.storageRoom.supplierGetinfo(e.supplierNo).then(res => {
        if (res) {
          this.form = res.data
        }
      })
      this.showDialog = true
    },
    // 删除
    handledcopy(e) {
      this.$confirm('是否确认删除该条的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$api.storageRoom.supplierDelete(e.supplierNo).then(res => {
          if (res) {
            this.$message.success('删除成功')
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
        supplierCode: this.options.supplierCode.values,
        companyName: this.options.companyName.values,
        supplierPhone: this.options.supplierPhone.values,
        deptId: this.deptId
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.supplierList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
      // this.$message.error('254行，没有功能')
    }),
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 弹框取消按钮
    showdialog() {
      this.showDialog = false
      this.form = {
        companyName: '',
        remark: '',
        status: '0',
        contactsName: '',
        supplierPhone: '',
        address: ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

</style>
