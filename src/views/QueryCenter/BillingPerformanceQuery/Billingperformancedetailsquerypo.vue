<template>
  <!--  开单业绩明细查询（个人）-->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @keydown.enter.native="getData(true,'1')" @click.stop="getData(true, '1')">查询
        </el-button>

        <el-button size="mini" v-has-permi="['confinement:queryCenter:exportBillingdetail']" icon="el-icon-upload2" type="success" plain @click.stop="getData(true, '2')">导出
        </el-button>
      </div>
      <slot>
        <SgTable :table-data="tableData" index="序号" size="mini" border :columns="columns" :pagination="pagination"
          @size-change="sizeChange" @current-change="currentChange">
          <div slot="searchBar" class="header-float">
            <div>
              <span class="title">统计信息</span>
            </div>
            <div>
              <span class="title">人数：{{ boyMap.customerToal }}&nbsp;&nbsp;开单业绩合计：{{ boyMap.billingPerformance
              }}&nbsp;科室业绩合计：{{ boyMap.departmentPerformance }}
                科室、客户状态取收费单对应接诊表数据，辅助治疗和检验没有科室信息</span>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单</div>
          </div>
          <!--字典-->
          <template #custom="data">
            <div v-if="data.props === 'billType'">
              <dict-tag :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'customerStatus'">
              <dict-tag :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
            </div>
            <div v-else-if="data.props === 'customName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id, data.custom)">{{
                data.custom.customName }} </a><span style="font-size: 15px">{{ data.custom.customSex === '0' ? '♀' : '♂' }}
              </span><span>{{ data.custom.customAge }}岁</span>
            </div>
            <div v-else-if="data.props === 'channelName'">
              <p>{{ data.custom.typeName }}{{ data.custom.channelName === null ? '' : '/' }}{{ data.custom.channelName }}
              </p>
            </div>
            <div v-if="data.props === 'triageType'">
              <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
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
import { debounce } from '@/utils/throttleAndDebounce'
import { todayTime } from '@/utils/time'
import moment from 'moment'
import XLSX from 'xlsx';


