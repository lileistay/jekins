<template>
  <!--  分诊登记-->
  <div>
    <div class="headers">
      <div class="left">
        <el-card>
          <div slot="header" class="titenaem">
            {{ customer.customerName }}
            <template v-for="item in dict.type.whether_Newguest">
              <span v-if="customer.customerStatus === item.value" :key="item.value" class="spantitem">
                {{ item.label }}
              </span>&nbsp;
            </template>
            <span class="spantitem">卡号：{{ customer.customCardNumber }}</span>
          </div>
          <p>美学顾问： {{ customer.acName }}</p>
          <p>治疗状态： {{ customer.treatmentStatus }}</p>
          <p>会员等级： {{ customer.levelDescription }}</p>
          <p>欠款总额： {{ customer.totalArrears }}</p>
          <el-form :inline="true" size="mini">
            <el-form-item label="身份证号:">
              <el-input v-model="customer.card" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-folder-checked" type="primary" :plain="true" size="mini" @click="submitCard">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="right">
        <el-card v-for="(detail,indexKey) in details" :key="indexKey" style="margin-bottom: 10px">
          <div slot="header" class="titenaem">
            {{ detail.projectName }}
            <span class="spantitem">套餐 </span>&nbsp;
            <span class="spantitem">第{{ detail.numberTime }}次治疗</span>&nbsp;
            <span class="spantitem">总次数：{{ detail.quantitySum }}</span>&nbsp;
            <span class="spantitem">剩余次数：{{ detail.surplusQuantity }}</span>&nbsp;
            <span class="spantitem">已缴费用：{{ detail.discountAmount }}</span>&nbsp;
            <span class="spantitem">欠款金额：{{ }}</span>
          </div>
          <el-form ref="treatment" :model="detail" :rules="rules" label-width="150px" size="mini" class="from">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="回访类型：" prop="returnTypeId">
                  <div style="position: relative">
                    <el-select v-model="detail.returnTypeId" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in returnVisitType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('returnTypeId',detail.returnTypeId)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item label="排台类型：" prop="terraceType">
                  <div style="position: relative">
                    <el-select v-model="detail.terraceType" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in dict.type.terrace_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('terraceType',detail.terraceType)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="计划治疗次数：" prop="estimateScribingNum">
                  <el-input-number
                    v-model="detail.estimateScribingNum"
                    :precision="0"
                    :min="1"
                    @blur="scribingNum(detail)"
                    @input="()=>$forceUpdate()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :label="callDoctor(detail.departmentType)[0]" prop="doctorId">
                  <div style="position: relative">
                    <el-select v-model="detail.doctorId" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in doctor"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('doctorId',detail.doctorId)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="项目类型：" prop="projectType">
                  <div style="position: relative">
                    <el-select v-model="detail.projectType" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in dict.type.project_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('projectType',detail.projectType)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="是否体验：" prop="isExperience">
                  <div style="position: relative">
                    <el-select v-model="detail.isExperience" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in dict.type.whether"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('isExperience',detail.isExperience)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :label="callDoctor(detail.departmentType)[1]" prop="nursing">
                  <div style="position: relative">
                    <el-select v-model="detail.nursing" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in huli"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('nursing',detail.nursing)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="仪器：" prop="deviceId">
                  <div style="position: relative">
                    <el-select v-model="detail.deviceId" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in deviceList"
                        :key="item.deviceId"
                        :label="item.equipmentName"
                        :value="item.deviceId"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('deviceId',detail.deviceId)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="医助：" prop="doctorAssistant">
                  <div style="position: relative">
                    <el-select v-model="detail.doctorAssistant" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in yizhu"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('doctorAssistant',detail.doctorAssistant)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="巡回护士：" prop="circulatingNurse">
                  <div style="position: relative">
                    <el-select v-model="detail.circulatingNurse" :filterable="true" :clearable="true">
                      <el-option
                        v-for="item in sysUserList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-button
                      v-if="details.length>1"
                      size="mini"
                      type="primary"
                      :plain="true"
                      style="position: absolute"
                      @click="copySelection('circulatingNurse',detail.circulatingNurse)"
                    >同步选择
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="19">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="detail.remark" :maxlength="50" :show-word-limit="true" style="width: 90%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button
          :loading="showSubmit"
          type="primary"
          :plain="true"
          icon="el-icon-folder-checked"
          size="mini"
          @click="submitTriage"
        >保存
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'
import { math } from '@/utils/math'

