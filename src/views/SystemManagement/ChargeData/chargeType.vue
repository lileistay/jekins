<template>
  <!-- 收费渠道 -->
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
          v-has-permi="['share:paymentChannel:export']"
          
          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          :table-data="tableData"
          index="序号"
          size="mini"
          id="out-table"
          border
          :columns="columns"
          :operate="operate"
          :pagination="pagination"
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />收费类型列表</div>
            <div>
              <el-button v-has-permi="['share:paymentChannel:add']" size="mini" icon="el-icon-plus" type="primary" @click="getAdd">新增</el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'status'">
              <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
            </div>
            <div v-if="data.props === 'delFlag'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.delFlag" />
            </div>
            <div v-if="data.props === 'inFactAmount'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.inFactAmount" />
            </div>
            <div v-if="data.props === 'membershipPoints'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.membershipPoints" />
            </div>
            <div v-if="data.props === 'departmentPerformance'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.departmentPerformance" />
            </div>
            <div v-if="data.props === 'paymentPerformance'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.paymentPerformance" />
            </div>
            <div v-if="data.props === 'borrowType'">
              <show-dict-data :options="dict.type.Loan_account_type" :value="data.custom.borrowType" />
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <sgDialog :title="title" size="430px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <el-form ref="form" label-width="160px" :rules="rules" :model="form" size="mini">
          <el-form-item label="名称：" prop="payName">
            <el-input v-model="form.payName" placeholder="请输入费用名称" style="width: 190px" />
          </el-form-item>
          <el-form-item label="借方账户类型：" prop="borrowType">
            <el-select v-model="form.borrowType" filterable placeholder="请选择账户类型" style="width: 190px">
              <el-option
                v-for="dict in dict.type.Loan_account_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否实付金额计算值：">
            <el-select filterable v-model="form.inFactAmount" style="width: 190px">
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否会员积分计算值：">
            <el-select filterable v-model="form.membershipPoints" style="width: 190px">
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否开单业绩计算值：">
            <el-select filterable v-model="form.paymentPerformance" style="width: 190px">
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否科室业绩计算值：">
            <el-select filterable v-model="form.departmentPerformance" style="width: 190px">
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" style="width: 190px" />
          </el-form-item>
          <el-form-item label="类型状态：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否重要：" prop="status">
            <el-radio label="0" v-model="form.insertion">否</el-radio>
            <el-radio label="1" v-model="form.insertion">是</el-radio>
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
  dicts: ['whether', 'sys_normal_disable', 'Loan_account_type'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    sgDialog
  },
  data() {
    return {
      title: '新增收费类型',
      tableData: [],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:paymentChannel:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:paymentChannel:remove']
          }
        ]
      },
      columns: [
        {
          lab: '名称',
          val: 'payName'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '实付金额计算值',
          val: 'inFactAmount',
          custom: 'inFactAmount',
          width: 110
        },
        {
          lab: '会员积分计算值',
          width: 130,
          val: 'membershipPoints',
          custom: 'membershipPoints'
        },
        {
          lab: '开单业绩计算值',
          width: 130,
          val: 'paymentPerformance',
          custom: 'paymentPerformance'
        },
        {
          lab: '科室业绩计算值',
          width: 130,
          val: 'departmentPerformance',
          custom: 'departmentPerformance'
        },
        {
          lab: '借方账户类型',
          width: 120,
          val: 'borrowType',
          custom: 'borrowType'
        },
        {
          lab: '备注',
          val: 'remark'
        }
      ],
      // 新增
      showDialog: false,
      form: {
        payName: '',
        remark: '',
        inFactAmount: '',
        delFlag: '',
        departmentPerformance: '',
        paymentPerformance: '',
        membershipPoints: '',
        status: '0',
        insertion:'0'
      },
      // 表单校验
      rules: {
        payName: [
          { required: true, message: '渠道类型名称不能为空', trigger: 'blur' }
        ],
        borrowType: [
          { required: true, message: '请选择借方账户类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        insertion:[
          { required: true, message: '请选择是否重要', trigger: 'blur' }
        ]
      },
      options: {
        customerName: {
          type: 'input',
          label: '名称：'
        },
        status: {
          type: 'select',
          label: '状态：',
          options: [],
          clearable: true
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
  created() {
    this.getData()
    this.options.status.options = this.dict.type.sys_normal_disable
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
      const data = {
        payName: this.options.customerName.values,
        status: this.options.status.values
      }
      const form = data
      this.$api.modules.finance.paymentChannelList(form).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '收费渠道')
        // this.showDataDialog = false
      })
    },
        getAdd() {
      this.title = '新增收费渠道'
      this.showDialog = true
          this.form.insertion='0'
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      this.form.insertion='0'
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
      this.form.params={
        insertion:this.form.insertion
      }
      if (this.title === '新增收费渠道') {
        this.$api.modules.finance.paymentChannelAdd(this.form).then(res => {
          if (res) {
            this.$message.success('添加成功')
            this.getData()
          }
        })
        this.showDialog = false
        this.form = {
          payName: '',
          remark: '',
          inFactAmount: '',
          delFlag: '',
          departmentPerformance: '',
          paymentPerformance: '',
          membershipPoints: '',
          status: '0',
          insertion: '0'
        }
      } else {

        this.$api.modules.finance.paymentChannelEdit(this.form).then(res => {
          if (res) {
            this.$message.success('修改成功')
            this.getData()
          }
        })
        this.showDialog = false
        this.form = {
          payName: '',
          remark: '',
          inFactAmount: '',
          delFlag: '',
          departmentPerformance: '',
          paymentPerformance: '',
          membershipPoints: '',
          status: '0',
          insertion: '0'
        }
      }
    },
    // 修改
    handlecompile(e) {
      this.title = '修改收费渠道'
      this.$api.modules.finance.paymentChannelGetInfo(e.payId).then(res => {
        if (res) {
          this.showDialog = true
         res.data.insertion="";
          this.form = res.data
          if(!this.form.assist){
            this.form.insertion='0'
          }else{
            this.form.insertion='1'
          }

        }
      })
    },
    // 删除
    handledcopy(e) {
      this.$confirm('确定删除该支付方式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.finance.paymentChannelRemove(e.payId).then(res => {
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
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      const data = {
        payName: this.options.customerName.values,
        status: this.options.status.values
      }
      const form = Object.assign(data, this.pagination)
      this.$api.modules.finance.paymentChannelList(form).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    showdialog() {
      this.showDialog = false
      this.form = {
        payName: '',
        remark: '',
        inFactAmount: '',
        delFlag: '',
        departmentPerformance: '',
        paymentPerformance: '',
        membershipPoints: '',
        status: '0',
        insertion: '0'
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

</style>
