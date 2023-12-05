<template>
  <!-- 修改接诊信息 -->
  <div>
    <treatment :footrleft="{marginTop:'10px'}">
      <div slot="searchBar">
        <el-form
          size="mini"
          label-width="120px"
          :model="form"
          :rules="rules"
        >
          <el-row type="flex" justify="space-around">
            <el-col>
              <el-form-item label="姓名：" prop="customerName" style="width: 80%">
                <el-input v-model="form.customerName" />
              </el-form-item>
              <el-form-item label="年龄：" style="width: 80%">
                <el-input v-model="form.customAge" oninput="value=value.replace(/[^0-9]/g,'')" />
              </el-form-item>
              <el-form-item label="生日：">
                <el-date-picker
                  v-model="form.birthday"
                  style="width: 70%"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="电话：" prop="customPhone">
                <el-input v-model="form.customPhone" disabled style="width: 70%" />
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item label="分诊科室：" prop="departmentId">
                <el-select v-model="form.departmentId" filterable :disabled="list.receptionStatus === '1'">
                  <el-option
                    v-for="item in TriageDepartment"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="医生：">
                <el-select v-model="form.doctorId" filterable disabled>
                  <el-option
                    v-for="item in doctor"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="客户代表：">
                <el-select v-model="form.customerRepresentative" filterable>
                  <el-option
                    v-for="item in sysUserList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="性别：">
                <el-select v-model="form.customSex" filterable>
                  <el-option v-for="item in dict.type.sys_user_sex" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="媒介来源：" prop="channelTypeName">
                <!--                <el-select v-model="form.channelTypeName" @change="channelTypeSelection" disabled>-->
                <!--                  <el-option-->
                <!--                    v-for="(type,typeIndex) in channelType"-->
                <!--                    :key="typeIndex +'type'"-->
                <!--                    :label="type.typeName"-->
                <!--                    :value="type.typeId"-->
                <!--                  />-->
                <!--                </el-select>-->
                <el-select v-model="form.channelName" filterable disabled>
                  <el-option
                    v-for="(type,typeChildIndex) in channelTypeChildren"
                    :key="typeChildIndex+'typeChild'"
                    :label="type.typeName"
                    :value="type.channelId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="美学顾问：" prop="aestheticConsultant">
                <el-select v-model="form.aestheticConsultant"  filterable>
                  <el-option
                    v-for="item in esthetics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="客户意向描述：">
            <el-input v-model="form.intentionDescription" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="main">
        <el-form size="mini" label-width="130px">
          <el-row>
            <el-col>
              <el-form-item label="推荐人姓名：">
                <el-input v-model="form.refereeName" disabled />
              </el-form-item>
              <el-form-item label="推荐人电话/卡号：">
                <el-input v-model="form.refereePhone" disabled />
              </el-form-item>
              <el-form-item label="彼此关系：">
                <el-select v-model="form.relation" filterable>
                  <el-option v-for="item in dict.type.mutual_relationship" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="员工推荐人：">
                <el-input v-model="form.refereeuserName" disabled />
              </el-form-item>
              <el-form-item label="客户地址：">
                <el-input v-model="form.addr" type="textarea" />
              </el-form-item>
              <el-form-item label="分诊备注：">
                <el-input v-model="form.remark" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="bottom" class="bottom">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="editReception">保存</el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="colsePage">关闭</el-button>
      </div>
    </treatment>
  </div>
</template>

<script>
import treatment from '@/components/treatment'
import vm from '@/utils/util'

