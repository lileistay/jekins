<template>
  <!-- 个人账户信息  -->
  <div>
    <div class="time">
      <ul>
        <li>
          <p class="ament">{{ customCardSum.totalStoredValue }}</p>
          <span>储值总额</span>
        </li>

        <li>
          <p class="ament">{{ customCardSum.storedValuePrincipal }}</p>
          <span>储值本金</span>
        </li>
        <li>
          <p style="color: red ">{{ customCardSum.storedValueGift }}</p>
          <span>储值赠送</span>
        </li>
        <li>
          <p class="amenta">{{ customCardSum.deposit }}</p>
          <span>住院押金</span>
        </li>
        <li>
          <p class="amenta">{{ customCardSum.advancePayment }}</p>
          <span>预约金</span>
        </li>
        <li>
          <p style="color: red ">{{ customCardSum1.debtAmount }}</p>
          <span>欠款金额</span>
        </li>
        <li>
          <p class="amenta">{{customCardSum1.billingPerformance}}</p>
          <span>开单业绩汇总</span>
        </li>
        <li>
          <p class="amenta">{{customCardSum1.departmentPerformance}}</p>
          <span>科室业绩汇总</span>
        </li>
        <li>
          <p class="amenta">0</p>
          <span>可用收益</span>
        </li>
      </ul>
    </div>
    <div class="export">
      <el-button size="small" type="success" plain><i class="el-icon-refresh" /> 导出收费单明细</el-button>
    </div>
    <!-- ///////////////客户交储值列表/////////////////// -->
    <div>
      <p class="Concerns-title"><i class="el-icon-s-marketing" />客户交储值列表</p>
      <el-table
        :data="depositValueData"
        border
        size="mini"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="收费单号" prop="orderNumber" />
        <el-table-column label="结账时间" prop="createTime" />
        <el-table-column label="开单推荐人" prop="secondRecommenderName" />
        <el-table-column label="储值类型" prop="rechargeCardType" />
        <el-table-column label="项目名称" prop="projectName" >
        <template slot-scope="scope">
          <div>{{scope.row.isRefund=='2'?'储值充值':scope.row.isRefund=='3'?'储值使用':'储值退款'}}</div>
        </template>
        </el-table-column>
        <el-table-column label="储备现金" prop="amountPayable" />
        <el-table-column label="储备赠送" prop="giftAmount" />
        <el-table-column label="储值总额" prop="totalValue" />
        <el-table-column label="业绩比例" prop="proportion" />
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          :page-size="depositValuePageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="depositValueTotal"
          @size-change="depositValueSizeChange"
          @current-change="depositValueCurrentChange"
        />
      </div>
    </div>
    <!-- ///////预约金收费单////////// -->
    <!-- /payment/advanceConsumptionRecord/list-->
    <div>
      <p class="Concerns-title"><i class="el-icon-time" />预约金收费单</p>
      <el-table
        border
        size="mini"
        :row-class-name="ConsumpRecordList"
        :data="advanceConsumptionRecordList"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="收费单号" prop="orderNumber" />
        <el-table-column label="结账时间" prop="createTime" />
        <el-table-column label="开单推荐人" prop="secondRecommenderName" />
        <el-table-column label="类型" prop="billType">
          <template slot-scope="scope">
            <span>{{ BillTypeName(scope.row.billType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="rechargeAmount" />
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          :page-size="advancePaymentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="advancePaymentTotal"
          @size-change="handleAdvancePaymentSizeChange"
          @current-change="handleAdvancePaymentCurrentChange"
        />
      </div>
    </div>
    <!-- //////////收费单信息///////////////// -->
    <div>
      <p class="Concerns-title"><i class="el-icon-s-marketing" />收费单信息
        <span style="margin-left: 10px; margin-right:10px;font-size: 14px"><i class="color-block-success" />有退款</span>
<!--        <span style="font-size: 14px"><i class="color-block-default" />未退款</span>-->
      </p>
      <el-table
        :data="billingData"
        border
        size="mini"
        :row-class-name="rowClassName"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="收费单号" prop="orderNumber" width="160" />
        <el-table-column label="结账时间" prop="checkoutTime" width="160" />
        <el-table-column label="开单推荐人" prop="secondRecommenderName" width="100" />
        <el-table-column label="类型" prop="billType" width="110">
          <template slot-scope="scope">
            <span>{{ BillTypeName(scope.row.billType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="projectName" :show-overflow-tooltip="true" />
        <el-table-column label="备注" prop="remark" width="200" :show-overflow-tooltip="true" />
        <el-table-column label="价格" prop="priceOne" width="80" />
        <el-table-column label="数量" prop="quantity" width="80" />
        <el-table-column label="折扣" prop="discount" width="80" />
        <el-table-column label="折后金额" prop="discountAmount" width="90" />
        <el-table-column label="开单业绩" prop="billingPerformance" width="90" />
        <el-table-column label="科室业绩" prop="departmentPerformance" width="90" />
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          :page-size="billingPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="billingTotal"
          @size-change="handleBillSizeChange"
          @current-change="handleBillCurrentChange"
        />
      </div>
    </div>
    <div>
      <p class="Concerns-title"><i class="el-icon-s-marketing" />检验，辅助治疗单，住院结算单及退款、还款
        <span style="margin-left: 10px; margin-right:10px;font-size: 14px"><i class="color-block-success" />有退款</span>
                <span style="font-size: 14px"><i class="color-block-default" />未退款</span>
      </p>
      <el-table
        :data="storedValueData"
        border
        size="mini"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="收费单号" prop="orderNumber" width="200" />
        <el-table-column label="结账时间" prop="checkoutTime" width="200" />
        <el-table-column label="开单推荐人" prop="secondRecommenderName" width="200" />
        <el-table-column label="类型" prop="billType" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.deptPrice > 0">{{ BillTypeName(scope.row.billType) }}<span style="color: red">（有欠款）</span></span>
            <span v-else>{{ BillTypeName(scope.row.billType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="projectName" :show-overflow-tooltip="true" />
        <el-table-column label="备注" prop="remark" width="200" :show-overflow-tooltip="true" />
        <el-table-column label="价格" prop="discountAmount" width="100" />
        <el-table-column label="数量" prop="quantity" width="100" />
        <el-table-column label="折扣" prop="discountNumber" width="100" />
        <el-table-column label="折后金额" prop="discountAmount" width="90" />
        <el-table-column label="开单业绩" prop="billingAmount" width="90" />
        <el-table-column label="科室业绩" prop="departmentAmount" width="90" />
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          :page-size="storedValuePageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="storedValueTotal"
          @size-change="billingPageChange"
          @current-change="billingPageCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>

import { math } from '@/utils/math'

export default {
  dicts: ['billing_type'],
  components: {},
  props: [ 'deptId'],
  data() {
    return {
      
      ids: 0,
      customCardSum: {
        totalStoredValue: 0,
        storedValuePrincipal: 0,
        storedValueGift: 0,
        deposit: 0,
        advancePayment: 0,
      },
        customCardSum1: {
            debtAmount:'',
            departmentPerformance:''

        },
      advanceConsumptionRecordList: [], // 预约金
      advancePaymentTotal: 0,
      advancePaymentPageNum: 1,
      advancePaymentPageSize: 5,
      billingData: [], // 收费单信息
      idss: 0,
      billingTotal: 0,
      billingPageNum: 1,
      billingPageSize: 5,
      depositValueData: [], // 客户交储值列表
      depositValueTotal: 0,
      depositValuePageNum: 1,
      depositValuePageSize: 5,
      storedValueData: [], // 检验，辅助治疗单，住院结算单及退款、还款
      storedValueTotal: 0,
      storedValuePageNum: 1,
      storedValuePageSize: 5
    }
  },
  created() {
    this.$route.query.id
    // console.log(this.ids)
    // this.getBillList()
    // this.assistance()
    // this.getAdvancePaymentInfo()
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 个人账户信息
     */
    getCustomCardSum(id) {
      this.ids = id
      this.getBillList(this.ids)
      this.getDepositValueInfo(this.ids)
      this.RecordList(this.ids)
      this.assistance(this.ids)
      this.$api.RechargeableCard.customCardSum({
        id: id
      }).then(res => {
        if (res.rows.length !== 0) {
          this.customCardSum.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
            res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
          this.customCardSum.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal,
            res.rows[0].departmentalPrincipal)
          this.customCardSum.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
          this.customCardSum.deposit = res.rows[0].deposit
          this.customCardSum.advancePayment = res.rows[0].advancePayment
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/7/5
     * @Description: 开单类型
    */
    BillTypeName(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    /**
     * @author Nevin
     * @date 2022/7/5
     * @Description: 获取个人收费单
     */
    getBillList(id) {
      if (id !== undefined) {
        this.idss = id
      }
      this.$api.billingList.neworderDetailsList({
        id: this.idss,
        deptId: this.deptId,
        pageNum: this.billingPageNum,
        pageSize: this.billingPageSize
      }).then((res) => {
        if (res) {
          this.billingData = res.rows

          this.billingTotal = res.total
        }
      })
    },
    ConsumpRecordList({ row }) {
      if (row.isRefund === '1') {
        // return '{backgroundColor: 'red'}'
        return 'sheetInformation'
      }
      return ''
    },
    /**
     * @author Nevin
     * @date 2022/7/5
     * @Description: 收费单分页
    */
    handleBillSizeChange(e) {
      this.billingPageSize = e
      this.getBillList()
    },
    handleBillCurrentChange(e) {
      this.billingPageNum = e
      this.getBillList()
    },
    rowClassName({ row }) {
      console.log(row.refundNum)
      if (row.refundNum>0) {
        // return '{backgroundColor: 'red'}'
        return 'sheetInformation'
      }
      return ''
    },
    /**
     * @author Nevin
     * @date 2022/7/5
     * @Description: 获取用户交储值记录
    */
    getDepositValueInfo() {
      this.$api.billingList.rechargeConsumptionInfoList({
        id: this.ids,
        deptId: this.deptId,
        pageNum: this.depositValuePageNum,
        pageSize: this.depositValuePageSize
      }).then((res) => {
        if (res) {
          res.rows.forEach(item => {
            if (item.rechargeCardType === '1') {
              item.rechargeCardType = '科室'
            } else if (item.rechargeCardType === '2') {
              item.rechargeCardType = '公司 '
            } else if (item.rechargeCardType === '3') {
              item.rechargeCardType = '集团 '
            }
            item.totalValue = math.add(item.amountPayable, item.giftAmount)
            item.proportion = math.divide(item.amountPayable, item.totalValue).toFixed(2)
          })
          this.depositValueData = res.rows
          this.depositValueTotal = res.total
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/7/5
     * @Description: 储值分页
     */
    depositValueSizeChange(e) {
      this.depositValuePageSize = e
      this.getDepositValueInfo()
    },
    depositValueCurrentChange(e) {
      this.depositValuePageNum = e
      this.getDepositValueInfo()
    },
    // 预约金收费单
    RecordList() {
      this.$api.billingList.advanceConsumptionRecordList({
        id: this.ids,
        deptId: this.deptId,
        pageNum: this.advancePaymentPageNum,
        pageSize: this.advancePaymentPageSize
      }).then((res) => {
        if (res) {
          this.advanceConsumptionRecordList = res.rows
          this.advancePaymentTotal = res.total
        }
      })
    },
    handleAdvancePaymentSizeChange(e) {
      this.advancePaymentPageSize = e
      this.RecordList()
    },
    handleAdvancePaymentCurrentChange(e) {
      this.advancePaymentPageNum = e
      this.RecordList()
    },
    // 检验，辅助治疗单，住院结算单及退款、还款
    assistance() {
      // console.log('检验，辅助治疗单，住院结算单及退款、还款')
      this.$api.billingList.selectCusromerList({
        id: this.ids,
        deptId: this.deptId,
        pageNum: this.storedValuePageNum,
        pageSize: this.storedValuePageSize
      }).then((res) => {
        if (res) {
          // res.rows.forEach(item => {
          //   if (item.discountNumber === 1) {
          //     console.log(item.billType)
          //   }
          // })
          this.storedValueData = res.rows
          this.storedValueTotal = res.total
        }
      })
    },
    billingPageChange(e) {
      this.storedValuePageSize = e
      this.assistance()
    },
    billingPageCurrentChange(e) {
      this.storedValuePageNum = e
      this.assistance()
    }
  }
}
</script>

<style>
.el-table .sheetInformation {
  background-color: #e55451;
  color: #333333;
}
</style>
<style scoped lang='scss'>
.color-block-success {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #e55451;
  border-radius: 2px;
  border: 1px solid #e55451;
}
.Concerns-title {
  height: 45px;
  font-weight: 600;
  line-height: 45px;
  padding-left: 20px;
  background-color: #ebfaff;
}

.time {
  //float: left;
  height: 80px;
  width: 100%;
  font-size: 16px;
  padding: 0 30px;
  background-color: #ebfaff;
}

.elicont {
  width: 5px;
  height: 5px;
  color: yellow;
}

//个人账户金额
.ament {
  color: #E6A23C;
}

.amenta {
  color: #739cd5;
}

ul {
  display: inline;
  white-space: nowrap;
}

li {
  display: inline-block;
  white-space: nowrap;
  width: 10%;
  padding: 19px 0px 0px 21px;
}

.card {
  height: 40px;
  padding-left: 20px;
  padding-top: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #f8f8f8;
}

.cards {
  height: 64px;

  .top {
    padding-top: 9px;
  }
}

span {
  padding-right: 10px;
}
</style>
