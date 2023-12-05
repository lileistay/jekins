<template>
  <!-- 来院查询 -->
  <div class="container">

    <slideSearch   :options="options">
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
        <el-button
          v-has-permi="['confinement:customerCmt:exportly']"
          size="mini"
          type="success"
          icon="el-icon-search"
          plain
          :loading="submitLoading"
          @click="exportExcel"
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
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          :cell-class-name="cellClassName"
          :row-class-name="rowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">信息统计
              <el-button
                size="mini"
                icon="el-icon-search"
                type="primary"
                plain
                @click="Statistics"
              >统计
              </el-button>
            </div>
            <div>
              <ul>
                <li>
                  (点击统计获取信息)
                </li>
                <li>
                  总开单业绩：{{ transactionMoney }}
                </li>
                <li>
                  总人数：{{ totalNumber }}
                </li>
                <li>
                  成交人数：{{ transactions }}
                </li>
                <li>
                  新客首次：{{ newCustomersOne }}
                </li>
                <li>
                  新客二次：{{ newCustomersTwo }}
                </li>
                <li>
                  新客：{{ newCustomers }}
                </li>
                <li>
                  老客：{{ lodCustomers }}
                </li>
              </ul>
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px;"><i style="cursor:pointer" class="el-icon-s-fold" @click="getDialogSChospital"/> 列表清单</span>
            <span style="margin-left: 10px; margin-right:10px;font-size: 14px"><i class="color-block-success" />成交</span>
            <span style="font-size: 14px"><i class="color-block-default" />未成交</span>
            <el-button
              v-hasPermi="['sysManger:dept:Handmade']"
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
            <!--            >批量发送短信-->
            <!--            </el-button>-->
            <el-button
              v-has-permi="['sysManger:dept:label']"
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit-outline"
              class="headerBarBtn"
              @click.stop="addLabel"
            >客户标签
            </el-button>
          </div>
          <!--  字段显示对应显示接口-->
          <template #custom="data">
            <div v-if="data.props === 'isDeal'">
              <show-dict-data :options="dict.type.whether_deal" :value="data.custom.isDeal" />
            </div>
            <div v-if="data.props === 'isSecondary'">
              <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
            </div>
            <!--  是否下单-->
            <div v-else-if="data.props === 'customerStatus'">
              <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <div v-else-if="data.props === 'marriageType'">
              <show-dict-data :options="dict.type.marital_status" :value="data.custom.marriageType" />
            </div>
            <div v-else-if="data.props === 'degreeIntention'">
              <show-dict-data :options="dict.type.degree_intention_list" :value="data.custom.degreeIntention" />
            </div>
            <div v-else-if="data.props === 'relation'">
              <show-dict-data :options="dict.type.mutual_relationship" :value="data.custom.relation" />
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
                    <el-select
                      v-model="manualForm.userInfo.customSex"
                      class="full-width"
                      placeholder="请选择性别"
                      filterable
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
                      @change="labelTypeSelection"
                      filterable
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
                      v-model="manualForm.form.GuestLabel"
                      class="full-width"
                      placeholder="请选择标签"
                      filterable
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
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </sg-dialog>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      :flagnew="true"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
      @selectAllpeople="selectAllpeople"
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
        <div v-if="data.props === 'isDeal'">
          <show-dict-data :options="dict.type.whether_deal" :value="data.custom.isDeal" />
        </div>
        <div v-if="data.props === 'isSecondary'">
          <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
        </div>
        <!--  是否下单-->
        <div v-else-if="data.props === 'customerStatus'">
          <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
        </div>
        <div v-else-if="data.props === 'marriageType'">
          <show-dict-data :options="dict.type.marital_status" :value="data.custom.marriageType" />
        </div>
        <div v-else-if="data.props === 'degreeIntention'">
          <show-dict-data :options="dict.type.degree_intention_list" :value="data.custom.degreeIntention" />
        </div>
        <div v-else-if="data.props === 'relation'">
          <show-dict-data :options="dict.type.mutual_relationship" :value="data.custom.relation" />
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
      <!--  列表排序弹框    -->
      <Dsort :drow_table="'Laiyuan'"
             :showDialogS="showDialogSChospital"
             @showdialogT="showdialogT"
             :sortList="columns1"
             :selectEnable="selectEnable"
             ref="Chospital"
             :itemHandleSelectionChange="itemHandleSelectionChange"
      >

      </Dsort>
  </div>
</template>

