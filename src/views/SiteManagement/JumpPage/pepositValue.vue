<template>
  <!-- 交储值 -->
  <div class="box">
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
                <el-form-item label="请选择储值金额：" prop="rechargeCardId">
                  <el-select
                    v-model="form.rechargeCardId"
                    placeholder="请选择" filterable
                    @change="selectData"
                  >
                    <el-option
                      v-for="(item,index) in rechargeableCard"
                      :key="index"
                      :label="'本金:'+item.rechargeAmount+'--'+'赠金:'+item.giftAmount"
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
              <el-form-item v-if="billing.triageType !== 2" label="推荐人:" prop="secondRecommender">
                <el-select v-model="form.secondRecommender" filterable clearable :filter-method="handleFilter" >
                  <el-option
                    v-for="(item,index) in sysUserList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="开单备注：">
                <el-input v-model="form.billingRemarks" readonly onfocus="this.removeAttribute('readonly');" type="textarea" />
              </el-form-item>
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
import { math } from '@/utils/math.js'
import vm from '@/utils/util'
import PinyinMatch from 'pinyin-match'

export default {
  data() {
    return {
      loadingData: false,
      submitLoading: false, // 保存点击后无法选择
      form: {
        rechargeCardType: '1', // 储值类型
        customerName: '', // 姓名
        customPhone: '', // 电话
        doctorName: '', // 医生姓名
        rechargeCardId: '', // 充值卡id
        billingRemarks: '', // 备注
        aestheticConsultant: '', // 美学顾问
        customerRepresentative: '', // 客户代表
        deptId: '', // 公司id
        departmentId: '', // 科室id
        dsingleUser: '', // 下单人
        giftAmount: '', // 赠送金额
        paidAmount: '', // 应付金额
        rechargeAmount: '', // 充值金额
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
      sysUserList: [],
      copySysUserList: [],
      rules: {
        rechargeCardId: [
          { required: true, message: '请选择储值卡', trigger: 'change' }
        ]
      },
      billing: {},
      removeIds: [],
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
    // 监听部门ID deptId
    deptId(val) {
      this.deptId = val
      // this.getUserRechargeCardInfo()
      this.getRechargeCardInfoList()
      this.getUserList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    // this.id = this.$route.query.id
    this.id = JSON.parse(sessionStorage.getItem('pepositValueitem')).id
    this.userInfo = this.$store.getters.user
    // 接收从父组件传回来的数据（父组件转换成String）
    // this.billType = this.$route.query.billType
    this.billType = JSON.parse(sessionStorage.getItem('pepositValueitem')).billType
    // this.billing = JSON.parse(this.$route.query.content)
    let list=JSON.parse(JSON.parse(sessionStorage.getItem('pepositValueitem')).content)
    this.billing=list
    console.log(this.billing,'this.billing')
    this.form = this.billing
    if (this.billing.rechargeCardId !== undefined) {
      this.form.rechargeAmount = this.billing.amountPayable
      this.form.paidAmount = this.billing.amountPayable
      this.form.totaAmount = this.billing.totalExpenses
      this.form.giftAmount = math.subtract(this.billing.totalExpenses, this.billing.amountPayable)
    }
    this.getCustomCardSum()
    // 获取用户列表
    this.getUserList(this.deptId)
    // 获取个人充值卡信息
    // this.getUserRechargeCardInfo()
    // 获取储值卡信息
    this.getRechargeCardInfoList()
    // this.calculation()
    if (this.billType !== undefined) {
      this.getOrderDetails()
    }
  },
  methods: {
    handleFilter(val) {
      if (val) {
        this.sysUserList = this.copySysUserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.sysUserList = this.copySysUserList
      }
    },
    /**
      * @author 李尚
      * @date 16/5/2022
      * @Description: 计算费用合计
    */
    // calculation() {
    //   this.form.totaAmount = math.add(this.form.rechargeAmount, this.form.giftAmount)
    // },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /** 获取个人储值开卡信息*/
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 获取储值卡list
    */
    getRechargeCardInfoList() {
      this.loadingData = true
      this.$api.RechargeableCard.groupRechargeList({ status: '0' }).then(res => {
        if (res) {
          this.rechargeableCard = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description: 获取订单详情
     */
    getOrderDetails() {
      this.$api.RechargeableCard.customCardlist({
        orderNumber: this.billing.orderNumber
      }).then(res => {
        if (res) {
          this.form.rechargeCardId = res.rows[0].rechargeCardId
          this.form.rechargeAmount = res.rows[0].amountPayable
          this.form.giftAmount = res.rows[0].giftAmount
          this.form.paidAmount = res.rows[0].amountPayable
          this.form.totaAmount = math.add(this.form.rechargeAmount, this.form.giftAmount)
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 选择储值卡
    */
    selectData(e) {
      this.rechargeableCard.forEach(item => {
        if (item.rechargeCardId === e) {
          this.form.rechargeAmount = item.rechargeAmount
          this.form.giftAmount = item.giftAmount
          this.form.paidAmount = item.rechargeAmount
        }
      })
      this.form.totaAmount = math.add(this.form.rechargeAmount, this.form.giftAmount)
    },
    /** 储值开卡提交*/
    submitCustomCard() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true // 保存点击后无法选择
          if (this.form.billType !== undefined) {
            const data = {
              onlineUserId: this.billing.onlineUserId,
              aestheticConsultant: this.form.aestheticConsultant,
              customerRepresentative: this.form.customerRepresentative,
              deptId: this.deptId,
              dsingleUser: this.userInfo.userId,
              giftAmount: this.form.giftAmount,
              id: this.id,
              jdxxId: this.form.jdxxId,
              rechargeCardType: '3',
              amountPayable: this.form.rechargeAmount,
              rechargeCardId: this.form.rechargeCardId,
              billType: this.billType,
              billingRemarks: this.form.billingRemarks,
              totalExpenses: this.form.totaAmount,
              orderId: this.billing.orderId,
              orderNumber: this.billing.orderNumber,
              customerStatus: this.billing.customerStatus,
              isSecondary: this.billing.isSecondary,
              secondRecommender: this.form.secondRecommender,
              projectName: ''
            }
            const orderDetailsList = [{
              onlineUserId: this.billing.onlineUserId,
              aestheticConsultant: this.form.aestheticConsultant,
              itemId: this.form.rechargeCardId,
              orderNumber: this.billing.orderNumber,
              discountAmount: this.form.rechargeAmount,
              secondRecommender: this.form.secondRecommender

            }]
            this.rechargeableCard.forEach(item => {
              if (item.rechargeCardId == this.form.rechargeCardId) {
                data.projectName = '本金:' + item.rechargeAmount + '--' + '赠金:' + item.giftAmount
              }
            })
            this.$api.billingList.editOrderInfo({
              'orderInfo': data,
              'removeIds': [],
              'orderDetailsList': orderDetailsList
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.form = {
                  rechargeCardId: '',
                  secondRecommender: '',
                  billingRemarks: ''
                }
                this.closeTag()
              }
            })
          } else {
            const data = {
              onlineUserId: this.billing.onlineUserId,
              aestheticConsultant: this.form.aestheticConsultant,
              customerRepresentative: this.form.customerRepresentative,
              deptId: this.deptId,
              dsingleUser: this.userInfo.userId,
              giftAmount: this.form.giftAmount,
              id: this.id,
              jdxxId: this.form.jdxxId,
              rechargeCardType: '3',
              amountPayable: this.form.rechargeAmount,
              rechargeCardId: this.form.rechargeCardId,
              refereeuserId: this.form.refereeuserId,
              billType: '3',
              billingRemarks: this.form.billingRemarks,
              totalExpenses: this.form.totaAmount,
              customerStatus: this.billing.customerStatus,
              isSecondary: this.billing.isSecondary,
              secondRecommender: this.form.secondRecommender,
              projectName: ''
            }
            this.rechargeableCard.forEach(item => {
              if (item.rechargeCardId == this.form.rechargeCardId) {
                data.projectName = '本金:' + item.rechargeAmount + '--' + '赠金:' + item.giftAmount
              }
            })

            this.$api.billingList.addOrderInfo({
              'orderInfo': data
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.form = {
                  rechargeCardId: '',
                  secondRecommender: '',
                  billingRemarks: ''
                }
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
    getCustomCardSum() {
      this.$api.RechargeableCard.customCardSum({
        id: this.billing.id
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
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: deptId,
        status: '0',
        departmentId: this.billing.departmentId
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          this.copySysUserList = this.sysUserList
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
      this.form = {
        rechargeCardId: '',
        secondRecommender: '',
        billingRemarks: ''
      }
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