export default {
  dicts: ['sys_user_sex', 'billing_type', 'Triage_type', 'whether_Newguest', 'whether', 'new_oldDepartments'],
  name: 'Billingperformancedetailsquerypo',
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      boyMap: {},
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
          lab: '渠道',
          val: 'typeThreeName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '媒介',
          val: 'channelName',
          custom: 'channelName',
          width: 180,
          showOverflowTooltip: true
        },
        // {
        //   lab: '标签',
        //   val: '',
        //   width: 120
        // },
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
          lab: '收费单备注',
          val: '',
          width: 120
        },
        {
          lab: '项目名称',
          val: 'projectName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '购买数量',
          val: 'quantity',
          width: 120
        },
        {
          lab: '产品次数',
          val: 'quantity',
          width: 120
        },
        {
          lab: '产品总次数',
          val: 'quantitySum',
          width: 120
        },
        {
          lab: '退款次数',
          val: 'refundNum',
          width: 120
        },
        {
          lab: '一级类型',
          val: 'departmentName',
          width: 120
        },
        {
          lab: '二级类型',
          val: 'projectTypeName',
          width: 120
        },
        {
          lab: '三级类型',
          val: 'categoryName',
          width: 120
        },
        {
          lab: '费用类型',
          val: 'costType',
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
          lab: '会员客服',
          val: 'mciName',
          width: 120
        },
        {
          lab: '服务助理',
          val: 'saName',
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
          lab: '结账日期',
          val: 'checkoutTime',
          width: 160
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
          lab: '科室业绩',
          val: 'departmentPerformance',
          width: 120
        },
        {
          lab: '折扣',
          val: 'discount',
          width: 80
        },
        {
          lab: '折后金额',
          val: 'discountAmount',
          width: 120
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: 120
        },
        {
          lab: '会员卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '源收费单类型',
          val: '',
          width: 120
        }
      ],
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结帐日期',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
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
          label: '项目名称'
        },
        customrName: {
          type: 'input',
          label: '产品套餐'
        },
        custmerNsame: {
          type: 'input',
          label: '产品项目组合'
        },
        isPackage: {
          type: 'select',
          label: '是否套餐',
          options: [],
          clearable: true
        },
        statasus: {
          type: 'select',
          label: '是否产品组合',
          options: [],
          clearable: true
        },
        billType: {
          type: 'select',
          label: '收费单据类型',
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
          label: '分诊类型',
          options: [],
          clearable: true
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '电话'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号'
        },
        customAge: {
          type: 'Tinput',
          label: '年龄',
          clearable: true,
          values: []
        },
        customSex: {
          type: 'select',
          label: '性别',
          clearable: true,
          options: []
        },
        // customCardNumber: {
        //   type: 'input',
        //   label: '会员卡号：'
        // },
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
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        custSseaxdd: {
          type: 'select',
          label: '主服务助理',
          clearable: true,
          options: []
        },
        doctorId: {
          type: 'select',
          label: '医生',
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
          label: '收费单号'
        },
        discount: {
          type: 'Tinput',
          label: '折扣',
          clearable: true,
          values: []
        }
      },
      // 媒介来源数据
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
      this.getChannelInfo()
    },
    // 媒介类型/媒介来源
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
    this.getUserList() // 人员
    this.getChannelInfo()
    this.getDepartmentOne() // 一二三 级项目
    this.deptFilingList()
    this.options.triageType.options = this.dict.type.Triage_type
    this.options.deptType.options = this.dict.type.new_oldDepartments
    this.options.isSecondary.options = this.dict.type.whether
    this.options.statasus.options = this.dict.type.whether
    this.options.isPackage.options = this.dict.type.whether
    this.options.customerStatus.options = this.dict.type.whether_Newguest
    this.options.billType.options = this.dict.type.billing_type
    this.options.customSex.options = this.dict.type.sys_user_sex
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
      this.$router.push({ path: 'billDetails' })
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus } })
    },
    // 获取数据
    getData: debounce(function (isSearch, ispage) {
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
      this.$delete(data, 'checkoutTime')
      var form = {
        deptId: this.deptId,
        projectName: data.projectName, // 项目名称
        isPackage: data.isPackage, // 套餐
        membershipEvel: data.membershipEvel, // 会员等级
        aestheticConsultant: data.aestheticConsultant, // 美学顾问
        customerRepresentative: data.customerRepresentative, // 客户代表
        // 开单推荐人
        doctorId: data.doctorId, // 医生
        orderNumber: data.orderNumber, // 收费单号
        customerStatus: data.customerStatus, // 客户状态
        params: {
          customerName: data.customerName,
          filingIds: data.filingIds, // 预约类型
          typeTwoIds: data.typeTwoIds,
          typeThreeIds: data.typeThreeIds,
          begindiscount: data.discount[0], // 折扣
          enddiscount: data.discount[1],
          channelTypeId: data.channelId[0], // 媒介类型
          channelId: data.channelId[1],
          onlineUserId: data.onlineUserId, // 线上客服
          customCardNumber: data.customCardNumber, // 卡号
          begincustomAge: data.customAge[0], // 年龄
          endcustomAge: data.customAge[1],
          begincheckoutTime: data.begincheckoutTime, // 开始时间
          endcheckoutTime: data.endcheckoutTime, // 结束时间
          customName: data.customName, // 客户姓名
          customPhone: data.customPhone, // 电话
          customSex: data.customSex, // 性别
          refereeuserId: data.refereeuserId, // 员工推荐人
          isSecondary: data.isSecondary, // 二次到院
          // 产品套餐
          // 产品项目组合
          // 是否产品组合
          // 主服务助理
          departmentId: data.departmentId, // 一级项目
          projectTypeId: data.projectTypeId, // 二级项目
          categoryId: data.categoryId, // 三级项目
          billType: data.billType, // 单据类型
          triageType: data.triageType, // 分诊类型
          degreeIntention: data.degreeIntention, // 会员客服
          serviceAssistant: data.serviceAssistant, // 服务助理
          deptType: data.deptType // 科室状态
        }
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      if (ispage == '1') {
        form = Object.assign(form, this.pagination)
      }

      this.$api.product.selectOrderInfoList(form).then(res => {
        if (res) {
          if (ispage == '2') {
            if (res.rows.length == 0) {
              this.$message.warning('无数据无法导出数据');
            } else {
              let arrExports = [];
              res.rows.forEach(value => {
                let exportlist = {
                  '美学顾问': value.acName,
                  '客户代表': value.crName,
                  '员工推荐人': value.riName,
                  "开单人": value.duName,
                  "开单推荐人": value.srName,
                  "分诊类型": value.triageType,
                  "渠道": value.typeThreeName,
                  "媒介": value.channelName,
                  "医生": value.doctorName,
                  "科室": value.departmentName,
                  "收费单号": value.orderNumber,
                  "收费单类型": value.billType,
                  "收费单备注": '',
                  "项目名称": value.projectName,
                  "购买数量": value.quantity,
                  "产品次数": value.quantity,
                  "产品总次数": value.quantitySum,
                  "退款次数": value.refundNum,
                  "一级类型": value.departmentName,
                  "二级类型": value.projectTypeName,
                  "三级类型": value.categoryName,
                  "费用类型": value.costType,
                  "客户姓名": value.customName,
                  "会员等级": value.membershipEvel,
                  "会员客服": value.memberCustomerId,
                  "服务助理": value.serviceAssistan,
                  "电话": value.customPhone,
                  "客户卡号": value.customCardNumber,
                  "客户状态": value.customerStatus,
                  "二次到院": value.two,
                  "结账日期": value.checkoutTime,
                  "应付金额": value.amountPayable,
                  "实付金额": value.paidAmount,
                  "开单业绩": value.billingPerformance,
                  "科室业绩": value.departmentPerformance,
                  "折扣": value.discount,
                  "折后金额": value.discountAmount,
                  "线上客服": value.onlineUserName,
                  "会员卡号": value.mcustomCardNumber,
                  "源收费单类型": value.oldBillTyp

                }
                arrExports.push(exportlist)
              })
              const data = XLSX.utils.json_to_sheet(arrExports)
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
              XLSX.writeFile(wb, '开单业绩明细查询.xlsx')

            }
            return
          }
          this.tableData = res.rows
          this.pagination.total = res.total
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
    // 获取渠道信息
    getChannelInfo() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
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
    // 获取预约类型
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
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
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
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.options.doctorId.options.push(item)
            }
          })
          // 线上客服
          res.data.forEach(item => {
            if (item.postCode === 'wdzxs') {
              this.options.onlineUserId.options.push(item)
            }
          })
          // 服务助理
          res.data.forEach(item => {
            if (item.postCode === 'physician-assisted') {
              this.options.serviceAssistant.options.push(item)
            }
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.options.refereeuserId.options = arr1
          this.options.secondRecommender.options = arr1
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.customerRepresentative.options.push(item)
              this.options.aestheticConsultant.options.push(item)
            }
          })
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

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

.container {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 13px;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}
</style>
