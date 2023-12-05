<template>
  <!--- 医生划扣明细查询 --->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @keydown.enter.native="getData(true,'1')" @click.stop="getData(true, '1')">查询
        </el-button>
        <el-button v-has-permi="['confinement:queryCenter:exportdeduct']" size="mini" type="success"
          @click.stop="getData(true, '2')">导出</el-button>
      </div>
      <slot>
        <sg-table :table-data="tableData" border ref="table" index="序号" :columns="columns" :pagination="pagination" stripe
          highlight-current-row :row-class-name="rowClassName" @selection-change="handleSelectionChange"
          @row-click="rowClick" @size-change="sizeChange" @current-change="currentChange">

          <div slot="searchBar" class="searchBar">
            <div>
              <span><i style="background-color:#ffffff" class="color-block-default" />未生成</span>
              <span><i style="background-color:#c6f9c3" class="color-block-success" />已生成</span>
              <span class="title"> 已划扣应生成业绩：治疗医生应分配的业绩，退/还款后实时更新，手工下账无已划扣业绩</span>
            </div>
            <div class="information-List">
              <span class="title">应付金额：{{ boyMap.amountPayable }}</span>
              <span class="title">客户数量：{{ boyMap.countId }}</span>
              <span class="title">已执行业绩：{{ boyMap.deductionAmount }}</span>
              <span class="title">已划扣业绩：{{ boyMap.performance }}</span>
              <span class="title">剩余待执行业绩：{{ boyMap.remainPerformance }}</span>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单</div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customerName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id, data.custom)">{{
                data.custom.customerName }} </a>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
            </div>
            <div v-if="data.props === 'isTreatment'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isTreatment" />
            </div>
            <div v-if="data.props === 'customerStatus'">
              <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <div v-if="data.props === 'isExecute'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isExecute" />
            </div>
            <div v-if="data.props === 'departmentPerformance'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.departmentPerformance" />
            </div>
            <div v-if="data.props === 'repaymentAmoun'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.repaymentAmoun" />
            </div>
            <div v-if="data.props === 'refundPerformance'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.refundPerformance" />
            </div>
          </template>
          <!--          >-->
          <!--            <div v-if="data.props === 'sex'">-->
          <!--              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.sex" />-->
          <!--            </div>-->
          <!--          </template>-->
        </sg-table>
      </slot>
    </slideSearch>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import { todayTime } from '@/utils/time'
