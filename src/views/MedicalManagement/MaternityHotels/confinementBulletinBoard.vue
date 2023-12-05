<template>
  <el-scrollbar>
    <div class="header">
      <slideSearch :options="options" :style="{height:height}">
        <div slot="btnBar">
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getRoomList(true)"
            @keydown.enter.native="getRoomList(true)"
          >查询
          </el-button>
        </div>
        <div  class="right">
          <div class="tips">
            <span class="check" /><span>已入住</span>
            <span class="appointment" /><span>已预约</span>
            <!--          <span class="free" /><span>空闲</span>-->
          </div>
          <div v-for="(items, indexs) in roomList" :key="indexs" class="rooms">
            <div>
              <el-card class="otherRoomCard">
                <div class="room">
                  <img src="../../../assets/images/room4.png" width="25" height="25">
                </div>
                <p style="padding-top: 3px;">
                  <span>{{ items.roomName }}</span>
                  <span>类型：{{ items.roomType }}</span>
                  <span>{{ items.roomNumber }}</span>
                </p>
                <div style="float: right; margin-top: -25px">
                  <div class="lookForMonth_top">
                    <div class="selectDate">
                      <div style="font-weight: bold">
                        {{ items.year }}
                        <span style="border-right: 1px solid gainsboro;margin-right: 5px" />
                        {{ items.month }}
                      </div>
                      <div class="upDownSelect">
                        <!--                      <div class="upDownSelect_item" @click="dateUp(items)" />-->
                        <!--                      <div class="upDownSelect_item" @click="dateDown(items)" />-->
                        <div>
                          <span class="upDown" @click="dateUp(items)"><i class="el-icon-caret-left" /></span>
                          <span class="upDown" @click="dateDown(items)"><i class="el-icon-caret-right" /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="calendar" style="height: 230px">
                  <div
                    v-for="(item,index) in items.calendarData.slice(0, 21)"
                    :key="index"
                    class="calendar_item"
                    :class="{ash:item.color==='ash',date:index>6&&item.color!=='ash'}"
                    @click="roomInfo(items, item)"
                  >
                    <p class="dateEdit">
                      {{ item.label }}
                    </p>
                    <div style="text-align: center; font-size: 12px; color: gainsboro">
                      <div v-if="index>6&&item.checkStatus==='1'" class="appointment" />
                      <div v-if="index>6&&item.checkStatus==='1'">预约</div>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: gainsboro">
                      <div v-if="index>6&&item.checkStatus==='2'" class="check" />
                      <div v-if="index>6&&item.checkStatus==='2'">入住</div>
                    </div>
                  </div>
                </div>
                <div class="footer" @click="showAllCard(items)">
                  —————————
                  <i class="el-icon-arrow-down" />
                  —————————
                </div>
              </el-card>
            </div>
            <div v-show="items.allCard" style="z-index: 9999;position: absolute;top: 42px;right: 35%;left:35%;width: 600px">
              <el-card class="roomCard">
                <div class="room">
                  <img src="../../../assets/images/room4.png" width="25" height="25">
                </div>
                <p style="padding-top: 3px;">
                  <span>{{ items.roomName }}</span>
                  <span>类型：{{ items.roomType }}</span>
                </p>
                <div style="float: right; margin-top: -25px">
                  <div class="lookForMonth_top">
                    <div class="selectDate">
                      <div style="font-weight: bold">
                        {{ items.year }}
                        <span style="border-right: 1px solid gainsboro;margin-right: 5px" />
                        {{ items.month }}
                      </div>
                      <div class="upDownSelect">
                        <!--                      <div class="upDownSelect_item" @click="dateUp(items)" />-->
                        <!--                      <div class="upDownSelect_item" @click="dateDown(items)" />-->
                        <div>
                          <span class="upDown" @click="dateUp(items)"><i class="el-icon-caret-left" /></span>
                          <span class="upDown" @click="dateDown(items)"><i class="el-icon-caret-right" /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="calendar">
                  <div
                    v-for="(item,index) in items.calendarData"
                    :key="index"
                    class="calendar_item"
                    style="width: 82px;height: 75px"
                    :class="{ash:item.color==='ash',date:index>6&&item.color!=='ash'}"
                    @click="roomInfo(items, item)"
                  >
                    <p class="dateEdit">
                      {{ item.label }}
                    </p>
                    <div style="text-align: center; font-size: 12px; color: gainsboro">
                      <div v-if="index>6&&item.checkStatus==='1'" class="appointment" />
                      <div v-if="index>6&&item.checkStatus==='1'">预约</div>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: gainsboro">
                      <div v-if="index>6&&item.checkStatus==='2'" class="check" />
                      <div v-if="index>6&&item.checkStatus==='2'">入住</div>
                    </div>
                  </div>
                </div>
                <div class="footer" style="margin-top: 5px" @click="showAllCard(items)">
                  —————————
                  <i class="el-icon-arrow-up" />
                  —————————
                </div>
              </el-card>
            </div>
          </div>
          <div class="block">
            <el-pagination
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
          </div>
        </div>
      </slideSearch>
      <transition name="fade">
        <div v-if="mask" class="mask" @click="closeAllCard" />
      </transition>
      <sgDialog title="顾客预约入住" size="85%" out-top="2%" :dialog="showDialog" @handleClose="closeRoomDialog">
        <div slot="out">
          <div class="tabsb">
            <el-row>
              <el-col :span="14">
                <el-card style="height: 745px">

                  <sg-table
                    ref="table"

                    :sg-ref="'multipleTable'"
                    :table-data="customerData"
                    :pagination="customPagination"
                    :columns="columns"
                    index="序号"
                    selection
                    size="mini"
                    max-height="650"
                    @size-change="customSizeChange"
                    @current-change="change"
                    @row-click="rowClick"
                    @selection-change="handleSelectionChange"

                  >
                    <div slot="searchBar">
                      <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
                        <el-form-item v-if="!search" label="姓名" prop="customerName">
                          <el-input style="width:160px;" v-model="searchBar.customerName" clearable placeholder="请输入姓名" />
                        </el-form-item>
                        <el-form-item v-if="!search" label="卡号" prop="customCardNumber">
                          <el-input style="width:160px;" v-model="searchBar.customCardNumber" clearable placeholder="请输入卡号" />
                        </el-form-item>
                        <el-form-item v-if="!search" label="电话" prop="customPhone">
                          <el-input style="width:160px;"  v-model="searchBar.customPhone" clearable placeholder="请输入电话" />
                        </el-form-item>
                        <el-form-item v-if="search" label="接待时间:" prop="receptionTime">
                          <el-date-picker

                            v-model="searchBar.receptionTime"
                            style="width:180px"
                            :clearable="true"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                          />
                        </el-form-item>
                        <el-form-item>
                          <el-button icon="el-icon-search" type="primary" :disabled="btnDisabled" @click.stop="getCustomerInfo(true)">搜索</el-button>
                          <el-button  type="text" v-if="!search" @click="changeTime">时间查询</el-button>
                          <el-button  type="text" v-if="search" @click="changeTime1">其他信息查询</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </sg-table>
                </el-card>
              </el-col>
              <el-col :span="10" style="padding-left: 20px">
                <el-card style="height: 745px">
                  <el-form ref="roomForm" :model="roomForm" :rules="roomFormRules" size="mini" label-width="110px">
                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">月子房间信息</span>
                    <el-row style="margin-top: 20px">
                      <el-col :span="12">
                        <el-form-item label="楼层">
                          <el-input v-model="roomForm.floorNumber" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="房间类型">
                          <el-input v-model="roomForm.roomType" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="房间编号">
                          <el-input v-model="roomForm.roomNumber" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="房间名称">
                          <el-input v-model="roomForm.roomName" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="默认天数">
                          <el-input v-model="roomForm.defaultDays" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="默认费用">
                          <el-input v-model="roomForm.defaultCharge" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">
                    客户信息
                    <span style="font-size: 14px;font-weight: 400;color: #1fa087">(点击左侧客户选择)</span>
                  </span>
                    <el-row style="margin-top: 20px">
                      <el-col :span="12">
                        <el-form-item label="姓名" prop="customerName">
                          <el-input v-model="roomForm.customerName" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="电话" prop="customPhone">
                          <el-input v-model="roomForm.customPhone" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="卡号" prop="customCardNumber">
                          <el-input v-model="roomForm.customCardNumber" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="年龄" prop="customAge">
                          <el-input v-model="roomForm.customAge" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="roomForm.roomReservationId !== undefined">
                      <el-col :span="12">
                        <el-form-item label="预计入住时间" prop="checkReservationTime">
                          <el-input v-model="roomForm.checkReservationTime" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="预约天数" prop="roomDays">
                          <el-input v-model="roomForm.roomDays" disabled size="mini" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <span style="font-size: 15px; font-weight: 600; padding-left: 20px">预约入住信息</span>
                    <el-row style="margin-top: 20px">
                      <el-col :span="24">
                        <el-form-item label="预约/入住" prop="checkStatus">
                          <el-radio-group v-model="roomForm.checkStatus" :disabled="checkDisabled">
                            <el-radio label="1">
                              预约
                            </el-radio>
                            <el-radio label="2">
                              入住
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="roomForm.checkStatus === '1'">
                      <el-col :span="12">
                        <el-form-item label="现场咨询" prop="aestheticConsultant">
                          <el-select v-model="roomForm.aestheticConsultant" disabled filterable placeholder="请选择" style="width: 100%">
                            <el-option
                              v-for="item in sysUserList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="预计入住时间" prop="checkReservationTime">
                          <el-date-picker
                            v-model="roomForm.checkReservationTime"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="roomForm.checkStatus === '1'">
                      <el-col :span="12">
                        <el-form-item label="预约天数" prop="roomDays">
                          <el-input
                            disabled
                            v-model="roomForm.roomDays"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="roomForm.checkStatus === '2'">
                      <el-col :span="12">
                        <el-form-item label="现场咨询" prop="aestheticConsultant">
                          <el-select v-model="roomForm.aestheticConsultant" disabled filterable placeholder="请选择" style="width: 100%">
                            <el-option
                              v-for="item in sysUserList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="责任护士" prop="nurse">
                          <el-select v-model="roomForm.nurse" filterable placeholder="请选择" style="width: 100%">
                            <el-option
                              v-for="item in zerennurse"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="roomForm.checkStatus === '2'">
                      <el-col :span="12">
                        <el-form-item label="责任月嫂" prop="maternityMatron">
                          <el-select v-model="roomForm.maternityMatron" filterable placeholder="请选择" style="width: 100%">
                            <el-option
                              v-for="item in yuesao"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="产康师" prop="chanKangShi">
                          <el-select v-model="roomForm.chanKangShi" filterable placeholder="请选择" style="width: 100%">
                            <el-option
                              v-for="item in Chankang"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="roomForm.checkStatus === '2'">
                      <el-col :span="12">
                        <el-form-item label="入住时间" prop="checkReservationTime">
                          <el-date-picker
                            v-model="roomForm.checkReservationTime"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="入住天数" prop="roomDays">
                          <el-input
                            v-model="roomForm.roomDays"
                            disabled
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="客户禁忌" prop="remark">
                          <el-input v-model="roomForm.remark" size="mini" type="textarea" :rows="4" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item>
                      <el-button type="primary" :loading="loadingSubmit" @click.stop="submitRoomForm">确定</el-button>
                      <!--                    <el-button type="primary" :loading="loadingSubmit" @click.stop="submitRoomFormBilling">确定并开单</el-button>-->
                      <el-button @click="closeRoomDialog">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-col>
            </el-row>
          </div>

        </div>
      </sgDialog>
      <sgDialog title="请选择顾客购买订单" size="600px" :dialog="showBillingDataDialog" @handleClose="closeBillingDialog">
        <div slot="out">
          <sg-table
            ref="billingTable"
            :sg-ref="'multipleBillingTable'"
            :table-data="billingData"
            :pagination="billingPagination"
            :columns="billingColumns"
            :hide-search-bar="true"
            index="序号"
            selection
            size="mini"
            max-height="350"
            @row-click="billingRowClick"
            @selection-change="billingSelectionChange"
          />
          <el-form size="mini" style="margin: 10px 0 0 20px">
            <el-form-item>
              <el-button type="primary" @click.stop="submitBillingForm">确定</el-button>
              <el-button @click="closeBillingDialog">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
    </div>
  </el-scrollbar>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import { monthData } from '@/utils/time'
