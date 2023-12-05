<template>
  <!--退储值-->
  <el-scrollbar>
    <div class="management">
      <div style="padding: 6px 40px">
        <div class="formBody">
          <div class="itemment">退储值
            <span class="mentem"> [ 客户：{{ data.customerName }} <em> {{ getTime }} </em> ] </span>
          </div>
          <el-form ref="form" size="mini" style="margin-top:10px;padding-left: 35px" :rules="rules" :model="formInline">
            <el-row>
              <el-col :span="8">
                <el-form-item label="下单人:" prop="dsingleUser">
                  <el-select v-model="formInline.dsingleUser" filterable disabled>
                    <el-option
                      v-for="(item, index) in sysUserList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退款原因:" prop="reasonForRefund">
                  <el-select v-model="formInline.reasonForRefund" filterable>
                    <el-option v-for="item in dict.type.refund_reason" :key="item.value" :value="item.value" :label="item.label" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="备注：" prop="billingRemarks">
                <el-input v-model="formInline.billingRemarks" type="textarea" style="width: 60%" />
                <span>(备注结账方式：如现金xxx元，退回储值xxx元)</span>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        <div class="formBody" style="min-height: 520px">
          <div class="itemment"><span>收费单明细信息</span></div>
          <div class="titme">
            <span style="font-size: 14px;text-align: center">客户账户信息：欠款金额：0.00；预约金：{{ advancePayment }}；住院押金：{{ deposit }}；储值总额：{{ totalStoredValue }}；[ 储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]</span>
          </div>
          <el-table
            :data="tableData"
            border
            size="mini"
            style="width: 100%"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column prop="orderNumber" label="原收费单号" />
            <el-table-column prop="createTime" label="结账时间" />
            <el-table-column prop="amountPayable" label="实付金额" />
            <el-table-column prop="amountPayable" label="储值现金" />
            <el-table-column prop="giftAmount" label="储值赠送" />
            <el-table-column prop="payableSurplus" label="剩余本金" />
            <el-table-column prop="giftSurplus" label="剩余赠送" />
            <el-table-column fixed="right" label="当次退款金额（退储值只能全退）" width="220" header-cell-style="{color: #ff0000}">
              <template slot="header">
                <span style="color:red">当次退款金额（退储值只能全退）</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.refundAmount" disabled size="mini" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
        <div class="content">
          <span>客户代表: {{ data.crName }}</span>
          &nbsp;
          <span>美学顾问: {{ data.acName }}</span>
          &nbsp;
          <span>下单人: {{ userInfo.nickName }}</span>
          &nbsp;
          <span class="reds">应付款: {{ amountPayable }}</span>
          &nbsp;
          <el-button :loading="submitLoading" size="mini" type="primary" icon="el-icon-folder-checked" @click="submitRefund">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import vm from '@/utils/util'
import { math } from '@/utils/math'

