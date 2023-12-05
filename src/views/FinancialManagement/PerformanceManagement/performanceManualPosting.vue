<template>
  <!-- 下账 -->
  <div class="contain">
    <div class="header">
      <div class="head-title">待执行业绩信息</div>
      <div class="head-contents">
        <el-form v-model="formData" :inline="true" :label-position="labelPosition" label-width="120px" size="mini">
          <el-form-item label="姓名:">
            <el-input v-model="formData.name" disabled />
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="formData.phone" disabled />
          </el-form-item>
          <el-form-item label="一级项目:">
            <el-input v-model="formData.FirstLevelProject" disabled />
          </el-form-item>
          <el-form-item label="二级项目:">
            <el-input v-model="formData.SecondLevelProject" disabled />
          </el-form-item>
          <el-form-item label="三级项目:">
            <el-input v-model="formData.thirdLevelProject" disabled />
          </el-form-item>
          <el-form-item label="四级项目:">
            <el-input v-model="formData.quaternarylevelProject" disabled />
          </el-form-item>
          <el-form-item  width="165" label="收费单编号:">
            <el-input v-model="formData.chargeNumber" disabled />
          </el-form-item>
          <el-form-item label="收费单类型:">
            <el-input v-model="formData.ChargeType" disabled />
          </el-form-item>
          <el-form-item label="欠款金额:">
            <el-input v-model="formData.arrears" disabled />
          </el-form-item>
          <el-form-item label="产品次数:">
            <el-input v-model="formData.productsNumber" disabled />
          </el-form-item>
          <el-form-item label="应付金额:">
            <el-input v-model="formData.amountPayable" disabled />
          </el-form-item>
          <el-form-item label="累计已付金额:">
            <el-input v-model="formData.accumulatedPaid" disabled />
          </el-form-item>
          <el-form-item label="剩余待执行业绩:">
            <el-input v-model="formData.performance" disabled />
          </el-form-item>
          <el-form-item label="剩余待执行业绩:" style="display: none;">
            <el-input disabled />
          </el-form-item>
          <el-form-item label="剩余待执行业绩" style="display: none;">
            <el-input disabled />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <div class="functionalArea">
        <el-button size="mini" type="primary" icon="el-icon-circle-plus" @click="PerformanceAllowance()">业绩冲抵</el-button>
        <el-button size="mini" type="primary" icon="eel-icon-circle-plus" @click="allocation">分配</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData">删除</el-button>
      </div>
      <div class="performance-content">
        <div class="performanceTitle">本次执行业绩</div>
        <el-table
          ref="multipleTables"
          :data="performanceTable"
          tooltip-effect="dark"
          style="width: 100%"
          :border="true"
          :header-cell-style="{'text-align':'center'}"
          type="index"
          size="mini"
          @selection-change="handleSelectionChanges"
          @row-click="rowClicks"
        >
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            prop=""
            label="序号"
            type="index"
            align="center"
            width="120"
          />
          <el-table-column
            label="医生"
            width="270"
            align="center"
            prop="doctorName"
          />
          <el-table-column
            prop="doctorAssistantName"
            label="医助"
            align="center"
            width="265"
          />
          <el-table-column
            prop="cnName"
            label="护士"
            align="center"
            width="265"
          />
          <el-table-column
            prop="acuName"
            label="执行人"
            align="center"
            width="265"
          />
          <el-table-column
            prop="operationTypeStatus"
            label="执行类型"
            align="center"
            width="265"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.operationTypeStatus==0">治疗单执行下账</span>
              <span v-if="scope.row.operationTypeStatus==2">退款冲减</span>
              <span v-if="scope.row.operationTypeStatus==3">手工下账</span>
              <span v-if="scope.row.operationTypeStatus==4">手工下账</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="performance"
            label="执行金额"
            align="center"
            width="265"
          />
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            width="265"
          />
        </el-table>
      </div>

      <div class="performanceExecution-content">
        <div class="performanceTitle">已执行业绩</div>
        <el-table
          ref="multipleTable"
          :data="tableDatas"
          tooltip-effect="dark"
          style="width: 100% "
          :header-cell-style="{'text-align':'center'}"
          highlight-current-row
          size="mini"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          />
          <el-table-column
            prop=""
            label="序号"
            type="index"
            align="center"
            width="120"
          />
          <el-table-column
            prop="treatmentTime"
            label="执行时间"
            align="center"
            width="200"
          />
          <el-table-column
            prop="doctorName"
            align="center"
            label="医生"
            width="200"
          />
          <el-table-column
            prop="doctorAssistantName"
            label="医助"
            align="center"
            width="200"
          />
          <el-table-column
            prop="cnName"
            label="护士"
            align="center"
            width="200"
          />
          <el-table-column
            prop="acuName"
            label="执行人"
            align="center"
            width="200"
          />
          <el-table-column
            prop="operationTypeStatus"
            label="业绩类型"
            align="center"
            width="200"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.operationTypeStatus==0">治疗单执行下账</span>
            <span v-if="scope.row.operationTypeStatus==2">退款冲减</span>
            <span v-if="scope.row.operationTypeStatus==3">手工下账</span>
            <span v-if="scope.row.operationTypeStatus==4">手工下账</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="performance"
            label="执行业绩"
            align="center"
            width="240"
          />
          <el-table-column
            prop="remark"
            label="治疗备注"
            align="center"
            width="240"
          />
        </el-table>
      </div>
      <div class="footerButton">
        <el-button size="mini" type="primary" icon="el-icon-circle-plus" @click="save">保存</el-button>
        <el-button size="mini" @click="close">关闭</el-button>
      </div>
    </div>

    <!-- 弹框冲抵-->
    <sg-dialog
        ref="sg-dialog"
        :title="dialogTitle"
        :dialog="showDialog"
        @handleClose="handleClose"
        :size="'400px'"
    >
      <div slot="out">
        <el-form  ref="sgDialogForm" :model="form" :disabled="loading" size="mini" :rules="rules" label-width="125px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="医生" prop="doctorId">
                <el-select v-model="form.doctorId" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="(item,index) in doctorData"
                      :key="index+'doctor'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="医助" prop="doctorAssistant">
                <el-select v-model="form.doctorAssistant" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in physicianAssistantData"
                      :key="item.userId + 'dct'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="护士" prop="circulatingNurse">
                <el-select v-model="form.circulatingNurse" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in nurseData"
                      :key="item.userId + 'cnName'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="实际手术执行人" prop="actualExecutorUser">
                <el-select v-model="form.actualExecutorUser" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in operativeData"
                      :key="item.userId +'acuName1'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="10">
              <el-form-item label="执行类型" prop="operationTypeStatus">
                <el-select v-model="form.operationTypeStatus" style="width: 240px;" clearable filterable placeholder="请选择" disabled>
                  <el-option
                      v-for="item in executionType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="执行金额" prop="performance">
                <el-input v-model="form.performance" style="width: 240px;" :rows="4" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" style="width: 220px;" :rows="4" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="30">
              <el-form-item>
                <el-button type="primary" @click="submitForm(form)">保存</el-button>
                <el-button @click="showDialog=false">关闭</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sg-dialog>
    <!-- 弹框分配-->
    <sg-dialog
        ref="sg-dialog"
        title="分配"
        :dialog="showDialog1"
        @handleClose="handleClose1"
        :size="'400px'"
    >
      <div slot="out">
        <el-form ref="sgDialogForm1" :model="formlist" :disabled="loading" size="mini" :rules="rules1" label-width="124px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="医生" prop="doctorId">
                <el-select v-model="formlist.doctorId" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="(item,index) in doctorData"
                      :key="index+'doctor'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="医助" prop="doctorAssistant">
                <el-select v-model="formlist.doctorAssistant" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in physicianAssistantData"
                      :key="item.userId + 'dct'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="护士" prop="circulatingNurse">
                <el-select v-model="formlist.circulatingNurse" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in nurseData"
                      :key="item.userId + 'cnName'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="实际手术执行人" prop="actualExecutorUser">
                <el-select v-model="formlist.actualExecutorUser" style="width: 240px;" clearable filterable placeholder="请选择">
                  <el-option
                      v-for="item in operativeData"
                      :key="item.userId +'acuName1'"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="10">
              <el-form-item label="执行类型" prop="operationTypeStatus">
                <el-select v-model="formlist.operationTypeStatus" style="width: 240px;" clearable filterable placeholder="请选择" disabled>
                  <el-option
                      v-for="item in executionType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="执行金额" prop="performance">
                <el-input v-model="formlist.performance" style="width: 240px;" :rows="4" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="formlist.remark" style="width: 220px;" :rows="4" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="30">
              <el-form-item>
                <el-button type="primary" @click="submitForm1(formlist)">保存</el-button>
                <el-button @click="showDialog1=false">关闭</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sg-dialog>
  </div>

