<template>
  <!-- 未到院手工上报 -->
  <div>
    <sg-dialog :dialog="showManualDialog" :inner-dialog="innerDialog" :inner-fullscreen="true" title="临客手工上报回访计划"
      inner-title="上报回访" inner-title-icon="el-icon-s-unfold" @innerHandleClose="closeDialog('closeInnerDialog')"
      @handleClose="closeDialog('closeShowManualDialog')">
      <div slot="out">
        <div class="dialogTop">
          回访客户数量:{{ selectionData.length }};&nbsp;&nbsp;&nbsp;&nbsp;下单人:{{ $store.getters.user.nickName }}
          <el-button @click="selectAll" type="primary" size="mini" style="margin-left: 30px;"
            v-if="flagnew">选择全部人员</el-button>
        </div>
        <div class="dialog-box">
          <div class="title">
            <div>回访信息 <span style="margin-left: 30px;">是否固定回访时间区间:</span>
              <el-switch v-model="valueqj" active-color="#13ce66" inactive-color="#dcdfe6" style="margin-left: 10px;" >
              </el-switch>
            </div>
            <div @click="setInnerDialog"><a>高级选项</a></div>
          </div>
          <div class="content">
            <el-form ref="manualForm" size="mini" label-width="125px" :model="returnVisitRecordList[0]"
              :rules="manualFormRules">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否一次性回访" prop="isOneReturnVisit">
                    <el-select v-model="returnVisitRecordList[0].isOneReturnVisit" class="full-width" placeholder="请选择">
                      <el-option v-for="dict in dict.type['whether']" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计划日期" :prop="valueqj==true?'planReturnTimes':'planReturnTime'">
                    <el-date-picker v-model="returnVisitRecordList[0].planReturnTime" class="full-width" type="datetime"
                      :clearable="false" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间" :disabled="valueqj" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!--                <el-form-item label="任务等级"-->
                  <!--                              prop="taskLevel">-->
                  <!--                  &lt;!&ndash; @change="change" &ndash;&gt;-->
                  <!--                  <el-select v-model="returnVisitRecordList[0].taskLevel"-->
                  <!--                             class="full-width"-->
                  <!--                             placeholder="请选择">-->
                  <!--                    <el-option v-for="dict in dict.type['task_level']"-->
                  <!--                               :key="dict.value"-->
                  <!--                               :label="dict.label"-->
                  <!--                               :value="dict.value" />-->
                  <!--                  </el-select>-->
                  <!--                </el-form-item>-->
                  <el-form-item label="任务等级" prop="grade">
                    <!-- @change="change" -->
                    <el-select v-model="returnVisitRecordList[0].grade" class="full-width" placeholder="请选择">
                      <el-option v-for="dict in dict.type['task_level']" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="回访阶段" prop="returnStage">
                    <el-select v-model="returnVisitRecordList[0].returnStage" class="full-width" placeholder="请选择">
                      <el-option v-for="dict in dict.type['return_stage']" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="任务关键字">
                    <el-input v-model="returnVisitRecordList[0].returnVisitKeyword" class="full-width"
                      placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="回访目的">
                    <el-input v-model="returnVisitRecordList[0].returnVisit" class="full-width" :rows="2" resize="none"
                      type="textarea" placeholder="请输入回访目的" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" >
                  <el-form-item label="固定时间区间" :prop="valueqj?'value1':'value2'">
                    <el-date-picker v-model="returnVisitRecordList[0].value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                      end-placeholder="结束日期" size="mini" :disabled="newvalueqj">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="dialog-box">
          <div class="title">
            <div>回访信息<span>(若不能确定回访指定执行人,可选择填写执行人类型,系统自动匹配)</span></div>
          </div>
          <div class="content">
            <el-form label-width="120px" size="mini" :model="returnVisitRecordList[0]" :rules="manualFormRules">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="指定执行人">
                    <el-checkbox v-model="returnVisitRecordList[0].appointPeople" @change="Onechange" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="选择执行人">
                    <el-select v-model="returnVisitRecordList[0].planReturnUser" filterable remote reserve-keyword
                      placeholder="请输入" :disabled="!returnVisitRecordList[0].appointPeople"
                      :remote-method="querySearchAsync">
                      <el-option v-for="item in sysUserList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="执行类型">
                    <el-select v-model="returnVisitRecordList[0].returnUserType"
                      :disabled="returnVisitRecordList[0].appointPeople" placeholder="请选择" class="full-width">
                      <el-option v-for="dict in dict.type['execution_type']" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="后备执行人" prop="backupExecutor">
                    <el-select v-model="returnVisitRecordList[0].backupExecutor" filterable remote reserve-keyword
                      placeholder="请输入关键词" :disabled="returnVisitRecordList[0].appointPeople"
                      :remote-method="querySearchAsync">
                      <el-option v-for="item in sysUserList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <el-button size="mini" type="primary" @click.stop="saveManual('manualForm')">保存</el-button>
      </div>
      <div slot="in">
        <el-card class="visitBox">
          <ul>
            <li>
              回访客户数量:{{ selectionData.length }}; &nbsp;&nbsp;&nbsp;&nbsp;下单人:{{ $store.getters.user.nickName }}
            </li>
            <!-- <li>
            回访计划
          </li> -->
            <li>
              回访类型：
              <el-select v-model="returnTypeId" placeholder="请选择" size="mini" @change="changeselect" clearable>
                <el-option v-for="item in optionstypeName" :key="item.returnTypeId" :label="item.typeName"
                  :value="item.returnTypeId">
                </el-option>
              </el-select>
            </li>
            <!-- <el-scrollbar  label="chatList" ref="scrollbar" > -->
              <div class="chatList" style="height: 700px;overflow-y: scroll;">
                <el-card v-for="(item, index) in returnVisitRecordList" :key="index" class="visitBox innerVisitBox">
                <ul>
                  <li>计划{{ index + 1 }}<a>（若不能确定回访指定执行人,可选择填写执行人类型,系统自动匹配 ）</a>
                    <el-link v-if="index !== 0" type="danger" style="float: right" size="mini"
                      @click.stop="deleteManualItem(index)">删除
                    </el-link>
                  </li>
                  <div class="visitContent">
                    <div>
                      <div class="title">回访信息</div>
                      <el-form :ref="'moreManualForm' + index" size="mini" label-width="124px" :model="item"
                        :rules="manualFormRules">
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="是否一次性回访" prop="isOneReturnVisit">
                              <el-select v-model="item.isOneReturnVisit" style="width: 100%;" size="mini"
                                placeholder="请选择">
                                <el-option v-for="dict in dict.type['whether']" :key="dict.value" :label="dict.label"
                                  :value="dict.value" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="计划时间" prop="planReturnTime">
                              <el-date-picker v-model="item.planReturnTime" style="width: 100%;" type="datetime"
                                :clearable="false" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="任务等级" prop="taskLevel">
                              <!-- "item.taskLevel" -->
                              <el-select v-model="item.taskLevel" style="width: 100%;" size="mini" placeholder="请选择">
                                <el-option v-for="dict in dict.type['task_level']" :key="dict.value" :label="dict.label"
                                  :value="dict.value" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="回访阶段" prop="returnStage">
                              <el-select v-model="item.returnStage" style="width: 100%;" size="mini" placeholder="请选择">
                                <el-option v-for="dict in dict.type['return_stage']" :key="dict.value" :label="dict.label"
                                  :value="dict.value" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="关键字">
                              <el-input v-model="item.returnVisitKeyword" class="full-width" placeholder="请输入" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="回访目的">
                              <el-input v-model="item.returnVisit" class="full-width" :rows="1" resize="none"
                                type="textarea" placeholder="请输入回访目的" />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                    <div>
                      <div class="title">回访人员</div>
                      <el-form ref="forem" size="mini" :model="returnVisitRecordList[0]" :rules="manualFormRules"
                        label-width="110px">
                        <el-row>
                          <el-col :span="10">
                            <el-form-item label="指定执行人">
                              <el-checkbox v-model="item.appointPeople" @change="change(e, item)" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="14">
                            <el-form-item label="选择执行人">
                              <el-select v-model="item.planReturnUser" filterable remote reserve-keyword placeholder="请输入"
                                :disabled="!item.appointPeople" :remote-method="querySearchAsync">
                                <el-option v-for="items in sysUserList" :key="items.value" :label="items.label"
                                  :value="items.value" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="10">
                            <el-form-item label="执行类型">
                              <el-select v-model="item.returnUserType" :disabled="item.appointPeople" placeholder="请选择"
                                class="full-width">
                                <el-option v-for="dict in dict.type['execution_type']" :key="dict.value"
                                  :label="dict.label" :value="dict.value" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="14">
                            <!-- :disabled="!item.appointPeople" -->
                            <el-form-item label="后备执行人" prop="backupExecutor">
                              <el-select v-model="item.backupExecutor" filterable remote reserve-keyword placeholder="请输入"
                                :disabled="item.appointPeople" :remote-method="querySearchAsync">
                                <el-option v-for="items in sysUserList" :key="items.value" :label="items.label"
                                  :value="items.value" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                  </div>
                </ul>
              </el-card>
              </div>
             
            <!-- </el-scrollbar> -->
          </ul>
          <el-button style="margin-top: 10px" size="mini" @click.stop="addManualPlain">新增计划</el-button>
          <el-button style="margin-top: 10px" size="mini" type="primary" @click.stop="saveManual('moreManualForm', true)">
            保存
          </el-button>
        </el-card>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import { timeFmt } from '@/utils/time'
