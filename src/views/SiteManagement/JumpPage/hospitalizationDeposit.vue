<template>
  <!-- 交住院押金 -->
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
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="right">
          <div class="titles">交住院押金</div>
          <el-form ref="form" :model="form" size="mini" label-width="150px" :rules="rules">
            <el-row type="flex" justify="space-between" class="row-top">
              <el-col>
                <el-form-item label="住院押金：" prop="amountPayable">
                  <el-input
                    v-model="form.amountPayable"
                    placeholder="请输入住院押金"
                    style="width: 200px"
                    @input="amountPayableInput"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-form-item v-if="billing.triageType !== 2" label="推荐人:" prop="secondRecommender">
                <el-select v-model="form.secondRecommender" clearable filterable :filter-method="handleFilter">
                  <el-option
                    v-for="item in sysUserList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="开单备注：">
                <el-input v-model="form.billingRemarks" readonly onfocus="this.removeAttribute('readonly');" type="textarea" />
              </el-form-item>
              <!--              <el-divider />-->
              <!--              <el-form-item label="客户账户信息:" />-->
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
      <span class="fontStyle">费用合计：<i>{{ form.totalExpenses === '' ? 0 : form.totalExpenses }}</i></span>&nbsp;&nbsp;
      <span class="fontStyle">应付款：<i>{{ form.paidAmount === '' ? 0 : form.paidAmount }}</i></span>&nbsp;&nbsp;
      <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoading" @click="submitCustomCard">保存</el-button>
      <el-button size="mini" type="danger" icon="el-icon-close" @click="out">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import vm from '@/utils/util'
import { math } from '@/utils/math'
import PinyinMatch from 'pinyin-match'

export default {
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
        billingRemarks: '', // 备注
        aestheticConsultant: '', // 美学顾问
        customerRepresentative: '', // 客户代表
        deptId: '', // 公司id
        departmentId: '', // 科室id
        dsingleUser: '', // 下单人
        giftAmount: '', // 赠送金额
        paidAmount: '', // 应付金额
        refereeuserId: '', // 推荐人id
        totalExpenses: '', // 总金额
        secondRecommender: null // 推荐人
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
        amountPayable: [
          { required: true, message: '请输入住院押金', trigger: 'blur' }
        ]
      },
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0,
      billing: {}
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
      // this.getUserRechargeCardInfo()
      this.getRechargeCardInfoList()
      this.getUserList(val)
    }
  },
  created() {
    // this.id = this.$route.query.id
    this.id=JSON.parse(sessionStorage.getItem('hospitalizationDeposititem')).id
    this.userInfo = this.$store.getters.user
    // 接收从父组件传回来的数据（父组件转换成String）
    this.billing = JSON.parse(JSON.parse(sessionStorage.getItem('hospitalizationDeposititem')).content)
    this.form = this.billing
    this.amountPayableInput()
    this.getCustomCardSum(this.billing)
    // 获取用户列表
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    // 获取个人充值卡信息
    // this.getUserRechargeCardInfo()
    // 获取储值卡信息
    this.getRechargeCardInfoList()
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
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 获取储值卡list
     */
    getRechargeCardInfoList() {
      this.loadingData = true
      // 添加状态
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
     * @date 2022/5/12
     * @Description: 计算费用合计
    */
    amountPayableInput() {
      this.form.totalExpenses = this.form.amountPayable
      this.form.paidAmount = this.form.amountPayable
    },
    /** 储值开卡提交*/
    submitCustomCard() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.orderId === undefined) {
            const data = {
              onlineUserId: this.billing.onlineUserId,
              aestheticConsultant: this.form.aestheticConsultant,
              customerRepresentative: this.form.customerRepresentative,
              deptId: this.deptId,
              departmentId: this.form.departmentId,
              billingDepartment: this.form.departmentId,
              dsingleUser: this.userInfo.userId,
              id: this.id,
              jdxxId: this.form.jdxxId,
              amountPayable: this.form.amountPayable,
              billType: '5',
              // rechargeCardType: '5',
              billingRemarks: this.form.billingRemarks,
              totalExpenses: this.form.totalExpenses,
              customerStatus: this.billing.customerStatus,
              isSecondary: this.billing.isSecondary,
              secondRecommender: this.form.secondRecommender
            }
            this.$api.billingList.addOrderInfo({
              'orderInfo': data
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.form = {
                  amountPayable: '',
                  secondRecommender: '',
                  billingRemarks: ''
                }
                this.closeTag()
              }
            })
          } else {
            const date = {
              onlineUserId: this.billing.onlineUserId,
              departmentType: this.form.departmentType,
              orderId: this.form.orderId,
              rechargeCardId: this.form.rechargeCardId,
              aestheticConsultant: this.form.aestheticConsultant,
              customerRepresentative: this.form.customerRepresentative,
              deptId: this.deptId,
              departmentId: this.form.departmentId,
              billingDepartment: this.form.departmentId,
              dsingleUser: this.userInfo.userId,
              id: this.id,
              jdxxId: this.form.jdxxId,
              amountPayable: this.form.amountPayable,
              billType: '5',
              orderNumber: this.billing.orderNumber,
              billingRemarks: this.form.billingRemarks,
              totalExpenses: this.form.totalExpenses,
              customerStatus: this.billing.customerStatus,
              isSecondary: this.billing.isSecondary,
              secondRecommender: this.form.secondRecommender
            }
            this.$api.billingList.editOrderInfo({
              'orderInfo': date,
              'removeIds': [],
              'orderDetailsList': []
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.form = {
                  amountPayable: '',
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
        amountPayable: '',
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
