<template>
  <!-- 补充客户信息 -->
  <div style="height: 94%">
    <div class="formBody">
      <div class="title">完善客户信息</div>
      <div>
        <el-row>
          <el-form ref="form" :model="formData" :rules="rules" size="mini" label-width="100px">
            <el-col :span="4">
              <el-form-item label="客户姓名" prop="customerName">
                <el-input
                  v-model="formData.customerName"
                  placeholder="请输入客户姓名"
                  clearable
                  :style="{width: '100%'}"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="电话" prop="customPhone">
                <el-input
                  v-model="formData.customPhone"
                  placeholder="请输入电话"
                  :disabled="true"
                  clearable
                  :style="{width: '100%'}"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="联系方式1" prop="customPhoneTow">
                <el-input
                  v-model="formData.customPhoneTow"
                  placeholder="请输入联系方式1"
                  clearable
                  :style="{width: '100%'}"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别" prop="customSex">
                <el-select v-model="formData.customSex" placeholder="请选择性别" filterable clearable :style="{width: '100%'}">
                  <el-option
                    v-for="(item, index) in dict.type.sys_user_sex"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="年龄" prop="customAge">
                <el-input v-model="formData.customAge" placeholder="请输入年龄" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="formData.birthday"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :style="{width: '100%'}"
                  placeholder="请选择生日"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="推荐人" prop="refereeName">
                <el-input v-model="formData.refereeName" placeholder="请输入推荐人" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="彼此关系" prop="relation">
                <el-select v-model="formData.relation" placeholder="请选择彼此关系" filterable clearable :style="{width: '100%'}">
                  <el-option
                    v-for="(item, index) in dict.type.mutual_relationship"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="身份证号码" prop="card">
                <el-input v-model="formData.card" placeholder="请输入身份证号码" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="婚姻状况" prop="marriageType">
                <el-select
                  v-model="formData.marriageType"
                  placeholder="请选择婚姻状况"
                  clearable filterable
                  :style="{width: '100%'}"
                >
                  <el-option
                    v-for="(item, index) in dict.type.marital_status"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="省份" >
                <el-select
                  v-model="formData.province"
                  placeholder="请选择省份"
                  clearable filterable
                  :style="{width: '100%'}"
                  @change="provinceChange"
                >
                  <el-option
                    v-for="(item, index) in province"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="市县" >
                <el-select
                  v-model="formData.city"
                  placeholder="请选择市县"
                  clearable filterable
                  :style="{width: '100%'}"
                  @change="cityChange"
                >
                  <el-option
                    v-for="(item, index) in city"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="区" >
                <el-select v-model="formData.area" placeholder="请选择区" filterable clearable :style="{width: '100%'}">
                  <el-option
                    v-for="(item, index) in area"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="详细地址" prop="addr">
                <el-input v-model="formData.addr" placeholder="请输入详细地址" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="生育情况" prop="fertility">
                <el-input v-model="formData.fertility" placeholder="请输入生育情况" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职业" prop="occupation">
                <el-select v-model="formData.occupation" placeholder="请选择职业" filterable clearable :style="{width: '100%'}">
                  <el-option
                    v-for="(item, index) in dict.type.occupation"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="经济能力" prop="economicCapacity">
                <el-select
                  v-model="formData.economicCapacity"
                  placeholder="请选择经济能力"
                  clearable filterable
                  :style="{width: '100%'}"
                >
                  <el-option
                    v-for="(item, index) in dict.type.economic_capacity"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="formData.qq" placeholder="请输入QQ" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="微信" prop="wechat">
                <el-input v-model="formData.wechat" placeholder="请输入微信" clearable :style="{width: '100%'}" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="客户代表" prop="customerRepresentative">
                <el-select
                  v-model="formData.customerRepresentative"
                  placeholder="请选择客户代表"
                  clearable filterable
                  :disabled="true"
                  :style="{width: '100%'}"
                >
                  <el-option
                    v-for="(item, index) in customerRepresentativeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="美学顾问" prop="receptionId">
                <el-select
                  v-model="formData.receptionId"
                  placeholder="请选择美学顾问"
                  :disabled="true"
                  clearable filterable
                  :style="{width: '100%'}"
                >
                  <el-option
                    v-for="(item, index) in receptionIdOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="建档人" prop="createuserId">
                <el-select
                  v-model="formData.createuserId"
                  placeholder="请选择建档人"
                  clearable filterable
                  :style="{width: '100%'}"
                  :disabled="true"
                >
                  <el-option
                    v-for="(item, index) in createuserIdOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="建档时间" prop="createTime">
                <el-date-picker
                  v-model="formData.createTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :style="{width: '100%'}"
                  placeholder="请选择建档时间"
                  :disabled="true"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!--<el-form-item label="回访等级" prop="field134">-->
              <!--  <el-select v-model="formData.grade" placeholder="请选择回访等级" clearable :style="{width: '100%'}">-->
              <!--    <el-option-->
              <!--      v-for="(item, index) in dict.type.grade"-->
              <!--      :key="index"-->
              <!--      :label="item.label"-->
              <!--      :value="item.value"-->
              <!--      :disabled="item.disabled"-->
              <!--    />-->
              <!--  </el-select>-->
              <!--</el-form-item>-->
            </el-col>
            <el-col :span="5">
              <el-form-item label="媒介" prop="channel">
                <el-cascader
                  v-model="formData.channel"
                  style="width: 100%;"
                  :filterable="true"
                  :clearable="true"
                  :options="channelOptions"
                  :props="{ expandTrigger: 'hover'}"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="交通工具" prop="vehicle">
                <el-select v-model="formData.vehicle" placeholder="请选择交通工具" filterable clearable :style="{width: '100%'}">
                  <el-option
                    v-for="(item, index) in dict.type.vehicle"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="咨询备注" prop="remarks">
                    <el-input
                      v-model="formData.remarks"
                      type="textarea"
                      placeholder="请输入咨询备注"
                      :autosize="{minRows: 4, maxRows: 4}"
                      :style="{width: '100%'}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
    <div class="foot">
      <div style="float: right">
        <el-button type="primary" :plain="true" size="mini" @click="submitForm">保存</el-button>
        <el-button type="danger" :plain="true" size="mini" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import area from '@/utils/area'
