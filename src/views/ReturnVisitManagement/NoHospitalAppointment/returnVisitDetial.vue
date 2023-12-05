<template>
  <div  class="returnVisitDetial">
    <el-scrollbar class="el-scrollbar">
      <div class="customer-info-bar">
        <span>{{ list.customerName }}</span>
        <span>性别: {{ customSexs(list.customSex) }} </span>
        <span>{{ list.customAge }}</span>
        <!-- <span>线上客服:{{张三}} /</span> -->
        <span>建档人:{{ list.createUserName }} &nbsp;&nbsp;</span>
        <span>回访人:{{ list.planReturnUserName }}</span>
      </div>
      <div class="buttonBox">
        
        <div>
          <el-button
            v-hasPermi="['returnVisitDetial:manual']"
            plain
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click.stop.native="openManualDialog"
          >手工上报
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-guide"
            type="success"
            plain
            @click.stop="customerLabelEdit"
          >客户标签添加
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            @click.stop="CustomerDataUpdate"
          >客户资料更新
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-s-custom"
            type="success"
            plain
            @click.stop="CustomerInformation"
          >客户360信息
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-s-order"
            type="primary"
            plain
            @click.stop="ReservationInformation"
          >预约信息
          </el-button>
          <el-button
            v-hasPermi="['returnVisitDetial:blacklist']"
            size="mini"
            icon="el-icon-error"
            type="danger"
            plain
            @click.stop="blacklist"
          >加入黑名单
          </el-button>
        </div>
        <div class="hu">
          <el-button
            v-if="isExecute==0"
            size="mini"
            type="success"
            :loading="preservation"
            @click="ReturnVisit"
          >保存
          </el-button>
        </div>
      </div>
      <el-card class="el-card">
        <el-row :gutter="40">
          <el-col :xs="24" :md="4">
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
                  v-model="list.returnVisitFeedback"
                  type="textarea"
                  :rows="3"
                  disabled
                />
              </div>
            </div>
          </el-col>
          <el-col :xs="23" :md="5">
            <div class="card-item">
              <div class="title"><i class="el-icon-edit" />回访信息</div>
              <div class="card-item-box">
                <div>计划时间：{{ list.planReturnTime }}</div>
                <div>回访阶段：{{ stage(list.returnStage) }}</div>
                <div>回访状态：{{ RecordList.isExecute == 1 ? '已预约' : '已上报' }}</div>
                <div>回访等级：{{ grades(list.grade) }}</div>
                <div>临客预约时间：{{ list.appointmentTime }}</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="5">
            <div class="card-item">
              <div class="title"><i class="el-icon-phone" />联系方式</div>
              <div class="card-item-box">
                <div>电话号码：<span>{{ list.customPhone }}</span>
                  <el-button v-show="show" size="mini" @click="displayhide">显示电话</el-button>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="5">
            <div class="card-item">
              <div class="title"><i class="el-icon-phone" />其他信息</div>
              <div class="card-item-box">
                <div>建档时间：{{ list.planReturnTime }}</div>
                <div>建档类型：{{ list.typeThreeName }}</div>
                <div>媒介：客服挂号 / 网络咨询{{ list.channelTypeId }}</div>
                <!--                <div>科室：{{ list.departmentName }}</div>-->
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
        >发送短信
        </el-button> -->
        <el-button
          size="mini"
          type="success"
          plain
          icon="el-icon-phone"
        >拨打电话
        </el-button>
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
                <el-form-item label="打通结果:" prop="isThrough">
                  <el-select v-model="RecordList.isThrough" clearable filterable :disabled="RecordList.isExecute==1">
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

                <el-form-item v-if="RecordList.isThrough==1" label="打通等级:" prop="throughLevel">
                  <el-select v-model="RecordList.throughLevel" clearable filterable :disabled="RecordList.isExecute==1">
                    <el-option
                      v-for="item in options.throughLevel.options"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item v-else label="未打通原因:" prop="notThroughReason">
                  <el-select v-model="RecordList.notThroughReason" clearable filterable :disabled="RecordList.isExecute==1">
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
                <el-form-item label="回访反馈:" prop="returnVisitFeedback">
                  <el-input
                    v-model="RecordList.returnVisitFeedback"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    :disabled="RecordList.isExecute==1"
                  />
                </el-form-item>
              </el-col>
              <!--              isOneReturnVisit-->
              <!--              已终止-->
              <template v-if="list.isOneReturnVisit==='0'">
                <el-col :span="6">
                  <el-form-item label="下次回访时间:" prop="planReturnTime">
                    <el-date-picker
                      v-model="RecordList.planReturnTime"
                      :disabled="StopRevisiting"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      @change="nextTime"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="下次回访等级:" prop="grade">
                    <el-select v-model="RecordList.grade" clearable filterable :disabled="StopRevisiting">
                      <el-option
                        v-for="item in dict.type.grade"
                        :key="item.value"
                        :label="item.label"
                        :value="Number(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="下次回访目的:" prop="returnVisits">
                    <el-input
                      v-model="RecordList.returnVisits"
                      :disabled="StopRevisiting"
                      type="textarea"
                      :rows="3"
                      resize="none"
                    />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="停止回访原因:" prop="teminReason">
                    <el-select
                      v-model="RecordList.teminReason"
                      style="width:10%"
                      clearable
                      filterable
                      :disabled="NextVisit"
                      @change="stop"
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
                  <el-form-item label="停止回访说明:" prop="terminatedRemarks">
                    <el-input v-model="RecordList.terminatedRemarks" type="textarea" :disabled="NextVisit" />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </div>
        <div v-else>
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
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="打通结果:" prop="isThrough">
                  <el-select v-model="RecordList.isThrough" filterable :disabled="RecordList.isExecute==1">
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
                <el-form-item v-if="RecordList.isThrough==1" label="打通等级:" prop="throughLevel">
                  <el-select v-model="RecordList.throughLevel" filterable :disabled="RecordList.isExecute==1">
                    <el-option
                      v-for="item in options.throughLevel.options"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-else label="未打通原因:" prop="notThroughReason">
                  <el-select v-model="RecordList.notThroughReason" filterable :disabled="RecordList.isExecute==1">
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
                <el-form-item label="回访反馈:">
                  <el-input
                    v-model="RecordList.returnVisitFeedback"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    :disabled="RecordList.isExecute==1"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <div class="card-item-btn">
        客户信息
      </div>
      <el-card>
        <el-tabs v-model="activeName" @tab-click="but">
          <el-tab-pane label="回访记录" name="first">
            <return-record v-if="huifang!==null" :huifang="huifang" @changeList="changeList" />
          </el-tab-pane>
          <el-tab-pane label="临客跟进记录" name="second">
            <el-table border :data="Followup">
              <el-table-column label="跟进时间" prop="createTime" />
              <el-table-column label="跟进人" prop="createBy" />
              <el-table-column label="跟进记录" prop="remark" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="短信发送日志" name="third">
            <el-table size="mini" :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="日期" width="180" />
              <el-table-column prop="name" label="关键字" width="180" />
              <el-table-column prop="address" label="短信内容" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="回访图片" name="fourth">
            <ul class="return-picture">
              <li>
                <div>回访时间</div>
                <div><i class="el-icon-s-order" />近期回访图片</div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <el-row type="flex" justify="space-between">
          <el-col />
          <el-col>
            <el-row type="flex" justify="end">
              <el-button
                v-if="isExecute ==1"
                type="info"
                size="mini"
                @click="goOff">关闭
              </el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
      <!-- 客户资料更新 -->
      <!-- @handleClose="customLabelDialog=false" -->
      <!-- 客户标签弹层 -->

      <sg-dialog title="临客标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabelDialog=false">
        <div slot="out">
          <div class="dialog-box">
            <div class="title">
              <div style="padding-bottom: 10px;font-size: 15px;font-weight: 600">客户基本信息</div>
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
                        class="full-width" filterable
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
                      <el-select v-model="manualForm.userInfo.economicCapacity" filterable class="full-width" placeholder="请选择">
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
              <div style="padding-bottom: 10px;font-size: 15px;font-weight: 600">添加标签</div>
            </div>
            <div class="content">
              <el-form label-width="80px" size="mini" :loading="manualFormLoading">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="标签类型">
                      <el-select
                        v-model="manualForm.form.customerLabelTypeId"
                        class="full-width" filterable
                        placeholder="请选择标签类型"
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
                      <el-select v-model="manualForm.form.labelDataId" filterable class="full-width" placeholder="请选择标签">
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
              <div style="padding-bottom: 10px;font-size: 15px;font-weight: 600">顾客标签</div>
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
                    <el-button type="text" size="mini">
                      <span style="color: #ff0026" @click.stop="removeToTable(scope.row)">删除</span>
                    </el-button>
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
import ManualSubmission from '@/components/ManualSubmission' // 手工上报弹层
import SgDialog from '@/components/Dialog' // 客户标签弹层
import ReturnRecord from '@/components/ReturnRecord'
import { timeFmt } from '@/utils/time'
import vm from '@/utils/util'