export default {
  dicts: ['sys_user_sex', 'mutual_relationship'],
  name: '',
  components: {
    treatment
  },
  data() {
    return {
      form: {
        id: '',
        customerName: '',
        customAge: '',
        birthday: '', // 生日
        customPhone: '',
        departmentId: '',
        doctorId: '',
        customerRepresentative: '',
        customSex: '',
        channelName: '',
        aestheticConsultant: '',
        intentionDescription: '',
        refereeName: '',
        refereePhone: '',
        relation: '',
        refereeuserName: '',
        addr: '',
        remark: '',
        jdxxId: ''
      },
      TriageDepartment: [],
      rules: {
        customerName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        aestheticConsultant: [
          { required: true, message: '请选择美学顾问', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ]
        // customerRepresentative: [
        //   { required: true, message: '请选择', trigger: 'blur' }
        // ]
      },
      id: 0,
      list: {},
      sysUserList: [], // 美学顾问
      esthetics: [],
      doctor: [],
      // 来源渠道
      channelType: [],
      channelTypeChildren: [] // 媒介
      // title: {
      //   label: '客户信息' + '[' + JSON.parse(this.$route.query.list).customCardNumber + ']',
      //   other: '其他信息' + '[接诊编号：' + JSON.parse(this.$route.query.list).receptionNumber + '接待人：' + JSON.parse(this.$route.query.list).crName + ']'
      // }
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
      this.Department()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.list = JSON.parse(this.$route.query.list)
    this.id = this.$route.query.id
    this.getUserList()
    this.getChannelInfo()
    this.Department()
    this.getData()
    // this.form
  },
  methods: {
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author 王发发
     * @date 2022/5/29
     * @Description: 获取用户列表
     */
    // 获取用户列表
    getUserList(data, result) {
      // 人员添加公司Id 添加状态
      this.$api.user.getUserList({
        deptId: this.deptId,
        data,
        status: '0'
      }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          if (data) {
            result(res.data)
          }
          // this.sysUserList = res.data
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
              this.sysUserList.push(item)
            }
          })
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
        }
      })
    },
    getData() {
      this.$api.dept.receptionInformationList(this.id).then(res => {
        if (res) {
          this.form.customerName = res.data.customerName
          this.form.customAge = res.data.customAge
          this.form.birthday = res.data.birthday
          this.form.customPhone = res.data.customPhone
          this.form.customerRepresentative = res.data.customerRepresentative === undefined || res.data.customerRepresentative === 0 ? '' : res.data.customerRepresentative
          this.form.customSex = res.data.customSex
          this.form.channelName = res.data.channelName
          this.form.refereeName = res.data.refereeName
          this.form.refereePhone = res.data.refereePhone
          this.form.relation = res.data.relation
          this.form.refereeuserName = res.data.refereeuserName
          this.form.addr = res.data.addr
          this.form.departmentId = this.list.departmentId
          this.form.doctorId = this.list.doctorId === undefined || this.list.doctorId === 0 ? '' : this.list.doctorId
          this.form.aestheticConsultant = this.list.aestheticConsultant === undefined || this.list.aestheticConsultant === 0 ? '' : this.list.aestheticConsultant
          this.form.remark = this.list.remark
          this.form.intentionDescription = this.list.intentionDescription
          this.form.jdxxId = this.list.jdxxId
        }
      })
    },
    // 获取科室的数据
    Department() {
      // 添加状态
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }, 'get').then((res) => {
        if (res) {
          this.TriageDepartment = res.rows
        }
      })
    },
    newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day}`
        },
    /**
     * @author 王发发
     * @date 2022/5/29
     * @Description: 点击保存的接口
     */
    editReception() {
      this.$api.user.updateUserInfo({
        id: this.id,
        customerName: this.form.customerName,
        customSex: this.form.customSex,
        customAge: this.form.customAge,
        birthday: this.form.birthday?this.newgetData(this.form.birthday):"",
        relation: this.form.relation,
        addr: this.form.addr
      }).then(res => {
        if (res) {
          this.$api.dept.editReceptiondata({
            id: this.id,
            jdxxId: this.list.jdxxId,
            aestheticConsultant: this.form.aestheticConsultant,
            customerRepresentative: this.form.customerRepresentative,
            departmentId: this.form.departmentId,
            intentionDescription: this.form.intentionDescription,
            remark: this.form.remark
          }).then((res) => {
            if (res) {
              this.$message.success(res.msg)
              this.closeTag()
            }
          })
        }
      })
    },
    /**
     * @author 王发发
     * @date 2022/5/29
     * @Description: 点击关闭
     */
    colsePage() {
      this.closeTag()
    },
    /**
     * @author 王发发
     * @date 2022/5/29
     * @Description: 获取渠道信息
     */
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
      // this.form.channelTypeName = data[0].typeName
      // this.form.channelId = ''
      // this.form.channelIdBack = undefined
      // this.form.channelName = undefined
      this.channelTypeChildren = data[0].channelInfo
    },
    channelSelection(selection) {
      this.channelTypeChildren.filter(filter => {
        return filter.channelId === selection
      })
      // this.form.channelId = data[0].typeId
      // this.form.channelId = data[0].deptChannelId
      // this.form.channelName = data[0].typeName
    }
  }
}
</script>

<style scoped lang="scss">
.jian li {
  list-style: none;
  margin: 5px;
  font-size: 14px;
}
.bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
}
</style>
