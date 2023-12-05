<template>
  <!--皮肤治疗登记-->
  <div>
    <slideSearch :options="options" >
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @keydown.enter.native="getData(true)" @click.stop="getData(true)"
        >查询
        </el-button>
        <!-- <el-button v-has-permi="['confinement:customerReservationForm:exportguest']" size="mini" type="success"
                   icon="el-icon-upload2" plain :loading="submitLoading" @click="exportExcel">导出
        </el-button> -->
      </div>
     <slot>
      <sg-table
      ref="table"
      size="mini"
      row-key="deductionId"
      :sg-ref="'multipleTable'"
      :selection="true"
      :border="true"
      index="序号"
      :expand-row-keys="expands"
      :highlight-current-row="true"
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      :header-style="{backgroundColor:'#f5eae4'}"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @expand-change="expandChange"
    >
      <div slot="searchBar" class="searchBar">
        <!-- <el-form size="mini" label-width="150px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="客户姓名：">
                <el-input v-model="form.customerName" :clearable="true" />
              </el-form-item>
              <el-form-item label="电话：">
                <el-input v-model.number="form.customPhone" maxlength="11" :clearable="true" />
              </el-form-item>
              <el-form-item label="项目：">
                <el-input v-model="form.projectName" :clearable="true" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="客户卡号：">
                <el-input v-model="form.customCardNumber" style="width: 115%;" :clearable="true" />
              </el-form-item>
              <el-form-item label="治疗时间：" prop="treatmentTime">
                <el-date-picker
                  v-model="form.treatmentTime"
                  style="width: 115%;"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </el-form-item>
              <el-form-item label="分诊时间：" prop="triagePersonTime">
                <el-date-picker
                  v-model="form.triagePersonTime"
                  style="width: 115%;"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="实际执行人：" prop="actualExecutorUser">
                <el-select v-model="form.actualExecutorUser" :filter-method="actualFilter" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in sysUserList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="护理：" prop="nursing">
                <el-select v-model="form.nursing" :filter-method="nursingFilter" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in zerennurse"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="巡回护士：" prop="circulatingNurse">
                <el-select v-model="form.circulatingNurse" :filter-method="nursingFilter" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in zerennurse"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="美学顾问：">
                <el-select v-model="form.aestheticConsultant" :filter-method="aestheFilter" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in esthetics"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="医生：" prop="doctorId">
                <el-select v-model="form.doctorId" :filter-method="doctorFilter" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in doctor"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="治疗状态：" prop="state">
                <el-select v-model="form.state" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in dict.type.treatment_type"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="回访类型：" prop="returnTypeId">
                <el-select v-model="form.returnTypeId" :filterable="true" :clearable="true">
                  <el-option
                    v-for="(item, index) in returnVisitType"
                    :key="index"
                    :label="item.typeName"
                    :value="item.returnTypeId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" style="margin-left: 5px" @click="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> -->
      </div>
      <div slot="header" class="header">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
          <span><i style="background-color:#ffffff" />已安排</span>
          <span><i style="background-color:#c6f9c3" />已执行</span>
          <span><i style="background-color:#ffff00" />已取消</span>
          <span>人数：</span>
        </div>
        <div>
          <el-button  size="mini" type="primary" plain
                     class="headerBarBtn" @click="initiateTreatmentcode">扫码签名
          </el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="customerDemand" v-has-permi="['MedicalManagement:SkinCenter:read']">客户需求</el-button>
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="sendMessage">发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="openManualDialog" v-has-permi="['MedicalManagement:SkinCenter:tret']">手工上报</el-button>
          <!--          <el-button size="mini" type="primary" icon="el-icon-bank-card">护理分值</el-button>-->
          <!--          <el-button size="mini" type="primary" icon="el-icon-bank-card">医助分值</el-button>-->
          <!--          <el-button size="mini" type="primary" icon="el-icon-bank-card">年卡</el-button>-->
          <!--          <el-button size="mini" type="primary" icon="el-icon-bank-card">套餐</el-button>-->
          <el-button size="mini" :plain="true" type="danger" icon="el-icon-close" @click="cancel" v-has-permi="['MedicalManagement:SkinCenter:calcle']">取消治疗</el-button>
          <el-button size="mini" :plain="true" type="primary" icon="el-icon-plus" @click="initiateTreatment" v-has-permi="['MedicalManagement:SkinCenter:add']"> 发起治疗</el-button>
          <!--          <el-button size="mini" type="success" icon="el-icon-plus">扫码签名</el-button>-->
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props==='customerName'">
          <a style="color: #5f94de;cursor: pointer;" @click="customerclick(data.custom.id, data.custom)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props==='state'">
          <show-dict-data :options="dict.type.treatment_type" :value="data.custom.state" />
        </div>
        <div v-else-if="data.props==='projectType'">
          <show-dict-data :options="dict.type.project_type" :value="data.custom.projectType" />
        </div>
        <div v-else-if="data.props==='terraceType'">
          <show-dict-data :options="dict.type.terrace_type" :value="data.custom.terraceType" />
        </div>
      </template>
      <template #expands="data">
        <span style="font-size: 14px;padding: 0 10px">
          <i class="el-icon-printer" style="color: #5f94de" />
          <a style="color: #5f94de;cursor: pointer" @click="printToBoTreatment(data.expands)">打印待治疗单</a>
        </span>
        <span style="font-size: 14px;padding: 0 10px">
          <i class="el-icon-printer" style="color: #5f94de" />
          <a style="color: #5f94de;cursor: pointer" @click="printSchedule(data.expands)">打印排期表</a>
        </span>
        <span style="font-size: 14px;padding: 0 10px">
          <i class="el-icon-printer" style="color: #5f94de" />
          <a style="color: #5f94de;cursor: pointer" @click="printTreatment(data.expands)">打印治疗单</a>
        </span>
      </template>
    </sg-table>
      </slot>
      </slideSearch>

    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <send-message
      :show-send-message-dialog="showSendMessageDialog"
      :selection-data="selectionData"
      @closeDialog="closeDialog"
    />
    <vue-easy-print ref="treatmentPrint">
      <treatment-print :print="treatmentPrint" :details="treatmentDetails" />
    </vue-easy-print>
    <vue-easy-print ref="toBeTreatmentPrint">
      <toBeTreatment-print :print="toBeTreatmentPrint" :details="toBeTreatmentDetails" />
    </vue-easy-print>
    <vue-easy-print ref="schedulePrint">
      <schedule-print :print="print" :details="details" />
    </vue-easy-print>
    <sgDialog title="扫码签名" size="500px" out-top="2%" :dialog="qrcode"
              @handleClose="qrcode=false">
      <div slot="out" style="width: 100%;height: 500px">
        <img :src="imgqrcode" style="width: 460px;height: 500px">
      </div>
    </sgDialog>
  </div>