export default {
  name: 'ReturnedValue',
  dicts: ['refund_reason'],
  data() {
    return {
      submitLoading: false,
      data: {},
      sysUserList: [],
      userInfo: {},
      tableData: [], // 列表
      formInline: {},
      orderNumber: '', // 客户收费单编号
      rules: {
        dsingleUser: [{ required: true, message: '请输入下单人', trigger: 'change' }],
        reasonForRefund: [{ required: true, message: '请选择退款原因', trigger: 'change' }]
      },
      getTime: '',
      amountPayable: 0,
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0,
      rechargeCardType: '',
      rechargeId: 0,
      giftAmount: 0
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
  // 监听部门ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getUserList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.data = JSON.parse(this.$route.query.data)
    this.userInfo = this.$store.getters.user
    this.formInline.dsingleUser = this.userInfo.userId
    this.getCustomCardSum()
    this.getCurrentTime()
    this.getStoredValue() // 储值列表
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/5/30
     * @Description: 关闭当前标签
    */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author Nevin
     * @date 2022/5/30
     * @Description: 获取当前时间并格式化
    */
    getCurrentTime() {
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    // 储值列表
    getStoredValue() {
      this.$api.billingList.StoredValue({
        orderNumber: this.data.orderNumber
      }).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.tableData.forEach(item => {
            item.refundAmount = item.payableSurplus
            this.amountPayable = item.payableSurplus
            this.rechargeCardType = item.rechargeCardType
            this.rechargeId = item.rechargeId
            this.giftAmount = item.giftSurplus
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/30
     * @Description: 退储值提交
    */
    submitRefund() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$set(this.formInline, 'deptId', this.deptId) // 公司
          this.$set(this.formInline, 'id', this.data.id) // 部门ID
          this.$set(this.formInline, 'billType', this.data.billType === '3' ? '13' : '18') // 开单类型
          this.$set(this.formInline, 'departmentId', this.data.departmentId) // 科室ID
          this.$set(this.formInline, 'amountPayable', this.amountPayable) // 应付金额
          this.$set(this.formInline, 'dsingleUser', this.userInfo.userId) // 下单人
          this.$set(this.formInline, 'customerRepresentative', this.data.customerRepresentative)
          this.$set(this.formInline, 'chargeSheetId', this.data.orderNumber)
          this.$set(this.formInline, 'totalExpenses', this.data.totalExpenses)
          this.$set(this.formInline, 'oldBillType', this.data.billType)
          this.$set(this.formInline, 'orderNumber', this.data.orderNumber)
          this.$set(this.formInline, 'rechargeCardType', this.rechargeCardType)
          this.$set(this.formInline, 'rechargeCardId', this.rechargeId)
          this.$set(this.formInline, 'giftAmount', this.giftAmount)
          this.$set(this.formInline, 'jdxxId', this.data.jdxxId)
          this.$set(this.formInline, 'secondRecommender', this.data.secondRecommender)
          this.$set(this.formInline, 'aestheticConsultant', this.data.aestheticConsultant)
          this.$set(this.formInline, 'onlineUserId', this.data.onlineUserId)
          this.$set(this.formInline, 'customerStatus', this.data.customerStatus) //
          this.$set(this.formInline, 'isSecondary', this.data.isSecondary)
          // const orderDetailsList = []
          // this.tableData.forEach(item => {
          //   const orderDetails = {
          //     id: this.data.id,
          //     adjuvantListId: this.data.orderDetailsId,
          //     oldBillType: this.data.billType,
          //     commonNumber: item.rechargeId,
          //     itemId: item.rechargeCardType,
          //     priceOne: item.payableSurplus,
          //     priceTwo: item.giftSurplus,
          //     aestheticConsultant: this.data.aestheticConsultant,
          //     customerRepresentative: this.data.customerRepresentative,
          //     dsingleUser: this.userInfo.userId,
          //     discountAmount: item.refundAmount,
          //     totalAmount: math.add(item.payableSurplus, item.giftSurplus),
          //     deptId: item.deptId,
          //     departmentId: item.departmentId
          //   }
          //   orderDetailsList.push(orderDetails)
          // })
          this.$api.billingList.addOrderInfo({
            'orderInfo': this.formInline
          }).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.closeTag()
            }
          })
        }
      })
    },
    remode() {
      this.closeTag()
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 个人账户信息
     */
    getCustomCardSum() {
      this.$api.RechargeableCard.customCardSum({
        id: this.data.id
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
    /**
     * @author Nevin
     * @date 2022/5/30
     * @Description: 获取用户列表
    */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
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
          this.sysUserList = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.formBody{
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 20px 20px 20px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;
  .itemment{
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
    .mentem{
      font-size: 12px;
    }
  }
}
.reds {
  color: red;
}
.titme{
  margin-top: 8px;
  height: 30px;
  //line-height: 40px;
  background-color: #1abc9c;
  padding: 10px 10px;
  color: #ffffff;
}
.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}

.header {
  font-size: 12px;
  padding-top: 5px;
  margin-bottom: 5px;
}

.management {
  .itemment {
    font-size: 14px;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }
}

.end {
  font-size: 12px;
  margin-right: 20px;
  .red {
    font-weight: 400;
    color: red;
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
    .red {
      font-weight: 400;
      color: red;
    }
  }
}
</style>

