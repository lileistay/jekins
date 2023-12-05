<template>
  <!-- 网电咨询师业绩查询（公司） -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" @keydown.enter.native="getData(true)" plain @click.stop="getData(true, '1', $event)">查询
        </el-button>

        <el-button size="mini" v-has-permi="['confinement:queryCenter:exportinquiry']" icon="el-icon-upload2"
          type="success" plain @click.stop="getData(true, '2')">导出
        </el-button>
      </div>
      <slot>
        <SgTable :table-data="tableData" index="序号" size="mini" border :columns="columns" :pagination="pagination"
          @size-change="sizeChange" @current-change="currentChange">
          <div slot="searchBar" class="header-float">
            <div>
              <p class="title">统计信息</p>
            </div>
            <div style="font-size: 12px">
              <p>门诊量： - <span ><span>总人数：{{ newform.customerToal }}</span> <span style="margin-left: 10px;">新客首次：{{ newform.newCustomerFitst }}</span> <span
                    style="margin-left: 10px;">新客二次：{{ newform.newCustomerFitst }}</span> <span style="margin-left: 10px;">新客：{{ newform.newCustomer }}</span> <span
                    style="margin-left: 10px;">老客：{{ newform.regularCustomer }}</span></span> </p>
              <p style="margin-top: 7px">
                <span>开单业绩:</span>
                <span>{{ form.yeji.transactionMoney }}</span>&nbsp;&nbsp;&nbsp;
                <span>[ 总人数：{{ form.yeji.customerToal }} 新客首次：{{ form.yeji.newCustomerFitst }} 新客二次：{{ form.yeji.newCustomerSecond }}
                  新客：{{ form.yeji.newCustomer }}
                  老客：{{ form.yeji.regularCustomer }} 成交客户：{{ form.yeji.clients }}
                  <!--                    返款后业绩： - -->
                  ]
                </span>
              </p>
              <p style="margin-top: 7px">
                <span>实付总额: {{ form.yeji.Payment }}</span>&nbsp;&nbsp;
                <span>正常收费单: {{ form.yeji.normalBill }}</span>&nbsp;&nbsp;
                <span>交预约金: {{ form.yeji.deposit }}</span>&nbsp;&nbsp;
                <span>交储值: {{ form.yeji.depositValue }}</span>&nbsp;&nbsp;
                <span>交住院押金: {{ form.yeji.hospitalization }}</span>&nbsp;&nbsp;
                <span>辅助治疗: {{ form.yeji.adjuvant }}</span>&nbsp;&nbsp;
                <span>检验: {{ form.yeji.inspection }}</span>&nbsp;&nbsp;
                <span>住院结算单: {{ form.yeji.statement }}</span>&nbsp;&nbsp;
                <span>交储值卡: {{ form.yeji.cardValue }}</span>&nbsp;&nbsp;
                <span>还款单: {{ form.yeji.repayment }}</span>&nbsp;&nbsp;
              </p>
              <p style="margin-top: 7px">
                <span>退款总额: {{ form.yeji.refundMoney }}</span>&nbsp;&nbsp;
                <span>退款单: {{ form.yeji.refund }}</span>&nbsp;&nbsp;
                <span>退预约金: {{ form.yeji.refundAdvance }}</span>&nbsp;&nbsp;
                <span>退储值: {{ form.yeji.refundValue }}</span>&nbsp;&nbsp;
                <span>退住院押金: {{ form.yeji.refundHospitalization }}</span>&nbsp;&nbsp;
                <span>退辅助治疗: {{ form.yeji.refundAdjuvant }}</span>&nbsp;&nbsp;
                <span>退检验: {{ form.yeji.refundInspection }}</span>&nbsp;&nbsp;
                <span>退住院结算单: {{ form.yeji.refundStatement }}</span>&nbsp;&nbsp;
                <span>退储值卡: {{ form.yeji.refundCardValue }}</span>&nbsp;&nbsp;
              </p>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />列表清单</div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'billType'">
              <dict-tag :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'customerStatus'">
              <dict-tag :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <div v-else-if="data.props === 'isSecondary'">
              <dict-tag :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
              <span v-if="data.custom.isSecondary == ''">否</span>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor:pointer" @click="ordernumber(data.custom)">{{ data.custom.orderNumber }}</a>
            </div>
            <div v-else-if="data.props === 'customName'">
              <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id, data.custom)">{{
                data.custom.customName }} </a>
            </div>
            <div v-else-if="data.props === 'channelName'">
              <p>{{ data.custom.typeName }}{{ data.custom.channelName === null ? '' : '/' }}{{ data.custom.channelName }}
              </p>
            </div>
            <div v-else-if="data.props === 'oldBillType'">
              <dict-tag :options="dict.type.billing_type" :value="data.custom.oldBillType" />
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
import {newgetData, todayTime} from '@/utils/time'
import moment from 'moment'
import XLSX from 'xlsx';
export default {
  dicts: ['billing_type', 'whether_Newguest', 'whether', 'billing_type', 'whether_secondary'],
  name: 'Networkconsultingquery',
  components: {
    slideSearch,
    SgTable
  },
  data() {
    return {
      listProject: '',
      listshow: false,
      form: {
        yeji:{
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
        statement: 0.00, // 住院结算单
        }
      },
      newform:'',
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
          lab: '线上客服',
          val: 'onlineName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '建档人',
          val: 'createUser',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          // custom: 'projectTypeId',
          width: 120
        },
        {
          lab: '网电回访人',
          val: 'viName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '媒介',
          val: 'channelName',
          custom: 'channelName',
          width: 160
        },
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
          lab: '是否二次到院',
          val: 'isSecondary',
          custom: 'isSecondary',
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
          lab: '开单业绩',
          val: 'billingPerformance',
          width: 120
        },
        // {
        //   lab: '美容院类型',
        //   val: 'riName',
        //   width: 120
        // },
        // {
        //   lab: '美容院',
        //   val: 'duName',
        //   width: 120
        // },
        // {
        //   lab: '财务收支总金额',
        //   val: '',
        //   width: 120
        // },
        // {
        //   lab: '返款后业绩',
        //   val: 'FtotalPayment',
        //   width: 120
        // },
        {
          lab: '访客ID',
          val: 'visitorId',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 180
        },
        {
          lab: '原收费单号',
          val: 'chargeSheetId',
          width: 165
        },
        {
          lab: '原收费单类型',
          val: 'oldBillType',
          custom: 'oldBillType',
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
        projectTypeId: {
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
        billType: {
          type: 'select',
          label: '收费单据类型：',
          options: [],
          clearable: true
        },
        createTime: {
          type: 'Tdatetime',
          label: '建档时间',
          clearable: true,
          values: []
        },
        customName: {
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
        isSecondary: {
          type: 'select',
          label: '二次到院',
          clearable: true,
          options: []
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
        // 线上客服部门：
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
        // 开单线上客服
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
        // 美容院类型
        // 美容院：
        // FtotalPayment: {
        //   type: 'Tinput',
        //   label: '返款后业绩',
        //   clearable: true,
        //   values: []
        // },
        visitorId: {
          type: 'input',
          label: '访客ID',
          clearable: true
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
      },
      items: [

      ]
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
    this.options.customerStatus.options = this.dict.type.whether_Newguest
    this.options.billType.options = this.dict.type.billing_type
    this.options.isSecondary.options = this.dict.type.whether_secondary
    this.getChannelInfo()
    this.getUserList()
    this.deptFilingList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    exportList() {
      this.getData(true, '2');
      // const data = XLSX.utils.json_to_sheet(this.items)
      //   const wb = XLSX.utils.book_new()
      //   XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
      //   XLSX.writeFile(wb,'kalacloudExportExcel.xlsx')
    },
    ordernumber(data) {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus } })
    },
    // 获取数据
    getData: debounce(async function (isSearch, ispage, event) {
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
        }
        else if (this.options[k].type === 'cascader') {
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
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        if (this.options[k].values === '') {
          data[k] = undefined
        } else {
          data[k] = this.options[k].values
        }
      }
      console.log(data)
      var form = {
        deptId: this.deptId,
        onlineUserId: data.onlineUserId, // 线上客服
        orderNumber: data.orderNumber, // 收费单号
        customerStatus: data.customerStatus, // 客户状态
        billType: data.billType, // 单据类型
        // 线上客服部门：
        // 开单线上客服
        filingIds: data.filingIds, // 预约类型
        typeTwoIds: data.typeTwoIds,
        typeThreeIds: data.typeThreeIds,
        params: {
          customerName: data.customName, // 姓名
          customPhone: data.customPhone, // 电话
          customCardNumber: data.customCardNumber, // 卡号
          visitorId: data.visitorId, // 访客ID
          createuserId: data.createuserId, // 建档人
          visituserId: data.visituserId, // 网电回访人
          // beginFtotalPayment: data.FtotalPayment[0], // 返款后业绩
          // endFtotalPayment: data.FtotalPayment[1],
          beginamountPayable: data.amountPayable[0], // 应付金额
          endamountPayable: data.amountPayable[1],
          channelTypeId: data.channelId[0], // 媒介类型
          channelId: data.channelId[1],
          isSecondary: data.isSecondary, // 二次到院

          begincheckoutTime:newgetData(data.checkoutTime[0]) , // 开始时间
          endcheckoutTime: data.endcheckoutTime, // 结束时间
          begincreateTime: data.begincreateTime, // 建档时间
          endcreateTime: data.endcreateTime
        }
      }
      // 重新搜索页面回归第一页
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      if (ispage == '1') {
        form = Object.assign(form, this.pagination)
      } else {

      }

      await this.$api.product.consultingList({ ...form, ...this.pagination }).then(res => {
        if (res.code) {
          if (ispage == '2') {
            if (res.rows.length == 0) {
              this.$message.warning('无数据无法导出数据');
            } else {
              let arrExports = [];
              res.rows.forEach(value => {
                let exportlist = {
                  '线上客服': value.onlineName,
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
                  "结账日期": value.checkoutTime,
                  "总金额": value.totalExpenses,
                  "应付金额": value.amountPayable,
                  "开单业绩": value.billingPerformance,
                  "访客ID": value.visitorId,
                  "建档时间": value.createTime,
                  "源收费单号": value.chargeSheetId,
                  "源收费单类型": value.oldBillTyp

                }
                arrExports.push(exportlist)
              })
              const data = XLSX.utils.json_to_sheet(arrExports)
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, data, 'kalacloud-data')
              XLSX.writeFile(wb, '网电咨询师业绩查询.xlsx')

            }
            return
          }
          this.tableData = res.rows;

          // let tableDataarr = [];
          // let tableDataStr = '';
          // this.tableData.forEach((value, index) => {
          //   tableDataStr += value.createTime + ',';
          //   if (index == this.tableData.length - 1) {
          //     tableDataStr += value.createTime
          //   }
          // })
          // var dataListTime = tableDataStr.replace(/\./g, '/')
          // var timeList = dataListTime.split(',')

          // var array = [];
          // for (var i = 0; i < timeList.length; i++) {
          //   array.push(timeList[i].replace(/(^\s*)|(\s*$)/g, ""))
          // }
          // for (var i = 0; i < array.length; i++) {
          //   array[i] = (new Date(array[i])).getTime()
          // }
          // array.sort(function (a, b) {
          //   return a > b ? 1 : -1;
          // });
          // for (var i = 0; i < array.length; i++) {
          //   array[i] = this.format(array[i], 'yyyy-mm-dd hh:nn:ss')
          // }
          // let newarr = [];
          // for (let len = array.length - 1; len >= 0; len--) {
          //   newarr.push(array[len])
          // }
          // let tableDataList = []
          // console.log(newarr, '黑河')
          // console.log(this.tableData, '欸嘿')
          // newarr.forEach(value => {
          //   if (tableDataarr.indexOf(value) == -1) {
          //     tableDataarr.push(value)
          //   }
          // })
          // console.log(tableDataarr, '给和')
          // tableDataarr.forEach(newvalue => {
          //   this.tableData.forEach((value, index) => {
          //     if (value.createTime == newvalue) {
          //       tableDataList.push(value)
          //     }
          //   })


          // }
          this.pagination.total = res.total
          this.form = res.data
          this.newform=res.data.mz
          this.$set(this.form.yeji,'Payment',0)
          this.$set(this.form.yeji,'refundMoney',0)
          // 实付总额
          if (res.data !== null) {
            this.form.yeji.Payment = math.add(
              res.data.yeji.normalBill,
              res.data.yeji.deposit,
              res.data.yeji.depositValue,
              res.data.yeji.hospitalization,
              res.data.yeji.adjuvant,
              res.data.yeji.inspection,
              res.data.yeji.statement,
              res.data.yeji.cardValue,
              res.data.yeji.repayment)
            // // 退款总额
            this.form.yeji.refundMoney = math.add(
              res.data.yeji.refund,
              res.data.yeji.refundAdvance,
              res.data.yeji.refundValue,
              res.data.yeji.refundHospitalization,
              res.data.yeji.refundAdjuvant,
              res.data.yeji.refundInspection,
              res.data.yeji.refundStatement,
              res.data.yeji.refundCardValue
            )

          }
        }

      })
    }),
    sortDownDate(a, b) {
      return Date.parse(a.createTime) - Date.parse(b.createTime);
    },
    //时间戳转换为日期
    format(time, format) {
      var t = new Date(time);
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i;
      };
      return format.replace(/yyyy|mm|dd|hh|nn|ss/g, function (a) {

        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear());
            break;
          case 'mm':
            return tf(t.getMonth() + 1);
            break;
          case 'dd':
            return tf(t.getDate());
            break;
          case 'hh':
            return tf(t.getHours());
            break;
          case 'nn':
            return tf(t.getMinutes());
            break;
          case 'ss':
            return tf(t.getSeconds());
            break;
        }

      })
    },
    //时间戳转换为日期

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
    async deptFilingList() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      await this.$api.modules.filing.getFilingTypeById(data).then(res => {
        if (res.data) {
          this.options.projectTypeId.options = res.data
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

.title {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 13px;
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100px;
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
