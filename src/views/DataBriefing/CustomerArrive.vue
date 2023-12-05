<template>
  <!--数据简报 - 到诊-->
  <div class="container">
    <!--新增顾客数据-->
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          :plain="true"
          @click.stop="getData"
          @keyup.enter.native="getDataKeyup"
        >查询
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-download"
          type="success"
          :plain="true"
          @click.stop="exportData"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"

          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          :selection="true"
          :border="true"
          index="序号"
          :table-data="tableData"
          :columns="columns"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">
              客户到诊  总人数：{{ zongshu.countall }}
              新客首次：{{ zongshu.newGuestFirst }}
              新客二次：{{ zongshu.oldGuestSecondary }}
              新客：{{ zongshu.newGuset }}
              老客：{{ zongshu.oldGuest }}
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <el-button
              v-hasPermi="['confinement:customerCmt:edit']"
              size="mini"
              type="primary"
              :plain="true"
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >手工上报
            </el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'isReachCourtyard'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
            </div>
            <!--  是否下单-->
            <div v-else-if="data.props === 'appointment'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.appointment" />
            </div>
            <div v-else-if="data.props === 'marriageType'">
              <show-dict-data :options="dict.type.marital_status" :value="data.custom.marriageType" />
            </div>
            <div v-else-if="data.props === 'querTimeType'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.querTimeType" />
            </div>
            <div v-else-if="data.props === 'economicCapacity'">
              <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
            </div>
            <div v-else-if="data.props === 'occupation'">
              <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation" />
            </div>
            <div v-else-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-else-if="data.props === 'blacklist'">
              <show-dict-data :options="dict.type.sys_is_blacklist" :value="data.custom.blacklist" />
            </div>
            <!-- 是否分配线上客服，有线上客服name就是分配了 -->
            <div v-else-if="data.props === 'hasOnlineWaiter'">
              <span>{{
                data.custom.onlineUserName !== '' && data.custom.onlineUserName !== undefined ? '是' : '否'
              }}</span>
            </div>
            <div v-else-if="data.props === 'isDeal'">
              <show-dict-data :options="dict.type.whether_deal" :value="data.custom.isDeal" />
            </div>
            <div v-else-if="data.props === 'receptionStatus'">
              <show-dict-data :options="dict.type.Reception_status" :value="data.custom.receptionStatus" />
            </div>
            <div v-else-if="data.props === 'triageType'">
              <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
            </div>
            <div v-else-if="data.props === 'isSecondary'">
              <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
            </div>
            <!-- 点击姓名跳转路由 -->
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerClick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
            <!-- 点击客户标签弹出客户标签 -->
            <div v-else-if="data.props === 'guestLabel'">
              <el-button type="text" @click.stop.native="getCustomerLabel(data.custom.id)">客户标签详情</el-button>
            </div>
            <div v-if="data.props === 'customerStatus'">
              <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <!-- 客户标签 -->
    <sg-dialog title="客户标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabel">
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            <div>顾客标签</div>
          </div>
          <div class="content">
            <el-table
              :data="customLabelTableData"
              :stripe="true"
              size="mini"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              />
              <el-table-column
                prop="labelDataName"
                label="标签"
                align="center"
              />
              <el-table-column
                prop="createBy"
                label="登记人"
                align="center"
              />
              <el-table-column
                prop="createTime"
                label="登记日期"
                width="140"
                align="center"
              />
              <el-table-column
                prop="remark"
                label="备注"
                width="200"
                align="center"
                :show-overflow-tooltip="true"
              />
            </el-table>
          </div>
        </div>
      </div>
    </sg-dialog>
    <!-- 手工上报弹窗 -->
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
  </div>
</template>

<script>
import moment from 'moment/moment'
import { debounce } from '@/utils/throttleAndDebounce'
import area from '@/utils/area'
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'
import slideSearch from '@/components/SlideSearchBar/index.vue'
import SgTable from '@/components/Table/index.vue'
import SgDialog from '@/components/Dialog/index.vue'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from '@/utils/time'

