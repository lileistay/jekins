<template>
  <!--整形手术查询-->
  <div class="box">
    <sg-table
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
      @size-change="sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
        <template #custom="data">
            <div v-if="data.props === 'anesthesiaMethod'">
                <show-dict-data :options="dict.type.Anesthesia_mode" :value="data.custom.anesthesiaMethod" />
            </div>
            <div v-if="data.props === 'caozuoType'">
                <show-dict-data :options="dict.type.caozuo_type" :value="data.custom.caozuoType" />
            </div>
            <div v-if="data.props === 'operationType'">
                <show-dict-data :options="dict.type.type_of_operation" :value="data.custom.operationType" />
            </div>
            <div v-if="data.props === 'customerName'">
                <a style="color: #5f94de;cursor:pointer" @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }} </a>
            </div>
            <div v-if="data.props === 'orderNumber'">
                <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                    {{ data.custom.orderNumber }}
                </a>
            </div>
        </template>
      <div slot="searchBar" class="searchBar">
        <el-form :model="from" size="mini" label-width="120px" style="display: flex">
          <el-row>
            <el-col :xs="11" :sm="7" :lg="4" >
              <el-form-item label="客户姓名：">
                <el-input v-model="from.customerName" clearable/>
              </el-form-item>
                <el-form-item label="电话：">
                    <el-input v-model="from.customPhone" clearable/>
                </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="7" :lg="4">
              <el-form-item label="手术结束时间：">
                <el-date-picker
                  v-model="from.timeList"
                  style="width: 100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  clearable
                />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input v-model="from.customCardNumber" clearable/>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="7" :lg="4">
                <el-form-item label="护士">
                    <el-select v-model="from.circulatingNurse" clearable filterable>
                        <el-option
                                v-for="(item, idnex) in circulatingNurseList"
                                :key="idnex"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
              <el-form-item label="麻醉师：">
                      <el-select v-model="from.anesthesiologist" :filterable="true" clearable>
                          <el-option
                                  v-for="(item, idnex) in anesthesiologistList"
                                  :key="idnex"
                                  :label="item.label"
                                  :value="item.value"
                          />
                      </el-select>

              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="7" :lg="4">
                <el-form-item label="麻醉方式" prop="anesthesiaMethod">
                    <el-select v-model="from.anesthesiaMethod" :filterable="true" clearable>
                        <el-option
                                v-for="dict in dict.type.Anesthesia_mode"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
              <el-form-item label="主治医生：">
                  <el-select v-model="from.doctorId" :filterable="true" clearable>
                      <el-option
                              v-for="dict in doctorlist"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="7" :lg="4">
              <el-form-item label="实际执行医生：">
                  <el-select v-model="from.actualExecutorUser" :filterable="true" clearable>
                      <el-option
                              v-for="dict in doctorlist"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
              <el-form-item label="医助：">
                  <el-select v-model="from.doctorAssistant" filterable clearable>
                      <el-option
                              v-for="dict in doctorAssistantList"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                      />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="7" :lg="4">
              <el-form-item label="手术单号：">
                <el-input v-model="from.orderNumber" clearable/>
              </el-form-item>
              <el-form-item label="手术名称：">
                <el-input v-model="from.operationName" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
            <div style="margin-left: 30px;">
                <el-button size="mini" type="primary" icon="el-icon-search" @keydown.enter.native="getData(true)" @click="getData(true)">搜索</el-button>
            </div>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