import { math } from '@/utils/math'
import SgDialog from '@/components/Dialog'
import SgTable from '@/components/Table'
import moment from 'moment'
import {todayTime,newgetData} from "../../../utils/time";
export default {
  components: { SgDialog, slideSearch, SgTable },
  dicts: ['Room_status'],
  data() {
    return {
      search:false,
      height: 0,
      maskStyle: {},
      mask: false,
      loadingData: false,
      roomList: [],
      calendarData: [
        { label: '日' },
        { label: '一' },
        { label: '二' },
        { label: '三' },
        { label: '四' },
        { label: '五' },
        { label: '六' }
      ], // 日历循环渲染数据
      year: 0, // 当前日期年
      month: 0, // 当前日期月数
      date: 0, // 当前日期号数
      day: -1, // 当前星期几
      options: {
        queryTimeType: {
          type: 'select',
          label: '时间条件',
          clearable: true,
          values: '0',
          options: [
            {
              label: '可预约时间',
              value: '0'
            },
            {
              label: '可入住时间',
              value: '1'
            }
          ]
        },
        queryTime: {
          type: 'datetimerangeopentions',
          label: '查询时间',
          clearable: false,
          values: [new Date(monthData()[0]), new Date(monthData()[1])]
        },
        estimatedCost: {
          type: 'Tinput',
          label: '预计费用',
          clearable: true,
          values: []
        },
        // estimatedTime: {
        //   type: 'Tinput',
        //   label: '预计时间',
        //   clearable: true,
        //   values: []
        // },
        floorId: {
          type: 'select',
          label: '楼层',
          clearable: true,
          options: []
        },
        roomTypeId: {
          type: 'select',
          label: '房间类型',
          clearable: true,
          options: []
        }
        // state: {
        //   type: 'select',
        //   label: '房间状态',
        //   clearable: true,
        //   options: []
        // }
        // defaultDays: {
        //   type: 'input',
        //   label: '默认天数',
        //   clearable: true
        // },
        // defaultCharge: {
        //   type: 'input',
        //   label: '默认费用',
        //   clearable: true
        // }
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      showDialog: false,
      btnDisabled: false,
      checkDisabled: false,
      showDataDialog: false,
      loadingSubmit: false,
      sysUserList: [],
      zerennurse: [],
      yuesao: [],
      Chankang: [],
      customerData: [],
      customPagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      columns: [
        {
          lab: '接待时间',
          val: 'receptionTime',
          width: 140
        },
        {
          lab: '姓名',
          val: 'customerName',
          width: 90
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '现场咨询',
          val: 'acName',
          width: 90
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 90
        },
        {
          lab: '客户意见',
          val: 'intentionDescription',
          showOverflowTooltip: true
        }
      ],
      roomForm: {
        id: 0,
        roomId: 0,
        floorNumber: '',
        roomType: '',
        roomNumber: '',
        roomName: '',
        defaultDays: '',
        defaultCharge: '',
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        customAge: '',
        checkStatus: '',
        aestheticConsultant: '',
        nurse: '',
        maternityMatron: '',
        chanKangShi: '',
        checkReservationTime: '',
        roomDays: '',
        checkOutTime: '',
        remark: '',
        departmentId: 0,
        jdxxId: 0,
        waitId: 0,

      },
      roomFormRules: {
        customerName: [
          { required: true, message: '请在左侧选择客户', trigger: 'blur' }
        ],
        customPhone: [
          { required: true, message: '请在左侧选择客户', trigger: 'blur' }
        ],
        checkStatus: [
          { required: true, message: '请选择预约或入住', trigger: 'change' }
        ],
        aestheticConsultant: [
          { required: true, message: '请选择现场咨询', trigger: 'change' }
        ],
        nurse: [
          { required: true, message: '请选择责任护士', trigger: 'change' }
        ],
        maternityMatron: [
          { required: true, message: '请选择责任月嫂', trigger: 'change' }
        ],
        chanKangShi: [
          { required: true, message: '请选择产康师', trigger: 'change' }
        ],
        checkReservationTime: [
          { required: true, message: '请选择入住时间', trigger: 'blur' }
        ],
        roomDays: [
          { required: true, message: '请输入入住天数', trigger: 'blur' }
        ]
      },
      searchBar: {
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        receptionTime:todayTime()
      },
      selectionData: [],
      showBillingDataDialog: false,
      billingSelectionData: [],
      billingData: [],
      billingPagination: {
        show: false
      },
      billingColumns: [
        {
          lab: '姓名',
          val: 'customerName'
        },
        {
          lab: '现场咨询',
          val: 'acName'
        },
        {
          lab: '购买天数',
          val: 'quantitySum'
        }
      ]
    }
  },
  computed: {
    // 根据当月日期详情更改日历表格高度
    calendarStyle() {
      if (this.calendarData.length > 42) {
        return 'height: 350px;'
      } else {
        return 'height: 350px;'
      }
    },
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
      this.getFloorList()
      this.getRoomTypeList()
      this.getUserList()
    }
  },
  mounted() {

    const height = document.documentElement.clientHeight - 170
    if (height < 400) {
      this.height = 600 + 'px'
    } else {
      this.height = height + 'px'
    }
  },
  created() {
    this.getFloorList()
    this.getRoomTypeList()
    this.getUserList()
    this.getRoomList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getRoomList()
      }
    }
    // 获取当前日期数据
    // this.getNow()
    // 获取当前月份一号的时间戳
    // const firstTime = +new Date(this.year, this.month - 1, 1, 0, 0, 0)
    // this.getCalendarDate() // 给calendarData添加当月数据
  },
  methods: {
    changeTime(){
      this.search=true
    },
    changeTime1(){
      this.search=false
    },
    /**
     * @author Nevin
     * @date 2022/8/16
     * @Description: 订单Table行内点击
    */
    billingRowClick(e) {
      this.$refs.billingTable.$refs.multipleBillingTable.clearSelection()
      this.$refs.billingTable.$refs.multipleBillingTable.toggleRowSelection(e[1])
    },
    /**
     * @author Nevin
     * @date 2022/8/16
     * @Description: 购买Table多选
    */
    billingSelectionChange(e) {
      this.billingSelectionData = []
      if (e[1].length > 1) {
        this.$refs.billingTable.$refs.multipleBillingTable.clearSelection()
        this.$refs.billingTable.$refs.multipleBillingTable.toggleRowSelection(e[1].pop())
      }
      this.billingSelectionData.push(e[1].pop())
      this.$delete(this.billingSelectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/8/16
     * @Description: 关闭订单弹窗
    */
    closeBillingDialog() {
      this.billingSelectionData = []
      this.showBillingDataDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/8/16
     * @Description: 订单弹窗提交
    */
    submitBillingForm() {
      this.roomForm.id = this.selectionData[0].id
      this.roomForm.customerName = this.selectionData[0].customerName
      this.roomForm.customPhone = this.selectionData[0].customPhone
      this.roomForm.customCardNumber = this.selectionData[0].customCardNumber
      this.roomForm.customAge = this.selectionData[0].customAge
      this.roomForm.departmentId = this.selectionData[0].departmentId
      this.roomForm.jdxxId = this.selectionData[0].jdxxId
      this.roomForm.aestheticConsultant = this.selectionData[0].aestheticConsultant
      this.roomForm.waitId = this.billingSelectionData[0].waitId
      this.roomForm.roomDays = this.billingSelectionData[0].quantitySum
      this.showBillingDataDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/24
     * @Description: 关闭日历展开窗
     */
    closeAllCard() {
      this.roomList.forEach(item => {
        if (item.allCard === true) {
          item.otherCard = true
          item.allCard = false
          this.mask = false
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/23
     * @Description: 点击展开日历
     */
    showAllCard(items) {
      if (items.allCard === false) {
        items.otherCard = false
        items.allCard = true
        this.mask = true
      } else {
        items.allCard = false
        items.otherCard = true
        this.mask = false
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/16
     * @Description: 获取房间列表
     */
    async getRoomList(isSearch) {
      this.loadingData = true
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'daterange') {
          data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD')
          data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD')
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
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        else {
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
      this.$set(data, 'deptId', this.deptId)
      await this.$api.confinementRoom.selectRoomInfoAll(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            this.$set(item, 'year', 0)
            this.$set(item, 'month', 0)
            this.$set(item, 'date', 0)
            this.$set(item, 'day', -1)
            this.$set(item, 'calendarData', [
              { label: '日' },
              { label: '一' },
              { label: '二' },
              { label: '三' },
              { label: '四' },
              { label: '五' },
              { label: '六' }])
          })
          this.roomList = res.rows
          this.pagination.total = res.total
          this.roomList.forEach(items => {
            const now = this.getNow()
            items.year = now.year
            items.month = now.month
            items.date = now.date
            items.day = now.day
            items.calendarData = this.getCalendarDate(items.year, items.month)
            items.calendarData.forEach(item => {
              if (items.mapList !== undefined) {
                items.mapList.forEach(val => {
                  const list = []
                  for (let i = 0; i <= val.remainingDays; i++) {
                    list.push(math.add(val.checkReservationTime.substring(8, 10), i))
                  }
                  if (
                    val.checkReservationTime.substring(0, 4) == item.year &&
                    val.checkReservationTime.substring(5, 7) == item.month &&
                    list.indexOf(item.label) !== -1
                  ) {
                    item = Object.assign(item, val)
                  }
                  if (val.aestheticConsultant === 0) {
                    val.aestheticConsultant = ''
                  }
                  if (val.nurse === 0) {
                    val.nurse = ''
                  }
                  if (val.maternityMatron === 0) {
                    val.maternityMatron = ''
                  }
                  if (val.chanKangShi === 0) {
                    val.chanKangShi = ''
                  }
                })
              }
            })
            this.$set(items, 'otherCard', true)
            this.$set(items, 'allCard', false)
            this.$forceUpdate()
          })
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 日历点击
     */
    roomInfo(items, item) {
      if(item.year==undefined){
         this.$message.warning('请选择具体日期');
         return
      }
      if (item.checkStatus === '2') {
        this.$message.warning('这个房间已经入住了(❁´◡`❁)')
      } else {
        if (items.allCard === true) {
          items.allCard = false
          items.otherCard = true
          this.mask = false
        }
        const data = Object.assign(items, item)
        // this.roomForm = data
        this.roomForm.id = data.id
        this.roomForm.roomId = data.roomId
        this.roomForm.floorNumber = data.floorNumber
        this.roomForm.roomType = data.roomType
        this.roomForm.roomNumber = data.roomNumber
        this.roomForm.roomName = data.roomName
        this.roomForm.defaultDays = data.defaultDays
        this.roomForm.defaultCharge = data.defaultCharge
        this.roomForm.customerName = data.customerName
        this.roomForm.customPhone = data.customPhone
        this.roomForm.customCardNumber = data.customCardNumber
        this.roomForm.departmentId = data.departmentId
        this.roomForm.checkStatus = data.checkStatus
        this.roomForm.aestheticConsultant = data.aestheticConsultant
        this.roomForm.nurse = data.nurse
        this.roomForm.maternityMatron = data.maternityMatron
        this.roomForm.chanKangShi = data.chanKangShi
        if(item.year==undefined||item.month==undefined||item.label==undefined){
          this.roomForm.checkReservationTime =''
        }else{
          this.roomForm.checkReservationTime = item.year + '-' + item.month + '-' + item.label // 点击几月几号传几月几号
        }

        this.roomForm.roomDays = data.roomDays
        this.roomForm.checkOutTime = data.checkOutTime
        this.roomForm.jdxxId = data.jdxxId
        this.roomForm.roomReservationId = data.roomReservationId
        if (this.roomForm.id !== undefined) {
          if (this.roomForm.checkStatus === '2') {
            this.getCustomerInfo()
            this.roomForm.checkStatus = '1'
            this.checkDisabled = true
            this.showDialog = true
          } else {
            this.roomForm.checkStatus = '2'
            this.checkDisabled = true
            this.btnDisabled = true
            this.customerData = []
            this.pagination.total = 0
            this.showDialog = true
          }
        } else {
          this.getCustomerInfo()
          this.checkDisabled = false
          this.btnDisabled = false
          this.showDialog = true
        }
      }
    },
    currentChange(e) {
      this.pagination.pageNum = e
      this.pagination.currentPage = e
      this.getRoomList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e
      this.getRoomList()
    },
    getNow() {
      const now = new Date()
      const year = +now.getFullYear()
      const month = +now.getMonth() + 1
      const date = +now.getDate()
      const day = +now.getDay()
      return { year, month, date, day }
    },
    // 获取每个月的天数
    monthDay(year, month) {
      if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31
      } else if ([4, 6, 9, 11].includes(month)) {
        return 30
      } else if (month === 2) {
        //  判断当年是否为闰年
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return 29
        } else {
          return 28
        }
      }
    },
    // 给calendarData添加当月数据
    getCalendarDate(year, month) {
      let calendarData = []
      // 获取当前月份一号星期几
      const firstDay = new Date(
        year + '-' + month + '-' + '01'
      ).getDay()
      calendarData = [
        { label: '日' },
        { label: '一' },
        { label: '二' },
        { label: '三' },
        { label: '四' },
        { label: '五' },
        { label: '六' }
      ]
      const num = parseInt(firstDay)
      const nowDays = this.monthDay(year, month)
      const lastMonth = month - 1 > 0 ? month - 1 : 12
      const lastDays = this.monthDay(year, lastMonth)
      // 循环添加上一个月数据
      for (let i = 0; i < num; i++) {
        if (month === 1) {
          calendarData.push({
            year: year - 1,
            month: 12,
            label: lastDays - num + i + 1,
            color: 'ash'
          })
        } else {
          calendarData.push({
            year: year,
            month: month - 1,
            label: lastDays - num + i + 1,
            color: 'ash'
          })
        }
      }
      // 循环添加当月数据
      for (let i = 0; i < nowDays; i++) {
        calendarData.push({
          year: year,
          month: month,
          label: i + 1
        })
      }
      // 循环添加下一个月数据
      if (calendarData.length % 7 !== 0) {
        const surplusDay = 7 - (calendarData.length % 7)
        for (let i = 0; i < surplusDay; i++) {
          if (month === 12) {
            calendarData.push({
              year: year + 1,
              month: 1,
              label: i + 1,
              color: 'ash'
            })
          } else {
            calendarData.push({
              year: year,
              month: month + 1,
              label: i + 1,
              color: 'ash'
            })
          }
        }
      }
      return calendarData
    },
    // 将日期调上
    dateUp(items) {
      items.month--
      if (items.month <= 0) {
        items.year--
        items.month = 12
      }
      items.calendarData = this.getCalendarDate(items.year, items.month) // 给calendarData添加当月数据
      this.$api.confinementRoom.selectRoomInfoByTime({
        roomId: items.roomId,
        checkReservationTime: items.year + '-' + items.month + '-' + '1'
      }).then(res => {
        if (res) {
          items.calendarData.forEach(item => {
            if (res.data !== undefined) {
              res.data.forEach(val => {
                const list = []
                for (let i = 0; i <= val.remainingDays; i++) {
                  list.push(math.add(val.checkReservationTime.substring(8, 10), i))
                }
                if (val.checkReservationTime.substring(5, 7) !== val.checkOutTime.substring(5, 7)) {
                  if (
                    list.indexOf(item.label) !== -1 &&
                    val.checkReservationTime.substring(5, 7) == item.month
                  ) {
                    item = Object.assign(item, val)
                  }
                } else {
                  if (
                    val.checkReservationTime.substring(0, 4) == item.year &&
                    val.checkReservationTime.substring(5, 7) == item.month &&
                    list.indexOf(item.label) !== -1
                  ) {
                    item = Object.assign(item, val)
                  }
                }
              })
            }
          })
          this.$forceUpdate()
        }
      })
    },
    // 将日期调下
    dateDown(items) {
      items.month++
      if (items.month > 12) {
        items.year++
        items.month = 1
      }
      items.calendarData = this.getCalendarDate(items.year, items.month) // 给calendarData添加当月数据
      this.$api.confinementRoom.selectRoomInfoByTime({
        roomId: items.roomId,
        checkReservationTime: items.year + '-' + items.month + '-' + '1'
      }).then(res => {
        if (res) {
          items.calendarData.forEach(item => {
            if (res.data !== undefined) {
              res.data.forEach(val => {
                const list = []
                let day = 1
                for (let i = 0; i <= val.remainingDays; i++) {
                  if ([1, 3, 5, 7, 8, 10, 12].includes(items.month)) {
                    if (math.add(val.checkReservationTime.substring(8, 10), i) > 31) {
                      list.push(day++)
                    }
                  } else if ([4, 6, 9, 11].includes(items.month)) {
                    if (math.add(val.checkReservationTime.substring(8, 10), i) > 30) {
                      list.push(day++)
                    }
                  } else if (items.month === 2) {
                    //  判断当年是否为闰年
                    if ((items.year % 4 === 0 && items.year % 100 !== 0) || items.year % 400 === 0) {
                      if (math.add(val.checkReservationTime.substring(8, 10), i) > 29) {
                        list.push(day++)
                      }
                    } else {
                      if (math.add(val.checkReservationTime.substring(8, 10), i) > 28) {
                        list.push(day++)
                      }
                    }
                  }
                }
                if (val.checkReservationTime.substring(5, 7) !== val.checkOutTime.substring(5, 7)) {
                  if (
                    list.indexOf(item.label) !== -1 &&
                    math.add(val.checkReservationTime.substring(5, 7), 1) == item.month
                  ) {
                    item = Object.assign(item, val)
                  }
                } else {
                  if (
                    val.checkReservationTime.substring(0, 4) == item.year &&
                    val.checkReservationTime.substring(5, 7) == item.month &&
                    list.indexOf(item.label) !== -1
                  ) {
                    item = Object.assign(item, val)
                  }
                }
              })
            }
          })
          this.$forceUpdate()
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 关闭开单弹窗
     */
    closeRoomDialog() {
      this.resetForm()
      this.selectionData = []
      this.showDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 确定
     */
    submitRoomForm() {
      this.$refs['roomForm'].validate(valid => {
        if (valid) {
          // 获取当前时间 未预约顾客住院使用当前时间
          const yy = new Date().getFullYear()
          const mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
          const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
          const today = yy + '-' + mm + '-' + dd
          if (this.roomForm.roomReservationId !== undefined) {
            this.loadingSubmit = true
            var editdata = {
              id: this.roomForm.id,
              subscribeTime: today,
              roomAmount: this.billingSelectionData[0].totalPayment, // 金额
              remainingAmount: this.billingSelectionData[0].totalPayment, // 金额
              roomId: this.roomForm.roomId,
              roomReservationId: this.roomForm.roomReservationId,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: this.roomForm.checkOutTime,
              checkStatus: this.roomForm.checkStatus,
              checkReservationTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId,
              jdxxId: this.roomForm.jdxxId,
              waitId: this.roomForm.waitId
            }
            console.log('editdata', editdata)
            return
            this.$api.confinementRoom.editRoomReservation(editdata).then(res => {
              if (res) {
                this.getRoomList()
                this.$message.success(res.msg)
                this.showDialog = false
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.loadingSubmit = true
            var addData = {
              id: this.roomForm.id,
              subscribeTime: today,
              roomAmount: this.billingSelectionData[0].totalPayment, // 金额
              remainingAmount: this.billingSelectionData[0].totalPayment, // 金额
              roomId: this.roomForm.roomId,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: this.roomForm.checkOutTime,
              checkStatus: this.roomForm.checkStatus,
              checkReservationTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId,
              jdxxId: this.roomForm.jdxxId,
              waitId: this.roomForm.waitId
            }
            console.log('addData', addData)
            this.$api.confinementRoom.addRoomReservation(addData).then(res => {
              if (res) {
                this.getRoomList()
                this.$message.success(res.msg)
                this.showDialog = false
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 确定并开单
     */
    submitRoomFormBilling() {
      this.$refs['roomForm'].validate(valid => {
        if (valid) {
          if (this.roomForm.roomReservationId !== undefined) {
            this.loadingSubmit = true
            this.$api.confinementRoom.editRoomReservation({
              id: this.roomForm.id,
              roomId: this.roomForm.roomId,
              roomReservationId: this.roomForm.roomReservationId,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: this.roomForm.checkOutTime,
              checkStatus: this.roomForm.checkStatus,
              checkReservationTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId,
              jdxxId: this.roomForm.jdxxId
            }).then(res => {
              if (res) {
                this.getRoomList()
                this.$message.success(res.msg)
                this.showDialog = false
                this.$set(this.roomForm, 'departmentType', '1')
                this.$router.push({ path: 'customerBilling'})
                const query={
                  billing:JSON.stringify(this.roomForm)
                }
                sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.loadingSubmit = true
            this.$api.confinementRoom.addRoomReservation({
              id: this.roomForm.id,
              roomId: this.roomForm.roomId,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: this.roomForm.checkOutTime,
              checkStatus: this.roomForm.checkStatus,
              checkReservationTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId,
              jdxxId: this.roomForm.jdxxId
            }).then(res => {
              if (res) {
                this.getRoomList()
                this.$message.success(res.msg)
                this.showDialog = false
                this.$set(this.roomForm, 'departmentType', '1')
                this.$router.push({ path: 'customerBilling'})
                const query={
                  billing:JSON.stringify(this.roomForm)
                }
                sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 获取分诊用户
     */
    async getCustomerInfo(isserach) {
      var time = new Date()
      var day = ('0' + time.getDate()).slice(-2)
      var month = ('0' + (time.getMonth() + 1)).slice(-2)
      var todayData = time.getFullYear() + '-' + month + '-' + day;
      if(isserach){
        this.pagination.pageNum='1'
        this.customPagination.pageNum='1'
      }
      const query={
        customerName:this.searchBar.customerName,
        customPhone:this.searchBar.customPhone,
        customCardNumber:this.searchBar.customCardNumber,
        beginReceptionTime:this.searchBar.receptionTime?this.searchBar.receptionTime[0]:'',
        endreceptionTime:this.searchBar.receptionTime?this.searchBar.receptionTime[1]:'',
        receptionStatus:'2',
        deptId:this.deptId
        }
      // this.$set(this.searchBar, 'receptionStatus', '2') // 接待状态（1分诊2已开单3失效）
      // this.$set(this.searchBar, 'deptId', this.deptId)

      await this.$api.modules.billingList.BillingManagement({
        ...this.customPagination,
        ...query
      }).then(res => {
        if (res) {
          this.customerData = res.rows
          this.customPagination.total = res.total;
          if(isserach){
            let children=document.querySelectorAll('.el-pager');
            let newchildren=children[1].children
            newchildren[0].click();
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 重置表单
     */
    resetForm() {
      this.roomForm = {
        id: 0,
        roomId: 0,
        floorNumber: '',
        roomType: '',
        roomNumber: '',
        roomName: '',
        defaultDays: '',
        defaultCharge: '',
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        customAge: '',
        checkStatus: '',
        aestheticConsultant: '',
        nurse: '',
        maternityMatron: '',
        chanKangShi: '',
        checkTime: '',
        roomDays: '',
        subscribeTime: '',
        checkOutTime: '',
        remark: '',
        checkReservationTime: '',
        departmentId: 0,
        jdxxId: 0
      }
      this.$forceUpdate()
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 分页
     */
    change(e) {
      this.customPagination.pageNum = e[1]
      this.getCustomerInfo() // 调用数据
    },
    customSizeChange(e) {
      this.customPagination.pageSize = e[1]
      this.getCustomerInfo()
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 表格选择
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      if (this.selectionData[0] !== undefined) {
        this.$api.billingList.queryAppointment({
          jdxxId: this.selectionData[0].jdxxId,
          deptId: this.deptId
        }).then(res => {
          if (res) {
            if (res.data !== undefined) {
              this.showBillingDataDialog = true
              this.billingData = res.data
              this.billingData.forEach(item => {
                this.$set(item, 'deptId', this.selectionData[0].deptId)
                this.$set(item, 'customerName', this.selectionData[0].customerName)
                this.$set(item, 'acName', this.selectionData[0].acName)
              })
            } else {
              this.$message.error('该顾客没有购买房间信息，不允许入住预约！')
            }
          }
        })
        this.$forceUpdate()
      }
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 获取用户
     */
    async getUserList() {
      // 人员添加公司Id  添加状态 添加岗位
      let data = {
        deptId: this.deptId,
        status: '0'
      }
      await this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 月嫂
          res.data.forEach(item => {
            if (item.postCode == 'yuesao') {
              this.yuesao.push(item)
            }
          })
          // 现场咨询
          res.data.forEach(item => {
            if (item.postCode == 'xczxs') {
              this.sysUserList.push(item)
            }
          })
          // 产康
          res.data.forEach(item => {
            if (item.postCode == 'chks') {
              this.Chankang.push(item)
            }
          })
          // 责任护士
          res.data.forEach(item => {
            if (item.postCode == 'zerennurse') {
              this.zerennurse.push(item)
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 获取房间类型
     */
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
    /**
     * @author Nevin
     * @date 2022/6/18
     * @Description: 获取楼层
     */
    getFloorList() {
      this.$api.confinementRoom.floorInfoList({
        deptId: this.deptId,
        state: '0'
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.floorNumber
            item.value = item.floorId
          })
          this.options.floorId.options = res.rows
        }
      })
    }
  }
}

</script>
<style scoped lang="scss">
.block{
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;
  text-align: center;
  box-sizing: border-box;
}
.lookForMonth_top {
  overflow: hidden;
  .selectDate {
    height: 30px;
    line-height: 30px;
    float: right;
    display: flex;
    font-size: 18px;
    .upDownSelect {
      display: flex;
      flex-direction: column;
      margin-left: 5px;
      .upDown {
        margin-right: 0;
        cursor: pointer;
      }
      .upDown:hover {
        color: #1abc9c;
      }
      .upDownSelect_item {
        width: 0;
        height: 0;
        border: 7px solid transparent;
        cursor: pointer;
      }
      .upDownSelect_item:nth-child(1) {
        border-bottom: 7px solid #666;
        margin-bottom: 5px;
        &:hover {
          border-bottom: 7px solid skyblue;
        }
      }
      .upDownSelect_item:nth-child(2) {
        border-top: 7px solid #666;
        &:hover {
          border-top: 7px solid skyblue;
        }
      }
    }
  }
}
/* 日历表样式=======================================↓ */
.calendar {
  width: 100%;
  //border-top: 1px solid #ccc;
  //border-left: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  //background-color: #1abc9c;
  .calendar_item {
    box-sizing: border-box;
    width: 51px;
    //border-right: 1px solid #ccc;
    //border-bottom: 1px solid #ccc;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 14px;
    .appointment {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #fcbf64;
      margin-left: 40%;
    }
    .check {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #56dbb8;
      margin-left: 40%;
    }
    .free {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #5f94de;
      margin-left: 40%;
    }
    &.date:hover{
      background: #eee;
    }
    .status{
      &.textBlue{
        color: blue;
      }
      &.textRed{
        color: brown;
      }
    }
    .el-icon-edit-outline{
      cursor: pointer;
      margin-left: 7px;
    }
  }
  .ash{
    color: gainsboro;
  }
}
.footer {
  text-align: center;
  color: gainsboro;
  cursor: pointer;
}
.footer:hover {
  color: #1abc9c;
}
</style>
<style scoped lang="scss">
p{
  font-size: 14px;
}
span{
  margin-right: 10px;
}
.header {
  position: relative;
  width: 100%;
  height: 94%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px 0 0;
  .mask {
    position: absolute;
    height: 110%;
    width: 100%;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.4);
  }
  .right {
    width: 100%;
    overflow-y:scroll;
    overflow-x:hidden;
    height:100%;
    margin-bottom: 40px;
    .tips {
      margin-top: 10px;
      padding-left: 25px;
      .appointment {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fcbf64;
      }
      .check {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #56dbb8;
      }
      .free {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #5f94de;
      }
    }
  }
}
.rooms{
  float: left;
  width: 380px;
  margin:10px 20px 30px 20px;
  .roomCard {
    width: 100%;
    //height: 600px;
    border-radius: 15px;
  }
  .otherRoomCard {
    width: 100%;
    height: 300px;
    border-radius: 15px;
  }
}
//.fade-enter-active, .fade-leave-active {
//  transition: opacity .5s
//}
//.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
//  opacity: 0
//}

::v-deep .el-card__body {
  padding: 10px;
}
.room{
  float: left;
  width: 25px;
  height: 25px;
  margin-right: 5px;
  //margin-top: -5px;
  //background-color: #E6A23C;
}
//::v-deep .el-input--prefix .el-input__inner{
//  padding-left: 15px !important;
//  padding-right: 10px !important;
//}
//::v-deep .el-input__icon{
//  width: 10px !important;
//}
</style>
<style>
.el-table .success-row {
  background-color: #7ec5b7;
}
.el-input__prefix{
  display: none;
}
</style>