</template>

<script>
import sgDialog from '@/components/Dialog'
import {timeFmt} from "../../../utils/time";
export default {
  name: 'PerformanceManualPosting',
  dicts: ['billing_type', 'operation_type_status', ' post_code'],
  components: {
    sgDialog
  },
  data() {
    return {

      dialogVisible: false,
      dialogTitle: undefined,
      showDialog: false,
      loading: false,
      contentdata: {},
      performanceTable: [],
      selectData: [],
      tableDatas: [],
      formData: {
        name: '',
        phone: '',
        customerType: '',
        FirstLevelProject: '',
        SecondLevelProject: '',
        thirdLevelProject: '',
        quaternarylevelProject: '',
        chargeNumber: '',
        ChargeType: '',
        arrears: '',
        productsNumber: '',
        amountPayable: '',
        accumulatedPaid: '',
        performance: ''
      },
      form: {
        deductionId:null,
        doctorId: null,
        doctorAssistant: null,
        circulatingNurse: null,
        actualExecutorUser: null,
        operationTypeStatus: null,
        performance: null,
        remark: null
      },
      executionType: [],
      doctorData: [], // 医生列表
      physicianAssistantData: [], // 医生助理列表
      nurseData: [], // 护士列表
      operativeData: [], // 手术执行人
      rules: {
          doctorAssistant: [{required: true, message: '请选择', trigger: 'change'}],
          actualExecutorUser: [{ required: true, message: '请选择', trigger: 'change' }]
      },
        rules1: {
            doctorAssistant: [{ required: true, message: '请选择', trigger: 'change' }],
            actualExecutorUser: [{ required: true, message: '请选择', trigger: 'change' }]
        },
      doctorOptions: undefined,
      // formLabelWidth: '120px',
      labelPosition: 'right',
      saveData: {},
      selectDataList:[],
      showDialog1:false,
      formlist:{
        deductionId:null,
        doctorId: null,
        doctorAssistant: null,
        circulatingNurse: null,
        actualExecutorUser: null,
        operationTypeStatus: null,
        performance: null,
        remark: null
      },
      fenpeiList:[],
      chundiList:[]
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
      this.getUserList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.executionType = this.dict.type.operation_type_status
    this.contentdata = JSON.parse(this.$route.query.order)
    this.formData.name = this.contentdata[0].customerName
    this.formData.phone = this.contentdata[0].customPhone
    this.formData.FirstLevelProject = this.contentdata[0].departmentName
    this.formData.SecondLevelProject = this.contentdata[0].projectTypeName
    this.formData.thirdLevelProject = this.contentdata[0].bookingPeojectName
    this.formData.quaternarylevelProject = this.contentdata[0].projectName
    this.formData.chargeNumber = this.contentdata[0].orderNumber
    this.formData.ChargeType = this.contentdata[0].billtype
    this.formData.arrears = this.contentdata[0].debtAmount
    this.formData.productsNumber = this.contentdata[0].priceNum
    this.formData.amountPayable = this.contentdata[0].totalAmount
    this.formData.accumulatedPaid = this.contentdata[0].totalPayment
    this.formData.performance = this.contentdata[0].performance
    this.getDeductionRecord()

  },
  methods: {

    rowClick(row) { // 选择每一行
      this.$refs.multipleTable.toggleRowSelection(row)
      const select = this.$refs.multipleTable.selection
      this.handleSelectionChange(select)
    },

    handleSelectionChange(row) {
      this.selectData = row
    },
    //本次执行业绩选择框
    handleSelectionChanges(row){
      this.selectDataList = row
    },
      rowClicks(row) { // 选择每一行
          console.log('fff')
          this.$refs.multipleTables.toggleRowSelection(row)
          const select = this.$refs.multipleTables.selection
          this.handleSelectionChanges(select)
      },
    submitForm() { // 保存
      this.$refs.sgDialogForm.validate((valid) => {
       if (valid) {
          if (this.form.doctorId !== undefined) {
            const doctorName = this.doctorData.find(item => item.userId === this.form.doctorId).nickName
            this.form.doctorName = doctorName
          }
          if (this.form.doctorAssistant !== undefined) {
            const doctorAssistantName = this.physicianAssistantData.find(item => item.userId === this.form.doctorAssistant).nickName;
            this.form.doctorAssistantName = doctorAssistantName
          }
          if (this.form.circulatingNurse !== undefined) {
            const cnName = this.nurseData.find(item => item.userId === this.form.circulatingNurse).nickName
            this.form.cnName = cnName
          }
          if (this.form.actualExecutorUser !== undefined) {
            const acuName = this.operativeData.find(item => item.userId === this.form.actualExecutorUser).nickName
            this.form.acuName = acuName
          }
          this.form.genAmentTime=timeFmt('YYYY-mm-dd HH:MM:SS', new Date())
          this.form.performance = 0 - this.form.performance
          this.form.operationTypeStatus = '2'
          this.performanceTable.push(this.form)
          this.showDialog = false
            }
        })
    },
    submitForm1() { // 保存
        this.$refs.sgDialogForm1.validate((valid) => {
            if (valid) {
                if (this.formlist.doctorId !== undefined) {
                    const doctorName = this.doctorData.find(item => item.userId === this.formlist.doctorId).nickName
                    this.formlist.doctorName = doctorName
                }
                if (this.formlist.doctorAssistant !== undefined) {
                    const doctorAssistantName = this.physicianAssistantData.find(item => item.userId === this.formlist.doctorAssistant).nickName;
                    this.formlist.doctorAssistantName = doctorAssistantName
                }
                if (this.formlist.circulatingNurse !== undefined) {
                    const cnName = this.nurseData.find(item => item.userId === this.formlist.circulatingNurse).nickName
                    this.formlist.cnName = cnName
                }
                if (this.formlist.actualExecutorUser !== undefined) {
                    const acuName = this.operativeData.find(item => item.userId === this.formlist.actualExecutorUser).nickName
                    this.formlist.acuName = acuName
                }
                // this.formlist.performance = 0 - this.formlist.performance
                this.formlist.operationTypeStatus = '3'
                this.performanceTable.push(this.formlist)
                this.showDialog1 = false
            }
        })
    },
    allocation() {
        this.getUserList()
      if (this.selectData.length === 1) {

        this.formlist={
          deductionId:this.selectData[0].deductionId,
          doctorId: this.selectData[0].doctorId,
          circulatingNurse: this.selectData[0].circulatingNurse,
          actualExecutorUser: '',
          operationTypeStatus: '3',
          performance: this.selectData[0].performance,
          remark: this.selectData[0].remark,
          acuName: this.selectData[0].acuName,
          caozuoType: this.selectData[0].caozuoType,
          cnName: this.selectData[0].cnName,
          deductionAmount: this.selectData[0].deductionAmount,
          departmentId: this.selectData[0].departmentId,
          deptId: this.selectData[0].deptId,
          deviceId: this.selectData[0].deviceId,
          doctorAssistant: this.selectData[0].doctorAssistant==0?'':this.selectData[0].doctorAssistant,
          doctorName: this.selectData[0].doctorName,
          endTime: this.selectData[0].endTime,
          estimateScribingNum : this.selectData[0].estimateScribingNum,
          id: this.selectData[0].id,
          isExperience: this.selectData[0].isExperience,
          nursing: this.selectData[0].nursing,
          orderNumber: this.selectData[0].orderNumber,
          projectType: this.selectData[0].projectType,
          returnTypeId: this.selectData[0].returnTypeId,
          serviceAssistant: this.selectData[0].serviceAssistant,
          state: this.selectData[0].state,
          t4: this.selectData[0].t4,
          t5: this.selectData[0].t5,
          terraceType: this.selectData[0].terraceType,
          thisScribingNum: this.selectData[0].thisScribingNum,
          treatmentLength: this.selectData[0].treatmentLength,
          treatmentStatus: this.selectData[0].treatmentStatus,
          treatmentTime: this.selectData[0].treatmentTime,
          triagePersonTime: this.selectData[0].triagePersonTime,
          triagePersonUser: this.selectData[0].triagePersonUser,
          waitId: this.selectData[0].waitId,
          waitSource: this.selectData[0].waitSource,
          isExecute:this.selectData[0].isExecute
        }
      } else if (this.selectData.length === 0) {
        this.$message.warning('请先选择一条数据')
        return
      } else if (this.selectData.length > 1) {
        this.$message({
          message: '每次只能选择一条数据'
        })
          return
      }
        this.showDialog1 = true
    }, // 分配
    getDeductionRecord() {
      const data = {
        waitId: this.contentdata[0].waitId,
          deptId:this.deptId
      }
      this.$api.demand.deductionRecord(data).then(res => {
        this.tableDatas = res.data
      })
    },
    // 业绩冲抵弹框
    PerformanceAllowance() {
      if (this.selectData.length<=0){
          this.$message.warning('请先选择一条数据！')
          return
      }
      if (this.selectData[0].operationTypeStatus==2){
        this.$message.warning('不能选冲账记录。请选择一条已执行业绩的下账记录冲抵！')
        return
      }
      this.dialogTitle = '业绩冲抵'
      this.showDialog = true
      this.getUserList()
      if (this.selectData.length === 1) {
        this.form={
          deductionId:null,
          doctorId: this.selectData[0].doctorId,
          circulatingNurse: this.selectData[0].circulatingNurse,
          actualExecutorUser: '',
          operationTypeStatus: '2',
          performance: this.selectData[0].performance,
          remark: this.selectData[0].remark,
        acuName: this.selectData[0].acuName,
        caozuoType: this.selectData[0].caozuoType,
        cnName: this.selectData[0].cnName,
        deductionAmount: this.selectData[0].deductionAmount,
        departmentId: this.selectData[0].departmentId,
        deptId: this.selectData[0].deptId,
        deviceId: this.selectData[0].deviceId,
        doctorAssistant: this.selectData[0].doctorAssistant==0?'':this.selectData[0].doctorAssistant,
        doctorName: this.selectData[0].doctorName,
        endTime: this.selectData[0].endTime,
        estimateScribingNum : this.selectData[0].estimateScribingNum,
        id: this.selectData[0].id,
        isExperience: this.selectData[0].isExperience,
        nursing: this.selectData[0].nursing,
        orderNumber: this.selectData[0].orderNumber,
        projectType: this.selectData[0].projectType,
        returnTypeId: this.selectData[0].returnTypeId,
        serviceAssistant: this.selectData[0].serviceAssistant,
        state: this.selectData[0].state,
        t4: this.selectData[0].t4,
        t5: this.selectData[0].t5,
        terraceType: this.selectData[0].terraceType,
        thisScribingNum: this.selectData[0].thisScribingNum,
        treatmentLength: this.selectData[0].treatmentLength,
        treatmentStatus: this.selectData[0].treatmentStatus,
        treatmentTime: this.selectData[0].treatmentTime,
        triagePersonTime: this.selectData[0].triagePersonTime,
        triagePersonUser: this.selectData[0].triagePersonUser,
        waitId: this.selectData[0].waitId,
        waitSource: this.selectData[0].waitSource,
        isExecute:this.selectData[0].isExecute
        }
      } else if (this.selectData.length === 0) {
        this.$msgbox({
          title: '消息',
          message: '必须选择一条数据',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        this.showDialog = false
      } else if (this.selectData.length > 1) {
        this.$message({
          message: '每次只能选择一条数据'
        })
        this.showDialog = false
      }
    },
    getUserList() { // 获取医生列表
      const data = {
        deptId: this.deptId
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            this.physicianAssistantData.push(item)
            if (item.postCode === 'doctor' || item.postCode === 'chks' || item.postCode === 'therapeutist') {
              this.doctorData.push(item)
              this.operativeData.push(item)
            }
            if (item.postCode === 'zerennurse') {
              this.nurseData.push(item)
            }
          })
          this.physicianAssistantData = this.unique(this.physicianAssistantData)
          this.operativeData = this.unique(this.operativeData)
          this.nurseData = this.unique(this.nurseData)
          this.doctorData = this.unique(this.doctorData)
        }
      })
    },
    unique(arr) { // 去重字典
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      // this.selectData = []
    },
    // 关闭弹窗
    handleClose1() {
      this.showDialog1 = false
      // this.selectData = []
    },
    save() { // 保存
      this.fenpeiList=this.performanceTable.filter(item=>item.deductionId!=null)
      this.chundiList=this.performanceTable.filter(item=>item.deductionId==null)
      //分配业绩调用接口
      if (this.fenpeiList.length>0){
        this.fenpeiList.forEach(item=>{
          this.$api.demand.perDeductionPut(item).then(res => {
            if (res.code=='200'){
              this.$message.success(res.msg)
            }
          })
        })
      }
      //冲抵业绩调用接口
      if (this.chundiList.length>0){
        this.chundiList.forEach(item=>{
          this.$api.demand.perDeduction(item).then(res => {
            if (res.code=='200'){
              this.$message.success(res.msg)
                this.$router.go(-1)
            }
          })
        })
      }
      this.getDeductionRecord()
    },
    close(){
        this.$router.go(-1)
    },
    deleteData() {
      if (this.selectDataList.length<=0){
        this.$message.warning('请先选择一条数据')
        return
      }
      this.performanceTable=this.performanceTable.filter(item =>item.deductionId!=this.selectDataList[0].deductionId)
    }
  }

}

