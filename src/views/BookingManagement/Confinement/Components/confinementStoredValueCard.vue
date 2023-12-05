<!--页面 样式 -->
<!--4 25-->
<!--李-->
<template>
  <!--  开单管理(公司) -&#45;&#45; 储值开卡-->
  <div    class="box">
    <el-row>
      <el-col :span="8">
        <div class="leftto">
          <div class="title">个人账户信息</div>
          <div class="left">
            <ul class="detailsName">
              <li class="name" @click="details">{{ form.customerName }}</li>
              <li>{{ form.customPhone }}</li>
              <li>__</li>
              <li>储值总额：{{ totalStoredValue }}</li>
              <li>储值本金：{{ storedValuePrincipal }}</li>
              <li>储值赠送：{{ storedValueGift }}</li>
              <li>预约金：{{ advancePayment }}</li>
              <li>住院押金：{{ deposit }}</li>
              <li>欠款金额：<span class="fontStyle">0.00</span></li>
              <li>__</li>
              <li>医生：{{ form.doctorName }}</li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="right">
          <div class="titles">个人充值信息</div>
          <el-form ref="form" :model="form" size="mini" label-width="150px" :rules="rules">
            <el-row type="flex" justify="space-between" class="row-top">
              <el-col>
                <el-form-item label="请选择储值类型：" prop="rechargeCardType">
                  <el-radio-group v-model="form.rechargeCardType" @change="rechargeableCardChange">
                    <el-radio v-for="item in dict.type.recharge_card_type" :key="item.value" :label="item.value">
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="请选择储值卡：" prop="rechargeCardId">
                  <el-select
                    v-model="form.rechargeCardId"
                    placeholder="请选择"
                    @change="selectData"
                    filterable
                  >
                    <el-option
                      v-for="item in rechargeableCard"
                      :key="item.rechargeCardId"
                      :label="item.rechargeCardName"
                      :value="item.rechargeCardId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <span>储值金额：</span><span class="fontStyle">{{ form.rechargeAmount === '' ? 0 : form.rechargeAmount }}</span> &nbsp;&nbsp;
                <span>赠送金额：</span><span class="fontStyle">{{ form.giftAmount === '' ? 0 : form.giftAmount }}</span>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-form-item label="全院储值：">
                <i>0.00
                  &nbsp;&nbsp;</i><span>(总金额)</span>【<i>0.00&nbsp;&nbsp;</i><span>(本金)</span><i>0.00&nbsp;&nbsp;</i><span>(赠送)</span>】
              </el-form-item>
              <el-form-item label="推荐人：" prop="userId">
                <el-select
                  v-model="form.refereeuserId"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in UserList"
                    :key="index"
                    :label="item.nickName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="开单备注：">
                <el-input v-model="form.remark" type="textarea" />
              </el-form-item>
              <el-divider />
              <el-form-item label="客户储值卡列表:" />
              <!--              <el-table :data="tableData">-->
              <!--                <el-table-column-->
              <!--                    prop="date"-->
              <!--                    label="公司">-->
              <!--                </el-table-column>-->
              <!--                <el-table-column-->
              <!--                    prop="date"-->
              <!--                    label="科室">-->
              <!--                </el-table-column>-->
              <!--                <el-table-column-->
              <!--                    prop="date"-->
              <!--                    label="储值卡名称">-->
              <!--                </el-table-column>-->
              <!--              </el-table>-->
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end" class="footer">
      <span>科室：{{ form.departmentName }}</span>&nbsp;&nbsp;
      <span>美学顾问：{{ form.acName }}</span>&nbsp;&nbsp;
      <span>客户代表：{{ form.crName }}</span>&nbsp;&nbsp;
      <span>下单人：{{ userInfo.nickName }}</span>&nbsp;&nbsp;
      <span class="fontStyle">费用合计：<i>{{ form.totaAmount === '' ? 0 : form.totaAmount }}</i></span>&nbsp;&nbsp;
      <span class="fontStyle">应付款：<i>{{ form.paidAmount === '' ? 0 : form.paidAmount }}</i></span>&nbsp;&nbsp;
      <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="submitCustomCard">保存</el-button>
      <el-button size="mini" type="danger" icon="el-icon-close" @click="out">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import vm from '@/utils/util'
