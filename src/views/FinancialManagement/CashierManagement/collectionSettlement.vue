<!--收款结账-->
<template>
  <!--  收费单-->
  <el-scrollbar>

    <div class="header">
      <div class="title">收费单</div>
      <div class="left">
        <div class="leftborder">
          <div class="title" >结账列表</div>
          <div class="check">
            结账方式列表
            <el-input v-model="keyWord" placeholder="搜索关键词" size="mini" class="keyword" :readonly="readly"
                      @click.nat.native="Readonly($event)" @input="searchPayRecord" ref="Read" />
          </div>
          <div class="pay">
            <a v-for="(item, index) in seachPayRecord" :key="index" class="payA" @click="payClick(item)">
              <div class="content">
                {{ item.payName }}
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="borderRight">
          <div class="title">个人账户信息</div>
          <div class="rightheader">
            <div>
              <span class="titme">账户信息</span>
              <span>姓名：{{ order.customerName }}</span>
              <!--              <span>会员等级：丽人卡 </span>-->
              <span>折扣：0</span>
            </div>
          </div>
          <!--账户信息-->
          <div class="liets">
            <div class="item">集团储值：{{ groupPrincipal }}</div>
            <div class="item">公司储值：{{ companyPrincipal }}</div>
            <div class="item">科室储值：{{ departmentalPrincipal }}</div>
            <div class="item">集团赠送：{{ groupGift }}</div>
            <div class="item">公司赠送：{{ companyGift }}</div>
            <div class="item">科室赠送：{{ departmentalGift }}</div>
            <div class="item" style="border-radius: 0 0 0 10px">住院押金：{{ deposit }}</div>
            <div class="item">预约金：{{ Vorauszahlung }}</div>
            <div class="item" style="border-radius: 0 0 10px 0">可用积分：0</div>
          </div>
        </div>
        <div class="borderRight">
          <div class="title">个人收费单信息</div>
          <div class="rightheader">
            <span class="titme">收费单信息</span>
            <span>收费单编号：{{ order.orderNumber }}</span>
            <span>收费单类型：{{ BillTypeName(order.billType,order) }} </span>
            <!--            <el-button size="mini" style="float: right;margin-right: 10px;margin-top: 7px" type="success" plain icon="el-icon-edit">会员打折-->
            <!--            </el-button>-->
          </div>
          <div>
            <el-table v-if="order.billType === '13'" :data="rechargeData" border index="序号"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" size="mini"
                      style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="储值金额" prop="amountPayable" />
              <el-table-column label="赠送金额" prop="giftAmount" />
              <el-table-column label="应退金额" prop="amountPayable" />
              <el-table-column label="储值类型" prop="rechargeCardType">
                <template slot-scope="scope">
                  <span v-if="scope.row.rechargeCardType === '3'">{{
                      scope.row.rechargeCardType === '3' ? '集团' : ''
                    }}</span>
                  <span v-for="(item, index) in dict.type.recharge_card_type" v-else :key="index">
                    <span>{{ scope.row.rechargeCardType === item.value ? item.label : '' }}</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <!--            <el-table-->
            <!--              v-if="order.billType === '14'"-->
            <!--              :data="rechargeData"-->
            <!--              border-->
            <!--              index="序号"-->
            <!--              :header-cell-style="{'text-align':'center'}"-->
            <!--              :cell-style="{'text-align':'center'}"-->
            <!--              size="mini"-->
            <!--              style="width: 100%;border-radius: 0 0 10px 10px"-->
            <!--            >-->
            <!--              <el-table-column label="储值金额" prop="totalAmount" />-->
            <!--              <el-table-column label="剩余金额" prop="remainingAmount" />-->
            <!--              <el-table-column label="应退金额" prop="discountAmount" />-->
            <!--            </el-table>-->
            <!--            <el-table-->
            <!--              v-if="order.billType === '12'"-->
            <!--              :data="rechargeData"-->
            <!--              border-->
            <!--              index="序号"-->
            <!--              :header-cell-style="{'text-align':'center'}"-->
            <!--              :cell-style="{'text-align':'center'}"-->
            <!--              size="mini"-->
            <!--              style="width: 100%;border-radius: 0 0 10px 10px"-->
            <!--            >-->
            <!--              <el-table-column label="总预约金" prop="totalAmount" />-->
            <!--              <el-table-column label="剩余预约金" prop="remainingAmount" />-->
            <!--              <el-table-column label="应退预约金" prop="discountAmount" />-->
            <!--            </el-table>-->
            <el-table v-if="order.billType === '3' || order.billType === '4'" :data="rechargeData" border index="序号"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" size="mini"
                      style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="储值金额" prop="amountPayable" />
              <el-table-column label="赠送金额" prop="giftAmount" />
              <el-table-column label="储值类型" prop="rechargeCardType">
                <template slot-scope="scope">
                  <span v-if="scope.row.rechargeCardType === '3'">{{
                      scope.row.rechargeCardType === '3' ? '集团' : ''
                    }}</span>
                  <span v-for="(item, index) in dict.type.recharge_card_type" v-else :key="index">
                    <span>{{ scope.row.rechargeCardType === item.value ? item.label : '' }}</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <!--            数据回显 辅助治疗 检验 todo-->
            <el-table
              v-if="order.billType === '1' || order.billType === '2' || order.billType === '21' || order.billType === '20' || order.billType === '19' || order.billType === '7' || order.billType === '8' || order.billType === '16' || order.billType === '15'"
              :data="orderData" border index="序号" :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }" size="mini" style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="产品名称" width="300" prop="projectName" />
              <el-table-column label="价格" prop="finalPrice" />
              <el-table-column label="数量" prop="quantity" />
              <el-table-column label="合计金额" prop="totalAmount" />
              <el-table-column label="是否打折" prop="isDiscount">
                <template slot-scope="scope">
                  <span v-if="scope.row.isDiscount === ''">是</span>
                  <span v-if="scope.row.isDiscount === '0'">否</span>
                  <span v-if="scope.row.isDiscount === '1'">是</span>
                </template>
              </el-table-column>
              <el-table-column label="折扣数" prop="discount" />
              <el-table-column label="折后金额" prop="discountAmount" />
              <el-table-column label="产品次数">
                <template slot-scope="scope">
                  <!--<span v-if="order.billType === '8'">{{ scope.row.quantity }}</span>-->
                  <span>{{ scope.row.priceNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="产品总次数" prop="quantitySum" />
              <el-table-column label="备注" prop="remark" />
            </el-table>
            <el-table v-if="order.billType === '6'" :data="orderData" border index="序号"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" size="mini"
                      style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="产品名称" width="150" :show-overflow-tooltip="true" prop="projectName" />
              <el-table-column label="价格1" width="100" prop="priceOne" />
              <el-table-column label="价格2" prop="priceTwo" />
              <el-table-column label="数量" prop="quantity" />
              <el-table-column label="总价" prop="discountAmount" />
              <el-table-column label="折扣" prop="discount" />
              <el-table-column label="折后金额" prop="discountAmount" />
              <el-table-column label="每次用量" prop="eachTime" />
              <el-table-column label="用药单位" prop="pharmacy" />
              <el-table-column label="备注" prop="remark" />
            </el-table>
            <el-table v-if="order.billType === '9' && order.oldBillType !== '6'" :data="orderData" border index="序号"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" size="mini"
                      style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="产品名称" width="150" :show-overflow-tooltip="true" prop="projectName" />
              <el-table-column label="数量" prop="quantity" />
              <el-table-column label="单位" prop="company" />
              <el-table-column label="价格" prop="totalAmount" />
              <el-table-column label="折扣" prop="discount" />
              <el-table-column label="支付金额" prop="discountAmount" />
            </el-table>
            <el-table v-if="order.billType === '9' && order.oldBillType === '6'" :data="orderData" border index="序号"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" size="mini"
                      style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="产品名称" width="150" :show-overflow-tooltip="true" prop="projectName" />
              <el-table-column label="数量" prop="quantity" />
              <el-table-column label="单位" prop="company" />
              <el-table-column label="最终价格" prop="finalPrice" />
              <el-table-column label="折扣" prop="discount" />
              <el-table-column label="支付金额" prop="discountAmount" />
              <el-table-column label="备注" prop="remark" />
            </el-table>
            <el-table v-if="order.billType === '11' || order.billType === '22'" :data="orderData" border index="序号"
                      :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" size="mini"
                      style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="产品名称" prop="projectName" width="100" :show-overflow-tooltip="true" />
              <el-table-column label="数量" prop="quantity" />
              <el-table-column label="单位" prop="company" />
              <el-table-column label="最终价格" prop="finalPrice" />
              <el-table-column label="折扣" prop="discount" />
              <el-table-column label="本次退款金额" prop="discountAmount" />
              <el-table-column label="本次退款次数" prop="quantitySum" />
              <el-table-column label="备注" prop="remark" />
            </el-table>
          </div>
        </div>
        <div class="borderRight">
          <div class="title">个人结账信息</div>
          <div class="rightheader">
            <span class="titme">结账信息</span>
            <span>合计金额：{{ order.totalExpenses }}</span>
            <span>
              <span v-if="order.billType == 17">应退款：{{ order.amountPayable }}</span>
              <span v-else>应付款：{{ order.amountPayable }}</span>
            </span>
          </div>
          <div>
            <el-table :data="payData" border index="序号" :header-cell-style="{ 'text-align': 'center' }"
                      :cell-style="{ 'text-align': 'center' }" size="mini" style="width: 100%;border-radius: 0 0 10px 10px">
              <el-table-column label="收银科目" prop="payName" />
              <el-table-column label="结账金额" prop="paymentAmount">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.paymentAmount" :disabled="scope.row.disabled" size="mini"
                            oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                            @input="mathPayment"  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" readonly onfocus="this.removeAttribute('readonly');" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" style="color: #ff0000" @click="payDelete(scope.row, scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="content">
          已付:&nbsp;
          <span style="color: #ff0000">{{ paidAmount }}</span>
          <!--          <el-input v-model="paidAmount" size="mini" style="width: 100px" disabled @keydown.native="handleInput" />-->
          剩余:&nbsp;
          <span style="color: #ff0000">{{ preservation }}</span>
          <!--          <el-input v-model="preservation" size="mini" style="width: 100px" disabled @keydown.native="handleInput" />-->
          &nbsp;
          <el-button size="mini" icon="el-icon-folder-opened" type="primary"
                     :disabled="paidAmount !== order.amountPayable" :loading="loadingPay" @click="printCollectionSettlement(1)">保存
          </el-button>
          <el-button v-hasPermi="['payment:chargeRecordInfo:add']" size="mini" icon="el-icon-printer" type="primary"
                     :disabled="paidAmount !== order.amountPayable" :loading="loadingPay"
                     @click="printCollectionSettlement(2)">保存并打印
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            icon="el-icon-printer"-->
          <!--            type="primary"-->
          <!--            :loading="loadingPay"-->
          <!--            @click="ceshi"-->
          <!--          >测试打印-->
          <!--          </el-button>-->
        </div>
      </div>
      <sgDialog title="预约金结账" size="55%" :dialog="showAdvancePayment" @handleClose="handleClose">
        <div slot="out">
          <el-table ref="advancePaymentTable" :data="advancePaymentData" selection size="mini" highlight-current-row
                    @selection-change="handleAdvancePaymentChange" @row-click="rowAdvancePaymentClick">
            <el-table-column type="selection" width="45" />
            <el-table-column label="收费单编号" width="165" prop="orderNumber" />
            <el-table-column label="下单人" prop="dsingleName" width="100" />
            <el-table-column label="下单时间" prop="createTime" />
            <el-table-column label="科室" prop="departmentName" width="90" />
            <el-table-column label="剩余金额" prop="remainingAmount" width="90" />
            <el-table-column label="预约金有效期" prop="advancePaymentTime" />
            <el-table-column label="结账金额" prop="paymentAmount">
              <template slot-scope="scope">
                <el-input v-model="scope.row.paymentAmount" size="mini" :disabled="scope.row.inputDisabled"
                          @input="advancePaymentInput(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="margin: 10px 0 0 0 ">
              <el-button size="mini" style="float: right; margin-left: 10px" @click="handleClose">取消</el-button>
              <el-button size="mini" type="primary" style="float: right" @click="submitFormAdvancePayment">确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>

      <sgDialog title="住院押金结账" size="55%" :dialog="showHospitalization" @handleClose="handleClose">
        <div slot="out">
          <el-table ref="hospitalizationTable" :data="hospitalizationData" selection size="mini" highlight-current-row
                    @selection-change="handleHospitalizationChange" @row-click="rowHospitalizationClick">
            <el-table-column type="selection" width="45" />
            <el-table-column label="收费单编号" width="165" prop="orderNumber" />
            <el-table-column label="科室" prop="departmentName" width="90" />
            <el-table-column label="下单人" prop="dsingleName" width="100" />
            <el-table-column label="下单时间" prop="createTime" />
            <el-table-column label="剩余金额" prop="remainingAmount" width="90" />
            <el-table-column label="结账金额" prop="paymentAmount">
              <template slot-scope="scope">
                <el-input v-model="scope.row.paymentAmount" size="mini" :disabled="scope.row.inputDisabled"
                          @input="hospitalizationInput(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="margin: 10px 0 0 0 ">
              <el-button size="mini" style="float: right; margin-left: 10px" @click="handleClose">取消</el-button>
              <el-button size="mini" type="primary" style="float: right" @click="submitFormHospitalization">确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
      <sgDialog title="住院押金退款" size="40%" :dialog="showHospitalizationRefund"
                @handleClose="showHospitalizationRefund = false">
        <div slot="out">
          <el-table ref="table" selection :data="hospitalizationRefundData" highlight-current-row
                    @selection-change="handleHospitalizationChangeRefound" @row-click="rowClick">
            <el-table-column type="selection" width="45" />
            <el-table-column label="住院押金" prop="paymentAmount" />
            <el-table-column label="住院押金退款" prop="paymentAmountRefund">
              <template slot-scope="scope">
                <el-input v-model="scope.row.paymentAmountRefund" size="mini"
                          @input="hospitalizationRefundInput(scope.row)" />
              </template>
            </el-table-column>
            <!--            <el-table-column label="赠金" prop="giveCash" />-->
            <!--            <el-table-column label="赠金退款" prop="giveMoney">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-input-->
            <!--                  v-model="scope.row.giveMoney"-->
            <!--                  size="mini"-->
            <!--                  @input="rechargeCardGiveRefundInput(scope.row)"-->
            <!--                />-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
          <el-form>
            <el-form-item style="margin: 10px 0 0 0 ">
              <el-button size="mini" style="float: right; margin-left: 10px"
                         @click="showHospitalizationRefund = false">取消</el-button>
              <el-button size="mini" type="primary" style="float: right" @click.stop="submitFormHospitalizationRefund">
                确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
      <sgDialog title="储值卡结账" size="40%" :dialog="showRechargeableCard" @handleClose="handleClose">
        <div slot="out" >
          <div class="getmoney">
            <el-table ref="table" selection :data="rechargeableCardData" highlight-current-row
                      @selection-change="handleRechargeableCardChange" @row-click="rowClick"  :key="isUpdate" >
              <el-table-column type="selection" width="45" />
              <el-table-column label="储值金额" prop="amountPayable" />
              <el-table-column label="储值剩余" prop="payableSurplus" />
              <el-table-column label="本金结账" prop="principalMoney">
                <template slot-scope="scope">
                  <el-input-number  v-model="scope.row.principalMoney"  size="mini"
                                     @click.native="uploadstatus" :min="0"  ></el-input-number>
                </template>
              </el-table-column>

              <el-table-column label="赠送金额" prop="giftAmount" />
              <el-table-column label="赠送剩余" prop="giftSurplus" />
              <el-table-column label="赠金结账" prop="giveMoney">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.giveMoney"  size="mini" :min="0" @click.native="uploadstatus"
                                    />
                </template>
              </el-table-column>
              <el-table-column label="储值类型" prop="rechargeCardType">
                <template slot-scope="scope">
                <span v-if="scope.row.rechargeCardType === '3'">{{
                    scope.row.rechargeCardType === '3' ? '集团' : ''
                  }}</span>
                  <span v-for="(item, index) in dict.type.recharge_card_type" v-else :key="index">
                  <span>{{ scope.row.rechargeCardType === item.value ? item.label : '' }}</span>
                </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-form>
            <el-form-item style="margin: 10px 0 0 0 ">
              <el-button size="mini" style="float: right; margin-left: 10px" @click="handleClose">取消</el-button>
              <el-button size="mini" type="primary" style="float: right" @click.stop="submitFormRechargeCard">确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
      <sgDialog title="欠款挂账" size="50%" :dialog="showOutstandingAccount" @handleClose="handleClose">
        <div slot="out">
          <div>
            <span>预计还款时间：</span>
            <el-date-picker v-model="prepaymentTime" type="date" size="mini" placeholder="选择日期"
                            value-format="yyyy-MM-dd" />
          </div>
          <el-table :data="outstandingAccountData" highlight-current-row>
            <el-table-column label="产品名称" prop="projectName" />
            <el-table-column label="结账金额" prop="subtract">
              <template slot-scope="scope">
                <el-input v-model="scope.row.discountAmount" disabled size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="欠款金额" prop="deptPrice">
              <template slot-scope="scope">
                <el-input v-model="scope.row.deptPrice" size="mini" @input="outstandingAccountInput(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="margin: 10px 0 0 0 ">
              <el-button size="mini" style="float: right; margin-left: 10px" @click="handleClose">取消</el-button>
              <el-button size="mini" type="primary" style="float: right" @click="submitFormOutstandingAccount">确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
      <sgDialog title="储值卡退款" size="40%" :dialog="showRechargeableCardRefund" @handleClose="handleClose">
        <div slot="out">
          <el-table ref="table" selection :data="rechargeableCardRefundData" highlight-current-row
                    @selection-change="handleRechargeableCardChangeRefound" @row-click="rowClick">
            <el-table-column type="selection" width="45" />
            <el-table-column label="本金" prop="principal" />
            <el-table-column label="本金退款" prop="principalMoney">
              <template slot-scope="scope">
                <el-input v-model="scope.row.principalMoney" size="mini"
                          @input="rechargeCardPrincipalRefundInput(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="赠金" prop="giveCash" />
            <el-table-column label="赠金退款" prop="giveMoney">
              <template slot-scope="scope">
                <el-input v-model="scope.row.giveMoney" size="mini" @input="rechargeCardGiveRefundInput(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="margin: 10px 0 0 0 ">
              <el-button size="mini" style="float: right; margin-left: 10px" @click="handleClose">取消</el-button>
              <el-button size="mini" type="primary" style="float: right" @click.stop="submitFormRechargeCardRefund">
                确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
      <el-dialog title="错误提示" width="30%" :visible.sync="showDialog" :before-close="closeDialog">
        <span>
          {{ errorPrompt }}
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="closeDialog">确 定</el-button>
        </span>
      </el-dialog>
      <vue-easy-print ref="printRef" >
        <collection-settlement-print :customCardNumberlist="customCardNumberlist" :print="print" :user-info="userInfo" :details="details" :total="total"
                                     :final-pay-data="finalPayData" :newamountPayable="newamountPayable" :totalPricedata="totalPricedata"  />
      </vue-easy-print>
      <sgDialog title="会员积分结账方式" size="400px" :dialog="member" @handleClose="member = false">
        <div slot="out" style="width:100%;height:250px;">
          <el-form :model="ruleFormmember" :rules="rulesmember" ref="ruleFormmember" label-width="100px" class="demo-ruleForm">
            <el-row>
              <el-col :span="24">
                <el-form-item label="可用积分:">
                  <el-input v-model="ruleFormmember.name" size="mini" disabled>

                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="积分:金额比">
                  <el-input v-model="ruleFormmember.name1" size="mini" disabled>

                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="分配积分" prop="name2">
                  <div class="Normal">
                    <el-input-number v-model="ruleFormmember.name2" size="mini" style="width: 260px" placeholder="请输入分配积分" :min="0">

                    </el-input-number>
                  </div>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">

                <el-form-item label="抵扣金额">
                  <div class="Normal">
                  <el-input-number v-model="ruleFormmember.name3" size="mini" style="width: 260px" placeholder="请输入抵扣积分" :min="0">

                  </el-input-number>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class=""
               style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
            <div style="width: 160px;height: 40px;">
              <el-button type="primary" size="mini" @click="submitmember">确定</el-button>
              <el-button @click="member=false" size="mini">取消</el-button>
            </div>
          </div>
        </div>
      </sgDialog>
      <sgDialog title="微商城订单结账方式" size="55%" :dialog="loadingflag" @handleClose="loadingflag = false">
        <div slot="out" style="width:100%;height:500px;">
          <div>
            <span style="color:red">*</span><span>核销码</span>
            <el-input s ize="mini" style="width:200px;margin-left:10px" v-model="hxm" clearable></el-input>
            <el-button type="primary" size="mini" style="margin-left:10px" @click="searchlist">搜索</el-button>
          </div>
          <!-- 表格1 -->
          <div style="width:100%;height:30px;background-color:#1abc9c;padding-left:16px;color:#fff;margin-top:10px;line-height:30px">
            核销订单列表
          </div>
          <div style="margin-top:10px">
            <SgTable max-height="150" :columns="columns" :table-data="listData">
              <div slot="searchBar" class="searchBar" style="display:none">
              </div>
              <template #custom="data">
                <div v-if="data.props === 'name'">
                  <el-button type="text" size="mini" @click="selectData(data.custom)">选择</el-button>
                </div>
                <div v-if="data.props === 'productType'" >
                  {{ data.custom.productType=='1'?'实物':'服务' }}
                </div>
                <div v-if="data.props === 'marketingType'" >
                  {{ data.custom. marketingType=='0'?'正常购买':data.custom. marketingType=='1'?'拼团购买':'秒杀购买' }}
                </div>
              </template>
            </SgTable>
          </div>
          <!-- 表格2-->
          <div style="width:100%;height:30px;background-color:#1abc9c;padding-left:16px;color:#fff;margin-top:10px;line-height:30px">
            已选择
          </div>
          <div style="margin-top:20px">
            <SgTable max-height="150" :columns="newcolumns" :table-data="listDataone">
              <div slot="searchBar" class="searchBar" style="display:none">
              </div>
              <template #custom="data">
                <div v-if="data.props === 'name'" >
                  <el-button type="text" @click="delelistone(data.custom)">删除</el-button>
                </div>

                <div v-if="data.props === 'productType'" >
                  {{ data.custom.productType=='1'?'实物':'服务' }}
                </div>
                <div v-if="data.props === 'marketingType'" >
                  {{ data.custom. marketingType=='0'?'正常购买':data.custom. marketingType=='1'?'拼团购买':'秒杀购买' }}
                </div>

              </template>
            </SgTable>
          </div>
          <div class=""
               style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
            <div style="width: 160px;height: 40px;">
              <el-button type="primary" size="mini" @click="ok">确定</el-button>
              <el-button @click="loadingflag = false" size="mini">取消</el-button>
            </div>
          </div>
        </div>
      </sgDialog>

    </div>
  </el-scrollbar>
</template>

<script>

import { math } from '@/utils/math'
import sgDialog from '@/components/Dialog/index'
import SgTable from '@/components/Table'
import vm from '@/utils/util'
import vueEasyPrint from 'vue-easy-print'
import collectionSettlementPrint from '@/components/Print/collectionSettlementPrint'
import { LOG10E } from 'mathjs'

export default {
  dicts: ['billing_type', 'recharge_card_type', 'medication_unit'],
  components: {
    sgDialog,
    vueEasyPrint,
    collectionSettlementPrint,
    SgTable
  },
  data() {
    return {
      totalPricedata:-9988,
      readly:true,
      changeflag:false,
      IndexSelect:"",
      trueflag:false,
      changeselect:"",
      flagstatus:false,
      trueflagration:false,
      isUpdate:false,
      flagData:false,
      rulesmember:{
        name2: [
          { required: true, message: '请输入分配积分', trigger: 'blur' },
        ],
      },
      ruleFormmember:{
        name:"0",
        name1:'10:1',
        name2:"",
        name3:'',
      },
      // rulesmember:{
      //   { required: true, message: '请输入活动名称', trigger: 'blur' },
      //     { required: true, message: '请输入活动名称', trigger: 'blur' },
      // },
      member:false,
      flagprint:false,
      hxm:"",
      newamountPayable:"",
      customCardNumberlist:"",
      payId:"",
      borrowType:"",
      hsoAmount: 0.00,
      totalprice:"",
      loadingflag: false,
      listDataone: [],
      listData: [],
      columns: [
        {
          lab: '操作',
          val: 'name',
          custom:'name'
        },
        {
          lab: '姓名',
          val: 'customerName',

        },
        {
          lab: '电话',
          val: 'customPhone',
          width:150,

        },
        {
          lab: '卡号',
          val: 'customCardNumber',
          width:200,

        },
        {
          lab: '订单号',
          val: 'orderNumber',
          width:200,

        },
        {
          lab: '核销码',
          val: 'hxm',
          width:200,

        },
        {
          lab: '购买价格',
          val: 'actualPayment',

        },
        {
          lab: '购买数量',
          val: 'buyNum',

        },
        {
          lab: '实付金额',
          val: 'actualPayment',

        },
        {
          lab: '商品类别',
          val: 'productType',
          custom:'productType'

        },
        {
          lab: '产品名称',
          val: 'projectName',
          width:200,

        },
        {
          lab: '项目名称',
          val: 'cprojectName',
          width:200,

        },
        {
          lab: '营销类型',
          val:'marketingType',
          custom:'marketingType'
          // val: 'orderNumber',

        },
        {
          lab: '购买时间',
          val: 'payTime',
          width:150

        },
        {
          lab: '订单有效开始时间',
          val: 'cancelStart',
          width: 200,

        },
        {
          lab: '订单有效结束时间',
          val: 'cancelEnd',
          width: 200,

        },
        // {
        //   lab: '项目名称',
        //   val: 'orderNumber',

        // },
        // {
        //   lab: '项目价格',
        //   val: 'orderNumber',

        // },
      ],
      newcolumns: [
        {
          lab: '操作',
          val: 'name',
          custom:'name'
        },
        {
          lab: '姓名',
          val: 'customerName',

        },
        {
          lab: '电话',
          val: 'customPhone',
          width:150,

        },
        {
          lab: '卡号',
          val: 'customCardNumber',
          width:200,

        },
        {
          lab: '订单号',
          val: 'orderNumber',
          width:200,

        },
        {
          lab: '核销码',
          val: 'hxm',
          width:200,

        },
        {
          lab: '购买价格',
          val: 'actualPayment',

        },
        {
          lab: '项目名称',
          val: 'cprojectName',
          width:200,

        },
        {
          lab: '购买数量',
          val: 'buyNum',

        },
        {
          lab: '实付金额',
          val: 'actualPayment',

        },
        {
          lab: '商品类别',
          val: 'productType',
          custom:'productType'

        },
        {
          lab: '产品名称',
          val: 'projectName',
          width:200,

        },
        {
          lab: '营销类型',
          val:'marketingType',
          custom:'marketingType'
          // val: 'orderNumber',

        },
        {
          lab: '购买时间',
          val: 'payTime',
          width:150

        },

      ],
      errorPrompt: '',
      finalPayData: [],
      paymentAmount: '',
      principalMoney: '',
      giveMoney: '',
      borrowType: '',
      showDialog: false,
      print: {},
      details: [],
      intermediate: [],
      total: 0,
      disabled: false,
      loadingOrderData: false,
      showAdvancePayment: false,
      showHospitalization: false,
      showRechargeableCard: false,
      loadingPayRecord: false,
      showOutstandingAccount: false,
      showRechargeableCardRefund: false,
      showHospitalizationRefund: false,
      rechargeableCardRefundData: [],
      loadingPay: false,
      keyWord: '', // 结账方式搜索字段
      rechargeableCardData: [],

      preservation: 0, // 已付并保存
      payRecord: [], // 结账方式
      seachPayRecord: [],
      order: {},
      payData: [],
      orderData: [],
      paidAmount: 0.00,
      advancePaymentData: [],
      advancePayment: {},
      hospitalizationData: [],
      hospitalizationRefundData: [],//退住院押金的data
      hospitalization: {},
      rechargeableCard: {},
      rechargeableCardRefund: {},
      hospitalizationRefund: {},
      advancePaymentRefund: {},
      userInfo: {},
      rechargeData: [],
      adjuvantData: [],
      outstandingAccountData: [],
      repaymentData: [],
      refundData: [],
      rechargeCardType: '',
      prepaymentTime: '',
      groupPrincipal: 0,
      groupGift: 0,
      departmentalPrincipal: 0,
      departmentalGift: 0,
      companyPrincipal: 0,
      companyGift: 0,
      Vorauszahlung: 0,
      deposit: 0,
      selectionData: [],
      inputDisabled: true,
      billingPerformance: 0,
      departmentPerformance: 0,
      surplusBillingPerformance: 0,
      surplusDepartmentPerformance: 0,
      payAmount: 0,
      totalPayment: 0 // 欠款挂账
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
      this.getPayDeptChannelRecord()
      this.getCustomCardSum()
      this.getAdvancePayment()
    }
  },
  created() {

    // this.order = JSON.parse(this.$route.query.order)
    this.order = JSON.parse(sessionStorage.getItem('collectionSettlement'))
    this.newamountPayable=this.order.amountPayable
    this.customCardNumberlist=this.order.customCardNumber
    if (this.order.billType === '3' || this.order.billType === '4' || this.order.billType === '13') {
      const temp = {
        rechargeCardId: this.order.rechargeCardId,
        amountPayable: this.order.amountPayable,
        giftAmount: this.order.giftAmount,
        rechargeCardType: this.order.rechargeCardType
      }
      this.rechargeData.push(temp)
      localStorage.setItem('orderTypelistnew',true)
      this.details.push(temp)
    }else{
      localStorage.setItem('orderTypelistnew',false)
    }

    this.print = this.order
    this.total = this.order.amountPayable
    this.userInfo = this.$store.getters.user
    this.getPayDeptChannelRecord()
    this.getAdvancePayment()
    this.getHospitalization()
    this.getOrderDetails()
    this.getCustomCardSum()
    this.mathPayment()
  },
  methods: {
    Readonly(){
      this.readly=false
    },
    uploadstatus(e){
      this.flagstatus=true;
    },
    //会员积分结账方法
    submitmember(){
      this.$refs.ruleFormmember.validate((valid) => {
        if (valid) {
          this.member=false;
          if (this.payData.findIndex(item => item.payId === {
            payName:'会员积分',
            paymentAmount:'',
            remark:'',
            payId:this.payId,
            borrowType:this.borrowType
          }.payId) === -1) {
            this.payData.push({
              payName:'会员积分',
              paymentAmount:'',
              remark:'',
              payId:this.payId,
              borrowType:this.borrowType
            })
          } else {
            this.$message.warning('请勿选择重复的收银科目！')
          }

        } else {
          return false;
        }
      })
    },
    delelistone(data){
      this.listDataone.forEach((value,index)=>{
        if(value.orderNumber==data.orderNumber){
          this.listDataone.splice(index,1)
        }
      })
    },
    selectData(data){
      let flag=false;
      let sum=0;
      if(this.listDataone.length>=1){
        this.listDataone.forEach(value=>{
          value.paymentAmount=value.actualPayment
          if(value.orderNumber==data.orderNumber){
            flag=true
            sum+=Number(data.actualPayment)
          }
        })
      }
      if(flag){
        this.$message.warning('不可重复添加核销订单')
        return
      }
      this.totalprice=sum
      data.paymentAmount=data.actualPayment
      this.listDataone.push(data)
    },
    searchlist(){
      if(this.hxm==''||this.hxm==null){
        this.$message.warning('请输入核销码');
        return;
      }
      let data={
        cancelCode:this.hxm
      }
      this.$api.confinementRoom.getOrderInfoByCancelCode(data).then(res=>{
        if(res.data==null){
          this.$message.error('请输入正确的核销码')
        }else{
          res.data.hxm=this.hxm
          this.listData=[];
          this.listData.push(res.data)
        }

      })
      //  this.listData.push({
      //   name:'李磊'
      //  })
    },
    ok() {
      if(this.listDataone.length==0){
        this.$message.warning('请选择核销订单');
        return
      }
      let flag=false;
      this.payData.forEach(value=>{
        this.listDataone.forEach(values=>{
          if(values.hxm==value.remark){
            flag=true;

          }
        })
      })
      if(flag){
        this.$message.warning('不可重复添加结账信息');
        return
      }
      this.listDataone.forEach(value=>{
        this.payData.push({
          payName:'微商城订单',
          paymentAmount:value.paymentAmount,
          remark:value.hxm,
          paymentCardItem:value.orderInfoId,
          disabled:true,
          payId:this.payId,
          borrowType:this.borrowType
        })
      })
      this.mathPayment();
      this.loadingflag =false;
    },
    loadmore() {
      this.loadingflag = true;
      this.hxm='';
      this.listData=[];
      this.listDataone=[]
    },
    /**
     * @author Nevin
     * @date 2022/6/25
     * @Description: 测试收费单打印
     */
    ceshi() {
      this.$nextTick(() => {
        this.$refs.printRef.getChange(this.payData)
        this.$refs.printRef.print()

      })
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    /**
     * @author Nevin
     * @date 2022/5/16
     * @Description: 收费单类型
     */
    BillTypeName(str,order) {
      if(str==13){
        if(order.rechargeCardType=='3'){
          return '退集团储值'
        }
        if(order.rechargeCardType=='1'){
          return '退公司储值'
        }
        if(order.rechargeCardType=='2'){
          return '退部门储值'
        }
      }else{
        const obj = this.dict.type.billing_type.find(item => item.value === str)
        return obj ? obj.label : ''
      }

    },
    /**
     * @author Nevin
     * @date 2022/5/20
     * @Description: 预约金结账金额
     */
    advancePaymentInput(row) {
      this.advancePaymentData.forEach(item => {
        if (item.paymentAmount > item.remainingAmount) {
          this.$message.error('结账金额不能大于剩余金额！')
          item.paymentAmount = 0
        }

        this.$forceUpdate()

      })
      // const mm = this.advancePaymentData.filter(item=>item.paymentAmount>0)
      //  if (mm.length>0){
      //      this.$message.error('000！')
      //  }

      // this.advancePayment.paymentAmount = row.paymentAmount
      // this.advancePayment = Object.assign(this.advancePayment, row)
      // if (this.payData.length !== 0) {
      //   this.payData.forEach(item => {
      //     if (row.advancePaymenId !== item.advancePaymenId) {
      //       // this.advancePayment = Object.assign(this.advancePayment, row)
      //     }
      //   })
      // } else {
      //   this.advancePayment = Object.assign(this.advancePayment, row)
      // }
    },
    /**
     * @author wsj
     * @date 2022/9/17
     * @Description: 住院押金输入
     */
    hospitalizationInput(row) {
      this.hospitalizationData.forEach(item => {
        console.log('123456', item)
        // if (item.paymentAmount > item.remainingAmount) {
        //   this.$message.error('结账金额不能大于剩余金额！')
        //   item.paymentAmount = 0
        // }
        this.$forceUpdate()
      })
    },
    /**
     * @Description: 退住院押金输入
     */
    hospitalizationRefundInput(row) {
      this.hospitalizationRefundData.forEach(item => {
        if (item.paymentAmountRefund > item.paymentAmount) {
          this.$message.error('退款本金不能大于本金！')
          item.paymentAmountRefund = 0
        }
        this.$forceUpdate()
      })
      this.hospitalizationRefund = Object.assign(this.hospitalizationRefund, row)

    },

    /**
     * @author Nevin
     * @date 2022/5/21
     * @Description: 储值本金结账金额
     */
    rechargeCardPrincipalInput(row) {
      this.rechargeableCardData.forEach(item => {
        if (item.principalMoney > item.payableSurplus) {
          this.$message.error('结账金额不能大于剩余金额！')
          item.principalMoney = 0
        }
        this.$forceUpdate()
      })
      // this.rechargeableCard = Object.assign(this.rechargeableCard, row)
    },
    /**
     * @author Nevin
     * @date 2022/5/21
     * @Description: 储值赠送结账金额
     */
    rechargeCardGiveInput(row) {
      this.rechargeableCardData.forEach(item => {
        if (item.giveMoney > item.giftSurplus) {
          this.$message.error('结账金额不能大于剩余金额！')
          item.giveMoney = 0
        }
        this.$forceUpdate()
      })
      // this.rechargeableCard = Object.assign(this.rechargeableCard, row)
    },
    /**
     * @author Nevin
     * @date 2022/6/26
     * @Description: 储值本金退款
     */
    rechargeCardPrincipalRefundInput(row) {
      this.rechargeableCardRefundData.forEach(item => {
        if (item.principalMoney > item.principal) {
          this.$message.error('退款本金不能大于本金！')
          item.principalMoney = 0
        }
        this.$forceUpdate()
      })
      this.rechargeableCardRefund = Object.assign(this.rechargeableCardRefund, row)
    },
    /**
     * @author Nevin
     * @date 2022/6/26
     * @Description: 储值赠金退款
     */
    rechargeCardGiveRefundInput(row) {
      this.rechargeableCardRefundData.forEach(item => {
        if (item.giveMoney > item.giveCash) {
          this.$message.error('退款赠金不能大于赠金！')
          item.giveMoney = 0
        }
        this.$forceUpdate()
      })
      this.rechargeableCardRefund = Object.assign(this.rechargeableCardRefund, row)
    },
    /**
     * @author Nevin
     * @date 2022/5/21
     * @Description: 欠款挂账金额
     */
    outstandingAccountInput(row) {
      if (row.deptPrice > row.discountAmount) {
        this.$message.error('欠款金额不能大于原有金额！')
        row.deptPrice = 0
      }
      this.$forceUpdate()
    },
    /**
     * @author Nevin
     * @date 2022/5/16
     * @Description: 获取订单详情
     */
    getOrderDetails() {
      if (this.order.billType === '1' || this.order.billType === '7' || this.order.billType === '8' || this.order.billType === '9' || this.order.billType === '19' || this.order.billType === '20' ||
        this.order.billType === '11' || this.order.billType === '22' || this.order.billType === '6' || this.order.billType === '16' || this.order.billType === '15' || this.order.billType === '21') {
        this.loadingOrderData = true
        this.$api.billingList.orderDetailsList({
          orderNumber: this.order.orderNumber
        }).then(res => {
          this.orderData = res.rows
          this.details = res.rows
          console.log(this.details,'eeeee')
        }).finally(() => {
          this.loadingOrderData = false
        })
      } else if (this.order.billType === '2') {
        this.loadingOrderData = true
        // 为了有小的编号
        this.$api.billingList.reservationDataDetailed({
          orderNumber: this.order.orderNumber
        }).then(res => {
          this.orderData = res.rows
          this.details = res.rows
          console.log(this.details,'bbbbb')
        }).finally(() => {
          this.loadingOrderData = false
        })
      }
        // else if (this.order.billType === '6') {
        //   this.$api.billingList.adjuvantBillingList({
        //     relationshipNumber: this.order.orderNumber
        //   }).then(res => {
        //     this.adjuvantData = res.rows
        //     this.details = res.rows
        //   }).finally(() => {
        //     this.loadingOrderData = false
        //   })
      // }

      else if (this.order.billType === '12' || this.order.billType === '14' || this.order.billType === '17') {
        // console.log("02")
        // return ;
        this.loadingOrderData = true
        this.$api.billingList.orderDetailsList({
          orderNumber: this.order.orderNumber
        }).then(res => {
          this.rechargeData = res.rows
          this.rechargeData.forEach(item => {
            item.remainingAmount = item.totalAmount
          })
          this.details = res.rows
          console.log(this.details,'ccc')
        }).finally(() => {
          this.loadingOrderData = false
        })
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description: 个人账户信息
     */
    getCustomCardSum() {
      this.$api.RechargeableCard.customCardSum({
        id: this.order.id
      }).then(res => {
        if (res.rows.length !== 0) {
          this.groupPrincipal = res.rows[0].groupPrincipal
          this.groupGift = res.rows[0].groupGift
          this.companyPrincipal = res.rows[0].companyPrincipal
          this.companyGift = res.rows[0].companyGift
          this.departmentalPrincipal = res.rows[0].departmentalPrincipal
          this.departmentalGift = res.rows[0].departmentalGift
          this.deposit = res.rows[0].deposit
          this.Vorauszahlung = res.rows[0].advancePayment
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description: 删除支付方式
     */
    payDelete(row, index) {
      // row.paymentAmount = ''
      row.remark = undefined;
      console.log(this.rechargeableCardData,'黑')
      this.$delete(this.payData, index)
      this.rechargeableCardData.forEach(item => {
        if (item.rechargeCardId === row.rechargeCardId) {
          // this.rechargeableCardData = []
          if(item.principalMoney){
            item.payableSurplus+=row.paymentAmount
          }else{
            if(item.payableSurplus+row.paymentAmount==item.amountPayable){
              item.payableSurplus+=row.paymentAmount
            }
          }
         if(item.giveMoney){
            item.giftSurplus+=row.paymentAmount
          }else{
           if(item.giftSurplus+row.paymentAmount==item.giftAmount){
             item.giftSurplus+=row.paymentAmount
           }
         }
          // item.giftAmount+=row.paymentAmount
          item.principalMoney=undefined;
          item.giveMoney=undefined;
          this.$forceUpdate()
        }
      })
      // this.advancePaymentData = []
      // this.hospitalizationData = []
      this.mathPayment()
    },
    /**
     * @author Nevin
     * @date 2022/5/17
     * @Description: 计算已付金额和剩余金额
     */
    mathPayment() {
      let paidAmount = 0
      this.payData=this.qurArr(this.payData)
      this.payData.forEach(item => {
        if (item.paymentAmount > 0) {
          paidAmount = math.add(paidAmount, item.paymentAmount)
        }
      })
      this.paidAmount = paidAmount
      this.preservation = math.subtract(this.order.amountPayable, this.paidAmount)
    },
    /** 获取结账方式*/
    /**
     * @author 李尚
     * @date 2022/6/24
     * @Description: 添加状态
     */
    getPayDeptChannelRecord() {
      const data = {
        deptId: this.deptId,
        billType: this.order.billType,
        status: '0'
      }
      this.$api.finance.payDeptChannelRecord(data).then(res => {
        if (this.order.billType === '11' || this.order.billType === '22' || this.order.billType === '15' || this.order.billType === '16' || this.order.billType === '20') {
          res.rows.forEach(item => {
            if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6' || item.borrowType === '3') {
              item.payName = '退回' + item.payName
            }
          })
        }
        this.payRecord = res.rows
        this.seachPayRecord = res.rows


      })
    },
    /**
     * @author Nevin
     * @date 2022/5/27
     * @Description: 结账方式搜索
     */
    searchPayRecord(payName){
        let that=this;
        if(payName==''){
          this.readly=true;
          setTimeout(function (){
            that.readly=false;
          },200)
          }
      this.seachPayRecord = this.payRecord.filter(item => {
        return item.payName.indexOf(payName) !== -1
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/16
     * @Description: 结账方式点击
     */
    payClick(res) {
      // this.getPayDeptChannelRecord()
      if (res.borrowType === '2') {
        if (this.payData.length !== 0) {
          if (this.advancePaymentData.length === 0) {
            this.showAdvancePayment = true
            this.advancePayment = Object.assign(res, this.advancePayment)
          } else {
            this.advancePaymentData.forEach(item => {
              this.payData.forEach(value => {
                if (item.advancePaymenId === value.advancePaymenId) {
                  this.showAdvancePayment = true
                  item.paymentAmount = undefined
                  this.advancePayment = Object.assign(res, this.advancePayment)
                } else {
                  // this.getAdvancePayment()
                  this.showAdvancePayment = true
                  this.advancePayment = Object.assign(res, this.advancePayment)
                }
              })
            })
          }
        } else {
          this.getAdvancePayment()
          this.showAdvancePayment = true
          this.advancePayment = Object.assign(res, this.advancePayment)
        }
      }
      else if(res.borrowType === '10'){
        this.loadingflag=true;
        this.hxm='';
        this.listData=[];
        this.listDataone=[]
        this.payId=res.payId;
        this.borrowType=res.borrowType
      }
      else if(res.borrowType=='11'){
        this.member=true;
        this.payId=res.payId;
        this.borrowType=res.borrowType;
        this.ruleFormmember.name2='';
        this.ruleFormmember.name3='';
      }
      else if (res.borrowType === '4' || res.borrowType === '5' || res.borrowType === '6') {
        if (this.order.billType === '11' || this.order.billType === '22' || this.order.billType === '15' || this.order.billType === '16' || this.order.billType === '20') {
          if (this.rechargeableCardRefundData.length === 0 || res.borrowType !== this.borrowType) {
            this.$api.billingList.selectOldPayRecords({
              borrowType: res.borrowType,
              chargeSheetId: this.order.chargeSheetId
            }).then(result => {
              if (result) {
                result.data.forEach(item => {
                  this.$set(item, 'principal', item.principalMoney)
                  this.$set(item, 'giveCash', item.giveMoney)
                })
                this.rechargeableCardRefundData = result.data
                this.showRechargeableCardRefund = true
                this.rechargeableCardRefund = Object.assign(res, this.rechargeableCardRefund)
                this.borrowType = res.borrowType
              }
            })
          } else {
            this.showRechargeableCardRefund = true
            this.rechargeableCardRefund = Object.assign(res, this.rechargeableCardRefund)
            this.borrowType = res.borrowType
          }
        } else {
          if (this.payData.length !== 0) {
            if (this.rechargeableCardData.length === 0) {
              this.getRechargeableCard(res.borrowType)//获取顾客储值卡列表
              this.changeflag=true
              this.showRechargeableCard = true
              this.rechargeableCard = Object.assign(res, this.rechargeableCard)
              this.selectionData=[]
            } else {
              this.getRechargeableCard(res.borrowType)
              this.rechargeableCardData.forEach(item => {
                this.payData.forEach(value => {
                  if (item.rechargeId === value.rechargeId) {
                    this.changeflag=true
                    this.showRechargeableCard = true
                    this.selectionData=[]
                    item.principalMoney = undefined
                    item.giveMoney = undefined
                    item.inputDisabled = true
                    this.rechargeableCard = Object.assign(res, this.rechargeableCard)
                  } else {
                    // this.getAdvancePayment()
                    item.inputDisabled = false
                    this.changeflag=true
                    this.showRechargeableCard = true
                    this.selectionData=[]
                    this.rechargeableCard = Object.assign(res, this.rechargeableCard)
                  }
                })
              })
            }
          } else {
            this.getRechargeableCard(res.borrowType) // 获取顾客储值卡列表
            this.changeflag=true
            this.showRechargeableCard = true
            this.selectionData=[]
            this.rechargeableCard = Object.assign(res, this.rechargeableCard)
          }
        }
      } else if (res.borrowType === '3') {
        if (this.order.billType === '11' || this.order.billType === '22' || this.order.billType === '15' || this.order.billType === '16' || this.order.billType === '20') {
          if (this.hospitalizationRefundData.length === 0 || res.borrowType !== this.borrowType) {
            console.log('推住院押金')
            this.$api.billingList.selectOldPayRecords({
              borrowType: res.borrowType,
              chargeSheetId: this.order.chargeSheetId
            }).then(result => {
              if (result) {
                result.data.forEach(item => {
                  this.$set(item, 'paymentAmountRefund', item.paymentAmount)
                })
                this.hospitalizationRefundData = result.data
                this.showHospitalizationRefund = true
                this.hospitalizationRefund = Object.assign(res, this.hospitalizationRefund)
                this.borrowType = res.borrowType
              }
              console.log(result, 'ssss')
            })
          } else {
            console.log('推住院押金11')
            this.showHospitalizationRefund = true
            this.hospitalizationRefund = Object.assign(res, this.hospitalizationRefund)
            this.borrowType = res.borrowType
          }
        } else {
          console.log('用住院押金收矿结账')
          if (this.payData.length !== 0) {
            if (this.hospitalizationData.length === 0) {
              this.showHospitalization = true
              this.hospitalization = Object.assign(res, this.hospitalization)
            } else {
              this.hospitalizationData.forEach(item => {
                this.payData.forEach(value => {
                  if (item.hospitalizationId === value.hospitalizationId) {
                    this.showHospitalization = true
                    item.paymentAmount = undefined
                    this.hospitalization = Object.assign(res, this.hospitalization)
                  } else {
                    this.showHospitalization = true
                    this.hospitalization = Object.assign(res, this.hospitalization)
                  }
                })
              })
            }
          } else {
            this.getHospitalization()
            this.showHospitalization = true
            this.hospitalization = Object.assign(res, this.hospitalization)
          }
        }
      } else if (res.borrowType === '7') {
        if (this.order.billType === '1' || this.order.billType === '21' || this.order.billType === '19' || this.order.billType === '7' || this.order.billType === '8' || this.order.billType === '6') {
          this.outstandingAccountData = this.orderData
        }
        // else if (this.order.billType === '6') {
        //   this.outstandingAccountData = this.adjuvantData
        // }
        if (this.payData.length !== 0) {
          if (this.payData.findIndex(item => item.payId === res.payId) === -1) {
            this.payData.push(res)
            // alert('1')
            this.showOutstandingAccount = true
          } else {
            this.$message.warning('请勿选择重复的收银科目！')
          }
        } else {
          this.payData.push(res)
          // alert('2')
          this.showOutstandingAccount = true
        }
      } else {
        if (this.payData.length !== 0) {
          if (this.payData.findIndex(item => item.payId === res.payId) === -1) {
            this.payData.push(res)
            // alert('3')
          } else {
            this.$message.warning('请勿选择重复的收银科目！')
          }
        } else {
          this.payData.push(res)
          // alert('4')
        }
      }
      this.mathPayment()
    },
    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 预约金选中
     */
    handleAdvancePaymentChange(e) {
      this.selectionData = []
      if (e.length > 1) {
        this.$refs.advancePaymentTable.clearSelection()
        this.$refs.advancePaymentTable.toggleRowSelection(e.pop())
      }
      this.selectionData.push(e.pop())
      this.$delete(this.selectionData, 1)
      this.advancePaymentData.forEach(item => {
        if (item.paymentAmount > 0) {
          item.paymentAmount = 0
          this.$message.warning('每次只能使用一张预约金卡，如果使用多张请重复操作')
        }
        if (this.selectionData[0] != undefined && this.selectionData[0].advancePaymenId === item.advancePaymenId) {
          item.inputDisabled = false
        } else {
          item.inputDisabled = true
        }
      })
    },

    /**
     * @author wsj
     * @date 2022/9/17
     * @Description: 住院押金选中
     */
    handleHospitalizationChange(e) {
      this.selectionData = []
      if (e.length > 1) {
        this.$refs.hospitalizationTable.clearSelection()
        this.$refs.hospitalizationTable.toggleRowSelection(e.pop())
      }
      this.selectionData.push(e.pop())
      this.$delete(this.selectionData, 1)
      this.hospitalizationData.forEach(item => {
        if (this.selectionData[0].hospitalizationId === item.hospitalizationId) {
          item.inputDisabled = false
        } else {
          item.inputDisabled = true
        }
      })
    },
    /**
     * @Description: 退款住院押金选中
     */
    handleHospitalizationChangeRefound(e) {
      this.selectionData = []
      if (e.length > 1) {
        this.$refs.hospitalizationTable.clearSelection()
        this.$refs.hospitalizationTable.toggleRowSelection(e.pop())
      }
      this.selectionData.push(e.pop())
      this.$delete(this.selectionData, 1)
      this.hospitalizationRefund = Object.assign(this.hospitalizationRefund, this.selectionData[0])
      // this.hospitalizationData.forEach(item => {
      //   if (this.selectionData[0].hospitalizationId === item.hospitalizationId) {
      //     item.inputDisabled = false
      //   } else {
      //     item.inputDisabled = true
      //   }
      // })
    },
    /**
     * @author Nevin
     * @date 2022/5/21
     * @Description: 储值卡选中
     */
    handleRechargeableCardChange(e) {
      let that=this;
      this.selectionData = []
      if (e.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(e.pop())
      }
      this.selectionData.push(e.pop())
      this.$delete(this.selectionData, 1)
      // this.rechargeableCardData.forEach((item,index) => {
      //   if(this.selectionData[0]){
      //     if (this.selectionData[0].rechargeId === item.rechargeId) {
      //       item.inputDisabled = false
      //       this.$set(this.rechargeableCardData,index,item)
      //     } else {
      //       item.inputDisabled = true
      //       this.$set(this.rechargeableCardData,index,item)
      //     }
      //   }
      //
      // })
      this.rechargeableCard = Object.assign(this.rechargeableCard, this.selectionData[0])
      let len=document.querySelector('.getmoney .el-table .el-table__body').children[1].children;
      for(let i=0;i<len.length;i++){
          len[i].children[3].children[0].children[0].classList.add('is-disabled');
          len[i].children[3].children[0].children[0].children[2].classList.add('is-disabled');
          len[i].children[3].children[0].children[0].children[2].children[0].setAttribute('disabled',true)
          len[i].children[6].children[0].children[0].classList.add('is-disabled');
          len[i].children[6].children[0].children[0].children[2].classList.add('is-disabled');
          len[i].children[6].children[0].children[0].children[2].children[0].setAttribute('disabled',true)
        setTimeout(function (){
          if(len[i].children[0].children[0].children[0].className.includes("is-checked")){
            that.IndexSelect=i;

          }
        },10)

      }
      setTimeout(function (){
        len[that.IndexSelect].children[3].children[0].children[0].classList.remove('is-disabled');
        len[that.IndexSelect].children[3].children[0].children[0].children[2].classList.remove('is-disabled');
        len[that.IndexSelect].children[3].children[0].children[0].children[2].children[0].removeAttribute('disabled')
        len[that.IndexSelect].children[6].children[0].children[0].classList.remove('is-disabled');
        len[that.IndexSelect].children[6].children[0].children[0].children[2].classList.remove('is-disabled');
        len[that.IndexSelect].children[6].children[0].children[0].children[2].children[0].removeAttribute('disabled')
        that.rechargeableCardData.forEach((value,index)=>{
          if(index!==that.IndexSelect){
            value.principalMoney=undefined;
            value.giveMoney=undefined;
          }

        })
      },20)



    },
    /**
     * @author Nevin
     * @date 2022/6/26
     * @Description: 储值退款选中
     */
    handleRechargeableCardChangeRefound(e) {
      this.selectionData = []
      // if (e.length > 1) {
      //   this.$refs.table.clearSelection()
      //   this.$refs.table.toggleRowSelection(e.pop())
      // }
      this.selectionData=e;
      // this.$delete(this.selectionData, 1)
      for(let i=0;i<this.selectionData.length;i++){
        this.rechargeableCardRefund = Object.assign(this.rechargeableCardRefund, this.selectionData[i])
      }

    },
    /**
     * @author Nevin
     * @date 2022/6/10
     * @Description: 行内点击
     */
    rowClick(e) {
      if(!this.flagstatus){
        this.trueflagration=true
        this.IndexSelect=this.rechargeableCardData.indexOf(e)
        this.$refs.table.toggleRowSelection(e)
        this.changeselect=e;

      }else{
        this.flagstatus=false
      }


    },
    /**
     * @author Nevin
     * @date 2022/6/10
     * @Description: 行内点击
     */
    rowAdvancePaymentClick(e) {
      this.$refs.advancePaymentTable.clearSelection()
      this.$refs.advancePaymentTable.toggleRowSelection(e)
    },
    /**
     * @author wsj
     * @date 2022/9/17
     * @Description: 行内点击
     */
    rowHospitalizationClick(e) {
      this.$refs.hospitalizationTable.clearSelection()
      this.$refs.hospitalizationTable.toggleRowSelection(e)
    },
    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 关闭弹窗
     */
    handleClose() {
      this.showAdvancePayment = false
      this.showHospitalization = false
      this.showRechargeableCard = false
      this.showOutstandingAccount = false
      this.showRechargeableCardRefund = false
      this.advancePayment = {}
      this.hospitalization = {}
      this.rechargeableCard = {}
      this.rechargeableCardRefund = {}
      // this.rechargeableCardData = []
      this.rechargeableCardRefundData = []
      this.selectionData = []
      this.payData.forEach((item, index) => {
        if (item.borrowType === '7') {
          this.$delete(this.payData, index)
        }
      })
      // this.rechargeableCardData.forEach(item => {
      //   item.principalMoney = ''
      //   item.giveMoney = ''
      //   this.$forceUpdate()
      // })
    },
    /**
     * @author Nevin
     * @date 2022/6/26
     * @Description: 关闭错误提示框
     */
    closeDialog() {
      this.showDialog = false
      this.payData = []
      this.mathPayment()
    },
    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 预约金支付点击确定
     */
    submitFormAdvancePayment() {
      this.advancePayment = Object.assign(this.advancePayment, this.selectionData[0])
      if (this.advancePayment.advancePaymenId === undefined) {
        this.$message.error('请先选择要使用的预约金！')
      } else if (this.advancePayment.paymentAmount === undefined) {
        this.$message.error('请填写结账金额！')
      } else if (this.advancePayment.paymentAmount > this.advancePayment.remainingAmount) {
        this.$message.error('结账金额不能大于剩余金额！')
      } else {
        // 通过字符串转换为this.advancePayment重新开辟一块空间，防止push后同时修改this.payData中的所有数据
        this.payData.push(JSON.parse(JSON.stringify(this.advancePayment)))
        this.advancePaymentData.forEach(item => {
          if (item.advancePaymenId === this.advancePayment.advancePaymenId) {
            item.remainingAmount = math.subtract(item.remainingAmount, item.paymentAmount)
          }
        })
        this.payData.forEach(item => {
          if (item.borrowType === '2') {
            item.disabled = true
          }
        })
        this.showAdvancePayment = false
        this.mathPayment()
        this.advancePayment = {}
        this.selectionData = []
        this.advancePaymentData.forEach(item => {
          item.inputDisabled = item.remainingAmount === 0
        })
      }
    },

    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 住院押金支付点击确定
     */
    submitFormHospitalization() {
      this.hospitalization = Object.assign(this.hospitalization, this.selectionData[0])
      if (this.hospitalization.hospitalizationId === undefined) {
        this.$message.error('请先选择要使用的住院押金！')
      } else if (this.hospitalization.paymentAmount === undefined) {
        this.$message.error('请填写结账金额！')
      }
        // else if (this.hospitalization.paymentAmount > this.hospitalization.remainingAmount) {
        //   this.$message.error('结账金额不能大于剩余金额！')
      // }
      else {
        // 通过字符串转换为this.advancePayment重新开辟一块空间，防止push后同时修改this.payData中的所有数据
        this.payData.push(JSON.parse(JSON.stringify(this.hospitalization)))
        console.log('添加的数据', JSON.parse(JSON.stringify(this.hospitalization)))
        this.hospitalizationData.forEach(item => {
          if (item.hospitalizationId === this.hospitalization.hospitalizationId) {
            item.remainingAmount = math.subtract(item.remainingAmount, item.paymentAmount)
          }
        })
        this.payData.forEach(item => {
          console.log(item)
          if (item.borrowType === '3') {
            item.disabled = true
          }
        })
        this.showHospitalization = false
        this.mathPayment()
        this.hospitalization = {}
        this.selectionData = []
        this.hospitalizationData.forEach(item => {
          item.inputDisabled = item.remainingAmount === 0
        })
      }
    },
    /**
     * @Description: 住院押金退款提交
     */
    submitFormHospitalizationRefund() {
      if (this.hospitalizationRefund.paymentCardItem === undefined) {
        this.$message.error('请先选择要退款的数据！')
      } else if (this.hospitalizationRefund.paymentAmountRefund === undefined) {
        this.$message.error('请填写退款本金！')
      } else {
        if (this.hospitalizationRefund.paymentAmountRefund === undefined) {
          this.hospitalizationRefund.paymentAmountRefund = 0
          this.showHospitalizationRefund = false
          this.hospitalizationRefund.paymentAmountRefund = this.hospitalizationRefund.paymentAmountRefund
          this.hospitalizationRefund.paymentAmountRefund = math.add(this.hospitalizationRefund.paymentAmountRefund)
          this.payData.push(this.hospitalizationRefund)
          this.hospitalizationRefundData.forEach(item => {
            if (item.paymentCardItem === this.hospitalizationRefund.paymentCardItem) {
              item.paymentAmount = math.subtract(item.paymentAmount)
            }
          })
          this.payData.forEach(item => {
            if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6' || item.borrowType === '3') {
              item.disabled = true
            }
          })
          this.mathPayment()
        } else {
          this.showHospitalizationRefund = false
          this.hospitalizationRefund.paymentAmountRefund = this.hospitalizationRefund.paymentAmountRefund
          console.log(this.hospitalizationRefund.paymentAmountRefund)
          this.hospitalizationRefund.paymentAmount = math.add(this.hospitalizationRefund.paymentAmountRefund)
          this.payData.push(this.hospitalizationRefund)
          this.rechargeableCardRefundData.forEach(item => {
            if (item.paymentCardItem === this.hospitalizationRefund.paymentCardItem) {
              item.paymentAmount = math.subtract(item.paymentAmount, this.hospitalizationRefund.paymentAmount)
            }
          })
          this.payData.forEach(item => {
            if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6' || item.borrowType === '3') {
              item.disabled = true
            }
          })
          this.mathPayment()
        }
      }
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.rechargeId) && res.set(arr.rechargeId, 1))
    },
    /**
     * @author Nevin
     * @date 2022/5/21
     * @Description: 储值支付点击确定
     */

    submitFormRechargeCard() {
      // principalMoney
      // giveMoney
      if(this.selectionData.length==0||this.selectionData[0]==undefined){
        this.$message.error('请选择储值卡！')
        return;
      }else{
        if(this.selectionData[0].principalMoney>0&&this.selectionData[0].giveMoney>0){
          this.$message.error('请选择本金结账或增金结账其中一种！')
          return;
        }else{
          if(this.selectionData[0].principalMoney>this.selectionData[0].payableSurplus){
            this.$message.error('本金结账金额大于本金剩余金额！')
            this.selectionData[0].principalMoney=undefined;
            return;
          }
          if(this.selectionData[0].giveMoney>this.selectionData[0].giftSurplus){
            this.selectionData[0].giveMoney=undefined;
            this.$message.error('增金结账金额大于增金剩余金额！')
            return;
          }
        }
        if(this.selectionData[0].principalMoney==0&&this.selectionData[0].payableSurplus==0&&this.selectionData[0].giftSurplus>0&&this.selectionData[0].giveMoney==undefined){
          this.selectionData[0].principalMoney=undefined;
          this.$message.error('储值剩余金额已为0,不能添加！')
          return;
        }else{
          if(this.selectionData[0].principalMoney==0&&this.selectionData[0].payableSurplus==0){
            this.$message.error('请选择本金结账或增金结账其中一种！')
            return;
          }
        }
        if(this.selectionData[0].giveMoney==0&&this.selectionData[0].giftSurplus==0){
          if(this.selectionData[0].principalMoney==0){
            this.$message.error('请选择本金结账或增金结账其中一种！')
            return;
          }else{
            if(this.selectionData[0].principalMoney<this.selectionData[0].payableSurplus){

            }else{
              this.$message.error('增金剩余金额已为0,不能添加！')
              this.selectionData[0].giveMoney=undefined;
              return;
            }


          }

        }
        if(this.selectionData[0].principalMoney==undefined&&this.selectionData[0].giftSurplus>0&&this.selectionData[0].giveMoney==0){
          this.$message.error('增金结账金额不能为0,不能添加！')
          return;
        }
        if(this.selectionData[0].principalMoney==0&&this.selectionData[0].payableSurplus>0&&this.selectionData[0].giftSurplus>0&&this.selectionData[0].giveMoney==0){
          this.$message.error('本金结账金额为0,不能添加！')
          return;
        }
        if(this.selectionData[0].principalMoney==0){
          this.$message.error('本金结账金额为0,不能添加！')
          return;
        }
        if(this.selectionData[0].principalMoney==undefined&&this.selectionData[0].giveMoney==undefined){
          this.$message.error('请输入至少一种结账金额！')
          return;
        }
        // if(this.selectionData[0].giveMoney>0){
        //
        // }else{
        //   if(this.selectionData[0].principalMoney==0||this.selectionData[0].principalMoney==""||this.selectionData[0].principalMoney==undefined){
        //     this.$message.error('请填写所选储值卡本金金额！')
        //     return;
        //   }
        // }

      }
      this.rechargeableCard = Object.assign(this.rechargeableCard, this.selectionData[0])
      if (this.payData.length !== 0) {
        this.payData.forEach(val => {
          if (val.rechargeId === this.rechargeableCard.rechargeId) {
            this.$message.error('不能选择同一张储值卡！')
            this.showRechargeableCard = true
            return;
          }
          else if (this.rechargeableCard.rechargeId === undefined) {
            this.$message.error('不能选择同一张储值卡！')
            this.showRechargeableCard = true
            return;
          }
          else if (this.rechargeableCard.principalMoney === undefined && this.rechargeableCard.giftAmount === undefined) {
            this.$message.error('请填写结账金额！')
            this.showRechargeableCard = true
            return;
          }
          else {
            if (this.rechargeableCard.giveMoney === undefined || this.rechargeableCard.giveMoney === 0) {
              this.rechargeableCard.giveMoney = 0
              this.showRechargeableCard = false
              this.rechargeableCard.principalMoney = this.rechargeableCard.principalMoney
              this.rechargeableCard.giveMoney = this.rechargeableCard.giveMoney
              this.rechargeableCard.paymentAmount = math.add(this.rechargeableCard.principalMoney, this.rechargeableCard.giveMoney)
              console.log(this.payData.indexOf(JSON.parse(JSON.stringify(this.rechargeableCard))))
              this.payData.push(JSON.parse(JSON.stringify(this.rechargeableCard)))
              this.rechargeableCardData.forEach(item => {
                if (item.rechargeId === this.rechargeableCard.rechargeId) {
                  item.payableSurplus = math.subtract(item.payableSurplus, item.principalMoney)
                  item.inputDisabled = false
                }
              })
              this.mathPayment()
            }
            else if (this.rechargeableCard.principalMoney === undefined || this.rechargeableCard.principalMoney === 0) {
              this.rechargeableCard.principalMoney = 0
              this.showRechargeableCard = false
              this.rechargeableCard.principalMoney = this.rechargeableCard.principalMoney
              this.rechargeableCard.giveMoney = this.rechargeableCard.giveMoney
              this.rechargeableCard.paymentAmount = math.add(this.rechargeableCard.principalMoney, this.rechargeableCard.giveMoney)
              this.payData.push(JSON.parse(JSON.stringify(this.rechargeableCard)))
              this.rechargeableCardData.forEach(item => {
                if (item.rechargeId === this.rechargeableCard.rechargeId) {
                  item.giftSurplus = math.subtract(item.giftSurplus, item.giveMoney)
                  item.inputDisabled = false
                }
              })
              this.mathPayment()
            } else {
              this.showRechargeableCard = false
              this.rechargeableCard.principalMoney = this.rechargeableCard.principalMoney
              this.rechargeableCard.giveMoney = this.rechargeableCard.giveMoney
              this.rechargeableCard.paymentAmount = math.add(this.rechargeableCard.principalMoney, this.rechargeableCard.giveMoney)
              this.payData.push(JSON.parse(JSON.stringify(this.rechargeableCard)))
              this.rechargeableCardData.forEach(item => {
                if (item.rechargeId === this.rechargeableCard.rechargeId) {
                  item.payableSurplus = math.subtract(item.payableSurplus, item.principalMoney)
                  item.giftSurplus = math.subtract(item.giftSurplus, item.giveMoney)
                  item.inputDisabled = false
                }
              })
              this.mathPayment()
            }

            this.payData.forEach(item => {
              if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6') {
                item.disabled = true
              }
            })
            // this.rechargeableCard = {}
            this.selectionData = []
          }
        })
      }
      else {
        if (this.rechargeableCard.rechargeCardId === undefined || this.rechargeableCard.rechargeCardId === 0) {
          this.$message.error('不能选择同一张储值卡！')
          this.showRechargeableCard = true
          return
        } else if (this.rechargeableCard.principalMoney === undefined && this.rechargeableCard.giftAmount === undefined) {
          this.$message.error('请填写结账金额！')
          this.showRechargeableCard = true
          return;
        }
        else {
          if (this.rechargeableCard.giveMoney === undefined || this.rechargeableCard.giveMoney === 0 || this.rechargeableCard.giveMoney === '') {
            this.rechargeableCard.giveMoney = 0
            this.showRechargeableCard = false
            this.rechargeableCard.principalMoney = this.rechargeableCard.principalMoney
            this.rechargeableCard.giveMoney = this.rechargeableCard.giveMoney
            this.rechargeableCard.paymentAmount = math.add(this.rechargeableCard.principalMoney, this.rechargeableCard.giveMoney)
            this.payData.push(JSON.parse(JSON.stringify(this.rechargeableCard)))
            this.rechargeableCardData.forEach(item => {
              if (item.rechargeId === this.rechargeableCard.rechargeId) {
                item.payableSurplus = math.subtract(item.payableSurplus, item.principalMoney)
              }
            })
            this.mathPayment()
          } else if (this.rechargeableCard.principalMoney === undefined || this.rechargeableCard.principalMoney === 0 || this.rechargeableCard.principalMoney === '') {
            this.rechargeableCard.principalMoney = 0
            this.showRechargeableCard = false
            this.rechargeableCard.principalMoney = this.rechargeableCard.principalMoney
            this.rechargeableCard.giveMoney = this.rechargeableCard.giveMoney
            this.rechargeableCard.paymentAmount = math.add(this.rechargeableCard.principalMoney, this.rechargeableCard.giveMoney)
            this.payData.push(JSON.parse(JSON.stringify(this.rechargeableCard)))
            this.rechargeableCardData.forEach(item => {
              if (item.rechargeId === this.rechargeableCard.rechargeId) {
                item.giftSurplus = math.subtract(item.giftSurplus, item.giveMoney)
              }
            })
            this.mathPayment()
          } else {
            this.showRechargeableCard = false
            this.rechargeableCard.principalMoney = this.rechargeableCard.principalMoney
            this.rechargeableCard.giveMoney = this.rechargeableCard.giveMoney
            this.rechargeableCard.paymentAmount = math.add(this.rechargeableCard.principalMoney, this.rechargeableCard.giveMoney)
            this.payData.push(JSON.parse(JSON.stringify(this.rechargeableCard)))
            this.rechargeableCardData.forEach(item => {
              if (item.rechargeId === this.rechargeableCard.rechargeId) {
                item.payableSurplus = math.subtract(item.payableSurplus, item.principalMoney)
                item.giftSurplus = math.subtract(item.giftSurplus, item.giveMoney)
              }
            })
            this.mathPayment()
          }
          this.payData.forEach(item => {
            if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6') {
              item.disabled = true
            }
          })
          this.rechargeableCard = {}
          this.selectionData = []
        }
      }
      this.payData = this.qurArr(this.payData)
    },
    qurArr(data){
      let arr=[];
      data.forEach(value=>{
        if(value.rechargeId){
          if(arr.length>1){
            let flag=false;
            arr.forEach(newvalue=>{
              if(newvalue.rechargeId==value.rechargeId){
                flag=true
              }
            })
            if(!flag){
              arr.push(value)
            }
          }else{
            arr.push(value)
          }

        }else{
          arr.push(value)
        }
      })
      return arr
    },
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },
    /**
     * @author Nevin
     * @date 2022/6/26
     * @Description: 储值退款提交
     */
    submitFormRechargeCardRefund() {
      if (this.rechargeableCardRefund.paymentCardItem === undefined) {
        this.$message.error('请先选择要退款的储值卡！')
      } else if (this.rechargeableCardRefund.principalMoney === undefined) {
        this.$message.error('请填写退款本金！')
      } else {
        if (this.rechargeableCardRefund.giveMoney === undefined) {
          this.rechargeableCardRefund.giveMoney = 0
          this.showRechargeableCardRefund = false
          for(let i=0;i<this.selectionData.length;i++) {
            this.rechargeableCardRefund = Object.assign(this.rechargeableCardRefund, this.selectionData[i])
            this.rechargeableCardRefund.principalMoney = this.rechargeableCardRefund.principalMoney
            this.rechargeableCardRefund.giveMoney = this.rechargeableCardRefund.giveMoney
            this.rechargeableCardRefund.paymentAmount = math.add(this.rechargeableCardRefund.principalMoney, this.rechargeableCardRefund.giveMoney)
            this.payData.push(this.deepClone(this.rechargeableCardRefund))
          }
          if(this.selectionData.length>1){
            this.rechargeableCardRefundData.forEach((item,index) => {
              if (item.paymentCardItem === this.selectionData[index].paymentCardItem) {
                item.principal = math.subtract(item.principal, this.selectionData[index].principalMoney)
                item.giveCash = math.subtract(item.giveCash, this.selectionData[index].giveMoney)
              }
            })
          }else{
            this.rechargeableCardRefundData.forEach((item,index) => {
              if (item.paymentCardItem === this.selectionData[0].paymentCardItem) {
                item.principal = math.subtract(item.principal, this.selectionData[0].principalMoney)
                item.giveCash = math.subtract(item.giveCash, this.selectionData[0].giveMoney)
              }
            })
          }
          this.payData.forEach(item => {
            if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6') {
              item.disabled = true
            }
          })
          this.mathPayment()
        } else {
          this.showRechargeableCardRefund = false;
          for(let i=0;i<this.selectionData.length;i++){
            this.rechargeableCardRefund = Object.assign(this.rechargeableCardRefund, this.selectionData[i])
            this.rechargeableCardRefund.principalMoney = this.rechargeableCardRefund.principalMoney
            this.rechargeableCardRefund.giveMoney = this.rechargeableCardRefund.giveMoney
            this.rechargeableCardRefund.paymentAmount = math.add(this.rechargeableCardRefund.principalMoney, this.rechargeableCardRefund.giveMoney)
            this.payData.push(this.deepClone(this.rechargeableCardRefund))
          }
          if(this.selectionData.length>1){
            this.rechargeableCardRefundData.forEach((item,index) => {
              if (item.paymentCardItem === this.selectionData[index].paymentCardItem) {
                item.principal = math.subtract(item.principal, this.selectionData[index].principalMoney)
                item.giveCash = math.subtract(item.giveCash, this.selectionData[index].giveMoney)
              }
            })
          }else{
            this.rechargeableCardRefundData.forEach((item,index) => {
              if (item.paymentCardItem === this.selectionData[0].paymentCardItem) {
                item.principal = math.subtract(item.principal, this.selectionData[0].principalMoney)
                item.giveCash = math.subtract(item.giveCash, this.selectionData[0].giveMoney)
              }
            })
          }

          this.payData.forEach(item => {
            if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6') {
              item.disabled = true
            }
          })
          this.mathPayment()
        }
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/21
     * @Description: 欠款挂账点击确定
     */
    submitFormOutstandingAccount() {
      if (this.prepaymentTime === '') {
        this.$message.error('请选择预计还款时间')
      } else {
        let total = 0
        // 在欠款挂帐里 总金额减去欠款挂账
        let sum = 0
        this.outstandingAccountData.forEach(item => {
          // 总价减去欠款挂账金额
          item.totalPayment = math.subtract(item.discountAmount, item.deptPrice)
          total = math.add(total, item.deptPrice)
          sum = math.add(sum, item.discountAmount)
        })
        // 将值赋给
        this.totalPayment = math.subtract(sum, total)
        // alert(this.totalPayment,'嘿嘿')
        this.payData.forEach(item => {
          if (item.borrowType === '7') {
            item.paymentAmount = total
            item.disabled = true
          }
        })
        this.$forceUpdate()
        this.showOutstandingAccount = false
        this.trueflag=true;
        this.mathPayment()
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 获取顾客预约金List
     */
    getAdvancePayment() {
      this.$api.finance.advancePaymentRecordList({
        deptId: this.deptId,
        departmentId: this.order.billingDepartment, //掺入上个列表的billingDepartment查询
        id: this.order.id
      }).then(res => {
        if (res) {
          this.advancePaymentData = res.rows.filter(item => item.remainingAmount > 0)
        }
      })
    },
    /**
     * @author wsj
     * @date 2022/9/16
     * @Description: 获取顾客住院押金List
     */
    getHospitalization() {
      this.$api.finance.hospitalizationDepositRecordList({
        deptId: this.deptId,
        id: this.order.id
      }).then(res => {
        if (res) {
          console.log('数据雄安是', res.rows)
          this.hospitalizationData = res.rows.filter(item => item.isCheckout === '0')
          // this.hospitalizationData = res.rows
        }
      })
    },

    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 获取顾客储值卡List
     */
    getRechargeableCard(val) {
      if (val === '4') {
        this.$api.RechargeableCard.customCardlist({
          deptId: this.deptId,
          departmentId: this.order.billingDepartment, //掺入上个列表的billingDepartment查询
          id: this.order.id,
          rechargeCardType: '1',
          isToPay: '1'
        }).then(res => {
          if (res) {
            if(!this.flagData){
              this.rechargeableCardData = res.rows
            }
            this.flagData=true
          }
        })
      } else if (val === '5') {
        this.$api.RechargeableCard.customCardlist({
          deptId: this.deptId,
          id: this.order.id,
          rechargeCardType: '2',
          isToPay: '1'
        }).then(res => {
          if (res) {
            if(!this.flagData){
              // res.rows.forEach(value=>{
              //   value.inputDisabled=true
              // })
              this.rechargeableCardData = res.rows
            }
            this.flagData=true
          }
        })
      } else {

        this.$api.RechargeableCard.customCardlist({
          id: this.order.id,
          rechargeCardType: '3',
          isToPay: '1'
        }).then(res => {
          if (res) {
            if(!this.flagData){
              this.rechargeableCardData = res.rows
            }
            this.flagData=true
          }
        })
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/18
     * @Description: 结账收款保存及打印
     */

    printCollectionSettlement(ind) {
      let thatsnew=this;
      this.$api.billingList.getOrderInfo(this.order.orderId).then(res => {
        if (res.data.billingStatus === '3') {
          this.$message.error('该笔订单已结账，不能重复结账！')
          this.closeTag()
        } else {
          let payItem = {}
          const payData = []
          const debtInfoList = []
          this.payData.forEach(item => {
            payItem = {
              rechargeCardId: item.rechargeCardId,
              aestheticConsultant: this.order.aestheticConsultant,
              billType: this.order.billType,
              customerRepresentative: this.order.customerRepresentative,
              departmentId: this.order.departmentId,
              deptId: this.deptId,
              doctorId: this.order.doctorId,
              dsingleUser: this.userInfo.userId,
              giveMoney: item.giveMoney,
              id: this.order.id,
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              refereeuserId: this.order.refereeuserId,
              secondRecommender: this.order.secondRecommender,
              paymentChannel: item.payId,
              paymentAmount: item.paymentAmount,
              principalMoney: item.principalMoney,
              remark: item.remark,
              borrowType: item.borrowType,
              customerStatus: this.order.customerStatus
            }
            if (this.order.billType === '11' || this.order.billType === '22' || this.order.billType === '16' || this.order.billType === '20' || this.order.billType === '15') {
              if (item.borrowType === '2') {
                this.$set(payItem, 'paymentCardItem', item.advancePaymenId)
              } else {
                this.$set(payItem, 'paymentCardItem', item.paymentCardItem)
              }
            } else {
              if (item.borrowType === '2') {
                this.$set(payItem, 'paymentCardItem', item.advancePaymenId)
              } else if (item.borrowType === '4' || item.borrowType === '5' || item.borrowType === '6') {
                this.$set(payItem, 'paymentCardItem', item.rechargeId)
              } else if (item.borrowType === '3') {
                this.$set(payItem, 'paymentCardItem', item.hospitalizationId)
              } else {
                this.$set(payItem, 'paymentCardItem', item.paymentCardItem)
              }
            }
            payData.push(payItem)
            this.billingPerformance=0;
            this.departmentPerformance=0;
            this.payAmount=0;
            if (item.paymentPerformance === '1') {
              this.billingPerformance = math.add(this.billingPerformance, item.paymentAmount)
            }
            if (item.departmentPerformance === '1') {
              this.departmentPerformance = math.add(this.departmentPerformance, item.paymentAmount)
            }
            if (item.inFactAmount === '1') {
              this.payAmount = math.add(this.payAmount, item.paymentAmount)
            }
          })
          // return ;
          let deptPrice = 0
          // 欠款数据 w 添加 总金额退款为负数
          this.outstandingAccountData.forEach(item => {
            this.$set(item, 'totalPayment', item.totalPayment) // 每个价格得总金额
            this.$set(item, 'aestheticConsultant', this.order.aestheticConsultant)
            this.$set(item, 'billType', this.order.billType)
            this.$set(item, 'customerRepresentative', this.order.customerRepresentative)
            this.$set(item, 'departmentId', this.order.departmentId)
            this.$set(item, 'deptId', this.deptId)
            this.$set(item, 'doctorId', this.order.doctorId)
            this.$set(item, 'dsingleUser', this.userInfo.userId)
            this.$set(item, 'id', this.order.id)
            this.$set(item, 'orderId', this.order.orderId)
            this.$set(item, 'jdxxId', this.order.jdxxId)
            this.$set(item, 'prepaymentTime', this.prepaymentTime)
            this.$set(item, 'waitId', item.waitId)
            this.$set(item, 'orderNumber', this.order.orderNumber)
            this.$set(item, 'thisAmount', math.subtract(item.discountAmount, item.deptPrice))
            this.$set(item, 'commonNumber', item.orderDetailsId)
            deptPrice = math.add(item.deptPrice, deptPrice)
            if (item.deptPrice === '0') {
              debtInfoList.push(item)
            }
          })
          this.finalPayData = this.payData
          this.loadingPay = true
          if (this.order.billType === '1' || this.order.billType === '21' || this.order.billType === '19' || this.order.billType === '7' || this.order.billType === '8' || this.order.billType === '6') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
            if(this.trueflag&&this.orderData.length==1){
              sumA=0
            }else{
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
            }

              totalPrice = sumA
              console.log(this.orderData,'黑欸')
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              id: this.order.id,
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              secondRecommender: this.order.secondRecommender,
              billType: this.order.billType,
              jdxxId: this.order.jdxxId,
              deptPrice: deptPrice,
              prepaymentTime: this.prepaymentTime,
              paidAmount: this.payAmount,
              billingPerformance: this.billingPerformance,
              departmentPerformance: this.departmentPerformance,
              aestheticConsultant: this.order.aestheticConsultant,
              deptId: this.deptId
            }
            const orderDetailsList = []
            let totalPayment = 0 // 定义一个公共数据负责传递值

            this.orderData.forEach(item => {
              // 如果有欠款 走的是 2 否 1
              console.log('如果有欠款 走的是 2 否 1', item.totalPayment)
              if (item.totalPayment === undefined || item.totalPayment === 0) {
                // 1 应付金额
                if(this.trueflag&&this.orderData.length==1){
                  totalPayment = 0;
                }else{
                  totalPayment = item.discountAmount
                }

              } else {
                // 2debtInfo 欠款后需要交得金额
                totalPayment = item.totalPayment
              }
              const proportion = math.divide(item.discountAmount, this.paidAmount)

              const temp = {
                totalPayment: totalPayment, // 每个项目价格得欠款挂账后金额或本金额
                orderDetailsId: item.orderDetailsId,
                discountAmount: item.discountAmount,
                thisAmount: math.multiply(proportion, this.payAmount).toFixed(2) - 0,
                billingPerformance: math.multiply(proportion, this.billingPerformance).toFixed(2) - 0,
                departmentPerformance: math.multiply(proportion, this.departmentPerformance).toFixed(2) - 0,
                surplusBillingPerformance: math.multiply(proportion, this.billingPerformance).toFixed(2) - 0,
                surplusDepartmentPerformance: math.multiply(proportion, this.departmentPerformance).toFixed(2) - 0

              }
              orderDetailsList.push(temp)
            })
            this.loadingPay = false
            console.log(orderDetailsList,'++++++')
            console.log(orderInfo,'__________')
            console.log(payData,'UUUUUUUUUU')
            console.log(this.outstandingAccountData,'xxxxxxx')
            // console.log('正正单子支付')
            // return;
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'chargeRecordInfoList': payData,
              'orderDetailList': orderDetailsList,
              'debtInfoList': this.outstandingAccountData
              // 'debtInfo': debtInfo
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  setTimeout(function (){
                    thatsnew.$refs.printRef.print()
                    thatsnew.closeTag()
                  },500)

                }else{
                  thatsnew.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false
              // this.closeTag()
            })
          } else if (this.order.billType === '2') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            // let totalPrice = 0
            // if (this.totalPayment === 0) {
            //   // 1
            //   let sumA = 0
            //   this.orderData.forEach(items => {
            //     sumA = math.add(items.discountAmount, sumA)
            //   })
            //   totalPrice = sumA
            // } else {
            //   // 2
            //   totalPrice = this.totalPayment
            // }
            orderInfo = {
              totalPayment: this.order.amountPayable,
              id: this.order.id,
              orderId: this.order.orderId,
              deptId: this.order.deptId,
              dsingleUser: this.order.dsingleUser,
              orderNumber: this.order.orderNumber,
              departmentId: this.order.departmentId,
              billType: this.order.billType,
              secondRecommender: this.order.secondRecommender,
              jdxxId: this.order.jdxxId,
              rechargeAmount: this.order.amountPayable,
              advancePaymentTime: this.order.advancePaymentTime,
              paidAmount: this.payAmount,
              billingPerformance: this.billingPerformance,
              // departmentPerformance: this.departmentPerformance,
              aestheticConsultant: this.order.aestheticConsultant
            }
            // console.log('金额',orderInfo.totalPayment)
            // return;
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第二个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          } else if (this.order.billType === '3') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              // 万加 开始
              deptId: this.order.deptId,
              departmentId: this.order.departmentId,
              secondRecommender: this.order.secondRecommender,
              // 结束
              id: this.order.id,
              orderNumber: this.order.orderNumber,
              orderId: this.order.orderId,
              billType: this.order.billType,
              jdxxId: this.order.jdxxId,
              rechargeCardId: this.order.rechargeCardId,
              amountPayable: this.order.amountPayable,
              giftAmount: this.order.giftAmount,
              rechargeCardType: this.order.rechargeCardType,
              paidAmount: this.payAmount,
              billingPerformance: this.billingPerformance,
              // departmentPerformance: this.departmentPerformance,
              aestheticConsultant: this.order.aestheticConsultant
            }
            // return;
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                this.totalPricedata=this.payAmount
                console.log(this.payAmount,'这是第三个')
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          } else if (this.order.billType === '4') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              // 万加 开始
              deptId: this.order.deptId,
              departmentId: this.order.departmentId,
              secondRecommender: this.order.secondRecommender,
              // 结束
              id: this.order.id,
              orderNumber: this.order.orderNumber,
              jdxxId: this.order.jdxxId,
              orderId: this.order.orderId,
              billType: this.order.billType,
              rechargeCardId: this.order.rechargeCardId,
              amountPayable: this.order.amountPayable,
              giftAmount: this.order.giftAmount,
              rechargeCardType: this.order.rechargeCardType,
              paidAmount: this.payAmount,
              billingPerformance: this.billingPerformance,
              // departmentPerformance: this.departmentPerformance,
              aestheticConsultant: this.order.aestheticConsultant
            }
            console.log(4)
            // return;
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第四个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          } else if (this.order.billType === '5' || this.order.billType === '10') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              // wanstart
              deptId: this.order.deptId,
              departmentId: this.order.departmentId,
              secondRecommender: this.order.secondRecommender,
              // end
              id: this.order.id,
              orderId: this.order.orderId,
              jdxxId: this.order.jdxxId,
              orderNumber: this.order.orderNumber,
              billType: this.order.billType,
              paidAmount: this.payAmount,
              billingPerformance: this.billingPerformance,
              // departmentPerformance: this.departmentPerformance,
              aestheticConsultant: this.order.aestheticConsultant
            }
            // return;
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第五个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          } else if (this.order.billType === '9') {
            console.log('测试 ')

            // 上次购买时的 成交金额
            let amountSum = 0

            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
                amountSum = math.add(items.totalAmount, amountSum)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              id: this.order.id,
              orderId: this.order.orderId,
              jdxxId: this.order.jdxxId,
              orderNumber: this.order.orderNumber,
              billType: this.order.billType,
              totalExpenses: this.order.totalExpenses,
              chargeSheetId: this.order.chargeSheetId,
              deptPrice: this.order.deptPrice,
              oldBillType: this.order.oldBillType,
              paidAmount: this.payAmount,
              billingPerformance: this.billingPerformance,
              departmentPerformance: this.departmentPerformance,
              aestheticConsultant: this.order.aestheticConsultant,
              onlineUserId: this.order.onlineUserId,
              deptId: this.deptId
            }
            const orderDetailsList = []
            let totalPayment = 0
            this.orderData.forEach(item => {
              console.log('还款进入', item)
              // if (item.discountAmount !== 0) {
              if (item.totalPayment === undefined || item.totalPayment === 0) {
                // 1 应付金额
                totalPayment = item.discountAmount
              } else {
                // 2 欠款后需要交得金额
                totalPayment = item.totalPayment
              }
              console.log('this.paidAmount总', amountSum)
              const proportion = math.divide(item.totalAmount, amountSum)
              console.log('proportion 还款单', proportion)
              console.log('  还款单this.billingPerformance', this.billingPerformance)
              const temp = {
                totalPayment: totalPayment,
                commonNumber: item.commonNumber,
                orderDetailsId: item.orderDetailsId,
                discountAmount: item.discountAmount,
                id: this.order.id,
                orderId: this.order.orderId,
                orderNumber: this.order.orderNumber,
                customerRepresentative: this.order.customerRepresentative,
                aestheticConsultant: this.order.aestheticConsultant,
                doctorId: this.order.doctorId,
                deptId: this.deptId,
                departmentId: this.order.departmentId,
                dsingleUser: this.userInfo.userId,
                secondRecommender: this.order.secondRecommender,
                billType: this.order.oldBillType,
                wforserviceId: item.wforserviceId,
                // thisAmount: math.multiply(proportion, this.payAmount).toFixed(2) - 0,
                thisAmount: item.discountAmount,
                billingPerformance: math.multiply(proportion, this.billingPerformance).toFixed(2) - 0,
                departmentPerformance: math.multiply(proportion, this.departmentPerformance).toFixed(2) - 0,
                surplusBillingPerformance: math.multiply(proportion, this.billingPerformance).toFixed(2) - 0,
                surplusDepartmentPerformance: math.multiply(proportion, this.departmentPerformance).toFixed(2) - 0
              }
              orderDetailsList.push(temp)
              // }
            })
            console.log(7)
            console.log('orderInfoDto', orderInfo,
              'orderDetailList', orderDetailsList,
              'chargeRecordInfoList', payData)
            // return
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'orderDetailList': orderDetailsList,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第六个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          } else if (this.order.billType === '11' || this.order.billType === '22' || this.order.billType === '16' || this.order.billType === '20' || this.order.billType === '15') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: -totalPrice,
              id: this.order.id,
              jdxxId: this.order.jdxxId,
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              billType: this.order.billType,
              totalExpenses: this.order.totalExpenses,
              chargeSheetId: this.order.chargeSheetId,
              oldBillType: this.order.oldBillType,
              reasonForRefund: this.order.reasonForRefund,
              aestheticConsultant: this.order.aestheticConsultant,
              paidAmount: math.subtract(0, this.payAmount),
              billingPerformance: math.subtract(0, this.billingPerformance),
              departmentPerformance: math.subtract(0, this.departmentPerformance),
              surplusBillingPerformance: math.subtract(0, this.billingPerformance),
              surplusDepartmentPerformance: math.subtract(0, this.departmentPerformance),
              deptId: this.deptId
            }
            const orderDetailsList = []
            console.log(this.orderData,'123')
            let totalPayment = 0
            this.orderData.forEach(item => {
              console.log('进入 ', item)
              if (item.discountAmount >= 0) {
                if (item.totalPayment === undefined || item.totalPayment === 0) {
                  // 1 应付金额
                  totalPayment = item.discountAmount
                } else {
                  // 2 欠款后需要交得金额
                  totalPayment = item.totalPayment
                }
                console.log(item.discountAmount,this.paidAmount,'黑恶')
                const proportion = math.divide(item.discountAmount, this.paidAmount)
                const temp = {
                  totalPayment: -totalPayment,
                  commonNumber: item.commonNumber,
                  orderDetailsId: item.orderDetailsId,
                  id: this.order.id,
                  orderId: this.order.orderId,
                  orderNumber: this.order.orderNumber,
                  customerRepresentative: this.order.customerRepresentative,
                  aestheticConsultant: this.order.aestheticConsultant,
                  doctorId: this.order.doctorId,
                  deptId: this.deptId,
                  departmentId: this.order.departmentId,
                  dsingleUser: this.userInfo.userId,
                  secondRecommender: this.order.secondRecommender,
                  billType: this.order.billType,
                  itemId: item.itemId,
                  quantitySum: item.quantitySum,
                  wforserviceId: item.wforserviceId,
                  thisAmount: math.subtract(0, math.multiply(proportion, this.payAmount).toFixed(2)) - 0,
                  billingPerformance: math.subtract(0, math.multiply(proportion, this.billingPerformance).toFixed(2)) - 0,
                  departmentPerformance: math.subtract(0, math.multiply(proportion, this.departmentPerformance).toFixed(2)) - 0,
                  surplusBillingPerformance: math.subtract(0, math.multiply(proportion, this.billingPerformance).toFixed(2)) - 0,
                  surplusDepartmentPerformance: math.subtract(0, math.multiply(proportion, this.departmentPerformance).toFixed(2)) - 0
                }
                orderDetailsList.push(temp)
              }
            })
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'orderDetailList': orderDetailsList,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第七个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }

              } else if (res.code === 601) {
                console.log('dddd')
                this.showDialog = true
                this.errorPrompt = res.msg
              }
            }).finally(() => {
              this.loadingPay = false

              // this.closeTag()
            })
          } else if (this.order.billType === '13' || this.order.billType === '18') {
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              id: this.order.id,
              jdxxId: this.order.jdxxId,
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              billType: this.order.billType,
              totalExpenses: this.order.totalExpenses,
              chargeSheetId: this.order.chargeSheetId,
              oldBillType: this.order.oldBillType,
              reasonForRefund: this.order.reasonForRefund,
              secondRecommender: this.order.secondRecommender,
              rechargeCardType: this.order.rechargeCardType,
              aestheticConsultant: this.order.aestheticConsultant,
              rechargeCardId: this.order.rechargeCardId,
              giftAmount: math.subtract(0, this.order.giftAmount),
              amountPayable: this.order.amountPayable,
              deptId: this.deptId,
              departmentId: this.order.departmentId,
              paidAmount: math.subtract(0, this.payAmount),
              billingPerformance: math.subtract(0, this.billingPerformance),
              // departmentPerformance: math.subtract(0, this.departmentPerformance),
              surplusBillingPerformance: math.subtract(0, this.billingPerformance)
              // surplusDepartmentPerformance: math.subtract(0, this.departmentPerformance)

            }
            // const orderDetailsList = []
            // this.rechargeData.forEach(item => {
            //   if (item.discountAmount !== 0) {
            //     const temp = {
            //       thisAmount: item.discountAmount,
            //       commonNumber: item.commonNumber,
            //       orderDetailsId: item.orderDetailsId,
            //       id: this.order.id,
            //       itemId: item.itemId,
            //       orderId: this.order.orderId,
            //       orderNumber: this.order.orderNumber,
            //       customerRepresentative: this.order.customerRepresentative,
            //       aestheticConsultant: this.order.aestheticConsultant,
            //       deptId: this.deptId,
            //       departmentId: item.departmentId,
            //       dsingleUser: this.userInfo.userId,
            //       secondRecommender: this.order.secondRecommender,
            //       priceOne: item.priceOne,
            //       priceTwo: item.priceTwo
            //     }
            //     orderDetailsList.push(temp)
            //   }
            // })
            console.log(9)
            // return;
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第八个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else{
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          } else if (this.order.billType === '12' || this.order.billType === '14' || this.order.billType === '17') {
            console.log("01")
            console.log(this.billingPerformance, 'dsahdsad')
            let orderInfo = {}
            // 判断是否又欠款挂账 有就走（this.totalPayment ！== 0） 2 没有走（this.totalPayment === 0） 1
            let totalPrice = 0
            if (this.totalPayment === 0) {
              // 1
              let sumA = 0
              this.orderData.forEach(items => {
                sumA = math.add(items.discountAmount, sumA)
              })
              totalPrice = sumA
            } else {
              // 2
              totalPrice = this.totalPayment
            }
            orderInfo = {
              totalPayment: totalPrice,
              rechargeCardId: this.order.rechargeCardId,
              id: this.order.id,
              jdxxId: this.order.jdxxId,
              orderId: this.order.orderId,
              orderNumber: this.order.orderNumber,
              billType: this.order.billType,
              totalExpenses: this.order.totalExpenses,
              chargeSheetId: this.order.chargeSheetId,
              oldBillType: this.order.oldBillType,
              reasonForRefund: this.order.reasonForRefund,
              aestheticConsultant: this.order.aestheticConsultant,
              //  wan
              deptId: this.order.deptId,
              departmentId: this.order.departmentId,
              secondRecommender: this.order.secondRecommender,
              paidAmount: math.subtract(0, this.payAmount),
              billingPerformance: math.subtract(0, this.billingPerformance),
              // departmentPerformance: math.subtract(0, this.departmentPerformance),
              surplusBillingPerformance: math.subtract(0, this.billingPerformance)
              // surplusDepartmentPerformance: math.subtract(0, this.departmentPerformance)
            }
            const orderDetailsList = []
            let totalPayment = 0
            this.rechargeData.forEach(item => {
              if (item.discountAmount !== 0) {
                if (item.totalPayment === undefined || item.totalPayment === 0) {
                  // 1 应付金额
                  totalPayment = item.discountAmount
                } else {
                  // 2 欠款后需要交得金额
                  totalPayment = item.totalPayment
                }
                const proportion = math.divide(item.discountAmount, this.paidAmount)
                const temp = {
                  totalPayment: totalPayment,
                  orderDetailsId: item.orderDetailsId,
                  commonNumber: item.commonNumber,
                  id: this.order.id,
                  orderId: this.order.orderId,
                  orderNumber: this.order.orderNumber,
                  customerRepresentative: this.order.customerRepresentative,
                  aestheticConsultant: this.order.aestheticConsultant,
                  deptId: this.deptId,
                  departmentId: item.departmentId,
                  dsingleUser: this.userInfo.userId,
                  secondRecommender: this.order.secondRecommender,
                  thisAmount: math.subtract(0, math.multiply(proportion, this.payAmount).toFixed(2)) - 0,
                  billingPerformance: math.subtract(0, math.multiply(proportion, this.billingPerformance).toFixed(2)) - 0,
                  departmentPerformance: math.subtract(0, math.multiply(proportion, this.departmentPerformance).toFixed(2)) - 0,
                  surplusBillingPerformance: math.subtract(0, math.multiply(proportion, this.billingPerformance).toFixed(2)) - 0,
                  surplusDepartmentPerformance: math.subtract(0, math.multiply(proportion, this.departmentPerformance).toFixed(2)) - 0
                }
                orderDetailsList.push(temp)
              }
            })
            this.$api.finance.checkOut({
              'orderInfoDto': orderInfo,
              'orderDetailList': orderDetailsList,
              'chargeRecordInfoList': payData
            }).then(res => {
              if (res.code==200) {
                this.$message.success(res.msg)
                this.loadingPay = false
                console.log(this.payAmount,'这是第九个')
                this.totalPricedata=this.payAmount
                if (ind == 2) {
                  this.$nextTick(() => {
                    this.$refs.printRef.print()
                    this.closeTag()
                  })
                }else {
                  this.closeTag()
                }
              }
            }).finally(() => {
              this.loadingPay = false

            })
          }
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
//::v-deep .el-input__inner {
//  border-radius: 10px;
//}
::v-deep .getmoney .el-input__inner{
  padding: 0 !important;
  text-align: left !important;
  padding-left: 16px !important;
  width: 70px;
}

