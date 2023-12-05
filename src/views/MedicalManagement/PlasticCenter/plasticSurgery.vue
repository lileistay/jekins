<template>
  <!-- 整形手术 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          size="mini"
          type="success"
          icon="el-icon-d-arrow-right"
          @click="newexport"
          v-has-permi="['confinement:healthcareManagement:exportoperation']"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
          id="out-table"
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

          <div slot="searchBar" class="header-float">
            <div>
              <span><i
                class="el-icon-s-data"
                style="color: #5f94de"
              />列表清单</span>
            </div>
            <div>
              <span>客户人数：00</span>
            </div>
          </div>
          <div slot="header" class="header-float">
            <div>
              <span><i
                class="el-icon-s-data"
                style="color: #5f94de"
              />列表清单</span>
              <span><i style="background-color: #ffffff" />未开始</span>
              <span><i style="background-color: #ffff00" />进行中</span>
              <span><i style="background-color: #c6f9c3" />已结束</span>
              <span
                style="text-decoration: line-through"
              ><i style="background-color: #8f9295" />已撤销</span>
            </div>
            <div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="surgical"
              >手术开始
              </el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-check"
                @click="finishc"
              >手术结束
              </el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="finishq"
              >手术取消
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-refresh-right"
                @click="finishsurgic"
              >撤销手术
              </el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click.stop.native="openManualDialog"
              >手工上报
              </el-button>
              <!--              <el-button-->
              <!--                  size="mini"-->
              <!--                  type="primary"-->
              <!--                  icon="el-icon-s-platform"-->
              <!--              >扫码签名-->
              <!--              </el-button>-->
            </div>
          </div>
        </sg-table>
      </slot>
    </slideSearch>
    <!--    手工上报弹窗-->
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />

    <!--开始手术-->
    <sg-dialog
      title="手术开始"
      size="700px"
      :dialog="surgicalOperation"
      @handleClose="customLabel"
    >
      <div slot="out">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          label-width="120px"
          size="mini"
          :label-position="labelPosition"
          :rules="formRules"
        >
          <el-row style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item label="客户姓名">
                <el-input v-model="form.customerName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话号码">
                <el-input v-model="form.customPhone" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item label="性别">
                <!--                <el-input v-model="form.customSex" disabled />-->
                <el-select filterable v-model="form.customSex" :disabled="true">
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
              <el-form-item label="服务助理">
                <el-select v-model="form.serviceAssistant" :filterable="true">
                  <el-option
                    v-for="(item, idnex) in options.serviceAssistant.options"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="医生">
                <el-select filterable v-model="form.doctorName" disabled>
                  <el-option
                    v-for="(item, idnex) in doctor"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="护士">
                <el-select v-model="form.circulatingNurse" :filterable="true">
                  <el-option
                    v-for="(item, idnex) in options.circulatingNurse.options"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手术名称">
                <el-input v-model="form.operationName" disabled />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item label="手术类型">
                <el-select filterable v-model="form.operationType" :disabled="true">
                  <el-option
                    v-for="dict in dict.type.type_of_operation"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 医助和实际执行人 -->
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item label="医助">
                <el-select v-model="form.doctorAssistant" :filterable="true">
                  <el-option
                    v-for="(item, idnex) in doctor"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际执行人" prop="actualExecutorUser">
                <el-select v-model="form.actualExecutorUser" :filterable="true" :filter-method="may">
                  <el-option
                    v-for="(item, idnex) in doctor"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item label="麻醉师" prop="anesthesiologist">
                <el-select v-model="form.anesthesiologist" :filterable="true">
                  <el-option
                    v-for="(item, idnex) in anesthesiologistList"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="麻醉方式" prop="anesthesiaMethod">
                <el-select v-model="form.anesthesiaMethod" :filterable="true">
                  <el-option
                    v-for="dict in dict.type.Anesthesia_mode"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="治疗时长（分）" prop="treatmentLength">-->
            <!--                <el-input v-model="form.treatmentLength" />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="手术开始时间" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="请选择手术开始时间"
                  style="width: 200px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label=" ">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleStartoperation"
            >保存
            </el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="customD"
            >关闭
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
    <!---手术结束--->
    <sg-dialog
      title="手术结束"
      size="700px"
      :dialog="finish"
      @handleClose="finishLabel"
    >
      <div slot="out">
        <el-form
          ref="form"
          :inline="true"
          :model="finishForm"
          label-width="120px"
          size="mini"
        >
          <el-row style="margin-top: 20px">
            <el-col
              :span="12"
            >
              <el-form-item label="客户姓名">
                <el-input v-model="finishForm.customerName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户电话">
                <el-input
                  v-model="finishForm.customPhone"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 没有字段 -->
            <el-col
              :span="12"
            >
              <el-form-item label="性别">
                <el-select v-model="finishForm.customSex" filterable :disabled="true">
                  <el-option
                    v-for="dict in dict.type.sys_user_sex"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 没有字段 -->
            <el-col
              :span="12"
            >
              <el-form-item label="手术单号">
                <el-input
                  v-model="finishForm.orderNumber"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item label="医生">
                <el-select v-model="finishForm.doctorName" filterable disabled>
                  <el-option
                    v-for="(item, idnex) in doctor"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item label="护士">
                <el-select v-model="finishForm.circulatingNurse" filterable disabled>
                  <el-option
                    v-for="(item, idnex) in options.circulatingNurse.options"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item label="手术名称">
                <el-input
                  v-model="finishForm.operationName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item label="手术类型">
                <el-select v-model="finishForm.operationType" filterable :disabled="true">
                  <el-option
                    v-for="dict in dict.type.type_of_operation"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item label="医助">
                <el-select v-model="finishForm.doctorAssistant"  filterable :disabled="true">
                  <el-option
                    v-for="(item, index) in doctor"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item label="麻醉师">
                <el-select v-model="finishForm.anesthesiologist" :disabled="true" :filterable="true">
                  <el-option
                    v-for="(item, idnex) in anesthesiologistList"
                    :key="idnex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="治疗时长（分）">
            <el-input v-model="finishForm.treatmentLength" />
          </el-form-item>
          <el-form-item label="本次治疗次数">
            <el-input v-model.number="finishForm.thisScribingNum" />
          </el-form-item>
          <!--          <el-table-->
          <!--            :data="tableList"-->
          <!--            border-->
          <!--            size="mini"-->
          <!--            style="width: 100%; margin-bottom: 10px"-->
          <!--          >-->
          <!--            <el-table-column prop="date" label="项目名称" />-->
          <!--            <el-table-column prop="name" label="剩余次数" />-->
          <!--            <el-table-column prop="name" label="当次治疗次数" />-->
          <!--          </el-table>-->
          <el-row>
            <el-col :span="12">
              <el-form-item label=" " />
            </el-col>
            <el-row>
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
            </el-row>
          </el-row>
        </el-form>
      </div>
    </sg-dialog>
    <!----手术取消---->
    <sg-dialog
      title="手术取消"
      size="300px"
      :dialog="cancel"
      @handleClose="finishcancel"
    >
      <div slot="out">
        <div class="dialogContent">
          <p style="margin-bottom: 20px">确认取消手术吗？</p>
          <div>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="finiAdd"
            >确定
            </el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="finiD"
            >取消
            </el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
    <!----撤销手术---->
    <sg-dialog
      title="撤销手术"
      size="300px"
      :dialog="cancelsurgical"
      @handleClose="finishsurgical"
    >
      <div slot="out">
        <div class="dialogContent">
          <p style="margin-bottom: 20px">确认撤销手术吗？</p>
          <div class="dialogFooter">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="surgicalAdd"
            >确定
            </el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="surgicalD"
            >取消
            </el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import moment from 'moment'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import {todayTime} from "@/utils/time";