import { math } from '@/utils/math.js'

export default {
  dicts: ['recharge_card_type'],
  data() {
    return {
      submitLoading: false,
      loadingData: false,
      form: {
        rechargeCardType: '1', // 储值类型
        customerName: '', // 姓名
        customPhone: '', // 电话
        doctorName: '', // 医生姓名
        rechargeCardId: '', // 充值卡id
        remark: '', // 备注
        aestheticConsultant: '', // 美学顾问
        customerRepresentative: '', // 客户代表
        deptId: '', // 公司id
        departmentId: '', // 科室id
        dsingleUser: '', // 下单人
        giftAmount: '', // 赠送金额
        paidAmount: '', // 应付金额
        rechargeAmount: '', // 充值金额
        refereeuserId: '', // 推荐人id
        totaAmount: '' // 总金额
      },
      tableData: [],
      // 从父组件拿到的客户ID
      id: 0,
      // 充值卡
      rechargeableCard: [],
      // 当前登录用户信息
      userInfo: [],
      // 所有用户
      UserList: [],
      rules: {
        rechargeCardId: [
          { required: true, message: '请选择储值卡', trigger: 'change' }
        ]
      },
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0
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
    // 监听公司ID deptId
    deptId(val) {
      this.deptId = val
      this.getUserList(val)
      // this.getUserRechargeCardInfo()
      this.getRechargeCardInfoList()
    },
    // 监听储值卡类型变化
    'form.rechargeCardType'() {
      this.getRechargeCardInfoList()
    }
  },
  created() {
    this.id = this.$route.query.id
    this.userInfo = this.$store.getters.user
    // 接收从父组件传回来的数据（父组件转换成String）
    const content = JSON.parse(this.$route.query.content)
    this.form.customerName = content.customerName
    this.form.jdxxId = content.jdxxId
    this.form.customPhone = content.customPhone
    this.form.doctorName = content.doctorName
    this.form.departmentId = content.departmentId
    this.form.departmentName = content.departmentName
    this.form.acName = content.acName
    this.form.aestheticConsultant = content.aestheticConsultant
    this.form.crName = content.crName
    this.form.customerRepresentative = content.customerRepresentative
    this.getCustomCardSum(content)
    // 获取用户列表
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    // 获取个人充值卡信息
    // this.getUserRechargeCardInfo()
    // 获取储值卡信息
    this.getRechargeCardInfoList()
  },
  methods: {
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /** 获取个人储值开卡信息*/
    // getUserRechargeCardInfo() {
    //   this.loadingData = true
    //   this.$api.RechargeableCard.customCardlist({
    //     id: this.id,
    //     deptId: this.deptId,
    //     departmentId: this.form.departmentId
    //   }).then(res => {
    //   }).finally(() => {
    //     this.loadingData = false
    //   })
    // },
    /**
     * @author Nevin
     * @date 2022/6/10
     * @Description: 储值类型改变
    */
    rechargeableCardChange() {
      this.form.rechargeCardId = ''
      this.form.rechargeAmount = 0
      this.form.giftAmount = 0
      this.form.totaAmount = 0
      this.form.paidAmount = 0
    },
    /** 获取储值卡list*/
    getRechargeCardInfoList() {
      // 判断储值类型，根据不同类型向接口传递不同参数
      if (this.form.rechargeCardType === '1') {
        this.$api.RechargeableCard.rechargeCardInfolist({
          deptId: this.deptId,
          departmentId: this.form.departmentId,
          rechargeCardType: this.form.rechargeCardType,
          status: '0' // 添加状态
        }).then(res => {
          if (res) {
            this.rechargeableCard = res.rows
          }
        })
      } else if (this.form.rechargeCardType === '2') {
        this.$api.RechargeableCard.rechargeCardInfolist({
          deptId: this.deptId,
          rechargeCardType: this.form.rechargeCardType,
          status: '0' // 添加状态
        }).then(res => {
          if (res) {
            this.rechargeableCard = res.rows
          }
        })
      }
    },
    /** 选择储值卡*/
    selectData(e) {
      this.rechargeableCard.forEach(item => {
        if (item.rechargeCardId === e) {
          this.form.rechargeAmount = item.rechargeAmount
          this.form.giftAmount = item.giftAmount
          this.form.totaAmount = math.add(item.rechargeAmount, item.giftAmount)
          this.form.paidAmount = item.rechargeAmount
        }
      })
    },
    /** 储值开卡提交*/
    submitCustomCard() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 判断储值类型，传递不同参数
          if (this.form.rechargeCardType === '1') {
            // rechargeCardType为1时传科室id
            const data = {
              aestheticConsultant: this.form.aestheticConsultant,
              customerRepresentative: this.form.customerRepresentative,
              departmentId: this.form.departmentId,
              deptId: this.deptId,
              dsingleUser: this.userInfo.userId,
              giftAmount: this.form.giftAmount,
              id: this.id,
              jdxxId: this.form.jdxxId,
              rechargeCardType: this.form.rechargeCardType,
              amountPayable: this.form.rechargeAmount,
              rechargeCardId: this.form.rechargeCardId,
              refereeuserId: this.form.refereeuserId,
              billType: '4',
              billingRemarks: this.form.remark,
              totalExpenses: this.form.totaAmount
            }
            this.$api.billingList.addOrderInfo({
              'orderInfo': data
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          } else if (this.form.rechargeCardType === '2') {
            // rechargeCardType为2时只传公司id
            const data = {
              aestheticConsultant: this.form.aestheticConsultant,
              customerRepresentative: this.form.customerRepresentative,
              deptId: this.deptId,
              dsingleUser: this.userInfo.userId,
              giftAmount: this.form.giftAmount,
              id: this.id,
              jdxxId: this.form.jdxxId,
              rechargeCardType: this.form.rechargeCardType,
              amountPayable: this.form.rechargeAmount,
              rechargeCardId: this.form.rechargeCardId,
              refereeuserId: this.form.refereeuserId,
              billType: '4',
              billingRemarks: this.form.remark,
              totalExpenses: this.form.totaAmount
            }
            this.$api.billingList.addOrderInfo({
              'orderInfo': data
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 个人账户信息
     */
    getCustomCardSum(data) {
      this.$api.RechargeableCard.customCardSum({
        id: data.id
      }).then(res => {
        if (res.rows.length !== 0) {
          this.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
            res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
          this.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal, res.rows[0].departmentalPrincipal)
          this.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
          this.deposit = res.rows[0].deposit
          this.advancePayment = res.rows[0].advancePayment
        }
      })
    },
    /** 获取用户*/
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
        // 去重
          const arr1 = this.unique(res.data)
          this.UserList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /** 用户姓名点击*/
    details() {
      this.$router.push({ path: 'customerInfo', query: { id: this.$route.query.id }})
    },
    /** 关闭按钮*/
    out() {
      this.closeTag()
    }
  }
}
</script>

<style lang="scss" scoped>
.leftto {
  margin-right: 20px;
  padding: 15px;
  padding-top: 20px;
  border: 1px solid #c6c6c6;
  border-radius: 10px;

  .title {
    position: absolute;
    top: -9px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.right {
  margin-left: 20px;
  padding: 40px;
  padding-top: 44px;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  position: relative;

  .titles {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.box {
  padding: 20px;

  .left {
    padding: 5px;

    .detailsName {
      font-size: 13px;
    }

    .name {
      cursor: pointer;
      font-size: 16px;
      color: #1abc9c;
    }

    margin-left: 20px;
    border-left: 5px solid #1abc9c;

    & > ul li {
      margin: 20px 10px 10px 20px;
      list-style: none;
    }
  }

  .row-top {
    & span {
      font-size: 18px;
    }
  }

  .row {
    & span {
      font-size: 6px;
    }

    & i {
      font-size: 16px;
    }
  }

  .fontStyle {
    color: red;
  }

  .footer {
    position: fixed;
    align-items: center;
    bottom: 0;
    right: 0;
    padding: 20px;

    & > span {
      font-size: 14px;
    }
  }
}
</style>
