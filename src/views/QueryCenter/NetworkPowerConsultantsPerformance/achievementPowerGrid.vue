<template>
  <!-- 网电咨询师业绩查询 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
        >查询
        </el-button>
      </div>
      <slot>
        <!-- selection 前面是否有括号勾选 -->
        <SgTable
          :table-data="tableData"
          index="序号"
          size="mini"
          border
          :columns="columns"
          :pagination="pagination"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <div slot="searchBar" class="header-float">
            <div>
              <p class="title">统计信息（科室、客户状态取收费单对应接诊表数据，辅助治疗和检验没有科室信息）</p>
            </div>
            <div>
              <ul>
                <li>
                  开单业绩:
                  <span>{{ form.transactionMoney }}</span>&nbsp;&nbsp;&nbsp;
                  <span>[ 总人数：{{ form.customerToal }} 新客首次：{{ form.newCustomerFitst }} 新客二次：{{ form.newCustomerSecond }} 新客：{{ form.newCustomer }} 老客：{{ form.regularCustomer }} 返款后业绩：0.00 ]</span>
                </li>
                <li>
                  <span>实付总额:</span>&nbsp;
                  <span>正常收费单:</span>&nbsp;
                  <span>交预约金:</span>&nbsp;
                  <span>交储值:</span>&nbsp;
                  <span>交住院押金:</span>&nbsp;
                  <span>辅助治疗:</span>&nbsp;
                  <span>检验:</span>&nbsp;
                  <span>住院结算单:</span>&nbsp;
                  <span>交储值卡:</span>&nbsp;
                  <span>还款单:</span>&nbsp;&nbsp;
                </li>
                <li>
                  <span class="pay">{{ form.Payment }}</span>
                  <span class="pay">{{ form.normalBill }}</span>
                  <span class="pay">{{ form.deposit }}</span>
                  <span class="pay">{{ form.depositValue }}</span>
                  <span class="pay">{{ form.hospitalization }}</span>
                  <span class="pay">{{ form.adjuvant }}</span>
                  <span class="pay">{{ form.inspection }}</span>
                  <span class="pay">{{ form.statement }}</span>
                  <span class="pay">{{ form.cardValue }}</span>
                  <span class="pay">{{ form.repayment }}</span>
                </li>
                <li>
                  <span>退款总额:</span>&nbsp;&nbsp;
                  <span>退款单:</span>&nbsp;
                  <span>退预约金:</span>&nbsp;
                  <span>退储值:</span>&nbsp;
                  <span>退住院押金:</span>&nbsp;
                  <span>退辅助治疗:</span>&nbsp;
                  <span>退检验:</span>&nbsp;
                  <span>退住院结算单:</span>&nbsp;
                  <span>退储值卡:</span>&nbsp;
                </li>
                <li>
                  <span class="retreat">{{ form.refundMoney }}</span>
                  <span class="retreat">{{ form.refund }}</span>
                  <span class="retreat">{{ form.refundAdvance }}</span>
                  <span class="retreat">{{ form.refundValue }}</span>
                  <span class="retreat">{{ form.refundHospitalization }}</span>
                  <span class="retreat">{{ form.refundAdjuvant }}</span>
                  <span class="retreat">{{ form.refundInspection }}</span>
                  <span class="retreat">{{ form.refundStatement }}</span>
                  <span class="retreat">{{ form.refundCardValue }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单</div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'billType'">
              <dict-tag :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'reasonForRefund'">
              <dict-tag :options="dict.type.refund_reason" :value="data.custom.reasonForRefund" />
            </div>
            <div v-else-if="data.props === 'customerStatus'">
              <dict-tag :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
            </div>
            <div v-else-if="data.props === 'customName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customName }} </a><span style="font-size: 14px">{{ data.custom.customSex === '0' ? '♀': '♂' }} </span><span>{{ data.custom.customAge }}岁</span>
            </div>
            <div v-if="data.props==='triageType'">
              <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
            </div>
            <div v-if="data.props==='deptType'">
              <show-dict-data :options="dict.type.new_oldDepartments" :value="data.custom.deptType" />
            </div>
            <div v-else-if="data.props === 'channelName'">
              <p>{{ data.custom.typeName }}{{ data.custom.channelName === null ? '' : '/' }}{{ data.custom.channelName }}</p>
            </div>
            <div v-else-if="data.props === 'typeThreeId'">
              <p>{{ data.custom.typeThreeId }}</p>
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { math } from '@/utils/math'
import { debounce } from '@/utils/throttleAndDebounce'
import { todayTime } from '@/utils/time'
import moment from 'moment'
export default {
  dicts: ['sys_user_sex', 'billing_type', 'Triage_type', 'new_oldDepartments', 'refund_reason', 'whether_Newguest', 'whether'],
  name: 'achievementPowerGrid',
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      form: {
        Payment: 0.00, // 实付总金额
        refundMoney: 0.0, // 退款总金额
        transactionMoney: 0.00, // 开单业绩
        customerToal: 0, // 总人数
        newCustomerFitst: 0, // 新客首次
        newCustomerSecond: 0, // 新客二次
        regularCustomer: 0, // 老客
        newCustomer: 0, // 新客
        adjuvant: 0.00, // 辅助治疗
        cardValue: 0.00, // 交储值卡
        deposit: 0.00, // 交预约金
        depositValue: 0.00, // 交储值
        hospitalization: 0.00, // 交住院押金
        inspection: 0.00, // 检验
        normalBill: 0.00, // 正常收费单
        refund: 0.00, // 退款单
        refundAdjuvant: 0.00, // 退辅助治疗
        refundAdvance: 0.00, // 退预约金
        refundCardValue: 0.00, // 退储值卡
        refundHospitalization: 0.00, // 退住院押金
        refundInspection: 0.00, // 退检验
        refundStatement: 0.00, // 退住院押金结算
        refundValue: 0.00, // 退储值
        repayment: 0.00, // 还款单
        statement: 0.00 // 住院结算单
      },
      tableData: [],
      columns: [
        {
          lab: '美学顾问',
          val: 'acName',
          width: 120
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 120
        },
        {
          lab: '员工推荐人',
          val: 'riName',
          width: 120
        },
        {
          lab: '开单人',
          val: 'duName',
          width: 120
        },
        {
          lab: '开单推荐人',
          val: 'srName',
          width: 120
        },
        {
          lab: '分诊类型',
          val: 'triageType',
          custom: 'triageType',
          width: 120
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 120
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 120
        },
        {
          lab: '收费单号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 120
        },
        {
          lab: '退款原因',
          val: 'reasonForRefund',
          custom: 'reasonForRefund',
          width: 120
        },
        {
          lab: '客户姓名',
          val: 'customName',
          custom: 'customName',
          width: 120
        },
        {
          lab: '会员等级',
          val: 'membershipEvel',
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
        {
          lab: '地区',
          val: 'areas',
          width: 120
        },
        {
          lab: '客户状态',
          val: 'customerStatus',
          custom: 'customerStatus',
          width: 120
        },
        {
          lab: '二次到院',
          val: 'two',
          width: 120
        },
        {
          lab: '科室状态',
          val: 'deptType',
          custom: 'deptType',
          width: 120
        },
        {
          lab: '媒介',
          val: 'channelName',
          custom: 'channelName',
          width: 120
        },
        {
          lab: '预约类型',
          val: 'typeThreeId',
          custom: 'typeThreeId',
          width: 120
        },
        {
          lab: '会员卡号',
          val: 'mcustomCardNumber',
          width: 140
        },
        {
          lab: '会员客服',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '服务助理',
          val: 'serviceAssistant',
          width: 120
        },
        {
          lab: '结账日期',
          val: 'checkoutTime',
          width: 160
        },
        {
          lab: '总金额',
          val: 'totalExpenses',
          width: 120
        },
        {
          lab: '应付金额',
          val: 'amountPayable',
          width: 120
        },
        {
          lab: '实付金额',
          val: 'totalPayment',
          width: 120
        },
        {
          lab: '开单业绩',
          val: 'billingPerformance',
          width: 120
        },
        {
          lab: '财务收支总金额',
          val: '',
          width: 120
        },
        {
          lab: '返款后业绩',
          val: 'FtotalPayment',
          width: 120
        },
        {
          lab: '源收费单号',
          val: 'chargeSheeId',
          width: 140
        },
        {
          lab: '源收费单类型',
          val: 'oldBillType',
          width: 140
        }
      ],
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结帐日期',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        billType: {
          type: 'select',
          label: '收费单据类型：',
          options: [],
          clearable: true
        },
        typeThreeId: {
          type: 'cascader',
          label: '预约类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        channelId: {
          type: 'Tselect',
          label: '媒介类型/媒介来源',
          clearable: true,
          values: [],
          options: []
        },
        triageType: {
          type: 'select',
          label: '分诊类型：',
          options: [],
          clearable: true
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号：'
        },
        customAge: {
          type: 'Tinput',
          label: '年龄:',
          clearable: true,
          values: []
        },
        customSex: {
          type: 'select',
          label: '性别',
          clearable: true,
          options: []
        },
        reasonForRefund: {
          type: 'select',
          label: '退款原因',
          clearable: true,
          options: []
        },
        customerStatus: {
          type: 'select',
          label: '客户状态',
          clearable: true,
          options: []
        },
        membershipEvel: {
          type: 'select',
          label: '会员等级',
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
        degreeIntention: {
          type: 'select',
          label: '会员客服',
          clearable: true,
          options: []
        },
        serviceAssistant: {
          type: 'select',
          label: '服务助理',
          clearable: true,
          options: []
        },
        dsingleUser: {
          type: 'select',
          label: '开单人',
          clearable: true,
          options: []
        },
        secondRecommender: {
          type: 'select',
          label: '开单推荐人',
          clearable: true,
          options: []
        },
        refereeuserId: {
          type: 'select',
          label: '员工推荐人',
          clearable: true,
          options: []
        },
        doctorId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '二次到院',
          clearable: true,
          options: []
        },
        deptType: {
          type: 'select',
          label: '科室状态',
          clearable: true,
          options: []
        },
        orderNumber: {
          type: 'input',
          label: '收费单号:'
        },
        amountPayable: {
          type: 'Tinput',
          label: '应付金额',
          clearable: true,
          values: []
        },
        totalPayment: {
          type: 'Tinput',
          label: '实付金额',
          clearable: true,
          values: []
        },
        FtotalPayment: {
          type: 'Tinput',
          label: '返款后业绩',
          clearable: true,
          values: []
        }
      },
      channelType: [],
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
    },
    'options.channelId.values'() {
      if (this.options.channelId.values[0]) {
        this.options.channelId.options[1] = this.channelType.filter(filter => {
          return filter.typeId === this.options.channelId.values[0]
        })[0].channelInfo
      } else {
        this.options.channelId.options[1] = []
      }
    },
    'options.channelId.values.0'() {
      this.options.channelId.values[1] = ''
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.options.triageType.options = this.dict.type.Triage_type
    this.options.deptType.options = this.dict.type.new_oldDepartments
    this.options.isSecondary.options = this.dict.type.whether
    this.options.customerStatus.options = this.dict.type.whether_Newguest
    this.options.reasonForRefund.options = this.dict.type.refund_reason
    this.options.billType.options = this.dict.type.billing_type
    this.options.customSex.options = this.dict.type.sys_user_sex
    this.getChannelInfo()
    this.getUserList()
    this.Department()
    this.deptFilingList()
  },
  methods: {
    ordernumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    // 获取数据
    getData: debounce(async function(isSearch) {
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
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
      var form = {
        deptId: this.deptId,
        billType: data.billType, // 单据类型
        reasonForRefund: data.reasonForRefund, // 退款原因
        customerStatus: data.customerStatus, // 客户状态
        aestheticConsultant: data.aestheticConsultant, // 美学顾问
        customerRepresentative: data.customerRepresentative, // 客户代表
        refereeuserId: data.refereeuserId, // 员工推荐人
        doctorId: data.doctorId, // 医生
        departmentId: data.departmentId, // 科室
        orderNumber: data.orderNumber, // 收费单号
        secondRecommender: data.secondRecommender, // 开单推荐人
        params: {
          beginamountPayable: data.amountPayable[0], // 应付金额
          endamountPayable: data.amountPayable[1],
          begintotalPayment: data.totalPayment[0], // 实付金额
          endtotalPayment: data.totalPayment[1],
          channelTypeId: data.channelId[0], // 媒介类型
          channelId: data.channelId[1],
          isSecondary: data.isSecondary, // 二次到院
          dsingleUser: data.dsingleUser, // 开单人
          membershipEvel: data.membershipEvel, // 会员等级
          customerName: data.customerName, // 客户姓名
          // filingIds: data.filingIds, // 预约类型
          // typeTwoIds: data.typeTwoIds,
          // typeThreeIds: data.typeThreeIds,
          customCardNumber: data.customCardNumber, // 卡号
          customPhone: data.customPhone, // 电话
          begincustomAge: data.customAge[0], // 年龄
          endcustomAge: data.customAge[1],
          customSex: data.customSex, // 性别
          begincheckoutTime: data.begincheckoutTime, // 开始时间
          endcheckoutTime: data.endcheckoutTime, // 结束时间
          triageType: data.triageType, // 分诊类型
          degreeIntention: data.degreeIntention, // 会员客服
          serviceAssistant: data.serviceAssistant, // 服务助理
          deptType: data.deptType // 科室状态
          // 返款后业绩
        }
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      form = Object.assign(form, this.pagination)
      await this.$api.product.selectOrderInfo(form).then(res => {
        if (res) {
          this.tableData = res.rows
          this.form = res.data
          // 实付总额
          this.form.Payment = math.add(
            res.data.normalBill,
            res.data.deposit,
            res.data.depositValue,
            res.data.hospitalization,
            res.data.adjuvant,
            res.data.inspection,
            res.data.statement,
            res.data.cardValue,
            res.data.repayment)
          // 退款总额
          this.form.refundMoney = math.add(
            res.data.refund,
            res.data.refundAdvance,
            res.data.refundValue,
            res.data.refundHospitalization,
            res.data.refundAdjuvant,
            res.data.refundInspection,
            res.data.refundStatement,
            res.data.refundCardValue
          )
          this.pagination.total = res.total
        }
      })
    }),
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
    // 获取建档类型
    deptFilingList() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.filing.getFilingTypeById(data).then(res => {
        if (res.data) {
          this.options.typeThreeId.options = res.data
        }
      })
    },
    // 获取渠道信息
    async getChannelInfo(val) {
      this.deptId = val
      /**
       * @author 李尚
       * @date 2022/10/11
       * @Description: 公司状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      await this.$api.modules.channel.getChannelType(data).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            this.channelType = res.data
            this.respliceNameLabel(res.data)
            this.options.channelId.options.splice(0, 0, res.data)
          } else {
            this.options.channelId.options = []
            this.options.channelId.values = []
          }
        }
      })
    },
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
    },
    // 获取科室的列表
    Department() {
      /**
       * @author 李尚
       * @date 2022/10/13
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
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
    async getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.options.doctorId.options.push(item)
            }
          })
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.aestheticConsultant.options.push(item)
              this.options.customerRepresentative.options.push(item) // 客户代表
            }
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.options.serviceAssistant.options = arr1
          this.options.dsingleUser.options = arr1 // 开单人
          this.options.secondRecommender.options = arr1 // 开单推荐人
          this.options.refereeuserId.options = arr1 // 员工推荐人
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
.title{
  position: absolute;
  top: 0;
  left: 0;
  font-size: 13px;
}
.pay{
  float: left;
  display:block;
  color: #1abc9c;
  width: 10%;
  text-align:center;
}
.retreat{
  float: left;
  display:block;
  color: #3aa1ff;
  width: 10%;
  text-align:center;
}
ul {
  li {
    margin-top: 5px;
    list-style-type: none;
    font-size: 12px;
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar[data-v-3363c4d1]{
  height: 102px;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
