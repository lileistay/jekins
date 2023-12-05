<template>
  <!--表格页面的，一个页面合并医生等字段，分诊登记-->
  <div>
    <div class="headers">
      <div class="left">
        <div class="line">
          <div class="title">客户基本信息</div>
          <el-form ref="from" :model="from" label-width="100px" size="mini" class="from">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="客户：">
                  <el-input v-model="from.customerName" :disabled="true" />
                </el-form-item>
                <el-form-item label="门诊病例：">
                  <el-input v-model="from.ceshi" :disabled="true" />
                </el-form-item>
                <el-form-item label="治疗状态：">
                  <el-select filterable v-model="from.treatmentType" :disabled="true">
                    <el-option v-for="item in dict.type.treatment_type" :key="item.value" :value="item.value" :label="item.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="客户类型：">
                  <el-select filterable v-model="from.customerStatus" :disabled="true">
                    <el-option v-for="item in dict.type.whether_Newguest" :key="item.value" :value="item.value" :label="item.label" />
                  </el-select>
                </el-form-item>
                <el-form-item label="美学顾问：">
                  <el-input v-model="from.acName" :disabled="true" />
                </el-form-item>
                <el-form-item label="身份证号：">
                  <el-input v-model="from.card" />
                  <el-button icon="el-icon-folder-checked" type="primary" :plain="true" size="mini" @click="saveCard">
                    保存身份证号
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="right">
        <div class="line">
          <div class="title">治疗信息</div>
          <el-form ref="treatment" :model="treatment" :rules="rules" label-width="100px" size="mini" class="from">
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="医生：" prop="doctorId">
                  <el-select  v-model="treatment.doctorId" :filterable="true" placeholder="请选择">
                    <el-option v-for="item in sysUserList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="仪器：" prop="deviceId">
                  <el-select v-model="treatment.deviceId" :filterable="true" :clearable="true">
                    <el-option
                      v-for="item in deviceList"
                      :key="item.deviceId"
                      :label="item.equipmentName"
                      :value="item.deviceId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="排台类型：" prop="terraceType">
                  <el-select v-model="treatment.terraceType" :filterable="true" :clearable="true">
                    <el-option
                      v-for="item in dict.type.terrace_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="护士：" prop="circulatingNurse">
                  <el-select v-model="treatment.circulatingNurse" :filterable="true" placeholder="请选择">
                    <el-option v-for="item in sysUserList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="麻醉师：" prop="anesthesiologist">
                  <el-select v-model="treatment.anesthesiologist" :filterable="true" placeholder="请选择">
                    <el-option v-for="item in sysUserList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="回访类型：" prop="returnTypeId">
                  <el-select v-model="treatment.returnTypeId" :filterable="true" :clearable="true">
                    <el-option
                      v-for="item in returnVisitType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="麻醉方式：" prop="anesthesiaMethod">
                  <el-select v-model="treatment.anesthesiaMethod" :filterable="true" placeholder="请选择">
                    <el-option v-for="item in dict.type.Anesthesia_mode" :key="item.value" :value="item.value" :label="item.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item label="备注：" prop="remarks">
                  <el-input v-model="treatment.remarks" :filterable="true" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="line" style="margin-top: 10px;padding: 15px">
          <div class="title">项目信息</div>
          <el-table
            :data="tableData"
            :border="true"
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column prop="projectName" label="项目名称" width="300" />
            <el-table-column prop="quantitySum" label="产品总次数" />
            <el-table-column prop="treatmentNum" label="已治疗次数" />
            <el-table-column prop="surplusQuantity" label="剩余次数" />
            <el-table-column prop="refundNum" label="退款次数" />
            <el-table-column prop="estimateScribingNum" label="计划治疗次数" width="200">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.estimateScribingNum"
                  size="mini"
                  :precision="0"
                  :min="1"
                  @blur="inspectScribingNum(scope.row)"
                  @input="() => $forceUpdate()"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button
          type="primary"
          :plain="true"
          icon="el-icon-folder-checked"
          size="mini"
          @click="submitRepayment"
        >保存
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'

