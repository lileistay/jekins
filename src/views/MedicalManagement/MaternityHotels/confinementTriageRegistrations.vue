<template>
  <!--  月子分诊登记-->
  <div>
    <div    class="headers">
      <div class="left">
        <el-card>
          <div slot="header" class="titenaem">
            {{ data.customerName }}
            <span class="spantitem">(新客户)无</span>&nbsp;
            <span class="spantitem">卡号：{{ data.customCardNumber }}</span>
          </div>
          <p>现场咨询：{{ data.acName }}</p>
          <p>责任护士：{{ data.circulatingName }}</p>
          <p>责任月嫂：{{ data.dtrnursingName }}</p>
          <p v-if="data.departmentId === 2">产康师：{{ data.dtrdoctorName }}</p>
          <p v-if="data.departmentId === 1">洗浴师：{{ data.dtrdoctorName }}</p>
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
            <span class="spantitem">套餐 </span>&nbsp;
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
                <el-form-item v-if="data.departmentId === 2" label="产康师：" prop="doctorId">
                  <el-select v-model="treatment.doctorId" filterable clearable>
                    <el-option
                      v-for="(item, index) in therapeutist"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="data.departmentId === 1" label="洗浴师：" prop="doctorId">
                  <el-select v-model="treatment.doctorId" filterable clearable>
                    <el-option
                      v-for="(item, index) in therapeutist"
                      :key="index"
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
              </el-col>
              <el-col :span="7">
                <el-form-item label="责任护士：" prop="circulatingNurse">
                  <el-select v-model="treatment.circulatingNurse" filterable clearable>
                    <el-option
                      v-for="(item, index) in zerennurseList"
                      :key="index"
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
                <el-form-item label="责任月嫂：" prop="dtrnursing">
                  <el-select v-model="treatment.dtrnursing" filterable clearable>
                    <el-option
                      v-for="(item, index) in yuesao"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
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
                <el-form-item label="计划治疗次数：" prop="estimateScribingNum">
                  <el-input-number
                    v-model="treatment.estimateScribingNum"
                    :precision="0"
                    :min="1"
                    style="width: 195px;"
                    @blur="estimateScribingNumChange"
                  />
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
import { math } from "@/utils/math";

export default {
  dicts: ['project_type', 'whether', 'terrace_type'],
  data() {
    return {
      numberTime: 0,
      loadingData: false,
      showSubmit: false,
      therapeutist: [],
      yuesao: [],
      zerennurseList: [], // 责任月嫂
      deviceList: [],
      returnVisitType: [],
      data: {
        surplusQuantity: 0
      },
      card: '', // 身份证号
      num: 0,
      // 选则添加
      treatment: {
        returnTypeId: undefined,
        terraceType: undefined,
        estimateScribingNum: 1,
        doctorId: undefined, // 洗浴师
        circulatingNurse: undefined,
        projectType: undefined,
        dtrnursing: undefined, // 责任月嫂
        deviceId: undefined,
        isExperience: undefined,
        remark: undefined
      },
      rules: {
        returnTypeId: [{ required: true, message: '请选择回访类型', trigger: 'blur' }],
        doctorId: [{ required: true, message: '请选择产康师/洗浴师', trigger: 'blur' }],
        circulatingNurse: [{ required: true, message: '请选择责任护士', trigger: 'blur' }],
        dtrnursing: [{ required: true, message: '请选择责任月嫂', trigger: 'blur' }]
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
    this.data = JSON.parse(this.$route.params.data)
    // console.log('数据',this.data)
    this.treatment = this.data
    this.treatment.estimateScribingNum = 1
    this.card = this.data.card
    this.numberTime = math.add(this.data.treatmentNum, 1)
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getDevice()
    this.getReturnVisitType()
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/7/4
     * @Description: 计划治疗次数改变
    */
    // 计划治疗次数
    estimateScribingNumChange() {
      if (this.treatment.estimateScribingNum > this.data.surplusQuantity) {
        this.treatment.estimateScribingNum = ''
        this.$message.error('计划治疗次数不能大于剩余次数！')
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/14
     * @Description: 保存
    */
    submitTriage() {
      this.$refs.treatment.validate((valid) => {
        if (valid) {
          this.showSubmit = true
          this.$set(this.treatment, 'waitId', this.data.waitId)
          this.$set(this.treatment, 'id', this.data.id)
          this.$set(this.treatment, 'departmentId', this.data.departmentId)
          this.$set(this.treatment, 'deptId', this.data.deptId)
          this.$set(this.treatment, 'state', '1')
          this.$set(this.treatment, 'orderNumber', this.data.orderNumber)
          this.$set(this.treatment, 'deductionDepartment', this.data.departmentId)
          this.$api.medical.addDeductionRecord(this.treatment).then(res => {
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
            this.returnVisitType.push({value: item.returnTypeId, label: item.typeName})
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
      // 添加状态
      this.loadingData = true
      this.$api.medical.deviceManagementlist({
        deptId: this.deptId,
        departmentId: this.data.departmentId,
        status: '0'
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
      let data = {
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
            if (item.postCode === 'zerennurse') {
              this.zerennurseList.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'yuesao') {
              this.yuesao.push(item)
            }
          })
          res.data.forEach(item => {
            if (item.postCode === 'therapeutist') {
              this.therapeutist.push(item)
            }
          })
          // this.therapeutist.forEach(res => {
          //   if (res.doctorId !== this.data.doctorId) {
          //     this.treatment.doctorId = ''
          //   }
          // })
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

