<template>
  <!-- 还款 -->
  <el-scrollbar>
    <div    class="header">
      <!--左侧-->
      <div class="left">
        <el-card class="box-card">
          <span style="font-size: 18px; font-weight: 600">{{ data.customerName }}</span>
          &nbsp;
          <span class="title">卡号：{{ data.customCardNumber }}</span>
          <span style="font-size: 12px;">客户账户信息：欠款金额：0.00；预约金：{{ advancePayment }}；住院押金：{{ deposit }}；储值总额：{{ totalStoredValue }}；[
            储值金额：{{
              storedValuePrincipal
            }}；储值赠送：{{
              storedValueGift }} ]</span>
        </el-card>
        <el-card class="box-card">
          <div style="font-size: 16px; font-weight: 600;">源单据收费信息[<a style="cursor: pointer;" @click="orderNumber">{{ data.orderNumber }}</a>]；实付金额：{{ data.paidAmount }}；待还款金额：{{ data.deptPrice }}</div>
          <div class="title" style="margin-top: 10px">结账列表</div>
          <el-table :data="closingList" border style="width: 100%" size="mini" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
            <el-table-column prop="payName" label="收银科目" />
            <el-table-column prop="paymentAmount" label="结账金额" />
            <el-table-column prop="remark" label="备注" width="200" />
          </el-table>
        </el-card>

      </div>
      <!--右侧-->
      <div class="right">
        <el-card class="box-card">
          <div style="font-size: 16px; font-weight: 600;">本次还款明细</div>
            <div style="width: 100%">
          <el-table
            v-if="data.billType !== '6'"
            :data="tableData"
            border
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column prop="projectName" label="产品名称/规格" width="130" />
            <el-table-column prop="quantity" label="数量" width="60"  />
            <el-table-column prop="company" label="单位"  width="60" />
            <el-table-column prop="totalAmount" label="合计金额" width="80" />
            <el-table-column prop="discount" label="折扣"  />
            <el-table-column prop="discountAmount" label="折后金额" width="90" />
            <el-table-column prop="deptPrice" label="欠款挂账金额" width="100" />
            <el-table-column prop="debtAmount" label="未还款金额" width="90" />
            <el-table-column prop="thisRepayment" label="本次还款金额" width="100">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.thisRepayment"
                  size="mini"
                  oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  step="0.01"
                  @blur="thisRepaymentAmount"
                />
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" readonly onfocus="this.removeAttribute('readonly');" size="mini" type="text" />
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="data.billType === '6'"
            :data="adjuvantData"
            border
            style="width: 100%; margin-top: 10px;overflow-y: auto"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column prop="projectName" label="产品名称" width="130" />
            <el-table-column prop="quantity" label="数量" width="60" />
            <el-table-column prop="sumPrice" label="总价" width="60" />
            <el-table-column prop="discountNumber" label="折扣" />
            <el-table-column prop="discountAmount" label="折后金额" width="90"  />
            <el-table-column prop="deptPrice" label="欠款挂账金额" width="100"  />
            <el-table-column prop="surplusDeptPrice" label="未还款金额" width="90" />
            <el-table-column prop="thisRepayment" label="本次还款金额" width="90">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.thisRepayment"
                  size="mini"
                  oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  step="0.01"
                  @blur="thisRepaymentAmount"
                />
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" size="mini" type="text" />
              </template>
            </el-table-column>
          </el-table>
          </div>
          <div style="margin-top: 20px; margin-left: 20px">
            <el-form ref="form" :model="form" label-width="100px" size="mini">
              <el-form-item label="还款：" class="item">
                <el-input
                  v-model="form.totalRepayment"
                  size="medium"
                  style="width: 100px"
                  oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  step="0.01"
                  @blur="totalRepaymentAmount"
                />
              </el-form-item>
              <el-form-item label="下单人：">
                <el-select v-model="form.dsingleUser" filterable placeholder="请选择">
                  <el-option
                    v-for="item in sysUserList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="美学顾问：">
                <el-select v-model="form.aestheticConsultant" filterable placeholder="请选择">
                  <el-option
                    v-for="item in esthetics"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="医生：">
                <el-select v-model="form.doctorId" disabled filterable placeholder="请选择">
                  <el-option
                    v-for="item in doctor"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="备注：">
                <el-input v-model="form.billingRemarks" type="textarea" style="width: 70%;" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <div class="footer">
        <div class="content">
          <span>科室: {{ data.departmentName }}</span>
          &nbsp;
          <span>还款单</span>
          &nbsp;
          <span>{{ getTime }}</span>
          &nbsp;
          <span>客户代表: {{ data.crName }}</span>
          &nbsp;
          <span>美学顾问: {{ data.acName }}</span>
          &nbsp;
          <span class="reds">费用合计: {{ data.deptPrice }}</span>
          &nbsp;
          <span class="reds">已还欠款: {{ paidAmount }}</span>
          &nbsp;
          <el-button :loading="submitLoading" type="primary" plain icon="el-icon-folder-checked" size="mini" @click="submitRepayment">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import vm from '@/utils/util'
