<template>
  <!--发起治疗 &ndash;&gt;-->
  <div>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">住院信息
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" label-width="100px" style="margin-top:10px ">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="第几次住院:">
                <el-input v-model="form.inpatientFrequency" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color:red;position:absolute;margin-left: 20px">*</span>
              <el-form-item label="住院时间:">
                <el-date-picker v-model="valuehospital" type="date" placeholder="请选择住院日期" size="mini" style="margin-top: -10px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="margin-left: 10px;">
              <span style="color:red;position:absolute;margin-left: 25px">*</span>
              <el-form-item label="住院时间点:" style="margin-left: 20px">
                <el-time-picker v-model="valuehour" :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59'
                }" placeholder="请选择住院时间点" size="mini" style="margin-top: -10px;">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="住院医生:" style="margin-left: 40px">
                <el-select v-model="form.abl" filterable class="fullInput" placeholder="请选择" style="width: 100%;"
                  :filter-method="doctorFilter">
                  <el-option v-for="(userItem, index) in doctor" :key="index" :label="userItem.nickName"
                    :value="userItem.userId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="护理人员:">
                <el-select v-model="form.nursingPersonnel" filterable class="fullInput" placeholder="请选择"
                  style="width: 100%;" :filter-method="actualFilter">
                  <el-option v-for="(userItem, index) in sysUserList" :key="index" :label="userItem.nickName"
                    :value="userItem.userId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <!-- <el-form-item label="病房号:">
                <el-select v-model="form.medicalRecordId" filterable class="fullInput" placeholder="请选择"
                  style="width: 100%;">
                  <el-option v-for="(item, index) in illnessRoom" :key="index" :label="item.roomName"
                    :value="item.roomId" />
                </el-select>
              </el-form-item> -->
            </el-col>
            <el-col :span="4">
              <!-- <el-form-item label="病床号:">
                <el-input v-model="form.bedNumber" />
              </el-form-item> -->
            </el-col>
            <!-- <span style="font-size: 14px;margin-left: 40px;">住院时间：</span> <el-date-picker v-model="valuehospital"
              type="date" placeholder="住院日期" size="mini">
            </el-date-picker>
            &emsp;
            <el-time-picker v-model="valuehour" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="住院时间点" size="mini">
            </el-time-picker> -->
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="手术名称:">
                <el-input v-model="form.operationName" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input v-model="form.remark" :max="50" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="formBody">
        <div class="itemment">客户信息
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" label-width="100px" style="margin-top:10px ">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="客户姓名:">
                <el-input v-model="form.customerName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="电话:">
                <el-input v-model="form.customPhone" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="客户卡号:">
                <el-input v-model="form.customCardNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="美学顾问:">
                <el-select v-model="form.aestheticConsultant" filterable disabled :filter-method="aestheFilter" style="width: 100%"
                  >
                  <el-option v-for="item in esthetics" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="性别:">
                <el-select filterable v-model="form.customSex" class="full-width" placeholder="请选择性别">
                  <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="年龄:">
                <el-input v-model="form.customAge" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="生日:">
                <el-select filterable v-model="form.yearsModel" placeholder="请选择" style="width:100px; display: none"
                  @change="dateChange(1)">
                  <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select filterable v-model="form.monthsModel" placeholder="请选择" style="width:50%;" @change="dateChange(2)">
                  <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select filterable v-model="DaysModel" placeholder="请选择" style="width:50%;" @change="dateChange(3)">
                  <el-option v-for="item in days" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="国家/地区:">
                <el-select filterable v-model="form.country" class="fullInput" style="width: 100%;" placeholder="请选择国家/地区">
                  <el-option label="中国大陆" value="0" />
                  <el-option label="中国香港" value="1" />
                  <el-option label="中国澳门" value="2" />
                  <el-option label="中国台湾" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="省份:">
                <el-select  filterable v-model="form.province">
                  <el-option v-for="(option, optionIndex) in areaArr" :key="optionIndex" :value="option.name"
                    :label="option.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="市县:">
                <el-select filterable v-model="City">
                  <el-option v-for="(option, optionIndex) in cityArr" :key="optionIndex" :value="option.name"
                    :label="option.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="区:">
                <el-select filterable v-model="Areastatus">
                  <el-option v-for="(item, itemIndex) in districtArr" :key="itemIndex" :value="item.name"
                    :label="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <!-- <el-form-item label="邮编:">
                <el-input v-model="form.inDocumentNoyb" />
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <!-- <el-form-item label="体重（kg）:">
                <el-input v-model="form.inDocumentNo" />
              </el-form-item> -->
            </el-col>
            <el-col :span="4">
              <el-form-item label="职业:">
                <el-select filterable v-model="form.occupation" style="width: 70%;" clearable class="fullInput" placeholder="请选择职业">
                  <el-option v-for="dict in dict.type.occupation" :key="dict.value" :value="dict.value"
                    :label="dict.label" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="婚姻状况:">
                <el-select filterable v-model="form.marriageType" style="width: 70%;" clearable class="fullInput"
                  placeholder="请选择婚姻状况">
                  <el-option v-for="dict in dict.type.marital_status" :key="dict.value" :value="dict.value"
                    :label="dict.label" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- <el-form-item label="身份证号:">
                <el-input v-model="form.card" style="width: 70%;" />
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="地址:">
                <el-input v-model="form.addr" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <span>欠款：0.00</span>
        <span style="margin-left: 20px;margin-right: 20px">住院押金：{{ form.deposit }}</span>
        <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="addOrEdit">保存</el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'
