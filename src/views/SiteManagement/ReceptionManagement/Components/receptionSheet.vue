
<template>
  <!-- 领取接诊单 -->
  <el-scrollbar>
    <div

      class="box"
    >
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col
          style="margin-right:10px"
          :span="16"
        >
          <el-card class="one card">
            <div class="title">客户信息</div>
            <!-- 表单 -->
            <el-form
              ref="form"
              size="mini"
              :model="form"
              :rules="rules"
              label-width="100px"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="姓名"
                    prop="customerName"
                    size="mini"
                  >
                    <el-input
                      v-model="form.customerName"
                      class="fullInput"
                      clearable
                      placeholder="请输入姓名"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="年龄">
                    <el-input
                      v-model="form.customAge"
                      class="fullInput"
                      placeholder="请输入年龄"
                      style="width: 100%"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item
                    label="国家/地区"
                    prop="country"
                  >
                    <el-select filterable v-model="form.country" style="width: 100%">
                      <el-option
                        label="中国大陆"
                        value="0"
                      />
                      <el-option
                        label="中国香港"
                        value="1"
                      />
                      <el-option
                        label="中国澳门"
                        value="2"
                      />
                      <el-option
                        label="中国台湾"
                        value="3"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="客户代表"
                  >
                    <el-select v-model="form.customerRepresentative" :filter-method="aestheFilter" filterable style="width: 100%" clearable >
                      <el-option
                        v-for="(item, index) in esthetics"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="怀孕几周"
                  >
                    <el-select
                      v-model="form.pregnantWeek"
                      class="fullInput"
                      placeholder="请选择怀孕周数"
                      clearable
                      filterable
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="(pregnantWeek,pregnantWeekIndex) in 52"
                        :key="pregnantWeekIndex+'pregnantWeek'"
                        :label="pregnantWeek+'周'"
                        :value="pregnantWeek"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="手机"
                    prop="customPhone"
                  >
                    <el-input
                      v-model="form.customPhone"
                      class="fullInput"
                      placeholder="请输入手机号"
                      style="width: 100%"
                      clearable
                      :disabled="disabled"
                    />
                  </el-form-item>
                  <el-form-item
                    label="生日"
                    prop="birthday"
                  >
                    <el-select v-model="yearsModel" filterable placeholder="请选择" style="width:100px; display: none" clearable @change="dateChange(1)">
                      <el-option
                        v-for="(item, index) in years"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-model="monthsModel" filterable placeholder="请选择" style="width:50%;" clearable @change="dateChange(2)">
                      <el-option
                        v-for="(item, index) in months"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-model="daysModel" filterable placeholder="请选择" style="width:50%;" clearable @change="dateChange(3)">
                      <el-option
                        v-for="(item, index) in days"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="地址"
                    prop="province"
                  >
                    <el-select filterable v-model="form.province" style="width: 33%">
                      <el-option
                        v-for="(option, optionIndex) in areaArr"
                        :key="optionIndex"
                        :value="option.name"
                        :label="option.name"
                      />
                    </el-select>
                    <el-select filterable v-model="form.city" style="width: 33%" @change="changeCity">
                      <el-option
                        v-for="(option, optionIndex) in cityArr"
                        :key="optionIndex"
                        :value="option.name"
                        :label="option.name"
                      />
                    </el-select>
                    <el-select filterable v-model="form.area" style="width: 33%" @change="$forceUpdate()">
                      <el-option
                        v-for="(item, itemIndex) in districtArr"
                        :key="itemIndex"
                        :value="item.name"
                        :label="item.name"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分诊科室" prop="departmentId">
                    <el-select  v-model="form.departmentId" filterable style="width: 100%" clearable>
                      <el-option
                        v-for="(item, index) in TriageDepartment"
                        :key="index"
                        :value="item.departmentId"
                        :label="item.departmentName"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户意向描述">
                    <el-input
                      v-model="form.intentionDescription"
                      type="textarea"
                      :rows="3"
                      clearable
                      maxlength="100"
                      style="width:233%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别" prop="customSex">
                    <el-select filterable v-model="form.customSex" style="width: 100%" clearable>
                      <el-option
                        v-for="(item, index) in dict.type.sys_user_sex"
                        :key="index"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="媒介来源"
                    prop="channelTypeId"
                  >
                    <el-input
                      v-if="id !== undefined"
                      v-model="form.channelName"
                      disabled
                      type="text"
                      clearable
                      filterable
                    />
                    <el-select
                      v-if="id === undefined"
                      v-model="form.channelTypeId"
                      style="width: 50%"
                      clearable
                      filterable
                      @change="channelTypeSelection"
                    >
                      <el-option
                        v-for="(type,typeIndex) in channelType"
                        :key="typeIndex +'type'"
                        :label="type.typeName"
                        :value="type.channelId ? type.channelId : type.typeId"
                      />
                    </el-select>
                    <el-select
                      v-if="id === undefined"
                      v-model="form.channelId"
                      style="width: 50%"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="(type,typeChildIndex) in channelTypeChildren"
                        :key="typeChildIndex+'typeChild'"
                        :label="type.typeName"
                        :value="type.channelId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="医生">
                    <el-select v-model="form.doctorId" :filter-method="doctorFilter" filterable style="width: 100%" clearable>
                      <el-option
                        v-for="(item, index) in doctor"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="美学顾问" prop="aestheticConsultant">
                    <el-select v-model="form.aestheticConsultant" :filter-method="aestheFilter" filterable style="width: 100%" clearable>
                      <el-option
                        v-for="(item, index) in esthetics"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <!-- 第二行-->
          <div
            v-if="id !== undefined"
            class="tow"
          >
            <el-card class="one card">
              <div class="title">临客跟进信息</div>
              <el-form label-width="100px">
                <el-form-item label="临客咨询备注">
                  <el-input
                    v-model="form.remarks"
                    type="textarea"
                    :rows="3"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="临客跟进记录">
                  <el-table
                    size="mini"
                    border
                    :data="Followup"
                    max-height="150"
                  >
                    <el-table-column
                      label="跟进时间"
                      align="center"
                      prop="createTime"
                    />
                    <el-table-column
                      label="跟进人"
                      prop="createBy"
                    />
                    <el-table-column
                      label="跟进记录"
                      prop="remark"
                    />
                  </el-table>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <el-card class="one card">
            <div class="title">其他信息[接待人:{{ user.nickName }}]</div>
            <el-form
              label-width="120px"
              size="mini"
            >
              <el-form-item
                v-if="id === undefined"
                label="查询推荐人"
                prop="searchRefereeuser"
              >
                <el-select
                  v-model="form.searchRefereeuser"
                  clearable
                  placeholder="请输入查询推荐人"
                  filterable
                  remote
                  reserve-keyword
                  value-key="arr"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="changes"
                >
                  <el-option
                    v-for="(arr, index) in phone"
                    :key="index"
                    :value="arr"
                    :label="arr.refereeName + arr.refereePhone"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="推荐人姓名">
                <el-input
                  v-model="form.refereeName"

                />
              </el-form-item>
              <el-form-item label="推荐人电话/卡号">
                <el-input
                  :value="form.refereePhone === undefined ? null : form.refereePhone + '/' + form.refereeCard"

                />
              </el-form-item>
              <el-row
                type="flex"
                justify="space-around"
              >
                <el-form-item label="彼此关系">
                  <el-select v-model="form.relation" filterable>
                    <el-option
                      v-for="(item, index) in dict.type.mutual_relationship"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="员工推荐人">
                  <el-select v-model="form.refereeuserId" filterable :filter-method="refereeFilter">
                    <el-option
                      v-for="(item, index) in sysUserList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-row>
              <el-form-item label="客户地址">
                <el-input
                  v-model="form.addr"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
              <el-form-item label="分诊备注">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
              <el-form-item label="身份证" prop="card">
                <el-input
                  v-model="form.card"
                  type="text"
                  minlength="15"
                  maxlength="18"
                  onkeyup="value=value.replace(/[^\d]/g, '')"
                  clearable
                />
              </el-form-item>
            </el-form>
          </el-card>

        </el-col>
      </el-row>
      <!-- 底部 -->
      <el-row>
        <div class="tow">
          <!-- 底部 -->
          <el-card class="card">
            <div class="title">临客预约信息</div>
            <el-table
              size="mini"
              :data="data"
              border
            >
              <el-table-column
                label="预约日期"
                prop="appointmentTime"
              />
              <el-table-column
                label="预约项目"
                prop="preserveName"
              />
              <el-table-column
                label="意向度"
                :formatter="formatterMent"
                prop="degreeIntention"
              />
              <el-table-column
                label="下单时间"
                prop="dsingleTime"
              />
              <el-table-column
                label="备注"
                prop="remark"
              />
            </el-table>
          </el-card>
        </div>
      </el-row>
      <el-row
        type="flex"
        justify="end"
        style="margin-top:15px"
      >
        <el-button
          size="mini"
          type="primary"
          :loading="submitLoading"
          @click="add"
        >保存</el-button>
        <el-button
          size="mini"
          type="danger"
          @click.stop="close"
        >关闭</el-button>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script>
