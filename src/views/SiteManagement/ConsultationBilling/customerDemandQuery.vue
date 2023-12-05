<template>
  <!-- 客户需求查询 -->
  <div class="box">
    <slideSearch :options="options">
      <div
        slot="btnBar"
        class="btnBar"
      >
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询</el-button>
        <el-button

          v-has-permi="['confinement:customerDemandInfo:export']"
          size="mini"
          type="success"
          :loading="submitLoading"
          @click.stop="exportExcel"
        >导出</el-button>
      </div>
      <slot>
        <sg-table
          ref="table"

          :sg-ref="'multipleTable'"
          :columns="columns"
          :pagination="pagination"
          :table-data="tableData"
          border
          size="mini"
          selection
          index="序号"
          :cell-class-name="cellClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
            <div>
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <span style="color: #7ec5b7; font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
            <span style="margin-right:5px;margin-left: 5px;font-size: 14px"><i class="color-block-success" />已解决</span>
            <span style="font-size: 10px"><i class="color-block-default" /> 未解决</span>
            <!--            <el-button-->
            <!--              size="mini"-->
            <!--              type="primary"-->
            <!--              icon="el-icon-plus"-->
            <!--              style="float: right;"-->
            <!--              plain-->
            <!--              @click.stop="sendMessage"-->
            <!--            > 批量发送短信</el-button>-->
            <el-button
              v-has-permi="['confinement:customerDemandInfo:escalation']"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              style="float: right; margin-right: 10px"
              plain
              @click.stop.native="openManualDialog"
            > 手工上报</el-button>
            <!--            <el-button-->
            <!--              size="mini"-->
            <!--              type="primary"-->
            <!--              icon="el-icon-plus"-->
            <!--              style="float: right;"-->
            <!--              plain-->
            <!--            > 全部手工上报</el-button>-->
          </div>
          <template #custom="data">
            <div v-if="data.props === 'economicCapacity'">
              <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
            </div>
            <div v-else-if="data.props === 'customerName'">
              <a style="color: #66b1ff;cursor: pointer;" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
            <div v-else-if="data.props === 'state'">
              <show-dict-data :options="dict.type.demand_status" :value="data.custom.state" />
            </div>
            <div v-else-if="data.props === 'demandLevel'">
              <show-dict-data :options="dict.type.demand_level" :value="data.custom.demandLevel" />
            </div>
            <div v-else-if="data.props === 'isNeeded'">
              <show-dict-data :options="dict.type.just_needed" :value="data.custom.isNeeded" />
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <send-message
      :show-send-message-dialog="showSendMessageDialog"
      :selection-data="selectionData"
      @closeDialog="closeDialog"
    />
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
      <template #custom="data">
        <div v-if="data.props === 'economicCapacity'">
          <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
        </div>
        <div v-else-if="data.props === 'customerName'">
          <a style="color: #66b1ff;cursor: pointer;" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
        </div>
        <div v-else-if="data.props === 'state'">
          <show-dict-data :options="dict.type.demand_status" :value="data.custom.state" />
        </div>
        <div v-else-if="data.props === 'demandLevel'">
          <show-dict-data :options="dict.type.demand_level" :value="data.custom.demandLevel" />
        </div>
        <div v-else-if="data.props === 'isNeeded'">
          <show-dict-data :options="dict.type.just_needed" :value="data.custom.isNeeded" />
        </div>
      </template>
    </sg-table>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import moment from 'moment'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import SendMessage from '@/components/SendMessage'
import { todayTime,newgetData } from "@/utils/time";

