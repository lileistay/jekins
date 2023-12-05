<template>
  <!--  推荐人业绩查询（公司）-->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getData(true,'1')"
            @keydown.enter.native="getData(true,'1')"
        >搜索
        </el-button>

        <el-button size="mini" v-has-permi="[' confinement:queryCenter:exportreferrer']" icon="el-icon-upload2" type="success" plain @click.stop="getData(true, '2')">导出
        </el-button>
      </div>
    <sg-table
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar">
      </div>
      <div slot="header" class="header">
        <div>
          <span>推荐人开单业绩查询</span>
          <span>开单业绩合计：{{ billingPerformance }}</span>
          <span>科室、客户状态取收费单对应接诊表数据，辅助治疗和检验没有科室信息</span>
        </div>
        <div>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'billType'">
          <dict-tag :options="dict.type.billing_type" :value="data.custom.billType" />
        </div>
        <div v-if="data.props==='triageType'">
          <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
        </div>
        <div v-else-if="data.props === 'customName'">
          <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customName }} </a>
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
        </div>
        <div v-else-if="data.props === 'customerStatus'">
          <dict-tag :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
        </div>
      </template>
    </sg-table>
    </slideSearch>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { timeFmt,todayTime } from '@/utils/time'
import PinyinMatch from 'pinyin-match'
import slideSearch from '@/components/SlideSearchBar/index'
import moment from "moment";
import XLSX from 'xlsx';

