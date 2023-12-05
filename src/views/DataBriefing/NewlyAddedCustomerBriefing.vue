<template>
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
            <div class="title">新增顾客
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
            <!-- 点击姓名跳转路由 -->
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerClick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
            <!-- 点击客户标签弹出客户标签 -->
            <div v-else-if="data.props === 'guestLabel'">
              <el-button type="text" @click.stop.native="getCustomerLabel(data.custom.id)">客户标签详情</el-button>
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
import area from '@/utils/area'
import slideSearch from '@/components/SlideSearchBar/index.vue'
import SgTable from '@/components/Table/index.vue'
import SgDialog from '@/components/Dialog/index.vue'
import moment from 'moment'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth, lastQuarter,
  lastYear,
  monthData,
  thisQuarter,
  thisWeek,
  thisYear,
  todayTime
} from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce'
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'

export default {
  name: 'NewlyAddedCustomerBriefing',
  dicts: ['marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'sys_is_blacklist', 'occupation'],
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
    }
  },
  data() {
    return {
      // 手工上报内外弹窗
      innerDialog: false,
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
          lab: '建档时间',
          val: 'createTime',
          width: 160
        },
        {
          lab: '客户',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 140
        },
        {
          lab: '客户标签',
          val: '',
          custom: 'guestLabel',
          width: 120
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: 160
        },
        {
          lab: '网电回访人',
          val: 'onlineUserName',
          width: 120
        },
        {
          lab: '建档人',
          val: 'createUserName',
          width: 120
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '媒介类型',
          val: 'channelName',
          width: 180,
          showOverflowTooltip: true
        },
        {
          lab: '性别',
          val: 'customSex',
          width: 140,
          custom: 'customSex'
        },
        {
          lab: '县市',
          val: 'city',
          width: 160
        },
        {
          lab: '职业',
          val: 'occupation',
          width: 140,
          custom: 'occupation'
        },
        {
          lab: '婚姻',
          val: 'marriageType',
          custom: 'marriageType',
          width: 100
        },
        {
          lab: '是否分配线上客服',
          val: '',
          custom: 'hasOnlineWaiter',
          width: 140
        },
        {
          lab: '备注',
          val: 'remarks',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '是否黑名单',
          width: 120,
          val: 'blacklist',
          custom: 'blacklist'
        }
      ],
      // 查询列表
      options: {
        createTime: {
          type: 'datetimerangeopentions',
          label: '建档时间',
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
        customSex: {
          type: 'select',
          label: '性别',
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
        createuserId: {
          type: 'select',
          label: '建档人',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'cascader',
          label: '建档类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        visituserId: {
          type: 'select',
          label: '回访人',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        province: {
          type: 'select',
          label: '省份',
          clearable: true,
          options: [],
          values: ''
        },
        city: {
          type: 'select',
          label: '市县',
          clearable: true,
          options: [],
          values: ''
        },
        area: {
          type: 'select',
          label: '区',
          clearable: true,
          options: [],
          values: ''
        },
        occupation: {
          type: 'select',
          label: '职业',
          clearable: true,
          options: []
        },
        customerLabelTypeId: {
          type: 'select',
          label: '标签类别',
          clearable: true,
          options: []
        },
        labelDataId: {
          type: 'cascader',
          label: '顾客标签',
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
    // 省
    'options.province.values'() {
      // 如果省份为空 将市清空
      if (this.options.province.values === '') {
        this.options.city.options = []
        this.options.city.values = ''
        return
      }
      // 循环省份里面数据，判断省是否对应，拿到下面的市区
      // eslint-disable-next-line no-unused-vars
      for (const i in this.options.province.values) {
        const obj = this.options.province.values
        for (const item of this.areaArr) {
          if (obj === item.name) {
            item.sub.forEach(item => {
              item.label = item.name
              item.value = item.name
            })
            this.options.city.options = item.sub
          } else {
            // 当省为空的时候清空区
            this.options.city.values = ''
          }
        }
      }
    },
    'options.city.values'() {
      // 如果市区为空 将区清空
      if (this.options.city.values === '') {
        this.options.area.options = []
        this.options.area.values = ''
        return
      }
      // 循环市里面数据，判断市是否对应的区
      // eslint-disable-next-line no-unused-vars
      for (const i in this.options.city.values) {
        const obj = this.options.city.values
        for (const item of this.options.city.options) {
          if (obj === item.name) {
            item.sub.forEach(item => {
              item.label = item.name
              item.value = item.name
            })
            this.options.area.options = item.sub
          } else {
            // 当市为空的时候清空区
            this.options.area.values = ''
          }
        }
      }
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
    this.setCreateTime()
    this.getUserList()
    this.deptFilingList()
    // 设置标签类别和标签
    this.customerLabelType()
    this.customerLabelTypes()
    this.getChannelInfo()
    this.getFilingType()
    this.setSex()
    this.setOccupation()
    // 设置省市区
    this.areaArr.forEach(item => {
      item.value = item.name
      item.label = item.name
    })
    this.options.province.options = this.areaArr
    this.getData()
  },
  methods: {
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
    // 设置默认查询时间
    setCreateTime() {
      // console.log('设置查询时间time')
      switch (this.time) {
        case 'day' :
          this.options.createTime.values = todayTime()
          break
        case 'yesterday' :
          this.options.createTime.values = beforeDayTime(1)
          break
        case 'thisWeek' :
          this.options.createTime.values = thisWeek()
          break
        case 'lastWeek' :
          this.options.createTime.values = beforeWeek(1)
          break
        case 'thisMonth' :
          this.options.createTime.values = monthData()
          break
        case 'lastMonth' :
          this.options.createTime.values = lastMonth()
          break
        case 'thisQuarter' :
          this.options.createTime.values = thisQuarter()
          break
        case 'lastQuarter' :
          this.options.createTime.values = lastQuarter()
          break
        case 'thisYear' :
          this.options.createTime.values = thisYear()
          break
        case 'lastYear' :
          this.options.createTime.values = lastYear()
          break
        default:
          this.options.createTime.values = todayTime()
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
      const data = {}
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
      // const grossConsumption = {
      //   grossConsumption: 0
      // }
      // data = Object.assign(data, this.pagination, grossConsumption)
      this.$set(data, 'deptId', this.deptId)
      // this.$set(data, 'formalCustomer', '0')
      this.showDataDialog = true
      this.$api.user.customerCmtList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 导出数据
    async exportData() {
      const data = {}
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
      this.$set(data, 'deptId', this.deptId)
      await this.$api.user.exportGuestList(data)
    },
    // 关闭客户标签
    customLabel() {
      this.customLabelDialog = false
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
          this.options.visituserId.options = arr
          this.options.onlineUserId.options = arr
          this.options.createuserId.options = arr
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
    // 设置侧边搜索的顾客标签
    customerLabelTypes() {
      this.$api.modules.custLabel.custLabelTypeList({
        deptId: this.deptId
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.value = item.customerLabelTypeId
            item.label = item.labelTypeName
          })
          this.options.customerLabelTypeId.options = res.rows
        }
      })
    },
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

<style scoped lang="scss">
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
    //width: 100%;
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
</style>
