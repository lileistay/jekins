F<template>
  <!-- 已到院回访 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keyup.enter.native="getData"
        >查询</el-button>
        <el-button
          v-has-permi="['confinement:returnVisitHospital:export']"
          type="success"
          size="mini"
          icon="el-icon-upload2"
          plain
          :loading="submitLoading"
          @click.stop="exportExcel"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >-          <div slot="searchBar" class="searchBar">
            <div class="title">信息统计</div>
            <div>
              <ul>
                <li>总记录数:<span>{{ statisticsData.totalRecords?statisticsData.totalRecords:0 }}</span></li>
                <li>已执行回访量:<span>{{ statisticsData.executedAmount?statisticsData.executedAmount:0 }}</span></li>
                <li>未执行回访量:<span>{{ statisticsData.notExecutedAmount?statisticsData.notExecutedAmount:0 }}</span></li>
                <li>已终止回访量:<span>{{ statisticsData.returnVisits?statisticsData.returnVisits:0 }}</span></li>
              </ul>
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px">
              <span class="color-block-default" /> 未执行
              <span class="color-block-success" /> 已执行
              <span class="color-block-danger" /> 已终止
            </span>
            <el-button
              v-hasPermi="['paidReturnVisit:remove']"
              size="mini"
              type="danger"
              plain
              icon="el-icon-delete"
              class="headerBarBtn"
              @click.stop="deleteTableItem"
            >删除</el-button>
            <el-button
              v-hasPermi="['paidReturnVisit:Reassign']"
              size="mini"
              type="primary"
              plain
              icon="el-icon-refresh"
              class="headerBarBtn"
              @click="NoReturnVisit"
            >未回访重新分配</el-button>
            <!-- <el-button-->
            <!--   v-hasPermi="['paidReturnVisit:informations']"-->
            <!--   size="mini"-->
            <!--   type="warning"-->
            <!--   plain-->
            <!--   icon="el-icon-s-promotion"-->
            <!--   class="headerBarBtn"-->
            <!--   @click.stop="sendMessage"-->
            <!-- >批量发送短信</el-button>-->
            <el-button
              v-hasPermi="['paidReturnVisit:manual']"
              size="mini"
              type="primary"
              plain
              icon="el-icon-plus"
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >手工上报</el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'isTerminated'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isTerminated" />
            </div>
            <div v-else-if="data.props === 'operation'">
              <el-button
                v-has-permi="['confinement:returnVisitHospital:list']"
                :icon="data.custom.isExecute ==0?'el-icon-phone':'el-icon-tickets'"
                size="mini"
                @click.stop="returnVisit(data.custom.numberId,data.custom.isExecute, data.custom.id)"
              >
                {{ data.custom.isExecute ==0 ?'回访':'详情' }}
              </el-button>
              <el-button icon="el-icon-microphone" size="mini">录音详情</el-button>
            </div>
            <div v-else-if="data.props==='customerName'">
              <a @click="customer(data.custom.id, data.custom)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-else-if="data.props === 'blacklist'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.blacklist" />
            </div>
            <div v-else-if="data.props === 'isExecute'">
              <show-dict-data :options="dict.type.is_execute_type" :value="data.custom.isExecute" />
            </div>
            <div v-else-if="data.props==='isThrough'">
              <show-dict-data :options="dict.type.through_result" :value="data.custom.isThrough" />
            </div>
            <div v-else-if="data.props==='notThroughReason'">
              <show-dict-data :options="dict.type.not_through_reason" :value="data.custom.notThroughReason" />
            </div>
            <div v-else-if="data.props==='throughLevel'">
              <show-dict-data :options="dict.type.through_level" :value="data.custom.throughLevel" />
            </div>
            <div v-else-if="data.props==='isOneReturnVisit'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isOneReturnVisit" />
            </div>
            <div v-else-if="data.props==='isReachCourtyard'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
            </div>
            <div v-else-if="data.props==='grade'">
              <show-dict-data :options="dict.type.grade" :value="data.custom.grade" />
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <!-- 充值卡 -->
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
    <distribution
      :dialog-visible.sync="dialogVisible"
      :selection-data="selectionData"
      :no-return-visit="'1'"
      @getList="getData()"
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
        <div v-if="data.props === 'isTerminated'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isTerminated" />
        </div>
        <div v-else-if="data.props === 'operation'">
          <el-button
            v-has-permi="['confinement:returnVisitHospital:list']"
            :icon="data.custom.isExecute ==0?'el-icon-phone':'el-icon-tickets'"
            size="mini"
            @click.stop="returnVisit(data.custom.numberId,data.custom.isExecute, data.custom.id)"
          >
            {{ data.custom.isExecute ==0 ?'回访':'详情' }}
          </el-button>
          <el-button icon="el-icon-microphone" size="mini">录音详情</el-button>
        </div>
        <div v-else-if="data.props==='customerName'">
          <a @click="customer(data.custom.id, data.custom)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props === 'blacklist'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.blacklist" />
        </div>
        <div v-else-if="data.props === 'isExecute'">
          <show-dict-data :options="dict.type.is_execute_type" :value="data.custom.isExecute" />
        </div>
        <div v-else-if="data.props==='isThrough'">
          <show-dict-data :options="dict.type.through_result" :value="data.custom.isThrough" />
        </div>
        <div v-else-if="data.props==='notThroughReason'">
          <show-dict-data :options="dict.type.not_through_reason" :value="data.custom.notThroughReason" />
        </div>
        <div v-else-if="data.props==='throughLevel'">
          <show-dict-data :options="dict.type.through_level" :value="data.custom.throughLevel" />
        </div>
        <div v-else-if="data.props==='isOneReturnVisit'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isOneReturnVisit" />
        </div>
        <div v-else-if="data.props==='isReachCourtyard'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
        </div>
        <div v-else-if="data.props==='grade'">
          <show-dict-data :options="dict.type.grade" :value="data.custom.grade" />
        </div>
      </template>
    </sg-table>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import {newgetData, todayTime} from '@/utils/time'