export default {
  dicts: ['whether', 'economic_capacity', 'demand_status', 'demand_level', 'just_needed'],
  name: 'CustomerDemand',
  components: {
    slideSearch,
    SgTable,
    ManualSubmission,
    SendMessage
  },
  data() {
    return {
      Action: {},
      tableDatas: [],
      submitLoading: false,
      loadingData: false,
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      selectionData: [],
      tableData: [],
      columns: [
        {
          lab: '会员等级',
          val: 'membershipEvel'
        },
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '客户状态无',
          val: '',
          width: 100
        },
        {
          lab: '媒介',
          val: 'channelTypeName',
          width: 140
        },
        {
          lab: '渠道',
          val: 'typeThreeName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '经济能力',
          val: 'economicCapacity',
          width: 140,
          custom: 'economicCapacity'
        },
        {
          lab: '美学顾问',
          val: 'nickName',
          width: 120
        },
        {
          lab: '服务助理无',
          val: '',
          width: 120
        },
        {
          lab: '会员客服无',
          val: '',
          width: 120
        },
        {
          lab: '一级类别',
          val: 'demandTypeName',
          width: 140
        },
        {
          lab: '二级类别',
          val: 'demanName',
          width: 140
        },
        {
          lab: '预约时间',
          val: 'appointmentTime',
          width: 140
        },
        {
          lab: '最后来院时间无',
          val: '',
          width: 140
        },
        {
          lab: '最后消费时间',
          val: '',
          width: 140
        },
        {
          lab: '总消费金额',
          val: 'grossConsumption',
          width: 120
        },
        {
          lab: '总消费次数',
          val: 'eliminateNumber',
          width: 120
        },
        {
          lab: '开发策略',
          val: 'openStrategy',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '解决状态',
          val: 'state',
          custom: 'state'
        },
        {
          lab: '刚需状态',
          val: 'isNeeded',
          custom: 'isNeeded'
        },
        {
          lab: '首次到院时间',
          val: 'arrivalTime',
          width: 140
        },
        {
          lab: '录入人',
          val: 'createUserName',
          width: 100
        },
        {
          lab: '最后回访时间',
          val: 'lastReturnVisitTime',
          width: 140
        },
        {
          lab: '回访次数',
          val: 'returnNum',
          width: 100
        },
        {
          lab: '需求等级',
          val: 'demandLevel',
          width: 100,
          custom: 'demandLevel'
        },
        {
          lab: '整形消费金额无',
          val: '',
          width: 140
        },
        {
          lab: '皮肤消费金额无',
          val: '',
          width: 140
        },
        {
          lab: '口腔消费金额无',
          val: '',
          width: 140
        },
        {
          lab: '无创消费金额无',
          val: '',
          width: 140
        },
        {
          lab: '需求录入时间无',
          val: '',
          width: 140
        },
        {
          lab: '需求时间',
          val: 'demandTime',
          width: 100
        },
        {
          lab: '解决时间',
          val: 'solutionTime',
          width: 100
        },
        {
          lab: '客户标签',
          val: 'pejectNames',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '备注',
          val: 'demandRemarks',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '预估业绩无',
          val: 'achievement',
          width: 100
        }

      ],
      // 左侧查询列表
      options: {
        customerName: {
          type: 'input',
          label: '姓名',
          clearable: true
        },
        customPhone: {
          type: 'input',
          label: '电话',
          clearable: true
        },
        customCardNumber: {
          type: 'input',
          label: '卡号',
          clearable: true
        },
        Newandoldcustomers: {
          type: 'select',
          label: '新老客户',
          clearable: true,
          options: [
            {
              value: '0',
              label: '新客户'
            },
            {
              value: '1',
              label: '老客户'
            }
          ]
        },
        demandTypeId: {
          type: 'select',
          label: '一级类别',
          clearable: true,
          options: [],
          values: ''
        },
        demandId: {
          type: 'select',
          label: '二级类别',
          clearable: true,
          options: [],
          values: ''
        },
        isNeeded: {
          type: 'select',
          label: '刚需状态',
          clearable: true,
          options: [],
          values: ''
        },
        state: {
          type: 'select',
          label: '解决状态',
          clearable: true,
          options: [],
          values: ''
        },
        createuserId: {
          type: 'select',
          label: '需求录入人',
          clearable: true,
          options: [],
          values: ''
        },
        demandLevel: {
          type: 'select',
          label: '需求等级',
          clearable: true,
          options: []
        },
        demandTime: {
          type: 'Tdatetime',
          label: '需求时间',
          clearable: true,
          values: []
        },
        createTime: {
          type: 'Tdatetime',
          label: '需求录入时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        openStrategy: {
          type: 'checkbox',
          label: '开发策略',
          options: [
            {
              value: '0',
              label: '教育'
            },
            {
              value: '1',
              label: '折扣'
            },
            {
              value: '2',
              label: '专家'
            },
            {
              value: '3',
              label: '体检'
            }
          ],
          values: []
        },
        Finalconsumption: {
          type: 'Tdatetime',
          label: '最后消费时间',
          clearable: true,
          values: []
        },
        returnNum: {
          type: 'input',
          label: '回访次数',
          clearable: true

        },
        membershipEvel: {
          type: 'select',
          label: '会员等级',
          values: '',
          options: [],
          clearable: true
        },
        receptionId: {
          type: 'select',
          label: '美学顾问',
          values: '',
          options: [],
          clearable: true
        },
        economicCapacity: {
          type: 'select',
          label: '经济能力',
          values: '',
          options: [],
          clearable: true
        },
        lastReturnVisitTime: {
          type: 'Tdatetime',
          label: '最后回访时间',
          clearable: true,
          values: []
        },
        demandRemarks: {
          type: 'input',
          label: '备注',
          clearable: true
        },
        pejectNames: {
          type: 'input',
          label: '标签',
          clearable: true
        },
        typeThreeIds: {
          type: 'cascader',
          label: '渠道',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        channel: {
          type: 'Tselect',
          label: '媒介类型',
          clearable: true,
          values: [],
          options: []
        },
        ServiceAssistant: {
          type: 'select',
          label: '服务助理',
          values: '',
          options: [],
          clearable: true
        },
        customerService: {
          type: 'select',
          label: '会员客服',
          values: '',
          options: [],
          clearable: true
        },
        appointmentTime: {
          type: 'Tdatetime',
          label: '预约时间',
          clearable: true,
          values: []
        },
        LastTime: {
          type: 'Tdatetime',
          label: '最后来院时间',
          clearable: true,
          values: []
        },
        solutionTime: {
          type: 'Tdatetime',
          label: '解决时间',
          clearable: true,
          values: []
        },
        arrivalTime: {
          type: 'Tdatetime',
          label: '首次到院时间',
          clearable: true,
          values: []
        },
        grossConsumption: {
          type: 'input',
          label: '总消费金额',
          clearable: true
        },
        eliminateNumber: {
          type: 'input',
          label: '总消费次数',
          clearable: true
        },
        plastic: {
          type: 'input',
          label: '整形消费金额',
          clearable: true
        },
        skin: {
          type: 'input',
          label: '皮肤消费金额',
          clearable: true
        },
        oralcavity: {
          type: 'input',
          label: '口腔消费金额',
          clearable: true
        },
        Noninvasive: {
          type: 'input',
          label: '无创消费金额',
          clearable: true
        }
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
      this.getDeptFilingList()
      this.getDemand()
      this.getData()
      this.getUserList(val)
    },
    'options.demandTypeId.values'() {
      if (this.options.demandTypeId.values === '') {
        this.options.demandId.values = ''
        this.options.demandTypeId.options = []
        return
      }
      if (this.options.demandTypeId.values) {
        const demandTypeId = this.options.demandTypeId.values
        // 添加状态
        this.$api.demand.DemandManagement({ demandTypeId: demandTypeId, status: '0' }).then(res => {
          if (res) {
            if (res.rows.length === 0) {
              this.options.demandId.values = ''
              return
            }
            res.rows.forEach(item => {
              item.label = item.demandName
              item.value = item.demandId
            })
            this.options.demandId.options = res.rows
          }
        })
      }
    },
    'options.channel.values'() {
      if (this.options.channel.values[0]) {
        this.options.channel.options[1] = this.channelType.filter(filter => {
          return filter.typeId === this.options.channel.values[0]
        })[0].channelInfo
      } else {
        this.options.channel.options[1] = []
      }
    },
    'options.channel.values.0'() {
      this.options.channel.values[1] = ''
    }
  },
  created() {
    this.options.isNeeded.options = this.dict.type.just_needed
    this.options.state.options = this.dict.type.demand_status
    this.options.demandLevel.options = this.dict.type.demand_level
    this.options.economicCapacity.options = this.dict.type.economic_capacity
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getChannelInfo()
    this.getDeptFilingList()
    this.getDemand()
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
    // 导出按钮
    exportExcel() {
      var data = {}
      this.submitLoading = true
      for (const k in this.options) {
        if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else if (this.options[k].type === 'cascader') {
          let filingId = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingId.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingId', filingId.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingId = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else if (this.options[k].type === 'checkbox') {
          this.options[k].values.forEach(item => {
            if (item === '教育') {
              data['education'] = '1'
            } else if (item === '体验') {
              data['experience'] = '1'
            } else if (item === '专家') {
              data['expert'] = '1'
            } else if (item === '折扣') {
              data['isDiscount'] = '1'
            }
          })
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.billingList.queryCustomerDemand(data).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '客户需求查询')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    // 根据状态修改背景颜色
    cellClassName({ row, rowIndex }) {
      if (row.state === '1') {
        return 'success-row'
      } else if (row.state === '2') {
        return 'warning-row'
      }
      return ''
    },
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.Action = this.selectionData[0]
      this.showManualDialog = true
    },
    // 打开发送短信弹窗
    sendMessage() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客发送短信')
        return
      }
      this.showSendMessageDialog = true
    },
    // 关闭发送短信弹窗
    closeDialog() {
      this.showSendMessageDialog = false
    },
    // 点击姓名跳转页面
    customerclick(id, val) {
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
    },
    async getData(isSearch) {
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else if (this.options[k].type === 'cascader') {
          let filingId = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingId.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingId', filingId.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingId = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else if (this.options[k].type === 'checkbox') {
          this.options[k].values.forEach(item => {
            if (item === '教育') {
              data['education'] = '1'
            } else if (item === '体验') {
              data['experience'] = '1'
            } else if (item === '专家') {
              data['expert'] = '1'
            } else if (item === '折扣') {
              data['isDiscount'] = '1'
            }
          })
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.loadingData = true
      // let createTime=newgetData(data.createTime[0])
      // let endcreateTime=newgetData(data.createTime[1])
      // if(data.demandTime.length!==0){
      //   let createTimes=newgetData(data.demandTime[0])
      //   let endcreateTimes=newgetData(data.demandTime[1])
      //   delete data.demandTime
      //   data.demandTime=createTimes
      //   data.enddemandTime=endcreateTimes
      // }
      // if(data.Finalconsumption.length!==0){
      //   let newcreateTimes=newgetData(data.Finalconsumption[0])
      //   let newendcreateTimes=newgetData(data.Finalconsumption[1])
      //   delete data.Finalconsumption
      //   data.Finalconsumption=newcreateTimes
      //   data.endFinalconsumption=newendcreateTimes
      // }
      // if(data.lastReturnVisitTime.length!==0){
      //   let newcreateTime=newgetData(data.lastReturnVisitTime[0])
      //   let newendcreateTime=newgetData(data.lastReturnVisitTime[1])
      //   delete data.lastReturnVisitTime
      //   data.lastReturnVisitTime=newcreateTime
      //   data.endlastReturnVisitTime=newendcreateTime
      // }
      // if(data.appointmentTime.length!==0){
      //   let newcreateTimen=newgetData(data.appointmentTime[0])
      //   let newendcreateTimen=newgetData(data.appointmentTime[1])
      //   delete data.appointmentTime
      //   data.appointmentTime=newcreateTimen
      //   data.appointmentTime=newendcreateTimen
      // }
      // if(data.LastTime.length!==0){
      //   let newcreateTimens=newgetData(data.LastTime[0])
      //   let newendcreateTimens=newgetData(data.LastTime[1])
      //   delete data.LastTime
      //   data.LastTime=newcreateTimens
      //   data.endLastTime=newendcreateTimens
      // }
      // if(data.solutionTime.length!==0){
      //   let newcreateTimensl=newgetData(data.solutionTime[0])
      //   let newendcreateTimensl=newgetData(data.solutionTime[1])
      //   delete data.solutionTime
      //   data.solutionTime=newcreateTimensl
      //   data.endsolutionTime=newendcreateTimensl
      // }
      // if(data.arrivalTime.length!==0){
      //   let newcreateTimensls=newgetData(data.arrivalTime[0])
      //   let newendcreateTimensls=newgetData(data.arrivalTime[1])
      //   delete data.arrivalTime
      //   data.arrivalTime=newcreateTimensls
      //   data.endarrivalTime=newendcreateTimensls
      // }
      // delete data.createTime
      // data.createTime=createTime
      // data.endcreateTime=endcreateTime
      await this.$api.billingList.queryCustomerDemand(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取媒介来源
     */
    /**
     * @author 李尚
     * @date 2022/6/18
     * @Description: 添加状态
     */
    getChannelInfo() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.channel.getChannelType(data).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            this.channelType = res.data
            this.respliceNameLabel(res.data)
            this.options.channel.options.splice(0, 0, res.data)
          } else {
            this.options.channel.options = []
            this.options.channel.values = []
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
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 获取一级需求
    */
    getDemand() {
      this.options.demandTypeId.values = ''
      this.options.demandId.values = ''
      this.options.demandTypeId.options = []
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.demand.DemandType(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.demandTypeName
            item.value = item.demandTypeId
            this.options.demandTypeId.options.push(item)
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 获取渠道类型
     */
    /**
     * @author 李尚
     * @date 2022/6/18
     * @Description: 添加状态
     */
    getDeptFilingList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.filing.getFilingTypeById(data).then(res => {
        if (res.data) {
          this.options.typeThreeIds.options = res.data
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/8
     * @Description: 获取用户列表
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
          const arr1 = this.unique(res.data)
          this.options.createuserId.options = arr1
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.receptionId.options.push(item)
            }
          })
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭
    closeInnerDialog() {
      this.innerDialog = false
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
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.box {
  width: 100%;
  height: 100%;
}
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
::v-deep .el-input__prefix{
  display: none;
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
