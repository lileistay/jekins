<template>
  <!-- 顾客信息查看修改-->
  <el-scrollbar>
    <div class="progressBar">
      <ul />
      <div style="display: flex">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-s-claim"
          :loading="submitLoading"
          @click.stop.native="submitForm"
        >保存</el-button>
        <el-button
          size="mini"
          icon="el-icon-close"
          :loading="submitLoading"
          @click.stop.native="goBack"
        >关闭</el-button>
      </div>
    </div>
    <div class="container">
      <div v-loading="submitLoading" class="dialog-box">
        <div class="title">
          <div>临客信息</div>
        </div>
        <div class="content">
          <el-form
            ref="form"
            :rules="rules"
            size="mini"
            :model="form"
            label-width="110px"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="顾客姓名" prop="customerName">
                  <el-input v-model="form.customerName" placeholder="请输入顾客姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="顾客电话">
                  <el-input
                    v-model="form.customPhone"
                    disabled
                    placeholder="请输入顾客电话"
                    style="width: calc(100% - 50px);"
                  />
                  <el-tooltip content="显示电话" placement="right">
                    <el-button
                      style="cursor: pointer"
                      :disabled="showPhone"
                      @click.stop="showCustomerPhone"
                    ><i class="el-icon-view" />
                    </el-button>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系方式">