export default {
  name: 'TriageRegistrations',
  dicts: ['project_type', 'whether', 'terrace_type', 'whether_Newguest'],
  data() {
    return {
      loadingData: false,
      showSubmit: false,
      sysUserList: [],
      doctor: [],
      huli: [],
      yizhu: [],
      deviceList: [],
      returnVisitType: [],
      details: [],
      // 客户信息
      customer: {
        card: ''
      },
      rules: {
        returnTypeId: [{ required: true, message: '请选择回访类型', trigger: 'blur' }],
        doctorId: [{ required: true, message: '请选择医生', trigger: 'blur' }]
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
    // 初始化数据
    this.init()
    // 获取员工列表
    this.getUserList(this.deptId)
    // 获取仪器列表
    this.getDevice()
    this.getReturnVisitType()
  },
  methods: {
    // 初始化数据
    init() {
      // 得到上一个页面传递的多个发起治疗的数据
      this.details = this.$store.getters.triageSelectionData
      // this.details = this.$route.params.data
      // 左侧的客户信息使用数组第一个的数据
      this.customer.customerName = this.details[0].customerName
      this.customer.customCardNumber = this.details[0].customCardNumber
      this.customer.acName = this.details[0].acName
      this.customer.doctorName = this.details[0].doctorName
      this.customer.id = this.details[0].id
      this.customer.card = this.details[0].card
      this.customer.customerStatus = this.details[0].customerStatus
      this.customer.totalArrears = this.details[0].totalArrears
      this.customer.levelDescription = this.details[0].levelDescription
      this.customer.treatmentStatus = this.details[0].treatmentNum > 0 ? '复诊' : '初诊'
      this.details.forEach(detail => {
        // 计划治疗次数默认为1
        detail.estimateScribingNum = 1
        // 循环赋值本次为第几次治疗
        detail.numberTime = math.add(detail.treatmentNum, 1)
        // 默认开单时选择的医生
        detail.doctorId = detail.doctorId ? detail.doctorId : undefined
        this.$set(detail, 'deviceId', undefined)
        this.$set(detail, 'terraceType', undefined)
        this.$set(detail, 'serviceAssistant', undefined)
        this.$set(detail, 'doctorAssistant', undefined)
        this.$set(detail, 'nursing', undefined)
        this.$set(detail, 'circulatingNurse', undefined)
        this.$set(detail, 'isExperience', undefined)
        this.$set(detail, 'projectType', undefined)
        this.$set(detail, 'remark', undefined)
      })
    },
    // 同步选择
    copySelection(attrName, value) {
      if (attrName) {
        this.details.forEach(detail => {
          this.$set(detail, attrName, value)
        })
      }
      this.$forceUpdate()
    },
    scribingNum(item) {
      // 计划治疗次数
      if (item.thisScribingNum > item.surplusQuantity) {
        item.thisScribingNum = 1
        this.$message.error('计划治疗次数不能大于剩余次数！')
      }
    },
    // 根据科室类型计算医生称呼
    callDoctor(departmentType) {
      let call = []
      switch (departmentType) {
        case '1':
          call = ['洗浴师:', '责任月嫂:']
          break
        case '2':
        case '3':
          call = ['产康师:', '护士:']
          break
        case '7':
          call = ['口腔医生:', '口腔护士:']
          break
        default:
          call = ['医生:', '护士:']
      }
      return call
    },
    // 保存
    submitTriage() {
      // 校验全部的表单
      const promiseList = this.$refs.treatment.map(v => v.validate())
      Promise.all(promiseList).then(() => {
        // 此处校验全部通过
        this.showSubmit = true
        const deductionRecords = []
        this.details.forEach(detail => {
          const deductionRecord = {
            deptId: detail.deptId, // 公司
            waitId: detail.waitId,
            id: detail.id, // 顾客编号
            doctorId: detail.doctorId, // 顾客编号
            departmentId: detail.departmentId,
            deductionDepartment: detail.departmentId, // 划扣科室
            estimateScribingNum: detail.estimateScribingNum, // 计划治疗次数
            waitSource: detail.waitSource,
            state: '1',
            // 当前项目的已治疗次数=0是初诊，其余是复诊
            treatmentStatus: detail.treatmentNum === 0 ? '1' : '2',
            totalPayment: detail.discountAmount,
            quantitySum: detail.quantitySum,
            returnTypeId: detail.returnTypeId,
            orderNumber: detail.orderNumber,
            terraceType: detail.terraceType, // 排台类型
            circulatingNurse: detail.circulatingNurse, // 巡回护士
            deviceId: detail.deviceId, // 仪器
            doctorAssistant: detail.doctorAssistant, // 医助
            nursing: detail.nursing, // 护理
            projectType: detail.projectType, // 项目类型
            isExperience: detail.isExperience, // 是否体验
            remark: detail.remark
          }
          deductionRecords.push(deductionRecord)
        })
        this.$api.medical.addDeductionRecords(deductionRecords).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.closeTag()
          }
        }).finally(() => {
          this.showSubmit = false
        })
      }).catch(error => {
        console.log(error, 'err')
      }).finally(() => {
        this.showSubmit = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/5
     * @Description: 保存顾客身份证号
     */
    submitCard() {
      if (this.customer.card !== '' || this.customer.card !== undefined) {
        this.$api.user.updateUserInfo({
          id: this.customer.id,
          card: this.customer.card
        }).then(res => {
          if (res) {
            this.$message.success(res.msg)
          }
        })
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 获取回访类型
     */
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
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 获取仪器列表
     */
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
    /**
     * @author Nevin
     * @date 2022/6/5
     * @Description: 获取用户列表
     */
    getUserList() {
      /**
       * @author 李尚
       * @date 2022/6/17
       * @Description: 人员添加公司Id 添加状态
       */
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
          res.data.forEach(item => {
            if (item.postCode === 'xhhushi') {
              this.sysUserList.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'yizhu') {
              this.yizhu.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'huli') {
              this.huli.push(item)
            }
          })
        }
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

.left {
    width: 20%;
}

.right {
    width: 79%;
}

.from {
    margin-left: 40px;
}

p {
    font-size: 12px;
    line-height: 25px;
}

.titenaem:before,
.titenaem:after {
    display: table;
    content: "";
}

.titenaem:after {
    clear: both
}

.spantitem {
    font-size: 12px;
}
</style>

