<template>
  <!--- 发起手术 --->
  <div style="margin: 0 10px">
    <div class="header">
      <div class="formBody basicMessage">
        <span class="itemment">客户基本信息</span>
        <el-form size="mini" label-width="80px" :inline="true" :model="form" class="demo-form-inline">
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户">
                <el-input v-model="form.customerName" disabled />
              </el-form-item>
              <el-form-item label="美学顾问">
                <el-select v-model="form.aestheticConsultant" disabled filterable>
                  <el-option v-for="item in UserList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="主诊医师">
                <el-input v-model="form.doctorName" disabled />
              </el-form-item>
              <el-form-item label="治疗状态">
                <el-input v-model="form.status" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户类型">
                <el-input v-model="form.customerStatus" disabled class="inputWidth" />
              </el-form-item>
              <el-form-item label="门诊病历">
                <el-input v-model="form.user" disabled />
              </el-form-item>
              <el-form-item label="手术状态">
                <el-select v-model="form.state" disabled filterable>
                  <el-option
                    v-for="dict in dict.type.caozuo_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="form.card" style="width: 100%" class="inputWidth" />
              </el-form-item>
              <el-button size="mini" @click="saveCard">保存身份证号</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="formBody startOperation" style="margin-left: 12px">
        <span class="itemment">发起手术</span>
        <el-form
          ref="operationForm"
          size="mini"
          :model="form"
          :rules="formRules"
          class="demo-form-inline"
          label-position="right"
          label-width="120px"
          :inline="true"
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="排台类型" prop="terraceType">
                <el-select v-model="form.terraceType" class="inputWidth" clearable filterable>
                  <el-option label="点排" value="0" />
                  <el-option label="修复" value="1" />
                  <el-option label="推荐" value="2" />
                  <el-option label="轮排" value="3" />
                  <el-option label="重排" value="4" />
                  <el-option label="电网推荐" value="5" />
                  <el-option label="付排" value="6" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医助" prop="doctorAssistant">
                <el-select v-model="form.doctorAssistant" clearable placeholder="医助" class="inputWidth" filterable>
                  <el-option v-for="item in yizhuList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生" prop="doctorId">
                <el-select v-model="form.doctorId" clearable placeholder="医生" class="inputWidth" filterable>
                  <el-option v-for="item in doctorlist" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="回访类型" prop="returnTypeId">
                <el-select v-model="form.returnTypeId" class="inputWidth" clearable filterable>
                  <el-option
                    v-for="(item, index) in returnVisitTypeInfolist"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划开始时间" prop="yjStartTime">
                <el-date-picker
                  v-model="form.yjStartTime"
                  clearable
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  class="inputWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划结束时间" prop="yjEndTime">
                <el-date-picker
                  v-model="form.yjEndTime"
                  clearable
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  class="inputWidth"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="是否体验" prop="isExperience">
                <el-select v-model="form.isExperience" class="inputWidth" clearable filterable>
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术类型" prop="operationType">
                <el-select v-model="form.operationType" clearable filterable placeholder="活动区域" class="inputWidth">
                  <el-option
                    v-for="dict in dict.type.type_of_operation"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术名称" prop="operationName">
                <el-input v-model="form.operationName" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="护士" prop="circulatingNurse">
                <el-select v-model="form.circulatingNurse" class="inputWidth" clearable filterable>
                  <el-option v-for="(item, idnex) in nurseList" :key="idnex" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="7">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" clearable type="textarea" style="width: 350%"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item>
                <el-button icon="el-icon-plus" type="primary" plain size="mini" @click="addListItem()">添治疗人员
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22">
              <el-form-item class="form">
                <div v-for="(item, index) in numbr" :key="index">
                  <el-col :span="7">
                    <el-form-item>
                      <el-select filterable v-model="item.name">
                        <el-option label="医生" value="0" />
                        <el-option label="麻醉师" value="1" />
                        <el-option label="整形护士" value="2" />
                        <el-option label="整形医助" value="3" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item>
                      <el-select filterable v-model="item.phone">
                        <el-option v-for="(ite, index) in UserList" :key="index" :label="ite.label" :value="ite.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item>
                      <el-form-item>
                        <el-input v-model="item.add" />
                      </el-form-item>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <el-form-item>
                      <el-button type="danger" plain size="mini" @click="odelete(index)">-
                      </el-button>
                    </el-form-item>
                  </el-col>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="formBody">
      <span class="itemment">治疗项目</span>
      <div class="mony">
        {{ projectName }}
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="addform">保存
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFmt } from '@/utils/time'
import {todayTime} from "../../../utils/time";

