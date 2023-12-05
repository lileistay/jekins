<template>
  <!--  所有发起治疗共用的治疗页面 -->
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
          <p>美学顾问：{{ customer.acName }}</p>
          <p>主诊医生：{{ customer.doctorName }}</p>
          <p>欠款总额： {{ customer.totalArrears }}</p>
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
          <el-form ref="treatment" :model="detail" :rules="rules" label-width="130px" size="mini" class="from">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="实际执行人：" prop="actualExecutorUser">
                  <el-select v-model="detail.actualExecutorUser" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in sysUserList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="当前治疗次数：" prop="thisScribingNum">
                  <el-input-number
                    v-model="detail.thisScribingNum"
                    :precision="0"
                    :min="1"
                    @blur="scribingNum(detail)"
                    @input="()=>$forceUpdate()"
                  />
                </el-form-item>
                <el-form-item label="仪器：" prop="deviceId">
                  <el-select v-model="detail.deviceId" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in deviceList"
                      :key="index"
                      :label="item.equipmentName"
                      :value="item.deviceId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="服务助理：" prop="serviceAssistant">
                  <el-select v-model="detail.serviceAssistant" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in huli"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="医助：" prop="doctorAssistant">
                  <el-select v-model="detail.doctorAssistant" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in yizhu"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="治疗时长(分)：" prop="treatmentLength">
                  <el-input-number v-model="detail.treatmentLength" :precision="0" :min="1" style="width: 165px;" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="护士/护理/月嫂：" prop="nursing">
                  <el-select v-model="detail.nursing" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in huli"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="巡回护士：" prop="circulatingNurse">
                  <el-select v-model="detail.circulatingNurse" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in circusysUserList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否体验：" prop="isExperience">
                  <el-select v-model="detail.isExperience" :filterable="true" :clearable="true">
                    <el-option
                      v-for="(item, index) in dict.type.whether"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="治疗时间：" prop="treatmentTime">
                  <el-date-picker
                    v-model="detail.treatmentTime"
                    style="width:100%"
                    :clearable="true"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="项目类型：" prop="projectType">
                  <el-select v-model="detail.projectType" :filterable="true" :clearable="true">
                    <el-option
                      v-for="item in dict.type.project_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <!-- 科室类型为4是整形类型，有麻醉师 -->
                <el-form-item v-if="detail.departmentType === '4'" label="麻醉师：" prop="anesthesiologist">
                  <el-select v-model="detail.anesthesiologist" :filterable="true" placeholder="请选择麻醉师">
                    <el-option v-for="item in sysUserList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item v-if="detail.departmentType === '4'" label="麻醉方式：" prop="anesthesiaMethod">
                  <el-select v-model="detail.anesthesiaMethod" :filterable="true" placeholder="请选择麻醉方式">
                    <el-option
                      v-for="item in dict.type.Anesthesia_mode"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="detail.remark" :show-word-limit="true" :clearable="true" />
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
          @click="submit"
        >保存
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'
import { timeFmt } from '@/utils/time'
import { math } from '@/utils/math'

