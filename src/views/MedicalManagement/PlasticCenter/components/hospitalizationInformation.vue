<template>
  <!--住院信息-->
  <div class="box">
    <div class="box-top">
      <div class="title">住院信息</div>
      <el-form size="mini" :model="form" label-width="100px">
        <el-row>
          <el-col :span="6">
            <!-- <el-form-item label="病案号：">
              <el-input v-model="form.medicalRecordId" disabled />
            </el-form-item> -->
            <el-form-item label="出院时间：">
              <el-input v-model="form.leaveTime" disabled />
            </el-form-item>
            <el-form-item label="护理人员">
              <el-select v-model="form.nursingPersonnel" filterable disabled class="fullInput" placeholder="请选择"
                style="width: 100%;" :filter-method="actualFilter">
                <el-option v-for="(userItem, index) in sysUserList" :key="index" :label="userItem.nickName"
                  :value="userItem.userId + ''" />
              </el-select>
            </el-form-item>
            <el-form-item label="病床号：">
              <el-input disabled v-model="form.bedNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- <el-form-item label="住院病历号">
              <el-input v-model="form.inpatientRecordNum" disabled style="width: 60%;" />
              <el-button
                size="mini"
                type="primary"
                plain
                @click="edRecor"
              >修改</el-button>
            </el-form-item> -->
            <el-form-item label="状态：">
              <!-- <el-select v-model="inStatus" disabled>
                <el-option
                  v-for="dict in dict.type.inpatient_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select> -->
              <el-input size="mini" disabled :placeholder="abc(form.inpatientStatus)" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="病房号：">
              <el-select v-model="form.wardNo" filterable class="fullInput" disabled placeholder="请选择" style="width: 100%;">
                <el-option v-for="(item, index) in illnessRoom" :key="index" :label="item.roomName"
                  :value="item.roomId + ''" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第几次住院:">
              <el-input v-model="form.inpatientFrequency" disabled />
            </el-form-item>
            <el-form-item label="费用总额：">
              <el-input v-model="form.deposit" disabled />
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="住院时间">
              <el-input v-model="form.hospitalTime" disabled />
            </el-form-item>
            <el-form-item label="住院医生：">
              <el-select v-model="form.hospitalDoctor" filterable class="fullInput" placeholder="请选择" style="width: 100%;"
                :filter-method="doctorFilter" disabled>
                <el-option v-for="(userItem, index) in doctor" :key="index" :label="userItem.nickName"
                  :value="userItem.userId + ''" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-form-item label="手术名称：">
            <el-input v-model="form.operationName" disabled />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注：" >
            <el-input v-model="form.remark" disabled />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="box-footer">
      <div class="title">客户信息</div>
      <el-form size="mini" :model="form" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="客户姓名:">
              <el-input v-model="form.customerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话:">
              <el-input v-model="form.customPhone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户卡号:">
              <el-input v-model="form.customCardNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="美学顾问:">
              <el-select filterable v-model="form.aestheticConsultant" disabled :filter-method="aestheFilter" style="width: 100%"
                filterable>
                <el-option v-for="item in esthetics" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别:" >
              <el-select  filterable v-model="form.customSex" class="full-width" @change="changeSex" placeholder="请选择性别" disabled>
                <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄:">
              <el-input v-model="form.customAge" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生日:">
              <el-select filterable v-model="yearsModel" placeholder="请选择" style="width:100px; display: none"
                @change="dateChange(1)" >
                <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-select filterable v-model="monthsModel" placeholder="请选择" style="width:50%;" @change="dateChange(2)">
                <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value + ''" />
              </el-select>
              <el-select filterable v-model="daysModel" placeholder="请选择" style="width:50%;" @change="dateChange(3)">
                <el-option v-for="item in days" :key="item.value" :label="item.label" :value="item.value + ''" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="国家/地区:">
              <el-select filterable v-model="form.country" class="fullInput" style="width: 100%;" @change="changeCountry"
                placeholder="请选择国家/地区">
                <el-option label="中国大陆" value="0" />
                <el-option label="中国香港" value="1" />
                <el-option label="中国澳门" value="2" />
                <el-option label="中国台湾" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="省份">
              <el-select filterable v-model="Province" class="full-width">
                <el-option v-for="(option, optionIndex) in areaArr" :key="optionIndex" :value="option.name"
                  :label="option.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="市/县">
              <el-select filterable v-model="City" class="full-width">
                <el-option v-for="(option, optionIndex) in cityArr" :key="optionIndex" :value="option.name"
                  :label="option.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区">
              <el-select filterable v-model="Area" class="full-width">
                <el-option v-for="(item, itemIndex) in districtArr" :key="itemIndex" :value="item.name"
                  :label="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- <el-form-item label="邮编:">
              <el-input v-model="form.postalCode" />
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <!-- <el-form-item label="体重（kg）:">
              <el-input v-model="form.inDocumentNo" />
            </el-form-item> -->
          </el-col>
          <el-col :span="6">
            <el-form-item label="职业:">
              <el-select filterable v-model="form.occupation" clearable class="fullInput" placeholder="请选择职业" @change="pickChange">
                <el-option v-for="dict in dict.type.occupation" :key="dict.value" :value="dict.value + ''"
                  :label="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="婚姻状况:">
              <el-select filterable v-model="form.marriageType" clearable class="fullInput" placeholder="请选择婚姻状况"
                @change="marriageChange">
                <el-option v-for="dict in dict.type.marital_status" :key="dict.value" :value="dict.value"
                  :label="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!-- <el-form-item label="身份证号:">
              <el-input v-model="form.card" />
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址:">
              <el-input v-model="Addrsl" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="footer">
          <div class="content">
            <!-- <span>欠款：0.00</span> -->
            <span style="margin-right: 5px">住院押金：{{ form.deposit }}</span>
            <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="editForm">保存</el-button>
            <el-button size="mini" type="danger" icon="el-icon-close" @click="deleteForm">取消住院</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <sg-dialog title="修改" size="450px" :dialog="dialogtion" out-top="250px" @handleClose="hospitali">
      <div slot="out">
        <el-form ref="hospi" :model="hospi" size="mini" label-width="120px">
          <el-form-item label="住院病历号" :rules="[
            { required: true, message: '请输入住院病历号', trigger: 'blur' }
          ]">
            <el-input v-model="hospi.inpatientRecordNum" style="width: 70%;" />
            <el-button type="primary" plain size="mini">生成</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button @click="submitForm">提交</el-button>
            <el-button type="danger" plain @click="hospitali">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import PinyinMatch from 'pinyin-match'