<!--          <span style="color:#fff">人数汇总：37</span>-->
        </div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="customerDemand">客户需求</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="registration">整形复诊登记</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="openManualDialog">手工上报</el-button>
        </div>
      </div>
    </sg-table>
      <!---整形复诊登记--->
      <sg-dialog
              title="整形复诊登记"
              size="700px"
              v-if="showDialogS"
              :dialog="showDialogS"
              @handleClose="finishLabel"
              ref="form"
      >
          <div slot="out">
              <el-form
                      ref="form"
                      :inline="true"
                      :model="finishForm"
                      label-width="120px"
                      size="mini"
                      :rules="rules"

              >
                  <el-row style="margin-top: 20px">
                      <el-col
                              :span="12"
                      >
                          <el-form-item label="客户姓名：" >
                              <el-input v-model="finishForm.customerName" disabled />
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="手术开始时间：">
                              <el-input
                                      v-model="finishForm.startTime"
                                      disabled
                              />
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="手术结束时间：">
                              <el-input
                                      v-model="finishForm.endstartTime"
                                      disabled
                              />
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="手术编号：">
                              <el-input
                                      v-model="finishForm.orderNumber"
                                      disabled
                              />
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="医生：">
                              <el-input
                                      v-model="finishForm.doctorName"
                                      disabled
                              />
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" >
                          <el-form-item label="医助：">
                              <el-select v-model="finishForm.doctorAssistant" :filterable="true" clearable>
                                  <el-option
                                          v-for="dict in doctorAssistantList"
                                          :key="dict.value"
                                          :label="dict.label"
                                          :value="dict.value"
                                  />
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <!-- 没有字段 -->
                      <el-col :span="12" >
                          <el-form-item label="护士：">
                              <el-select v-model="finishForm.circulatingNurse" filterable clearable>
                                  <el-option
                                          v-for="(item, idnex) in circulatingNurseList"
                                          :key="idnex"
                                          :label="item.label"
                                          :value="item.value"
                                  />
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">
                          <el-form-item label="复诊项目：" prop="followupItem">
                              <el-select v-model="finishForm.followupItem" filterable clearable>
                                  <el-option
                                          v-for="(item, idnex) in dict.type.followup_item"
                                          :key="idnex"
                                          :label="item.label"
                                          :value="item.value"
                                  />
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" >
                          <el-form-item label="拆线备注信息：">
                              <el-input  v-model="finishForm.remark" />
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" >
                          <el-form-item label="登记时间：" prop="timeList">
                              <el-date-picker
                                      v-model="finishForm.timeList"
                                      style="width: 200px;"
                                      type="datetime"
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      clearable
                              />
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <div style="text-align: right">
                          <el-form-item label=" ">
                              <el-button
                                      size="mini"
                                      type="primary"
                                      plain
                                      @click="finishAdd"
                              >保存
                              </el-button>
                              <el-button
                                      size="mini"
                                      type="danger"
                                      plain
                                      @click="finishD"
                              >关闭
                              </el-button>
                          </el-form-item>
                  </div>
              </el-form>
          </div>
      </sg-dialog>
      <!-- 手工上报-->
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
import SgTable from '@/components/Table'
import {timeFmt,beforeDayTime,todayTime} from "@/utils/time"
import SgDialog from '@/components/Dialog'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
export default {
    // type_of_operation  手术类型   caozuo_type 手术状态  Anesthesia_mode 麻醉方式
    dicts: ['Anesthesia_mode', 'type_of_operation', 'caozuo_type', 'sys_user_sex','followup_item'],

    name: 'SurgicalInquiry',
  components: {
    SgTable, SgDialog,
      ManualSubmission
  },
  data() {
    return {
      from: {
        timeList: [beforeDayTime(7)[0], todayTime()[1]]
      },
      columns: [
        {
          lab: '客户姓名',
            val: 'customerName',
            custom: 'customerName',
            width: 120
        },
        {
          lab: '电话',
            val: 'customPhone',
            width: 120
        },
          {
              lab: '客户卡号',
              val: 'customCardNumber',
              width: 165
          },
          {
              lab: '手术单号',
              val: 'orderNumber',
              custom: 'orderNumber',
              width: 150
          },
          {
              lab: '主治医生',
              val: 'doctorName',
              width: 120
          },
          {
              lab: '实际执行人',
              val: 'executorName',
              width: 120
          },
          {
              lab: '医助',
              val: 'assistantName',
              width: 150
          },
          {
              lab: '护士',
              val: 'circulatingName'
          },
          {
              lab: '麻醉师',
              val: 'alName'
          },
          {
              lab: '麻醉方式',
              val: 'anesthesiaMethod',
              custom: 'anesthesiaMethod',
              width: 150
          },
        // {
        //   lab: '其他治疗人员',
        //   width: 140,
        //   val: ''
        // },
          {
              lab: '计划开始时间',
              val: 'yjStartTime',
              width: 150
          },
          {
              lab: '计划结束时间',
              val: 'yjEndTime',
              width: 150
          },
          {
              lab: '开始时间',
              val: 'startTime',
              width: 150
          },
          {
              lab: '结束时间',
              val: 'endTime',
              width: 150
          },
          {
              lab: '手术名称',
              val: 'operationName',
              width: 150
          },
          {
              lab: '手术状态',
              val: 'caozuoType',
              custom: 'caozuoType',
              width: 150
          },
          {
              lab: '手术类型',
              val: 'operationType',
              custom: 'operationType',
              width: 150
          },
          {
              lab: '手术室',
              val: 'treatmentRoom',
              width: 150
          },
        {
          lab: '备注',
          val: ''
        }
      ],
        tableData:[],
      pagination: {
          pageSize: 20, // 每页显示的条数
          total: 0, // 总条数
          pageNum: 1,
          show: true,
          currentPage: 1
      },
        doctorlist:[],//医生
        anesthesiologistList:[],//麻醉师
        circulatingNurseList:[],//护士
        doctorAssistantList:[],//医助
        timeList:[],//时间
        showDialogS:false,
        finishForm:{},//弹框表单
        selectionData:[],//复选框选中的数据
        showManualDialog:false,//手工上报弹框
        innerDialog: false,
        Action: {},
        rules:{
            followupItem: [
                { required: true, message: '请选择复诊', trigger: 'change' }
            ],
            timeList: [
                { required: true, message: '请选择登记时间', trigger: 'change' }
            ]
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
            this.getData()
            this.getUserList(val)
        }
    },
    created() {
      this.getData()
        this.getUserList(this.deptId)
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods:{
      // 列表数据
      getData(isSearch){
          if (isSearch) {
              this.pagination.pageNum = 1
              this.pagination.currentPage = 1
          }
          const query={
              deptId:this.deptId,
              customerName:this.from.customerName,
              data:this.from.customerName,//拆线时间
              startTime:this.from.timeList?timeFmt('YYYY-mm-dd HH:MM:SS', this.from.timeList[0]):'',
              endstartTime:this.from.timeList?timeFmt('YYYY-mm-dd HH:MM:SS', this.from.timeList[1]):'',
              customCardNumber:this.from.customCardNumber,
              circulatingNurse:this.from.circulatingNurse,
              anesthesiologist:this.from.anesthesiologist,
              anesthesiaMethod:this.from.anesthesiaMethod,
              actualExecutorUser:this.from.actualExecutorUser,
              doctorAssistant:this.from.doctorAssistant,
              orderNumber:this.from.orderNumber,
              operationName:this.from.operationName,
              customPhone:this.from.customPhone,
              isOperation:'1',//手术字段
              caozuoType:'2',
            doctorId:this.from.doctorId
          }
          const data={...this.pagination,...query}
          this.$api.medical.selectTreatment(data).then((res) => {
              if (res) {
                  this.tableData = res.rows
                  this.pagination.total = res.total
              }
          })
      },
        // 获取人员列表
        getUserList(deptId) {
            const data = {
                deptId: deptId,
                status: '0'
            }
            this.$api.user.getUserList(data).then((res) => {
                if (res) {
                    res.data.forEach((item) => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    const arr1 = this.unique(res.data)
                    this.sysUserList = arr1
                    res.data.forEach((item) => {
                        // 美学顾问
                        // if (item.postCode === 'Aesthetic_Consultant') {
                        //     this.options.aestheticConsultant.options.push(item)
                        // }
                        // 医生数组
                        if (item.postCode === 'doctor') {
                            this.doctorlist.push(item)
                            // 侧边搜素栏的医生数组
                            // this.options.doctorId.options.push(item)
                            // // 侧边搜索栏的实际执行人
                            // this.options.actualExecutorUser.options.push(item)
                        }
                        // // 麻醉师数组 没有麻醉师分类，暂时使用医生代替
                        if (item.postCode === 'anesthesiologist') {
                            this.anesthesiologistList.push(item)
                            // this.options.anesthesiologist.options.push(item)
                        }
                        // // 服务助理数组
                        // if (item.postCode === 'physician-assisted') {
                        //     this.options.serviceAssistant.options.push(item)
                        // }
                        // 医助

                        if (item.postCode === 'yizhu') {
                            this.doctorAssistantList.push(item)
                        }
                      // 护士数组
                        if (item.postCode === 'xhhushi' || item.postCode === 'zerennurse') {
                            this.circulatingNurseList.push(item)
                        }
                    })
                }
            })
        },
        // 数组的去重复
        unique(arr) {
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
        },
        // 点击跳转是否已到院路由
        customerclick(id, val) {
            this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
        },
        // 点击收费单编号
        orderNumber(data) {
            // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
            this.$router.push({ path: 'billDetails'})
          sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
        },
        // 分页
        change(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData() // 调用数据
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
        // 整形复诊登记
        registration(){
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客')
                return
            }
            if(this.selectionData[0].caozuoType!=2){
                this.$message.warning('请选择已治疗完成的顾客')
                return
            }
            this.finishForm={
                customerName:this.selectionData[0].customerName,
                startTime:this.selectionData[0].startTime,
                endstartTime:this.selectionData[0].endTime,
                orderNumber:this.selectionData[0].orderNumber,
                doctorName:this.selectionData[0].doctorName,
            }
          this.showDialogS=true
        },
        // 弹框关闭
        finishLabel(){
            this.showDialogS=false
        },
        // 复诊登记保存
        finishAdd(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const query = {
                        id:this.selectionData[0].id,
                        // followupId:this.finishForm.followupItem,
                        doctorAssistant:this.finishForm.doctorAssistant,//医助
                        nursing:this.finishForm.circulatingNurse,
                        createTime:timeFmt('YYYY-mm-dd HH:MM:SS',this.finishForm.timeList),
                        remark:this.finishForm.remark,
                        followupItem:this.finishForm.followupItem,
                        deductionId:this.selectionData[0].deductionId,
                        waitId:this.selectionData[0].waitId,
                        orderNumber:this.selectionData[0].orderNumber,
                        doctorId:this.selectionData[0].doctorId,
                        projectName:this.selectionData[0].projectName,


                    }
                    this.$api.medical.deductionOperationFollowupAdd(query).then((res) => {
                        if (res.code==200) {
                            this.$message('添加成功')
                            this.showDialogS=false
                        }
                    })


                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        finishD(){
            this.showDialogS=false
        },
        // 复选框的选中
        handleSelectionChange(e) {
            this.selectionData = []
            if (e[1].length > 1) {
                this.$refs.table.$refs.multipleTable.clearSelection()
                this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
            }
            this.selectionData.push(e[1].pop())
            this.$delete(this.selectionData, 1)
        },
        // 点击行内选择
        rowClick(e) {
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
        },
        // 客户需求
        customerDemand() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            if (this.selectionData.length > 1) {
                this.$message.warning('只能选择一名顾客')
                return
            }
            this.$router.push({ path: '/customerDemand', query: { id: this.selectionData[0].id }})
        },
        // 手工上报
        openManualDialog() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            this.Action = this.selectionData[0]
            this.showManualDialog = true
        },
        // 关闭手工上报高级选项
        closeInnerDialog(){
            this.innerDialog = false
        },
        // 关闭手工上报弹窗
        closeShowManualDialog(){
            this.showManualDialog = false
        },
        // 打开高级选项
        setInnerDialog(){
            this.innerDialog = true
            this.showManualDialog = false
        }
    }
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
  }
}
::v-deep .el-range__icon {
  display: none;
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