</template>

<script>
import vueEasyPrint from 'vue-easy-print'
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import SendMessage from '@/components/SendMessage'
import treatmentPrint from '@/components/Print/treatmentPrint'
import toBeTreatmentPrint from '@/components/Print/toBeTreatmentPrint'
import schedulePrint from '@/components/Print/schedulePrint'
import {beforeDayTime, newgetData, todayTime} from '@/utils/time'
import PinyinMatch from 'pinyin-match'
import slideSearch from '@/components/SlideSearchBar/index'
import moment from 'moment'
import sgDialog from '@/components/Dialog/index'
import QRCode from "qrcode";
export default {
  name: 'SkinTreatment',
  dicts: ['sys_user_sex', 'treatment_type', 'project_type', 'terrace_type'],
  components: {
    vueEasyPrint,
    SgTable,
    ManualSubmission,
    SendMessage,
    treatmentPrint,
    toBeTreatmentPrint,
    schedulePrint,
    slideSearch,
    sgDialog
  },
  data() {
    return {
      qrcode:false,
      imgqrcode:'',
      options:{
        treatmentTime:{
          type: 'Tdatetime',
          label: '治疗时间',
          clearable: true,
          values: []
        },
        triagePersonTime:{
          type: 'Tdatetime',
          label: '分诊时间',
          clearable: true,
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号'
        },
        customPhone:{
          type: 'input',
          label: '电话号码'
        },
        projectName:{
          type: 'input',
          label: '项目名称'
        },
        nursing: {
          type: 'select',
          label: '护理',
          clearable: true,
          options: []
        },
        circulatingNurse:{
          type: 'select',
          label: '巡回护士',
          clearable: true,
          options: []
        },
        actualExecutorUser:{
          type: 'select',
          label: '实际执行人',
          clearable: true,
          options: []
        },
        doctorId:{
          type: 'select',
          label: '医生',
          clearable: true,
          options: []
        },
        returnTypeId:{
          type: 'select',
          label: '回访类型',
          clearable: true,
          options: []
        },
        aestheticConsultant:{
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        state:{
          type: 'select',
          label: '治疗状态',
          clearable: true,
          options: []
        }
      },
      Action: {},
      expands: [], // 存放展开行的ID
      loadingData: false,
      sysUserList: [],
      sysUser: [],
      zerennurse: [],
      zerennurseList: [],
      esthetics: [],
      estheticsList: [],
      doctor: [],
      doctorList: [],
      tableData: [],
      selectionData: [],
      returnVisitType: [],
      innerDialog: false,
      showManualDialog: false,
      showSendMessageDialog: false,
      columns: [
        {
          lab: '打印',
          val: 'print',
          expands: {}
        },
        {
          lab: '客户',
          val: 'customerName',
          custom: 'customerName',
          width: 80
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '项目',
          val: 'projectName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '项目类型',
          val: 'projectType',
          width: 100,
          custom: 'projectType'
        },
        {
          lab: '排台类型',
          val: 'terraceType',
          width: 100,
          custom: 'terraceType'
        },
        {
          lab: '回访类型',
          val: 'typeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '治疗状态',
          val: 'state',
          custom: 'state',
          width: 70
        },
        {
          lab: '治疗时长',
          val: 'treatmentLength',
          width: 70
        },
        {
          lab: '计划治疗次数',
          val: 'estimateScribingNum',
          width: 95
        },
        {
          lab: '当次治疗次数',
          val: 'thisScribingNum',
          width: 95
        },
        {
          lab: '医生',
          val: 'doctorName',
          width: 100
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 90
        },
        {
          lab: '护理',
          val: 'nursingName',
          width: 90
        },
        {
          lab: '巡回护士',
          val: 'circulatingName',
          width: 90
        },
        {
          lab: '实际执行人',
          val: 'executorName',
          width: 100
        },
        {
          lab: '分诊人',
          val: 'tpName',
          width: 100
        },
        {
          lab: '分诊时间',
          val: 'triagePersonTime',
          width: 140
        },
        {
          lab: '分诊备注',
          val: 'remark',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '治疗时间',
          val: 'treatStartTime',
          width: 140
        }
      ],
      form: {
        customerName: '', // 姓名
        customPhone: '', // 电话
        customCardNumber: '', // 卡号
        projectName: '', // 项目
        aestheticConsultant: '', // 现场咨询
        doctorId: '', // 医生
        customerRepresentative: '', // 客户代表
        returnVisitKeyword: '', // 项目名称
        state: '',
        treatmentTime: '',
        triagePersonTime: todayTime(),
        actualExecutorUser: '',
        nursing: '',
        circulatingNurse: '',
        returnTypeId: ''
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      treatmentPrint: {
        customName: undefined,
        departmentName: undefined,
        customPhone: undefined,
        treatmentTime: undefined
      },
      treatmentDetails: [],
      toBeTreatmentPrint: {
        customName: undefined,
        departmentName: undefined,
        customPhone: undefined,
        doctorName: undefined
      },
      toBeTreatmentDetails: [],
      print: {
        customName: undefined,
        departmentName: undefined,
        customCardNumber: undefined
      },
      details: []
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
      this.getReturnVisitType()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getReturnVisitType()
    this.getData()
    let that=this;
    setTimeout(function(){
      that.options.state.options=that.dict.type.treatment_type
    },1000)
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    initiateTreatmentcode(){
      if(this.selectionData.length==0){
        this.$message.warning('请选择一条数据进行签名');
        return
      }
      this.qrcode=true;
      let that=this;
      const qrCodeCanvas = document.createElement("canvas");
      qrCodeCanvas.width = 460;
      qrCodeCanvas.height = 500;
      QRCode.toCanvas(
        qrCodeCanvas,
        `https://www.crm120.cn/cosmetic?qrcode=1&deductionId=${this.selectionData[0].deductionId}`,
        { width:460, height:500 },
        (any) => {
          that.imgqrcode=qrCodeCanvas.toDataURL("image/png")
        }
      );
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    actualFilter(val) {
      if (val) {
        this.sysUserList = this.sysUser.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.sysUserList = this.sysUser
      }
    },
    nursingFilter(val) {
      if (val) {
        this.zerennurse = this.zerennurseList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== 1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.zerennurse = this.zerennurseList
      }
    },
    aestheFilter(val) {
      if (val) {
        this.esthetics = this.estheticsList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.esthetics = this.estheticsList
      }
    },
    doctorFilter(val) {
      if (val) {
        this.doctor = this.doctorList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.doctor = this.doctorList
      }
    },
    expandChange(row) {
      if (row[2].length) {
        this.expands = []
        row[1] ? this.expands.push(row[1].deductionId) : ''
      } else {
        this.expands = []
      }
    },
    /**
     * @author Nevin
     * @date 2022/9/1
     * @Description: 打印排期表
    */
    printSchedule(data) {
      this.details = []
      this.print.customName = data.customerName
      this.print.departmentName = data.departmentName
      this.print.customCardNumber = data.customCardNumber
      this.$api.medical.skinTriageList({ id: data.id }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            const temp = {
              projectName: item.projectName,
              surplusQuantity: item.surplusQuantity
            }
            this.details.push(temp)
          })
          this.$nextTick(() => {
            this.$refs.schedulePrint.print()
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/8/14
     * @Description: 打印治疗单
    */
    printTreatment(data) {
      if (data.state === '1') {
        this.$message.error('该项目还未治疗，请先打印待治疗单！')
      } else {
        this.treatmentDetails = []
        this.treatmentPrint.customName = data.customerName
        this.treatmentPrint.departmentName = data.departmentName
        this.treatmentPrint.customPhone = data.customPhone
        this.treatmentPrint.treatmentTime = data.treatmentTime
        this.treatmentDetails.push(data)
        this.$nextTick(() => {
          this.$refs.treatmentPrint.print()
        })
      }
    },
    /**
     * @author Nevin
     * @date 2022/8/14
     * @Description: 打印待治疗单
     */
    printToBoTreatment(data) {
      if (data.state === '2') {
        this.$message.error('该项目已治疗，请打印治疗单！')
      } else {
        this.toBeTreatmentDetails = []
        this.toBeTreatmentPrint.customName = data.customerName
        this.toBeTreatmentPrint.departmentName = data.departmentName
        this.toBeTreatmentPrint.customPhone = data.customPhone
        this.toBeTreatmentPrint.doctorName = data.doctorName
        this.toBeTreatmentDetails.push(data)
        this.$nextTick(() => {
          this.$refs.toBeTreatmentPrint.print()
        })
      }
    },
    /**
      * @author 李尚
      * @date 2022/8/15
      * @Description: 点击姓名跳转
    */
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
    },
    /**
     * @author Nevin
     * @date 2022/6/5
     * @Description: 获取数据
    */
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
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
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data.deptId=this.deptId
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.loadingData = true
      this.$api.medical.selectTreatment({
        ...this.pagination,
        ...data,
        // treatmentTime: this.form.treatmentTime ? this.form.treatmentTime[0] : null,
        // endtreatmentTime: this.form.treatmentTime ? this.form.treatmentTime[1] : null,
        // triagePersonTime: this.form.triagePersonTime ? this.form.triagePersonTime[0] : null,
        // endtriagePersonTime: this.form.triagePersonTime ? this.form.triagePersonTime[1] : null,
        departmentId: this.$route.query.departmentId
        // deductionDepartment: this.$route.query.departmentId,
      }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 发起治疗
    */
    initiateTreatment() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请选择顾客进行修改')
        return
      }
      // 判断是否是同一个人
      // 对选中的数据取出id 转为set直接去重，判断去重后的set长度，如果大于0表示选中了多个不同客户
      const ids = new Set(this.selectionData.flatMap(item => [item.id]))
      if (ids.size > 1) {
        this.$message.warning('请选择同一个顾客发起批量治疗')
        return
      }
      // 并且选择的数据是否有剩余治疗次数
      const find = this.selectionData.find(item => item.state === '2' || item.state === '0')
      if (find) {
        this.$message.warning('部分项目已治疗或取消，不能发起治疗，请重新选择')
        return
      }
      // 选择的数据存入store,防止后续页面刷新数据丢失
      this.$store.dispatch('setTreatmentSelectionData', this.selectionData)
      this.$router.push({ name: 'InitiateTreatment' })
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 打开手工上报弹窗
    */
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.Action = this.selectionData[0]
      this.showManualDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 打开高级选项
    */
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 关闭手工上报高级选项
    */
    closeInnerDialog() {
      this.innerDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 关闭手工上报弹窗
    */
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 客户需求
    */
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
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 发送短信
    */
    sendMessage() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客发送短信')
        return
      }
      this.showSendMessageDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/7
     * @Description: 关闭发送短信弹窗
    */
    closeDialog() {
      this.showSendMessageDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/15
     * @Description: 取消
     */
    cancel() {
      if (this.selectionData.length === 0 || this.selectionData.length > 1) {
        this.$message.warning('请选择一条数据进行取消操作！')
        return
      }
      if (this.selectionData[0].state === '2') {
        this.$message.warning('该顾客已治疗，不可取消！')
      } else if (this.selectionData[0].state === '0') {
        this.$message.warning('该顾客已取消，不可重复取消！')
      } else {
        this.$confirm('是否取消此治疗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.$api.medical.editDeductionRecord({
            deductionId: this.selectionData[0].deductionId,
            waitSource: this.selectionData[0].waitSource,
            caozuoType: '5' // 取消治疗，后端设置state为0
          }).then(res => {
            if (res) {
              this.getData()
              this.$message.success(res.msg)
            }
          })
        })
      }
    },
    // 分页组件
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.ReceptionList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.ReceptionList()
    },
    // 表格多选
    handleSelectionChange(e) {
      this.selectionData = e[1]
    },
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    getUserList(deptId) {
      /**
        * @author 李尚
        * @date 2022/6/17
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
          this.sysUserList = res.data
          this.options.actualExecutorUser.options=this.unique(this.sysUserList)
          this.sysUser = this.sysUserList
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.estheticsList = this.esthetics
              this.options.aestheticConsultant.options.push(item)
            }
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.doctorList = this.doctor
              this.options.doctorId.options.push(item)
            }
          })
          // 责任护士
          res.data.forEach(item => {
            if (item.postCode === 'zerennurse') {
              this.zerennurse.push(item)
              this.zerennurseList = this.zerennurse
              this.options.nursing.options.push(item);
              this.options.circulatingNurse.options.push(item)
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/15
     * @Description: 获取回访类型
     */
    getReturnVisitType() {
      this.$api.medical.returnVisitTypeInfolist({
        deptId: this.deptId
      }).then(res => {
        if (res) {
          this.returnVisitType = res.rows
          res.rows.forEach(value=>{
                    value.label=value.typeName;
                    value.value=value.returnTypeId
          })
          this.options.returnTypeId.options=res.rows;
        }
      })
    },
    rowClassName({ row }) {
      if (row.state === '0') {
        return 'warning-row'
      } else if (row.state === '2') {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
    margin-right: 15px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
}
::v-deep .el-table .warning-row {
  background: #ffff00;
}
::v-deep .el-table .success-row {
  background: #c6f9c3;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 0px;
}
</style>
