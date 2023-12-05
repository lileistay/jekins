<template>
  <!--  退款页面 -->
  <div class="header">
    <div class="left">
      <el-card class="box-card">
        <span style="font-size: 18px; font-weight: 600">{{ billing.customerName }}</span>
        &nbsp;
        <span class="title">卡号：{{ billing.customCardNumber }}</span><br>
        <span style="font-size: 12px;">客户账户信息：欠款金额：0.00；预约金：{{ advancePayment }}；住院押金：{{
          deposit
        }}；储值总额：{{ totalStoredValue }}；[
          储值金额：{{ storedValuePrincipal }}；储值赠送：{{ storedValueGift }} ]</span>
      </el-card>
      <el-card class="box-card">
        <div style="font-size: 16px; font-weight: 600;">源单据收费信息[<a style="cursor: pointer;" @click="orderNumber">{{
          billing.orderNumber
        }}</a>]；实付金额：{{ billing.paidAmount }}
        </div>
        <div class="title" style="margin-top: 10px">
          收费明细
          <span style="color: red">请选择要退款的项目</span>
        </div>
        <!--           v-if="billing.billType !== '6'"-->
        <el-table

          :data="detailed"
          size="mini"
          style="width: 100%;"
          border
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="projectName" label="产品名称" width="180" />
          <el-table-column prop="quantity" label="数量(单位)" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="finalPrice" label="单价" />
          <el-table-column prop="priceNum" label="产品次数" />
          <el-table-column prop="quantitySum" label="总次数" />
          <el-table-column prop="discountAmount" label="合计金额" width="60" />
          <el-table-column prop="billingPerformance" label="开单业绩" width="60" />
          <el-table-column prop="departmentPerformance" label="科室业绩" width="60" />
          <el-table-column prop="remainingPerformance" label="剩余待执行业绩" width="70" />
          <el-table-column prop="refundAmount" label="已退款金额" width="60" />
          <el-table-column prop="remainingPerformance" label="剩余退款金额" width="60" />
          <el-table-column prop="refundNum" label="退款次数" width="50" />
          <el-table-column prop="surplusQuantity" label="剩余次数" width="50" />
          <el-table-column fixed="right" label="操作" width="50">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="operation(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--     detailed   tableData-->
        <!--        <el-table-->
        <!--          v-if="billing.billType === '6'"-->
        <!--          :data="detailed"-->
        <!--          border-->
        <!--          style="width: 100%;"-->
        <!--          size="mini"-->
        <!--          :header-cell-style="{'text-align':'center'}"-->
        <!--          :cell-style="{'text-align':'center'}"-->
        <!--        >-->
        <!--          <el-table-column prop="projectName" label="产品名称" width="200" />-->
        <!--          <el-table-column prop="quantity" label="数量(单位)" width="60">-->
        <!--            <template slot-scope="scope">-->
        <!--              <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="priceOne" label="单价" width="50" />-->
        <!--          <el-table-column prop="sumPrice" label="总价" width="50" />-->
        <!--          <el-table-column prop="discountNumber" label="折扣" width="50" />-->
        <!--          <el-table-column prop="discountAmount" label="折后金额" width="70" />-->
        <!--          <el-table-column prop="discountAmount" label="开单业绩" width="70" />-->
        <!--          <el-table-column prop="discountAmount" label="科室业绩" width="70" />-->
        <!--          <el-table-column prop="totalAmount" label="剩余待执行业绩" width="105" />-->
        <!--          <el-table-column prop="refundAmount" label="已退款金额" width="85" />-->
        <!--          <el-table-column prop="remainingPerformance" label="剩余退款金额" width="95" />-->
        <!--          <el-table-column prop="refundNum" label="退款次数" width="95" />-->
        <!--          <el-table-column prop="surplusQuantity" label="剩余次数" width="95" />-->
        <!--          <el-table-column fixed="right" label="操作" width="50">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-button type="text" size="mini" @click="operation(scope.row)">选择</el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
        <div class="title" style="margin-top: 10px">结账列表</div>
        <el-table
          size="mini"
          border
          style="width: 100%;"
          :data="closingList"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="payName" label="结账方式" />
          <el-table-column prop="paymentAmount" label="结账金额" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
        <!--        <div class="title" style="margin-top: 10px">物资列表</div>-->
        <!--        <el-table-->
        <!--          style="width: 100%;"-->
        <!--          size="mini"-->
        <!--          border-->
        <!--          :header-cell-style="{'text-align':'center'}"-->
        <!--          :cell-style="{'text-align':'center'}"-->
        <!--        >-->
        <!--          <el-table-column prop="projectName" label="项目名称" />-->
        <!--          <el-table-column prop="name" label="物资/规格" />-->
        <!--          <el-table-column prop="quantity" label="单位" />-->
        <!--          <el-table-column prop="address" label="总购买数量" />-->
        <!--          <el-table-column prop="address" label="已领取数量" />-->
        <!--          <el-table-column prop="address" label="待领取数量" />-->
        <!--        </el-table>-->
      </el-card>
    </div>
    <div class="right">
      <!--       v-if="billing.billType !== '6'"-->
      <el-card class="box-card">
        <div style="font-size: 16px; font-weight: 600;">本次退款明细 <span style="font-size: 14px; color: red;">（注意填写退款次数）</span>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          size="mini"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="projectName" label="产品名称" width="200" />
          <el-table-column prop="finalPrice" label="单价" width="50" />
          <el-table-column prop="quantitySum" label="总次数" width="50" />
          <el-table-column prop="discountAmount" label="合计金额" width="50" />
          <el-table-column prop="discountAmount" label="科室业绩" width="50" />
          <el-table-column prop="refundAmount" label="已退款金额" width="60" />
          <el-table-column prop="remainingPerformance" label="剩余退款金额" width="60" />
          <!--          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"-->
          <el-table-column prop="thisRefundAmount" label="当次退款金额" width="75">
            <template slot-scope="scope">
              <!--              <el-input-->
              <!--                v-model="scope.row.thisRefundAmount"-->
              <!--                size="mini"-->
              <!--                type="number"-->
              <!--                style="font-size: 12px"-->

              <!--                step="0.01"-->
              <!--                @input="totalAmount(scope.$index, scope.row)"-->
              <!--                @change="refund(scope.row)"-->
              <!--              />-->
              <el-input
                v-model="scope.row.thisRefundAmount"
                readonly
                onfocus="this.removeAttribute('readonly');"
                size="mini"
                @input="totalAmount1"
                @change="refund(scope.row)"
              />

            </template>
          </el-table-column>
          <el-table-column prop="treatNum" label="已治疗次数" width="85" />
          <el-table-column prop="surplusQuantity" label="剩余次数" width="70" />
          <el-table-column prop="refundNum" label="已退款次数" width="85" />
          <el-table-column prop="thisRefundNum" label="当次退款次数" width="95">
            <template slot-scope="scope">
              <!--              <el-input-->
              <!--                v-model="scope.row.thisRefundNum"-->
              <!--                size="mini"-->
              <!--                type="number"-->
              <!--                @change="RefundNum(scope.row)"-->
              <!--              />-->
              <el-input
                v-model="scope.row.thisRefundNum"
                readonly
                onfocus="this.removeAttribute('readonly');"
                size="mini"
                @input="totalAmount2"
                @change="RefundNum(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="mini" type="text" @input="() => $forceUpdate()" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="refundOperation(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        detailed-->
        <!--        <el-table-->
        <!--          v-if="billing.billType === '6'"-->
        <!--          :data="tableData"-->
        <!--          style="width: 100%"-->
        <!--          border-->
        <!--          size="mini"-->
        <!--          :header-cell-style="{'text-align':'center'}"-->
        <!--          :cell-style="{'text-align':'center'}"-->
        <!--        >-->
        <!--          <el-table-column prop="projectName" width="200" label="产品名称" />-->
        <!--          <el-table-column prop="priceOne" label="单价" width="50" />-->
        <!--          <el-table-column prop="quantitySum" label="总次数" width="60" />-->
        <!--          <el-table-column prop="discountAmount" label="合计金额" width="70" />-->
        <!--          <el-table-column prop="discountAmount" label="科室业绩" width="70" />-->
        <!--          <el-table-column prop="refundAmount" label="已退款金额" width="85" />-->
        <!--          <el-table-column prop="remainingPerformance" label="剩余退款金额" width="95" />-->
        <!--          <el-table-column prop="thisRefundAmount" label="当次退款金额" width="95">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-input-->
        <!--                v-model="scope.row.thisRefundAmount"-->
        <!--                size="mini"-->
        <!--                type="number"-->
        <!--                @input="totalAmount(scope.$index, scope.row)"-->
        <!--                @change="refund(scope.row)"-->
        <!--              />-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="treatNum" label="已治疗次数" width="85" />-->
        <!--          <el-table-column prop="surplusQuantity" label="剩余次数" width="70" />-->
        <!--          <el-table-column prop="refundNum" label="已退款次数" width="85" />-->
        <!--          <el-table-column prop="thisRefundNum" label="当次退款次数" width="95">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-input-->
        <!--                v-model="scope.row.thisRefundNum"-->
        <!--                size="mini"-->
        <!--                type="text"-->
        <!--                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"-->
        <!--                @input="() => $forceUpdate()"-->
        <!--                @change="RefundNum(scope.row)"-->
        <!--              />-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="备注" prop="remark">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-input v-model="scope.row.remark" readonly onfocus="this.removeAttribute('readonly');" size="mini" type="text" @input="() => $forceUpdate()" />-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column fixed="right" label="操作">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-button type="text" size="mini" @click="refundOperation(scope.row)">删除</el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
        <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="100px" style="margin-top: 12px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="下单人：">
                <el-select v-model="form.dsingleUser" filterable disabled>
                  <el-option
                    v-for="(item, index) in sysUserList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="医生：">
                <el-select v-model="form.doctorId" filterable clearable>
                  <el-option
                    v-for="(item, index) in doctor"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="退款原因：" prop="reasonForRefund">
                <el-select v-model="form.reasonForRefund" filterable>
                  <el-option
                    v-for="dict in dict.type.refund_reason"
                    :key="dict.value"
                    :value="dict.value"
                    :label="dict.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="美学顾问：" prop="aestheticConsultant">
                <el-select v-model="form.aestheticConsultant" filterable clearable>
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
          <el-row>
            <el-col :span="10">
              <el-form-item label="是否医保：">
                <el-select v-model="form.insurance" filterable>
                  <el-option label="是" value="0" />
                  <el-option label="否" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注：">
                <el-input v-model="form.billingRemarks" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div class="footer">
      <div class="content">
        <span>科室: {{ billing.departmentName }}</span>
        &nbsp;
        <span>{{ BillTypeName(billing.billType) }}(退款)</span>
        &nbsp;
        <span>{{ getTime }}</span>
        &nbsp;
        <span>客户代表: {{ billing.crName }}</span>
        &nbsp;
        <span>美学顾问: {{ billing.acName }}</span>
        &nbsp;
        <span class="reds">应退款: {{ paidAmount }}</span>
        &nbsp;
        <el-button
          :loading="submitLoading"
          type="primary"
          plain
          icon="el-icon-folder-checked"
          size="mini"
          @click="submitRefund"
        >保存
        </el-button>
        <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'

export default {
  dicts: ['refund_reason', 'billing_type'],
  name: 'RefundPage',
  components: {},
  data() {
    return {
      acout: false,
      loadingData: false,
      sysUserList: [],
      esthetics: [],
      doctor: [],
      billing: {},
      userInfo: {},
      disabled: false,
      submitLoading: false,
      getTime: '',
      form: {
        doctorId: '',
        dsingleUser: '',
        reasonForRefund: '', // 退款
        insurance: '', // 医保
        aestheticConsultant: '',
        billingRemarks: ''
      },
      rules: {
        reasonForRefund: [
          { required: true, message: '请选择退款原因', trigger: 'blur' }
        ],
        aestheticConsultant: [
          { required: true, message: '请选择美学顾问', trigger: 'blur' }
        ]
      },
      closingList: [], // 结账列表
      amount: 0,
      detailed: [], // 收费明细,
      tableData: [], // 退款明细
      paidAmount: 0,
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getUserList(val)
    }
  },
  created() {
    this.billing = JSON.parse(this.$route.query.billing)
    this.userInfo = this.$store.getters.user
    this.form.dsingleUser = this.userInfo.userId
    this.form.doctorId = this.billing.doctorId
    this.form.aestheticConsultant = this.billing.aestheticConsultant
    this.getCustomCardSum()
    this.getCurrentTime()
    this.getChargeDetails() // 收费明细
    this.getChargeRecord()// 结账列表
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    console.log(this.tableData, ']')
    // this.customCard()
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/5/28
     * @Description: 关闭当前标签
     */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author Nevin
     * @date 2022/5/28
     * @Description: 开单类型显示
     */
    BillTypeName(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    /**
     * @author Nevin
     * @date 2022/5/28
     * @Description: 获取当前时间并格式化
     */
    getCurrentTime() {
      // 获取当前时间并打印
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    /**
     * @author Nevin
     * @date 2022/5/28
     * @Description: 订单号点击
     */
    orderNumber() {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // Amount() {
    //   if (this.thisRefundAmount > this.remainingRefund) {
    //     this.$message('档次退款金额不得大于剩余退款金额')
    //     this.thisRefundAmount = this.remainingPerformance
    //   }
    // },
    /**
     * @author 李尚
     * @date 2022/6/24
     * @Description: 当次退款金额不能大于剩余退款金额
     */
    refund(val) {
      // if ((val.thisRefundAmount - 0) > val.remainingPerformance) {
      //   this.$message('当次退款金额不得大于剩余退款金额')
      //   val.thisRefundAmount = val.remainingPerformance
      let total = 0
      this.tableData.forEach(item => {
        total = math.add(item.thisRefundAmount, total)
      })
      this.paidAmount = total
      // }
    },
    /**
     * @author 李尚
     * @date 2022/6/24
     * @Description: 当次退款次数不能大于剩余退款次数
     */
    RefundNum(val) {
      if (val.thisRefundNum > val.surplusQuantity) {
        this.$message('当次退款次数不得大于剩余退款次数')
        val.thisRefundNum = val.surplusQuantity
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/28
     * @Description: 计算退款金额
     */
    totalAmount(index, val) {
      // console.log(val.thisRefundAmount)
      if (val.thisRefundAmount > val.remainingRefund) {
        this.$message('当次退款金额不能大于剩余退款金额')
        val.thisRefundAmount = val.remainingRefund
        return
      }

      let total = 0
      this.tableData.forEach(item => {
        total = math.add(item.thisRefundAmount, total)
      })
      this.paidAmount = total
      this.$forceUpdate()
    },
    totalAmount1() {
      this.tableData.forEach(item => {
        if (item.thisRefundAmount > item.remainingPerformance) {
          this.$message.error('退款金额不能大于剩余金额')
          item.thisRefundAmount = item.remainingPerformance
        }
        let total = 0
        this.tableData.forEach(item => {
          total = math.add(Number(item.thisRefundAmount), total)
        })
        this.paidAmount = total
        this.$forceUpdate()
      })
    },
    totalAmount2() {
      this.tableData.forEach(item => {
        if (item.thisRefundNum > item.surplusQuantity) {
          this.$message.error('退款次数不能大于剩余次数')
          item.thisRefundNum = item.surplusQuantity
        }
        this.$forceUpdate()
      })
    },
    customCard() {
      const id = this.$route.query.id
      this.$api.RechargeableCard.customCardSum({ id: id }).then((res) => {
        if (res) {
          console.log('res', res)
        }
      })
    },
    getChargeDetails() {
      // if (this.billing.billType === '6') {
      //   this.$api.billingList.adjuvantBillingList({
      //     relationshipNumber: this.billing.orderNumber
      //   }).then(res => {
      //     if (res) {
      //       this.detailed = res.rows
      //       this.detailed.forEach(item => {
      //         if (item.refundAmount === undefined) {
      //           item.refundAmount = 0
      //         }
      //         if (item.refundNum === undefined) {
      //           item.refundNum = 0
      //         }
      //         item.treatNum = math.subtract(item.quantitySum, item.surplusQuantity)
      //         item.surplusQuantity = math.subtract(item.surplusQuantity, item.refundNum)
      //         item.remainingPerformance = math.subtract(item.discountAmount, item.refundAmount)
      //       })
      //     }
      //   })
      // } else {
      this.$api.modules.billingList.wforserviceList({
        orderNumber: this.billing.orderNumber
      }).then((res) => {
        if (res) {
          this.detailed = res.rows
          this.detailed.forEach(item => {
            if (item.refundAmount === undefined) {
              item.refundAmount = 0
            }
            if (item.refundNum === undefined) {
              item.refundNum = 0
            }
            item.treatNum = math.subtract(item.quantitySum, item.surplusQuantity)
            item.surplusQuantity = math.subtract(item.surplusQuantity, item.refundNum)
            item.remainingRefund = math.subtract(item.discountAmount, item.refundAmount)
          })
        }
      })
      // }
    },
    // 结账列表
    getChargeRecord() {
      this.$api.billingList.ChargeRecord({
        orderNumber: this.billing.orderNumber
      }).then((res) => {
        if (res) {
          this.closingList = res.rows
        }
      })
    },
    // 点击操作
    operation(e) {
      let total = 0
      // 判断退款金额
      // if (e.remainingRefund < 0) {
      //   this.$message.warning('剩余退款金额不足')
      //   return
      // }
      let flag = true
      this.tableData.forEach(item => {
        if (item.waitId === e.waitId) {
          item.thisRefundAmount = item.remainingPerformance
          item.thisRefundNum = item.surplusQuantity
          flag = false
          return
        }
      })
      if (flag) {
        this.tableData.push(e)
        this.tableData.forEach(item => {
          item.thisRefundAmount = item.remainingPerformance
          item.thisRefundNum = item.surplusQuantity
        })
      } else {
        this.$message.warning('该订单已添加退款单')
      }
      this.tableData.forEach(item => {
        total = math.add(item.thisRefundAmount, total)
      })
      this.paidAmount = total
    },
    // 本次退款明细删除按钮
    refundOperation(e) {
      const arr = this.tableData
      const id1 = arr.findIndex((arr) => arr.itemId === e.itemId)// id1为对象的数组下标
      this.tableData.splice(id1, 1)
      e.discount = 1
    },
    close() {
      this.closeTag()
    },
    // 获取用户列表
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
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          // ---------岗位------
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          }) // 医生
          // ---------------------
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
            }
          }) // 美学顾问
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /**
     * @author Nevin
     * @date 2022/5/27
     * @Description: 退款提交
     */
    submitRefund() {
      if (this.tableData.some(val => val.thisRefundNum === undefined)) {
        this.$message('请填写退款次数')
        return
      }
      if (this.tableData.length === 0) {
        this.$message('没有退款数据')
        return
      }

      // console.log('退款信息', this.tableData)
      // return;
      this.$refs.form.validate((val) => {
        if (val) {
          const orderDetailsList = []
          this.tableData.forEach(item => {
            if (item.thisRefundNum === undefined || item.thisRefundNum === '' || item.thisRefundAmount === undefined || item.thisRefundAmount === '') {
              this.$message.error('退款次数或金额不能为空！')
              return
            } else {
              let bitype = ''
              if (this.billing.billType === '7') {
                bitype = '16'
              } else if (this.billing.billType === '6') {
                bitype = '15'
              } else if (this.billing.billType === '21') {
                bitype = '22'
              } else if (this.billing.billType === '19') {
                bitype = '20'
              } else {
                bitype = '11'
              }
              this.submitLoading = true
              this.$set(this.form, 'deptId', this.deptId) // 公司ID
              this.$set(this.form, 'id', this.billing.id) // 公司ID
              this.$set(this.form, 'billType', bitype) // 开单类型
              this.$set(this.form, 'departmentId', this.billing.departmentId) // 科室ID
              this.$set(this.form, 'amountPayable', this.paidAmount) // 应付金额
              this.$set(this.form, 'dsingleUser', this.userInfo.userId) // 下单人
              this.$set(this.form, 'customerRepresentative', this.billing.customerRepresentative)
              this.$set(this.form, 'chargeSheetId', this.billing.orderNumber)
              this.$set(this.form, 'totalExpenses', this.billing.totalExpenses)
              this.$set(this.form, 'oldBillType', this.billing.billType)
              this.$set(this.form, 'orderNumber', this.billing.orderNumber)
              this.$set(this.form, 'jdxxId', this.billing.jdxxId)
              this.$set(this.form, 'deptPrice', this.billing.deptPrice)
              this.$set(this.form, 'onlineUserId', this.billing.onlineUserId)
              this.$set(this.form, 'customerStatus', this.billing.customerStatus)
              this.$set(this.form, 'isSecondary', this.billing.isSecondary)
              this.$set(this.form, 'billingDepartment', this.billing.billingDepartment)
            }
          })
          // console.log(this.form)
          // return;
          // if (this.billing.billType === '6') {
          //   this.tableData.forEach(item => {
          //     const orderDetails = {
          //       id: this.billing.id,
          //       billType: this.billing.billType,
          //       commonNumber: item.adjuvantListId,
          //       itemId: item.itemId,
          //       aestheticConsultant: this.form.aestheticConsultant,
          //       doctorId: this.form.doctorId,
          //       customerRepresentative: this.billing.customerRepresentative,
          //       dsingleUser: this.userInfo.userId,
          //       // 先传正值
          //       // discountAmount: math.subtract(0, item.thisRefundAmount),
          //       discountAmount: item.thisRefundAmount,
          //       finalPrice: item.discountAmount,
          //       quantity: item.quantity,
          //       company: item.priceUnit,
          //       totalAmount: item.discountAmount,
          //       discount: item.discountNumber,
          //       deptId: item.deptId,
          //       departmentId: item.departmentId,
          //       remark: item.remark,
          //       // 先传正值
          //       // quantitySum: math.subtract(0, item.thisRefundNum),
          //       quantitySum: item.thisRefundNum,
          //       projectName: item.projectName,
          //       priceNum: item.priceNum
          //     }
          //     orderDetailsList.push(orderDetails)
          //   })
          // }
          // else {
          this.tableData.forEach(item => {
            const orderDetails = {
              id: this.billing.id,
              billType: this.billing.billType,
              commonNumber: item.orderDetailsId,
              itemId: item.itemId,
              aestheticConsultant: this.form.aestheticConsultant,
              doctorId: this.form.doctorId,
              customerRepresentative: this.billing.customerRepresentative,
              dsingleUser: this.userInfo.userId,
              // 先传正值
              // discountAmount: math.subtract(0, item.thisRefundAmount),
              discountAmount: item.thisRefundAmount,
              wforserviceId: item.waitId,
              finalPrice: item.finalPrice,
              quantity: item.quantity,
              company: item.company,
              totalAmount: item.totalAmount,
              // totalPayment: item.thisRefundAmount,
              discount: item.discount,
              deptId: item.deptId,
              departmentId: item.departmentId,
              remark: item.remark,
              quantitySum: item.thisRefundNum, // 退款次数
              // 先传正值
              // quantitySum: math.subtract(0, item.thisRefundNum),
              projectName: item.projectName,
              priceNum: item.priceNum,
              onlineUserId: this.billing.onlineUserId,
              billingDepartment: item.billingDepartment,
              costType: item.costType
            }
            orderDetailsList.push(orderDetails)
          })
          // }
          // console.log('总',this.form)
          console.log('详细', orderDetailsList)
          // orderDetailsList.forEach(item=>{
          //
          // })
          // this.submitLoading = false
          // console.log(this.form,'+++++++++');
          // console.log(this.rderDetailsList,'_________')
          // return
          this.$api.billingList.addOrderInfo({
            'orderInfo': this.form,
            'orderDetailsList': orderDetailsList
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
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  //padding: 23px;
  display: flex;
  justify-content: space-between;

  .left, .right {
    width: 48%;
  }

  .left {
    padding: 20px 0 20px 20px;
  }

  .right {
    padding: 20px 20px 20px 0;
  }

  .headers {
    display: flex;
    justify-content: space-between;

    .liets {
      width: 75%;

      .item {
        box-sizing: border-box; /*border计算在width中*/
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        width: 33.33%;
        font-size: 12px;
        padding: 8px 5px;
        border: 1px solid #a2aaad;
        margin: 0 -1px -1px 0;
        float: left;
      }
    }

    .boxs {
      width: 25%;
      border-top: 1px solid #a2aaad;
      border-right: 1px solid #a2aaad;
      border-bottom: 1px solid #a2aaad;
    }
  }

  .box-card {
    margin-top: 5px;

    .fontwidth {
      font-size: 15px;
      font-weight: 700;
    }
  }
}

.title {
  font-size: 12px;
  font-weight: 400;
}

.reds {
  color: red;
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
    padding-top: 5px;
    right: 20px;
  }
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  height: 20px;
  background: #dcdcdc;
}

::v-deep .el-scrollbar {
  width: 100%;
  height: 100%;
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type=‘number’] {
  -moz-appearance: textfield !important;
}
</style>
