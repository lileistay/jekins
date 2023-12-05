<template>
  <el-scrollbar>
    <div class="box">
      <!-- 客户信息补充 -->
      <el-row type="flex" justify="space-between">
        <el-col style="margin-right:10px" :span="15">
          <el-card class="one">
            <span class="span">客户信息[卡号:KH2022012000036]</span>
            <!-- 表单 -->
            <el-form size="mini" label-width="100px" :model="form" :rules="rules">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="客户姓名：" prop="customerName" size="mini">
                    <el-input v-model="form.customerName" placeholder="请输入姓名" style="width: 70%" />
                  </el-form-item>
                  <!--                  <el-form-item label="家庭编号：">-->
                  <!--                    <el-input placeholder="请输入家庭编号：" />-->
                  <!--                  </el-form-item>-->
                  <el-form-item label="生日">
                    <el-input v-model="form.birthday" style="width: 70%" />
                  </el-form-item>
                  <el-form-item label="国家/地区" prop="country">
                    <el-select v-model="form.country" filterable :value="form.country">
                      <el-option label="中国大陆" value="0" />
                      <el-option label="中国香港" value="1" />
                      <el-option label="中国澳门" value="2" />
                      <el-option label="中国台湾" value="3" />
                    </el-select>
                  </el-form-item>
                  <!--                  <el-form-item label="是否有小孩：">-->
                  <!--                    <el-select value="">-->
                  <!--                    </el-select>-->
                  <!--                  </el-form-item>-->
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别：">
                    <el-select v-model="form.customSex" filterable value="">
                      <el-option v-for="item in dict.type.sys_user_sex" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="年龄：">
                    <el-input v-model="form.customAge" style="width:70%" />
                  </el-form-item>
                  <!--                  <el-form-item label="体重：">-->
                  <!--                    <el-input style="width:70%" />-->
                  <!--                  </el-form-item>-->
                  <el-form-item label="收入水平：">
                    <el-select v-model="form.economicCapacity" filterable>
                      <el-option v-for="item in dict.type.economic_capacity" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!--<el-form-item label="血型：">-->
                  <!--  <el-input style="width:50%"></el-input>-->
                  <!--</el-form-item>-->
                  <el-form-item label="婚姻状况：">
                    <el-select v-model="form.marriageType" filterable>
                      <el-option v-for="item in dict.type.marital_status" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="职业：">
                    <el-select v-model="form.occupation" value="" filterable>
                      <el-option v-for="item in dict.type.occupation" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>

                  </el-form-item>
                  <!-- <el-form-item label="身高：">-->
                  <!--   <el-input style="width:50%"></el-input>-->
                  <!-- </el-form-item>-->
                </el-col>
              </el-row>
              <div>
                <el-form-item label="省/市/区" prop="province">
                  <!-- 省份 -->
                  <el-select v-model="form.province" filterable value="" style="margin-right: 10px">
                    <el-option v-for="(option, optionxIndex) in areaArr" :key="optionxIndex" :value="option.name"
                      :label="option.name" />
                  </el-select>
                  <!-- 市 -->
                  <el-select v-model="form.city" filterable value="" style="margin-right: 10px">
                    <el-option v-for="(option, optionIndex) in cityArr" :key="optionIndex" :value="option.name"
                      :label="option.name" />
                  </el-select>
                  <!-- 区 -->
                  <el-select filterable v-model="form.area" style="margin-right: 10px">
                    <el-option v-for="(options, optionsIndex) in districtArr" :key="optionsIndex" :value="options.name"
                      :label="options.name" />
                  </el-select>

                </el-form-item>
              </div>
              <el-row>
                <el-col :span="18">
                  <el-form-item label="身份证号：">
                    <el-input v-model="form.card" style="width: 50%" />
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="6">-->
                <!--                  <el-form-item label="收入水平：">-->
                <!--                    <el-select value="" v-model="form.economicCapacity">-->
                <!--                      <el-option v-for="item in dict.type.economic_capacity"-->
                <!--                                 :key="item.value"-->
                <!--                                 :label="item.label"-->
                <!--                                 :value="item.value">-->

                <!--                      </el-option>-->
                <!--                    </el-select>-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
              </el-row>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="9">
          <el-card class="one" style="height:320px">
            <span class="span">联系方式</span>
            <el-form size="mini" label-width="100px" :model="form" :rules="rules">
              <el-row type="flex" justify="space-between">
                <el-col>
                  <el-form-item label="电话：" prop="customPhone">
                    <el-input v-if="look" v-model="form.phone" style="width: 70%" disabled />
                    <el-input v-else v-model="form.customPhone" style="width: 70%" disabled />
                    <el-button size="mini" style="margin-left: 5px" @click="lookphone">显示</el-button>
                  </el-form-item>
                  <el-form-item label="邮箱：">
                    <el-input v-model="mailbox" />
                  </el-form-item>
                  <el-form-item label="微信号：">
                    <el-input v-model="form.wechat" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="联系方式：">
