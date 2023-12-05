<template>
  <!-- 开单管理（公司） -->
  <div class="box">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      size="mini"
      index="序号"
      border
      :pagination="pagination"
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#f5eae4'}"
      :cell-style="cellStyle"
      :cell-class-name="cellClassName"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"

    >
      <!--搜索框 -->
      <div slot="searchBar" class="header-float" >
        <div class="helt" style="margin-top: 20px;">
          <el-form :inline="true" size="mini" style="height:100%">
            <el-form-item label="客户姓名:" >
              <el-input v-model="form.customerName"   style="width: 100px" clearable/>
            </el-form-item>
            <el-form-item label="电话:" class="Left">
              <el-input v-model="form.customPhone"  style="width: 130px" clearable/>
            </el-form-item>
            <el-form-item label="客户卡号:" class="Left">
              <el-input v-model="form.customCardNumber" style="width: 135px" clearable/>
            </el-form-item>
            <el-form-item label="新老客户:" class="Left">
              <el-select
                v-model="form.customerStatus"

                placeholder="请选择"
                style="width: 100px"
                clearable
                filterable
              >
                <el-option
                  v-for="item in dict.type.whether_Newguest"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否已开单:" class="Left">
              <el-select

                v-model="form.receptionStatus"
                placeholder="请选择"
                clearable filterable
                style="width: 100px"
              >
                <el-option
                  v-for="item in dict.type.Reception_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="接待时间:"  class="Left">
              <el-date-picker

                v-model="form.receptionTime"
                style="width: 135px"
                clearable
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                :disabled="showTime"
              />
            </el-form-item>
            <!--<el-form-item label="接待时间:">-->
            <!--  <el-date-picker-->
            <!--      disabled-->
            <!--      v-model="form.receptionTime"-->
            <!--      style="width: 135px"-->
            <!--      clearable-->
            <!--      placeholder="选择日期"-->
            <!--      format="yyyy-MM-dd"-->
            <!--      value-format="yyyy-MM-dd"-->
            <!--      type="date"-->
            <!--  />-->
            <!--</el-form-item>-->
            <div style="display: inline-block;position: absolute;right: 60px;">
            <el-button
                icon="el-icon-search"
                size="mini"
                type="primary"
                plain
                style="margin-right:3px"
                @click.stop.native="getData(true)"
                @keydown.enter.native="getData(true)"
              >查询
              </el-button>
            </div>
          </el-form>
        </div>
        <div class="helt">
        </div>
      </div>
      <div slot="header" class="header-float">
        <div>
          <span>开单管理列表</span>
          <span style="margin-right:10px"><i class="color-block-success"/>老客户</span>
          <span><i class="color-block-white"/>新客户</span>
        </div>
        <div style="float: right">
          <!-- <el-button-->
          <!--   v-has-permi="['SiteManagement:MicroMall']"-->
          <!--   size="mini"-->
          <!--   plain-->
          <!--   type="primary"-->
          <!--   style="float: right;margin-left: 10px"-->
          <!--   icon="el-icon-shopping-cart-1"-->
          <!--   @click="bilingWechat"-->
          <!-- >微商城订单开单</el-button>-->
          <el-button
            v-has-permi="['SiteManagement:SetMeal']"
            size="mini"
            plain
            type="success"
            style="float: right;margin-left: 10px"
            icon="el-icon-shopping-cart-1"
            @click="PackageBilling"
          >套餐开单
          </el-button>
          <el-button
            v-has-permi="['SiteManagement:test']"
            size="mini"
            plain
            style="float: right;"
            type="primary"
            @click="inspectionBilling"
          >检验开单
          </el-button>
          <el-button
            v-has-permi="['SiteManagement:adjuvantBillingTherapyfs']"
            size="mini"
            plain
            style="float: right;"
            type="primary"
            @click="radiationBilling"
          >放射开单
          </el-button>
          <el-button
            v-has-permi="['SiteManagement:adjuvantBillingTherapy']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            icon="el-icon-suitcase-1"
            @click="AdjuvantTherapy"
          >辅助治疗开单
          </el-button>
          <el-button
            v-has-permi="['SiteManagement:hospitalization']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            icon="el-icon-school"
            @click="deposit"
          >交住院押金
          </el-button>
          <el-button
            v-has-permi="['SiteManagement:StoredValue']"
            size="mini"
            plain
            type="danger"
            style="float: right;"
            icon="el-icon-bank-card"
            @click="storedBill"
          >储值开卡
          </el-button>
          <el-button
            v-has-permi="['payment:customCardSum:Stored']"
            size="mini"
            plain
            type="danger"
            style="float: right;"
            icon="el-icon-bank-card"
            @click="StoredValue"
          >交储值
          </el-button>
          <el-button
            v-has-permi="['payment:customCardSum:payment']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            @click="AdvancePayment"
          >交预约金
          </el-button>
          <el-button
            v-has-permi="['payment:customCardSum:Billing']"
            size="mini"
            plain
            type="primary"
            style="float: right;"
            icon="el-icon-circle-check"
            @click="management"
          >开单
          </el-button>
            <el-button
                    v-has-permi="['payment:customCardSum:BillingOther']"
                    size="mini"
                    plain
                    type="primary"
                    style="float: right;"
                    icon="el-icon-circle-check"
                    @click="managementOther"
            >其它开单
            </el-button>
          <el-button
            v-has-permi="['confinement:receptionInformationList:Interdisciplinary']"
            size="mini"
            plain
            type="info"
            style="float: right;"
            icon="el-icon-refresh-left"
            @click="interdisciplinary"
          >跨科
          </el-button>
          <!--          <el-button-->
          <!--            v-has-permi="['payment:customCardSum:Confinement']"-->
          <!--            size="mini"-->
          <!--            plain-->
          <!--            type="primary"-->
          <!--            style="float: right;"-->
          <!--            icon="el-icon-circle-check"-->
          <!--            @click="confinementBilling"-->
          <!--          >月子开单</el-button>-->
          <!--          <el-button-->
          <!--            v-has-permi="['payment:customCardSum:productionHealth']"-->
          <!--            size="mini"-->
          <!--            plain-->
          <!--            type="primary"-->
          <!--            style="float: right;"-->
          <!--            icon="el-icon-circle-check"-->
          <!--            @click="chankangPackageBilling"-->
          <!--          >产康套餐开单</el-button>-->
          <!--          <el-button-->
          <!--            v-has-permi="['payment:customCardSum:Chankang']"-->
          <!--            size="mini"-->
          <!--            plain-->
          <!--            type="primary"-->
          <!--            style="float: right;"-->
          <!--            icon="el-icon-circle-check"-->
          <!--            @click="chankangBilling"-->
          <!--          >产康开单</el-button>-->
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props==='customSex'">
          <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex"/>
        </div>
        <div v-else-if="data.props === 'customerName'">
          <a style="color: blue;cursor: pointer;font-weight: bolder"
             @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
        </div>
        <div v-if="data.props==='receptionStatus'">
          <show-dict-data :options="dict.type.Reception_status" :value="data.custom.receptionStatus"/>
        </div>
        <div v-if="data.props==='customerStatus'">
          <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus"/>
        </div>
        <div v-if="data.props==='isSecondary'">
          <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.customerStatus"/>
        </div>
        <div v-if="data.props==='triageType'">
          <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType"/>
        </div>
      </template>
    </sg-table>
    <!-- 跨科 -->
    <el-dialog
      title="跨科"
      :visible="openDilog"
      width="40%"
      @close="closeDialog"
    >
      <div>
        <div class="one">
          <span>客户信息</span>
          <el-form
            ref="formInline"
            :model="formInline"
            :rules="rules"
            size="mini"
            label-width="122px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名：" prop="customerName">
                  <el-input v-model="formInline.customerName" disabled/>
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="手机：" prop="customPhone">
                  <el-input v-model="formInline.customPhone" disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分诊科室：" prop="departmentId">
                  <el-select v-model="formInline.departmentId" clearable filterable>
                    <el-option
                      v-for="item in departmentList"
                      :key="item.departmentId"
                      :label="item.departmentName"
                      :value="item.departmentId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户代表：">
                  <el-select v-model="formInline.customerRepresentative" clearable filterable>
                    <el-option
                      v-for="item in sysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="美学顾问：" prop="aestheticConsultant">
                  <el-select v-model="formInline.aestheticConsultant" clearable filterable>
                    <el-option
                      v-for="item in esthetics"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="医生：">
                  <el-select v-model="formInline.doctorId" clearable filterable>
                    <el-option
                      v-for="item in doctor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="客户意向描述：" prop="intentionDescription">
                  <el-input v-model="formInline.intentionDescription" type="textarea"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="interdisciplinaryEdit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import {debounce} from '@/utils/throttleAndDebounce'