::v-deep .Normal .el-input__inner{
  padding: 0;
  text-align: left;
  padding-left: 16px;
}
::v-deep .el-input-number__decrease{
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
::v-deep .el-col-24{
  height: 50px !important;
}
::v-deep .sg-table-bar {
  display: none;
}

//左侧
.leftborder {
  padding: 15px;
  margin-right: 10px;
  padding-top: 20px;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  position: relative;
  height: 90%;

  .title {
    position: absolute;
    top: -12px;
    left: 30px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }

  .pay {
    border: 1px solid #c6c6c6;
    border-top: 0;
    border-radius: 0 0 10px 10px;

    .payA {
      cursor: pointer;
      color: #ffffff;
    }

    .payA:visited {
      color: #ffffff;
    }
  }
}

//右侧
.borderRight {
  float: right;
  width: 95%;
  padding: 30px 20px 15px 20px;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;

  .title {
    position: absolute;
    top: -12px;
    left: 30px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

//搜索框
.keyword {
  float: right;
  width: 180px;
  margin-right: 10px;
}

.header {
  height: 97%;
  border: 1px solid #c6c6c6;
  padding: 40px 20px 0 20px;
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  margin: 15px 20px 0 20px;

  .title {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.left {
  width: 32%;
  height: 100%;
  margin: 0 20px;

  .check {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    font-weight: 600;
    color: #fffffc;
    border-radius: 10px 10px 0 0;
    background-color: #1abc9c;
    padding-left: 10px;
  }

  .content {
    height: 30px;
    width: 45%;
    font-size: 12.5px;
    line-height: 30px;
    text-align: center;
    border-radius: 10px;
    display: inline-block;
    background-color: #1abc9c;
    margin: 10px;
  }

  .content:hover {
    background-color: #1fa087;
  }
}

.right {
  width: 63%;
  padding-left: 10px;
  margin-bottom: 30px;

  .rightheader {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #fffffc;
    //padding: 0 8px;
    border-radius: 10px 10px 0 0;
    background-color: #1abc9c;

    span {
      margin: 0 10px;
    }
  }

  .liets {
    width: 100%;

    .item {
      box-sizing: border-box;
      /*border计算在width中*/
      -moz-box-sizing: border-box;
      /* Firefox */
      -webkit-box-sizing: border-box;
      /* Safari */
      width: 33.36%;
      font-size: 12px;
      padding: 8px 5px;
      border: 1px solid #d7d5d5;
      margin: 0 -1px -1px 0;
      float: left;
    }
  }
}

.titme {
  font-weight: 600;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 40px;
  background-color: #fff;
  z-index: 1000;

  .content {
    position: fixed;
    right: 20px;
    padding-top: 7px;
  }
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