export default {
  name: 'CustomerArrive',
  dicts: ['whether_deal', 'whether_secondary', 'Reception_status', 'whether_Newguest', 'marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'sys_is_blacklist', 'occupation'],
  components: {
    ManualSubmission,
    SgDialog,
    SgTable,
    slideSearch
  },
  props: {
    time: {
      type: String,
      default: 'day'
    },
    // 客户状态 1新 2老
    customerType: {
      type: String,
      default: '1'
    },
    isSecondary: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      // 手工上报内外弹窗
      innerDialog: false,
      zongshu:"",
      showManualDialog: false,
      Action: {},
      selectionData: [],
      // 客户标签
      customLabelDialog: false,
      customLabelTableData: [],
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 统计
      statisticsData: 0,
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 建档第一类型
      filingTypeData: [],
      // 建档第二类型
      filingTypeDataTwoData: [],
      // 建档第三类型
      filingTypeDataThreeData: [],
      // 地区
      areaArr: area.arrAll, // 省
      cityArr: [], // 市
      districtArr: [], // 区
      columns: [
        {
          lab: '会员等级',
          val: 'gradeName'
        },
        {
          lab: '接待时间',
          val: 'receptionTime',
          width: 200
        },
        {
          lab: '姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '新老客户',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '是否二次',
          val: 'isSecondary',
          custom: 'isSecondary'
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 100
        },
        {
          lab: '接诊状态',
          val: 'receptionStatus',
          custom: 'receptionStatus'
        },
        {
          lab: '分诊类型',
          val: 'triageType',
          custom: 'triageType'
        },
        {
          lab: '是否成交',
          val: 'isDeal',
          custom: 'isDeal'
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 130
        },
        {
          lab: '客户代表',
          val: 'crName',
          width: 130
        },
        {
          lab: '服务助理',
          val: 'saName'
        },
        {
          lab: '医生',
          val: 'diName',
          width: 130

        },
        {
          lab: '客户意向',
          val: 'intentionDescription',
          width: 200,
          showOverflowTooltip: true

        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 160
        },
        {
          lab: '导医',
          val: 'gmaName',
          width: 100

        },
        {
          lab: '预约类型',
          val: 'typeThreeName',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '媒介类型',
          val: 'channelTypeName',
          width: 100

        },
        {
          lab: '媒介来源',
          val: 'channelName',
          width: 100

        },
        {
          lab: '接诊备注',
          val: 'remark',
          width: 140,
          showOverflowTooltip: true

        },
        {
          lab: '接诊编号',
          val: 'receptionNumber',
          width: 160
          // custom: 'degreeIntention',
        }
      ],
      // 查询列表
      options: {
        // timeType: {
        //   type: 'select',
        //   label: '时间类型',
        //   clearable: true,
        //   options: [
        //     { label: '建档时间', value: 'create' },
        //     { label: '到院时间', value: 'arrival' },
        //     { label: '接待时间', value: 'membership' }
        //   ],
        //   values: 'create'
        // },
        receptionTime: {
          type: 'datetimerangeopentions',
          label: '接待时间',
          clearable: true,
          // beforeDayTime 传递天数可以获取几天前的时间，方便查询
          values: []
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '电话'
        },
        customerStatus: {
          type: 'select',
          label: '客户状态',
          clearable: true,
          values: null,
          options: []
        },
        customSex: {
          type: 'select',
          label: '性别',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '是否二次',
          clearable: true,
          values: null,
          options: []
        },
        receptionStatus: {
          type: 'select',
          label: '接待状态',
          clearable: true,
          options: []
        },
        isDeal: {
          type: 'select',
          label: '是否成交',
          clearable: true,
          options: []
        },
        channel: {
          type: 'Tselect',
          label: '媒介',
          clearable: true,
          values: [],
          options: []
        },
        typeThreeIds: {
          type: 'cascader',
          label: '预约类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        departmentId: {
          type: 'select',
          label: '科室',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        doctorId: {
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        giveMedicalAdvice: {
          type: 'select',
          label: '导医',
          clearable: true,
          options: []
        },
        customerRepresentative: {
          type: 'select',
          label: '客户代表',
          clearable: true,
          options: []
        },
        serviceAssistant: {
          type: 'select',
          label: '服务助理',
          clearable: true,
          options: []
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
    },
    'options.customerLabelTypeId.values'() {
      if (this.options.customerLabelTypeId.values === '') {
        this.options.labelDataId.options = []
        // this.options.label.options.splice(0, this.options.label.options.length)
        this.options.labelDataId.values = ''
        return
      }
      var id = this.options.customerLabelTypeId.values
      this.$api.modules.custLabel.custLabelData({
        customerLabelTypeId: id,
        deptId: this.deptId
      }).then(res => {
        if (res) {
          res.rows.forEach(ite => {
            ite.value = ite.labelDataId
            ite.label = ite.labelDataName
          })
          this.options.labelDataId.options = res.rows
        }
      })
    }
  },
  created() {
    // 设置进入时默认的侧边搜索时间和新老客户状态
    this.setReceptionTime()
    // 设置侧边栏科室
    this.Department()
    this.getUserList()
    // 设置侧边预约类型媒介等
    this.deptFilingList()
    this.getChannelInfo()
    this.getFilingType()
    this.getData()
    // 设置侧边字典
    this.setSearchDict()
    this.setCustomerStatus()
    // this.options.customerStatus.values = this.customerType
  },
  methods: {
    // 获取及设置侧边搜索科室的数据
    Department() {
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentId.options = res.rows
        }
      })
    },
    // 设置侧边搜索字典
    setSearchDict() {
      // 是否成交
      this.options.isDeal.options = this.dict.type.whether_deal
      // 是否二次
      this.options.isSecondary.options = this.dict.type.whether_secondary
      // 新客老客
      this.options.customerStatus.options = this.dict.type.whether_Newguest
      // 接诊状态
      this.options.receptionStatus.options = this.dict.type.Reception_status
      // 性别
      this.options.customSex.options = this.dict.type.sys_user_sex
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
    // 打开手工上报高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭手工上报高级选项
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 关闭手工上报弹窗
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 设置默认新老客户状态
    setCustomerStatus() {
      // console.log(this.customerType)
      this.options.customerStatus.values = this.customerType
      this.options.isSecondary.values = this.isSecondary
    },
    // 设置默认查询时间
    setReceptionTime() {
      // console.log('设置查询时间time')
      switch (this.time) {
        case 'day' :
          this.options.receptionTime.values = todayTime()
          break
        case 'yesterday' :
          this.options.receptionTime.values = beforeDayTime(1)
          break
        case 'thisWeek' :
          this.options.receptionTime.values = thisWeek()
          break
        case 'lastWeek' :
          this.options.receptionTime.values = beforeWeek(1)
          break
        case 'thisMonth' :
          this.options.receptionTime.values = monthData()
          break
        case 'lastMonth' :
          this.options.receptionTime.values = lastMonth()
          break
        case 'thisQuarter' :
          this.options.receptionTime.values = thisQuarter()
          break
        case 'lastQuarter' :
          this.options.receptionTime.values = lastQuarter()
          break
        case 'thisYear' :
          this.options.receptionTime.values = thisYear()
          break
        case 'lastYear' :
          this.options.receptionTime.values = lastYear()
          break
        default:
          this.options.receptionTime.values = todayTime()
      }
    },
    // 回车搜索
    getDataKeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    // 获取客户标签
    getCustomerLabel(customerId) {
      this.$api.user.usrtlist({ id: customerId }).then(res => {
        console.log(res)
        this.customLabelDialog = true
        this.customLabelTableData = res.rows
      })
    },
    // 点击跳转客户详情路由
    customerClick(id, val) {
      if (val.isReachCourtyard === '1') {
        this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      } else {
        this.$router.push({ path: '/notInHospital', query: { id }})
      }
    },
    exportData() {
      console.log('导出数据')
    },
    // 设置职业选择框
    setOccupation() {
      // console.log('设置职业options')
      this.$api.dict.getDicts('occupation').then(res => {
        if (res) {
          res.data.forEach(item => {
            this.options.occupation.options.push({ label: item.dictLabel, value: item.dictValue })
          })
        }
      })
    },
    // 设置性别选择框
    setSex() {
      // console.log('设置性别')
      this.$api.dict.getDicts('sys_user_sex').then(res => {
        if (res) {
          res.data.forEach(item => {
            this.options.customSex.options.push({ label: item.dictLabel, value: item.dictValue })
          })
        }
      })
    },
    // 获取数据
    getData: debounce(function() {
      let data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerangeopentions' || this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
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
      const grossConsumption = {
        grossConsumption: 0
      }
      data = Object.assign(data, this.pagination, grossConsumption)
      this.$set(data, 'deptId', this.deptId)
      // this.$set(data, 'formalCustomer', '0')
      this.showDataDialog = true
      this.$api.dept.MyReception(data, 'get').then(res => {
        if (res) {
          this.tableData = res.rows
          this.zongshu=res.data;
          this.pagination.total = res.total
          this.statisticsData = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 关闭客户标签
    customLabel() {
      this.customLabelDialog = false
      // this.manualForm.form.customerLabelTypeId = ''
      // this.manualForm.form.remark = ''
      // this.manualForm.form.registerTime = ''
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
    // 单选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 行内点击选中
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(this.selectionData)
    },
    // 获取建档类型
    getFilingType() {
      this.filingLoading = true
      this.$api.modules.filing.getFilingTypeById({
        'deptId': this.deptId,
        'status': '0'
      }).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              this.filingTypeData.push(item)
            })
          } else {
            this.filingTypeData = []
          }
        }
      }).finally(() => {
        this.filingLoading = false
      })
    },
    // 得到所有的工作人员，同时设置查询条件下拉框的数据
    getUserList(deptId) {
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
          // 去重
          const arr = this.unique(res.data)
          // 设置下拉框数据
          this.options.serviceAssistant.options = arr
          this.options.aestheticConsultant.options = arr
          this.options.doctorId.options = arr
          this.options.giveMedicalAdvice.options = arr
          this.options.customerRepresentative.options = arr
        }
      })
    },
    // 去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取顾客标签
    customerLabelType() {
      this.$api.modules.custLabel.customerLabelType({
        deptId: this.deptId
      }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    // // 设置侧边搜索的顾客标签
    // customerLabelTypes() {
    //   this.$api.modules.custLabel.custLabelTypeList({
    //     deptId: this.deptId
    //   }).then(res => {
    //     if (res) {
    //       res.rows.forEach(item => {
    //         item.value = item.customerLabelTypeId
    //         item.label = item.labelTypeName
    //       })
    //       this.options.customerLabelTypeId.options = res.rows
    //     }
    //   })
    // },
    // 设置侧边搜索的建档类型
    deptFilingList() {
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
    // 设置媒介类型
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
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 99%;
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
      left: 0;
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
    /* width: 100%; height: 30px; background-color: #eeeeee; padding: 0 10px; line-height: 30px; box-sizing: border-box; */

    span {
      color: #7ec5b7;
    }
  }

  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
