<template>
  <!--  辅助开单治疗-->
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">辅助治疗开单
          &nbsp;
          <span class="mentem"> [ &nbsp;<em> 客户:{{ billing.customerName }} {{ getTime }} </em> &nbsp;] </span>
        </div>
        <p class="titel">
          <span>客户账户信息：</span>
          <span style="color: red">欠款金额：0.00</span>
          &nbsp;
          <span>预约金：{{ advancePayment }}；住院押金：{{ deposit }}；储值总额：{{
            totalStoredValue
          }}；[ 储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]</span>
        </p>
        <el-form
          ref="formInline"
          class="mentform"
          :rules="rules"
          :model="formInline"
          size="mini"
          label-width="100px"
          style="margin-top:10px "
        >
          <el-row :gutter="15">
            <el-col :span="5">
              <el-form-item label="下单人:">
                <el-input v-model="userInfo.nickName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="医生:" prop="doctorId">
                <el-select v-model="formInline.doctorId" filterable :filter-method="doctorFilter">
                  <el-option
                    v-for="(item,index) in doctor"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="科室:" prop="billingDepartment">
                <el-select v-model="formInline.billingDepartment" filterable clearable>
                  <el-option
                    v-for="(item,index) in departmentList"
                    :key="index"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="billing.triageType !== 2" :span="5">
              <el-form-item label="推荐人:" prop="secondRecommender">
                <el-select v-model="formInline.secondRecommender" filterable :filter-method="handleFilter">
                  <el-option
                    v-for="(item,index) in sysUserList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="诊断:">
                <el-input v-model="formInline.billingRemarks" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="mentediv">
        <div class="formBody" style="min-height: 520px">
          <div class="itemment"><span>收费单明细信息</span></div>
          <div class="titme">
            <span class="select">*选中行会编辑该组药品</span>
            <el-button
              class="elbut"
              style="float:right; margin-right: 5px;"
              icon="el-icon-plus"
              type="primary"
              size="mini"
              @click="importProject"
            >导入产品
            </el-button>
            <el-button
              class="elbut"
              style="float:right; margin-right: 5px;"
              icon="el-icon-plus"
              type="primary"
              size="mini"
              @click="template"
            >模板处方开单
            </el-button>
          </div>
          <div class="mentediv">
            <el-table
              v-for="(items, index) in tableData"
              :key="items.index"
              border
              class="tabbox"
              size="mini"
              :data="items"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :style="{'font-size': '12px'}"
              style="width: 100%"
              :show-header="index === 0"
              :span-method="objectSpanMethod"
            >
              <el-table-column label="产品名称" width="200" prop="projectName" />
              <el-table-column label="价格1" width="80" prop="priceOne" />
              <el-table-column label="价格2" width="80" prop="priceTwo" />
              <el-table-column label="最终价格" width="140" prop="finalPrice">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.finalPrice"
                    type="text"
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    :disabled="disabled"
                    @blur="totalAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="产品次数" prop="quantity" />
              <el-table-column label="数量" width="140" prop="quantity">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.quantity"
                    size="mini"
                    style="width: 100%"
                    :precision="0"
                    @blur="totalAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="单位" width="60" prop="priceUnit" />
              <el-table-column label="合计金额" width="80" prop="sumPrice" />
              <el-table-column label="折扣" width="140" prop="discount">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.discount"
                    size="mini"
                    style="width: 100%"
                    :disabled="scope.row.isDiscount === '1'? false: true"
                    :precision="2"
                    :max="1"
                    :min="0"
                    :step="0.01"
                    @blur="discount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="折后金额" width="140" prop="discountAmount">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.discountAmount"
                    size="mini"
                    style="width: 100%"
                    :precision="2"
                    @blur="discountAmount(scope.$index, scope.row)"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    size="mini"
                    type="text"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="每次用量" prop="eachTime">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.eachTime"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    size="mini"
                    type="text"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="用药单位" prop="pharmacy">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.pharmacy" filterable placeholder="请选择" size="mini">
                    <el-option
                      v-for="dict in dict.type.medication_unit"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.label"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="每次用量" prop="eachTime" width="300">
                <template slot-scope="scope">
                  中药用药频次：
                  <el-select
                    filterable
                    v-model="scope.row.chineseUse"
                    placeholder="请选择"
                    size="mini"
                    style="width: 100px"
                    @input="() => $forceUpdate()"
                  >
                    <el-option
                      v-for="dict in dict.type.cm_medication_frequency"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.label"
                    />
                  </el-select>
                  <br>
                  西药用药频次：
                  <el-select
                    v-model="scope.row.westUse"
                    placeholder="请选择"
                    size="mini" filterable
                    style="width: 100px"
                    @input="() => $forceUpdate()"
                  >
                    <el-option
                      v-for="dict in dict.type.wm_medication_frequency"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.label"
                    />
                  </el-select>
                  <br>
                  给药途径：
                  <el-select
                    v-model="scope.row.toDrugMode"
                    placeholder="请选择"
                    size="mini" filterable
                    style="width: 100px"
                    @input="() => $forceUpdate()"
                  >
                    <el-option
                      v-for="item in drugDeliveryRouteList"
                      :key="item.drugId"
                      :label="item.drugDelivery"
                      :value="item.drugId"
                    />
                  </el-select>
                  <br>
                  滴速：
                  <el-input
                    v-model="scope.row.dropVelocity"
                    placeholder="滴速"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    size="mini"
                    style="width: 100px;"
                    @input="() => $forceUpdate()"
                  />&nbsp;滴/分<br>
                  剂数：
                  <el-input
                    v-model="scope.row.dose"
                    placeholder="剂"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    size="mini"
                    style="width: 100px"
                    @input="() => $forceUpdate()"
                  />&nbsp;剂<br>
                  天数：
                  <el-input
                    v-model="scope.row.days"
                    placeholder="天"
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    size="mini"
                    style="width: 100px"
                    @input="() => $forceUpdate()"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">

                  <el-button type="text" size="small" @click.stop="handleDelete(scope.row, index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <span v-if="billing.triageType === 2">二开推荐人: {{ billing.souName }}</span>
        &nbsp;
        <span>客户代表：{{ billing.crName }}</span>
        &nbsp;
        <span class="red">费用合计：{{ accountsPayable }}</span>
        &nbsp;
        <span class="red">应付款：{{ accountsPayable }}</span>
        &nbsp;
        <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="addOrEdit">
          保存
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
    <!--    模板处方开单-->
    <sg-dialog
      title="模板处方"
      :dialog="dialogVisible"
      size="60%"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form :inline="true" :model="fempLate" class="demo-form-inline" size="mini">
          <el-form-item label="模板名称:">
            <el-input v-model="fempLate.templateName" placeholder="模板名称" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="处方备注:">
            <el-input v-model="fempLate.remark" placeholder="处方备注" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item label="模板使用者:">
            <el-select v-model="fempLate.templateUse" placeholder="模板使用者" filterable clearable style="width: 120px">
              <el-option
                v-for="item in sysUserList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="全院公共模板:">
            <el-select v-model="fempLate.isWholeTemplate" placeholder="请选择" filterable clearable style="width: 120px">
              <el-option
                v-for="dict in dict.type.whether"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-button
            style="float:right;"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getPrescriptionTemplate"
          >搜索
          </el-button>
        </el-form>
        <el-table
          v-loading="loadingDialogData"
          :data="table"
          max-height="150"
          border
          index="序号"
          size="mini"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          @row-click="add"
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="templateName" label="处方模板名称" />
          <el-table-column prop="remark" label="处方模板备注信息" />
          <el-table-column prop="templateUseName" label="处方医生">
            <template slot-scope="scope">
              <span>{{ scope.row.templateUseName !== undefined ? scope.row.templateUseName : '全院模板' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="formBodys">
          <div class="form-left">
            <div class="title">用法用量</div>
            <div v-loading="loadingTemplateData" style="font-size: 12px">
              <div style="margin-top: 10px">中药用药频次：<span
                style="float: right"
              >{{ chineseUse !== '' ? chineseUse : '-' }}</span></div>
              <div style="margin-top: 10px">西药用药频次：<span style="float: right">{{
                westUse !== '' ? westUse : '-'
              }}</span></div>
              <div style="margin-top: 10px">给药途径：<span style="float: right">{{
                toDrugMode !== '' ? toDrugMode : '-'
              }}</span></div>
              <div style="margin-top: 10px">滴速：<span
                style="float: right"
              >{{ dropVelocity !== '' ? dropVelocity + '滴/分' : '-' }}</span></div>
              <div style="margin-top: 10px">用药天数：<span style="float: right">{{ days !== '' ? days : '-' }}</span>
              </div>
              <div style="margin-top: 10px">剂数：<span style="float: right">{{ dose !== '' ? dose + '剂' : '-' }}</span>
              </div>
            </div>
          </div>
          <div class="form-right">
            <div class="title">产品列表</div>
            <div style="margin-top: 10px">
              <el-table
                v-loading="loadingTemplateData"
                :data="templateData"
                size="mini"
                :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
                :cell-style="{'text-align':'center', 'font-size':'12px'}"
              >
                <el-table-column prop="projectName" label="产品名称" width="120" />
                <el-table-column prop="quantity" label="数量" />
                <el-table-column prop="eachTime" label="每次用量" />
                <el-table-column prop="priceUnit" label="单位" />
                <el-table-column prop="priceOne" label="价格1" />
                <el-table-column prop="priceTwo" label="价格2" />
                <el-table-column prop="isDiscount" label="是否打折">
                  <template slot-scope="scope">
                    <span
                      v-for="item in dict.type.discount"
                      :key="item.value"
                    >{{ item.value === scope.row.isDiscount ? item.label : '' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="discountNumber" label="折扣" />
                <el-table-column prop="priceNum" label="次数" />
              </el-table>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="updata(templateData)">确 定</el-button>
          <el-button size="mini" @click="handleClose">取 消</el-button>
        </span>
      </div>
    </sg-dialog>
    <!-- 导入产品-->
    <auxiliaryBillingImport :dialog-visible.sync="showManualDialog" @updata="updata" />
  </el-scrollbar>
</template>

<script>
import auxiliaryBillingImport from '@/views/SiteManagement/JumpPage/auxiliaryBillingImport'
import { math } from '@/utils/math'
import vm from '@/utils/util'
import sgDialog from '@/components/Dialog'
import PinyinMatch from 'pinyin-match'

export default {
  components: {
    auxiliaryBillingImport,
    sgDialog
  },
  dicts: ['medication_unit', 'cm_medication_frequency', 'wm_medication_frequency', 'whether', 'discount'],
  data() {
    return {
      submitLoading: false,
      loadingTemplateData: false,
      loadingData: false,
      loadingDialogData: false,
      showManualDialog: false, // 导入产品
      dialogVisible: false,
      disabled: false,
      showHeader: false,
      fempLate: {
        templateName: '',
        templateUse: '',
        templateUseName: '',
        remark: '',
        isWholeTemplate: ''
      },
      formInline: {
        doctorId: '',
        departmentId: '',
        secondRecommender: '',
        billingDepartment: '',
        remark: ''
      },
      rules: {
        doctorId: [{ required: true, message: '请选择医生', trigger: 'change' }],
        billingDepartment: [
          { required: true, message: '请选择科室', trigger: 'change' }
          // { required: true, message: '请选择科室', trigger: 'blur' }
        ]
      },
      tableData: [], // 表单数据
      table: [],
      billing: {},
      userInfo: [],
      sysUserList: [],
      copySysUserList: [],
      doctor: [],
      copyDoctor: [],
      departmentList: [],
      accountsPayable: 0,
      drugDeliveryRouteList: [],
      templateData: [],
      chineseUse: '', // 西药用药频次
      westUse: '', // 中药用药频次
      toDrugMode: '', // 给药途径
      dropVelocity: '', // 滴速
      days: '', // 天数
      dose: '', // 剂数
      eachTime: '', // 每次用量
      pharmacy: '', // 用药单位
      removeIds: [],
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0,
      getTime: ''
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getDepartment()
      this.getUserList(val)
    }
  },
  created() {
    let list=JSON.parse(sessionStorage.getItem('adjuvantBillingTherapyitem'))
    if (list.xFlag == 1) {
      this.getReceptionInfo(list.jdxxId)
    } else {
      this.billing = JSON.parse(JSON.parse(sessionStorage.getItem('adjuvantBillingTherapyitem')).billing)
      this.formInline = this.billing
    }
    // this.billType = this.$route.query.billType
    this.billType = list.billType
    if (this.formInline.doctorId === 0) {
      this.formInline.doctorId = undefined
    }
    if (this.formInline.secondRecommender === 0) {
      this.formInline.secondRecommender = undefined
    }
    this.userInfo = this.$store.getters.user
    if (this.billType !== undefined) {
      this.getOrderDetailsList()
    }
    this.getAdministrationRouteSetting()
    this.getDepartment()
    this.getCustomCardSum()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getCurrentTime()
  },
  // destroyed() {
  //   console.log("xiaohui ")
  // },
  methods: {
    // 从月子房间开辅助治疗获取用户信息
    getReceptionInfo(val) {
      this.$api.billingList.getReceptionInformation({
        jdxxId: val
      }).then(res => {
        if (res.code == 200) {
          this.billing = res.data[0]
          this.$set(this.billing, 'billingDepartment', this.billing.departmentId)
          this.formInline = this.billing
        }
      })
    },
    /**
     * 生成一个用不重复的ID
     * @param { Number } randomLength
     */
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
    },

    doctorFilter(val) {
      if (val) {
        this.doctor = this.copyDoctor.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.doctor = this.copyDoctor
      }
    },
    handleFilter(val) {
      if (val) {
        this.sysUserList = this.copySysUserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.sysUserList = this.copySysUserList
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     *F
     * @Description: 关闭当前标签
     */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /** 获取当前时间*/
    getCurrentTime() {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 合并行的方法
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let index = 0
      if (columnIndex === 13) {
        this.tableData.forEach(items => {
          if (items.length > index) {
            index = items.length
          }
        })
        if (rowIndex % index === 0) {
          return {
            rowspan: index,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 14) {
        let index = 0
        this.tableData.forEach(items => {
          if (items.length > index) {
            index = items.length
          }
        })
        if (rowIndex % index === 0) {
          return {
            rowspan: index,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/16
     * @Description: 获取订单详情
     */
    getOrderDetailsList() {
      this.$api.billingList.orderDetailsList({
        orderNumber: this.billing.orderNumber
      }).then(res => {
        if (res) {
          const groupUUIDs = new Set(res.rows.flatMap(item => [item.auxiliaryNo]))
          // console.log([...groupUUIDs])
          for (const groupUUID of groupUUIDs) {
            const filter = res.rows.filter(function(item1) {
              return item1.auxiliaryNo === groupUUID
            }
            )
            this.tableData.push(filter)
          }
          this.getTotalAmount()
          // console.log(this.tableData)
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 模板处方开单
     */
    template() {
      this.dialogVisible = true
      this.getPrescriptionTemplate()
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 模板处方开单关闭
     */
    handleClose() {
      this.dialogVisible = false
      this.templateData = []
      this.chineseUse = ''
      this.westUse = ''
      this.toDrugMode = ''
      this.dropVelocity = ''
      this.days = ''
      this.dose = ''
      this.eachTime = ''
      this.pharmacy = ''
    },
    /**
     * @author Nevin
     * @date 2022/5/14
     * @Description: 获取处方模板信息
     */
    getPrescriptionTemplate() {
      this.loadingDialogData = true
      this.$api.basicMedicalData.prescriptionTemplateSettingsList({
        ...this.fempLate,
        status: '0',
        deptId: this.deptId
      }).then(res => {
        if (res) {
          this.table = res.rows
        }
      }).finally(() => {
        this.loadingDialogData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/14
     * @Description: 添加模板详情
     */
    add(row) {
      this.loadingTemplateData = true
      this.$api.basicMedicalData.prescriptionTemplateSettingsInfo({
        relationshipNumber: row.relationshipNumber
      }).then(res => {
        if (res) {
          this.templateData = res.rows
          this.chineseUse = row.chineseUse
          this.westUse = row.westUse
          // this.toDrugMode = row.toDrugMode
          this.$api.basicMedicalData.drugDeliveryRouteList({status: '0'}).then(res => {
            if (res) {
              res.rows.forEach(value=>{
                if(value.drugId==row.toDrugMode){
                  this.toDrugMode = value.drugDelivery
                }
              })
            }
          })
          this.dropVelocity = row.dropVelocity
          this.days = row.days
          this.dose = row.dose
        }
      }).finally(() => {
        this.loadingTemplateData = false
      })
    },
    // 数量
    totalAmount(index, value) {
      console.log(index, value)
      console.log('nihao')

      if (value.quantity === '' || value.quantity === null) {
        value.quantity = 0
      }
      if (value.finalPrice < value.priceOne) {
        this.$message.error('最终价格必须在' + value.priceOne + '和' + value.priceTwo + '之间')
        value.finalPrice = value.priceOne
        this.$forceUpdate()
      } else if (value.finalPrice > value.priceTwo) {
        this.$message.error('最终价格必须在' + value.priceOne + '和' + value.priceTwo + '之间')
        value.finalPrice = value.priceTwo
        this.$forceUpdate()
      }
      /**
       * @author 李尚
       * @date 14/5/2022
       * @Description: 计算折后金额
       */
      // 计算折后价格
      this.tableData.forEach(item => {
        item.forEach(ite => {
          ite.sumPrice = math.multiply(ite.finalPrice, ite.quantity).toFixed(2)
          ite.discountAmount = math.multiply(ite.finalPrice, ite.quantity, ite.discount).toFixed(2)
        })
        this.$forceUpdate()
      })
      // this.$set(this.tableData, index, value)
      // // 计算费用合计
      let total = 0
      this.tableData.forEach(item => {
        item.forEach(ite => {
          if (ite.discountAmount > 0) {
            total = math.add(total, ite.discountAmount).toFixed(2)
          }
        })
      })
      this.accountsPayable = total
    },
    // 折扣
    discount(index, value) {
      if (value.discount === '0' || value.discount === '') {
        value.discount = 1
      }
      /**
       * @author 李尚
       * @date 14/5/2022
       * @Description: 计算折后金额
       */
      // 计算折后价格
      this.tableData.forEach(item => {
        item.forEach(ite => {
          ite.discountAmount = math.multiply(ite.finalPrice, ite.quantity, ite.discount).toFixed(2)
        })
      })
      this.$forceUpdate()
      // 计算费用合计
      let total = 0
      this.tableData.forEach(item => {
        item.forEach(ite => {
          if (parseFloat(ite.discountAmount) > 0) {
            total = math.add(total, ite.discountAmount).toFixed(2)
          }
        })
      })
      this.accountsPayable = total
    },
    // 折后金额
    discountAmount(index, value) {
      if (value !== undefined) {
        if (value.discountAmount === '') {
          value.discountAmount = 0
          value.discount = 0
        }
        /**
         * @author 李尚
         * @date 14/5/2022
         * @Description: 计算折扣
         */
        this.tableData.forEach(item => {
          item.forEach(ite => {
            ite.discount = math.divide(ite.discountAmount, math.multiply(ite.finalPrice, ite.quantity)).toFixed(2)
          })
          // item.discount = math.divide(item.discountAmount,item.finalPrice).toFixed(2)
        })
        let total = 0
        this.tableData.forEach(item => {
          item.forEach(ite => {
            if (parseFloat(ite.discountAmount) > 0) {
              total = math.add(total, ite.discountAmount).toFixed(2)
            }
          })
        })
        this.$forceUpdate()
        this.accountsPayable = total
      }
    },
    // 计算总金额
    getTotalAmount() {
      let total = 0
      this.tableData.forEach(items => {
        items.forEach(item => {
          total = math.add(total, item.discountAmount).toFixed(2)
        })
      })
      this.accountsPayable = total
      this.templateData = []
      this.chineseUse = ''
      this.westUse = ''
      this.toDrugMode = ''
      this.dropVelocity = ''
      this.days = ''
      this.dose = ''
      this.eachTime = ''
      this.pharmacy = ''
    },
    /**
     * @author 李尚
     * @date 13/5/2022
     * @Description: 导入产品
     */
    importProject() {
      this.showManualDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 导入产品
     */
    updata(data,flag) {
      if (data.length !== 0) {
        this.showManualDialog = false
        this.dialogVisible = false
        data.forEach(item => {
          if (item.priceOne === item.priceTwo) {
            this.disabled = true
            item.finalPrice = item.priceOne // 最终价格
          } else {
            item.finalPrice = item.priceOne
          }
          item.discount = item.discountNumber
          if(flag){
            item.quantity = 1
          }
          item.chineseUse = this.chineseUse
          item.westUse = this.westUse
          item.toDrugMode = this.toDrugMode
          item.dropVelocity = this.dropVelocity
          item.days = this.days
          item.dose = this.dose
        })
        // priceNum
        this.tableData.push(data)
        this.tableData.forEach(items => {
          items.forEach(item => {
            item.discountAmount = math.multiply(item.finalPrice, item.quantity, item.discount).toFixed(2)
            item.sumPrice = math.multiply(item.finalPrice, item.quantity).toFixed(2)
            this.$set(item, 'quantitySum', math.multiply(item.priceNum, item.quantity))
            // console.log('有咩有金额来')
          })
        })
        /**
         * @author 李尚
         * @date 14/5/2022
         * @Description: 新增计算所有的总值
         */
        let total = 0
        this.tableData.forEach(items => {
          items.forEach(item => {
            total = math.add(total, item.discountAmount).toFixed(2)
          })
        })
        this.accountsPayable = total
        this.templateData = []
      } else {
        this.$message.warning('请先选择项目！')
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/14
     * @Description: 删除
     */
    handleDelete(row, index) {
      console.log(row.auxiliaryNo)
      this.tableData[index].forEach(item => {
        this.removeIds.push(item.orderDetailsId)
      })
      this.$delete(this.tableData, index)
      let total = 0
      this.tableData.forEach(item => {
        item.forEach(ite => {
          if (parseFloat(ite.discountAmount) > 0) {
            total = math.add(total, ite.discountAmount).toFixed(2)
          }
        })
      })
      this.accountsPayable = total
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 保存
     */
    /**
     * @author 李尚
     * @date 16/5/2022
     * @Description: 添加防抖
     */
    addOrEdit() {
      if (this.tableData.length === 0) {
        this.$message('请添加产品')
        return
      }
      this.$refs.formInline.validate((valid) => {
        if (!valid) {
          this.$message('表单填写错误！')
          return
        }
        var orderDetails = []
        this.tableData.forEach(orderDetailList => {
          var uuiD = this.getUuiD(15)
          orderDetailList.forEach(orderDetail => {
            this.xmdeptId = orderDetail.departmentId
            orderDetails.push({
              'orderDetailsId': orderDetail.orderDetailsId,
              // 后续的同一组的用药方式和第一个一致
              'westUse': orderDetailList[0].westUse,
              'chineseUse': orderDetailList[0].chineseUse,
              'toDrugMode': orderDetailList[0].toDrugMode,
              'days': orderDetailList[0].days,
              'dose': orderDetailList[0].dose,
              'dropVelocity': orderDetailList[0].dropVelocity,
              'onlineUserId': this.formInline.onlineUserId, // 业绩
              'auxiliaryNo': uuiD,
              'aestheticConsultant': this.formInline.aestheticConsultant, // 顾问
              'billType': '6',
              'categoryId': orderDetail.categoryId,
              'company': orderDetail.priceUnit,
              'costType': orderDetail.costType,
              'customerRepresentative': this.formInline.customerRepresentative,
              'cycleDays': orderDetail.cycleDays,
              'departmentId': orderDetail.departmentId,
              'billingDepartment': this.formInline.billingDepartment,
              'deptId': this.deptId,
              'discount': orderDetail.discount,
              'discountAmount': orderDetail.discountAmount,
              'doctorId': this.formInline.doctorId, // 医生
              'dsingleUser': this.userInfo.userId,
              'eachTime': orderDetail.eachTime, // 每次用量
              'finalPrice': orderDetail.finalPrice,
              'id': this.formInline.id,
              'isDiscount': orderDetail.isDiscount,
              'itemId': orderDetail.itemId,
              'pharmacy': orderDetail.pharmacy,
              'priceNum': orderDetail.priceNum,
              'priceOne': orderDetail.priceOne,
              'priceTwo': orderDetail.priceTwo,
              'projectName': orderDetail.projectName,
              'quantity': orderDetail.quantity,
              'quantitySum': math.multiply(orderDetail.priceNum, orderDetail.quantity),
              // 设置新的剩余次数为新修改的次数
              'surplusQuantity': math.multiply(orderDetail.priceNum, orderDetail.quantity),
              'remark': orderDetail.remark,
              'secondRecommender': this.formInline.secondRecommender === undefined ? this.formInline.secondOpeningUser === undefined
                ? 0 : this.formInline.secondOpeningUser : this.formInline.secondRecommender
            })
          })
        })
        var orderInfo = {
          'orderId': this.billing.orderId,
          'onlineUserId': this.billing.onlineUserId,
          'aestheticConsultant': this.formInline.aestheticConsultant, // 顾问
          'amountPayable': this.accountsPayable, // 应付金额
          'billType': '6',
          'billingRemarks': this.formInline.billingRemarks, // 开单备注
          'deptId': this.deptId,
          'customerRepresentative': this.formInline.customerRepresentative, // 客户代表
          'customerStatus': this.formInline.customerStatus, // 顾客状态(1新2老)
          'isSecondary': this.formInline.isSecondary, // 顾客状态(1新2老)
          'departmentId': this.xmdeptId, // 科室
          'billingDepartment': this.formInline.billingDepartment, // 科室
          'id': this.formInline.id,
          'doctorId': this.formInline.doctorId, // 医生
          'refereeuserId': this.formInline.refereeuserId, // 推荐员工编号
          'dsingleUser': this.userInfo.userId,
          'secondRecommender': this.formInline.secondRecommender === undefined ? this.formInline.secondOpeningUser === undefined
            ? 0 : this.formInline.secondOpeningUser : this.formInline.secondRecommender,
          'jdxxId': this.formInline.jdxxId,
          'totalExpenses': this.accountsPayable,
          'orderNumber': this.formInline.orderNumber
        }
        // 有billType走修改
        if (this.billType !== undefined) {
          this.$api.billingList.editOrderInfo({
            'orderInfo': orderInfo,
            'orderDetailsList': orderDetails,
            'removeIds': this.removeIds
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.closeTag()
              // this.$router.push('/billingManagementCompany')
            }
          })
        } else {
          // console.log(orderInfo, orderDetails, '没有billType走添加')
          // 没有billType走添加
          this.$api.billingList.addOrderInfo({
            'orderInfo': orderInfo,
            'orderDetailsList': orderDetails
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.closeTag()
              // this.$router.push('/billingManagementCompany')
            }
          })
        }
      })
    },
    remode() {
      this.closeTag()
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 获取用户信息
     */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态 添加岗位
       */
      const data = {
        deptId: deptId,
        status: '0'
        // departmentId: this.billing.departmentId
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          this.copySysUserList = this.sysUserList
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.copyDoctor = this.doctor
            }
          }) // 医生
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 获取科室列表
     */
    getDepartment() {
      this.loadingData = true
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0' }, 'get').then((res) => {
        if (res) {
          this.departmentList = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 个人账户信息
     */
    getCustomCardSum() {
      this.$api.RechargeableCard.customCardSum({
        id: this.billing.id
      }).then(res => {
        if (res.rows.length !== 0) {
          this.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
            res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
          this.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal, res.rows[0].departmentalPrincipal)
          this.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
          this.deposit = res.rows[0].deposit
          this.advancePayment = res.rows[0].advancePayment
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/14
     * @Description: 获取给药途径
     */
    getAdministrationRouteSetting() {
      // 添加状态
      this.$api.basicMedicalData.drugDeliveryRouteList({ status: '0' }).then(res => {
        if (res) {
          this.drugDeliveryRouteList = res.rows
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-input-number__decrease {
  display: none;
}

::v-deep .el-input-number__increase {
  display: none;
}

//number 宽度调整
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}

.formBody {
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 5px 10px 10px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 10px 0 10px;
  //margin-right: 40px;
  //margin-top: 20px;
  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.formBodys {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 40px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;

  .title {
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }

  .form-left {
    width: 25%;
    min-height: 260px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }

  .form-right {
    width: 73%;
    min-height: 260px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #c6c6c6;
  }
}

.titme {
  height: 40px;
  line-height: 40px;
  color: #ffff;
  font-size: 14px;
  margin-top: 10px;
  background-color: #1abc9c;
}

.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.select {
  padding-left: 15px;
}

.header {
  font-size: 12px;
  padding-top: 5px;
  margin-bottom: 5px;
}

.titel {
  margin-top: 15px;
  margin-left: 25px;
  font-size: 12px;
}

.management {
  padding: 6px 40px;

  .itemment {
    color: #1abc9c;
    font-size: 14px;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }

  a {
    font-size: 12px;
    color: #1abc9c;
    text-decoration: none;
  }
}

.end {
  font-size: 12px;
  margin-right: 20px;

  .red {
    font-weight: 400;
    color: red;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;

  .content {
    position: fixed;
    right: 20px;
  }
}
</style>
