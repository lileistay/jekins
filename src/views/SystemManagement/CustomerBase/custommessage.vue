<template>
    <!-- 临客查询 -->
    <div >
      <slideSearch :options="options" >
        <div slot="btnBar">
          <el-button size="mini" icon="el-icon-search" type="primary" plain @keydown.enter.native="getData(true)" @click.stop="getData(true)"
          >查询
          </el-button>
          <el-button v-has-permi="['confinement:customerReservationForm:exportguest']" size="mini" type="success"
                     icon="el-icon-upload2" plain :loading="submitLoading" @click="exportExcel">导出
          </el-button>
        </div>
        <slot>
          <sg-table  id="out-table" v-if="true" ref="table" :sg-ref="'multipleTable'" :pagination="pagination" size="mini" selection border
                    index="序号" highlight-current-row :table-data="tableData" :columns="columns" :row-class-name="rowClassName"
                    @size-change="sizeChange" @current-change="currentChange" @row-click="rowClick"
                    @selection-change="handleSelectionChange" @table-current-change="handleCurrentChange" >
            <div slot="searchBar" class="searchBar">
              <div class="title">信息统计</div>
              <div>
                <span>客户数量: {{ statisticsData }}人</span>
              </div>
            </div>
            <div slot="header" style="width: 100%;">
              <span style="font-size: 14px;"><i class="el-icon-s-fold" style="cursor:pointer" @click="getDialogStemporary"/> 列表清单</span>
              <span style="margin-left: 10px; margin-right:10px;font-size: 14px"><i class="color-block-success" />已到院</span>
              <span style="font-size: 14px"><i class="color-block-default" />未到院</span>
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
              <!-- 点击姓名跳转路由 -->
              <div v-else-if="data.props === 'customerName'">
                <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
              </div>
            </template>
          </sg-table>
        </slot>
      </slideSearch>
      <sg-dialog title="临客标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabel">
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
                      <el-select filterable v-model="manualForm.userInfo.customSex" class="full-width" placeholder="请选择性别">
                        <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
                                   :value="dict.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="经济能力">
                      <el-select filterable v-model="manualForm.userInfo.economicCapacity" class="full-width" placeholder="请选择">
                        <el-option v-for="dict in dict.type.economic_capacity" :key="dict.value" :value="dict.value"
                                   :label="dict.label" />
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
                      <el-select filterable v-model="manualForm.form.customerLabelTypeId" class="full-width" placeholder="请选择标签类型"
                                 @change="labelTypeSelection">
                        <el-option v-for="(labelType, labelTypeIndex) in customerLabelTypeData"
                                   :key="labelTypeIndex + 'labelType'" :label="labelType.labelTypeName"
                                   :value="labelType.customerLabelTypeId" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="标签">
                      <el-select filterable v-model="manualForm.form.GuestLabel" class="full-width" placeholder="请选择标签">
                        <el-option v-for="(labelTypeChild, labelTypeChildIndex) in customerLabelTypeChildData"
                                   :key="labelTypeChildIndex + 'labelTypeChild'" :label="labelTypeChild.labelTypeName"
                                   :value="labelTypeChild.customerLabelTypeId" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="登记时间">
                      <el-date-picker v-model="manualForm.form.registerTime" type="date" format="yyyy-MM-dd"
                                      value-format="yyyy-MM-dd" class="full-width" placeholder="选择日期" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注信息">
                      <el-input v-model="manualForm.form.remark" placeholder="请输入备注信息" type="textarea" :rows="3"
                                resize="none" class="full-width" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-plus" :loading="manualFormLoading"
                                 @click.stop="addCustomerLabelTypeToTable">添加
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
              <el-table :data="manualFormTableData" stripe size="mini" style="width: 100%">
                <el-table-column type="index" width="50" label="序号" align="center" />
                <el-table-column prop="labelDataName" label="标签" align="center" />
                <el-table-column prop="createBy" label="登记人" align="center" />
                <el-table-column prop="createTime" label="登记日期" width="140" align="center" />
                <el-table-column prop="remark" label="备注" width="200" align="center" show-overflow-tooltip />
                <el-table-column prop="address" label="编辑" align="center" width="80">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini"><span style="color: red"
                                                             @click.stop="removeToTable(scope.row)">删除</span></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </sg-dialog>
      <manual-submission :show-manual-dialog="showManualDialog" :inner-dialog="innerDialog" :selection-data="selectionData"
                         @closeInnerDialog="closeInnerDialog" @closeShowManualDialog="closeShowManualDialog"
                         @selectAllpeople="selectAllpeople"
                         :flagnew="true"
                         @setInnerDialog="setInnerDialog" />
      <send-message :show-send-message-dialog="showSendMessageDialog" :selection-data="selectionData"
                    @closeDialog="closeDialog" />
      <sg-table id="out-table" size="mini" index="序号" style="display: none" :table-data="tableDatas" :columns="columns">
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
          <!-- 点击姓名跳转路由 -->
          <div v-else-if="data.props === 'customerName'">
            <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
          </div>
        </template>
      </sg-table>
      <import-template ref="import" :upload="upload" @downloadTemplate="downloadTemplate" @handleFileClose="handleFileClose"
                       @handleFileUploadProgress="handleFileUploadProgress" @handleFileSuccess="handleFileSuccess"
                       @handleFileError="handleFileError" @submitFileForm="submitFileForm" />
      <!--  列表排序弹框    -->
      <Dsort :drow_table="'LINKE'"
             :showDialogS="showDialogStemporary"
             @showdialogT="showdialogT"
             :sortList="columns1"
             :selectEnable="selectEnable"
             ref="temporary"
             :itemHandleSelectionChange="itemHandleSelectionChange"
      >
  
      </Dsort>
    </div>
  </template>
  
  <script>
  
  import area from '@/utils/area'
  import { debounce } from '@/utils/throttleAndDebounce'
  import slideSearch from '@/components/SlideSearchBar/index'
  import SgTable from '@/components/Table'
  import SgDialog from '@/components/Dialog'
  import { beforeDayTime, todayTime } from '@/utils/time'
  import ManualSubmission from '@/components/ManualSubmission'
  import SendMessage from '@/components/SendMessage'
  import importTemplate from '@/components/ImportTemplate'
  import moment from 'moment'
  import Dsort from '@/components/Dsort'
  import Sortable from 'sortablejs' //排序拖拽
  // 引入导出Excel表格依赖
  import { export_table_to_excel } from '@/utils/utils'
  
  export default {
    name: 'BookFormQuery',
    dicts: ['marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether'],
    components: {
      SendMessage,
      ManualSubmission,
      SgDialog,
      SgTable,
      slideSearch,
      importTemplate,
      Dsort
    },
    data() {
      return {
        selectall:[],//所有数据
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 上传的地址
          url: '/api/sorage/insertInfo/importInstall'
        },
        tableDatas: [],
        submitLoading: false,
        // 多选数据
        selectionData: [],
        // 系统用户列表
        sysUserList: [],
        // 手工上报
        showManualDialog: false,
        innerDialog: false,
        manualFormLoading: false,
        // 客户标签
        customLabelDialog: false,
        // 显示发送短信弹窗
        showSendMessageDialog: false,
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
          total: 0,
          currentPage: 1
        },
        // 媒介来源数据
        channelType: [],
        // 手工上报表单
        manualForm: {
          userInfo: {},
          form: {
            customerLabelTypeId: undefined,
            GuestLabel: undefined,
            registerTime: undefined,
            remark: undefined,
            labelTypeName: undefined,
            labelDataName: undefined
          }
        },
        // 顾客标签数据table
        manualFormTableData: [],
        // 地区
        areaArr: area.arrAll, // 省
        cityArr: [], // 市
        districtArr: [], // 区
        // 顾客标签类型
        customerLabelTypeData: [],
        customerLabelTypeChildData: [],
        columns: [
          {
            lab: '是否下单',
            val: 'appointment',
            custom: 'appointment'
          },
          {
            lab: '是否到院',
            val: 'isReachCourtyard',
            custom: 'isReachCourtyard'
          },
          {
            lab: '顾客',
            val: 'customerName',
            custom: 'customerName',
            width: 120
          },
          // {
          //   lab: '性别',
          //   val: 'customSex'
          // },
          {
            lab: '电话',
            val: 'customPhone',
            width: 120
          },
          {
            lab: '建档类型',
            val: 'typeThreeName',
            width: 140
          },
          {
            lab: '线上客服',
            val: 'onlineUserName',
            width: 100,
            showOverflowTooltip: true
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
            lab: '建档人',
            val: 'createUserName',
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '回访人',
            val: 'visituserName',
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '建档时间',
            val: 'createTime',
            width: 180
          },
          {
            lab: '到院时间',
            val: 'arrivalTime',
            width: 180
          },
          {
            lab: '最后回访时间',
            val: 'lastReturnVisitTime',
            width: 140
          },
          {
            lab: '媒介',
            val: 'channelName',
            width: 160
          },
          {
            lab: '标签名称',
            val: 'onlineUserName',
            width: 142
          },
          {
            lab: '客户推荐人',
            val: 'refereeName',
            width: 120
          },
          {
            lab: '客户推荐人电话',
            val: 'refereePhone',
            width: 120
          },
          {
            lab: '推荐人卡号',
            val: 'refereeCard',
            width: 180
          },
          {
            lab: '关注问题',
            val: 'concerns',
            width: 140,
            showOverflowTooltip: true
          },
          {
            lab: '婚姻状况',
            val: 'marriageType',
            custom: 'marriageType'
          },
          {
            lab: '经济能力',
            val: 'economicCapacity',
            custom: 'economicCapacity',
            width: 140
          },
          {
            lab: '省份',
            val: 'province'
          },
          {
            lab: '县市',
            val: 'city'
          },
          {
            lab: '区',
            val: 'area'
          },
          {
            lab: '地址',
            val: 'addr',
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '职业',
            val: 'occupation',
            custom: 'occupation',
            width: 120
          },
          {
            lab: '微信',
            val: 'wechat',
            width: 120
          },
          {
            lab: 'QQ',
            val: 'qq',
            width: 120
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
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '备注',
            val: 'remarks',
            width: 150,
            showOverflowTooltip: true
          }
        ],
        columns1: [
          {
            lab: '是否下单',
            val: 'appointment',
            custom: 'appointment'
          },
          {
            lab: '是否到院',
            val: 'isReachCourtyard',
            custom: 'isReachCourtyard'
          },
          {
            lab: '顾客',
            val: 'customerName',
            custom: 'customerName',
            width: 120
          },
          // {
          //   lab: '性别',
          //   val: 'customSex'
          // },
          {
            lab: '电话',
            val: 'customPhone',
            width: 120
          },
          {
            lab: '建档类型',
            val: 'typeThreeName',
            width: 140
          },
          {
            lab: '线上客服',
            val: 'onlineUserName',
            width: 100,
            showOverflowTooltip: true
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
            lab: '建档人',
            val: 'createUserName',
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '回访人',
            val: 'visituserName',
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '建档时间',
            val: 'createTime',
            width: 180
          },
          {
            lab: '到院时间',
            val: 'arrivalTime',
            width: 180
          },
          {
            lab: '最后回访时间',
            val: 'lastReturnVisitTime',
            width: 140
          },
          {
            lab: '媒介',
            val: 'channelName',
            width: 160
          },
          {
            lab: '标签名称',
            val: 'onlineUserName',
            width: 142
          },
          {
            lab: '客户推荐人',
            val: 'refereeName',
            width: 120
          },
          {
            lab: '客户推荐人电话',
            val: 'refereePhone',
            width: 120
          },
          {
            lab: '推荐人卡号',
            val: 'refereeCard',
            width: 180
          },
          {
            lab: '关注问题',
            val: 'concerns',
            width: 140,
            showOverflowTooltip: true
          },
          {
            lab: '婚姻状况',
            val: 'marriageType',
            custom: 'marriageType'
          },
          {
            lab: '经济能力',
            val: 'economicCapacity',
            custom: 'economicCapacity',
            width: 140
          },
          {
            lab: '省份',
            val: 'province'
          },
          {
            lab: '县市',
            val: 'city'
          },
          {
            lab: '区',
            val: 'area'
          },
          {
            lab: '地址',
            val: 'addr',
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '职业',
            val: 'occupation',
            custom: 'occupation',
            width: 120
          },
          {
            lab: '微信',
            val: 'wechat',
            width: 120
          },
          {
            lab: 'QQ',
            val: 'qq',
            width: 120
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
            width: 120,
            showOverflowTooltip: true
          },
          {
            lab: '备注',
            val: 'remarks',
            width: 150,
            showOverflowTooltip: true
          }
        ],
        // 查询列表
        options: {
          createTime: {
            type: 'Tdatetime',
            label: '建档时间',
            clearable: true,
            values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
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
          pregnantWeek: {
            type: 'select',
            label: '怀孕几周',
            clearable: true,
            options: []
          },
          reserveRoomTime: {
            type: 'daterange',
            label: '预计入住时间',
            clearable: true,
            values: []
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
          lastReturnVisitTime: {
            type: 'Tdatetime',
            label: '最后回访时间',
            clearable: true,
            values: []
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
          arrivalTime: {
            type: 'Tdatetime',
            label: '到院时间',
            clearable: true,
            values: []
          },
          remarks: {
            type: 'input',
            label: '备注'
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
          appointment: {
            type: 'select',
            label: '是否下单',
            clearable: true,
            options: []
          },
          occupation: {
            type: 'select',
            label: '职业',
            clearable: true,
            options: []
          },
          concerns: {
            type: 'input',
            label: '关注问题'
          },
          addr: {
            type: 'input',
            label: '地址'
          },
          qq: {
            type: 'input',
            label: 'QQ号码'
          },
          wechat: {
            type: 'input',
            label: '微信号码'
          },
          customAge: {
            type: 'Tinput',
            label: '年龄',
            clearable: true,
            values: []
          },
          customerLabelTypeId: {
            type: 'select',
            label: '标签类别',
            clearable: true,
            options: []
          },
          labelDataId: {
            type: 'cascader',
            label: '标签',
            clearable: true,
            options: []
          },
          refereeuserId: {
            type: 'select',
            label: '员工推荐人',
            clearable: true,
            options: []
          },
          refereePhone: {
            type: 'input',
            label: '顾客推荐人电话'
          },
          refereeCard: {
            type: 'input',
            label: '推荐人卡号'
          },
          reservationNumber: {
            type: 'input',
            label: '预约号'
          },
          economicCapacity: {
            type: 'select',
            label: '消费能力',
            clearable: true,
            options: []
          },
          visitorId: {
            type: 'input',
            label: '访客ID'
          }
        },
        rowTable: undefined,
        doctor: [],
        Bath: [],
        Chankang: [],
        esthetics: [],
        // 排序弹框
        showDialogStemporary:false,
        selectionDataSortList:[],//选中的列表数据
        xflagList:[],
        cancelList:[],
  
  
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
        this.deptFilingList()
        this.getData()
        this.getUserList() // 人员数据
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
      this.columns = JSON.parse(localStorage.getItem('flagListtemporary'))?JSON.parse(localStorage.getItem('flagListtemporary')):this.columns
      this.columns1 = JSON.parse(localStorage.getItem('sortListtemporary'))?JSON.parse(localStorage.getItem('sortListtemporary')):this.columns1
      this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionTemporary'))?JSON.parse(localStorage.getItem('selectionTemporary')):this.selectionDataSortList
      this.cancelList = JSON.parse(localStorage.getItem('cancelListtemporary'))?JSON.parse(localStorage.getItem('cancelListtemporary')):this.cancelList
      this.getData()
      this.deptId = this.$store.getters.departmentId
      this.getUserList(this.deptId)
      this.customerLabelType()
      this.deptFilingList()
      this.customerLabelTypes()
      this.getChannelInfo()
      this.areaArr.forEach(item => {
        item.value = item.name
        item.label = item.name
      })
      this.options.province.options = this.areaArr
      this.options.isReachCourtyard.options = this.dict.type.whether
      this.options.customSex.options = this.dict.type.sys_user_sex
      this.options.appointment.options = this.dict.type.whether // 是否下单
      this.options.occupation.options = this.dict.type.occupation
      this.options.economicCapacity.options = this.dict.type.economic_capacity
      this.getRoomTypeList()
      this.pregnantWeek()
      this.fertility()
      // this.province()
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods: {
      selectAllpeople(){
        var data = {}
        for (const k in this.options) {
          if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
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
        /**
         * @author Nevin
         * @date 2022/8/12
         * @Description: 如果点击搜索按钮，将页码设为1
         */
        // if (isSearch) {
        //   this.pagination.pageNum = 1
        //   this.pagination.currentPage = 1
        // }
        data = Object.assign(data)
        /**
         * @author Nevin
         * @date 2022/6/14
         * @Description: 传公司ID，后期可能要改
         */
  
        this.$set(data, 'deptId', this.deptId)
        this.showDataDialog = true
        this.$api.user.customerCmtList(data).then(res => {
          if (res) {
            this.selectionData = res.rows;
  
          }
        }).finally(() => {
          this.showDataDialog = false
        })
      },
      // 弹出顺序弹框
      getDialogStemporary(){
        this.showDialogStemporary=true
        if (this.selectionDataSortList.length){
          this.columns.forEach(item=>{
            this.columns1.forEach(items=>{
              if (item.lab==items.lab){
                this.$nextTick(()=>{
                  this.$refs.temporary.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
                })
              }
            })
          })
        }else {
          this.$nextTick(()=>{
            this.$refs.temporary.$refs.sortRef.$refs.sortRefs.toggleAllSelection()
          })
        }
        this.$nextTick(() => {
          this.rowDrop()
        })
      },
      // 在行拖拽的方法进行querySelector的查找时，需对查询到dialog的el-table的类中
      rowDrop() {
        let tbody = document.querySelector('.LINKE .el-table__body-wrapper tbody')
        let _this = this
        Sortable.create(tbody, {
          // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
          group: {
            name: 'words',
            pull: true,
            put: true,
            sort: true,
            filter:'.flagclass'
          },
          animation: 150, // ms, number 单位：ms，定义排序动画的时间
          onEnd ({ newIndex, oldIndex }) { // 结束拖拽
            let currRow = _this.columns1.splice(oldIndex, 1)[0]
            _this.columns1.splice(newIndex, 0, currRow)
            if (_this.cancelList.length){
              _this.columns=_this.columns1
              _this.cancelList.forEach(iten=>{
                _this.columns = _this.columns.filter(mm=>mm.lab!=iten.lab)
              })
            }else {
              _this.columns=_this.columns1
              _this.columns1=_this.columns1
            }
            localStorage.setItem('sortListtemporary',JSON.stringify(_this.columns1))
            localStorage.setItem('flagListtemporary',JSON.stringify(_this.columns))
          }
        })
      },
      // 在点击列的时候被触发
      itemHandleSelectionChange(selection){
        this.xflagList=this.columns1
        this.selectionDataSortList=selection[1]
        // localStorage.setItem('sortList',JSON.stringify(this.sortList))
        let selected = selection[1].length && selection[1].indexOf(selection[2]) !== -1
        if (selected==false){
          this.cancelList.push(selection[2])
          this.cancelList = this.unique1(this.cancelList)
          this.xflagList=[]
          this.cancelList.forEach((item1,index1)=>{
            this.columns=this.columns.filter(itemm=>itemm.lab!==item1.lab)
            this.columns = this.unique1(this.columns)
            localStorage.setItem('flagListtemporary',JSON.stringify(this.columns))
            localStorage.setItem('cancelListtemporary',JSON.stringify(this.cancelList))
          })
        }else {
          this.cancelList=this.cancelList.filter(item=>item.val!=selection[2].val)
          this.columns1.forEach((item1,index1)=>{
            if (item1.lab==selection[2].lab){
              if (this.cancelList.length){
                this.cancelList.forEach(item=>{
                  this.xflagList=this.xflagList.filter(mm=>mm.lab!=item.lab)
                  this.xflagList.splice(index1, 0, selection[2])
                  this.columns = this.xflagList
                })
              }else {
                this.columns.splice(index1, 0, selection[2])
              }
              this.columns = this.unique1(this.columns)
              localStorage.setItem('flagListtemporary',JSON.stringify(this.columns))
            }
          })
        }
        localStorage.setItem('selectionTemporary',JSON.stringify(this.selectionDataSortList))
      },
      // 取消禁用
      selectEnable(row, rowIndex){
        return true;
      },
      // 去重
      unique1(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.lab) && res.set(arr.lab, 1))
      },
      // 弹窗关闭
      showdialogT(){
        this.showDialogStemporary=false
      },
      /**
       * @author Nevin
       * @date 2022/8/11
       * @Description: 导入用户信息
       */
      importCustomer() {
        this.upload.title = '临客导入'
        this.upload.open = true
      },
      /**
       * @author Nevin
       * @date 2022/8/10
       * @Description: 下载用户列表模板
       */
      downloadTemplate() {
        this.$api.netPower.importTemplate()
      },
      /**
       * @author Nevin
       * @date 2022/8/11
       * @Description: 提交上传文件
       */
      submitFileForm() {
        // this.$refs.upload.submit()
      },
      /**
       * @author Nevin
       * @date 2022/8/11
       * @Description: 文件上传中处理
       */
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      /**
       * @author Nevin
       * @date 2022/8/11
       * @Description: 文件上传成功处理
       */
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false
        this.upload.isUploading = false
        this.getData()
      },
      /**
       * @author Nevin
       * @date 2022/8/13
       * @Description: 上传失败处理
       */
      handleFileError() {
        this.upload.open = false
        this.upload.isUploading = false
      },
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 关闭弹窗
       */
      handleFileClose() {
        this.upload.open = false
      },
      // 生育情况
      fertility() {
        const fertility = []
        for (let i = 1; i <= 3; i++) {
          const compet = {
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
      // eslint-disable-next-line vue/no-dupe-keys
      exportExcel() {
        //  const data = [
        //    ['name', 'age', 'city'],
        //    ['李磊', 30, 'New York'],
        //    ['Jane', 35, 'London'],
        //    ['Jim', 40, 'Paris']
        //  ]
        // for (let i=0;i<10000;i++){
        //   data.push(['Jim', 40, 'Paris'])
        //  }
        //  this.$worker
        //    .run(
        //      (data) => {
        //        importScripts(location.origin + '/webworker/xlsx.core.min.js')
        //        const ws = XLSX.utils.aoa_to_sheet(data)
        //        const wb = XLSX.utils.book_new()
        //        XLSX.utils.book_append_sheet(wb, ws, 'data')
        //        const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
        //        return buf
        //      },
        //      [data]
        //    )
        //    .then((res) => {
        //      const url = window.URL.createObjectURL(new Blob([res]))
        //      const link = document.createElement('a')
        //      link.href = url
        //      link.download = 'data.xlsx'
        //      link.click()
        //      console.timeEnd('Excel')
        //    })
        if (this.tableData.length === 0) {
          this.$message('打印数据为空')
          return
        }
        this.submitLoading = true
        var data = {}
        for (const k in this.options) {
          if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
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
        // data = Object.assign(data, grossConsumption)
        this.$api.user.customerCmtList(data).then(res => {
          if (res) {
            this.$message({
              message: '稍等一下，马上就好',
              type: 'success'
            })
            this.tableData=res.rows;
          }
        }).finally(() => {
          /* 从表生成工作簿对象 */
  
          export_table_to_excel('#out-table', '临客查询')
          setInterval(() => {
            this.submitLoading = false
          }, 5000)
        })
      },
      // 关闭临客标签
      customLabel() {
        this.customLabelDialog = false
        this.manualForm.form.customerLabelTypeId = ''
        this.manualForm.form.remark = ''
        this.manualForm.form.registerTime = ''
      },
  
      handleCurrentChange(val) {
        this.rowTable = val[1]
      },
      // 预约添加
      appointmentAddition() {
        if (this.selectionData.length < 1||this.selectionData.length>1) {
          this.$message.warning('请选择一条数据')
          return
        }
        /**
         * @author 李尚
         * @date 2022/8/24
         * @Description: 判断顾客是否又预约单信息 如果有就不能预约，
         */
        this.$api.modules.netPower.getUserBookProjectInfo({ id: this.selectionData[0].id }).then(res => {
          if (res) {
            if (res.total > 0) {
              this.$message('选中记录已有预约单信息')
              return
            } else {
              this.$router.push({ path: '/addBuildRecord', query: { id: this.selectionData[0].id } })
            }
          }
        })
      },
      // 点击跳转是否已到院路由
      customerclick(id, val) {
        if (val.isReachCourtyard === '1') {
          const disPlay = 1
          this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, display: disPlay } })
        } else {
          this.$router.push({ path: '/notInHospital', query: { id } })
        }
      },
      // 打开发送短信弹窗
      sendMessage() {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择至少一名顾客')
          return
        }
        this.showSendMessageDialog = true
      },
      // 关闭发送短信弹窗
      closeDialog() {
        this.showSendMessageDialog = false
      },
      // 客户标签
      customerLabelEdit() {
        if (this.selectionData === undefined || this.selectionData[0] === undefined||this.selectionData.length>1) {
          this.$message.warning('请选择一条数据')
          return
        }
        this.$set(this.selectionData[0], 'customerType', '1')
        this.getUserLabelInfo(this.selectionData[0].id)
      },
      // 获取顾客标签
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
      // 顾客标签选择
      labelTypeSelection(selection) {
        this.manualForm.form.GuestLabel = undefined
        this.customerLabelTypeChildData = []
        const data = this.customerLabelTypeData.filter(filter => {
          return filter.customerLabelTypeId === selection
        })
        this.customerLabelTypeChildData = data[0].customLabelData
      },
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
        this.$api.modules.netPower.deleteCustomerLabel(row.customerLabelId).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.getUserLabelInfo(this.selectionData[0].id)
          }
        })
      },
      /**
       * @author Nevin
       * @date 2022/5/10
       * @Description: 表格单选
       */
      handleSelectionChange(e) {
        // this.selectionData = []
        // if (e[1].length > 1) {
        //   this.$refs.table.$refs.multipleTable.clearSelection()
        //   this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
        // }
        // this.selectionData.push(e[1].pop())
        // this.$delete(this.selectionData, 1)
        // this.selectionData = !this.selectionData[0] ? [] : this.selectionData
        this.selectionData = e[1]
  
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
        this.deptId = val
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
              this.options.channel.options.splice(0, 0, res.data)
            } else {
              this.options.channel.options = []
              this.options.channel.values = []
            }
          }
        })
      },
      // 打开高级选项
      setInnerDialog() {
        this.innerDialog = true
        this.showManualDialog = false
      },
      // 关闭手工上报
      closeShowManualDialog() {
        this.showManualDialog = false
      },
      // 关闭
      closeInnerDialog() {
        this.innerDialog = false
      },
      // 打开手工上报弹窗
      openManualDialog() {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择至少一条数据')
          return
        }
        this.showManualDialog = true
  
  
  
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
      addCustomerLabelTypeToTable() {
        if (this.manualForm.form.GuestLabel === undefined || this.manualForm.form.customerLabelTypeId === undefined) {
          this.$message.error('请先选择标签类型和标签')
          return
        }
        const type = this.customerLabelTypeData.filter(filter => {
          return filter.customerLabelTypeId === this.manualForm.form.customerLabelTypeId
        })
        this.manualForm.form.labelTypeName = type[0].labelTypeName
  
        const label = this.customerLabelTypeChildData.filter(filter => {
          return filter.customerLabelTypeId === this.manualForm.form.GuestLabel
        })
        this.manualForm.form.labelDataName = label[0].labelTypeName
  
        let flag = true
        this.manualFormTableData.forEach(item => {
          if (item.GuestLabel === this.manualForm.form.GuestLabel) {
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
          GuestLabel: undefined,
          customerLabelTypeId: undefined,
          labelTypeName: undefined,
          labelDataName: undefined,
          registerTime: undefined,
          remark: undefined
        }
        this.customerLabelTypeChildData = []
      },
      // 修改列表
      handlecompile() {
        if (this.selectionData.length < 1||this.selectionData.length>1) {
          this.$message.warning('请选择一条数据')
          return
        }
        this.$router.push({ path: '/ReturnVisitRecordList', query: { id: this.selectionData[0].id} })
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
      // 搜索栏表格多选
      /**
       * @author 李尚
       * @date 2022/6/17
       * @Description: 人员添加公司Id  添加状态
       */
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
            const arr1 = this.unique(res.data)
            this.sysUserList = arr1
            // ---------岗位------
            // 医生
            res.data.forEach(item => {
              if (item.postCode === 'doctor') {
                this.doctor.push(item)
              }
            })
            // ---------------------
            // 洗浴师
            res.data.forEach(item => {
              if (item.postCode === 'therapeutist') {
                this.Bath.push(item)
              }
            })
            // ---------------------
            // 产康
            res.data.forEach(item => {
              if (item.postCode === 'chks') {
                this.Chankang.push(item)
              }
            })
            // ---------------------
            // 美学顾问
            res.data.forEach(item => {
              if (item.postCode === 'xczxs') {
                this.esthetics.push(item)
              }
            })
            this.options.visituserId.options = arr1
            this.options.onlineUserId.options = arr1
            this.options.createuserId.options = arr1
            this.options.refereeuserId.options = arr1
          }
        })
      },
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
      // 获取数据
      getData: debounce(function (isSearch) {
        var data = {}
        for (const k in this.options) {
          if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
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
      rowClassName({ row,rowIndex }) {
        if (row.isReachCourtyard === '1') {
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
    border: 1px solid transparent;
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
        left: 0px;
        border-radius: 10px;
        content: "";
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
  
  span {
    color: #999;
  }
  
  //::v-deep thead .el-table-column--selection .cell {
  //  display: none;
  //}
  
  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: 15px !important;
    padding-right: 10px !important;
  }
  ::v-deep .el-input__icon {
    width: 10px !important;
  }
  </style>
  <style>
  .el-table .success-row {
    background-color: #7ec5b7;
  }
  .el-table .nomal-row {
    background-color: #eee;
  }
  
  .el-input__prefix {
    display: none;
  }
  </style>
  