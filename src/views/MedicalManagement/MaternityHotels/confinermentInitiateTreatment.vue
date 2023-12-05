<template>
  <!--  发起治疗-->
  <div>
    <div class="headers">
      <div class="left">
        <el-card>
          <div slot="header" class="titenaem">
            {{ data.customerName }}
            <span class="spantitem">(新客户)无</span>&nbsp;
            <span class="spantitem">卡号：{{ data.customCardNumber }}</span>
          </div>
          <p>美学顾问：{{ data.acName }}</p>
          <p>主诊医生：{{ data.doctorName }}</p>
          <p>欠款总额：</p>
        </el-card>
      </div>
      <div class="right">
        <el-card>
          <div slot="header" class="titenaem">
            {{ data.projectName }}
            <span class="spantitem">套餐 </span>&nbsp;
            <span class="spantitem">第{{ numberTime }}次治疗</span>&nbsp;
            <span class="spantitem">总次数：{{ data.quantitySum }}</span>&nbsp;
            <span class="spantitem">剩余次数：{{ data.surplusQuantity }}</span>&nbsp;
            <span class="spantitem">已缴费用：{{ data.discountAmount }}</span>&nbsp;
            <span class="spantitem">欠款金额：0</span>
          </div>
          <el-form ref="treatment" :model="treatment" :rules="rules" label-width="130px" size="mini" class="from">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="实际执行人：" prop="actualExecutorUser">
                  <el-select v-model="treatment.actualExecutorUser" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in sysUserList"
                      :key="idnex"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="当前治疗次数：" prop="thisScribingNum">
                  <el-input-number v-model="treatment.thisScribingNum" :precision="0" :min="1" style="width: 165px;" @change="ScribingNum" />
                </el-form-item>
                <el-form-item label="仪器：" prop="deviceId">
                  <el-select v-model="treatment.deviceId" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in deviceList"
                      :key="idnex"
                      :label="item.equipmentName"
                      :value="item.deviceId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="服务助理：" prop="serviceAssistant">
                  <el-select v-model="treatment.serviceAssistant" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in yizhu"
                      :key="idnex"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="皮肤医助：" prop="doctorAssistant">
                  <el-select v-model="treatment.doctorAssistant" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in yizhu"
                      :key="idnex"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="治疗时长(分)：" prop="treatmentLength">
                  <el-input-number v-model="treatment.treatmentLength" :precision="0" :min="1" style="width: 165px;" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="皮肤护理：" prop="nursing">
                  <el-select v-model="treatment.nursing" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in yizhu"
                      :key="idnex"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="巡回护士：" prop="circulatingNurse">
                  <el-select v-model="treatment.circulatingNurse" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in circusysUserList"
                      :key="idnex"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否体验：" prop="isExperience">
                  <el-select v-model="treatment.isExperience" filterable clearable>
                    <el-option
                      v-for="(item, idnex) in dict.type.whether"
                      :key="idnex"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="治疗时间：" prop="treatmentTime">
                  <el-date-picker
                    v-model="treatment.treatmentTime"
                    style="width:100%"
                    clearable
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="项目类型：" prop="projectType">
                  <el-select v-model="treatment.projectType" filterable clearable>
                    <el-option
                      v-for="item in dict.type.project_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="21">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="treatment.remark" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button :loading="showSubmit" type="primary" plain icon="el-icon-folder-checked" size="mini" @click="submit">保存</el-button>
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
  name: 'OralTherapy',
  dicts: ['project_type', 'whether', 'terrace_type'],
  data() {
    return {
      numberTime: 0,
      loadingData: false,
      showSubmit: false,
      sysUserList: [],
      circusysUserList: [],
      yizhu: [],
      deviceList: [],
      data: {},
      treatment: {
        actualExecutorUser: undefined,
        thisScribingNum: undefined,
        deviceId: undefined,
        serviceAssistant: undefined,
        doctorAssistant: undefined,
        treatmentLength: undefined,
        nursing: undefined,
        circulatingNurse: undefined,
        isExperience: undefined,
        treatmentTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()),
        projectType: undefined,
        remark: undefined
      },
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
    this.data = JSON.parse(this.$route.query.data)
    // console.log(this.data, 'this.datathis.data')
    // this.treatment = this.data
    this.treatment.thisScribingNum = this.data.estimateScribingNum
    this.treatment.remark = this.data.remark
    this.numberTime = math.add(this.data.treatmentNum, 1)
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getDevice()
  },
  methods: {
    ScribingNum() {
      // 计划治疗次数
      if (this.treatment.thisScribingNum > this.data.surplusQuantity) {
        this.treatment.thisScribingNum = ''
        this.$message.error('计划治疗次数不能大于剩余次数！')
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/6
     * @Description: 保存
     */
    submit() {
      this.$refs.treatment.validate((valid) => {
        if (valid) {
          this.showSubmit = true
          /**
           * @author 李尚
           * @date 2022/10/11
           * @Description: 传值修改
           */
          var data = {
            waitId: this.data.waitId,
            id: this.data.id, // 顾客编号
            departmentId: this.data.departmentId,
            deductionId: this.data.deductionId,
            deductionDepartment: this.data.departmentId,
            waitSource: this.data.waitSource,
            state: '2',
            caozuoType: '2',
            totalPayment: this.data.discountAmount,
            quantitySum: this.data.quantitySum,
            returnTypeId: this.data.returnTypeId,
            orderNumber: this.data.orderNumber,
            actualExecutorUser: this.treatment.actualExecutorUser, // 实际执行人
            circulatingNurse: this.treatment.circulatingNurse, // 巡回护士
            deviceId: this.treatment.deviceId, // 仪器
            doctorAssistant: this.treatment.doctorAssistant, // 皮肤医助
            nursing: this.treatment.nursing, // 皮肤护理
            projectType: this.treatment.projectType, // 项目类型
            remark: this.treatment.remark,
            serviceAssistant: this.treatment.serviceAssistant, // 服务助理
            thisScribingNum: this.treatment.thisScribingNum, // 当前治疗次数
            treatmentLength: this.treatment.treatmentLength, // 治疗时长
            treatmentTime: this.treatment.treatmentTime // 治疗时间
          }
          this.$api.medical.editDeductionRecord(data).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.closeTag()
            }
          }).finally(() => {
            this.showSubmit = false
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
        departmentId: this.data.departmentId,
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
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          res.data.forEach(item => {
            if (item.postCode === 'xhhushi') {
              this.circusysUserList.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'huli') {
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
::v-deep .el-input-number__increase{
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
.content{
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
  width: 30%;
}
.right{
  width: 69%;
}
p{
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
.spantitem{
  font-size: 12px;
}
</style>