<!--                    <el-input v-model="form.refereePhone" />-->
                    <el-button type="text" size="mini" plain @click="getPhone">查看详情</el-button>
                  </el-form-item>
                  <el-form-item label="qq号：">
                    <el-input v-model="form.qq" />
                  </el-form-item>
                  <el-form-item label="交通工具：">
                    <el-select v-model="form.vehicle"  filterable value="" style="width: 100%">
                      <el-option v-for="item in dict.type.vehicle" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                  <!--                  <el-form-item label="邮编：">-->
                  <!--                    <el-input></el-input>-->
                  <!--                  </el-form-item>-->
                </el-col>
              </el-row>
              <el-form-item label="地址：">
                <el-input v-model="form.addr" type="textarea" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row type="flex" justify="space-between" style="margin-top:10px">
        <el-col :span="15" />
        <el-col :span="9">
          <el-card>
            <el-form size="mini" label-width="100px" :model="form" :rules="rules">
              <el-row type="flex" justify="space-between">
                <el-col>
                  <el-form-item label="建档人：">
                    {{ form.oudName }}
                  </el-form-item>
                  <el-form-item label="客户代表：">
                    {{ representative(form.customerRepresentative) }}
                  </el-form-item>
                  <el-form-item label="推荐人：">
                    {{ form.refereeName }}
                  </el-form-item>
                  <el-form-item label="媒介来源：" prop="channelTypeId">
                    <el-select v-model="form.channelTypeId" filterable value="" @change="channelTypeSelection" disabled>
                      <el-option v-for="(type, typeIndex) in channelType" :key="typeIndex + 'type'" :label="type.typeName"
                        :value="type.channelId ? type.channelId : type.typeId" />
                      <!--                      :value="type.typeId"-->
                      <!--                      :value="type.channelId ? type.channelId : type.typeId"-->
                    </el-select>
                    <el-select v-model="form.channelId" filterable value="" @change="channelSelection" disabled>
                      <el-option v-for="(type, typeChildIndex) in channelTypeChildren" :key="typeChildIndex + 'typeChild'"
                        :label="type.typeName" :value="type.channelId" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="建档时间：">
                    {{ form.createTime }}
                  </el-form-item>
                  <el-form-item label="美学顾问：">
                    {{ form.rdName }}
                  </el-form-item>
                  <el-form-item label="彼此关系：">
                    <el-select v-model="form.relation" filterable value="">
                      <el-option v-for="item in dict.type.mutual_relationship" :key="item.value" :value="item.value"
                        :label="item.label" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="回访备注：">
                <el-input v-model="form.reachRemarks" type="textarea" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="footer" type="flex" justify="end">
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button size="mini" icon="el-icon-search" :loading="submitLoading" type="primary"
          @click="addList">保存</el-button>
      </el-row>
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
  name: 'CustomerInformation',
  components: { SgDialog },
  dicts: ['sys_user_sex', 'marital_status', 'occupation', 'mutual_relationship', 'vehicle', 'economic_capacity'],
  data() {
    return {
      submitLoading: false,
      customerId: '', // 传递过来的id
      look: false,
      mailbox: "",
      form: {
        customerName: '', // 客户姓名
        refereePhone: '', // 联系方式2
        customSex: '',
        customAge: '', // 年龄
        birthday: '', // 生日
        country: '', // 国家
        province: '', // 省分
        city: '', // 市
        area: '', // 区
        card: '', // 身份证
        customPhone: '', // 顾客电话
        qq: '',
        wechat: '',
        vehicle: '', // 交通工具
        oudName: '', // 建档人
        createTime: '', // 建档时间
        customerRepresentative: '', // 客户代表
        refereeName: '', // 推荐人
        channelId: '', // 媒介
        channelTypeId: '', // 媒介类型
        returnNum: '', // 回访等级 不对
        relation: '', // 彼此关系
        reachRemarks: '', // 备注
        rdName: '', // 美学顾问
        occupation: '', // 职业
        marriageType: '', // 婚姻
        addr: '',
        economicCapacity: '' // 收入水平
      },
      sysUserList: [], // 系统用户列表
      cityArr: [],
      districtArr: [],
      // 地区信息
      areaArr: area.arrAll,
      // 来源渠道
      channelType: [],
      channelTypeChildren: [],
      rules: {
        customerName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        // customAge: [
        //   { required: true, message: '请选择年龄', trigger: 'blur' }
        // ],
        // customSex: [
        //   { type: 'date', required: true, message: '请选择性别', trigger: 'blur' }
        // ],
        country: [
          { type: 'date', required: true, message: '请选择国家', trigger: 'blur' }
        ],
        province: [
          { type: 'array', required: true, message: '请选择省市区', trigger: 'blur' }
        ],
        // birthday: [
        //   { required: true, message: '请选择', trigger: 'blur' }
        // ],
        customPhone: [
          { required: true, message: '电话不能为空', trigger: 'blur' }
        ]
      },
      showPhone: false,
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
      this.getUserList(val)
      this.getChannelInfo()
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
    this.channelType = []
    this.channelTypeChildren = []
    this.form.channelId = ''
    this.form.channelTypeId = ''
    this.id = this.$route.query.id
    this.customerId = this.$route.query.id // 传递过来的值
    this.getUserInfoById(this.customerId)
    this.getChannelInfo() // 媒介
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
  },
  methods: {
    // 查看电话
    getPhone(){
      this.phoneDetailDialog = true
      this.getPhonesByCustomerId()
    },
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
    lookphone() {
      this.look = !this.look
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 获取用户列表
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          // res.data.forEach(item => {
          //   item.label = item.nickName
          //   item.value = item.userId
          // })
          // if (data) {
          //   result(res.data)
          // }
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getUserInfoById(id) {
      this.$api.user.getUserInfoById(id).then((res) => {
        if (res) {
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
        }
      })
    },
    //  更新地址
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
      this.form.city = this.cityArr[0].name
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
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      if (data.length !== 0) {
        if (data[0].channelInfo !== undefined) {
          this.form.channelId = '';
          this.channelTypeChildren = data[0].channelInfo;
        }
      }
    },
    channelSelection(selection) {
      const data = this.channelTypeChildren.filter(filter => {
        return filter.deptChannelId === selection
      })
      // this.form.channelId = data[0].deptChannelId
      // this.form.channelName = ''
    },
    // 客户代表的字段
    representative(str) {
      const obj = this.sysUserList.find(item => { return item.userId === str })
      return obj ? obj.nickName : '未知'
    },
    addList() {
      this.submitLoading = true
      const data = {
        id: this.customerId,
        customerName: this.form.customerName,
        customSex: this.form.customSex,
        customAge: this.form.customAge,
        birthday: this.form.birthday,
        province: this.form.province,
        city: this.form.city,
        area: this.form.area,
        createTime: this.form.createTime,
        customerRepresentative: this.form.customerRepresentative,
        channelId: this.form.channelId,
        // this.$delete(this.form, 'customPhone'),
        refereePhone: this.form.refereePhone,
        customPhone: this.form.refereePhone,
        oudName: this.form.oudName,
        channelTypeId: this.form.channelTypeId,
        relation: this.form.relation,
        occupation: this.form.occupation,
        marriageType: this.form.marriageType,
        reachRemarks: this.form.reachRemarks,
        economicCapacity: this.form.economicCapacity,
        card: this.form.card,
        qq: this.form.qq,
        wechat: this.form.wechat,
        addr: this.form.addr
      }
      this.$api.user.updateUserInfo(data).then((res) => {
        if (res) {
          this.$message.success(res.msg)
          this.closeTag()
          this.submitLoading = false
          // this.$router.push('/MyReception')
        }
      })
    },
    close() {
      this.closeTag()
    }
  }

}
</script>

<style lang='scss'>
.box {
  padding: 20px;

  .one {
    border: 1px solid #7d7d7d;

    .span {
      position: absolute;
      background-color: #fff;
      margin-top: -30px;
    }
  }

  .footer {
    position: absolute;
    padding: 10px;
    bottom: 0;
    right: 0;
  }
}
</style>