import {timeFmt} from '@/utils/time'

export default {
  dicts: ['sys_user_sex', 'Reception_status', 'whether_secondary', 'whether_Newguest', 'Triage_type'],
  components: {SgTable},
  data() {
    return {
      openDilog: false,
      showDataDialog: false,
      selectionData: [], // 选择的数据
      form: {
        customerName: undefined, // 姓名
        customPhone: undefined, // 电话
        customCardNumber: undefined, // 顾客卡号
        customerStatus: '', // 顾客状态
        receptionTime: timeFmt('YYYY-mm-dd', new Date()), // 接待时间
        receptionStatus:'',
      },
      formInline: {
        customerName: '',
        customPhone: '',
        departmentId: '',
        customerRepresentative: '',
        aestheticConsultant: '',
        doctorId: '',
        id: '',
        intentionDescription: ''
      },
      tableData: [],
      rowTable: undefined,
      // 表头
      columns: [
        {
          lab: '接待时间',
          val: 'receptionTime',
          width: 150
        },
        {
          lab: '接诊状态',
          val: 'receptionStatus',
          custom: 'receptionStatus'
        },
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 100
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '新老顾客',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 150
        },
        // {
        //   lab: '会员等级',
        //   val: 'gradeName'
        // },
        {
          lab: '科室',
          val: 'departmentName',
          width: 150
        },
        {
          lab: '顾客代表',
          val: 'crName',
          width: 150
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 150
        },
        {
          lab: '客户意见',
          val: 'intentionDescription',
          width: 150,
          showOverflowTooltip: true
        },
        // {
        //   lab: '医助描述',
        //   val: 'visituserName'
        // },
        {
          lab: '二次来院',
          val: 'isSecondary',
          custom: 'isSecondary'
        },
        {
          lab: '二开推荐人',
          val: 'souName',
          width: 150
        },
        {
          lab: '分诊类型',
          val: 'triageType',
          custom: 'triageType',
          width: 130
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      rules: {
        departmentId: [{required: true, message: '请选择', trigger: 'blur'}],
        // customerRepresentative: [{ required: true, message: '请选择', trigger: 'blur' }],
        aestheticConsultant: [{required: true, message: '请选择', trigger: 'blur'}],
        intentionDescription: [{required: true, message: '请输入', trigger: 'blur'}]
        // doctorId: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      sysUserList: [],
      esthetics: [],
      doctor: [],
      departmentList: [],
      permission:[],
      showTime:true,
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
      this.getDepartment()
      this.getData()
      this.getUserList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    let that=this;
    setTimeout(function (){
      if(localStorage.getItem('WhetherDisable')=='true'){
        that.showTime=false
      }else{
        that.showTime=true;
      }
    },500)
    this.getDepartment()
    this.getUserList(this.deptId)
    this.getData() // 页面加载显示数据
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    cellClassName({row, rowIndex}) {
      // if(rowIndex%2==0){
      //   return  'normal-row'
      // }
      if (row.customerStatus === '1') {
        return 'warning-row'
      } else if (row.customerStatus === '2') {
        return 'success-row'
      }
      return ''
    },
    /**
     * @author Nevin
     * @date 2022/6/15
     * @Description: 月子开单
     */
    confinementBilling() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'confinementBilling', query: {billing: JSON.stringify(this.selectionData[0])}})
    },
    /**
     * @author Nevin
     * @date 2022/6/15
     * @Description: 产康开单
     */
    chankangBilling() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'chankangBilling', query: {billing: JSON.stringify(this.selectionData[0])}})
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 产康套餐开单
     */
    chankangPackageBilling() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'chankangPackageBilling',query:{ billing: JSON.stringify(this.selectionData[0])}})
    },
    // 点击姓名跳转页面
    customerclick(id, val) {
      this.$router.push({path: 'customerInfo', query: {id, status: val.customerStatus, noDeal: val.receptionStatus}})
    },
    // 储值开卡
    storedBill() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({
        name: 'StoredValueCard'
      })
      const query={
        content:JSON.stringify(this.selectionData[0]),
        id: this.selectionData[0].id
      }
      sessionStorage.setItem('StoredValueCarditem',JSON.stringify(query))
    },
    // 辅助治疗开单
    AdjuvantTherapy() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'adjuvantBillingTherapy'})
      const query= {
        billing: JSON.stringify(this.selectionData[0])
      }
      sessionStorage.setItem('adjuvantBillingTherapyitem',JSON.stringify(query))
    },
    // 交住院押金
    deposit() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({
        path: 'hospitalizationDeposit'
      })
      const query={
        content:JSON.stringify(this.selectionData[0]),
      id: this.selectionData[0].id
      }
      sessionStorage.setItem('hospitalizationDeposititem',JSON.stringify(query))
    },
    // 套餐开单
    PackageBilling() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'packageBilling'})
      const query={
        billing:JSON.stringify(this.selectionData[0]),
      }
      sessionStorage.setItem('packageBillingitem',JSON.stringify(query))

    },
    // 开单
    management() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'customerBilling'})
      const query={
        billing:JSON.stringify(this.selectionData[0])
      }
      sessionStorage.setItem('BillId',this.selectionData[0].id)
      sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
    },
      // 其他开单
      managementOther() {
          if (this.selectionData[0] === undefined) {
              this.$message.warning('请选择一名顾客进行修改')
              return
          }
          this.$router.push({path: 'customerBillingOther'})
        const query={
          billing: JSON.stringify(this.selectionData[0])
        }

        sessionStorage.setItem('customerBillingOtheritem',JSON.stringify(query))
      },
    // 交预约金
    AdvancePayment() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'advancePayment'})
      const query= {  billing: JSON.stringify(this.selectionData[0]) }
      sessionStorage.setItem('advancePaymentitem',JSON.stringify(query))

    },
    // 交储值
    StoredValue() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({
        path: 'pepositValue'
      })
      const query= {id: this.selectionData[0].id, content: JSON.stringify(this.selectionData[0])}
      sessionStorage.setItem('pepositValueitem',JSON.stringify(query))

    },
    // 检验开单
    inspectionBilling() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'inspectionBilling'})
      const query= {billing: JSON.stringify(this.selectionData[0])}
      sessionStorage.setItem('inspectionBillingitem',JSON.stringify(query))
    },
    // 放射开单
    radiationBilling() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'radiationBilling'})
      const query= {
        billing: JSON.stringify(this.selectionData[0])
      }
      sessionStorage.setItem('radiationBillingitem',JSON.stringify(query))
    },
    // 微商城订单开单
    bilingWechat() {
      if (this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({path: 'billingWechatMall'})
      // this.$message.success('很好！没有页面')
    },
    // StoredValue
    // BillingManagement
    // 获取列表数据
    getData: debounce(async function (isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(this.form, 'deptId', this.deptId)
      this.showDataDialog = true
      await this.$api.modules.billingList.BillingManagement({...this.form, ...this.pagination}).then(res => {
        if (res.code === 200) {
          this.pagination.total = res.total
          this.pagination.pageNum = 1
          this.tableData = res.rows
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description:
     */
    cellStyle({row, column, rowIndex, columnIndex}) {
      if (row.receptionStatus === '2') {
        if (columnIndex === 3) {
          return {'color': '#ff0000', 'font-weight': '600'}
        }
      }
      if (row.receptionStatus === '3') {
        if (columnIndex === 3) {
          return {'color': '#1abc9c', 'font-weight': '600'}
        }
      }
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      // console.log('数据',e)
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      // console.log(e)
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 跨科
     */
    interdisciplinary() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.formInline.id = this.selectionData[0].id
      this.formInline.customerName = this.selectionData[0].customerName
      this.formInline.customPhone = this.selectionData[0].customPhone
      this.openDilog = true
    },
    // 保存 跨科内容
    interdisciplinaryEdit() {
      // 跨科校验 LS 5/26
      this.$refs.formInline.validate((val) => {
        if (val) {
          this.$delete(this.formInline, 'customerName')
          this.$delete(this.formInline, 'customPhone')
          this.$set(this.formInline, 'deptId', this.deptId)
          this.$set(this.formInline, 'receptionType', 'kk')

          // console.log(this.formInline);
          // return;
          this.$api.dept.addReceptiondata({...this.formInline}).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.openDilog = false
              this.getData()
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 关闭跨科按钮
     */
    closeDialog() {
      this.formInline.customerName = ''
      this.formInline.customPhone = ''
      this.formInline.departmentId = ''
      this.formInline.customerRepresentative = ''
      this.formInline.aestheticConsultant = ''
      this.formInline.id = ''
      this.formInline.intentionDescription = ''
      this.formInline.doctorId = ''
      this.openDilog = false
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 获取用户信息
     */
    async getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // this.sysUserList = res.data
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.sysUserList.push(item)
            }
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 获取科室列表
     */
    getDepartment() {
      this.$api.dept.DepartmentList({deptId: this.deptId, status: '0', isDepartment: '1'}, 'get').then((res) => {
        if (res) {
          this.departmentList = res.rows
        }
      })
    }
  }

}
</script>

<style lang='scss' scoped>
@import '../../../styles/globalfloat.css';

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height:70px;
}

.box {
  padding: 0;
}
.Left{
  margin-left: 30px;
}
span {
  font-size: 15px;
}

.one {
  border: 1px solid #f2f2f2;
  padding: 20px;
  border-radius: 5px;

  & > span {
    font-size: 15px;
    background-color: #fff;
    position: absolute;
    margin-top: -30px;
  }
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-table .warning-row {
  background: #ffffff;
}

::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