import { math } from '@/utils/math'

export default {
  name: 'Repayment',
  data() {
    return {
      submitLoading: false,
      loadingData: false,
      data: {},
      /**
       * 产品明细
       */
      tableData: [],
      adjuvantData: [],
      closingList: [], // 结账列表
      sysUserList: [],
      esthetics: [],
      doctor: [],
      userInfo: {},
      getTime: '',
      form: {
        /**
         *  单项还款金额
         */
        totalRepayment: '',
        aestheticConsultant: 0,
        doctorId: 0,
        billingRemarks: '',
        dsingleUser: 0
      },
      /**
       * 测试
       */
      paidAmount: 0,
      totalExpenses: 0,
      totalStoredValue: 0,
      storedValuePrincipal: 0,
      storedValueGift: 0,
      advancePayment: 0,
      deposit: 0,
      orderDetailsList: []
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
    }
  },
  created() {
    this.userInfo = this.$store.getters.user
    this.data = JSON.parse(this.$route.query.data)
    this.form.dsingleUser = this.data.dsingleUser
    this.form.aestheticConsultant = this.data.aestheticConsultant
    this.form.doctorId = this.data.doctorId
    this.getCustomCardSum()
    this.getCurrentTime()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
    this.getChargeDetails() // 收费明细
    this.getChargeRecord() // 结账列表
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 获取当前时间
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
    /**
     * @author Nevin
     * @date 2022/5/25
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
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          /**
           * 美学顾问
           */
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
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
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 关闭当前标签
    */
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 关闭
    */
    close() {
      this.closeTag()
    },
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 订单号点击
    */
    orderNumber() {
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 还款明细计算
    */
    thisRepaymentAmount() {
      if (this.data.billType === '6') {
        let total = 0
        this.adjuvantData.forEach(item => {
          if (item.thisRepayment === undefined) {
            this.$set(item, 'thisRepayment', 0.00)
          }
          // if (item.thisRepayment > item.surplusDeptPrice) {
          //   this.$message.error('还款金额不能大于未还款金额，已修改为未还款金额')
          //   item.thisRepayment = item.surplusDeptPrice
          total = math.add(item.thisRepayment, total)
          // } else {
          //   total = math.add(item.thisRepayment, total)
          // }
        })
        this.form.totalRepayment = total
        this.paidAmount = this.form.totalRepayment
        this.$forceUpdate()
      } else {
        let total = 0
        /**
          * @author 李尚
          * @date 2022/8/13
          * @Description: 第一个是这个本次退款声明。只有一个判断和提示 355 - 358
        */
        this.tableData.forEach(item => {
          if (item.thisRepayment > item.debtAmount) {
            this.$message('本次还款金额不得大于未还款金额')
            item.thisRepayment = item.debtAmount
          }
          if (item.thisRepayment === undefined) {
            this.$set(item, 'thisRepayment', 0.00)
          }
          // if (item.thisRepayment > item.outstandingAmount) {
          //   this.$message.error('还款金额不能大于未还款金额，已修改为未还款金额')
          //   item.thisRepayment = item.outstandingAmount
          total = math.add(item.thisRepayment, total)
          // } else {
          //   total = math.add(item.thisRepayment, total)
          // }
        })
        this.form.totalRepayment = total
        this.paidAmount = this.form.totalRepayment
        this.$forceUpdate()
      }
    },
    /**
     * @author 李尚
     * @date 2022/7/26
     * @Description: 二次修改计算
     */
    totalRepaymentAmount() {
      if (this.data.billType === '6') {
        let totalRepayment = this.form.totalRepayment
        // 判断如果输入值大于等于需要还款的金额 直接将总还款金额赋值给输入值值  然后让还款金额大于欠款金额
        if (this.form.totalRepayment === this.data.deptPrice || this.form.totalRepayment > this.data.deptPrice) {
          this.form.totalRepayment = this.data.deptPrice
          this.adjuvantData.forEach(item => {
            item.thisRepayment = item.debtAmount
          })
          //  如果是小于
        } else {
          this.adjuvantData.forEach(item => {
            // 如果输入值减还款金额下雨等于0 再判断 输入值是否大于0 如果是 将值直接赋予还款金额  如果不是继续循环 将 欠款金额等于还款金额
            if (totalRepayment - item.debtAmount <= 0) {
              if (totalRepayment > 0) {
                item.thisRepayment = totalRepayment
                totalRepayment = totalRepayment - item.debtAmount
              } else {
                item.thisRepayment = 0
              }
            } else {
              item.thisRepayment = item.debtAmount
              totalRepayment = totalRepayment - item.debtAmount
            }
          })
        }
      } else {
        /**
         *  总数居金额
         * @type {string}
         */
        let totalRepayment = this.form.totalRepayment
        // 判断如果输入值大于等于需要还款的金额 直接将总还款金额赋值给输入值值  然后让还款金额大于欠款金额
        if (this.form.totalRepayment === this.data.deptPrice || this.form.totalRepayment > this.data.deptPrice) {
          this.form.totalRepayment = this.data.deptPrice
          this.tableData.forEach(item => {
            item.thisRepayment = item.debtAmount
          })
          //  如果是小于
        } else {
          this.tableData.forEach(item => {
            // 如果输入值减还款金额下雨等于0 再判断 输入值是否大于0 如果是 将值直接赋予还款金额  如果不是继续循环 将 欠款金额等于还款金额
            if (totalRepayment - item.debtAmount <= 0) {
              if (totalRepayment > 0) {
                item.thisRepayment = totalRepayment
                totalRepayment = totalRepayment - item.debtAmount
              } else {
                item.thisRepayment = 0
              }
            } else {
              item.thisRepayment = item.debtAmount
              totalRepayment = totalRepayment - item.debtAmount
            }
          })
        }
      }
      if (this.form.totalRepayment === '') {
        this.form.totalRepayment = 0
      }
      /**
       * @author Nevin
       * @date 2022/5/25
       * @Description: 还款金额计算
       */
      // if (this.data.billType === '6') {
      //   /**
      //    * 本次还款金额
      //    * @type {number}
      //    */
      //   let total = 0
      //   /**
      //    * 需要还款总金额
      //    * @type {number}
      //    */
      //   let totalRepayment = parseInt(this.form.totalRepayment)
      //   this.adjuvantData.forEach(item => {
      //     if (item.thisRepayment === undefined) {
      //       this.$set(item, 'thisRepayment', 0.00)
      //     }
      //     total = math.add(item.surplusDeptPrice, total)
      //   })
      //   this.adjuvantData.forEach(item => {
      //     if (parseInt(this.form.totalRepayment) > parseInt(item.surplusDeptPrice)) {
      //       if (parseInt(this.form.totalRepayment) > total) {
      //         this.form.totalRepayment = total
      //         item.thisRepayment = item.surplusDeptPrice
      //         this.$message.error('总还款金额大于每项还款金额，已修改为每项之和！')
      //       } else if (parseInt(this.form.totalRepayment) === total) {
      //         this.form.totalRepayment = total
      //         item.thisRepayment = item.surplusDeptPrice
      //       } else if (parseInt(this.form.totalRepayment) < total) {
      //         if (totalRepayment > parseInt(item.surplusDeptPrice)) {
      //           item.thisRepayment = item.surplusDeptPrice
      //           totalRepayment = math.subtract(totalRepayment, item.thisRepayment)
      //         } else if (totalRepayment < parseInt(item.surplusDeptPrice)) {
      //           item.thisRepayment = totalRepayment
      //         }
      //       }
      //     } else if (parseInt(this.form.totalRepayment) < parseInt(item.surplusDeptPrice)) {
      //       if (totalRepayment > 0) {
      //         item.thisRepayment = totalRepayment
      //         totalRepayment = 0
      //       } else {
      //         item.thisRepayment = totalRepayment
      //       }
      //     } else {
      //       item.thisRepayment = this.form.totalRepayment
      //     }
      //   })
      //   this.paidAmount = this.form.totalRepayment
      //   this.$forceUpdate()
      // } else {
      //   let total = 0
      //   let totalRepayment = parseInt(this.form.totalRepayment)
      //
      //   this.tableData.forEach(item => {
      //
      //   })
      // this.tableData.forEach(item => {
      //   if (item.thisRepayment === undefined) {
      //     this.$set(item, 'thisRepayment', 0.00)
      //   }
      //   total = math.add(item.outstandingAmount, total)
      // })
      // this.tableData.forEach(item => {
      //   if (parseInt(this.form.totalRepayment) >= parseInt(item.outstandingAmount)) {
      //     if (parseInt(this.form.totalRepayment) > total) {
      //       this.form.totalRepayment = total
      //       item.thisRepayment = item.outstandingAmount
      //       this.$message.error('总还款金额大于每项还款金额，已修改为每项之和！')
      //     } else if (parseInt(this.form.totalRepayment) === total) {
      //       // this.form.totalRepayment = total
      //       item.thisRepayment = this.form.totalRepayment
      //     } else if (parseInt(this.form.totalRepayment) < total) {
      //       if (totalRepayment > parseInt(item.outstandingAmount)) {
      //         item.thisRepayment = item.outstandingAmount
      //         totalRepayment = math.subtract(totalRepayment, item.thisRepayment)
      //       } else if (totalRepayment < parseInt(item.outstandingAmount)) {
      //         item.thisRepayment = totalRepayment
      //       }
      //     }
      //   } else if (parseInt(this.form.totalRepayment) < parseInt(item.outstandingAmount)) {
      //     if (totalRepayment > 0) {
      //       item.thisRepayment = totalRepayment
      //       totalRepayment = 0
      //     } else {
      //       item.thisRepayment = totalRepayment
      //     }
      //   } else {
      //     item.thisRepayment = this.form.totalRepayment
      //   }
      // })

      this.paidAmount = this.form.totalRepayment
      this.$forceUpdate()
      // }
    },
    /**
     * @author Nevin
     * @date 2022/5/25
     * @Description: 保存
    */
    submitRepayment() {
      if (this.paidAmount === 0) {
        this.$message('请填写还款金额')
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          /**
            * @author 李尚
            * @date 2022/7/26
            * @Description:  -------------- 取消内部多次循环 ------------
          */
          // console.log('tableData',this.tableData)
          // this.tableData.forEach(item => {
          //   if (item.thisRepayment === undefined || parseInt(item.thisRepayment) === 0 || item.thisRepayment === '') {
          //     this.$message.error('退款金额不能为空或0！')
          //   } else {
          this.submitLoading = true
          this.$set(this.form, 'deptId', this.deptId) // 部门ID
          this.$set(this.form, 'id', this.data.id) // 部门ID
          this.$set(this.form, 'billType', '9') // 开单类型
          this.$set(this.form, 'departmentId', this.data.departmentId) // 科室ID
          this.$set(this.form, 'amountPayable', this.paidAmount) // 应付金额
          this.$set(this.form, 'dsingleUser', this.userInfo.userId) // 下单人
          this.$set(this.form, 'deptPrice', this.data.deptPrice) // 欠款金额
          this.$set(this.form, 'customerRepresentative', this.data.customerRepresentative)
          this.$set(this.form, 'chargeSheetId', this.data.orderNumber)
          this.$set(this.form, 'totalExpenses', this.data.totalExpenses)
          this.$set(this.form, 'oldBillType', this.data.billType)
          this.$set(this.form, 'jdxxId', this.data.jdxxId)
          this.$set(this.form, 'onlineUserId', this.data.onlineUserId)
          this.$set(this.form, 'discount', this.allDiscount) // 折扣
          this.$set(this.form, 'customerStatus', this.data.customerStatus) //
          // this.$set(this.form, 'orderId', item.orderId)/
          // this.$set(this.form, 'crName', item.crName)/
          // this.$set(this.form, 'customAge', item.customAge)/
          // this.$set(this.form, 'customCardNumber', item.customCardNumber)/
          // this.$set(this.form, 'customPhone', item.customPhone)/
          // this.$set(this.form, 'customSex', item.customSex)/
          // this.$set(this.form, 'customerName', item.customerName)/
          // this.$set(this.form, 'customerStatus', item.customerStatus)/
          // this.$set(this.form, 'departmentName', item.departmentName)/
          // this.$set(this.form, 'doctorName', item.doctorName)/
          // this.$set(this.form, 'gradeName', item.gradeName)/
          // this.$set(this.form, 'intentionDescription', item.intentionDescription)/
          // this.$set(this.form, 'isSecondary', item.isSecondary)/
          // this.$set(this.form, 'receptionStatus', item.receptionStatus)/
          // this.$set(this.form, 'receptionTime', item.receptionTime)/
          this.$set(this.form, 'secondOpeningUser', this.data.secondOpeningUser)
          // this.$set(this.form, 'triageType', item.triageType)
          // const orderDetailsList = []
          if (this.data.billType === '6') {
            this.adjuvantData.forEach(item => {
              const orderDetails = {
                id: this.data.id,
                billType: this.data.billType,
                commonNumber: item.adjuvantListId,
                itemId: item.itemId,
                aestheticConsultant: this.form.aestheticConsultant,
                doctorId: this.form.doctorId,
                customerRepresentative: this.data.customerRepresentative,
                dsingleUser: this.userInfo.userId,
                discountAmount: item.thisRepayment,
                finalPrice: item.discountAmount,
                quantity: item.quantity,
                company: item.priceUnit,
                totalAmount: item.discountAmount,
                discount: item.discountNumber,
                deptId: item.deptId,
                departmentId: item.departmentId,
                remark: item.remark,
                quantitySum: item.quantitySum,
                projectName: item.projectName,
                priceNum: item.priceNum,
                onlineUserId: item.onlineUserId,
                costType: item.costType

              }
              this.orderDetailsList.push(orderDetails)
            })
          } else {
            this.tableData.forEach(item => {
              console.log('是填写金额吗',item)
              const orderDetails = {
                id: this.data.id,
                billType: this.data.billType,
                commonNumber: item.debtId,
                itemId: item.itemId,
                aestheticConsultant: this.form.aestheticConsultant,
                doctorId: this.form.doctorId,
                customerRepresentative: this.data.customerRepresentative,
                dsingleUser: this.userInfo.userId,
                discountAmount: item.thisRepayment, //输入金额
                wforserviceId: item.waitId,
                finalPrice: item.finalPrice,
                quantity: item.quantity,
                company: item.company,
                totalAmount: item.discountAmount,  //上一次的成交金额
                discount: item.discount,
                deptId: item.deptId,
                departmentId: item.departmentId,
                remark: item.remark,
                quantitySum: item.quantitySum,
                projectName: item.projectName,
                priceNum: item.priceNum,
                categoryId: item.categoryId,
                onlineUserId: this.data.onlineUserId,
                costType: item.costType
              }
              this.orderDetailsList.push(orderDetails)
            })
          }
          this.form.billingDepartment=this.form.departmentId
          this.$api.billingList.addOrderInfo({
            'orderInfo': this.form,
            'orderDetailsList': this.orderDetailsList
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
     * @date 2022/5/25
     * @Description: 收费明细
    */
    getChargeDetails() {
      if (this.data.billType === '6') {
        this.$api.billingList.adjuvantBillingList({
          relationshipNumber: this.data.orderNumber
        }).then(res => {
          if (res) {
            this.adjuvantData = res.rows
            this.adjuvantData.forEach(item => {
              // 折后金额 减 本次还款金额
              this.$set(item, 'outstandingAmount', math.subtract(item.discountAmount, item.thisAmount))
            })
          }
        })
      } else {
        this.$api.billingList.debtDetailsInfoList({
          orderNumber: this.data.orderNumber
        }).then((res) => {
          if (res) {
            this.tableData = res.rows
            this.tableData.forEach(item => {
              this.$set(item, 'outstandingAmount', math.subtract(item.discountAmount, item.thisAmount))
            })
            this.tableData.forEach((item, index) => {
              if (item.debtAmount === undefined) {
                this.$delete(this.tableData, index)
              }
            })
          }
        })
      }
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
     * @date 2022/5/25
     * @Description: 收费记录
    */
    getChargeRecord() {
      this.loadingData = true
      this.$api.billingList.ChargeRecord({
        id: this.data.id,
        orderNumber: this.data.orderNumber
      }).then((res) => {
        if (res) {
          this.closingList = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header{
  //padding: 23px;
  display: flex;
  justify-content: space-between;
  .left, .right{
    width: 48.5%;
  }
  .left{
    padding: 20px 0 20px 20px;
  }
  .right{
    padding: 20px 20px 20px 0;
  }
  .headers{
    display: flex;
    justify-content: space-between;
    .liets{
      width: 75%;
      .item{
        box-sizing: border-box;  /*border计算在width中*/
        -moz-box-sizing:border-box; /* Firefox */
        -webkit-box-sizing:border-box; /* Safari */
        width: 33.33%;
        font-size: 12px;
        padding: 8px 5px;
        border:1px solid #a2aaad;
        margin: 0 -1px -1px 0;
        float:left;
      }
    }
    .boxs{
      width: 25%;
      border-top: 1px solid #a2aaad;
      border-right: 1px solid #a2aaad;
      border-bottom: 1px solid #a2aaad;
    }
  }
  .box-card{

    margin-top: 5px;
    .fontwidth{
      font-size: 15px;
      font-weight:700;
    }
  }
}
.title{
  font-size: 12px;
  font-weight: 400;
}
.reds {
  color: red;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;
  .content{
    position: fixed;
    padding-top: 5px;
    right: 20px;
  }
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type=‘number’] {
  -moz-appearance: textfield !important;
}
</style>
<style>
.item .el-form-item__label{
  font-size: 18px;
  font-weight: 600;
}
</style>