export default {
  name: 'InitiateTreatment',
  dicts: ['project_type', 'whether', 'terrace_type', 'Anesthesia_mode'],
  data() {
    return {
      numberTime: 0,
      loadingData: false,
      showSubmit: false,
      sysUserList: [],
      circusysUserList: [],
      yizhu: [],
      huli: [],
      deviceList: [],
      // 上个页面传递的多个可以发起治疗的数据
      details: [],
      // 客户信息
      customer: {},
      rules: {
        actualExecutorUser: [{ required: true, message: '请选择实际执行人', trigger: 'change' }],
        thisScribingNum: [{ required: true, message: '请输入治疗次数', trigger: 'blur' }],
        treatmentTime: [{ required: true, message: '请选择治疗时间', trigger: 'blur' }]
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
      this.getDevice()
      this.getUserList(val)
    }
  },
  created() {
    // 初始化数据
    this.init()
    // 获取员工列表
    this.getUserList(this.deptId)
    // 获取仪器列表
    this.getDevice()
  },
  methods: {
    // 初始化数据
    init() {
      // 得到上一个页面传递的多个发起治疗的数据
      this.details = this.$store.getters.treatmentSelectionData
      console.log(this.details,'哈哈哈')
      // 左侧的客户信息使用数组第一个的数据
      this.customer.customerName = this.details[0].customerName
      this.customer.customCardNumber = this.details[0].customCardNumber
      this.customer.id = this.details[0].id
      this.customer.acName = this.details[0].acName
      this.customer.doctorName = this.details[0].doctorName
      this.customer.customerStatus = this.details[0].customerStatus
      this.customer.totalArrears = this.details[0].totalArrears
      this.details.forEach(detail => {
        // 循环赋值本次治疗次数为计划治疗次数
        detail.thisScribingNum = detail.estimateScribingNum
        // 循环赋值本次为第几次治疗
        detail.numberTime = math.add(detail.treatmentNum, 1)
        // 实际执行人默认是医生
        detail.actualExecutorUser = detail.doctorId
        detail.deviceId = detail.deviceId ? detail.deviceId : undefined
        this.$set(detail, 'anesthesiologist', detail.anesthesiologist ? detail.anesthesiologist : undefined)
        this.$set(detail, 'anesthesiaMethod', detail.anesthesiaMethod ? detail.anesthesiaMethod : undefined)
        this.$set(detail, 'serviceAssistant', detail.serviceAssistant ? detail.serviceAssistant : undefined)
        this.$set(detail, 'circulatingNurse', detail.circulatingNurse ? detail.circulatingNurse : undefined)
        this.$set(detail, 'nursing', detail.nursing ? detail.nursing : undefined)
        this.$set(detail, 'doctorAssistant', detail.doctorAssistant ? detail.doctorAssistant : undefined)
        this.$set(detail, 'treatmentLength', undefined)
        this.$set(detail, 'treatmentTime', timeFmt('YYYY-mm-dd HH:MM:SS', new Date()))
      })
    },
    scribingNum(item) {
      // 计划治疗次数
      if (item.thisScribingNum > item.surplusQuantity) {
        item.thisScribingNum = 1
        this.$message.error('计划治疗次数不能大于剩余次数！')
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 保存
     */
    submit() {
      // 校验全部的表单
      const promiseList = this.$refs.treatment.map(v => v.validate())
      Promise.all(promiseList).then(() => {
        // 此处校验全部通过
        this.showSubmit = true
        const deductionRecords = []
        this.details.forEach(detail => {
          const deductionRecord = {
            waitId: detail.waitId,
            id: detail.id, // 顾客编号
            departmentId: detail.departmentId,
            deductionId: detail.deductionId,
            waitSource: detail.waitSource,
            state: '2',
            caozuoType: '2',
            // 当前项目的已治疗次数=0是初诊，其余是复诊
            treatmentStatus: detail.treatmentNum === 0 ? '1' : '2',
            totalPayment: detail.discountAmount,
            quantitySum: detail.quantitySum,
            returnTypeId: detail.returnTypeId,
            orderNumber: detail.orderNumber,
            actualExecutorUser: detail.actualExecutorUser, // 实际执行人
            circulatingNurse: detail.circulatingNurse, // 巡回护士
            deviceId: detail.deviceId, // 仪器
            doctorAssistant: detail.doctorAssistant, // 皮肤医助
            nursing: detail.nursing, // 皮肤护理
            projectType: detail.projectType, // 项目类型
            remark: detail.remark,
            serviceAssistant: detail.serviceAssistant, // 服务助理
            anesthesiaMethod: detail.anesthesiaMethod, // 麻醉方式
            anesthesiologist: detail.anesthesiologist, // 麻醉师
            thisScribingNum: detail.thisScribingNum, // 当前治疗次数
            treatmentLength: detail.treatmentLength, // 治疗时长
            treatmentTime: detail.treatmentTime // 治疗时间
          }
          deductionRecords.push(deductionRecord)
        })
        this.$api.medical.editDeductionRecords(deductionRecords).then(res => {
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
     * @date 2022/6/6
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
          this.sysUserList = this.unique(res.data)
          res.data.forEach(item => {
            if (item.postCode === 'xhhushi') {
              this.circusysUserList.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'huli') {
              this.huli.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'yizhu') {
              this.yizhu.push(item)
            }
          })
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 关闭当前页面
     */
    close() {
      this.closeTag()
    },
    closeTag() {
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

/* //number 宽度调整 */
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

