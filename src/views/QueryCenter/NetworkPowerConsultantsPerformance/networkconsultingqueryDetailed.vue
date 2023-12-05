<template>
  <!--网电咨询师业绩明细明细查询-->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true,'1')"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button size="mini" v-has-permi="['confinement:queryCenter:exportinquirydetail']"  icon="el-icon-upload2"
          type="success" plain @click.stop="getData(true,'2')">导出
        </el-button>
      </div>
      <slot>
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
              <span class="title">统计信息</span>
            </div>
            <div>
              <span class="title">总人数：{{ form.numpeople }}</span>
              <span class="title">新客首次：{{ form.newpeopleone }}</span>
              <span class="title">新客二次：{{ form.newpeopletwo }}</span>
              <span class="title">新客：{{ form.newpeople }}</span>
              <span class="title">老客：{{ form.oldpeople }}</span>
              <span class="title">成交客户：{{ form.dealcum }}</span>
              <span class="title">开单业绩：{{ form.billingmoney }}</span>
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
            <div v-else-if="data.props === 'customName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customName }} </a>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
            </div>
            <div v-else-if="data.props === 'billType'">
              <dict-tag :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'isSecondary'">
              <dict-tag :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
            </div>
            <div v-else-if="data.props === 'channelName'">
              <p>{{ data.custom.typeName }}{{ data.custom.channelName === null ? '' : '/' }}{{ data.custom.channelName }}</p>
            </div>
            <div v-else-if="data.props === 'customerStatus'">
              <dict-tag :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
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
import { todayTime } from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce'
import moment from "moment";
import XLSX from 'xlsx';
export default {
  name: 'NetworkconsultingqueryDetailed',
  dicts: ['billing_type', 'whether_Newguest', 'whether', 'billing_type','whether_secondary'],
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      form: {
        numpeople: 0, // 总人数
        newpeopleone: 0, // 新客首次
        newpeopletwo: 0, // 新客二次
        newpeople: 0, // 新客
        oldpeople: 0, // 老客
        dealcum: 0, // 成交客户
        billingmoney: 0 // 开单业绩
      },
      boyMap: {},
      tableData: [],
      columns: [
          {
              lab: '客户姓名',
              val: 'customName',
              custom: 'customName',
              width: 120
          },
          {
              lab: '客户卡号',
              val: 'customCardNumber',
              width: 165
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
          lab: '线上客服',
          val: 'onlineName',
          width: 120
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 120
        },
        {
          lab: '建档人',
          val: 'createUser',
          width: 120
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          width: 120
        },
        // {
        //   lab: '美容院',
        //   val: 'srName',
        //   width: 120
        // },
        {
          lab: '网电回访人',
          val: 'viName',
          width: 120
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
        // {
        //   lab: '开单线上客服',
        //   val: 'crName',
        //   width: 120
        // },

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
          lab: '二次到院',
          val: 'isSecondary',
            custom:'isSecondary',

          width: 120
        },

        {
          lab: '项目名称',
          val: 'projectName',
            showOverflowTooltip: true,
          width: 120
        },
        {
          lab: '产品项目组合名称',
          val: 'refusndNum',
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
          lab: '结账日期',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '应付金额',
          val: 'amountPayable',
          width: 120
        },
        {
          lab: '实付金额',
          val: 'paidAmount',
          width: 120
        },
        {
          lab: '开单业绩',
          val: 'billingPerformance',
          width: 120
        },
        {
          lab: '访客ID',
          val: 'visitorId',
          width: 160
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 140
        },
        // {
        //   lab: '首次消费时间',
        //   val: '',
        //   width: 140
        // },
        {
          lab: '原收费单号',
          val: 'chargeSheetId',
          width: 140
        },
        {
          lab: '原收费单类型',
          val: 'oldBillType',
          custom: 'oldBillType',
          width: 165
        }
      ],
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结帐日期',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        crfDepartmentId: {
          type: 'select',
          label: '一级项目',
          options: [],
          values: '',
          clearable: true
        },
        crfProjectTypeId: {
          type: 'select',
          label: '二级项目',
          options: [],
          values: '',
          clearable: true
        },
        crfBookingPeojectId: {
          type: 'select',
          label: '三级项目',
          options: [],
          values: '',
          clearable: true
        },
        projectName: {
          type: 'input',
          label: '项目'
        },
        // customerName: {
        //   type: 'input',
        //   label: '项目组合'
        // },
        typeThreeIdss: {
          type: 'cascader',
          label: '建档类型',
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
        billType: {
          type: 'select',
          label: '收费单据类型',
          options: [],
          clearable: true
        },
        createTime: {
          type: 'Tdatetime',
          label: '建档时间',
          clearable: true,
          values: []
        },
        // createTSime: {
        //   type: 'Tdatetime',
        //   label: '首次消费时间',
        //   clearable: true,
        //   values: []
        // },
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
        // isPackage: {
        //   type: 'select',
        //   label: '美容院',
        //   options: [],
        //   clearable: true
        // },
        isSecondary: {
          type: 'select',
          label: '二次来院',
          options: [],
          clearable: true
        },
        customerStatus: {
          type: 'select',
          label: '客户状态',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        createuserId: {
          type: 'select',
          label: '建档人',
          clearable: true,
          options: []
        },
        visituserId: {
          type: 'select',
          label: '网电回访人',
          clearable: true,
          options: []
        },
        // statasus: {
        //   type: 'select',
        //   label: '开单线上客服',
        //   options: [],
        //   clearable: true
        // },
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
        visitorId: {
          type: 'input',
          label: '访客ID',
          clearable: true
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
      this.deptFilingList()
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
    // 一二三级项目
    'options.crfDepartmentId.values'() {
      this.options.crfProjectTypeId.values = ''
      this.getDepartmentTwo(this.options.crfDepartmentId.values)
    },
    'options.crfProjectTypeId.values'() {
      this.options.crfBookingPeojectId.values = ''
      this.getDepartmentThree(this.options.crfProjectTypeId.values)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData(true,'1') // 搜索
    this.getUserList()
    this.getChannelInfo()
    this.getDepartmentOne()
    this.deptFilingList()
    this.options.customerStatus.options = this.dict.type.whether_Newguest
    this.options.isSecondary.options = this.dict.type.whether_secondary
    this.options.billType.options = this.dict.type.billing_type
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData(true,'1')
      }
    }
  },
  methods: {
    // 获取数据
    getData: debounce(function(isSearch,ispage) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
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
      var forms = {
        deptId: this.deptId,
        onlineUserId: data.onlineUserId, // 线上客服
        orderNumber: data.orderNumber, // 收费单号
        customerStatus: data.customerStatus, // 客户状态
        billType: data.billType, // 单据类型
          typeThreeIds: data.typeThreeIds, // 建档类型 只传第三级
        params: {
            customerName: data.customerName, // 姓名
          customPhone: data.customPhone, // 电话
          customCardNumber: data.customCardNumber, // 卡号
          visitorId: data.visitorId, // 访客ID
          projectName: data.projectName, // 项目
          createuserId: data.createuserId, // 建档人
          visituserId: data.visituserId, // 网电回访人
          beginamountPayable: data.amountPayable[0], // 应付金额
          endamountPayable: data.amountPayable[1],
          channelTypeId: data.channelId[0], // 媒介类型
          channelId: data.channelId[1],
          isSecondary: data.isSecondary, // 二次到院
          begincheckoutTime: data.begincheckoutTime, // 开始时间
          endcheckoutTime: data.endcheckoutTime, // 结束时间
          begincreateTime: data.begincreateTime, // 建档时间
          endcreateTime: data.endcreateTime,
            begincreateTSime:data.begincreateTSime,
            endcreateTSime:data.endcreateTSime,
          departmentId: data.crfDepartmentId === undefined ? '' : data.crfDepartmentId, // 一级
          projectTypeId: data.crfProjectTypeId === undefined ? '' : data.crfProjectTypeId, // 二级
          categoryId: data.crfBookingPeojectId === undefined ? '' : data.crfBookingPeojectId // 三级

        }
      }
     if(ispage=='1'){
      forms = Object.assign(forms, this.pagination);
     }


      this.$api.product.consultingListAll({...forms,...this.pagination}).then(res => {
        if (res) {
          if (ispage == '2') {
          if (res.rows.length == 0) {
            this.$message.warning('无数据无法导出数据');
          } else {
            let arrExports = [];
            res.rows.forEach(value => {
              let exportlist = {
                '线上客服': value.onlineName,
                '美学顾问': value.acName,
                '建档人': value.createUser,
                '建档类型': value.typeThreeName,
                "网电回访人": value.viNam,
                "媒介": value.channelName,
                "开单线上客服": value.crName,
                "收费单号": value.orderNumber,
                "收费单类型": value.billType,
                "客户姓名": value.customName,
                "客户状态": value.customerStatus,
                "是否二次到院": value.isSecondary,
                "电话": value.customPhone,
                "客户卡号": value.customCardNumber,
                "项目名称":value.refundNum,
                "产品项目组合名称":value.refusndNum,
                 "一级类型":value.departmentName,
                 "二级类型":value.projectTypeName,
                 "三级类型":value.categoryName,
                "结账日期": value.checkoutTime,
                "应付金额": value.amountPayable,
                "实付金额":value.paidAmount,
                "开单业绩": value.billingPerformance,
                "访客ID": value.visitorId,
                "建档时间": value.createTime,
                "首次消费时间": value.customCardNumber,
                "源收费单号": value.chargeSheetId,
                "源收费单类型": value.oldBillTyp

              }
              arrExports.push(exportlist)
            })
            const data = XLSX.utils.json_to_sheet(arrExports)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
            XLSX.writeFile(wb, '网电咨询师业绩明细查询.xlsx')

          }
          return
        }
          this.tableData = res.rows
          this.pagination.total = res.total
          // TODO 放开后数据不铺设
          this.form = res.data
        }
      })
    }),
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    // 收费单号
    ordernumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
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
    // 获取建档类型
    deptFilingList() {
      this.$api.modules.filing.getFilingTypeById({
        deptId: this.deptId
      }).then(res => {
        if (res.data) {
          this.options.typeThreeIdss.options = res.data
        }
      })
    },
    // 一二三级项目
    getDepartmentOne() {
      /**
       * @author li
       * @date 2023/2/15
       * @Description: 一二三级
      */
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.crfDepartmentId.options = res.rows
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
          this.options.crfProjectTypeId.options = res.rows
        }
      })
    },
    getDepartmentThree(id) {
      this.$api.dept.CategoryList({ projectTypeId: id }, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.categoryName
            item.value = item.categoryId
          })
          this.options.crfBookingPeojectId.options = res.rows
        }
      })
    },
    // 获取渠道信息
    async getChannelInfo(val) {
      this.deptId = val
      /**
       * @author 李尚
       * @date 2023/02/14
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
    // 员工信息
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
          // 线上客服
          res.data.forEach(item => {
            if (item.postCode === 'wdzxs') {
              this.options.onlineUserId.options.push(item) // 线上客服
              this.options.visituserId.options.push(item) // 网电回访人
            }
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.options.createuserId.options = arr1 // 建档人
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
.title{
  font-size: 13px;
  margin-right: 5px;
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