export default {
  name: 'ReturnVisitDetial',
  dicts: ['through_result', 'through_level', 'not_through_reason', 'sys_user_sex', 'economic_capacity', 'task_level', 'stop_visit', 'grade', 'return_stage', 'economic_capacity'],
  components: { ReturnRecord, ManualSubmission, SgDialog },
  data() {
    return {
      // transmission:{
      //     numberId:this.list.numberId,//id
      //     isThrough:this.RecordList.GradeIpon,//是否打通
      //     throughLevel:this.RecordList.Calllevel,//打通等级
      //      notThroughReason:this.RecordList.Calllevel//未打通原因
      //   },
      preservation: false, // 保存按扭
      show: true,
      load: false,
      phone: '',
      showDataDialog: false,
      innerDialog: false,
      activeName: 'first',
      // formdate: {
      //   planReturnTime: '',
      //   grade: undefined,
      //   returnVisit: '',
      //   teminReason: '',
      //   isTerminated: '', // 终止原因
      //   terminatedRemarks: ''
      // }, // 下次回访时候的数据
      selectionData: [],
      NextVisit: false, // 点击下次回访时改变停止回访
      StopRevisiting: false, // 停止回访点击后改变下次回访
      tableData: [],
      // 媒介来源数据
      channelType: [],
      // 顾客标签数据table
      manualFormTableData: [],
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
        returnVisitFeedback: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        // 下次回访时间
        planReturnTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请输入下次等级', trigger: 'blur' }
        ],
        // 下次回访目的
        returnVisits: [
          { required: true, message: '请填写回访目的', trigger: 'change' }
        ],
        // 停止回访原因
        teminReason: [
          { required: true, message: '请输入下次回访目的', trigger: 'blur' }
        ],
        // 停止回访说明
        terminatedRemarks: [
          { required: true, message: '请输入停止回访说明', trigger: 'change' }
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
        returnVisits: undefined,
        teminReason: undefined,
        isTerminated: undefined, // 终止原因
        terminatedRemarks: undefined
      },
      isExecute: '',
      customerId: undefined,
      id: undefined
      // RecordList: {}
    }
  },
  created() {
    this.options.throughLevel.options = this.dict.type.through_level
    this.options.DialingResults.options = this.dict.type.through_result
    this.options.look.options = this.dict.type.not_through_reason // 将字典中的数据赋值给options用来绑定下拉选择框
    this.options.customSex.options = this.dict.type.sys_user_sex // 性别的字典
    this.isExecute = this.$route.query.isExecute // 用来判断显示
    this.customerId = this.$route.query.customerId // 顾客的id
    this.id = this.$route.query.numberId // 此处的id不是真正的id 而是numberid  用来获取单条数据的
    this.gethuiFang(this.id)
    this.customerLabelType()
    this.record(this.customerId);
    this.deptId = this.$store.getters.departmentId
  },

  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId;
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  methods: {
    changeList(){
      this.record(this.customerId)
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
            this.load = true
          }
        })
      }
    },
    // 获取回访记录
    record(customerId) {
      this.$api.modules.netPower.returnVisitPlan({ id: customerId }).then((res) => {
        if (res) {
          this.huifang = res.rows;
        }
      })
    },
    // 根据numberid来获取单条数据
    gethuiFang(id) {
      this.showDataDialog = true
      this.$api.modules.netPower.returnVisitPlan({ numberId: id }).then((res) => {
        if (res) {
          this.list = res.rows[0]
          this.selectionData = res.rows
          // this.huifang = res.rows
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
    // 保存的按钮
    ReturnVisit() {
      // const newData = {
      //   id: this.customerId,
      //   numberId: this.$route.query.numberId,
      //   planReturnTime: this.RecordList.planReturnTime,
      //   grade: this.RecordList.grade,
      //   returnVisit: this.RecordList.returnVisits
      // }
      // this.$refs.form.validate((isOK) => {
      //   if (isOK) {
      //     if (this.list.isOneReturnVisit === '0') {
      //       this.$api.modules.netPower.addManualData(newData).then(res => {
      //         if (res) {
      //         }
      //       })
      //     }
      //   }
      // })
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
        returnVisit: this.RecordList.returnVisits,
        isOneReturnVisit: this.list.isOneReturnVisit
      };
      this.$refs.form.validate((isOK) => {
        if (isOK) {
          this.preservation = true // 控制按钮的
          this.$api.modules.netPower.ReturnVisit(data).then((res) => {
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
      this.$api.modules.custLabel.customerLabelType({
        deptId:this.deptId
      }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data;
          console.log(res.data,'哈哈数据来饿了')
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
      this.$router.push({ path: '/ReturnVisitRecordList', query: { id: this.list.id}})
    },
    // 客户360信息
    CustomerInformation() {
      this.$router.push({ path: '/NotInHospital', query: { id: this.list.id }})
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
      /**
       * @author 李尚
       * @date 2022/8/10
       * @Description: tab里面是字符串 1 点击后调用
       */
      if (tab.index === '1') {
        // 调用临客信息的接口
        this.$api.modules.netPower.GuestInformation({ id: this.list.id }).then((res) => {
          if (res) {
            this.Followup = res.rows
          }
        })
      }
    },
    // 监听下次回访的数据变化
    nextTime(e) {
      if (e) {
        this.NextVisit = true
        this.rules.planReturnTime = [{ required: true, message: '请选择日期', trigger: 'change' }]
        this.rules.grade = [{ required: true, message: '请输入下次等级', trigger: 'change' }]
        this.rules.returnVisits = [{ required: true, message: '请填写', trigger: 'change' }]
        // this.isTerminated = '0' // 表示未终止
        this.rules.teminReason = []
        this.rules.terminatedRemarks = []
        this.RecordList.teminReason = undefined
        this.RecordList.terminatedRemarks = undefined
      } else {
        this.rules.planReturnTime = []
        this.rules.grade = []
        this.rules.returnVisits = []
        this.NextVisit = false
      }
    },
    // 监听选择停止回访原因后
    stop(e) {
      if (e) {
        this.StopRevisiting = true
        this.rules.teminReason = [{ required: true, message: '请输入下次回访目的', trigger: 'change' }]
        this.rules.terminatedRemarks = [{ required: true, message: '请输入下次回访目的', trigger: 'change' }]

        this.rules.planReturnTime = []
        this.rules.grade = []
        this.rules.returnVisits = []
        this.RecordList.isTerminated = '1' // 表示终止
        this.RecordList.planReturnTime = undefined // 清空回访时间
        this.RecordList.grade = undefined // 清空下次回访等级
        this.RecordList.returnVisits = undefined // 清空下次回访目的
      } else {
        // 下次回访时间
        this.rules.planReturnTime =  [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
          this.rules.grade= [
          { required: true, message: '请输入下次等级', trigger: 'blur' }
        ],
          // 下次回访目的
          this.rules.returnVisits= [
          { required: true, message: '请填写回访目的', trigger: 'change' }
        ],
        this.rules.teminReason = []
        this.rules.terminatedRemarks = []
        this.StopRevisiting = false
      }
    },
    // 點擊返回的
    goOff() {
      undefined
      this.$router.go(-1)
    },
    // 筛选性别的方法
    customSexs(str) {
      const obj = this.options.customSex.options.find(item => item.value === str)
      return obj ? obj.label : '未知'
    },
    // 回访等级的转换
    grades(str) {
      const obj = this.dict.type.grade.find(item => {
        return parseInt(item.value) === str
      })
      return obj ? obj.label : '未知'
    },
    // 回访阶段
    stage(str) {
      const obj = this.dict.type.return_stage.find(item => {
        return parseInt(item.value) === str
      })
      return obj ? obj.label : '未知'
    },
    money(str) {
      const obj = this.dict.type.economic_capacity.find(item => {
        return item.value === str
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
</style>