import area from '@/utils/area'
import vm from '@/utils/util'
// import { throttle } from '@/utils/throttleAndDebounce'
import { math } from '@/utils/math'
import PinyinMatch from 'pinyin-match'
import deptId from '../../../../api/index/deptId'

export default {
  name: 'ReceptionSheet',
  dicts: ['sys_user_sex', 'degree_intention_list', 'mutual_relationship'],
  data() {
    return {
      disabled: false,
      submitLoading: false,
      loading: false,
      phone: [],
      showDataDialog: false,
      Followup: [], // 接受临客跟进记录
      // 临客信息
      data: [],
      options: [],
      districtArr: [],
      // 来源渠道
      channelType: [],
      channelTypeChildren: [],
      // 地区信息
      areaArr: area.arrAll,
      cityArr: [],
      // 系统用户列表
      sysUserList: [],
      sysUser: [],
      esthetics: [],
      estheticsList: [],
      doctor: [],
      doctorList: [],
      form: {
        customerName: '',
        customAge: '',
        country: '',
        area: '',
        customerRepresentative: '',
        customPhone: '',
        birthday: null,
        province: '',
        departmentId: '',
        doctorId: '',
        customSex: '',
        channelTypeId: '',
        channelId: '',
        channelName: '',
        city: '',
        aestheticConsultant: '',
        intentionDescription: '',
        remarks: '',
        searchRefereeuser: '',
        refereeId: '',
        refereeName: '',
        refereePhone: '',
        refereeCard: '',
        relation: '',
        refereeuserId: '',
        addr: '',
        remark: '',
        card: '',
        isReachCourtyard: '',
        pregnantWeek: 0, // 怀孕几周
        createuserId: 0,
        visituserId: 0,
        onlineUserId: 0
      },
      user: {},
      id: '',

      TriageDepartment: [], // 分诊科室数据
      tableData: [],
      // 表单的校验
      rules: {
        customerName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        // customAge: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        customPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        customSex: [{ required: true, message: '请输入姓别', trigger: 'blur' }],
        channelTypeId: [{ required: true, message: '请输入媒介来源', trigger: 'blur' }],
        // country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
        // area: [{ required: true, message: '请输入区域', trigger: 'blur' }],
        // kehudaibiao: [{ required: true, message: '请输入客户代表', trigger: 'blur' }],
        // province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        // city: [{ required: true, message: '请输入市县', trigger: 'blur' }],
        // fenzhenkeshi: [{ required: true, message: '请输入分诊科室', trigger: 'blur' }],
        aestheticConsultant: [{ required: true, message: '请输入美学顾问', trigger: 'blur' }],
        // kehuxixiangmiaoshu: [{ required: true, message: '请输入客户详细描述', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择科室', trigger: 'blur' }]
      },
      yearsModel: null,
      years: [],
      monthsModel: null,
      months: [],
      daysModel: null,
      days: [],
      onlineUserName:'',
       grossConsumption:'',
      openId:''
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
      this.getChannelInfo()
      this.getDeptInfo(val)
      this.getUserList()
    },
    'form.province'() {
      this.updateCity()
      this.updateDistrict()
    },
    'form.city'() {
      this.updateDistrict()
    }
  },
  created() {
    this.options = this.dict.type.degree_intention_list
    this.user = this.$store.getters.user
    if (this.$route.query.openId){
      this.openId=this.$route.query.openId
    }
    // this.form.departmentId = null
    // this.id = this.$route.query.id   取消先
    // this.createuserId = this.$route.query.createuserId
    // this.visituserId = this.$route.query.visituserId
    // this.onlineUserId = this.$route.query.onlineUserId
      if (this.$route.query.onlineUserName !== ''){
          this.onlineUserName = this.$route.query.onlineUserName
      }
      if (this.$route.query.grossConsumption !== ''){
          this.grossConsumption = this.$route.query.grossConsumption
      }

    if (this.$route.query.customPhone !== '') {
        this.customPhone = this.$route.query.customPhone
      this.id = this.getUserInfoPhone(this.customPhone, this.deptId)
      this.forbidden()
    }
    this.getChannelInfo()
    this.getDeptInfo()
    this.getUserList()
    this.id.then(res => {
      this.id = res.data
      if (this.id !== undefined && this.id !== null && this.id !== '' && this.id !== 0) {
        // 临客信息
        this.GuestInformation(this.id)
        this.receiveReceptionSheet(this.id)
        // 获取临客跟进记录
        this.followUp(this.id)
      } else {
        this.form.customPhone = this.customPhone
      }
    })

    this.init()
  },
  methods: {
    changeCity(val){
      this.$forceUpdate()
      this.updateDistrict()
    },
    forbidden() {
      this.disabled = true
    },
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
    refereeFilter(val) {
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
        this.years.push({ value: (year - i), label: (year - i) })
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

      if (type == 1 || type == 2) {
        if (this.monthsModel == 0) {
          this.daysModel = 0
          this.initSelectDay(this.yearsModel, 1)
        } else {
          this.initSelectDay(this.yearsModel, this.monthsModel)
        }
      }
      if (type == 4) {
        this.dayleft()
      }
      if (type == 5) {
        this.dayright()
      }
      const yeart = math.subtract(Number(this.yearsModel), Number(this.form.customAge))
      this.form.birthday = yeart + '-' + this.monthsModel + '-' + this.daysModel
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
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 查询推荐人
    remoteMethod(query) {
      // 当input里面的值大于两个的时候触法搜索
      if (query.length > 2) {
        this.loading = true
        //  一秒后再搜索
        setTimeout(() => {
          this.loading = false
          this.$api.modules.netPower.selectRecommend({ namephonecard: query }).then(res => {
            if (res) {
              this.phone = res.data
            }
          })
        }, 1000)
      }
    },
    // 拿取被点击的对象进行重新赋值
    changes(val) {
      this.form.refereeName = val.refereeName
      this.form.refereePhone = val.refereePhone
      this.form.refereeId = val.id
      this.form.refereeCard = val.customCardNumber
      this.form.searchRefereeuser = ''
    },
    // 错误问题
    receiveReceptionSheet(id) {
      this.$api.dept.receiveReceptionSheet(id, 'get').then((res) => {
        if (res) {

          if (res.data.customerRepresentative === 0) {
            res.data.customerRepresentative = null
            // this.$set(res.data, 'customerRepresentative', null)
          }
          if (res.data.doctorId === 0) {
            res.data.doctorId = null
          }
          if (res.data.refereeuserId === 0) {
            res.data.refereeuserId = null
          }
          if (res.data.receptionId === 0) {
            res.data.aestheticConsultant = null
          } else {
            res.data.aestheticConsultant = res.data.receptionId
          }
          if (res.data.departmentId === 0) {
            res.data.departmentId = null
          }
          this.form = res.data
          this.form.customPhone = res.data.phone
          let start=res.data.birthday.split('-');
          this.daysModel = start[1]
          this.monthsModel = start[0]
        }
      })
    },

    async getUserInfoPhone(phone, deptId) {


      const id = await this.$api.dept.getUserInfoPhone({ phone: phone, deptId: deptId }, 'get')
      return id
    },

    getDeptInfo() {
      this.TriageDepartment = []
      // 获取科室的数据
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }, 'get').then((res) => {

        if (res) {
          this.TriageDepartment = res.rows
        }
      })
    },
    // 获取临客更进记录
    followUp(id) {
      this.$api.modules.netPower.GuestInformation({ id: id }).then((res) => {
        if (res) {
          this.Followup = res.rows
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 获取用户列表
    getUserList() {
      // 人员添加公司Id 添加状态

      this.$api.user.getUserList({
        deptId: this.deptId,
        status: '0'
      }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          this.sysUserList = this.unique(res.data)
          this.sysUser = this.sysUserList
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
              this.doctorList = this.doctor
            }
          })

          // 美学顾问 顾客代表
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.estheticsList = this.esthetics
            }
          })
        }
      })
    },
    // 获取渠道信息
    getChannelInfo() {
      this.$api.modules.channel.getChannelType({
        'deptId': this.deptId,
        'status': 0
      }).then(res => {
        if (res) {
          this.channelType = res.data
        }
      })
    },
    // 选择媒介来源第一级
    channelTypeSelection(selection) {
      this.form.channelId = ''
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      this.channelTypeChildren = data[0].channelInfo
    },
    // channelSelection(selection) {
    // const data = this.channelTypeChildren.filter(filter => {
    //   return filter.deptChannelId === selection
    // })
    // this.form.channelId = data[0].deptChannelId
    // this.form.channelName = ''
    // },
    //  更新地址
    updateCity() {
      if(this.form.province){
        for (const i in this.areaArr) {
          const obj = this.areaArr[i]
          if (obj.name) {
            if (obj.name === this.form.province) {
              this.cityArr = obj.sub
              break
            }
          }
        }
        this.form.city = this.cityArr[0].name
      }

    },
    updateDistrict() {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i]
        if (obj.name === this.form.city) {
          this.districtArr = obj.sub
          break
        }
      }
      if (
        this.districtArr &&
        this.districtArr.length > 0 &&
        this.districtArr[0].name
      ) {
        this.form.area = this.districtArr[0].name
      } else {
        this.form.area = ''
      }
    },
    // 临客信息列表
    GuestInformation(id) {
      this.showDataDialog = true
      this.$api.dept.GuestInformation('get', { id: id }).then((res) => {
        if (res) {
          this.data = res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 点击关闭接口
    close() {
      this.closeTag()
      // this.$router.back() // 返回上一级页面
    },
    // 点击确定按钮后
    add() {
      if (this.form.channelId === '') {
        this.$message('媒介来源二级不能为空')
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          let name=''
          this.TriageDepartment.forEach(value=>{
            if(this.form.departmentId==value.departmentId){
               name=value.departmentName
            }
          })

          var data = {
            aestheticConsultant: this.form.aestheticConsultant,
            customerName: this.form.customerName,
            customAge: this.form.customAge,
            country: this.form.country,
            area: this.form.area,
            customerRepresentative: this.form.customerRepresentative,
            customPhone: this.form.customPhone,
            birthday: this.form.birthday,
            province: this.form.province,
            departmentId: this.form.departmentId,
            departmentName: name,
            doctorId: this.form.doctorId,
            customSex: this.form.customSex,
            city: this.form.city,
            channelTypeId: this.form.channelTypeId,
            channelId: this.form.channelId,
            intentionDescription: this.form.intentionDescription,
            remarks: this.form.remarks,
            refereeId: this.form.refereeId,
            refereeName: this.form.refereeName,
            refereePhone: this.form.refereePhone,
            refereeCard: this.form.refereeCard,
            relation: this.form.relation,
            refereeuserId: this.form.refereeuserId,
            addr: this.form.addr,
            remark: this.form.remark,
            card: this.form.card,
            id: this.id,
            deptId: this.deptId,
            isReachCourtyard: this.form.isReachCourtyard,
            onlineUserId: this.form.onlineUserId,
            pregnantWeek: this.form.pregnantWeek,
            createuserId: this.form.createuserId,
            visituserId: this.form.visituserId,
            acName:'',
            onlineUserName:this.onlineUserName,
            createName: this.form.createName,
            medium:this.form.channelName,
            grossConsumption : this.grossConsumption,
            openId:this.openId
          }
          data.birthday=this.monthsModel+'-'+this.daysModel
          this.esthetics.forEach(item=>{
              if (this.form.aestheticConsultant==item.value){
                  data.acName=item.label
              }
          })
          this.$api.dept.addReceptiondata(data).then((res) => {
            if (res) {
              this.$message.success(res.msg)
              this.closeTag()
              this.submitLoading = false
              // this.$router.back() // 返回上一级页面
            }
          })
        }
      })
    },
    // 转换表格中的字段
    formatterMent(row, column, cellValue, index) {
      const obj = this.dict.type.degree_intention_list.find(item => item.value === cellValue)
      return obj ? obj.label : '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  // position: relative;
  box-sizing: border-box;
  padding: 20px;
  // margin: 20px;
  border: 1px solid #f8f8f8;
  background-color: #f8f8f8;

  .card {
    border: 1px solid #c6c6c6;
    border-radius: 10px;
  }
  .title {
    position: absolute;
    margin-top: -30px;
    font-weight: 700;
    background-color: #f8f8f8;
    z-index: 2;
  }
  .one {
    background-color: #f8f8f8;
    .el-form-item__label {
      padding: 0 10px 0 0;
    }
  }
  .tow {
    margin-top: 15px;
    background-color: #f8f8f8;
    .footer {
      position: absolute;
      margin-top: -30px;
      font-weight: 700;
      background-color: #f8f8f8;
      z-index: 2;
    }
    .el-table__header tr,
    .el-table__header th {
      padding: 0;
      height: 20px !important;
    }
    .el-table th.el-table__cell {
      line-height: 10px;
    }
    .el-form-item__label {
      padding: 0 10px 0 0;
    }
  }
}
// ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
//   width: 100%;
//   height: 50px;
//   z-index: 999999;
// }
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  z-index: 999999;
}
// ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
//   border-radius: 5px;
//   height: 20px;
//   background: #dcdcdc;
// }
</style>