export default {
  name: 'InitiateSurgery',
  dicts: ['type_of_operation', 'caozuo_type'],
  data() {
    return {
      projectName: '',
      form: {
        customerName: '',
        acName: '',
        card: '',
        ctime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()),
        endTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()),
        yjStartTime:todayTime()[0],
      },
      formRules: {
        terraceType: [
          { required: true, message: '请选择排台类型', trigger: 'change' }
        ],
        doctorAssistant: [
          { required: true, message: '请选择医助', trigger: 'change' }
        ],
        doctorId: [
          { required: true, message: '请选择医生', trigger: 'change' }
        ],
        returnTypeId: [
          { required: true, message: '请选择回访类型', trigger: 'change' }
        ],
        yjEndTime: [
          { required: true, message: '请选择预计结束时间', trigger: 'change' }
        ],
        yjStartTime: [
          { required: true, message: '请选择预计开始时间', trigger: 'change' }
        ],
        isExperience: [
          { required: true, message: '请选择是否体检', trigger: 'change' },
          { required: true, message: '请选择是否体检', trigger: 'blur' }
        ],
        operationType: [
          { required: true, message: '请选择手术类型', trigger: 'change' }
        ],
        operationName: [
          { required: true, message: '请输入手术名称', trigger: 'change' },
          { required: true, message: '请输入手术名称', trigger: 'blur' }
        ],
        circulatingNurse: [
          { required: true, message: '请选择护士', trigger: 'change' }
        ]
      },
      esthetics: [],
      // 用户列表
      UserList: [],
      // 医生列表
      doctorlist: [],
      // 护士列表
      nurseList: [],
      // 医助列表
      yizhuList: [],
      returnVisitTypeInfolist: [],
      numbr: [],
      name: '',
      phone: '',
      add: '',
      list: []
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
      this.getData()
      this.getUserList(this.deptId)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.form = JSON.parse(this.$route.query.data)
    this.form.customerStatus = this.form.customerStatus == '1' ? '新客户' : '老客户'
    // if (this.form.yjStartTime == undefined) {
    //   this.form.yjStartTime = this.getDate() + ' ' + '00:00:00'
    // }
    // if (this.form.yjEndTime == undefined) {
    //   this.form.yjEndTime = this.getDate() + ' ' + '23:59:59'
    // }
    // this.form.yjStartTime=todayTime()[0]
    // this.form.yjEndTime=todayTime()[1]
    this.form={
      ...this.form,
      yjStartTime:todayTime()[0],
      yjEndTime:todayTime()[1]
    }
    // if (this.form.doctorId == '0') {
    //   this.form.doctorId = '请选择'
    // } else {
    //   this.doctorlist.forEach(value => {
    //     if (value.value == this.form.doctorId);
    //     this.form.doctorId = value.label
    //   })
    // }
    // if (this.form.circulatingNurse == '0') {
    //   this.form.circulatingNurse = '请选择'
    // } else {
    //   this.nurseList.forEach(value => {
    //     if (value.value == this.form.circulatingNurse);
    //     this.form.circulatingNurse = value.label
    //   })
    // }
    // if (this.form.doctorAssistant == '0') {
    //   this.form.doctorAssistant = '请选择'
    // } else {
    //   this.yizhuList.forEach(value => {
    //     if (value.value == this.form.doctorAssistant);
    //     this.form.doctorAssistant = value.label
    //   })
    // }

    // 护士为null，因为传递的护士是0
    this.form.circulatingNurse = null
    if (this.form.doctorId === 0) {
      this.form.doctorId = null
    }
    this.projectName = this.form.projectName
    this.getUserList()
    this.getReturnVisitTypeInfolist()
  },
  methods: {
    getDate() {
      var date = new Date() // 获取时间
      var year = date.getFullYear() // 获取年
      var month = date.getMonth() + 1 // 获取月
      var strDate = date.getDate() // 获取日
      const newmonth = month < 10 ? '0' + month : month
      return year + '-' + newmonth + '-' + strDate
    },
    // 保存身份证号码
    saveCard() {
      if (this.form.card !== undefined || this.form.card !== '') {
        this.$api.user.updateUserInfo({
          id: this.form.id,
          card: this.form.card
        }).then(res => {
          if (res) {
            this.$message.success(res.msg)
          }
        })
      }
    },
    getReturnVisitTypeInfolist() {
      const data = {
        deptId: this.deptId,
        status: 1
      }
      this.$api.medical.returnVisitTypeInfolist(data).then(res => {
        if (res) {
          res.rows.forEach(item => {
            this.returnVisitTypeInfolist.push({ value: item.returnTypeId, label: item.typeName })
          })
        }
      })
    },
    addListItem() {
      var item = {
        name: '',
        phone: '',
        add: ''
      }
      this.numbr.push(item)
    },
    odelete(v) {
      this.numbr.splice(v, 1)
    },
    addform() {
      const treatmentPersonnelList = []
      this.numbr.forEach((item) => {
        treatmentPersonnelList.push({
          remark: item.add,
          deductionId: item.phone,
          positionType: item.name
        })
      })
      var data = {
        deptId: this.form.deptId,
        departmentId: this.form.departmentId,
        id: this.form.id,
        waitId: this.form.waitId,
        customerName: this.form.customerName,
        returnecutorUser: this.form.returnecutorUser,
        customerNameType: this.form.customerNameType,
        // terraceType: this.form.terraceType,
        card: this.form.card,
        terraceType: this.form.terraceType,
        returnTypeId: this.form.returnTypeId,
        isExperience: this.form.isExperience,
        circulatingNurse: this.form.circulatingNurse,
        remark: this.form.remark,
        doctorAssistant: this.form.doctorAssistant,
        yjStartTime: this.form.yjStartTime, // 预计开始时间
        yjEndTime: this.form.yjEndTime,
        operationType: this.form.operationType,
        doctorId: this.form.doctorId,
        operationName: this.form.operationName,
        treatmentPersonnelList: treatmentPersonnelList,
        orderNumber: this.form.orderNumber,
        isOperation: '1'
      }
      // 表单验证
      this.$refs.operationForm.validate((valid) => {
        if (valid) {
          this.$api.medical.addDeductionRecord(data).then((res) => {
            if (res) {
              this.$message.success('发起成功')
              this.$router.go(-1)
            }
          })
        } else {
          return false
        }
      })
    },
    close() {
      this.$router.go(-1)
    },
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/17
       * @Description:  人员添加公司Id  添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then((res) => {
        if (res) {
          res.data.forEach((item) => {
            item.label = item.nickName
            item.value = item.userId
          })
          res.data.forEach((item) => {
            // Aesthetic_Consultant 美学顾问
            // if (item.postCode === 'Aesthetic_Consultant') {
            //   this.esthetics.push(item)
            // }
            // 医生
            if (item.postCode === 'doctor') {
              this.doctorlist.push(item)
            }
            // 医助
            if (item.postCode === 'yizhu') {
              this.yizhuList.push(item)
            }
            // 护士责任护士 与 巡回护士
            if (item.postCode === 'zerennurse' || item.postCode === 'xhhushi') {
              this.nurseList.push(item)
            }
          })
          const arr1 = this.unique(res.data)
          this.UserList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.basicMessage {
  flex: 1;
}

.startOperation {
  flex: 2;
}

.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 20px 20px 20px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;
  height: auto;

  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    font-size: 14px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.inputWidth {
  max-width: 150px;
}

.left {
  width: 50%;
}

.mony {
  height: 30px;
  width: 100%;
  font-size: 13px;
  line-height: 30px;
  padding-left: 5px;
  background-color: #3aa1ff;
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
.form .el-form-item--mini.el-form-item {
  margin-bottom: 7px !important;
}
::v-deep .el-date-editor .el-input__inner {
  padding: 10px !important;
  margin: 0 !important;
}
</style>