import { export_table_to_excel } from '@/utils/utils.js'
import PinyinMatch from "pinyin-match";

export default {
  // type_of_operation  手术类型   caozuo_type 手术状态  Anesthesia_mode 麻醉方式
  dicts: ['Anesthesia_mode', 'type_of_operation', 'caozuo_type', 'sys_user_sex'],
  components: {
    slideSearch,
    SgTable,
    SgDialog,
    ManualSubmission
  },
  data() {
    return {
      // 手工上报
      Action: {},
      showManualDialog: false,
      innerDialog: false,
      selectionData: [], // 选择的数据
      typeOfOperation: [],
      departmentId: 0,
      // operationType, // 手术类型
      // 手术开始
      surgicalOperation: false,
      deductionRecord: {
        deductionId: null,
        caozuoType: '',
        serviceAssistant: null,
        circulatingNurse: null,
        actualExecutorUser: null,
        anesthesiologist: null,
        treatmentLength: null
      },
      form: {
        actualExecutorUser: null
      },
      formRules: {
        actualExecutorUser: [
          { required: true, message: '请选择实际执行人', trigger: 'change' }
        ],
        anesthesiologist: [
          { required: true, message: '请选择麻醉师', trigger: 'change' }
        ],
        anesthesiaMethod: [
          { required: true, message: '麻醉方式', trigger: 'change' }
        ],
        treatmentLength: [
          { required: true, message: '请输入治疗时长', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择手术开始时间', trigger: 'change' }
        ]
      },
      sysUserList: [],
      doctor: [],
      newdoctor:[],
      anesthesiologistList: [],
      // 手术结束
      finish: false,
      finishForm: {
        thisScribingNum: 1
      },
      tableList: [],
      // 手术取消
      cancel: false,
      // 撤销手术
      cancelsurgical: false,
      // 列表
      tableData: [],
      columns: [
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '电话：',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 160
        },
        {
          lab: '手术单号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 160
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
          lab: '服务助理',
          val: 'saName',
          width: 150
        },
        {
          lab: '美学顾问',
          val: 'acName'
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
        //   lab: '其它治疗人员',
        //   val: '',
        //   width: 150
        // },
        {
          lab: '回访类型',
          val: 'typeName',
          width: 180
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
        // {
        //   lab: '手术单号',
        //   val: '',
        //   width: 150
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
          lab: '备注',
          val: 'remark',
          width: 150
        }
        // {
        //   lab: '归属科室医生/服务助理',
        //   val: '',
        //   width: 150
        // }
      ],
      options: {
        yjStartTime: {
          type: 'Tdatetime',
          label: '计划开始时间：',
          clearable: true,
          values: todayTime()
        },
        startTime: {
          type: 'Tdatetime',
          label: '开始时间：',
          clearable: true,
          values: []
        },
        orderNumber: {
          type: 'input',
          label: '手术单号：'
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        customPhone: {
          type: 'input',
          label: '电话：',
          clearable: true,
          options: []
        },
        operationName: {
          type: 'input',
          label: '手术名称：',
          clearable: true,
          options: []
        },
        caozuoType: {
          type: 'select',
          label: '手术状态：',
          clearable: true,
          options: []
        },
        doctorId: {
          type: 'select',
          label: '主治医生：',
          clearable: true,
          options: []
        },
        actualExecutorUser: {
          type: 'select',
          label: '实际执行人：',
          clearable: true,
          options: []
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问：',
          clearable: true,
          options: []
        },
        serviceAssistant: {
          type: 'select',
          label: '服务助理：',
          clearable: true,
          options: []
        },
        // 无
        doctorAssistant: {
          type: 'select',
          label: '医助：',
          clearable: true,
          options: []
        },
        circulatingNurse: {
          type: 'select',
          label: '护士：',
          clearable: true,
          options: []
        },
        anesthesiologist: {
          type: 'select',
          label: '麻醉师：',
          clearable: true,
          options: []
        },
        anesthesiaMethod: {
          type: 'select',
          label: '麻醉方式：',
          clearable: true,
          options: []
        },
        returnTypeId: {
          type: 'select',
          label: '回访类型：',
          clearable: true,
          options: []
        }
      },
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      lableWidth: '100px',
      labelPosition: 'right',
      Payment: {}
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
      this.getUserList(this.deptId)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    // console.log(this.$route.query.departmentId)
    this.departmentId = this.$route.query.departmentId
    this.getData()
    this.returntypes()
    this.getUserList()
    this.setanesthesiaMethod()
    this.setCaozuoType()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    // 设置麻醉方式

    may(val){
      if (val) {
        this.doctor = this.newdoctor.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.doctor = this.newdoctor
      }

  },
    newexport(){
      var data = {}
      for (const k in this.options) {
        if (
          (this.options[k].type === 'datetimerange' ||
                this.options[k].type === 'Tinput' ||
                this.options[k].type === 'daterange') &&
            Array.isArray(this.options[k].values)
        ) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
          if (
            this.options[k].values[0] === null &&
              this.options[k].values[1] !== null
          ) {
            data['end' + k] = moment(this.options[k].values[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (
            this.options[k].values[1] === null &&
              this.options[k].values[0] !== null
          ) {
            data[k] = moment(this.options[k].values[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (
            this.options[k].values[1] === null &&
              this.options[k].values[0] === null
          ) {
            data[k] = null
            data['end' + k] = null
          }
          if (
            this.options[k].values[1] !== null &&
              this.options[k].values[0] !== null
          ) {
            data[k] = moment(this.options[k].values[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            data['end' + k] = moment(this.options[k].values[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'departmentId', this.departmentId)
      data = Object.assign(data, this.pagination)
      this.$api.medical.selectTreatment(data).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(()=>{
                export_table_to_excel('#out-table', '整形手术')
            })
    },
    setanesthesiaMethod() {
      this.$api.dict.getDicts('Anesthesia_mode').then(res => {
        if (res) {
          res.data.forEach(item => {
            this.options.anesthesiaMethod.options.push({ label: item.dictLabel, value: item.dictValue })
          })
        }
      })
    },
    // 设置手术操作类型
    setCaozuoType() {
      this.$api.dict.getDicts('caozuo_type').then(res => {
        if (res) {
          res.data.forEach(item => {
            this.options.caozuoType.options.push({ label: item.dictLabel, value: item.dictValue })
          })
        }
      })
    },
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1 || this.selectionData[0]==undefined) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.Action = this.selectionData[0]
      this.showManualDialog = true
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 手工上报打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 手工上报关闭高级选项
    closeInnerDialog() {
      this.innerDialog = false
    },
    getData(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      var data = {}
      for (const k in this.options) {
        if (
          (this.options[k].type === 'datetimerange' ||
                this.options[k].type === 'Tinput' ||
                this.options[k].type === 'daterange') &&
            Array.isArray(this.options[k].values)
        ) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
          if (
            this.options[k].values[0] === null &&
              this.options[k].values[1] !== null
          ) {
            data['end' + k] = moment(this.options[k].values[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (
            this.options[k].values[1] === null &&
              this.options[k].values[0] !== null
          ) {
            data[k] = moment(this.options[k].values[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (
            this.options[k].values[1] === null &&
              this.options[k].values[0] === null
          ) {
            data[k] = null
            data['end' + k] = null
          }
          if (
            this.options[k].values[1] !== null &&
              this.options[k].values[0] !== null
          ) {
            data[k] = moment(this.options[k].values[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            data['end' + k] = moment(this.options[k].values[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'departmentId', this.departmentId)
      data = Object.assign(data, this.pagination)
      this.$api.medical.selectTreatment(data).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 颜色
    rowClassName({ row }) {
      if (row.caozuoType === '3') {
        return 'warning-row'
      } else if (row.caozuoType === '2') {
        return 'success-row'
      } else if (row.caozuoType === '5') {
        return 'cancel-row'
      }
      return ''
    },
    returntypes() {
      const data = {
        status: '1',
        deptId: this.deptId
      }
      this.$api.medical.returnVisitTypeInfolist(data).then((res) => {
        if (res) {
          res.rows.forEach((item) => {
            item.label = item.typeName
            item.value = item.returnTypeId
          })
          this.options.returnTypeId.options = res.rows
        }
      })
    },
    // 按钮开始手术
    surgical() {
      if (this.selectionData.length < 1 || this.selectionData[0]==undefined) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData[0].caozuoType === '2') {
        this.$message.warning('治疗已完成，')
        return
      } else if (this.selectionData[0].caozuoType === '3') {
        this.$message.warning('手术已开始，不可重复开始')
        return
      } else if (this.selectionData[0].caozuoType === '4') {
        this.$message.warning('手术已取消，不可重复取消')
        return
      } else if (this.selectionData[0].caozuoType === '5') {
        this.$message.warning('手术已撤销，请重新排期开始')
        return
      } else if (this.selectionData[0].caozuoType === '1') {
        this.form = this.selectionData[0]
        this.form.actualExecutorUser = null
        this.form.serviceAssistant = null
        this.surgicalOperation = true
      }
    },
    // 手术结束
    finishc() {
      if (this.selectionData.length < 1 || this.selectionData[0]==undefined) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData[0].caozuoType === '5') {
        this.$message.warning('手术已撤销,不能结束手术')
        return
      } else if (this.selectionData[0].caozuoType === '4') {
        this.$message.warning('手术已取消')
        return
      } else if (this.selectionData[0].caozuoType === '2') {
        this.$message.warning('治疗已完成')
        return
      } else if (this.selectionData[0].caozuoType === '1') {
        this.$message.warning('手术还未开始，无法结束手术')
        return
      } else if (this.selectionData[0].caozuoType === '3') {
        this.finish = true
        this.finishForm = this.selectionData[0]
        // 给本次治疗次数设置为默认值1
        this.finishForm.thisScribingNum = 1
      }
    },
    // 手术取消
    finishq() {
      if (this.selectionData.length < 1 || this.selectionData[0]==undefined) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData[0].caozuoType === '5') {
        this.$message.warning('手术已撤销')
        return
      } else if (this.selectionData[0].caozuoType === '2') {
        this.$message.warning('治疗已完成，无法取消手术')
        return
      } else if (this.selectionData[0].caozuoType === '1') {
        this.$message.warning('手术还未开始，无法取消手术')
        return
      } else if (this.selectionData[0].caozuoType === '4') {
        this.$message.warning('手术已取消，不可重复取消')
        return
      } else if (this.selectionData[0].caozuoType === '3') {
        this.deductionRecord.deductionId = this.selectionData[0].deductionId
        this.cancel = true
      }
    },
    // 撤销手术
    finishsurgic() {
      if (this.selectionData.length < 1 || this.selectionData[0]==undefined) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData[0].caozuoType === '5') {
        this.$message.warning('手术已撤销,不可重复撤销')
        return
      } else if (this.selectionData[0].caozuoType === '2') {
        this.$message.warning('治疗已完成，无法撤销手术')
        return
      } else if (this.selectionData[0].caozuoType === '1') {
        this.cancelsurgical = true
      } else if (this.selectionData[0].caozuoType === '3') {
        this.$message.warning('手术已开始，不可重复撤销')
        return
      } else if (this.selectionData[0].caozuoType === '4') {
        this.$message.warning('手术已取消！！！')
        return
      }
      this.deductionRecord.deductionId = this.selectionData[0].deductionId
      this.cancelsurgical = true
    },
    // 弹框 开始手术
    customLabel() {
      this.surgicalOperation = false
    },
    // 手术结束
    finishLabel() {
      this.finish = false
    },
    // 手术结束 保存
    finishAdd() {
      console.log('finish')
      this.$set(this.deductionRecord, 'caozuoType', '2')
      this.finish = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = {
            actualExecutorUser:this.finishForm.actualExecutorUser,
            anesthesiologist: this.finishForm.anesthesiologist,
            doctorAssistant: this.finishForm.doctorAssistant,
            treatmentLength: this.finishForm.treatmentLength,
            deductionId: this.finishForm.deductionId,
            returnTypeId: this.finishForm.returnTypeId,
            caozuoType: '2',
            // 总金额
            totalPayment: this.finishForm.totalPayment,
            // 总次数
            quantitySum: this.finishForm.quantitySum,
            // 本次划扣治疗次数
            thisScribingNum: this.finishForm.thisScribingNum,
            customerRepresentative: this.finishForm.customerRepresentative,
            orderNumber: this.finishForm.orderNumber,
            waitId: this.finishForm.waitId,
            waitSource: '0'
          }
          // 请求保存接口
          this.$api.medical.deductionRecordedit(query).then((res) => {
            if (res.code === 200) {
              this.$message.success('手术结束')
              this.getData()
            }
          })
          this.finish = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    finishD() {
      this.finish = false
    },
    // 弹框开始 保存
    handleStartoperation() {
      this.$set(this.deductionRecord, 'caozuoType', '3')
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = {
            deductionId: this.form.deductionId,
            // 麻醉师和麻醉方式
            anesthesiologist: this.form.anesthesiologist,
            anesthesiaMethod: this.form.anesthesiaMethod,
            // 巡回护士
            circulatingNurse: this.form.circulatingNurse,
            actualExecutorUser: this.form.actualExecutorUser,
            treatmentLength: this.form.treatmentLength,
            serviceAssistant: this.form.serviceAssistant,
            startTime: this.form.startTime,
            treatmentTime: this.form.startTime,
            caozuoType: '3',
            waitSource: '0'
          }
          // 请求保存接口
          this.$api.medical.deductionRecordedit(query).then((res) => {
            if (res.code === 200) {
              this.$message.success('手术开始')
              this.getData()
            }
          })
          this.surgicalOperation = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 弹框开始 关闭
    customD() {
      this.surgicalOperation = false
    },
    // 手术取消
    finishcancel() {
      this.cancel = false
    },
    // 手术取消 确定
    finiAdd() {
      this.cancel = false
      this.$set(this.deductionRecord, 'caozuoType', '4')
      const query = {
        caozuoType: '4',
        waitSource: '0',
        deductionId: this.deductionRecord.deductionId
      }
      // 请求保存接口
      this.$api.medical.deductionRecordedit(query).then((res) => {
        if (res.code === 200) {
          this.$message.success('手术取消')
          this.getData()
        }
      })
      this.surgicalOperation = false
    },
    // 手术取消 关闭
    finiD() {
      this.cancel = false
    },
    // 撤销手术弹框 关闭
    finishsurgical() {
      this.cancelsurgical = false
    },
    // 撤销手术弹框 确定
    surgicalAdd() {
      this.cancelsurgical = false
      this.$set(this.deductionRecord, 'caozuoType', '5')
      const query = {
        caozuoType: '5',
        waitSource: '0',
        deductionId: this.deductionRecord.deductionId
      }
      // 请求保存接口
      this.$api.medical.deductionRecordedit(query).then((res) => {
        if (res.code === 200) {
          this.$message.success('撤销手术')
          this.getData()
        }
      })
      this.surgicalOperation = false
    },
    // 撤销手术弹框 关闭
    surgicalD() {
      this.cancelsurgical = false
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
            // console.log(item)
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          res.data.forEach((item) => {
            // 美学顾问
            if (item.postCode === 'Aesthetic_Consultant') {
              this.options.aestheticConsultant.options.push(item)
            }
            // 医生数组
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.newdoctor.push(item)
              // 侧边搜素栏的医生数组
              this.options.doctorId.options.push(item)
              // 侧边搜索栏的实际执行人
              this.options.actualExecutorUser.options.push(item)
            }
            // 麻醉师数组 没有麻醉师分类，暂时使用医生代替
            if (item.postCode === 'anesthesiologist') {
              this.anesthesiologistList.push(item)
              this.options.anesthesiologist.options.push(item)
            }
            // 服务助理数组
            if (item.postCode === 'physician-assisted') {
              this.options.serviceAssistant.options.push(item)
            }
            // 医助
            if (item.postCode === 'yizhu') {
              this.options.doctorAssistant.options.push(item)
            }
            // 护士数组
            if (item.postCode === 'xhhushi' || item.postCode === 'zerennurse') {
              this.options.circulatingNurse.options.push(item)
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
    // 复选框的选中
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      // console.log(this.selectionData,'aaa')
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../styles/globalfloat.css";

.container {
  width: 100%;
  height: 100%;
}

span {
  font-size: 14px;
  margin-right: 15px;
}

i {
  display: inline-block;
  margin-right: 5px;
  width: 10px;
  height: 10px;
}

.dialogFooter {
  float: right;
}

.dialogContent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputWidth {
  width: 200px;
}

::v-deep .el-table .warning-row {
  background: #ffff00;
}

::v-deep .el-table .success-row {
  background: #c6f9c3;
}

::v-deep .el-table .cancel-row {
  background: #8f9295;
  text-decoration: line-through;
}

</style>