<!--                  <el-input v-model="form.phone" placeholder="请输入顾客联系方式" />-->
                  <el-button type="text" size="mini" plain @click="getPhone">查看详情</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别">
                  <el-select v-model="form.customSex" class="full-width" filterable placeholder="请选择性别">
                    <el-option
                      v-for="dict in dict.type.sys_user_sex"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年龄">
                  <el-select v-model="form.customAge" filterable class="full-width" placeholder="请选择年龄">
                    <el-option
                      v-for="age in 80"
                      :key="age+'age'"
                      :value="age"
                      :label="age+'岁'"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="国家/地区" >
                  <el-select v-model="form.country" filterable class="full-width" placeholder="请选择国家/地区">
                    <el-option label="中国大陆" value="0" />
                    <el-option label="中国香港" value="1" />
                    <el-option label="中国澳门" value="2" />
                    <el-option label="中国台湾" value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="省份" >
                  <el-select v-model="form.province" filterable class="full-width" placeholder="请选择市县">
                    <el-option
                      v-for="(option, optionIndex) in areaArr"
                      :key="optionIndex"
                      :value="option.name"
                      :label="option.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="市/县" >
                  <el-select v-model="form.city" filterable class="full-width" placeholder="请选择市县" @change="handlecity">
                    <el-option
                      v-for="(option, optionIndex) in cityArr"
                      :key="optionIndex"
                      :value="option.name"
                      :label="option.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="区" >
                  <el-select v-model="form.area" filterable class="full-width" placeholder="请选择市县" @change="handlearea">
                    <el-option
                      v-for="(item, itemIndex) in districtArr"
                      :key="itemIndex"
                      :value="item.name"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="怀孕几周">
                  <el-select filterable v-model="form.pregnantWeek == '0' ? form.pregnantWeek = '' : form.pregnantWeek" style="width: 100%" clearable>
                    <el-option
                      v-for="(pregnantWeek,pregnantWeekIndex) in 52"
                      :key="pregnantWeekIndex+'pregnantWeek'"
                      :label="pregnantWeek+'周'"
                      :value="pregnantWeek"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="职业">
                  <el-select
                    v-model="form.occupation === '0' ? form.occupation = '' : form.occupation"
                    clearable filterable
                    class="full-width"
                    placeholder="请选择职业"
                  >
                    <el-option
                      v-for="dict in dict.type.occupation"
                      :key="dict.value"
                      :value="dict.value"
                      :label="dict.label"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="预产期">
                  <el-date-picker
                    v-model="form.preProduction"
                    style="width: 100%"
                    clearable filterable
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择预产期时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收入水平">
                  <el-select filterable v-model="form.economicCapacity" class="full-width" placeholder="请选择收入水平">
                    <el-option
                      v-for="dict in dict.type.economic_capacity"
                      :key="dict.value"
                      :value="dict.value"
                      :label="dict.label"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="房间类型">
                  <el-select filterable v-model="form.roomTypeId == '0' ? form.roomTypeId = '' : form.roomTypeId" clearable style="width: 100%">
                    <el-option
                      v-for="item in getRoomTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="婚姻状况">
                  <el-select
                    v-model="form.marriageType"
                    clearable filterable
                    class="full-width"
                    placeholder="请选择婚姻状况"
                  >
                    <el-option
                      v-for="dict in dict.type.marital_status"
                      :key="dict.value"
                      :value="dict.value"
                      :label="dict.label"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="生育状况">
                  <el-select filterable v-model="form.fertility == '0' ? form.fertility = '' : form.fertility" clearable style="width: 100%">
                    <el-option label="1胎" value="1胎" />
                    <el-option label="2胎" value="2胎" />
                    <el-option label="3胎" value="3胎" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="QQ">
                  <el-input
                    v-model="form.qq"
                    clearable
                    class="full-width"
                    ma-xlength="12"
                    placeholder="请输入QQ号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="微信号">
                  <el-input
                    v-model="form.wechat"
                    clearable
                    class="full-width"
                    placeholder="请输入微信号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建档人">
                  <el-select
                    v-model="form.createuserId"
                    clearable
                    disabled
                    filterable
                    class="full-width"
                    placeholder="请选择建档人"
                  >
                    <el-option
                      v-for="(userItem,userIndex) in userList"
                      :key="userIndex+'user'"
                      :label="userItem.nickName"
                      :value="userItem.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计入住时间">
                  <el-date-picker
                    v-model="form.reserveRoomTime"
                    style="width: 100%"
                    clearable
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择预计入住时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建档时间">
                  <el-input
                    v-model="form.createTime"
                    clearable
                    class="full-width"
                    disabled
                    placeholder="请输入建档时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="媒介来源" prop="channelId">
                  <el-select
                    v-model="form.channelTypeId"
                    class="halfInput"
                    placeholder="请选择"
                    @change="channelTypeSelection"
                    disabled filterable
                  >
                    <el-option
                      v-for="(type,typeIndex) in channelType"
                      :key="typeIndex +'type'"
                      :label="type.typeName"
                      :value="type.channelId ? type.channelId : type.typeId"
                    />
                  </el-select>
                  <el-select v-model="form.channelId" class="halfInput" placeholder="请选择" filterable disabled>
                    <el-option
                      v-for="(type,typeChildIndex) in channelTypeChildren"
                      :key="typeChildIndex+'typeChild'"
                      :label="type.typeName"
                      :value="type.channelId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="交通工具">
                  <el-select
                    v-model="form.vehicle"
                    clearable filterable
                    class="full-width"
                    placeholder="请选择交通工具"
                  >
                    <el-option
                      v-for="dict in dict.type.vehicle"
                      :key="dict.value"
                      :value="dict.value"
                      :label="dict.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建档类型">
                  <el-input v-model="form.typeThreeName" disabled />
                </el-form-item>
              </el-col>
              <!--              <el-col :span="6">-->
              <!--                <el-form-item label="美容院">-->
              <!--                  <el-input disabled />-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="6">
                <el-form-item label="回访人">
                  <el-select
                    v-model="form.visituserId"
                    filterable
                    disabled
                    class="full-width"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(userItem,userIndex) in userList"
                      :key="userIndex+'visit'"
                      :label="userItem.nickName"
                      :value="userItem.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="推荐人">
                  <el-input v-model="form.refereeName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="员工推荐人">
                  <el-select
                    v-model="form.refereeuserId === 0 ? form.refereeuserId = '' : form.refereeuserId "
                    clearable
                    disabled
                    filterable
                    class="full-width"
                    placeholder="请选择员工推荐"
                  >
                    <el-option
                      v-for="(userItem,userIndex) in userList"
                      :key="userIndex+'user'"
                      :label="userItem.nickName"
                      :value="userItem.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="访客ID">
                  <el-input v-model="form.visitorId" placeholder="请输入访客ID" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址">
                  <el-input
                    v-model="form.addr"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入地址"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input
                    v-model="form.remarks"
                    type="textarea"
                    placeholder="咨询备注信息"
                    :rows="3"
                    resize="none"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="dialog-box">
        <div class="title">
          <div>添加跟进记录</div>
        </div>
        <div class="content">
          <el-form size="mini">
            <el-form-item>
              <el-input
                v-model="remark"
                :loading="disabledRemark"
                type="textarea"
                placeholder="请填写跟进记录内容"
                :rows="4"
                resize="none"
              />
            </el-form-item>
            <el-form-item>
              <div style="float: right;font-size: 10px;color: red">
                先填写记录，再点击按钮，保存信息
                <el-button
                  v-has-permi="['confinement:followUpRecord:add']"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  :loading="disabledRemark"
                  @click.stop="addFollowUpRecord"
                >添加跟进记录</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="dialog-box">
        <div class="title">
          <div>历史跟进记录</div>
        </div>
        <div class="content">
          <el-table :data="tableData" size="mini" style="width: 100%">
            <el-table-column prop="createTime" label="跟进时间" width="200" align="center" />
            <el-table-column prop="createBy" label="跟进人" width="200" align="center" />
            <el-table-column prop="remark" label="跟进记录" align="center" />
          </el-table>
        </div>
      </div>

    </div>
    <!-- 电话详情弹窗 -->
    <sg-dialog
      title="电话详情"
      :dialog="phoneDetailDialog"
      :inner-dialog="addPhoneDialog"
      :size="'600px'"
      @innerHandleClose="phoneDetailDialog=false"
      @handleClose="phoneDetailDialog=false"
    >
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            主号码信息
            <el-button
              v-has-permi="['confinement:customPhoneList:add']"
              type="text"
              size="mini"
              @click="addDialog = true">
              添加副号码
            </el-button>
          </div>
          <div class="content">
            <el-table ref="mainPhoneTable" :data="mainPhone" :border="true" size="mini" style="width: 100%">
              <el-table-column type="index" align="center" width="50" />
              <el-table-column prop="showPhone" align="center" label="电话">
                <template #default="scope">
                  <!--{{ scope.row.customPhone }}-->
                  <template v-if="scope.row.showPhone">{{ scope.row.truePhone }}</template>
                  <template v-else>{{ scope.row.phone }}</template>
                </template>
              </el-table-column>
              <el-table-column prop="createBy" label="创建人" align="center" width="100" />
              <el-table-column prop="createTime" label="创建时间" align="center" width="140" />
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click.native.prevent="showPhone1(scope.row)">
                    {{ scope.row.showPhone ? '隐藏' : '查看' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="phones.length > 0" class="dialog-box">
          <div class="title">
            副号码信息
          </div>
          <div class="content">
            <el-table :data="phones" :border="true" size="mini" style="width: 100%">
              <el-table-column type="index" align="center" width="50" />
              <el-table-column prop="showPhone" align="center" label="电话">
                <template #default="scope">
                  <template v-if="scope.row.showPhone">{{ scope.row.truePhone}}</template>
                  <template v-else>{{ scope.row.phone }}</template>
                </template>
              </el-table-column>
              <el-table-column prop="createBy" label="创建人" align="center" width="100" />
              <el-table-column prop="createTime" label="创建时间" align="center" width="140" />
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click.native.prevent="showPhone1(scope.row)">
                    {{ scope.row.showPhone ? '隐藏' : '查看' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </sg-dialog>
    <!-- 添加号码弹框-->
    <sg-dialog title="添加电话" :dialog="addDialog" size="400px" @handleClose="addPhoneDialogClose">
      <div slot="out">
        <el-form ref="addPhoneForm" :model="addPhoneForm" :rules="phoneRules">
          <el-form-item label="姓名" prop="customerName">
            <el-input v-model="addPhoneForm.customerName" size="mini" placeholder="姓名" disabled />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model.number="addPhoneForm.phone" :maxlength="11"  size="mini" placeholder="电话" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" plain @click="addPhoneSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </el-scrollbar>
</template>

<script>
import area from '@/utils/area'
import vm from '@/utils/util'
import SgDialog from '@/components/Dialog/index.vue'
import { throttle } from '@/utils/throttleAndDebounce' // 节流

export default {
  components: { SgDialog },
  name: 'EditTemporary',
  dicts: ['occupation', 'economic_capacity', 'marital_status', 'vehicle', 'sys_user_sex'],
  data() {
    return {
      getRoomTypeList: [], // 房间类型
      prevPath: undefined,
      // 加载
      submitLoading: false,
      // 禁用显示电话按钮
      showPhone: false,
      // 顾客信息表单
      form: {
        customerName: '',
        phone: '', // 电话没有星的
        customSex: '',
        customAge: '',
        country: '',
        province: '',
        city: '',
        area: '',
        occupation: '',
        economicCapacity: '',
        marriageType: '',
        qq: '',
        wechat: '',
        createuserId: '',
        createTime: '',
        channelTypeId: '',
        channelId: '',
        vehicle: '',
        buildType: '',
        visituserId: '',
        refereeuserId: '',
        refereeName: '',
        visitorId: '',
        addr: '',
        remarks: '',
      },
      // 系统用户
      userList: [],
      // 渠道信息
      channelType: [],
      channelTypeChildren: [],
      // 添加跟进内容
      remark: undefined,
      disabledRemark: false,
      // 地区信息
      areaArr: area.arrAll,
      cityArr: [],
      districtArr: [],
      tableData: [],
      //  表单校验规则
      rules: {
        customerName: [
          { required: true, message: '顾客姓名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度必须介于 2 和 20 个字符之间', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '请选择顾客国家/地区', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请选择顾客省份', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请输入选择顾客市/县', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择顾客地区', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择媒介来源', trigger: 'change' }
        ]
      },
      phoneDetailDialog:false,
      addPhoneDialog: false,
      // 添加号码弹窗
      addDialog: false,
      // 客户电话
      mainPhone: [],
      phones: [],
      // 添加电话表单
      addPhoneForm: {
        id: null,
        customerName: null,
        // phone: null
      },
      id:'',
      item:null,
      phoneRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          // { validator: validatePhone, trigger: 'blur' },
          // { validator: validatePhone, trigger: 'change' }
        ]
      },
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
      this.getUserList(val)
      this.channelType = []
      this.channelTypeChildren = []
      this.form.channelId = ''
      this.form.channelTypeId = ''
    },
    'form.channelTypeId'() {
      // this.form.channelId = ''
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
    this.form.id = this.$route.query.id
    this.id = this.$route.query.id
    this.getUserInfoById(this.$route.query.id)
    this.channelType = []
    this.channelTypeChildren = []
    this.form.channelId = ''
    this.form.channelTypeId = ''
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getChannelInfo()
    this.getFollowUpRecord()
    this.RoomTypeList()
  },
  methods: {
    // 查看电话
    getPhone(){
      this.phoneDetailDialog = true
      this.getPhonesByCustomerId()
    },
    // 显示隐藏号码
    // 显示隐藏号码
    showPhone1(row) {
      row.showPhone = !row.showPhone
      this.$refs.mainPhoneTable.$forceUpdate()
    },
    // 添加电话表单关闭
    addPhoneDialogClose() {
      this.addPhoneForm.phone = ''
      this.addDialog = false
    },
    // 添加电话
    addPhoneSubmit() {
      // console.log('提交')
      this.$refs.addPhoneForm.validate((valid) => {
        if (valid) {
          this.addPhoneForm.deptId = this.$store.getters.departmentId
          this.$api.customerCmt.addCustomPhone(this.addPhoneForm).then(res => {
            // console.log(res)
            if (res.code === 200) {
              // 弹窗提示操作成功
              this.$message({ type: 'success', message: res.msg })
              // 重新获取电话列表
              this.getPhonesByCustomerId()
            } else {
              this.$message({ type: 'error', message: res.msg })
            }
          })
          // 提交后关闭弹窗
          this.addPhoneDialogClose()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取电话列表
    getPhonesByCustomerId() {
      this.$api.user.getPhonesByCustomerId(this.id).then(res => {
        res.data.forEach(item => {
          item.showPhone = false
        })
        this.phones = res.data.filter(item => item.isMain === '0')
      })
    },
    RoomTypeList() {
      this.$api.confinementRoom.roomTypeInfoList({
        deptId: this.deptId,
        state: '0'
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.roomType
            item.value = item.roomTypeId
          })
          this.getRoomTypeList = res.rows
        }
      })
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 获取系统用户列表
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
          this.userList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取客户信息
    getUserInfoById(id) {
      if (!id) {
        this.$message.warning('参数值错误')
        return false
      }
      this.submitLoading = true
      this.$api.user.getUserInfoById(this.form.id || id).then(res => {
        if (res) {
          console.log(res, '修改顾客信息')
          this.channelTypeSelection(res.data.channelTypeId)
          res.data.buildType = res.data.filingName + '/' + res.data.typeTwoName + '/' + res.data.typeThreeName
          if (res.data.channelName !== undefined) {
            // 用split把整个名称分割开
            const channelName = res.data.channelName.split(' / ')
            // 新建一个临时对象，用来存放后台返回的数组
            const channel = {
              channelId: '',
              typeName: ''
            }
            // 把后台拿到的数据赋值给临时对象
            channel.channelId = res.data.channelId
            // 根据长度截取正确的名称
            channel.typeName = channelName[channelName.length - 1]
            // 把对象PUSH进二级数组
            this.channelTypeChildren.push(channel)
            // 新建一个临时对象，用来存放后台返回的数组
            const channelType = {
              channelId: '',
              typeName: ''
            }
            // 把后台拿到的数据赋值给临时对象
            channelType.channelId = res.data.channelTypeId
            // 根据长度截取正确的名称
            channelType.typeName = channelName[channelName.length - 2]
            // 把对象PUSH进二级数组
            this.channelType.push(channelType)
          }
          this.form = res.data
          this.item=res.data
          this.mainPhone.push({
            showPhone: false,
            phone: this.item.customPhone,
            truePhone: this.item.phone ,
            createBy: this.item.cdName,
            createTime: this.item.createTime,
            customerName: this.item.customerName
          })
          this.addPhoneForm= {
            id: this.item.id,
            customerName: this.item.customerName,
            // phone: null
          }
          console.log(this.item,'eeee')
          this.$forceUpdate()
        }
      }).finally(() => {
        this.submitLoading = false
      })
    },
    getFollowUpRecord() {
      this.$api.modules.netPower.followUpRecordList({ id: this.form.id }).then(res => {
        this.tableData = res.rows
      })
    },
    // 返回
    goBack() {
      // this.$router.replace(this.prevPath)
      // this.$router.back()
      this.closeTag()
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            id: this.form.id,
            customerName: this.form.customerName,
            phone: this.form.phone, // 电话没有星的
            customSex: this.form.customSex,
            customAge: this.form.customAge,
            country: this.form.country,
            province: this.form.province,
            city: this.form.city,
            area: this.form.area,
            occupation: this.form.occupation,
            economicCapacity: this.form.economicCapacity,
            marriageType: this.form.marriageType,
            qq: this.form.qq,
            wechat: this.form.wechat,
            createuserId: this.form.createuserId,
            createTime: this.form.createTime,
            channelTypeId: this.form.channelTypeId,
            channelId: this.form.channelId,
            vehicle: this.form.vehicle,
            buildType: this.form.buildType,
            visituserId: this.form.visituserId,
            refereeuserId: this.form.refereeuserId,
            refereeName: this.form.refereeName,
            visitorId: this.form.visitorId,
            addr: this.form.addr,
            remarks: this.form.remarks,
            customPhone: this.form.phone,
            pregnantWeek: this.form.pregnantWeek,
            roomTypeId: this.form.roomTypeId,
            fertility: this.form.fertility,
            preProduction: this.form.preProduction,
            reserveRoomTime: this.form.reserveRoomTime
          }


          // return;
          this.$api.user.updateUserInfo(data).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.closeTag()
              // this.$router.back()
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    // 显示顾客电话信息
    showCustomerPhone() {
      this.form.customPhone = this.form.phone
      this.showPhone = true
    },
    // 添加跟进记录
    addFollowUpRecord() {
      if (this.remark === undefined || this.remark === '') {
        this.$message.warning('请先填写跟进记录得内容')
        return
      }
      this.disabledRemark = true
      this.$api.modules.netPower.followUpRecord({ id: this.form.id, remark: this.remark }).then(res => {
        if (res) {
          this.$message.success(res.msg)
          this.getFollowUpRecord()
          this.remark = undefined
        }
      }).finally(() => {
        this.disabledRemark = false
      })
    },
    // 获取渠道信息
    getChannelInfo() {
      this.$api.modules.channel.getChannelType({
        'deptId': this.deptId,
        'status': 0
      }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.deptChannelId = item.typeId
          })

          this.channelType = res.data
        }
      })
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
      if(this.cityArr.length){
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
    /**
      * @author 李尚
      * @date 2022/8/16
      * @Description: 下拉选中 不付值
    */
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
    // 选择媒介来源第一级
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      if (data.length !== 0) {
        if (data[0].channelInfo !== undefined) {
          this.channelTypeChildren = data[0].channelInfo
        }
      }
    },
    channelSelection(selection) {
      const data = this.channelTypeChildren.filter(filter => {
        return filter.deptChannelId === selection
      })
      // this.form.channelId = data[0].deptChannelId
      // this.form.channelName = ''
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 70px 20px 20px 20px;
  box-sizing: border-box;
  .dialog-box {
    width: 100%;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    overflow: hidden;
    font-size: 14px;
    margin-bottom: 20px;
    box-sizing: border-box;
    .title {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 30px;
      background-color: #eeeeee;
      padding: 0 10px;
      line-height: 30px;
      box-sizing: border-box;
      span {
        color: #7ec5b7;
      }
    }
    .content {
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
.progressBar {
  width: 100%;
  height: 50px;
  background-color: #f2f2f2;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  ul {
    list-style: none;
    width: 100%;
    line-height: 30px;
    display: flex;
  }
}
.full-width {
  width: 100%;
}
.halfInput {
  width: 50%;
}
</style>
