<template>
  <!--来院业绩明细查询-->
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
            <div style="font-size: 13px;color: #9a9a9a">
              <span>总人数：0.00</span>&nbsp;
              <span>新客首次： 0.00</span>&nbsp;
              <span>新客二次： 0.00</span>&nbsp;
              <span>新客： 0.00</span>&nbsp;
              <span>老客： 0.00</span>&nbsp;
              <span>开单业绩： 0.00</span>&nbsp;
              <span>科室业绩： 0.00</span>
            </div>
          </div>
          <div slot="header">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单</div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
            </div>
            <div v-else-if="data.props === 'customName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customName }} </a><span style="font-size: 14px">{{ data.custom.customSex === '0' ? '♀': '♂' }} </span><span>{{ data.custom.customAge }}岁</span><span>{{ data.custom.customerStatus }}</span>
            </div>
            <div v-else-if="data.props==='deptType'">
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
  dicts: ['sys_user_sex', 'billing_status', 'Triage_type', 'billing_type', 'new_oldDepartments', 'whether_Newguest', 'whether'],
  name: 'Visitingperformancequery',
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      form: {},
      tableData: [],
      columns: [
        {
          lab: '客户姓名',
          val: 'customName',
          custom: 'customName',
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
          lab: '会员等级',
          val: 'customCardNumber',
          width: 140
        },
        {
          lab: '媒介',
          val: 'channelName',
          custom: 'channelName',
          width: 120
        },
        {
          lab: '地区',
          val: 'areas',
          width: 120
        },
        {
          lab: '建档类型',
          val: 'areas',
          width: 120
        },
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
          lab: '服务助理',
          val: 'serviceAssistant',
          width: 120
        },
        {
          lab: '会员客服',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '建档人',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '线上客服',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '网电回访人',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '接诊时间',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '接诊编号',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '接诊状态',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 80
        },
        {
          lab: '导医',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '接诊美学顾问',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 120
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 120
        },
        {
          lab: '结账时间',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '收费单号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '收费单状态',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 80
        },
        {
          lab: '开单人',
          val: 'duName',
          width: 120
        },
        {
          lab: '开单美学顾问',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '开单客户代表',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '开单推荐人',
          val: 'srName',
          width: 120
        },
        {
          lab: '一级类型',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '二级类型',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '三级类型',
          val: 'memberCustomerId',
          width: 120
        },
        {
          lab: '项目名称',
          val: 'memberCustomerId',
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
          lab: '科室业绩',
          val: 'memberCustomerId',
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
          label: '结账时间|接诊时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
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
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        customerRepresentative: {
          type: 'select',
          label: '归属客户代表',
          clearable: true,
          options: []
        },
        customSex: {
          type: 'select',
          label: '性别',
          clearable: true,
          options: []
        },
        customerStatus: {
          type: 'select',
          label: '新老客户',
          clearable: true,
          options: []
        },
        membershipEvel: {
          type: 'select',
          label: '会员等级',
          clearable: true,
          options: []
        },
        channelId: {
          type: 'Tselect',
          label: '媒介类型/媒介来源',
          clearable: true,
          values: [],
          options: []
        },
        typeThreeId: {
          type: 'cascader',
          label: '建档类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        visituserId: {
          type: 'select',
          label: '网电回访人',
          clearable: true,
          options: []
        },
        jiezhen: {
          type: 'input',
          label: '接诊编号'
        },
        createTime: {
          type: 'Tdatetime',
          label: '建档时间',
          clearable: true,
          values: []
        },
        triageType: {
          type: 'select',
          label: '接诊状态',
          clearable: true,
          options: []
        },
        doctorId: {
          type: 'select',
          label: '导医',
          clearable: true,
          options: []
        },
        iezhenstatet: {
          type: 'select',
          label: '接诊客户状态',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '是否新客二次',
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
        CheckoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: []
        },
        iservenstatet: {
          type: 'select',
          label: '是否有接诊',
          clearable: true,
          options: []
        },
        dsingleUser: {
          type: 'select',
          label: '开单人',
          clearable: true,
          options: []
        },
        ervenstatetacname: {
          type: 'select',
          label: '收费单美学顾问',
          clearable: true,
          options: []
        },
        ervenstatesstacname: {
          type: 'select',
          label: '收费单客户代表',
          clearable: true,
          options: []
        },
        secondRecommender: {
          type: 'select',
          label: '开单推荐人',
          clearable: true,
          options: []
        },
        seconmenderdoctoer: {
          type: 'select',
          label: '收费单医生',
          clearable: true,
          options: []
        },
        billType: {
          type: 'select',
          label: '收费单类型',
          clearable: true,
          options: []
        },
        billingStatus: {
          type: 'select',
          label: '收费单状态',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        departmentOne: {
          type: 'select',
          label: '一级项目:',
          options: [],
          values: '',
          clearable: true
        },
        departmentTwo: {
          type: 'select',
          label: '二级项目:',
          options: [],
          values: '',
          clearable: true
        },
        departmentThree: {
          type: 'select',
          label: '三级项目:',
          options: [],
          values: '',
          clearable: true
        },
        projectName: {
          type: 'input',
          label: '项目名称'
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
      this.getDepartmentOne()
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
    },
    'options.departmentOne.values'() {
      this.options.departmentTwo.values = ''
      this.getDepartmentTwo(this.options.departmentOne.values)
    },
    'options.departmentTwo.values'() {
      this.options.departmentThree.values = ''
      this.getDepartmentThree(this.options.departmentTwo.values)
    }
  },
  created() {
    this.getUserList()
    this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getChannelInfo()
    this.Department()
    this.deptFilingList()
    this.getDepartmentOne()
    this.options.triageType.options = this.dict.type.Triage_type
    this.options.deptType.options = this.dict.type.new_oldDepartments
    this.options.isSecondary.options = this.dict.type.whether
    this.options.iservenstatet.options = this.dict.type.whether
    this.options.customSex.options = this.dict.type.sys_user_sex
    this.options.customerStatus.options = this.dict.type.whether_Newguest
    this.options.billingStatus.options = this.dict.type.billing_status
    this.options.billType.options = this.dict.type.billing_type
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
    getData: debounce(function(isSearch) {
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
        deptId: this.deptId, // 公司
        customerName: data.customerName, // 客户姓名
        customPhone: data.customPhone, // 电话
        customSex: data.customSex, // 性别
        customCardNumber: data.customCardNumber, // 卡号
        customerRepresentative: data.customerRepresentative, // 客户代表
        membershipEvel: data.membershipEvel, // 会员等级
        onlineUserId: data.onlineUserId, // 线上客服
        departmentId: data.departmentId, // 科室
        doctorId: data.doctorId, // 导医
        params: {
          begincheckoutTime: data.begincheckoutTime, // 开始时间
          endcheckoutTime: data.endcheckoutTime, // 结束时间
          customerStatus: data.customerStatus, // 客户状态
          channelTypeId: data.channelId[0], // 媒介类型
          channelId: data.channelId[1],
          filingIds: data.filingIds, // 预约类型
          typeTwoIds: data.typeTwoIds,
          typeThreeIds: data.typeThreeIds,
          deptType: data.deptType, // 科室状态
          aestheticConsultant: data.aestheticConsultant, // 美学顾问
          secondRecommender: data.secondRecommender, // 开单推荐人
          orderNumber: data.orderNumber, // 收费单号
          // 是否新客二次
          visituserId: data.visituserId,
          // 接诊编号
          // 接诊状态
          // 接诊客户状态
          // 是否有接诊
          // 开单人
          // 收费单美学顾问
          // 收费单客户代表
          // 收费单医生
          // 收费单类型
          // 收费单状态
          // 一级项目
          // 二级项目
          // 三级项目
          // 项目名称
        }
      }
      // 重新搜索页面回归第一页
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      form = Object.assign(form, this.pagination)
      // this.tableData = res.rows
      // this.form = res.data
      // 实付总额
      // this.form.Payment = math.add(
      //   res.data.normalBill,
      //   res.data.deposit,
      //   res.data.depositValue,
      //   res.data.hospitalization,
      //   res.data.adjuvant,
      //   res.data.inspection,
      //   res.data.statement,
      //   res.data.cardValue,
      //   res.data.repayment)
      // // 退款总额
      // this.form.refundMoney = math.add(
      //   res.data.refund,
      //   res.data.refundAdvance,
      //   res.data.refundValue,
      //   res.data.refundHospitalization,
      //   res.data.refundAdjuvant,
      //   res.data.refundInspection,
      //   res.data.refundStatement,
      //   res.data.refundCardValue
      // )
      // this.pagination.total = res.total
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
    // 获取渠道信息
    getChannelInfo(val) {
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
      this.$api.modules.channel.getChannelType(data).then(res => {
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
    getDepartmentOne() {
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentOne.options = res.rows
        }
      })
    },
    getDepartmentTwo(id) {
      this.$api.dept.TypeList({ departmentId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.projectTypeName
            item.value = item.projectTypeId
          })
          this.options.departmentTwo.options = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/24
     * @Description: 查询科室二级
     */
    getDepartmentThree(id) {
      this.$api.dept.CategoryList({ projectTypeId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.options.departmentThree.options = res.rows
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
    // 员工信息
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
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.options.doctorId.options.push(item)
              this.options.seconmenderdoctoer.options.push(item)
            }
          })
          // 线上客服
          res.data.forEach(item => {
            if (item.postCode === 'wdzxs') {
              this.options.onlineUserId.options.push(item) // 线上客服
              this.options.visituserId.options.push(item) // 网电回访人
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
          this.options.dsingleUser.options = arr1 // 开单人
          this.options.ervenstatetacname.options = arr1
          this.options.ervenstatesstacname.options = arr1
          this.options.secondRecommender.options = arr1 // 开单推荐人
        }
      })
    },
    // 去重
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
  font-size: 13px;
  color: #999;
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
