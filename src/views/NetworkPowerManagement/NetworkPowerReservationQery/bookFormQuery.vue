<template>
  <!-- 网电管理 -->
  <!--预约单查询 -->
  <div class="container">

    <slideSearch :options="options" >
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
<!--            <el-button
              size="mini"
              icon="el-icon-search"
              plain
            >查询明细
            </el-button>-->
        <el-button
          v-hasPermi="['confinement:customerReservationForm:exportappointment']"
          size="mini"
          icon="el-icon-upload2"
          plain
          :loading="submitLoading"
          @click.stop="dataExport"
          type="success"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          id="out-table"
          ref="table"
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
        >
          <div slot="searchBar" class="header-float">
            <div class="title">信息统计</div>
            <div>
              <ul>
                <li>
                  客户数量:<span>{{ statisticsData.totalAll ? statisticsData.totalAll : 0 }}人</span>
                </li>
                <li>
                  未到院人:<span>{{ statisticsData.notNum ? statisticsData.notNum : 0 }}人</span>
                </li>
                <li>
                  已到院人:<span>{{ statisticsData.reachNum ? statisticsData.reachNum : 0 }}人</span>
                </li>
                <li>
                  到院率:<span>{{ statisticsData.reachNum && statisticsData.totalAll ? ((statisticsData.reachNum / statisticsData.totalAll) * 100).toFixed(2) : 0 }}%</span>
                </li>
              </ul>
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px">
              <span class="color-block-success" /> 已到院
              <span class="color-block-default" /> 未到院
            </span>
            <el-button
              v-hasPermi="['sysManger:appointment:manual']"
              size="mini"
              type="primary"
              plain
              icon="el-icon-plus"
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >手工上报
            </el-button>
            <!--            <el-button-->
            <!--              size="mini"-->
            <!--              type="warning"-->
            <!--              plain-->
            <!--              icon="el-icon-s-promotion"-->
            <!--              class="headerBarBtn"-->
            <!--              @click.stop="sendMessage"-->
            <!--              v-hasPermi="['sysManger:appointment:information']"-->
            <!--            >批量发送短信-->
            <!--            </el-button>-->
            <el-button
              v-has-permi="['bookFormQuery:modify:appointment']"
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit"
              class="headerBarBtn"
              @click.stop="editBookForm"
            >修改预约单
            </el-button>
            <el-button
              v-has-permi="['bookFormQuery:modify:temporary']"
              size="mini"
              type="warning"
              plain
              icon="el-icon-edit"
              class="headerBarBtn"
              @click.stop="editCustomerInfo"
            >修改临客信息
            </el-button>
            <el-button
              v-has-permi="['sysManger:appointment:label']"
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit-outline"
              class="headerBarBtn"
              @click.stop="customerLabelEdit"
            >客户标签
            </el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'degreeIntention'">
              <show-dict-data :options="dict.type.degree_intention_list" :value="data.custom.degreeIntention" />
            </div>
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
            <div v-else-if="data.props==='isReachCourtyard'">
              <show-dict-data :options="dict.type.hospat_yn" :value="data.custom.isReachCourtyard" />
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sg-dialog title="临客标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabelDialog=false">
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            <div>客户基本信息</div>
          </div>
          <div class="content">
            <el-form label-width="80px" size="mini" disabled>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="客户姓名">
                    <el-input v-model="manualForm.userInfo.customerName" class="full-width" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户电话">
                    <el-input v-model="manualForm.userInfo.customPhone" class="full-width" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户性别">
                    <el-select
                      filterable
                      v-model="manualForm.userInfo.customSex"
                      class="full-width"
                      placeholder="请选择性别"
                    >
                      <el-option
                        v-for="dict in dict.type.sys_user_sex"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="经济能力">
                    <el-select
                      v-model="manualForm.userInfo.economicCapacity"
                      class="full-width"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="dict in dict.type.economic_capacity"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="建档时间">
                    <el-input v-model="manualForm.userInfo.createTime" class="full-width" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="线上客服">
                    <el-input v-model="manualForm.userInfo.onlineUserName" class="full-width" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="dialog-box">
          <div class="title">
            <div>添加标签</div>
          </div>
          <div class="content">
            <el-form label-width="80px" size="mini" :loading="manualFormLoading">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="标签类型">
                    <el-select
                      v-model="manualForm.form.customerLabelTypeId"
                      class="full-width"
                      placeholder="请选择标签类型"
                      filterable
                      @change="labelTypeSelection"
                    >
                      <el-option
                        v-for="(labelType,labelTypeIndex) in customerLabelTypeData"
                        :key="labelTypeIndex+'labelType'"
                        :label="labelType.labelTypeName"
                        :value="labelType.customerLabelTypeId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="标签">
                    <el-select
                      v-model="manualForm.form.labelDataId"
                      class="full-width"
                      filterable
                      placeholder="请选择标签"
                    >
                      <el-option
                        v-for="(labelTypeChild,labelTypeChildIndex) in customerLabelTypeChildData"
                        :key="labelTypeChildIndex+'labelTypeChild'"
                        :label="labelTypeChild.labelTypeName"
                        :value="labelTypeChild.customerLabelTypeId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="登记时间">
                    <el-date-picker
                      v-model="manualForm.form.registerTime"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      class="full-width"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注信息">
                    <el-input
                      v-model="manualForm.form.remark"
                      placeholder="请输入备注信息"
                      type="textarea"
                      :rows="3"
                      resize="none"
                      class="full-width"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      :loading="manualFormLoading"
                      @click.stop="addCustomerLabelTypeToTable"
                    >添加
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="dialog-box">
          <div class="title">
            <div>顾客标签</div>
          </div>
          <div class="content">
            <el-table
              :data="manualFormTableData"
              stripe
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
                show-overflow-tooltip
              />
              <el-table-column
                prop="address"
                label="编辑"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                  ><span
                    style="color: red"
                    @click.stop="removeToTable(scope.row)"
                  >删除</span></el-button>
                  <div v-if="scope.row.props==='isReachCourtyard'">
                    <show-dict-data
                      :options="dict.type.hospat_yn"
                      :value="scope.row.custom.isReachCourtyard"
                    />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </sg-dialog>
    <!-- 未到院上报-->
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <!-- 已到院上报-->
    <Submission
      :show-manual-dialog="showManualDialogs"
      :inner-dialog="innerDialogs"
      :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialogs"
      @closeShowManualDialog="closeShowManualDialogs"
      @setInnerDialog="setInnerDialogs"
    />
    <send-message
      :show-send-message-dialog="showSendMessageDialog"
      :selection-data="selectionData"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import ManualSubmission from '@/components/ManualSubmission'