export default {
  dicts: ['whether_Newguest', 'treatment_type', 'Anesthesia_mode', 'terrace_type'],
  name: 'TriageRegistration',
  data() {
    return {
      // 路由query传递的数据
      details: [],
      tableData: [],
      sysUserList: [],
      // 仪器列表
      deviceList: [],
      // 回访类型
      returnVisitType: [],
      // 客户基本信息
      from: {
        customerName: '', // 姓名
        acName: '', // 美学顾问
        customerStatus: '', // 类型
        card: '', // 身份证号
        treatmentType: '', // 治疗状态
        ceshi: '' // 门诊病例
      },
      num: 0,
      // 治疗信息
      treatment: {
        // 医生id 护士 麻醉方式 回访类型 麻醉师 仪器 备注
        doctorId: null,
        circulatingNurse: null,
        anesthesiaMethod: null,
        returnTypeId: null,
        anesthesiologist: null,
        deviceId: null,
        remarks: ''
      },
      rules: {
        doctorId: [{ required: true, message: '请选择医生', trigger: 'blur' }],
        circulatingNurse: [{ required: true, message: '请选择护士', trigger: 'blur' }],
        returnTypeId: [{ required: true, message: '请选择回访类型', trigger: 'blur' }]
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
    }
  },
  created() {
    // 获取传递的多个项目信息，其中客户信息是一样的
    this.details = this.$store.getters.triageSelectionData
    // this.details = this.$route.params.data
    this.from = this.details[0]
    this.tableData = this.details
    this.treatment.doctorId = this.details[0].doctorId === 0 ? null : this.details[0].doctorId
    this.treatment.circulatingNurse = this.details[0].circulatingNurse
    this.getUserList(this.deptId)
    this.getDevice()
    this.getReturnVisitType()
  },
  methods: {
    // 判断计划治疗次数
    inspectScribingNum(val) {
      if (!val.estimateScribingNum) {
        val.estimateScribingNum = 1
      }
      // 计划治疗次数
      if (val.surplusQuantity < val.estimateScribingNum) {
        this.$message.error('计划治疗次数不能大于剩余次数！')
        val.estimateScribingNum = 1
      }
    },
    // 保存分诊登记
    submitRepayment() {
      // 1.将项目列表上面的数据绑定在列表中
      const deductionRecords = []
      this.tableData.forEach(item => {
        const deductionRecord = {
          deptId: item.deptId, // 公司
          waitId: item.waitId,
          id: item.id, // 顾客编号
          departmentId: item.departmentId, // 科室id
          deductionDepartment: item.departmentId, // 划扣科室
          state: '1',
          totalPayment: item.totalPayment,
          quantitySum: item.quantitySum,
          orderNumber: item.orderNumber,
          customCardNumber: item.customCardNumber,
          // 当前项目的已治疗次数=0是初诊，其余是复诊
          treatmentStatus: item.treatmentNum === 0 ? '1' : '2',
          projectName: item.projectName, // 项目名称
          estimateScribingNum: item.estimateScribingNum, // 计划治疗次数
          returnTypeId: this.treatment.returnTypeId, // 回访类型
          doctorId: this.treatment.doctorId, // 医生
          terraceType: this.treatment.terraceType, // 排台类型
          circulatingNurse: this.treatment.circulatingNurse, // 护士
          anesthesiaMethod: this.treatment.anesthesiaMethod, // 麻醉方式
          anesthesiologist: this.treatment.anesthesiologist, // 麻醉师
          deviceId: this.treatment.deviceId, // 仪器
          remark: this.treatment.remark
        }
        deductionRecords.push(deductionRecord)
      })
      // 2.调用接口修改数据
      this.$refs.treatment.validate((valid) => {
        if (valid) {
          this.$api.medical.addDeductionRecords(deductionRecords).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.closeTag()
            }
          })
        }
      })
    },
    // 保存身份证号码
    saveCard() {
      if (this.from.card !== '' || this.from.card !== undefined) {
        this.$api.user.updateUserInfo({
          id: this.from.id,
          card: this.from.card
        }).then(res => {
          if (res) {
            this.$message.success(res.msg)
          }
        })
      }
    },
    getUserList() {
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
          this.sysUserList = this.unique(res.data)
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取回访类型
    getReturnVisitType() {
      const data = {
        deptId: this.deptId,
        departmentId: this.details[0].billingDepartment,
        status: 1
      }
      this.$api.medical.returnVisitTypeInfolist(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            this.returnVisitType.push({ value: item.returnTypeId, label: item.typeName })
          })
        }
      })
    },
    // 获取仪器列表
    getDevice() {
      this.loadingData = true
      this.$api.medical.deviceManagementlist({
        deptId: this.deptId,
        departmentId: this.details[0].departmentId,
        status: '0' // 添加状态
      }).then(res => {
        if (res) {
          this.deviceList = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    // 关闭当前页面
    close() {
      this.closeTag()
    },
    closeTag() {
      // 将存储到store里的数据删除
      this.$store.dispatch('setTriageSelectionData', [])
      vm.$emit('closeTag', this.$route.path)
    }
  }
}
</script>

<style scoped>
::v-deep .el-input-number__decrease {
    display: none;
}

::v-deep .el-input-number__increase {
    display: none;
}

/*//number 宽度调整*/
::v-deep .el-input-number .el-input__inner {
    padding: 0;
    width: 80px;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 35px;
    background-color: #fff;
    z-index: 1000;
}

.content {
    position: fixed;
    padding-top: 5px;
    right: 20px;
}

.headers {
    display: flex;
    justify-content: space-between;
    padding: 20px 15px 0 15px;
}

.left{
    width: 33%;
}

.right {
    width: 65%;
}

.line {
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
}

.title {
    position: absolute;
    top: -9px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
}

.from {
    margin-top: 20px;
    margin-left: 40px;
}
</style>