import area from '@/utils/area'
import SgDialog from '@/components/Dialog'

export default {
  dicts: ['occupation', 'marital_status', 'sys_user_sex', 'inpatient_status'],
  name: 'Hospitalization',
  components: { SgDialog },
  props: ['hospitalization'],
  data() {
    return {
      City: "",
      Addrsl:"",
      Area: "",
      sysUserList: [], // 护理人员
      sysUser: [],
      // 弹框
      dialogtion: false,
      doctor: [],
      doctorList: [],
      esthetics: [],
      estheticsList: [],
      areaArr: area.arrAll,
      cityArr: [],
      districtArr: [],
      Inpatient_status: [
        {
          value: "0",
          label: '待住院'
        },
        {
          value: "1",
          label: '住院中'
        },
        {
          value: "2",
          label: '待出院'
        },
        {
          value: "3",
          label: '已出院'
        },
        {
          value: "4",
          label: '取消住院'
        }
      ],
      yearsModel: '',
      years: [],
      monthsModel: '',
      months: [],
      daysModel: null,
      days: [],
      illnessRoom: [],
      hospi: {
        inpatientRecordNum: ''
      },
      Province: "",
      form: {
        customerName: '',
        customSex: '',
        customAge: '',
        country: '',
        province: '',
        city: '',
        area: '',
        occupation: '',
        marriageType: '',
        addr: '',
        beautylist:[]

      },

    }
  },
  watch: {
    Province() {
      this.updateCity()
      // this.updateDistrict()
    },
    'City'() {
      this.updateDistrict()
    },
    'form.occupation'(value){
       
   if (value == '1') {
     this.form.occupation = '学生'
   }
   else if (value == '2') {
     this.form.occupation= '老师'
   }
   else if (value == '3') {
     this.form.occupation = '退休'
   }
   else if (value == '5') {
     this.form.occupation = '其他'
   }
   else if (value == '4') {
     this.form.occupation = '上班族'
   }
   else if (value == '0') {
     this.form.occupation = '请选择'
   }
 },
    'hospitalization': {
      deep: true,
      handler: function (newV) {
        this.Province = newV.province
        this.form = newV;
        this.monthsModel = newV.monthsModel
        this.daysModel = newV.daysModel;
        this.monthsModel =newV.birthday==undefined?'':newV.birthday.split('-')[1];
        this.daysModel = newV.birthday==undefined?'':newV.birthday.split('-')[2];
        let beauty = this.form.receptionId;
        this.Addrsl=newV.addr;
        if(this.form.occupation==0){
          this.form.occupation='请选择职业'
        }
        this.estheticsList.forEach(value=>{
          if(value.value==beauty){
            this.form.aestheticConsultant=value.label
          }
        })
        // this.$api.user.getUserList(newdata).then(res => {
        //   if (res) {
        //        res.data.forEach(item => {
        //     item.label = item.nickName
        //     item.value = item.userId
        //   })
        //        res.data.forEach(item => {
        //     if (item.postCode === 'xczxs') {
        //       this.beautylist.push(item)
        //     }
        //   })
        //   }
        //   alert('123')
        //   console.log(this.beautylist,'黑河')
        //   this.beautylist.forEach(value=>{
        //       if(value.value==beauty){
        //          this.form.aestheticConsultant=value.label
        //       }
        //   })

        // })
        let data = {
          hospitalDoctor: this.form.hospitalDoctor,
          nursingPersonnel: this.form.nursingPersonnel
        }
        localStorage.setItem('his', JSON.stringify(data))

        // this.$forceUpdate()
        // // this.form.monthsModel = newV.monthsModel
        // console.log('this.form', this.form)
      }
    }
  },
  created() {
    // this.form = this.hosption

    this.getUserList();
    this.init()
  },
  mounted() {
    // console.log(this.form, '撒大大撒哥')
  },
  methods: {
    abc(val){
      if(val==0){
        return '待住院'
      }
      if(val==1){
        return '住院中'
      }
      if(val==2){
        return '待出院'
      }
      if(val==3){
        return '已出院'
      }
      if(val==4){
        return '取消住院'
      }
    
    },
    /**
     * @author lishang
     * @date 2022/11/1
     * @Description:  拼音搜索
    */
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
    // 保存
    editForm() {
      // 住院信息
      const hosform = {
        deptId: this.form.deptId,
        medicalRecordId: this.form.medicalRecordId, //   病案号
        inpatientRecordNum: this.form.inpatientRecordNum, // 住院病历号
        // 第几次住院
        // hospitalTime: this.form.hospitalTime, // 住院时间
        region: this.form.region, // 出院时间
        inpatientStatus: this.form.inpatientStatus, // 状态
        totalCost: this.form.totalCost, // 费用总额
        hospitalDoctor: this.form.hospitalDoctor, // 住院医生
        nursingPersonnel: this.form.nursingPersonnel, // 护理人员
        // medicalRecordId: // 病房号
        bedNumber: this.form.bedNumber, // 病床号
        operationName: this.form.operationName, // 手术名称
        remark: this.form.remark, // 备注
        departmentId: this.form.departmentId,
        id: this.form.id,
        inHospitalId: this.form.inHospitalId,
        inpatientFrequency: this.form.inpatientFrequency,
        operationSerialNumber: this.form.operationSerialNumber,
        waitId: this.form.waitId,
        province: this.Province,
        city: this.City,
        area: this.Area,
        birthday: this.form.birthday,
      }
      this.$emit('change','1')
      this.$api.medical.hospitalInfoEdit(hosform).then(res => {
        if (res) {
          // 客户资料修改
         
          if(this.form.occupation=='请选择职业'){
            this.form.occupation=''
          }
          const data = {
            id: this.form.id,
            customerName: this.form.customerName, // 姓名
            customSex: this.form.customSex, // 性别
            customAge: this.form.customAge, // 年龄
            monthsModel: this.monthsModel, // 生日
            daysModel: this.daysModel,
            country: this.form.country, // 国家/地区
            province: this.Province,
            city: this.City,
            area: this.Area,
            birthday: this.form.birthday,// 区
            occupation: this.form.occupation, // 职业
            marriageType: this.form.marriageType, // 婚姻状况
            addr: this.Addrsl// 地址
          }
          this.$api.user.updateUserInfo(data).then(res => {
            if (res) {
              this.$message.success('保存成功')
              this.$emit('deleteget')
              // this.$router.back()
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    // 取消住院
    deleteForm() {
      if(this.form.deposit!==0){
         this.$message.warning('该顾客不能直接取消出院');
         return
      }
      const deleteform = {
        deptId: this.form.deptId,
        medicalRecordId: this.form.medicalRecordId, //   病案号
        inpatientRecordNum: this.form.inpatientRecordNum, // 住院病历号
        // 第几次住院
        // hospitalTime: this.form.hospitalTime, // 住院时间
        region: this.form.region, // 出院时间
        inpatientStatus: '4', // 状态
        totalCost: this.form.totalCost, // 费用总额
        hospitalDoctor: this.form.hospitalDoctor, // 住院医生
        nursingPersonnel: this.form.nursingPersonnel, // 护理人员
        // medicalRecordId: // 病房号
        bedNumber: this.form.bedNumber, // 病床号
        operationName: this.form.operationName, // 手术名称
        remark: this.form.remark, // 备注
        departmentId: this.form.departmentId,
        id: this.form.id,
        inHospitalId: this.form.inHospitalId,
        inpatientFrequency: this.form.inpatientFrequency,
        operationSerialNumber: this.form.operationSerialNumber,
        waitId: this.form.waitId
      }
      this.$api.medical.hospitalInfoEdit(deleteform).then(res => {
        if (res) {
          this.form.inpatientStatus = '0'
          this.$message.success('取消住院成功')
          this.$emit('deleteget')
        }
      })
    },
    // 住院病历号 修改
    edRecor() {
      this.hospi.inpatientRecordNum = this.form.inpatientRecordNum
      this.dialogtion = true
    },
    // 弹框-确定
    submitForm() {
      this.form.inpatientRecordNum = this.hospi.inpatientRecordNum
      this.dialogtion = false
    },
    // 弹框-关闭
    hospitali() {
      this.hospi.inpatientRecordNum = ''
      this.dialogtion = false
    },
    // 省市区
    updateCity() {
     if(this.Province==undefined){
      this.City="";
      this.Area="";
            return
     }
      for (const i in this.areaArr) {
        const obj = this.areaArr[i]
        if(obj.name==''){
          alert('1')
        }
        if (obj.name) {
          if (obj.name === this.Province) {
            this.cityArr = obj.sub
            break
          }
        }
      }
      this.City = this.cityArr[0].name
    },
    updateDistrict() {
      if(this.Province==undefined){
      this.City="";
      this.Area="";
            return
     }
    
      for (var i in this.cityArr) {
        var obj = this.cityArr[i]
        if (obj.name === this.City) {
          this.districtArr = obj.sub
          break
        }
      }
      if (
        this.districtArr &&
        this.districtArr.length > 0 &&
        this.districtArr[0].name
      ) {
        this.Area = this.districtArr[0].name
      } else {
        this.Area = ''
      }
    },
    //  下拉不选择
    handlecity(val) {
      // val 代表 value 值
      if (val) { // 操作选中角色发生变化
        this.$set(this.form, this.form.city, val)
      } else {
        this.$set(this.form, this.form.city, '')
      }
    },
    handlearea(val) {
      if (val) { // 操作选中角色发生变化
        this.$set(this.form, this.form.area, val)
      } else {
        this.$set(this.form, this.form.area, '')
      }
    },
    pickChange(val) {
      // this.form.occupation=val;
      this.$forceUpdate()
    },
    marriageChange(val) {
      // this.$set(this.form, this.form.marriageType, val)
      this.$forceUpdate()
    },
    changeSex(val) {
      this.$forceUpdate()
    },
    changeCountry() {
      this.$forceUpdate()
    },
    // 生日
    init() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日
      this.initSelectYear(year)
      this.initSelectMonth()
      this.initSelectDay(year, month)
      this.yearsModel = year
      this.monthsModel = month
      this.daysModel = day
      const obj = { year: this.yearsModel, month: this.monthsModel, day: this.daysModel }
    },
    initSelectYear(year) {
      this.years = []
      for (let i = 0; i < 30; i++) {
        this.years.push({ value: (year - i), label: (year - i) + '年' })
      }
    },
    initSelectMonth() {
      this.months = []
      // this.months.push({ value: 0, label: '全部' })
      for (let i = 1; i <= 12; i++) {
        this.months.push({ value: i, label: i })
      }
    },
    initSelectDay(year, month) {
      var maxDay = this.getMaxDay(year, month)
      this.days = []
      // this.days.push({ value: 0, label: '全部' })
      for (var i = 1; i <= maxDay; i++) {
        this.days.push({ value: i, label: i })
      }
    },
    dateChange(type) {
      // 1年 2月 3日 4 左 5右
      if (type === 1 || type === 2) {
        if (this.monthsModel === 0) {
          this.daysModel = 0
          this.initSelectDay(this.yearsModel, 1)
        } else {
          this.initSelectDay(this.yearsModel, this.monthsModel)
        }
      }
      if (type === 4) {
        this.dayleft()
      }
      if (type === 5) {
        this.dayright()
      }
      this.form.birthday =this.yearsModel+'-' +this.monthsModel + '-' + this.daysModel
    },
    dayleft() {
      var tmpYear = this.yearsModel
      var tmpMonth = this.monthsModel
      var tmpDay = this.daysModel
      if (tmpYear == null) {
        var myDate = new Date()
        var year = myDate.getFullYear()// 获取当前年
        var month = myDate.getMonth() + 1// 获取当前月
        var day = myDate.getDate()// 获取当前日
        this.yearsModel = year
        this.monthsModel = month
        this.daysModel = day
        return
      }
      if (tmpMonth == null) { tmpMonth = 0 }
      if (tmpDay == null) { tmpDay = 0 }

      var yearV = tmpYear
      var monthV = tmpMonth
      var dayV = tmpDay

      if ((tmpMonth == 0 || tmpMonth == 1) && (tmpDay == 0 || tmpDay == 1)) {
        yearV = tmpYear - 1; monthV = 12
        dayV = this.getMaxDay(tmpYear, tmpMonth)
      }
      if (!(tmpMonth == 0 || tmpMonth == 1) && (tmpDay == 0 || tmpDay == 1)) {
        monthV = tmpMonth - 1
        dayV = this.getMaxDay(tmpYear, tmpMonth)
      }
      if ((tmpMonth == 0 || tmpMonth == 1) && !(tmpDay == 0 || tmpDay == 1)) {
        dayV = tmpDay - 1
      }
      if (!(tmpMonth == 0 || tmpMonth == 1) && !(tmpDay == 0 || tmpDay == 1)) {
        dayV = tmpDay - 1
      }
      this.yearsModel = yearV
      this.monthsModel = monthV
      this.daysModel = dayV
    },
    dayright() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日

      var tmpYear = this.yearsModel
      var tmpMonth = this.monthsModel
      var tmpDay = this.daysModel

      if (tmpYear == null) {
        var myDate = new Date()
        var year = myDate.getFullYear()// 获取当前年
        var month = myDate.getMonth() + 1// 获取当前月
        var day = myDate.getDate()// 获取当前日
        this.yearsModel = year
        this.monthsModel = month
        this.daysModel = day
        return
      }

      if (tmpMonth == null) { tmpMonth = 0 }
      if (tmpDay == null) { tmpDay = 0 }
      if (tmpYear > year) {
        this.yearsModel = year
        this.monthsModel = month
        this.daysModel = day
        return
      }
      if (tmpYear == year) {
        if ((tmpMonth > month || tmpMonth == 0) || (tmpMonth == month) && (tmpDay >= day || tmpDay == 0)) {
          this.yearsModel = year
          this.monthsModel = month
          this.daysModel = day
          return
        }
      }

      var maxDay = this.getMaxDay(tmpYear, tmpMonth)
      var yearV = tmpYear
      var monthV = tmpMonth
      var dayV = tmpDay

      if ((tmpMonth == 0 || tmpMonth == 12) && (tmpDay == 0 || tmpDay == maxDay)) {
        yearV = tmpYear + 1; monthV = 1
        dayV = 1
      }
      if (!(tmpMonth == 0 || tmpMonth == 12) && (tmpDay == 0 || tmpDay == maxDay)) {
        monthV = tmpMonth + 1
        dayV = 1
      }
      if (!(tmpMonth == 0 || tmpMonth == 12) && !(tmpDay == 0 || tmpDay == maxDay)) {
        dayV = tmpDay + 1
      }

      this.yearsModel = yearV
      this.monthsModel = monthV
      this.daysModel = dayV
    },
    getMaxDay(year, month) {
      var new_year = year // 取当前的年份
      var new_month = month++// 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) // 如果当前大于12月，则年份转到下一年
      {
        new_month -= 12 // 月份减
        new_year++ // 年份增
      }
      var new_date = new Date(new_year, new_month, 1)// 取当年当月中的第一天
      return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getUserList() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      // 病房好
      this.$api.confinementRoom.roomInfoList(data).then(res => {
        if (res) {
          this.illnessRoom = res.rows
        }
      })
      // 人员添加公司Id 添加状态
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.doctorList = this.doctor
            }
          })
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.estheticsList = this.esthetics
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  background-color: #e0f0fb;

  .box-top {
    position: relative;
    padding: 10px 10px;
    margin-top: 10px;
    border: 1px solid #c3ced5;
    border-radius: 5px;
    //overflow: hidden;
    margin-bottom: 10px;
  }

  .title {
    position: absolute;
    display: inline-block;
    margin-top: -20px;
    background-color: #e0f0fb;
    z-index: 9999 !important;
  }

  .box-footer {
    padding: 10px 10px;
    border-radius: 5px;
    border: 1px solid #c3ced5;
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