import SgDialog from '@/components/Dialog'
import PinyinMatch from "pinyin-match";
export default {
  name: 'ManualSubmission',
  dicts: ['execution_type', 'return_stage', 'task_level', 'whether'],
  components: {
    SgDialog
  },
  props: {
    showManualDialog: {
      type: Boolean,
      default: false
    },
    flagnew: {
      type: Boolean,
      default: false
    },
    innerDialog: {
      type: Boolean,
      default: false
    },
    selectionData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      newvalueqj:true,
      value1: ['',''],
      optionstypeName: [],
      valueqj: false,
      returnTypeId: '',
      // 系统用户列表
      sysUserList: [],
      newsysUserList: [],
      manualFormRules: {
        isOneReturnVisit: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        planReturnTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        taskLevel: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        returnStage: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        value1:[
          { required: true, message: '请选择固定回访时间', trigger: 'change' }
        ]

      },
      // 手工上报回访
      returnVisitRecordList: [
        {
          isOneReturnVisit: '',

          appointPeople: true,
          // returnExecutorUser: this.$store.getters.user.userId,
          planReturnUser: this.$store.getters.user.userId, // 选择执行人
          taskLevel: '',
          planReturnTime: timeFmt('', new Date()),
          returnStage: '',
          grade: undefined,
          returnUserType: '', // 类型
          backupExecutor: '',// 后备执行人
          returnVisit: '',//回访目的
          value1:[],
        }
      ]
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
    showManualDialog(newV){
      if(newV){
        this.value1="";
        this.valueqj=false
      }
    },
    deptId(val) {
      this.deptId = val
      this.getUserList(val)
    },
    valueqj(newV){
      if(newV){
       this.newvalueqj=false
      }else{
        this.newvalueqj=true;
      }
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getUserList();
  },
  methods: {
    //选择回访类型获取数据
    changeselect(e) {
      
      let returnStage = ''
      this.optionstypeName.forEach(value => {
        if (value.returnTypeId == e) {
          returnStage = value.returnVisitStage
        }
      })
      let data = {
        deptId: this.deptId,
        returnTypeId: e
      }
      this.$api.medical.returnVisitTypeList(data).then(res => {
        if (res) {
          if (res.rows.length == 0) {
            this.returnVisitRecordList = [
              {
                isOneReturnVisit: '',

                appointPeople: true,
                // returnExecutorUser: this.$store.getters.user.userId,
                planReturnUser: this.$store.getters.user.userId, // 选择执行人
                taskLevel: '',//等级
                planReturnTime: timeFmt('', new Date()),
                returnStage: '',
                grade: undefined,
                returnUserType: '', // 类型
                backupExecutor: '',// 后备执行人
                returnVisit: "",
              }
            ]
          } else {
            this.returnVisitRecordList = [];
            res.rows.forEach(value => {
              let currentDate = new Date();
              currentDate.setDate(currentDate.getDate() + value.intervalDays)
              this.returnVisitRecordList.push(
                {
                  isOneReturnVisit: '1',

                  appointPeople: true,
                  // returnExecutorUser: this.$store.getters.user.userId,
                  planReturnUser: this.$store.getters.user.userId, // 选择执行人
                  taskLevel: value.returnVisitLevel,//等级
                  planReturnTime: currentDate,
                  returnStage: returnStage,
                  grade: undefined,
                  returnUserType: '', // 类型
                  backupExecutor: '',// 后备执行人
                  returnVisit: value.returnVisit,
                }
              )
            })
          }
        }
      })
    },
    //获取回访类型
    getTypelist() {
      this.$api.medical.returnVisitTypeInfolist({
        deptId: this.deptId,
        type:'1'
      }).then(res => {
        if (res) {
          this.optionstypeName = res.rows
        }
      })
    },
    selectAll() {
      this.$emit('selectAllpeople')
    },
    // 高级弹层的指定回访人改变事件
    may(val) {
      if (val) {
        //取值
        let newlist = this.newlist.options.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
        //赋值
        for (let x in this.options) {
          if (this.options[x].label == this.newlist.label) {
            this.options[x].options = newlist
            this.options[x].values = val
          }
        }
      }
    },
    change(e, item) {
      if (item.appointPeople) {
        // this.manualFormRules.backupExecutor = []
        // this.$refs.forem.clearValidate(["backupExecutor"])
        item.returnUserType = ''
        item.backupExecutor = ''
        // item.manualFormRules.backupExecutor = []//将此项的校验规则清空
        item.planReturnUser = this.$store.getters.user.userId
      } else {
        item.planReturnUser = ''
        // this.manualFormRules.backupExecutor = [{ required: true, message: '请输入活动名称', trigger: 'change' }]
      }
    },
    // 小弹层的指定回访人改变事件
    Onechange(e) {
      if (e) {
        this.returnVisitRecordList[0].returnUserType = ''
        this.returnVisitRecordList[0].backupExecutor = ''
        this.returnVisitRecordList[0].planReturnUser = this.$store.getters.user.userId
      } else {
        this.returnVisitRecordList[0].planReturnUser = ''
      }
    },
    setInnerDialog() {
      this.getTypelist();
      this.returnTypeId = '';
      this.$emit('setInnerDialog')
    },
    closeDialog(ev) {
      this.returnVisitRecordList = [
        {
          isOneReturnVisit: '',
          appointPeople: true,
          // returnExecutorUser: this.$store.getters.user.userId,
          planReturnUser: this.$store.getters.user.userId, // 选择执行人
          taskLevel: '',
          planReturnTime: timeFmt('', new Date()),
          returnStage: '',
          grade: '',
          returnUserType: '', // 类型
          backupExecutor: ''// 后备执行人
        }

      ]
      this.manualFormRules.backupExecutor = [{ required: true, message: '请输入名称', trigger: 'change' }]
      this.$emit(ev)
    },
    newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
    // 点击保存后
    saveManual(form, isAddIndex) {
      let currindex = 0
      this.returnVisitRecordList.forEach((item, index) => {
      
        const formName = isAddIndex ? form + index : form
        const refForm = isAddIndex ? this.$refs[formName][0] : this.$refs[formName]
        if (refForm) {
          refForm.validate((valid) => {
            if (valid) {
              delete item.appointPeople
              currindex++
            }
          })
        }
      })
      if (currindex === this.returnVisitRecordList.length) {
        this.returnVisitRecordList.forEach(value=>{
          value.planReturnTime=this.newgetData(value.planReturnTime)
        })
        if(!isAddIndex){
          if(this.valueqj){
           this.returnVisitRecordList[0].planReturnTime=''
           this.returnVisitRecordList[0].startTime=this.newgetData(this.returnVisitRecordList[0].value1[0])
           this.returnVisitRecordList[0].endTime=this.newgetData(this.returnVisitRecordList[0].value1[1])
          }else{
            this.returnVisitRecordList[0].startTime=''
           this.returnVisitRecordList[0].endTime=''
          }
        }
        const data = {
          ids: this.selectionData.map(item => item.id).toString(),
          returnVisitRecordList: this.returnVisitRecordList
          // returnVisitHospitalDtoList: this.returnVisitRecordList
        }
        this.$api.modules.netPower.addManualData(data).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.closeDialog('closeShowManualDialog')// 小弹层的关闭事件
            this.closeDialog('closeInnerDialog')

            this.returnVisitRecordList = [
              {
                // isOneReturnVisit: '1',
                // appointPeople: true,
                // returnExecutorUser: this.$store.getters.user.userId,
                // taskLevel: '1',
                // planReturnTime: timeFmt('', new Date()),
                // returnStage: '1'
                isOneReturnVisit: '',
                appointPeople: true,
                // returnExecutorUser: this.$store.getters.user.userId,
                planReturnUser: this.$store.getters.user.userId, // 选择执行人
                taskLevel: '',
                planReturnTime: timeFmt('', new Date()),
                returnStage: '',
                grade: '',
                returnUserType: '', // 类型
                backupExecutor: ''// 后备执行人
              }
            ]
            // this.$router.go(0)
          }
        })
        // this.$api.modules.netPower.AlreadyArrivedAdd(data).then(res => {
        //   if (res) {
        //     this.$message.success(res.msg)
        //     this.closeDialog('closeShowManualDialog')//小弹层的关闭事件
        //     this.closeDialog('closeInnerDialog')
        //     this.returnVisitRecordList = [
        //       {
        //         // isOneReturnVisit: '1',
        //         // appointPeople: true,
        //         // returnExecutorUser: this.$store.getters.user.userId,
        //         // taskLevel: '1',
        //         // planReturnTime: timeFmt('', new Date()),
        //         // returnStage: '1'
        //         isOneReturnVisit: '',
        //         appointPeople: true,
        //         // returnExecutorUser: this.$store.getters.user.userId,
        //         planReturnUser: this.$store.getters.user.userId,//选择执行人
        //         taskLevel: '',
        //         planReturnTime: timeFmt('', new Date()),
        //         returnStage: '',
        //         grade: '',
        //         returnUserType: "",//类型
        //         backupExecutor: ''//后备执行人
        //       }
        //     ]
        //   }
        // })
      }
    },
    // }),
    // 添加手工上报选项
    addManualPlain() {
      let that=this;
      this.returnVisitRecordList.push({
        // isOneReturnVisit: '1',
        // appointPeople: true,
        // returnExecutorUser: this.$store.getters.user.userId,
        // taskLevel: '1',
        // planReturnTime: timeFmt('', new Date()),
        // returnStage: '1'
        isOneReturnVisit: '',
        appointPeople: true,
        // returnExecutorUser: this.$store.getters.user.userId,
        planReturnUser: this.$store.getters.user.userId, // 选择执行人
        taskLevel: '',
        planReturnTime: timeFmt('', new Date()),
        returnStage: '',
        grade: '',
        returnUserType: '', // 类型
        backupExecutor: ''// 后备执行人
      })
      setTimeout(function(){
        document.querySelector('.chatList').scrollTop = 1000000000
      })
    },
    // 远程搜索执行人
    querySearchAsync(queryString) {
      const _this = this
      this.loading = true
      this.$forceUpdate();
      if (queryString !== '') {
        //取值
        let newlist = this.newsysUserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(queryString.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, queryString)
        })
        this.sysUserList = newlist;
        this.$forceUpdate();

      } else {
        this.sysUserList = this.newsysUserList;
      }
      // this.getUserList(queryString, res => {
      //   _this.sysUserList = res
      //   _this.loading = false
      // })
    },
    // 获取系统用户列表
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          this.newsysUserList = arr1;
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 指定回访人
    // appointPeopleCheck (v) {
    //   if (v) {
    //     this.returnVisitRecordList[0].executionTypeId = undefined
    //   } else {
    //     this.returnVisitRecordList[0].returnExecutorUser = undefined
    //   }
    // },
    // 删除手工上报选项
    deleteManualItem(index) {
      if (index !== 0) {
        this.returnVisitRecordList.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chatList::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.chatList::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.chatList::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
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

.visitBox {
  width: 100%;

  ul {
    list-style: none;

    li {
      padding: 6px 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #c3ced5;
      border-top: 1px solid #c3ced5;
      background-color: #f5f5f5;
    }

    &>li:nth-of-type(odd) {
      border-bottom: none;
    }
  }
}

.innerVisitBox {
  margin-top: 20px;

  ul {
    li {
      padding: 6px 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #c3ced5 !important;
      border-top: 1px solid #c3ced5;
      background-color: #f5f5f5;
    }

    .visitContent {
      width: 100%;
      height: 160px;
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      &>div {
        width: 50%;
        padding: 0 20px;
        box-sizing: border-box;

        &>.title {
          padding: 0 10px;
          box-sizing: border-box;
          position: relative;
          font-weight: bold;
          margin-bottom: 10px;

          &:before {
            position: absolute;
            display: inline-block;
            top: 0;
            left: 0;
            bottom: 0;
            width: 3px;
            background-color: #1abc9c;
            content: "";
          }
        }
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

::v-deep .el-scrollbar {
  width: 100%;
  height: calc(100vh - 260px);
  box-sizing: border-box;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