import area from '@/utils/area'
import PinyinMatch from 'pinyin-match'
import { timeFmt } from '@/utils/time'

export default {
  dicts: ['occupation', 'marital_status', 'sys_user_sex'],
  name: 'InitiateHospitalization',
  data() {
    return {
      DaysModel: '',
      Areastatus: "",
      City: "",
      valuehospital: '',
      valuehour: "",
      illnessRoom: [], // 病房
      doctor: [],
      doctorList: [],
      sysUser: [],
      sysUserList: [],
      esthetics: [],
      estheticsList: [],
      areaArr: area.arrAll,
      form: {
        inpatientStatus: 1,
        inpatientFrequency: 1, // 第几次住院
        hospitalTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()), // 住院时间
        hospitalDoctor: null, // 住院医生
        nursingPersonnel: null, // 护理人员
        medicalRecordId: '', // 病房号
        bedNumber: '', // 病床号
        operationName: '',
        remark: '',
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        customSex: '',
        aestheticConsultant: '',
        customAge: '', // 年龄
        country: '',
        province: '',
        city: '',
        area: '',
        abl: "",
        abl: "",
        occupation: '', // 职业
        marriageType: '', // 婚姻
        card: '', // 身份证号
        addr: '',
        totalCost: 0 // 费用总额
      }, // 客户信息
      cityArr: [],
      districtArr: [], // 区
      earsModel: null,
      years: [],
      monthsModel: null,
      months: [],
      daysModel: null,
      days: []
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
    },
    'form.province'() {
      this.updateCity()
      this.updateDistrict()
    },
    'form.country'(value) {
      if (value == '0') {
        this.form.country = '中国大陆'
      }
      if (value == '1') {
        this.form.country = '中国香港'
      }
      if (value == '2') {
        this.form.country = '中国澳门'
      }
      if (value == '3') {
        this.form.country = '中国台湾'
      }

    },
    'form.occupation'(value){
      let that=this;
      setTimeout(function (){
        that.dict.type.occupation.forEach(newvalue=>{
          if(value==newvalue.value){
            that.form.occupation=newvalue.label
          }
        })
        if(value==0){
          that.form.occupation='请选择'
        }
      },100)

    },
    'form.marriageType'(value){
      let that=this;
      setTimeout(function (){
        that.dict.type.marital_status.forEach(newvalue=>{
          if(value==newvalue.value){
            that.form.marriageType=newvalue.label
          }
        })
      },400)
    },
    'form.customSex'(value){
      let that=this;
      setTimeout(function (){
        that.dict.type.sys_user_sex.forEach(newvalue=>{
          if(value==newvalue.value){
            that.form.customSex=newvalue.label
          }
        })
      },400)
    },
    City() {
      this.updateDistrict()
    }
  },
  created() {
    let that=this;
    this.data = JSON.parse(this.$route.query.data)
    this.form = this.data;
   setTimeout(function(){
    that.City=that.form.city;
    that.Areastatus=that.form.area;
     if(that.form.birthday!==null){
       that.form.monthsModel=that.form.birthday.split('-')[0];
       that.DaysModel=that.form.birthday.split('-')[1];
     }
   },500)
    this.form.operationName = this.data.projectName
    this.init()
    this.deptId = this.$store.getters.departmentId
    this.getUserList()
  },
  methods: {
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
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    // 保存
    addOrEdit() {
      if (this.valuehospital == '' || this.valuehour == '') {
        this.$message.warning('请选择住院时间')
        return
      }
      let hospitalTime;
      let hospitalTimes = JSON.parse(localStorage.getItem('your'))
      hospitalTime = this.newDate(this.valuehospital) + ' ' + String(this.valuehour).substr(16, 8);
      const data = {
        'bedNumber': this.form.bedNumber, // 病床号
        'deptId': this.deptId, // 公司
        'hospitalDoctor': this.form.abl, // 住院医生
        'hospitalTime': this.form.hospitalTime, // 住院时间
        'id': this.form.id,
        'inHospitalId': this.form.inHospitalId, // 编号
        'inpatientFrequency': this.form.inpatientFrequency, // 第几次住院
        'inpatientStatus': '1', // 住院状态
        'medicalRecordId': this.form.medicalRecordId, // 病案号
        nursingPersonnel: this.form.nursingPersonnel, // 护理人员
        'operationName': this.form.operationName, // 手术名称
        'remark': this.form.remark, // 备注
        'departmentId': this.form.billingDepartment, // departmentId
        'waitId': this.form.waitId, // 待服务编号
        'totalCost': this.form.totalCost // 合计金额
        , customerName: hospitalTimes.customerName,
        hospitalTime,
        customCardNumber: hospitalTimes.customCardNumber,
        customPhone: hospitalTimes.customPhone,
        // departmentId: hospitalTimes.departmentId,
        deptId: hospitalTimes.deptId,
        jdxxId: hospitalTimes.jdxxId,
        card:this.form.card,
        provice:this.form.province,
        city:this.City,
        area:this.Areastatus,
        marriageType:this.form.marriageType,
        occupation:this.form.occupation,
        birthday:this.form.birthday,
        country:this.form.country,
      }
      data.inpatientStatus = '0';
      this.dict.type.sys_user_sex.forEach(value=>{
        if(value.label==this.form.customSex){
          this.form.customSex=value.value;
        }
      })
      this.dict.type.occupation.forEach(value=>{
        if(value.label==this.form.occupation){
          this.form.occupation=value.value;
        }
      })
      this.dict.type.marital_status.forEach(value=>{
        if(value.label==this.form.marriageType){
          this.form.marriageType=value.value;
        }
      })
      if(this.form.country=='中国大陆'){
        this.form.country='0'
      }
      if(this.form.country=='中国香港'){
        this.form.country='1'
      }
      if(this.form.country=='中国澳门'){
        this.form.country='2'
      }
      if(this.form.country=='中国台湾'){
        this.form.country='3'
      }
      if(this.form.occupation=='其它'){
        this.form.occupation='5'
      }
      if(this.form.occupation=='请选择'){
        this.form.occupation=''
      }
      const datas = {
        'id': this.form.id,
        customSex: this.form.customSex,
        birthday: this.form.birthday,
        province:this.form.province,
        city:this.City,
        area:this.Areastatus,
        country:this.form.country,
        occupation:this.form.occupation,
        marriageType:this.form.marriageType,
        addr: this.form.addr,


      }
      data.birthday=this.form.monthsModel+'-'+this.DaysModel
      this.$api.medical.hospitalInfoPost(data).then(res => {
        if (res) {
          this.$message.success('添加成功')
          // this.$router.push({ path: 'PlasticRegistration' })
          vm.$emit('closeTag', this.$route.path)
        }
      })


      this.$api.user.updateUserInfo(datas).then((res) => {
        if (res) {
          // this.$message.success(res.msg)
          this.closeTag()
          this.submitLoading = false
        }
      })
    },
    // 关闭
    remode() {
      vm.$emit('closeTag', this.$route.path)
    },
    //  省市区
    updateCity() {
      for (const i in this.areaArr) {
        const obj = this.areaArr[i]
        if (obj.name) {
          if (obj.name === this.form.province) {
            this.cityArr = obj.sub
            break
          }
        }
      }
      this.City = this.cityArr[0].name
    },
    updateDistrict() {
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
        this.Areastatus = this.districtArr[0].name
      } else {
        this.Areastatus = ''
      }
    },
    // 出生日期
    init() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日
      this.initSelectYear(year)
      this.initSelectMonth()
      this.initSelectDay(year, month)
      this.form.yearsModel = year
      this.form.monthsModel = month
      this.DaysModel = day
      const obj = { year: this.form.yearsModel, month: this.form.monthsModel, day: this.DaysModel }
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
      this.days = [];
      // this.days.push({ value: 0, label: '全部' })
      for (var i = 1; i <= maxDay; i++) {
        this.days.push({ value: i, label: i })
      }
    },
    dateChange(type) {
      // 1年 2月 3日 4 左 5右
      if (type === 1 || type === 2) {
        if (this.form.monthsModel === 0) {
          this.form.daysModel = 0
          this.initSelectDay(this.form.yearsModel, 1)
        } else {
          this.initSelectDay(this.form.yearsModel, this.form.monthsModel)
        }
      }
      if (type == 4) {
        this.dayleft()
      }
      if (type == 5) {
        this.dayright()
      }
      this.form.birthday = this.form.monthsModel + '-' + this.DaysModel;
    },
    dayleft() {
      var tmpYear = this.form.yearsModel
      var tmpMonth = this.form.monthsModel
      var tmpDay = this.form.daysModel
      if (tmpYear == null) {
        var myDate = new Date()
        var year = myDate.getFullYear()// 获取当前年
        var month = myDate.getMonth() + 1// 获取当前月
        var day = myDate.getDate()// 获取当前日
        this.form.yearsModel = year
        this.form.monthsModel = month
        this.form.daysModel = day
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
      this.form.yearsModel = yearV
      this.form.monthsModel = monthV
      this.form.daysModel = dayV
    },
    dayright() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日

      var tmpYear = this.form.yearsModel
      var tmpMonth = this.form.monthsModel
      var tmpDay = this.form.daysModel

      if (tmpYear == null) {
        var myDate = new Date()
        var year = myDate.getFullYear()// 获取当前年
        var month = myDate.getMonth() + 1// 获取当前月
        var day = myDate.getDate()// 获取当前日
        this.form.yearsModel = year
        this.form.monthsModel = month
        this.form.daysModel = day
        return
      }

      if (tmpMonth == null) { tmpMonth = 0 }
      if (tmpDay == null) { tmpDay = 0 }
      if (tmpYear > year) {
        this.form.yearsModel = year
        this.form.monthsModel = month
        this.form.daysModel = day
        return
      }
      if (tmpYear == year) {
        if ((tmpMonth > month || tmpMonth == 0) || (tmpMonth == month) && (tmpDay >= day || tmpDay == 0)) {
          this.form.yearsModel = year
          this.form.monthsModel = month
          this.form.daysModel = day
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

      this.form.yearsModel = yearV
      this.form.monthsModel = monthV
      this.form.daysModel = dayV
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
    // 获取用户列表
    getUserList() {
      let data = {
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
          let newarr = [];
          res.data.forEach(value => {
            if (value.postCode == 'zerennurse')
              newarr.push(value)
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = newarr
          this.sysUser = arr1
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
    color: #75deca;
  }
}

::v-deep .el-input__prefix {
  display: none !important;
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

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;

  .content {
    //width: 370px;
    position: fixed;
    right: 20px;

  }
}
</style>
