<template>
  <!-- 个人详情 -->
  <div

    class="returnVisitDetial"
  >
    <el-scrollbar class="el-scrollbar">
      <div class="customer-info-bar">
        <span>{{ list.customerName }}</span>
        <span>{{ customSex(list.customSex) }}</span>
        <span>{{ list.customAge }}</span>
        <!-- <span>线上客服:{{张三}} /</span> -->
        <span>建档人:{{ list.createUserName }} /</span>
        <span>回访人:{{ list.planReturnUserName }}</span>
      </div>
      <div class="buttonBox">
        <div>
          <el-button
            v-hasPermi="['detailsOfArrival:manual']"
            size="mini"
            icon="el-icon-plus"
            type="primary"
            plain
            @click.stop.native="openManualDialog"
          >手工上报</el-button>
          <el-button
            size="mini"
            icon="el-icon-guide"
            type="success"
            plain
            @click.stop="customerLabelEdit"
          >客户标签添加</el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            @click.stop="CustomerDataUpdate"
          >客户资料更新</el-button>
          <el-button
            size="mini"
            icon="el-icon-s-custom"
            type="success"
            plain
            @click.stop="CustomerInformation"
          >客户360信息</el-button>
          <el-button
            size="mini"
            icon="el-icon-s-order"
            type="primary"
            plain
            @click.stop="ReservationInformation"
          >预约信息</el-button>
          <el-button
            v-hasPermi="['detailsOfArrival:blacklist']"
            size="mini"
            icon="el-icon-error"
            type="danger"
            plain
            @click.stop="blacklist"
          >加入黑名单</el-button>
        </div>
        <div class="hu">
          <el-button
            v-if="isExecute==0"
            size="mini"
            type="danger"
            :loading="submitLoading"
            @click="ReturnVisit"
          >保存</el-button>
        </div>
      </div>
      <el-card class="el-card">
        <el-row :gutter="40">
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-menu" />回访计划信息</div>
              <div>
                <el-input
                  v-model="list.returnVisit"
                  type="textarea"
                  :rows="3"
                  disabled
                />
              </div>
              <div class="title"><i class="el-icon-menu" />临客备注</div>
              <div>
                <el-input
                  v-model="list.remark"
                  type="textarea"
                  :rows="3"
                  disabled
                />
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-edit" />回访信息</div>
              <div class="card-item-box">
                <div>计划时间：{{ list.planReturnTime }}</div>
                <div>回访阶段：{{ stage(list.returnStage) }}</div>
                <div>回访状态：{{ RecordList.isExecute==1?'已预约':'已上报' }}</div>
                <div>回访等级：{{ grades(list.grade) }}</div>
                <div>临客预约时间：{{ list.appointmentTime }}</div>
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-phone" />联系方式</div>
              <div class="card-item-box">
                <div>电话号码：<span>{{ list.customPhone }}</span></div>
                <el-button
                  v-show="show"
                  size="mini"
                  @click="displayhide"
                >显示电话</el-button>
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :md="6"
          >
            <div class="card-item">
              <div class="title"><i class="el-icon-phone" />其他信息</div>
              <div class="card-item-box">
                <div>建档时间：{{ list.planReturnTime }}</div>
                <div>建档类型：{{ list.typeThreeName }}</div>
                <div>媒介：客服挂号 / 网络咨询</div>
                <!--                <div>科室：{{list.departmentName}}</div>-->
                <div>经济收入：{{ money(list.economicCapacity) }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <div class="card-item-btn">
        <!-- <el-button
          size="mini"
          type="primary"
          plain
          icon="el-icon-s-promotion"
        >发送短信</el-button> -->
        <el-button
          size="mini"
          type="success"
          plain
          icon="el-icon-phone"
        >拨打电话</el-button>
      </div>
      <el-card>
        <div v-if="isExecute==0">
          <el-form
            ref="form"
            label-width="120px"
            size="mini"
            :model="RecordList"
            :rules="rules"
          >
            <el-row>
              <el-col>
                <el-form-item label="回访录音">
                  <a>刷新</a>
                </el-form-item>
              </el-col>
              <el-col :span="6">

                <el-form-item label="回访时间">
                  <el-date-picker
                    v-model="dsingleTime"
                    disabled
                    style="width: 260px;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择下单时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="打通结果"
                  prop="isThrough"
                >
                  <el-select v-model="RecordList.isThrough" filterable>
                    <el-option
                      v-for="item in options.DialingResults.options"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">

                <el-form-item
                  v-if="RecordList.isThrough==1"
                  label="打通等级"
                  prop="throughLevel"
                >
                  <el-select v-model="RecordList.throughLevel" filterable>
                    <el-option
                      v-for="item in options.throughLevel.options"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  v-else
                  label="未打通原因"
                  prop="notThroughReason"
                >
                  <el-select v-model="RecordList.notThroughReason" filterable>
                    <el-option
                      v-for="item in options.look.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col>
                <el-form-item
                  v-model="RecordList.remark"
                  label="回访备注"
                >
                  <el-input
                    v-model="RecordList.returnVisitFeedback"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    :disabled="RecordList.isExecute==1"
                  />
                </el-form-item>
              </el-col>

              <template v-if="list.isOneReturnVisit==='0'">
                <el-col :span="6">
                  <el-form-item
                    label="下次回访时间"
                    prop="planReturnTime"
                  >
                    <el-date-picker
                      v-model="RecordList.planReturnTime"
                      :disabled="DisableStop"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      @change="outTime"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="下次回访等级"
                    prop="grade"
                  >
                    <el-select
                      v-model="RecordList.grade"
                      :disabled="DisableStop"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in dict.type.grade"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item
                    label="下次回访目的"
                    prop="returnVisit"
                  >
                    <el-input
                      v-model="RecordList.returnVisit"
                      clearable
                      :disabled="DisableStop"
                      type="textarea"
                      :rows="3"
                      resize="none"
                    />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item
                    label="停止回访原因"
                    prop="teminReason"
                  >
                    <el-select
                      v-model="RecordList.teminReason"
                      style="width:10%"
                      clearable
                      filterable
                      :disabled="DisableButton"
                      @change="stopTime"
                    >
                      <el-option
                        v-for="item in dict.type.stop_visit"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item
                    label="停止回访说明"
                    prop="terminatedRemarks"
                  >
                    <el-input
                      v-model="RecordList.terminatedRemarks"
                      type="textarea"
                      :disabled="DisableButton"
                    />
                  </el-form-item>
                </el-col>
              </template>

            </el-row>
          </el-form>
        </div>
        <!-- 第二类型 -->
        <div v-else>
          <el-form>
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col>
                <el-form-item
                  label="回访反馈备注："
                  label-position="top"
                >
                  <el-input
                    v-model="RecordList.returnVisitFeedback"
                    type="textarea"
                    :disabled="RecordList.isExecute==1"
                  />
                </el-form-item>
                <p style="font-size: 14px"> 停止回访原因：{{ stopTeminReason(RecordList.teminReason) }}</p>
                <p style="font-size: 14px"> 停止回访说明：{{ RecordList.terminatedRemarks }}</p>
              </el-col>
              <el-col>
                <div class="resultLeft">
                  <span>回访时间：{{ list.actualReturnvisitTime }}</span>
                  <el-divider />
                  <span>拨打结果：{{ fotter(RecordList.isThrough) }}</span>
                  <el-divider />
                  <span v-if="RecordList.isThrough==1">打通等级：{{ gtefter(RecordList.throughLevel) }}</span>
                  <span v-else>未打通原因：{{ notThroughReason(RecordList.notThroughReason) }}</span>
                  <el-divider />

                </div>

              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <div class="card-item-btn">
        客户信息
      </div>
      <el-card>
        <el-tabs
          v-model="activeName"
          @tab-click="but"
        >
          <el-tab-pane
            label="回访记录"
            name="first"
          >
            <return-record
              v-if="huifang!==null"
              :huifang="huifang"
              :no-hospital="noHospital"
              @changeList="changeList"
            />
          </el-tab-pane>
          <el-tab-pane
            label="临客跟进记录"
            name="second"
          >
            <el-table
              border
              :data="Followup"
            >
              <el-table-column
                label="跟进时间"
                prop="createTime"
              />
              <el-table-column
                label="跟进人"
                prop="createBy"
              />
              <el-table-column
                label="跟进记录"
                prop="remark"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            label="短信发送日志"
            name="third"
          >
            <el-table
              size="mini"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                prop="date"
                label="日期"
                width="180"
              />
              <el-table-column
                prop="name"
                label="关键字"
                width="180"
              />
              <el-table-column
                prop="address"
                label="短信内容"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            label="回访图片"
            name="fourth"
          >
            <ul class="return-picture">
              <li>
                <div>回访时间</div>
                <div><i class="el-icon-s-order" />近期回访图片</div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col />
          <el-col>
            <el-row
              type="flex"
              justify="end"
            >
              <el-button
                v-if="RecordList.isExecute==1"
                type="info"
                size="mini"
                @click="goOff"
              >关闭</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
      <!-- 客户资料更新 -->
      <!-- @handleClose="customLabelDialog=false" -->
      <!-- 客户标签弹层 -->

      <sg-dialog
        title="临客标签"
        :dialog="customLabelDialog"
        out-top="50px"
        @handleClose="customLabelDialog=false"
      >
        <div slot="out">
          <div class="dialog-box">
            <div class="title">
              <div>客户基本信息</div>
            </div>
            <div class="content">
              <el-form
                label-width="80px"
                size="mini"
                disabled
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="客户姓名">
                      <el-input
                        v-model="manualForm.userInfo.customerName"
                        class="full-width"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="客户电话">
                      <el-input
                        v-model="manualForm.userInfo.customPhone"
                        class="full-width"
                      />
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
                          :key="Number(dict.value)"
                          :value="Number(dict.value)"
                          :label="dict.label"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="建档时间">
                      <el-input
                        v-model="manualForm.userInfo.createTime"
                        class="full-width"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="线上客服">
                      <el-input
                        v-model="manualForm.userInfo.onlineUserName"
                        class="full-width"
                      />
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
              <el-form
                label-width="80px"
                size="mini"
                :loading="manualFormLoading"
              >
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
                        v-model="manualForm.form.labelDataId"
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
                      >添加</el-button>
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

      <!-- 手工上报弹层 -->
      <manual-submission
        :show-manual-dialog="showManualDialog"
        :inner-dialog="innerDialog"
        :selection-data="selectionData"
        @closeInnerDialog="closeInnerDialog"
        @closeShowManualDialog="closeShowManualDialog"
        @setInnerDialog="setInnerDialog"
      />

    </el-scrollbar>

  </div>
</template>

<script>
import ManualSubmission from '@/components/ManualSubmission/indexTwo' // 手工上报弹层//和其它页面手工弹层不是一个接口也不是同一个弹层
import SgDialog from '@/components/Dialog' // 客户标签弹层
import ReturnRecord from '@/components/ReturnRecord'
import { timeFmt } from '@/utils/time'
import vm from '@/utils/util'
export default {
  name: 'DetailsOfArrival',
  dicts: ['through_result', 'through_level', 'not_through_reason', 'sys_user_sex', 'economic_capacity', 'task_level', 'through_level', 'through_result', 'stop_visit', 'not_through_reason', 'grade', 'return_stage', 'economic_capacity'],
  components: { ReturnRecord, ManualSubmission, SgDialog },
  data() {
    return {
      // display: '显示',
      submitLoading: false,
      show: true,
      showDataDialog: false,
      selectionData: [],
      DisableButton: false, // 控制下次回访
      DisableStop: false, // 控制停止回访
      innerDialog: false,
      activeName: 'first',
      tableData: [],
      phone: '',
      // 媒介来源数据
      channelType: [],
      // 顾客标签数据table
      manualFormTableData: [],
      // formdate: {
      //   planReturnTime: '',
      //   grade: '',
      //   returnVisit: '',
      //   teminReason: '',
      //   isTerminated: '', // 终止回访
      //   terminatedRemarks: ''
      // }, // 下次回访时候字段
      // 顾客标签类型
      customerLabelTypeData: [],
      customerLabelTypeChildData: [],
      // 顾客标签
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
      manualFormLoading: false,
      showManualDialog: false, // 手工弹层
      customLabelDialog: false, // 客户标签弹层
      huifang: [], // 接受回访记录的数据
      Followup: [], // 接受临客信息
      options: {
        throughLevel: {
          type: 'select',
          label: '打通等级',
          options: []
        },
        DialingResults: {
          type: 'select',
          label: '拨打结果',
          options: []
        },
        look: {
          type: 'select',
          label: '未打通原因',
          options: []
        },
        customSex: {
          type: '',
          label: '性别',
          options: []
        },
        customAge: {
          type: '',
          label: '年龄',
          options: []
        }

      },
      dsingleTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()),
      list: {}, // 接收传递过来的数据
      // 校验规则
      rules: {
        isThrough: [
          { required: true, message: '请输入打通结果', trigger: 'change' }

        ],
        notThroughReason: [
          { required: true, message: '请输入未打通原因', trigger: 'change' }
        ],
        throughLevel: [
          { required: true, message: '请输入打通等级', trigger: 'change' }
        ],
        // 下次回访时间
        planReturnTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请输入下次等级', trigger: 'blur' }
        ],
        // 下次回访目的
        returnVisit: [
          { required: true, message: '请填写回访目的', trigger: 'blur' }
        ],
        // 停止回访原因
        teminReason: [
          { required: true, message: '请输入下次回访目的', trigger: 'blur' }
        ],
        // 停止回访说明
        terminatedRemarks: [
          { required: true, message: '请输入下次回访目的', trigger: 'change' }
        ]
      },

      RecordList: {
        isThrough: undefined, // 记录是否打通
        notThroughReason: undefined, // 未打通原因
        throughLevel: undefined, // 打通等级
        returnVisitFeedback: undefined, // 备注
        // throughLevel:'',
        actualReturnvisitTime: undefined, // 时间
        numberId: 0,
        id: 0,
        isExecute: undefined, // 用来显示详情控制或者回访
        planReturnTime: undefined,
        grade: undefined,
        returnVisit: undefined,
        teminReason: undefined,
        isTerminated: undefined, // 终止原因
        terminatedRemarks: undefined
      },
      isExecute: '', // 用来显示或者隐藏详情状态
      // RecordList: {}
      noHospital: '',
      customerId: undefined,
      id: undefined
    }
  },

  created() {
    this.options.throughLevel.options = this.dict.type.through_level
    this.options.DialingResults.options = this.dict.type.through_result
    this.options.look.options = this.dict.type.not_through_reason // 将字典中的数据赋值给options用来绑定下拉选择框
    this.options.customSex.options = this.dict.type.sys_user_sex // 性别的字典
    this.id = this.$route.query.numberId // numberid  用来获取单条数据的
    this.isExecute = this.$route.query.isExecute// 用来判断显示
    this.customerId = this.$route.query.customerId
    this.noHospital = this.$route.query.noHospital // 判断是否到院
    // this.returnVisitPlan(id)
    this.gethuiFang(this.id)
    this.customerLabelType()
    this.AccessRecord(this.customerId) // 所有回访记录
  },

  methods: {
    // 手机号显示隐藏
    changeList(){
      this.AccessRecord(this.customerId)
    },
    displayhide() {
      this.show = !this.show
      if (this.show === true) {
        this.load = false
      } else {
        const id = this.$route.query.customerId
        this.$api.user.customidGetPhone({ customeerId: id }).then(res => {
          if (res) {
            this.list.customPhone = res.msg
          }
        })
      }
    },
    // 获取所有的回访记录
    AccessRecord(id) {
      this.$api.netPower.AlreadyArrivedList({ id: id }).then((res) => {
        if (res) {
          this.huifang = res.rows
        }
      })
    },
    // 根据numberid来获取单条数据
    gethuiFang(id) {
      this.showDataDialog = true
      this.$api.netPower.AlreadyArrivedList({ numberId: id }).then((res) => {
        if (res) {
          this.list = res.rows[0];
          console.log(this.list,'jajajja1')
          this.selectionData = res.rows
          this.huifang = res.rows
        }
        if (this.list.isExecute === '0') {
          return
        } else {
          // 循环找到相同的属性 将值传递给相同的属性
          Object.keys(this.RecordList).forEach((key) => {
            this.RecordList[key] = this.list[key]
          })
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    outTime(e) {
      if (e) {
        this.DisableButton = true
        this.rules.planReturnTime = [{ required: true, message: '请选择日期', trigger: 'change' }]
        this.rules.grade = [{ required: true, message: '请输入下次等级', trigger: 'blur' }]
        this.rules.returnVisit = [{ required: true, message: '请填写', trigger: 'blur' }]
        // this.isTerminated = '0' // 表示未终止
        this.rules.teminReason = []
        this.rules.terminatedRemarks = []
        this.RecordList.teminReason = ''
        this.RecordList.terminatedRemarks = ''
      } else {
        this.rules.planReturnTime = []
        this.rules.grade = []
        this.rules.returnVisit = []
        this.DisableButton = false
      }
    },
    // 停止回访事件
    stopTime(e) {
      if (e) {
        this.DisableStop = true
        this.rules.teminReason = [{ required: true, message: '请输入下次回访目的', trigger: 'blur' }]
        this.rules.terminatedRemarks = [{ required: true, message: '请输入下次回访目的', trigger: 'change' }]

        this.rules.planReturnTime = []
        this.rules.grade = []
        this.rules.returnVisit = []
        this.RecordList.isTerminated = '1' // 表示终止
        this.RecordList.planReturnTime = '' // 清空回访时间
        this.RecordList.grade = '' // 清空下次回访等级
        this.RecordList.returnVisit = '' // 清空下次回访目的
      } else {
        // 下次回访时间
        this.rules.planReturnTime =  [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
          this.rules.grade= [
            { required: true, message: '请输入下次等级', trigger: 'blur' }
          ],
          // 下次回访目的
          this.rules.returnVisit= [
            { required: true, message: '请填写回访目的', trigger: 'change' }
          ],
        this.rules.teminReason = []
        this.rules.terminatedRemarks = []
        this.DisableStop = false
      }
    },
    // 转换字典打通结果
    gtefter(str) {
      const obj = this.dict.type.through_level.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    notThroughReason(str) {
      const obj = this.dict.type.not_through_reason.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    fotter(str) {
      const obj = this.dict.type.through_result.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    stopTeminReason(str) {
      const obj = this.dict.type.stop_visit.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    // 点击保存后的接口
    ReturnVisit() {
      const data = {
        id: this.customerId,
        numberId: this.id,
        isThrough: this.RecordList.isThrough,
        throughLevel: this.RecordList.throughLevel,
        notThroughReason: this.RecordList.notThroughReason,
        returnVisitFeedback: this.RecordList.returnVisitFeedback,
        dsingleTime: this.dsingleTime,
        teminReason: this.RecordList.teminReason,
        terminatedRemarks: this.RecordList.terminatedRemarks,
        planReturnTime: this.RecordList.planReturnTime,
        grade: this.RecordList.grade,
        returnVisit: this.RecordList.returnVisit,
        isOneReturnVisit: this.list.isOneReturnVisit
      }
      this.$refs.form.validate((isOK) => {
        if (isOK) {
          this.preservation = true // 控制按钮的
          this.$api.modules.netPower.AlreadyArrived(data).then((res) => {
            if (res) {
              this.$message.success('保存成功 ')
              this.preservation = false
              this.closeTag()
            }
          })
        }
      })
    },
    openManualDialog() {
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
    },
    // 为顾客添加标签
    addUserLabel(data) {
      this.manualFormLoading = true
      this.$api.modules.netPower.addUserLabel(data).then(res => {
        if (res) {
          this.getUserLabelInfo(this.list.id)
        }
      }).finally(() => {
        this.manualFormLoading = false
      })
    },
    // 客户信息标签
    customerLabelEdit() {
      this.getUserLabelInfo(this.list.id)
      this.customLabelDialog = true
    },
    // 添加客户信息按钮
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
        this.manualForm.form.id = this.list.id

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
      this.getUserLabelInfo(this.list.id)
    },
    // 获取顾客标签
    customerLabelType() {
      this.$api.modules.custLabel.customerLabelType().then(res => {
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
    // 客户标签删除按钮
    removeToTable(row) {
      this.$api.modules.netPower.deleteCustomerLabel(row.customerLabelId).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getUserLabelInfo(this.list.id)
        }
      })
    },

    // 获取顾客标签信息
    getUserLabelInfo(id) {
      this.$api.modules.netPower.getUserLabelInfo({ id: id }).then((res) => {
        if (res) {
          this.manualForm.userInfo = res.data.customInfoVo
          this.manualFormTableData = res.data.labelRelations
        }
      })
    },
    // 修改客户资料
    CustomerDataUpdate() {
      this.$router.push({ path: '/returnVisitRecordList', query: { id: this.list.id}})
    },
    // 客户360信息
    CustomerInformation() {
      // customer-info
      this.$router.push({ path: '/customerInfo', query: { id: this.list.id }})
      // this.$router.push({ path: "/ceshide", query: { id: this.list.id } })
    },
    // 预约信息
    ReservationInformation() {
      this.$router.push({ path: '/modifyReservationForm', query: { id: this.list.id }})
    },
    // 添加黑名单
    blacklist() {
      this.$api.modules.netPower.blacklist({ id: this.list.id, blacklist: 1 }).then((res) => {
        if (res) {
          this.$message.success('加入黑名单成功')
        }
      })
    },
    but(tab) {
      if (tab.index == 1) {
        // 调用临客信息的接口
        this.$api.modules.netPower.GuestInformation({ id: this.list.id }).then((res) => {
          if (res) {
            this.Followup = res.rows
          }
        })
      }
    },
    // 退出事件
    goOff() {
      this.$router.go(-1)
    },
    // 筛选性别的方法
    customSex(str) {
      const obj = this.options.customSex.options.find(item => item.value == str)
      return obj ? obj.label : ''
    },
    // 回访阶段
    stage(str) {
      const obj = this.dict.type.return_stage.find(item => {
        return item.value == str
      })
      return obj ? obj.label : '未知'
    },
    // 回访等级的转换
    grades(str) {
      const obj = this.dict.type.grade.find(item => {
        return item.value == str
      })
      return obj ? obj.label : '未知'
    },
    // 经济
    money(str) {
      const obj = this.dict.type.economic_capacity.find(item => {
        return item.value == str
      })
      return obj ? obj.label : '未知'
    },
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    }
  }

}
</script>

<style scoped lang="scss">
.return-picture {
  list-style: none;
  li {
    display: flex;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 10px;
    box-sizing: border-box;
    div {
      width: 50%;
      text-align: center;
      color: #666666;
    }
  }
}
.returnVisitDetial {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .el-scrollbar {
    height: 100%;
    & .customer-info-bar {
      span {
        margin: 0 6px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  & > span {
    font-size: 14px;
    margin: 0 6px;
  }
  .buttonBox {
    width: 100%;
    height: auto;
    display: flex;
    margin: 10px 0;
    .hu {
      flex: 20%;
      margin-left: auto;
      text-align: right;
    }
  }
  .el-card {
    margin-top: 10px;
    .card-item {
      .title {
        font-size: 14px;
        font-weight: bold;
        i {
          margin-right: 6px;
        }
        margin: 10px 0;
      }
      .card-item-box {
        & > div {
          font-size: 12px;
          margin: 10px 0;
        }
      }
    }
  }
  .card-item-btn {
    margin-top: 10px;
    font-weight: bold;
    font-size: 14px;
  }
}
::v-deep .el-divider--horizontal {
  margin: 6px 0;
}
.resultLeft {
  margin-left: 10px;
  & span {
    font-size: 14px;
  }
}
</style>