import vm from '@/utils/util'

export default {
  name: 'ImproveCustomerInformation',
  dicts: ['marital_status', 'sys_user_sex', 'economic_capacity', 'grade', 'occupation', 'whether', 'vehicle', 'mutual_relationship'],
  components: {},
  data() {
    return {
      formData: {
        customerName: undefined,
        customPhone: undefined,
        customPhoneTow: undefined,
        customSex: undefined,
        customAge: undefined,
        birthday: '',
        refereeName: undefined,
        relation: undefined,
        card: undefined,
        marriageType: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        addr: undefined,
        fertility: undefined,
        occupation: undefined,
        economicCapacity: undefined,
        qq: undefined,
        wechat: undefined,
        customerRepresentative: undefined,
        receptionId: undefined,
        createuserId: undefined,
        createTime: null,
        channel: undefined,
        vehicle: undefined,
        remarks: undefined
      },
      rules: {
        customerName: [{
          required: true,
          message: '请输入客户姓名',
          trigger: 'blur'
        }],
        customSex: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        customAge: [{
          required: true,
          message: '请输入年龄',
          trigger: 'blur'
        }],
        // province: [{
        //   required: true,
        //   message: '请选择省份',
        //   trigger: 'change'
        // }],
        // city: [{
        //   required: true,
        //   message: '请选择市县',
        //   trigger: 'change'
        // }],
        // area: [{
        //   required: true,
        //   message: '请选择区',
        //   trigger: 'change'
        // }],
        // 先不严重客户代表
        // customerRepresentative: [{
        //   required: true,
        //   message: '请选择客户代表',
        //   trigger: 'change'
        // }],
        receptionId: [{
          required: true,
          message: '请选择美学顾问',
          trigger: 'change'
        }],
        createuserId: [{
          required: true,
          message: '请选择建档人',
          trigger: 'change'
        }],
        createTime: [{
          required: true,
          message: '请选择建档时间',
          trigger: 'change'
        }],
        channel: [{
          required: true,
          message: '请选择媒介来源',
          trigger: 'change'
        }]
      },
      // 省市县
      province: [],
      city: [],
      area: [],
      // 客户代表、接待人、创建人
      customerRepresentativeOptions: [],
      receptionIdOptions: [],
      createuserIdOptions: [],
      // 媒介来源
      channelTypes: [],
      channels: [],
      channelOptions: [],
      // 地区
      areaArr: area.arrAll, // 省
      cityArr: [], // 市
      districtArr: [] // 区
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
    },
    nickName: {
      get() {
        return this.$store.getters.user.nickName
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.customerId = this.$route.query.customerId
    this.getChannelTree()
    this.getUserList()
    this.getCustomerInfo()
    // 设置省份
    this.areaArr.forEach(item => {
      item.value = item.name
      item.label = item.name
    })
    this.province = this.areaArr
    // 设置城市
    // for (const item of this.province) {
    //   // console.log(this.formData.province)
    //   if (this.formData.province === item.name) {
    //     item.sub.forEach(item1 => {
    //       item1.label = item1.name
    //       item1.value = item1.name
    //     })
    //     this.city = item.sub
    //   }
    // }
  },
  methods: {
    // 省份改变
    provinceChange() {
      // 如果省份为空 将市清空
      if (this.formData.province === '') {
        this.city = []
        this.formData.city = ''
        return
      }
      // 循环省份里面数据，判断省是否对应，拿到下面的市区
      const obj = this.formData.province
      for (const item of this.areaArr) {
        if (obj === item.name) {
          item.sub.forEach(item1 => {
            item1.label = item1.name
            item1.value = item1.name
          })
          this.city = item.sub
          this.formData.city = ''
        }
      }
    },
    // 市改变
    cityChange() {
      // 如果市区为空 将区清空
      if (this.formData.city === '') {
        this.area = []
        this.formData.area = ''
        return
      }
      // 循环市里面数据，判断市是否对应的区
      const obj = this.formData.city
      for (const item2 of this.city) {
        if (obj === item2.name) {
          item2.sub.forEach(item2 => {
            item2.label = item2.name
            item2.value = item2.name
          })
          this.area = item2.sub
        }
      }
    },
    // 获取客户信息
    getCustomerInfo() {
      this.$api.customerCmt.getInfoById(this.customerId).then(res => {
        console.log(res)
        this.formData = res.data
        if (res.data.channelTypeId) {
          this.formData.channel = [res.data.channelTypeId, res.data.channelId]
        }
        this.formData.occupation = this.formData.occupation > 0 ? this.formData.occupation : null
        this.formData.customerRepresentative = this.formData.customerRepresentative > 0 ? this.formData.customerRepresentative : null
      })
    },
    // 获取媒介类型树结构
    getChannelTree() {
      this.$api.channel.noPageTypeList({ pageSize: 1000 }).then(res => {
        this.channelTypes = res.rows
      }).then(() => {
        this.$api.channel.noPageList({ pageSize: 1000 }).then(res => {
          this.channels = res.rows
        }).then(() => {
          // 遍历
          this.channelTypes.forEach(item => {
            // console.log('进入遍历')
            const channelType = {
              value: item.typeId,
              label: item.typeName,
              children: []
            }
            this.channels.forEach(channel => {
              if (channel.typeId === item.typeId) {
                channelType.children.push({
                  value: channel.channelId,
                  label: channel.channelName
                })
              }
            })
            this.channelOptions.push(channelType)
          })
        })
      })
    },
    // 获取员工列表
    getUserList(deptId) {
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
          // ---------岗位------
          this.createuserIdOptions = res.data
          this.receptionIdOptions = res.data
          this.customerRepresentativeOptions = res.data
        }
      })
    },
    // 去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 不修改电话
          this.formData.customPhone = null
          if (this.formData.channel) {
            this.formData.channelTypeId = this.formData.channel[0]
            this.formData.channelId = this.formData.channel[1]
          }
          this.$api.customerCmt.editCustomerCmt(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              // 添加修改记录
              const recordList = []
              recordList.push({
                id: this.customerId,
                changeField: '修改客户信息',
                changerBefore: '',
                changerAfter: '',
                operatorName: this.nickName,
                changerRemark: '修改客户信息'
              })
              this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
                this.mediumForm = {}
                this.mediaModification = false
              })
            } else {
              this.$message.error(res.msg)
            }
          }).finally(() => {
            this.closeTag()
          })
        }
      })
    },
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    close() {
      this.$refs['form'].resetFields()
    }
  }
}

</script>
<style scoped lang="scss">
.formBody {
  width: 98%;
  height: calc(100% - 30px);
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 10px 15px 10px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 20px;

  .title {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.foot {
  height: 30px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