import SendMessage from '@/components/SendMessage'
import ManualSubmission from '@/components/ManualSubmission/indexTwo' // 手工上报弹层 此处是单独的一个弹层接口有所变换
import SgDialog from '@/components/Dialog' // 客户标签弹层
import distribution from '@/components/NoReturnVisitDistribution'
import moment from 'moment'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  name: 'ReturnVisitPlan',
  components: {
    SgTable,
    slideSearch,
    ManualSubmission,
    SendMessage,
    SgDialog,
    distribution
  },
  inject: ['reload'],
  dicts: ['degree_intention_list', 'sys_user_sex', 'economic_capacity', 'through_level', 'whether', 'is_execute_type', 'not_through_reason', 'grade', 'temin_reason', 'is_execute', 'through_result'],
  data() {
    return {
      Action: {},
      tableDatas: [],
      submitLoading: false,
      dialogVisible: false, // 控制未回访分配
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      showManualDialog: false,
      innerDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 统计
      statisticsData: {},
      // 多选数据
      selectionData: [],
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columns: [
        {
          lab: '操作',
          val: 'operation',
          custom: 'operation',
          width: 210
        },
        {
          lab: '状态',
          val: 'isExecute',
          custom: 'isExecute'
        },
        {
          lab: '间隔天数',
          val: 'ifferenceTime'
        },
        {
          lab: '已回访总次数',
          val: 'hreturnNum',
          width: 100
        },
        {
          lab: '有效回访量',
          val: 'heffectiveTimes',
          width: 90
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
          lab: '到院',
          val: 'isReachCourtyard',
          custom: 'isReachCourtyard'
        },
        {
          lab: '回访类型',
          val: 'typeName',
          width: 200
        },
        {
          lab: '回访名称',
          val: 'returnVisitName',
          width: 200
        },
        {
          lab: '回访目的',
          val: 'returnVisit',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '回访关键字',
          val: 'returnVisitKeyword',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '回访反馈',
          val: 'returnVisitFeedback',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '一次性回访',
          val: 'isOneReturnVisit',
          width: 90,
          custom: 'isOneReturnVisit'
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '到院时间',
          val: 'arrivalTime',
          width: 140
        },
        {
          lab: '计划回访时间',
          val: 'planReturnTime',
          width: 140
        },
        {
          lab: '上报时间',
          val: 'reportTime',
          width: 140
        },
        {
          lab: '实际回访时间',
          val: 'actualReturnvisitTime',
          width: 140
        },
        {
          lab: '回访执行人',
          val: 'returnExecutorUserName',
          width: 120
        },
        {
          lab: '最后回访时间',
          val: 'lastReturnVisitTime',
          width: 140
        },
        {
          lab: '计划回访人',
          val: 'planReturnUserName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '回访等级',
          val: 'grade',
          width: 120,
          custom: 'grade'
        },
        {
          lab: '是否打通',
          val: 'isThrough',
          custom: 'isThrough'
        },
        {
          lab: '打通等级',
          val: 'throughLevel',
          width: 100,
          custom: 'throughLevel'
        },
        {
          lab: '未打通原因',
          val: 'notThroughReason',
          width: 120,
          custom: 'notThroughReason'
          // showOverflowTooltip: true
        },
        {
          lab: '已终止',
          val: 'isTerminated',
          custom: 'isTerminated'
        },
        {
          lab: '黑名单',
          val: 'blacklist',
          custom: 'blacklist'
        },
        {
          lab: '城市',
          val: 'city'
        },
        {
          lab: '美学顾问',
          val: 'acName'
        },
        {
          lab: '客户代表',
          val: 'onlineUserIdName',
          width: 120
        },
        {
          lab: '服务助理',
          val: 'serviceAssistantName',
          width: 120
        },
        {
          lab: '会员客服',
          val: 'memberCustomerServiceName',
          width: 120
        },
        {
          lab: '添加人',
          val: 'createBy',
          width: 120
        }
      ],
      // 查询列表
      options: {
        planReturnTime: {
          type: 'Tdatetime',
          label: '计划回访时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        actualReturnvisitTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '实际回访时间',
          values: []
        },
        reportTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '回访上报时间',
          values: []
        },
        lastReturnVisitTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '最后回访时间',
          values: []
        },
        cusCreateTime: {
          type: 'Tdatetime',
          clearable: true,
          label: '客户建档时间',
          values: []
        },
        typeThreeIds: {
          type: 'cascader',
          label: '建档类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        // heffectiveTimes: {
        //   type: 'Tinput',
        //   label: '回访次数',
        //   clearable: true,
        //   values: []
        // },
        hreturnNum: {
          type: 'Tinput',
          label: '回访次数',
          clearable: true,
          values: []
        },
        heffectiveTimes: {
          type: 'Tinput',
          label: '有效回访量',
          clearable: true,
          values: []
        },
        customeName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '客户电话'
        },
        returnVisitKeyword: {
          type: 'input',
          label: '回访关键字'
        },
        returnVisit: {
          type: 'input',
          label: '回访目的'
        },
        returnVisitFeedback: {
          type: 'input',
          label: '回访反馈'
        },
        planReturnUser: {
          type: 'select',
          label: '计划回访人',
          clearable: true,
          options: []
        },
        isThereRecording: {
          type: 'select',
          label: '是否有录音',
          clearable: true,
          options: []
        },
        returnExecutorUser: {
          type: 'select',
          label: '回访执行人',
          clearable: true,
          options: []
        },
        // customPhone7: {
        //   type: 'select',
        //   label: '计划执行部门',
        //   options: []
        // },
        // customPhone8: {
        //   type: 'select',
        //   label: '执行人部门',
        //   options: []
        // },
        isExecute: {
          type: 'select',
          label: '回访状态',
          clearable: true,
          options: []
        },
        grade: {
          type: 'select',
          label: '回访等级',
          clearable: true,
          options: []
        },
        isOneReturnVisit: {
          type: 'select',
          label: '一次性回访',
          clearable: true,
          options: []
        },
        isTerminated: {
          type: 'select',
          label: '是否已终止',
          clearable: true,
          options: []
        },
        teminReason: {
          type: 'select',
          label: '终止原因',
          clearable: true,
          options: []
        },
        // isHospital: {
        //   type: 'select',
        //   label: '是否到院',
        //   options: []
        // },
        isReachCourtyard: {
          type: 'select',
          label: '是否到院',
          clearable: true,
          options: []
        },
        throughLevel: {
          type: 'select',
          label: '拨打结果',
          clearable: true,
          options: []
        },
        isThrough: {
          type: 'select',
          label: '是否打通',
          clearable: true,
          options: []
        },
        notThroughReason: {
          type: 'select',
          label: '未打通原因',
          clearable: true,
          options: []
        },
        dsingleUser: {
          type: 'select',
          label: '下单人',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        // memberCustomerService: {
        //   type: 'select',
        //   label: '会员客服',
        //   clearable: true,
        //   options: []
        // },
        serviceAssistant: {
          type: 'select',
          label: '服务助理',
          clearable: true,
          options: []
        },
        blacklist: {
          type: 'select',
          label: '是否黑名单',
          clearable: true,
          options: []
        },
        city: {
          type: 'select',
          label: '城市',
          clearable: true,
          options: []
        },
        whetherToResign: {
          type: 'select',
          label: '计划回访人是否在职',
          clearable: true,
          options: [
            {
              value: '0',
              label: '在职'
            },
            {
              value: '1',
              label: '离职'
            }
          ]
        }
      },
      customLabelDialog: true,
      noHospital: '0',
      returnStage: ''
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
      this.getData();

      this.deptFilingList()
      this.getUserList(val);

    }
  },
  created() {
    this.returnStage = this.$route.query.returnStage
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    // this.getDatakeyup()
    this.getData()
    this.options.throughLevel.options = this.dict.type.through_level
    // this.options.isThrough.options = this.dict.type.whether
    this.options.isThrough.options = this.dict.type.through_result
    this.options.isReachCourtyard.options = this.dict.type.whether
    // this.options.isHospital.options = this.dict.type.whether
    this.options.isThereRecording.options = this.dict.type.whether
    this.options.isTerminated.options = this.dict.type.whether
    this.options.blacklist.options = this.dict.type.whether
    this.options.isOneReturnVisit.options = this.dict.type.whether
    this.options.notThroughReason.options = this.dict.type.not_through_reason
    this.options.grade.options = this.dict.type.grade
    this.options.teminReason.options = this.dict.type.temin_reason
    this.options.isExecute.options = this.dict.type.is_execute
    this.deptFilingList()
    this.customerCityList()
    // 回车搜索
    const this_=this
    document.onkeyup = e => {
      if (e.keyCode === 13) {
        this_.getData(true)
      }
    }
  },
  methods: {
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.submitLoading = true
      let data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'daterange' || this.options[k].type === 'datetimerange' || this.options[k].type === 'Tselect' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = undefined
            data['end' + k] = undefined
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = undefined
            data['end' + k] = undefined
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
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      if (data.filingId) {
        const filing = data.filingId
        data.filingIds = this.ArrayDuplication(filing.map(item => item[0])).toString()
        data.typeTwoIds = this.ArrayDuplication(filing.map(item => item[1])).toString()
        data.typeThreeIds = this.ArrayDuplication(filing.map(item => item[2])).toString()
      }
      data.filingId = undefined
      data = Object.assign(data)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'returnStage', this.returnStage)
      this.$api.modules.netPower.AlreadyArrivedList(data).then(res => {
        if (res) {
          this.tableData = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '已到院顾客回访')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },

    // 打开未回访分配
    NoReturnVisit() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      const obj = this.selectionData.find(item => {
        return item.isExecute === '1'
      })
      if (obj) {
        this.$message.warning('已回访客户不能重新分配')
        return
      }
      this.dialogVisible = true
    },
    // 已到院顾客，全是已经到院的顾客
    customer(id, val) {
    //   if (tyard === 1) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      // } else {
      // this.$router.push({ path: '/notInHospital', query: { id }})
      // }
    },

    returnVisit(numberId, isExecute, customerId) {
      this.$router.push({ path: `/detailsOfArrival`, query: { numberId: numberId, noHospital: this.noHospital, isExecute: isExecute, customerId: customerId }}) // 此处传递的id是numebrid 在另个页面接受后用来获取这一行的数据
    },
    // 表格所选删除
    deleteTableItem() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const numberIds = this.selectionData.map(item => item.numberId)
        this.$api.modules.netPower.deleteList(numberIds).then((res) => {
          if (res) {
            this.$message.success('删除成功')
            this.getData() // 删除成功重新拉取数据
          }
        })
      }).catch(() => { })
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
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.Action = this.selectionData[0]
      this.showManualDialog = true
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 关闭高级选项弹层
    closeInnerDialog() {
      this.innerDialog = false
      this.reload()
    },
    // 获取建档类型
    deptFilingList() {
      this.$api.modules.filing.getFilingTypeById({
        deptId: this.deptId
      }).then(res => {
        if (res.data) {
          this.options.typeThreeIds.options = res.data
        }
      })
    },
    // 获取城市列表
    customerCityList() {
      this.$api.modules.netPower.customerCityList().then(res => {
        var arr = []
        if (res) {
          if (res.data) {
            res.data.forEach(item => {
              arr.push({
                value: item,
                label: item
              })
            })
          }
          this.options.city.options = arr
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
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    // 数组去重
    ArrayDuplication(data) {
      const arr = []
      data.forEach(item => {
        if (item !== undefined && !arr.includes(item)) {
          arr.push(item)
        }
      })
      return arr
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      let data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'daterange' || this.options[k].type === 'datetimerange' || this.options[k].type === 'Tselect' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
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


        }else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      if (data.filingId) {
        const filing = data.filingId
        data.filingIds = this.ArrayDuplication(filing.map(item => item[0])).toString()
        data.typeTwoIds = this.ArrayDuplication(filing.map(item => item[1])).toString()
        data.typeThreeIds = this.ArrayDuplication(filing.map(item => item[2])).toString()
      }
      data.filingId = undefined
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
      this.$set(data, 'returnStage', this.returnStage)
      this.showDataDialog = true
      this.$api.modules.netPower.AlreadyArrivedList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 获取系统用户列表
    getUserList(deptId) {
      /**
      * @author 李尚
      * @date 2022/6/18
      * @Description: 人员添加公司Id 添加状态
      */
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.dsingleUser.options.push(item)
            }
          })
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.onlineUserId.options.push(item)
            }
          })
          // res.data.forEach(item => {
          //   if (item.postCode === 'xczxs' || item.postCode === 'physician-assisted' || item.postCode === 'xhhushi') {
          //     this.options.planReturnUser.options.push(item)
          //   }
          // })
          // res.data.forEach(item => {
          //   if (item.postCode === 'xczxs' || item.postCode === 'wdzxs' || item.postCode === 'physician-assisted') {
          //     this.options.returnExecutorUser.options.push(item)
          //   }
          // })
          // 科室助理
          res.data.forEach(item => {
            if (item.postCode === 'physician-assisted') {
              this.options.serviceAssistant.options.push(item)
            }
          })
          this.options.planReturnUser.options=this.unique(res.data);
          this.options.returnExecutorUser.options=this.unique(res.data);
          // this.options.visituserId.options = res.data
          // this.options.dsingleUser.options = res.data
          // this.options.onlineUserId.options = res.data
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    /**
     * @author 李尚
     * @date 2022/6/24
     * @Description: 点击
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    rowClassName({ row }) {
      if (row.isTerminated === '1') {
        return 'warning-row'
      }
      if (row.isExecute === '1') {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">

.container {
  width: 100%;
  height: 100%;
}
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 100%;
  line-height: 30px;
  color: #999;
  .title {
    font-weight: bold;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    &:before {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
      background-color: #1abc9c;
      left: 0px;
      border-radius: 10px;
      content: "";
    }
  }
  ul {
    list-style: none;
    li {
      display: inline-block;
      margin: 0 10px;
      span {
        color: #666666;
        font-weight: bold;
      }
    }
  }
}
.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
.dialogTop {
  width: 100%;
  height: 20px;
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  white-space: break-spaces;
  margin-bottom: 10px;
  &:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: #1abc9c;
    content: "";
  }
}
.dialog-box {
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  font-size: 14px;
  .title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    background-color: #eeeeee;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;
    span {
      color: #7ec5b7;
    }
  }
  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}
.headerBarBtn {
  float: right;
  margin-left: 6px;
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
.color-block-danger {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 2px;
  border: 1px solid red;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
::v-deep .el-table .warning-row {
  background: rgba(255, 0, 0,0.8);
}
::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
<style>

.el-input__prefix{
  display: none;
}
</style>