</script>

  <style scoped lang="scss">
  ::v-deep .el-form-item--mini .el-form-item__error {
    padding-top: 1px;
    /* display: inline-block; */
    white-space: nowrap !important;
  }
     .footerButton{
        position: fixed;
        right: 5px;
        bottom: 0;
     }
     .contain{
        width: 100%;
        height: 100%;
     }

     .header{
       margin-top: 10px;
     }

     .head-title{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        padding-left: 20px;
        box-sizing: border-box;

     }

     .performance-content{
        /* display: flex; */
        width: 100%;
        height: 200px;
        /* border: 1px solid black; */
        padding: 0 20px;
        box-sizing: border-box;
        margin-bottom: 20px;
     }

     .functionalArea{
        height: 40px;
        text-align: right;
        margin-top: 20px;
        padding-right: 10px;
        box-sizing: border-box;
     }
     .performanceExecution-content{
        /* display: flex; */
        width: 100%;
        height: 200px;
        /* border: 1px solid black; */
        padding: 0 20px;
        box-sizing: border-box;
     }

     .performanceTitle{
        width: 100%;
        height: 30px;
        font-weight: bolder;
        font-size: 16px;
        line-height: 30px;
        padding-left: 20px;
        box-sizing: border-box;

     }

      .head-contents{
         text-align: left;
      }
    ::v-deep .el-form-item{
        margin-bottom: 10px !important;
        margin-right: 20px;
     }

     .detail{
        position: absolute;
        position: absolute;
        left: 50%;
        margin-left: -50px;
        top: 50%;
        margin-top: -75px;
        width: 100px;
        height: 150px;
        background-color: red;
     }
     .el-input{
       width: 100px;
     }
     ::v-deep .sg-dialog{
       width: 418px !important;
     }

  </style>