import Submission from '@/components/ManualSubmission/indexTwo'
import SendMessage from '@/components/SendMessage'
import moment from 'moment'
import { debounce } from '@/utils/throttleAndDebounce'
import {newgetData, todayTime} from '@/utils/time'
export default {
  name: 'BookFormQuery',
  dicts: ['degree_intention_list', 'sys_user_sex', 'hospat_yn', 'economic_capacity'],
  components: {
    SendMessage,
    ManualSubmission,
    SgDialog,
    SgTable,
    slideSearch,
    Submission
  },
  data() {
    return {
      istrue:false,
      reset: false,
      submitLoading: false,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 系统用户列表
      sysUserList: [],
      // 预约项目
      bookProjectList: [],
      // 未到院手工上报
      showManualDialog: false,
      innerDialog: false,
      manualFormLoading: false,
      // 已到院手工上报
      showManualDialogs: false,
      innerDialogs: false,
      // 客户标签
      customLabelDialog: false,
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
      // 媒介来源数据
      channelType: [],
      // 手工上报表单
      manualForm: {
        userInfo: {},
        manualReport: {
          isOneReturnVisit: true
        },
        form: {
          customerLabelTypeId: undefined,
          labelDataId: undefined,
          registerTime: undefined,
          remark: undefined,
          labelTypeName: undefined,
          labelDataName: undefined
        }
      },
      // deptId: 0,
      // 顾客标签数据table
      manualFormTableData: [],
      // 顾客标签类型
      customerLabelTypeData: [],
      customerLabelTypeChildData: [],
      columns: [
        {
          lab: '到院',
          val: 'isReachCourtyard',
          custom: 'isReachCourtyard'
        },
        {
          lab: '临时客户',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 110
        },
        {
          lab: '临客备注',
          val: 'remarks',
          showOverflowTooltip: true
        },
        {
          lab: '预约单时间',
          val: 'appointmentTime',
          width: 140
        },
        {
          lab: '最后回访时间',
          val: 'lastReturnVisitTime',
          width: 140
        },
        {
          lab: '回访次数',
          val: 'returnNum'
        },
        {
          lab: '预计入住时间',
          val: 'reserveRoomTime',
          width: 120
        },
        {
          lab: '怀孕几周',
          val: 'pregnantWeek'
        },
        {
          lab: '预产期',
          val: 'preProduction',
          width: 160
        },
        {
          lab: '房间类型',
          val: 'roomType'
        },
        {
          lab: '胎数',
          val: 'fertility'
        },
        {
          lab: '意向度',
          val: 'degreeIntention',
          custom: 'degreeIntention',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '下单人',
          val: 'dsingleUserName',
          width: 90
        },
        {
          lab: '回访人',
          val: 'visituserName',
          width: 90
        },
        {
          lab: '项目名称',
          val: 'pejectNames',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '媒介',
          val: 'channelName',
          width: 160
        },
        {
          lab: '下单时间',
          val: 'dsingleTime',
          width: 140
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 140
        },
        {
          lab: '到场时间',
          val: 'arrivalTime',
          width: 140
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: 100
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          width: 140
        },
        {
          lab: 'QQ',
          val: 'qq',
          width: 110
        },
        {
          lab: '微信',
          val: 'wechat',
          width: 120
          // showOverflowTooltip: true
        },
        {
          lab: '关注问题',
          val: 'concerns',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '访客ID',
          val: 'visitorId',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '员工推荐人',
          val: 'refereeuserName',
          width: 100,
          showOverflowTooltip: true
        }
      ],
      // 查询列表
      options: {
        querTimeType: {
          type: 'select',
          label: '时间条件',
          clearable: false,
          values: '0',
          options: [
            {
              label: '预约时间',
              value: '0'
            },
            {
              label: '下单时间',
              value: '1'
            },
            {
              label: '到场时间',
              value: '2'
            },
            {
              label: '最后回访',
              value: '3'
            }
          ]
        },
        queryTime: {
          type: 'Tdatetime',
          label: '查询时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        createTime: {
          type: 'Tdatetime',
          label: '建档时间',
          clearable: true,
          values: []
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '客户电话'
        },
        channel: {
          type: 'Tselect',
          label: '媒介来源',
          clearable: true,
          values: [],
          options: []
        },
        departmentId: {
          type: 'select',
          label: '一级项目',
          clearable: true,
          options: [],
          values: ''
        },
        projectTypeId: {
          type: 'select',
          label: '二级项目',
          clearable: true,
          options: [],
          values: ''
        },
        reserveRoomTime: {
          type: 'daterange',
          label: '预计入住时间',
          clearable: true,
          values: []
        },
        pregnantWeek: {
          type: 'select',
          label: '怀孕几周',
          clearable: true,
          options: []
        },
        preProduction: {
          type: 'Tdatetime',
          label: '预产期',
          clearable: true,
          values: []
        },
        roomTypeId: {
          type: 'select',
          label: '房间类型',
          clearable: true,
          options: []
        },
        fertility: {
          type: 'select',
          label: '生育情况',
          clearable: true,
          options: []
        },
        bookingPeojectName: {
          type: 'input',
          label: '项目名称'
        },
        degreeIntention: {
          type: 'select',
          label: '意向度',
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
        dsingleUser: {
          type: 'select',
          label: '下单人',
          clearable: true,
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
          label: '回访人',
          clearable: true,
          options: []
        },
        isReachCourtyard: {
          type: 'select',
          label: '是否到院',
          clearable: true,
          options: []
        },
        returnNum: {
          type: 'Tinput',
          label: '回访次数',
          clearable: true,
          values: []
        },
        qq: {
          type: 'input',
          label: 'QQ号码'
        },
        wechat: {
          type: 'input',
          label: '微信号码'
        },
        concerns: {
          type: 'input',
          label: '关注问题'
        },
        refereeuserId: {
          type: 'select',
          label: '员工推荐',
          clearable: true,
          options: []
        },
        // temporaryRemarks: {
        //   type: 'input',
        //   label: '临客备注'
        // },
        visitorId: {
          type: 'input',
          label: '访客ID'
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
      this.getChannelInfo(val)
      this.customerLabelType(val)
      this.department(val)
      this.deptFilingList()
      this.getData()
      this.getUserList(val)
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
    // 监听一级项目
    'options.departmentId.values'() {
      if (this.options.departmentId.values === '') {
        this.options.projectTypeId.values = ''
        this.options.projectTypeId.options = []
        return
      }
      if (this.options.departmentId.values) {
        const departmentId = this.options.departmentId.values
        this.$api.modules.filing.projectTypeInfoList({ departmentId: departmentId }).then(res => {
          if (res) {
            if (res.rows.length === 0) {
              this.options.projectTypeId.values = ''
              return
            }
            res.rows.forEach(item => {
              item.label = item.projectTypeName
              item.value = item.projectTypeId
            })
            this.options.projectTypeId.options = res.rows
          }
        })
      }
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getChannelInfo(this.deptId)
    this.getUserList(this.deptId)
    this.getData()
    this.deptFilingList()
    this.department(this.deptId)
    this.customerLabelType(this.deptId)
    this.pregnantWeek() // 怀孕几周
    this.fertility() // 几胎
    this.getRoomTypeList()
    // this.getBookProjectList()
    this.options.isReachCourtyard.options = this.dict.type.hospat_yn
    this.options.degreeIntention.options = this.dict.type.degree_intention_list
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 生育情况
    fertility() {
      let fertility = []
      for (let i = 1; i <= 3; i++) {
        let compet = {
          label: i + '胎',
          value: i + '胎'
        }
        fertility.push(compet)
      }
      this.options.fertility.options = fertility
    },
    // 怀孕几周
    pregnantWeek() {
      const pregnantWeek = []
      for (let i = 1; i <= 52; i++) {
        const temp = {
          label: i + '周',
          value: i
        }
        pregnantWeek.push(temp)
      }
      this.options.pregnantWeek.options = pregnantWeek
    },
    // 房间类型
    getRoomTypeList() {
      this.$api.confinementRoom.roomTypeInfoList({
        deptId: this.deptId,
        state: '0'
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.roomType
            item.value = item.roomTypeId
          })
          this.options.roomTypeId.options = res.rows
        }
      })
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          setTimeout(()=>{
            this.getData(true)
          },500)
        }
      }
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      if (val.isReachCourtyardName === '是') {
        this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      } else {
        this.$router.push({ path: '/notInHospital', query: { id }})
      }
    },
    // 一级项目
    async department(deptId) {
      this.options.departmentId.values = ''
      this.options.projectTypeId.values = ''
      this.options.departmentId.options = []
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      await this.$api.modules.filing.departmentInfoList(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
            this.options.departmentId.options.push(item)
          })
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
          this.options.typeThreeIds.options = res.data
        }
      })
    },
    // 关闭发送短信弹窗
    closeDialog() {
      this.showSendMessageDialog = false
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    setInnerDialogs() {
      this.innerDialogs = true
      this.showManualDialogs = false
    },
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    closeShowManualDialogs() {
      this.showManualDialogs = false
    },
    closeInnerDialog() {
      this.innerDialog = false
    },
    closeInnerDialogs() {
      this.innerDialogs = false
    },
    // 打开发送短信弹窗
    sendMessage() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客发送短信')
        return
      }
      this.showSendMessageDialog = true
    },

    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData[0].isReachCourtyard === '0') {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择至少一名顾客进行修改')
          return
        }
        this.showManualDialog = true
      } else {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择至少一名顾客进行修改')
          return
        }
        this.showManualDialogs = true
      }
    },
    editBookForm() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      // modifyReservationForm
      this.$router.push({ path: '/modifyReservationForm', query: { id: this.selectionData[0].id }})
    },
    // 修改临客信息
    editCustomerInfo() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: '/ReturnVisitRecordList', query: { id: this.selectionData[0].id }})
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
    // 客户标签
    customerLabelEdit() {
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$set(this.selectionData[0], 'customerType', '1')
      this.getUserLabelInfo(this.selectionData[0].id)
    },
    // 获取顾客标签信息
    getUserLabelInfo(id) {
      this.showDataDialog = true
      this.$api.modules.netPower.getUserLabelInfo({ id: id }).then(res => {
        if (res) {
          res.data.customInfoVo.economicCapacity = res.data.customInfoVo.economicCapacity + ''
          this.manualForm.userInfo = res.data.customInfoVo
          this.manualFormTableData = res.data.labelRelations
          this.customLabelDialog = true
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      this.selectionData = !this.selectionData[0] ?  [] : this.selectionData
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 获取数据
    getData: debounce(async function(isSearch) {
      this.istrue=true;
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'daterange' || this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
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
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
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
      this.showDataDialog = true
      await this.$api.netPower.queryBookCustomerList(data).then(res => {
        if (res) {
          this.istrue=false
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    dataExport() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'daterange' || this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
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
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
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
      this.submitLoading = true
      data = Object.assign(data, this.pagination)
       this.$api.modules.netPower.ComsultExport(data).then(res => {
        this.tableData=res.rows;
        this.$export('#out-table', '预约单查询')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    //
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
    },
    // 获取渠道信息
    getChannelInfo(val) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      this.deptId = val
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
    // 标签
    addCustomerLabelTypeToTable() {
      if (this.manualForm.form.labelDataId === undefined || this.manualForm.form.customerLabelTypeId === undefined) {
        this.$message.error('请先选择标签类型和标签')
        return
      }
      const type = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === this.manualForm.form.customerLabelTypeId
      })
      this.manualForm.form.labelTypeName = type[0].labelTypeName

      const label = this.customerLabelTypeChildData.filter(filter => {
        return filter.customerLabelTypeId === this.manualForm.form.labelDataId
      })
      this.manualForm.form.labelDataName = label[0].labelTypeName

      let flag = true
      this.manualFormTableData.forEach(item => {
        if (item.labelDataId === this.manualForm.form.labelDataId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.manualForm.form.customerId = this.manualForm.userInfo.customId
        this.manualForm.form.id = this.selectionData[0].id
        this.addUserLabel(this.manualForm.form)
      } else {
        this.$message.warning('不可重复添加！')
      }
      this.manualForm.form = {
        labelDataId: undefined,
        customerLabelTypeId: undefined,
        labelTypeName: undefined,
        labelDataName: undefined,
        registerTime: undefined,
        remark: undefined
      }
      this.customerLabelTypeChildData = []
    },
    // 为顾客添加标签
    addUserLabel(data) {
      this.manualFormLoading = true
      this.$api.modules.netPower.addUserLabel(data).then(res => {
        if (res) {
          this.getUserLabelInfo(this.selectionData[0].id)
        }
      }).finally(() => {
        this.manualFormLoading = false
      })
    },
    // 从表格中删除
    removeToTable(row) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.modules.netPower.deleteCustomerLabel(row.customerLabelId).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.getUserLabelInfo(this.selectionData[0].id)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取系统用户列表
    async getUserList(deptId) {
      /**
        * @author 李尚
        * @date 2022/6/17
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
          this.sysUserList = arr1
          this.options.visituserId.options = arr1
          this.options.dsingleUser.options = arr1
          this.options.onlineUserId.options = arr1
          this.options.refereeuserId.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取顾客标签
    customerLabelType(val) {
      this.$api.modules.custLabel.customerLabelType({
        'deptId': val
      }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    // 顾客标签选择
    labelTypeSelection(selection) {
      this.manualForm.form.labelDataId = undefined
      this.customerLabelTypeChildData = []
      const data = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === selection
      })
      this.customerLabelTypeChildData = data[0].customLabelData
    },
    rowClassName({ row,rowIndex }) {
      if (row.isReachCourtyard === '1') {
        return 'success-row'
      }
      if(rowIndex%2==0){
        return 'normal-row'
      }
      return ''
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
    font-size: 14px;
    font-weight: bold;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    color: #999;
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
      font-size: 14px;
      display: inline-block;
      margin: 0 10px;
      color: #999;
      span {
        color: #666666;
        font-weight: bold;
      }
    }
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
::v-deep .el-input__prefix{
  display: none;
}
</style>
<style>
.el-table .success-row {
  background-color: #7ec5b7;
}


</style>