import moment from 'moment'
import XLSX from 'xlsx';
export default {
  dicts: ['treatment_type', 'nucleic_acid_test', 'billing_type', 'Triage_type', 'whether_Newguest', 'whether', 'new_oldDepartments'],
  name: 'doctorDeduction',
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      forms: {
        amountPayable: 0, // 应付金额
        countId: 0, // 客户数量
        deductionAmount: 0, //已执行业绩
        performance: 0, // 已划扣业绩
        remainPerformance: 0, // 剩余待执行业绩
      },
      // 列表
      boyMap: {},
      // tableDatas: [],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],

      //  序列清单
      columns: [
        //   custom: 'sex' // 调用字段或修改字体颜色
        //  width: 200, // 列表宽度
        // showOverflowTooltip: true // 字符串溢出隐藏
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        // {
        //   lab: '区域',
        //   val: 'wxName'
        // },
        {
          lab: '收费单号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 160
        },
        {
          lab: '开单业绩',
          val: 'billingPerformance',
          width: 120
        },
        {
          lab: '科室业绩',
          val: 'departmentPerformance',
          width: 120
        },
        {
          lab: '还款业绩',
          val: 'repaymentAmount'
        },
        {
          lab: '退款业绩',
          val: 'refundPerformance'
        },
        {
          lab: '当次治疗次数',
          val: 'thisScribingNum',
          width: 120
        },
        {
          lab: '本次执行业绩',
          val: 'performance',
          width: 120
        },
        {
          lab: '已划扣应生成业绩',
          val: 'deductionAmount',
          width: 120
        },
        {
          lab: '本次待划扣业绩',
          val: 'toBeDeducted',
          width: 120
        },
        {
          lab: '欠款金额',
          val: 'debtAmount'
        },
        {
          lab: '项目名称',
          val: 'projectName',
          width: 180
        },
        {
          lab: '产品次数',
          val: 'priceNum'
        },
        {
          lab: '产品数量',
          val: 'quantity'
        },
        {
          lab: '产品总次数',
          val: 'quantitySum',
          width: 120
        },
        {
          lab: '已治疗次数',
          val: 'treatedNumber',
          width: 120
        },
        {
          lab: '剩余次数',
          val: 'surplusNumber'
        },
        {
          lab: '剩余待执行业绩',
          val: 'surplusDepartmentPerformance',
          width: 120
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 160
        },
        {
          lab: '一级项目',
          val: 'departmentName',
          width: 100

        },
        {
          lab: '二级项目',
          val: 'projectTypeName',
          width: 140
        },
        {
          lab: '三级项目',
          val: 'projectName',
          width: 100

        },
        {
          lab: '是否生成执行业绩',
          val: 'isExecute',
          custom: 'isExecute',
          width: 120
        },
        {
          lab: '生成业绩时间',
          val: 'genAmentTime',
          width: 180
        },
        {
          lab: '治疗时间',
          val: 'treatStartTime',
          width: 180
        },
        {
          lab: '是否治疗',
          val: 'isTreatment',
          custom: 'isTreatment',
        },
        {
          lab: '客户类型',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '实际执行医生',
          val: 'aueName',
          width: 120
        },
        {
          lab: '医生',
          val: 'doctorName'
        },
        {
          lab: '医助',
          val: 'dassName'
        },
        {
          lab: '护士',
          val: 'cnName'
        },
        {
          lab: '麻醉方式',
          val: 'anesthesiaMethod'
        },
        {
          lab: '麻醉师',
          val: 'alName'
        },
        {
          lab: '美学顾问',
          val: 'acName'
        },

        {
          lab: '客户代表',
          val: 'crName'
        },
        {
          lab: '备注',
          val: 'remark',
          width: 180
        },


      ],
      // 查询出列表
      options: {
        treatStartTime: {
          type: 'Tdatetime',
          label: '治疗时间',
          clearable: true,
          showOverflowTooltip: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          showOverflowTooltip: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号：'
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        orderNumber: {
          type: 'input',
          label: '收费单编号：'
        },
        isBillingPerformance: {
          type: 'select',
          label: '是否有开单业绩',
          clearable: true,
          options: []

        },
        isDepartmentPerformance: {
          type: 'select',
          label: '是否有科室业绩：',
          clearable: true,
          options: []
        },
        isRepaymentAmount: {
          type: 'select',
          label: '是否有还款业绩：',
          clearable: true,
          options: []
        },
        debtAmount: {
          type: 'Tinput',
          label: '欠款金额',
          clearable: true,
          values: []
        },
        doctorId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        actualExecutorUser: {
          type: 'select',
          label: '实际执行医生',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        customerRepresentative: {
          type: 'select',
          label: '客户代表',
          clearable: true,
          options: []
        },
        doctorAssistant: {
          type: 'select',
          label: '医助',
          clearable: true,
          options: []
        },
        circulatingNurse: {
          type: 'select',
          label: '护士',
          clearable: true,
          options: []
        },
        isTreatment: {
          type: 'select',
          label: '是否治疗',
          clearable: true,
          options: []
        },
        billingDepartment: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '一级项目',
          options: [],
          values: '',
          clearable: true
        },
        projectTypeId: {
          type: 'select',
          label: '二级项目',
          options: [],
          values: '',
          clearable: true
        },
        categoryId: {
          type: 'select',
          label: '三级项目',
          options: [],
          values: '',
          clearable: true
        },
        projectName: {
          type: 'input',
          label: '项目名称：'
        },
        thisScribingNum: {
          type: 'Tinput',
          label: '当次治疗次数',
          clearable: true,
          values: []
        },
        surplusDepartmentPerformance: {
          type: 'Tinput',
          label: '剩余待执行业绩',
          clearable: true,
          values: []
        }
      },

      physicianAssistantData: [], // 医生助理列表
      nurseData: [], // 护士列表
      operativeData: [], // 手术执行人
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
      this.getuserList(val)
      // this.getuserList()
    },
    // 一二三级项目
    'options.departmentId.values'() {
      this.options.projectTypeId.options = []
      this.options.categoryId.options = []
      this.options.projectTypeId.values = ''
      this.getDepartmentTwo(this.options.departmentId.values)
    },
    'options.projectTypeId.values'() {
      this.options.categoryId.options = []
      this.options.categoryId.values = ''
      this.getDepartmentThree(this.options.projectTypeId.values)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData() // 搜索
    this.getUserList(this.deptId) // 人员
    // this.getChannelInfo()
    this.getDepartmentOne() // 一二三 级项目
    // this.deptFilingList()
    // this.options.triageType.options = this.dict.type.Triage_type
    // this.options.deptType.options = this.dict.type.new_oldDepartments
    // this.options.isSecondary.options = this.dict.type.whether
    // this.options.statasus.options = this.dict.type.whether
    // this.options.isPackage.options = this.dict.type.whether
    // this.options.customerStatus.options = this.dict.type.whether_Newguest
    // this.options.billType.options = this.dict.type.billing_type
    // this.options.customSex.options = this.dict.type.sys_user_sex
    this.options.isBillingPerformance.options = this.dict.type.whether
    this.options.isDepartmentPerformance.options = this.dict.type.whether
    this.options.isRepaymentAmount.options = this.dict.type.whether
    this.options.isTreatment.options = this.dict.type.whether
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    ordernumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus } })
    },
    // 获取数据
    getData: debounce(async function (isSearch, ispage) {
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime' || this.options[k].type === 'Tinput') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
            data[k] = this.options[k].values[0]
            data['end' + k] = this.options[k].values[1]
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data['begin' + k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data['begin' + k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data['begin' + k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data['begin' + k] = null
            data['end' + k] = null
          } else {
            if (this.options[k].values === '') {
              data[k] = undefined
            } else {
              data[k] = this.options[k].values
            }
          }
        } else if (this.options[k].type === 'cascader') {
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        }
        if (this.options[k].values === '') {
          data[k] = undefined
        } else {
          data[k] = this.options[k].values
        }
      }
      this.$delete(data, 'checkoutTime')
      var form = {
        deptId: this.deptId,
        customerName: data.customerName, // 姓名
        customPhone: data.customPhone, // 电话
        customCardNumber: data.customCardNumber, // 卡号
        isBillingPerformance: data.isBillingPerformance, // 开单业绩
        isDepartmentPerformance: data.isDepartmentPerformance, // 科室业绩
        isRepaymentAmount: data.isRepaymentAmount, // 还款业绩
        refundPerformance: data.refundPerformance, // 退款业绩
        debtAmount: data.debtAmount[0], // 欠款金额
        enddebtAmount: data.debtAmount[1], // 欠款金额
        toBeDeducted: data.toBeDeducted, // 本次待划扣业绩
        projectName: data.projectName, // 项目名称
        // isPackage: data.isPackage, // 套餐
        // membershipEvel: data.membershipEvel, // 会员等级
        doctorId: data.doctorId, // 医生
        actualExecutorUser: data.actualExecutorUser,// 实际执行医生
        doctorAssistant: data.doctorAssistant, // 医助
        circulatingNurse: data.circulatingNurse,// 护士
        aestheticConsultant: data.aestheticConsultant, // 美学顾问
        customerRepresentative: data.customerRepresentative, // 客户代表
        alName: data.alName, // 麻醉师
        anesthesiaMethod: data.anesthesiaMethod, // 麻醉方式
        thisScribingNum: data.thisScribingNum[0],  //当次治疗次数开始
        endthisScribingNum: data.thisScribingNum[1], //当次治疗次数结束
        surplusDepartmentPerformance: data.surplusDepartmentPerformance[0], //剩余执行业绩开始
        endsurplusDepartmentPerformance: data.surplusDepartmentPerformance[1], //剩余执行业绩结束
        orderNumber: data.orderNumber, // 收费单号
        customerStatus: data.customerStatus, // 客户状态
        isExecute: data.isExecute, // 是否有待执行业绩
        isTreatment: data.isTreatment, // 治疗状态
        begintreatStartTime: data.begintreatStartTime, // 开始治疗时间
        endtreatStartTime: data.endtreatStartTime, // 结束治疗时间
        begincheckoutTime: data.begincheckoutTime, // 开始结账时间
        endcheckoutTime: data.endcheckoutTime, // 结束结账时间
        billingDepartment: data.billingDepartment, // 科室
        departmentId: data.departmentId, // 一级项目
        projectTypeId: data.projectTypeId, // 二级项目
        categoryId: data.categoryId, // 三级项目
        billType: data.billType, // 单据类型
        triageType: data.triageType, // 分诊类型
        degreeIntention: data.degreeIntention, // 会员客服
        serviceAssistant: data.serviceAssistant, // 服务助理
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      if (ispage == '1') {
        form = Object.assign(form, this.pagination)
      }

      this.$api.product.doctorAcment(form).then(res => {
        if (res) {
          if (ispage == '2') {
            if (res.rows.length == 0) {
              this.$message.warning('无数据无法导出数据');
            } else {
              let arrExports = [];
              res.rows.forEach(value => {
                let exportlist = {
                  '客户姓名': value.customerName,
                  '电话': value.customPhone,
                  '客户卡号': value.customCardNumber,
                  '收费单号': value.orderNumber,
                  '结账时间': value.checkoutTime,
                  '开单业绩': value.billingPerformance,
                  '科室业绩': value.departmentPerformance,
                  '还款业绩': value.repaymentAmount,
                  '退款业绩': value.refundPerformance,
                  '当次治疗次数': value.thisScribingNum,
                  '本次执行业绩': value.performance,
                  '已划扣应生成业绩': value.deductionAmount,
                  '本次待划扣业绩': value.toBeDeducted,
                  '欠款金额': value.debtAmount,
                  '项目名称': value.projectName,
                  '产品次数': value.priceNum,
                  '产品数量': value.quantity,
                  '产品总次数': value.quantitySum,
                  '已治疗次数': value.treatedNumber,
                  '剩余次数': value.surplusNumber,
                  '剩余待执行业绩': value.surplusDepartmentPerformance,
                  '科室': value.departmentName,
                  '一级项目': value.departmentName,
                  '二级项目': value.projectTypeName,
                  '三级项目': value.projectName,
                  '是否生成执行业绩': value.isExecute,
                  '生成业绩时间': value.genAmentTime,
                  '治疗时间': value.treatStartTime,
                  '是否治疗': value.isTreatment,
                  '客户类型': value.customerStatus,
                  '实际执行医生': value.aueName,
                  '医生': value.doctorName,
                  '医助': value.dassName,
                  '护士': value.cnName,
                  '麻醉方式': value.anesthesiaMethod,
                  '麻醉师': value.alName,
                  '美学顾问': value.acName,
                  '客户代表': value.crName,
                  '备注': value.remark,



                }
                arrExports.push(exportlist)
              })
              const data = XLSX.utils.json_to_sheet(arrExports)
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
              XLSX.writeFile(wb, '医生划扣明细查询.xlsx')

            }
            return
          }
          // res.rows.forEach(item => {
          //   if (item.state === '1' || item.state === '0') {
          //     item.isExecute = '是'
          //   } else {
          //     item.isExecute = '否'
          //   }
          // })
          this.tableData = res.rows
          this.pagination.total = res.total
          this.form = res.data
          this.boyMap = res.data

        }
      })
    }),
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData('',1)
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData('',1)
    },
    // 导出
    exportExcel() {
      console.log('导出')
    },

    /**
     * @author 李尚
     * @date 2022/10/13
     * @Description: 一二三项目
     */
    // 一级
    getDepartmentOne() {
      this.options.projectTypeId.options = []
      this.options.categoryId.options = []
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentId.options = res.rows
          this.options.billingDepartment.options = res.rows
        }
      })
    },
    // 二级
    getDepartmentTwo(id) {
      this.options.categoryId.options = []
      this.$api.dept.TypeList({ departmentId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.projectTypeName
            item.value = item.projectTypeId
          })
          this.options.projectTypeId.options = res.rows
        }
      })
    },
    // 三级
    getDepartmentThree(id) {
      this.$api.dept.CategoryList({ projectTypeId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.options.categoryId.options = res.rows
        }
      })
    },
    getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          //医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor' || item.postCode === 'therapeutist' || item.postCode === 'chks' ) {
              this.options.doctorId.options.push(item)
              this.options.actualExecutorUser.options.push(item)
              this.options.doctorAssistant.options.push(item)
            }
          })

          // 护士
          res.data.forEach(item => {
            if (item.postCode === 'zerennurse') {
              this.options.circulatingNurse.options.push(item)
            }
          })
          // 美学顾问,客户代表
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.aestheticConsultant.options.push(item)
              this.options.customerRepresentative.options.push(item)
            }
          })

          // 去重

          const arr1 = this.unique(res.data)
          this.options.circulatingNurse.options = this.unique(this.options.circulatingNurse.options)
          this.options.doctorAssistant.options = this.unique(this.options.doctorAssistant.options)
          this.options.doctorId.options = this.unique(this.options.doctorId.options)
          this.options.actualExecutorUser.options = this.unique(this.options.actualExecutorUser.options)
          this.options.customerRepresentative.options = this.unique(this.options.customerRepresentative.options)
          this.options.aestheticConsultant.options = this.unique(this.options.aestheticConsultant.options)

        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 表格单选
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    rowClick(e) {
      // this.$refs.table.$refs.multipleTable.clearSelection()
      // this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row }) {
      if (row.state === '1' || row.state === '2') {
        return 'success-row'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 13px;
  margin-right: 5px;
}

::v-deep .el-dialog__header {
  background-color: #1abc9c;
}

.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}

span {
  color: #999;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}

.information-List>span {
  display: inline-block;
  margin-right: 5px;
}

::v-deep .el-table .success-row {
  background: #c6f9c3;
}

.color-block-success {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #7ec5b7;
  border-radius: 2px;
  border: 1px solid #7ec5b7;
}

.color-block-default {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border-radius: 2px;
  border: 1px solid #7ec5b7;
}
</style>