<script>
/**
  * @author 李尚
  * @date 16/5/2022
  * @Description: 所调接口都是临客查询里面的
*/
// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import area from '@/utils/area'
import { math } from '@/utils/math.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import {newgetData,todayTime} from '@/utils/time'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import SendMessage from '@/components/SendMessage'
import { debounce } from '@/utils/throttleAndDebounce'
import moment from 'moment'
import Dsort from '@/components/Dsort'
import Sortable from 'sortablejs' //排序拖拽
export default {
  name: 'BookFormQuery',
  dicts: ['marital_status', 'hospat_yn', 'whether_Newguest', 'mutual_relationship', 'degree_intention_list', 'whether_secondary', 'whether_deal', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'whether_deal', 'whether_Newguest', 'sys_user_sex'],
  components: {
    SendMessage,
    ManualSubmission,
    SgDialog,
    SgTable,
    slideSearch,
      Dsort
  },
  data() {
    return {
      istrue:false,
      Action: {},
      tableDatas: [],
      submitLoading: false,
      // 统计
      transactionMoney: '暂无', // 总开单业绩
      totalNumber: '暂无', // 总人数
      transactions: '暂无', // 成交人数
      newCustomersOne: '暂无', // 新客首次
      newCustomersTwo: '暂无', // 新客二次
      newCustomers: '暂无', // 新客
      lodCustomers: '暂无', // 老客
      // 客户标签
      customLabelDialog: false,
      // 手工上报表单
      manualFormLoading: false,
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
      // 多选数据
      selectionData: [],
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 统计
      statisticsData: {},
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
          lab: '是否成交',
          val: 'isDeal',
          custom: 'isDeal'
        },
        {
          lab: '顾客状态',
          val: 'customerStatus',
          custom: 'customerStatus'
        },
        {
          lab: '二次来院',
          val: 'isSecondary',
          custom: 'isSecondary'
        },
        {
          lab: '顾客',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '访客ID',
          val: 'visitorId',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '网电建档人',
          val: 'createuserName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '项目需求',
          val: 'reservedItems',
          width: 160,
          showOverflowTooltip: true
        },
        {
          lab: '实付款',
          val: 'paidAmount'
        },
        {
          lab: '应付款',
          val: 'amountPayable'
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          width: 165
        },
        {
          lab: '媒介',
          val: 'channelName',
          width: 160
        },
        {
          lab: '建档类型',
          val: 'typeThreeName',
          width: 142,
          showOverflowTooltip: true
        },
        // {
        //   lab: '美容院类型',
        //   val: 'refereePhone',
        //   width: 120
        // },
        // {
        //   lab: '美容院名称',
        //   val: 'refereePhone',
        //   width: 120
        // },
        {
          lab: '网电回访人',
          val: 'visituserName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 140
        },
        {
          lab: '建档人',
          val: 'createBy',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '接待时间',
          val: 'receptionTime',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '接诊单编号',
          val: 'receptionNumber',
          width: 140,
          showOverflowTooltip: true
        },
        // {
        //   lab: '预约单编号',
        //   val: 'reservationNumber',
        //   width: 140
        // },
        {
          lab: '咨询意向度',
          val: 'degreeIntention',
          width: 140,
          custom: 'degreeIntention',
          showOverflowTooltip: true
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 120
        },
        {
          lab: '推荐人',
          val: 'refereeuserName',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '推荐关系',
          val: 'relation',
          width: 100,
          custom: 'relation'
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165,
          showOverflowTooltip: true
        },
        {
          lab: 'QQ',
          val: 'qq',
          width: 120
        },
        {
          lab: '微信',
          val: 'wechat',
          width: 120,
          showOverflowTooltip: true
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
          lab: '员工推荐人',
          val: 'refereeName',
          width: 100,
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
                lab: '是否成交',
                val: 'isDeal',
                custom: 'isDeal'
            },
            {
                lab: '顾客状态',
                val: 'customerStatus',
                custom: 'customerStatus'
            },
            {
                lab: '二次来院',
                val: 'isSecondary',
                custom: 'isSecondary'
            },
            {
                lab: '顾客',
                val: 'customerName',
                custom: 'customerName'
            },
            {
                lab: '电话',
                val: 'customPhone',
                width: 120
            },
            {
                lab: '访客ID',
                val: 'visitorId',
                width: 120,
                showOverflowTooltip: true
            },
            {
                lab: '线上客服',
                val: 'onlineUserName',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '网电建档人',
                val: 'createuserName',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '项目需求',
                val: 'reservedItems',
                width: 160,
                showOverflowTooltip: true
            },
            {
                lab: '实付款',
                val: 'paidAmount'
            },
            {
                lab: '应付款',
                val: 'amountPayable'
            },
            {
                lab: '收费单编号',
                val: 'orderNumber',
                width: 165
            },
            {
                lab: '媒介',
                val: 'channelName',
                width: 160
            },
            {
                lab: '建档类型',
                val: 'typeThreeName',
                width: 142,
                showOverflowTooltip: true
            },
            // {
            //   lab: '美容院类型',
            //   val: 'refereePhone',
            //   width: 120
            // },
            // {
            //   lab: '美容院名称',
            //   val: 'refereePhone',
            //   width: 120
            // },
            {
                lab: '网电回访人',
                val: 'visituserName',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '美学顾问',
                val: 'acName',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '医生',
                val: 'doctorName',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '建档时间',
                val: 'createTime',
                width: 140
            },
            {
                lab: '建档人',
                val: 'createBy',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '接待时间',
                val: 'receptionTime',
                width: 140,
                showOverflowTooltip: true
            },
            {
                lab: '结账时间',
                val: 'checkoutTime',
                width: 140,
                showOverflowTooltip: true
            },
            {
                lab: '接诊单编号',
                val: 'receptionNumber',
                width: 140,
                showOverflowTooltip: true
            },
            // {
            //   lab: '预约单编号',
            //   val: 'reservationNumber',
            //   width: 140
            // },
            {
                lab: '咨询意向度',
                val: 'degreeIntention',
                width: 140,
                custom: 'degreeIntention',
                showOverflowTooltip: true
            },
            {
                lab: '科室',
                val: 'departmentName',
                width: 120
            },
            {
                lab: '推荐人',
                val: 'refereeuserName',
                width: 100,
                showOverflowTooltip: true
            },
            {
                lab: '推荐关系',
                val: 'relation',
                width: 100,
                custom: 'relation'
            },
            {
                lab: '客户卡号',
                val: 'customCardNumber',
                width: 165,
                showOverflowTooltip: true
            },
            {
                lab: 'QQ',
                val: 'qq',
                width: 120
            },
            {
                lab: '微信',
                val: 'wechat',
                width: 120,
                showOverflowTooltip: true
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
                lab: '员工推荐人',
                val: 'refereeName',
                width: 100,
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
        receptionTime: {
          type: 'Tdatetime',
          label: '接待时间',
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
          label: '电话'
        },
        grossConsumption: {
          type: 'Tinput',
          label: '消费金额',
          clearable: true,
          values: []
        },
        customerStatus: {
          type: 'select',
          label: '客户状态',
          clearable: true,
          options: []
        },
        isDeal: {
          type: 'select',
          label: '是否成交',
          clearable: true,
          options: []
        },
        departmentId: {
          type: 'select',
          label: '科室',
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
        crfDepartmentId: {
          type: 'select',
          label: '预约一级项目:',
          options: [],
          values: '',
          clearable: true
        },
        crfProjectTypeId: {
          type: 'select',
          label: '预约二级项目:',
          options: [],
          values: '',
          clearable: true
        },
        crfBookingPeojectId: {
          type: 'select',
          label: '预约三级项目:',
          options: [],
          values: '',
          clearable: true
        },
        departmentName: {
          type: 'input',
          label: '预约一级项目名称',
          clearable: true,
          options: []
        },
        projectTypeName: {
          type: 'input',
          label: '预约二级项目名称',
          clearable: true,
          options: []
        },
        categoryName: {
          type: 'input',
          label: '预约三级项目名称',
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
        // label: {
        //   type: 'select',
        //   label: '客户标签',
        //   clearable: true,
        //   options: []
        // },
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        // 无
        // xian: {
        //   type: 'select',
        //   label: '线上客服部门',
        //   clearable: true,
        //   options: []
        // },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        createuserId: {
          type: 'select',
          label: '网电建档人',
          clearable: true,
          options: []
        },
        visituserId: {
          type: 'select',
          label: '网电回访人',
          clearable: true,
          options: []
        },
        isSecondary: {
          type: 'select',
          label: '是否二次来院',
          clearable: true,
          options: []
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
        // yuan: { // 无
        //   type: 'select',
        //   label: '美容院类型',
        //   clearable: true,
        //   options: []
        // },
        // // 无
        // rong: {
        //   type: 'select',
        //   label: '美容院',
        //   clearable: true,
        //   options: []
        // },
        qq: {
          type: 'input',
          label: 'QQ号码'
        },
        wechat: {
          type: 'input',
          label: '微信号码'
        },
        visitorId: {
          type: 'input',
          label: '访客ID'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号'
        },
        customSex: {
          type: 'select',
          label: '性别',
          clearable: true,
          options: []
        },
        refereeuserId: {
          type: 'select',
          label: '员工推荐人',
          clearable: true,
          options: []
        }
        // 无
        // customerTransactionStatus: {
        //   type: 'select',
        //   label: '客户成交状态',
        //   clearable: true,
        //   options: []
        // },

      },
      rowTable: undefined,
        // 排序弹框
        showDialogSChospital:false,
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
      this.getChannelInfo()
      this.customerLabelType()
      this.deptFilingList()
      this.Department()
      this.getData()
      this.getUserList(val)
    },
    // 媒介
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
      this.columns = JSON.parse(localStorage.getItem('flagListChospital'))?JSON.parse(localStorage.getItem('flagListChospital')):this.columns
      this.columns1 = JSON.parse(localStorage.getItem('sortListChospital'))?JSON.parse(localStorage.getItem('sortListChospital')):this.columns1
      this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionChospital'))?JSON.parse(localStorage.getItem('selectionChospital')):this.selectionDataSortList
      this.cancelList = JSON.parse(localStorage.getItem('cancelListChospital'))?JSON.parse(localStorage.getItem('cancelListChospital')):this.cancelList
      this.deptId = this.$store.getters.departmentId
    this.getData()
    this.getUserList(this.deptId)
    this.deptFilingList()
    // this.customerLabelTypes()
    this.customerLabelType()
    this.getChannelInfo()
    this.getDepartmentOne()
    this.Department()// 获取科室的列表
    this.areaArr.forEach(item => {
      item.value = item.name
      item.label = item.name
    })
    this.options.province.options = this.areaArr
    this.options.customSex.options = this.dict.type.sys_user_sex
    this.options.isSecondary.options = this.dict.type.whether_secondary // 是否二次
    this.options.isDeal.options = this.dict.type.whether_deal // 是否成交
    this.options.customerStatus.options = this.dict.type.whether_Newguest // 客户状态
    // this.options.isReachCourtyard.options = this.dict.type.whether
    // this.options.appointment.options = this.dict.type.whether // 是否下单
    // this.options.occupation.options = this.dict.type.occupation
    // this.options.economicCapacity.options = this.dict.type.economic_capacity
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
      data = Object.assign(data)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = true
      this.$api.netPower.AdmissionList(data).then(res => {
        if (res) {
          this.selectionData = res.rows
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
      // 弹出顺序弹框
      getDialogSChospital(){
              this.showDialogSChospital=true
              if (this.selectionDataSortList.length){
                  this.columns.forEach(item=>{
                      this.columns1.forEach(items=>{
                          if (item.lab==items.lab){
                              this.$nextTick(()=>{
                                  this.$refs.Chospital.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
                              })
                          }
                      })
                  })
              }else {
                  this.$nextTick(()=>{
                      this.$refs.Chospital.$refs.sortRef.$refs.sortRefs.toggleAllSelection()
                  })
              }
              this.$nextTick(() => {
                  this.rowDrop()
              })
      },
      // 在行拖拽的方法进行querySelector的查找时，需对查询到dialog的el-table的类中
      rowDrop() {
          let tbody = document.querySelector('.Laiyuan .el-table__body-wrapper tbody')
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
                  localStorage.setItem('sortListChospital',JSON.stringify(_this.columns1))
                  localStorage.setItem('flagListChospital',JSON.stringify(_this.columns))
              }
          })
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
          this.showDialogSChospital=false
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
                  localStorage.setItem('flagListChospital',JSON.stringify(this.columns))
                  localStorage.setItem('cancelListChospital',JSON.stringify(this.cancelList))
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
                      localStorage.setItem('flagListChospital',JSON.stringify(this.columns))
                  }
              })
          }
          localStorage.setItem('selectionChospital',JSON.stringify(this.selectionDataSortList))
      },
    exportExcel() {
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
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
      data = Object.assign(data)
      this.$set(data, 'deptId', this.deptId)
      this.$api.netPower.AdmissionList(data).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '来院查询')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    cellClassName({ row, rowIndex }) {
      if (row.isDeal === '1') {
        return 'warning-row'
      } else if (row.isDeal === '2') {
        return 'success-row'
      }
      return ''
    },
    // 关闭临客标签
    customLabel() {
      this.customLabelDialog = false
      this.manualForm.form.customerLabelTypeId = ''
      this.manualForm.form.remark = ''
      this.manualForm.form.registerTime = ''
    },
    addLabel() {
      if (this.selectionData.length < 1||this.selectionData.length>1) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.$set(this.selectionData[0], 'customerType', this.selectionData[0].isDeal)
      this.getUserLabelInfo(this.selectionData[0].id)
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
    // 顾客标签选择
    labelTypeSelection(selection) {
      this.manualForm.form.GuestLabel = undefined
      this.customerLabelTypeChildData = []
      const data = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === selection
      })
      this.customerLabelTypeChildData = data[0].customLabelData
    },
    // 获取科室的列表
    Department() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.netPower.projectTreeselect(data).then(res => {
        if (res) {
          res.data.forEach((item) => {
            item.value = item.departmentId
            item.label = item.departmentName
          })
          this.options.departmentId.options = res.data
          this.TriageDepartment = res.data
          this.OneprojectList = res.data
        }
      })
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData(true)
        }
      }
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 统计信息
    Statistics() {
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
      data = Object.assign(data, this.pagination)
      this.$set(data, 'deptId', this.deptId)
      this.$api.netPower.selectQueryStatisticsHospital(data).then(res => {
        if (res) {
          this.transactionMoney = res.data.transactionMoney
          this.totalNumber = res.data.totalNumber
          this.transactions = res.data.transactions
          this.newCustomersOne = res.data.newCustomersOne
          this.newCustomersTwo = res.data.newCustomersTwo
          this.newCustomers = res.data.newCustomers
          this.lodCustomers = res.data.lodCustomers
        }
      })
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      // if (val.paidAmount > 0) {
      //   this.customerStatus = 2
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
      // } else {
      //   this.customerStatus = 1
      //   this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
      // }
      // if (val.isReachCourtyard === '1') {
      // } else {
      //   this.$router.push({ path: '/notInHospital', query: { id }})
      // }
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
    // 获取顾客标签
    customerLabelTypes() {
      this.$api.modules.custLabel.custLabelTypeList().then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.value = item.customerLabelTypeId
            item.label = item.labelTypeName
          })
          this.options.label.options = res.rows
        }
      })
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
      this.selectionData = e[1]
      // this.selectionData = []
      // if (e[1].length > 1) {
      //   this.$refs.table.$refs.multipleTable.clearSelection()
      //   this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      // }
      // this.selectionData.push(e[1].pop())
      // this.$delete(this.selectionData, 1)
      // this.selectionData = !this.selectionData[0] ? [] : this.selectionData
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
    getChannelInfo() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
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
      this.Action = this.selectionData[0]
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
          // 线上客服
          res.data.forEach(item => {
            if (item.postCode === 'wdzxs') {
              this.options.onlineUserId.options.push(item)
              this.options.visituserId.options.push(item) // 网电回访人
            }
          })
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.aestheticConsultant.options.push(item)
            }
          })
          // 网电建档人
          const arr1 = this.unique(res.data)
            this.options.refereeuserId.options = arr1
          this.options.createuserId.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取顾客标签
    customerLabelType() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.custLabel.customerLabelType(data).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      this.istrue=true
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
      this.$api.netPower.AdmissionList(data).then(res => {
        if (res) {
          this.istrue=false
          this.tableData = res.rows
          this.pagination.total = res.total
          let all = 0
          res.rows.forEach(item => {
            if (item.paidAmount === undefined) {
              item.paidAmount = 0
            }
            all = math.add(all, item.paidAmount).toFixed(2)
          })
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    rowClassName({ row,rowIndex }) {
      if (row.isReachCourtyard === '1') {
        return 'success-row'
      }
      if(rowIndex%2==0){
        return  'normal-row'
      }
      return ''
    },
    // 预约项目 1 2 3 级
    getDepartmentOne() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
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
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
<style>
.el-table .success-row {
  background-color: #7ec5b7;
}
.el-table .normal-row {
  background-color: #eee;
}

.el-input__prefix{
  display: none;
}
::v-deep .el-table .warning-row {
  background: #ffffff;
}

::v-deep .el-table .success-row {
  background: #7ec5b7;
}
</style>