export default {
  name: 'Referrerperformancequerycom',
  dicts: ['billing_type', 'Triage_type', 'whether_Newguest'],
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      billingPerformance: 0,
      form: {
        customerName: '',
        doctorId: '',
        customPhone: '',
        customCardNumber: '',
        orderNumber: '',
        triageType: '',
        dsingleUser: '',
        checkoutTime: todayTime(),
        customerRepresentative: '',
        aestheticConsultant: '',
        customerStatus: '',
        beginamountPayable: null,
        endamountPayable: null,
        secondRecommender: ''
      },
      billTypeList: [],
      billType: [],
      doctor: [],
      doctorList: [],
      esthetics: [],
      estheticsList: [],
      tableData: [], //
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
              lab: '收费单号',
              val: 'orderNumber',
              custom: 'orderNumber',
              width: 165
          },
          {
              lab: '客户卡号',
              val: 'customCardNumber',
              width: 165
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
          lab: '开单人',
          val: 'duName',
          width: 120
        },
        {
          lab: '归属美学顾问',
          val: 'acName',
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
          lab: '科室',
          val: 'departmentName',
          width: 120
        },

        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 120
        },

        {
          lab: '客户状态',
          val: 'customerStatus',
          custom: 'customerStatus',
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
          val: 'totalPayment',
          width: 120
        },
        {
          lab: '源收费单号',
          val: '',
          width: 120
        },
        {
          lab: '源收费单类型',
          val: '',
          width: 120
        }
      ],
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      options:{
          checkoutTime: {
              type: 'Tdatetime',
              label: '结帐日期',
              clearable: true,
              values:todayTime()
          },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        aestheticConsultant: {
          type: 'select',
          label: '归属美学顾问',
          clearable: true,
          options: []
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },
        doctorId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号：'
        },
        secondRecommender: {
          type: 'select',
          label: '开单推荐人',
          clearable: true,
          options: []
        },
        orderNumber: {
          type: 'input',
          label: '收费单号：'
        },
        triageType: {
          type: 'select',
          label: '分诊类型',
          clearable: true,
          options: []
        },
        billType: {
          type: 'select',
          label: '收费单类型',
          clearable: true,
          options: []
        },
        dsingleUser: {
          type: 'select',
          label: '开单人',
          clearable: true,
          options: []
        },

        customerStatus: {
          type: 'select',
          label: '客户状态',
          clearable: true,
          options: [
            {label:'新顾客',value:'0'},
            {label:'老顾客',value:'1'},
          ]
        },
        customerRepresentative: {
          type: 'select',
          label: '客户代表',
          clearable: true,
          options: []
        },
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
    this.options.triageType.options = this.dict.type.Triage_type
    this.options.billType.options = this.dict.type.billing_type
    this.getUserList()
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
    aestheFilter(val) {
      if (val) {
        this.esthetics = this.estheticsList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.esthetics = this.estheticsList
      }
    },
    doctorFilter(val) {
      if (val) {
        this.doctor = this.doctorList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.doctor = this.doctorList
      }
    },
    customerFilter(val) {
      if (val) {
        this.billTypeList = this.billType.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.billTypeList = this.billType
      }
    },
    // 搜索
    async getData(isSearch,ispage) {
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
        secondRecommender: data.secondRecommender,
        doctorId: data.doctorId,
        orderNumber: data.orderNumber,
        dsingleUser: data.dsingleUser,
        customerRepresentative: data.customerRepresentative,
        aestheticConsultant: data.aestheticConsultant,
        params: {
          customerStatus: data.customerStatus,
          beginamountPayable: data.beginamountPayable,
          endamountPayable: data.endamountPayable,
          billType: data.billType,
          customerName: data.customerName,
          customPhone:data.customPhone,
          customCardNumber: data.customCardNumber,
          triageType: data.triageType,
            begincheckoutTime:timeFmt('YYYY-mm-dd',data.checkoutTime)  ? timeFmt('YYYY-mm-dd',data.checkoutTime[0]) : null,
            endcheckoutTime:timeFmt('YYYY-mm-dd',data.checkoutTime)  ? timeFmt('YYYY-mm-dd',data.checkoutTime[1]) : null
        }
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      if(ispage=='1'){
        form = Object.assign(form, this.pagination)
      }

      await this.$api.product.recommendedPerformance(form).then(res => {
        if (res.code === 200) {
          if (ispage == '2') {
            if (res.rows.length == 0) {
              this.$message.warning('无数据无法导出数据');
            } else {
              let arrExports = [];
              res.rows.forEach(value => {
                let exportlist = {
                  "开单推荐人":value.srName,
                  "分诊类型":value.triageType,
                   "开单人":value.duName,
                  '归属美学顾问': value.acName,
                  '客户代表': value.crName,
                  // '员工推荐人': value.riName,
                  // "开单人": value.duName,
                  // "开单推荐人": value.srName,
                  // "分诊类型": value.triageType,
                  // "渠道": value.typeThreeName,
                  // "媒介": value.channelName,
                  "医生": value.doctorName,
                  "科室": value.departmentName,
                  "收费单号": value.orderNumber,
                  "收费单类型": value.billType,
                  // "收费单备注": '',
                  // "项目名称": value.projectName,
                  // "购买数量": value.quantity,
                  // "产品次数": value.quantity,
                  // "产品总次数": value.quantitySum,
                  // "退款次数": value.refundNum,
                  // "一级类型": value.departmentName,
                  // "二级类型": value.projectTypeName,
                  // "三级类型": value.categoryName,
                  // "费用类型": value.costType,
                  "客户姓名": value.customName,
                  // "会员等级": value.membershipEvel,
                  // "会员客服": value.memberCustomerId,
                  // "服务助理": value.serviceAssistan,
                  "电话": value.customPhone,
                  "客户卡号": value.customCardNumber,
                  "客户状态": value.customerStatus,
                  // "二次到院": value.two,
                  "结账日期": value.checkoutTime,
                  "总金额":value.totalExpenses,
                  "应付金额": value.amountPayable,
                  "实付金额": value.paidAmount,
                  "开单业绩": value.billingPerformance,
                  "财务收支总金额":value.totalPayment,
                  // "科室业绩": value.departmentPerformance,
                  // "折扣": value.discount,
                  // "折后金额": value.discountAmount,
                  // "线上客服": value.onlineUserName,
                  // "会员卡号": value.mcustomCardNumber,
                  "源收费单号": value.chargeSheetId,
                  "源收费单类型": value.oldBillTyp

                }
                arrExports.push(exportlist)
              })
              const data = XLSX.utils.json_to_sheet(arrExports)
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
              XLSX.writeFile(wb, '推荐人业绩查询.xlsx')

            }
            return
          }

          this.tableData = res.rows
          if (res.data!=null){
            this.billingPerformance = res.data.billingPerformance
          }else {
            this.billingPerformance = 0
          }
          this.pagination.total = res.total
        }
      })
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
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    ordernumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 获取用户列表
    async getUserList() {
      // 人员添加公司Id 添加状态
      await this.$api.user.getUserList({
        deptId: this.deptId,
        status: '0'
      }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.aestheticConsultant.options.push(item)
              this.options.customerRepresentative.options.push(item)
              // this.esthetics.push(item)
              // this.estheticsList = this.esthetics
            }
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.options.doctorId.options.push(item)
              this.doctorList = this.doctor
            }
          })
          // 去重
          const arr1 = this.unique(res.data)
          // this.billTypeList = arr1
          // this.billType = this.billTypeList
          this.options.dsingleUser.options = arr1 // 开单人
          this.options.secondRecommender.options = arr1 // 开单推荐人
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
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & span {
    font-size: 12px;
    margin-right: 15px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
