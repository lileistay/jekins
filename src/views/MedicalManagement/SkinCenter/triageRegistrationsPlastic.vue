<template>
  <!--  整形分诊登记-->
  <div>
    <div    class="headers">
      <div class="left">
        <el-card>
          <div slot="header" class="titenaem">
            {{ data.customerName }}
            <span class="spantitem">(新客户)无</span>&nbsp;
            <span class="spantitem">卡号：{{ data.customCardNumber }}</span>
          </div>
          <p>美学顾问：{{ data.acName }}</p>
          <p>治疗状态： 初诊无</p>
          <p>会员等级： 丽人卡无</p>
          <p>欠款总额：</p>
          <el-form :inline="true" size="mini">
            <el-form-item label="身份证号:">
              <el-input v-model="card"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-folder-checked" type="primary" plain size="mini" @click="submitCard">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="right">
        <el-card>
          <div slot="header" class="titenaem">
            {{ data.projectName }}
<!--            <span class="spantitem">套餐啊啊啊啊啊啊啊啊啊 </span>&nbsp;-->
            <span class="spantitem">第{{ numberTime }}次治疗</span>&nbsp;
            <span class="spantitem">总次数：{{ data.quantitySum }}</span>&nbsp;
            <span class="spantitem">剩余次数：{{ data.surplusQuantity }}</span>&nbsp;
            <span class="spantitem">已缴费用：{{ data.discountAmount }}</span>&nbsp;
            <span class="spantitem">欠款金额：0</span>
          </div>
          <el-form ref="treatment" :model="treatment" :rules="rules" label-width="110px" size="mini" class="from">
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="回访类型：" prop="returnTypeId">
                  <el-select v-model="treatment.returnTypeId" filterable clearable>
                    <el-option
                      v-for="item in returnVisitType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="医助：" prop="doctorAssistant">
                  <el-select v-model="treatment.doctorAssistant" filterable clearable>
                    <el-option
                      v-for="item in yizhu"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="排台类型：" prop="terraceType">
                  <el-select v-model="treatment.terraceType" filterable clearable>
                    <el-option
                      v-for="item in dict.type.terrace_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="计划治疗次数：" prop="estimateScribingNum">
                  <el-input-number v-model="treatment.estimateScribingNum" :precision="0" :min="1" style="width: 195px;" @blur="ScribingNum" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :label="data.departmentType == 7?'口腔医生：':(data.departmentType == 3?'产康师：':(data.departmentType == 2?'产康师：':'医生'))" prop="doctorId">
                  <el-select v-model="treatment.doctorId" filterable clearable>
                    <el-option
                      v-for="item in doctor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="巡回护士：" prop="circulatingNurse">
                  <el-select v-model="treatment.circulatingNurse" filterable clearable>
                    <el-option
                      v-for="item in sysUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
              <el-col :span="7">
                <el-form-item label="护理：" prop="nursing">
                  <el-select v-model="treatment.nursing" filterable clearable>
                    <el-option
                      v-for="item in huli"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="仪器：" prop="deviceId">
                  <el-select v-model="treatment.deviceId" filterable clearable>
                    <el-option
                      v-for="item in deviceList"
                      :key="item.deviceId"
                      :label="item.equipmentName"
                      :value="item.deviceId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否体验：" prop="isExperience">
                  <el-select v-model="treatment.isExperience" filterable clearable>
                    <el-option
                      v-for="item in dict.type.whether"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="21">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="treatment.remark" :maxlength="50" type="textarea" />
                  <p style="font-size: 12px;color: red">最多只能收入50个字符</p>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button :loading="showSubmit" type="primary" plain icon="el-icon-folder-checked" size="mini" @click="submitTriage">保存</el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'
import {math} from "@/utils/math";

export default {
  dicts: ['project_type', 'whether', 'terrace_type'],
  data() {
    return {
      numberTime: 0,
      loadingData: false,
      showSubmit: false,
      sysUserList: [],
      doctor: [],
      huli: [],
      yizhu: [],
      deviceList: [],
      returnVisitType: [],
      data: {},
      card: '', // 身份证号
      num: 0,
      // 选则添加
      treatment: {
        returnTypeId: undefined,
        doctorAssistant: undefined,
        terraceType: undefined,
        estimateScribingNum: 1,
        doctorId: undefined,
        circulatingNurse: undefined,
        projectType: undefined,
        nursing: undefined,
        deviceId: undefined,
        isExperience: undefined,
        remark: undefined
      },
      rules: {
        returnTypeId: [{ required: true, message: '请选择回访类型', trigger: 'blur' }],
        doctorId: [{ required: true, message: '请选择回访类型', trigger: 'blur' }]
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
      this.getReturnVisitType()
      this.getUserList(val)
    }
  },
  created() {
    this.data = JSON.parse(this.$route.query.data)

    console.log(this.data)
    this.treatment.doctorId = this.data.doctorId
    // this.treatment.nursing = this.data.dtrnursing
    this.treatment.circulatingNurse = this.data.circulatingNurse
    this.numberTime = math.add(this.data.treatmentNum, 1)
    this.deptId = this.$store.getters.departmentId
    console.log('data', this.data)
    this.getUserList(this.deptId)
    this.getDevice()
    this.getReturnVisitType()
  },
  methods: {
    ScribingNum() {
      // 计划治疗次数
      if (this.data.surplusQuantity < this.treatment.estimateScribingNum) {
        this.treatment.estimateScribingNum = ''
        this.$message.error('计划治疗次数不能大于剩余次数！')
      }
    },
    // 保存
    submitTriage() {
      this.$refs.treatment.validate((valid) => {

        if (valid) {
          // this.showSubmit = true
          var data = {
            deptId: this.data.deptId, // 公司
            waitId: this.data.waitId,
            id: this.data.id, // 顾客编号
            departmentId: this.data.departmentId, // 科室id
            deductionDepartment: this.data.departmentId, //划扣科室
            state: '1',
            totalPayment: this.data.totalPayment,
            quantitySum: this.data.quantitySum,
            orderNumber: this.data.orderNumber,
            customCardNumber: this.data.customCardNumber,
            projectName: this.data.projectName, // 项目名称
            returnTypeId: this.treatment.returnTypeId, // 回访类型
            doctorAssistant: this.treatment.doctorAssistant, // 医助
            terraceType: this.treatment.terraceType, // 排台类型
            estimateScribingNum: this.treatment.estimateScribingNum, // 计划治疗次数
            doctorId: this.treatment.doctorId, // 医生
            circulatingNurse: this.treatment.circulatingNurse, // 巡回护士
            projectType: this.treatment.projectType, // 项目类型
            nursing: this.treatment.nursing, // 护理
            deviceId: this.treatment.deviceId, // 仪器
            isExperience: this.treatment.isExperience, // 是否体验
            remark: this.treatment.remark
          }
          this.$api.medical.addDeductionRecord(data).then(res => {
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
     * @date 2022/6/5
     * @Description: 保存顾客身份证号
    */
    submitCard() {
      if (this.card !== '' || this.card !== undefined) {
        this.$api.user.updateUserInfo({
          id: this.data.id,
          card: this.card
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
     * @date 2022/6/5
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
          // this.doctor.forEach(res => {
          //   // if (res.doctorId !== this.data.doctorId) {
          //   //   this.treatment.doctorId = ''
          //   // }
          // })
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
.from{
  margin-left: 40px;
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

