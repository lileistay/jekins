<template>
  <!--收费单详情-->
  <el-scrollbar>
    <div class="header">
      <!--左侧-->
      <div class="left">
        <el-card class="box-card">
          <span style="font-size: 18px">{{ orderInfo.customerName }}</span>
                    &nbsp;
          <span class="title">卡号：{{ orderInfo.customCardNumber }}</span>
        </el-card>
        <el-card class="box-card">
          <div class="fontwidth">
            {{ customOpen(orderInfo.billType) }} [{{ orderInfo.orderNumber }}]
            <span style="color: red; float: right">{{ BillStatusName(orderInfo.billingStatus) }}</span>
          </div>
          <div class="headers">
            <div class="liets">
              <div class="item">下单时间：{{ orderInfo.billTime }}</div>
              <div class="item">下单人：{{ orderInfo.dsingleUserName }}</div>
              <div class="item">科室：{{ orderInfo.departmentName }}</div>
              <div class="item">结账时间：{{ orderInfo.checkoutTime }}</div>
              <div class="item">收银员：{{ orderInfo.cashierName }}</div>
              <div class="item">医生：{{ orderInfo.doctorName }}</div>
              <div class="item">费用合计：{{
                orderInfo.totalExpenses === null ? 0 : orderInfo.totalExpenses
              }}
              </div>
              <div class="item">应付款：{{
                orderInfo.amountPayable === null ? 0 : orderInfo.amountPayable
              }}
              </div>
              <div class="item">实付款：{{
                orderInfo.paidAmount === null ? 0 : orderInfo.paidAmount
              }}
              </div>
            </div>
            <div class="boxs title">备注：{{ orderInfo.billingRemarks }}</div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div class="title">结账列表</div>
          <el-table
            :data="ClosingList"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column prop="payName" label="收银科目" />
            <el-table-column prop="paymentAmount" label="结账金额" />
            <el-table-column prop="remark" label="备注" width="200" />
          </el-table>
        </el-card>
        <el-card v-if="orderInfo.billType === '3'" class="box-card">
          <sg-table
            ref="table"
            :sg-ref="'multipleTable'"
            size="mini"
            border
            :table-data="tableDatavalue"
            :columns="columns"
            max-height="120px"
            
          >
            <div slot="searchBar" class="searchBar" style="background-color: #ffffff">
              <div class="rights">
                <p class="itemfont">项目储值信息</p>
              </div>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'num3'">
                {{ data.custom.num3 }}
              </div>
            </template>
          </sg-table>
        </el-card>
        <el-card
          v-if="(orderInfo.billType === '1' ||orderInfo.billType === '2' || orderInfo.billType === '7'|| orderInfo.billType === '21' || orderInfo.billType === '8' || orderInfo.billType === '19'|| orderInfo.billType === '11') &&
            orderInfo.oldBillType !== '6'"
          class="box-card"
        >
          <div class="title">收费明细</div>
          <el-table
            v-if="orderInfo.billType === '2'"
            :data="tableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <!--预约金-->
            <el-table-column
              fixed="left"
              prop="projectName"
              width="200"
              label="产品名称/规格"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="finalPrice" width="50" />
            <el-table-column prop="totalAmount" label="合计金额" />
            <el-table-column prop="discount" label="折扣" width="70" />
            <el-table-column prop="discountAmount" label="折后金额" width="70" />
            <el-table-column prop="billingPerformance" label="开单业绩" />
            <el-table-column prop="departmentPerformance" label="科室业绩" />
            <el-table-column prop="priceNum" label="产品次数" width="70" />
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
          </el-table>
          <!--          <el-table-->
          <!--            v-if="orderInfo.billType === '11' && orderInfo.oldBillType === '6'"-->
          <!--            :data="tableData"-->
          <!--            border-->
          <!--            style="width: 100%"-->
          <!--            size="mini"-->
          <!--            :header-cell-style="{'text-align':'center'}"-->
          <!--            :cell-style="{'text-align':'center'}"-->
          <!--          >-->
          <!--            <el-table-column fixed="left" prop="projectName" label="产品名称/规格" width="200" :show-overflow-tooltip="true" />-->
          <!--            <el-table-column prop="quantity" label="数量" width="60" />-->
          <!--            <el-table-column prop="sumPrice" label="总价" width="50" />-->
          <!--            <el-table-column prop="discountNumber" label="折扣" width="50" />-->
          <!--            <el-table-column prop="discountAmount" label="折后金额" />-->
          <!--            <el-table-column prop="eachTime" label="每次用量" />-->
          <!--            <el-table-column prop="pharmacy" label="用药单位" />-->
          <!--            <el-table-column prop="refundReason" label="退款原因">-->
          <!--              <template>-->
          <!--                <span v-for="item in dict.type.refund_reason" :key="item.value">{{ item.value === orderInfo.reasonForRefund ? item.label : '' }}</span>-->
          <!--              </template>-->
          <!--            </el-table-column>-->
          <!--            <el-table-column label="备注" prop="remark" />-->
          <!--          </el-table>-->
          <el-table
            v-else-if="orderInfo.billType === '11'"
            :data="tableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column
              fixed="left"
              prop="projectName"
              label="产品名称/规格"
              width="200"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="finalPrice" label="单价" width="50" />
            <el-table-column prop="totalAmount" label="合计金额" />
            <el-table-column prop="discount" label="折扣" width="50" />
            <el-table-column prop="discountAmount" label="折后金额" />
            <el-table-column prop="quantitySum" label="退款次数" />
            <el-table-column prop="billingPerformance" label="开单业绩" />
            <el-table-column prop="departmentPerformance" label="科室业绩" />
            <el-table-column prop="refundReason" label="退款原因">
              <template>
                <span
                  v-for="item in dict.type.refund_reason"
                  :key="item.value"
                >{{ item.value === orderInfo.reasonForRefund ? item.label : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
          </el-table>
          <!--          <el-table v-if="orderInfo.billType === '9' && orderInfo.oldBillType === '6'" :data="tableData" border style="width: 100%" size="mini" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">-->
          <!--            <el-table-column fixed="left" prop="projectName" label="产品名称/规格" width="200" :show-overflow-tooltip="true" />-->
          <!--            <el-table-column prop="quantity" label="数量" />-->
          <!--            <el-table-column prop="sumPrice" label="总价" />-->
          <!--            <el-table-column prop="discountNumber" label="折扣" />-->
          <!--            <el-table-column prop="discountAmount" label="折后金额" />-->
          <!--            <el-table-column prop="eachTime" label="每次用量" />-->
          <!--            <el-table-column prop="pharmacy" label="用药单位" />-->
          <!--            <el-table-column prop="thisAmount" label="还款金额" />-->
          <!--            <el-table-column prop="remark" label="备注" />-->
          <!--          </el-table>-->
          <el-table
            v-else-if="orderInfo.billType === '9'"
            :data="tableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column
              fixed="left"
              prop="projectName"
              label="产品名称/规格"
              width="200"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="合计金额" />
            <el-table-column prop="discount" label="折扣" width="50" />
            <el-table-column prop="discountAmount" label="折后金额" />
            <el-table-column prop="priceNum" label="产品次数" />
            <el-table-column prop="quantitySum" label="产品总次数" />
            <el-table-column prop="thisAmount" label="还款金额" />
            <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
          </el-table>
          <el-table
            v-else
            :data="tableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <!--正常单-->
            <el-table-column
              fixed="left"
              prop="projectName"
              width="200"
              label="产品名称/规格"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="finalPrice" label="单价" show-overflow-tooltip width="60" />
            <el-table-column prop="totalAmount" label="合计金额" show-overflow-tooltip width="50" />
            <el-table-column prop="discount" label="折扣" width="45" />
            <el-table-column prop="discountAmount" label="折后金额" show-overflow-tooltip width="60" />
            <el-table-column prop="allowanceAmount" label="折让金额" show-overflow-tooltip width="60" />
            <el-table-column prop="billingPerformance" label="开单业绩" show-overflow-tooltip width="60" />
            <el-table-column
              prop="departmentPerformance"
              label="科室业绩"
              show-overflow-tooltip
              width="60"
            />
            <el-table-column prop="priceNum" label="产品次数" width="50" />
            <!--<el-table-column prop="quantity" label="产品次数" width="50" />-->
            <el-table-column prop="quantitySum" label="产品总次数" width="60" />
            <el-table-column prop="treatedNum" label="已治疗次数" width="60" />
            <el-table-column prop="surplusQuantity" label="剩余次数" width="50" />
            <el-table-column prop="refundNum" label="退款次数" width="50" />
            <el-table-column prop="remark" label="备注" width="50" :show-overflow-tooltip="true" />
          </el-table>
        </el-card>
        <el-card v-if="orderInfo.billType === '6'" style="margin-top:5px">
          <!--辅助治疗收费明细-->
          <div class="title" style="margin-top: 10px">收费明细</div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center' }"
            
          >
            <el-table-column label="产品名称" prop="projectName" />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="finalPrice" label="单价" width="50" />
            <el-table-column prop="totalAmount" label="合计金额" />
            <el-table-column label="折扣" prop="discount" />
            <el-table-column label="折后金额" prop="discountAmount" />
            <el-table-column label="每次用量" prop="eachTime" />
            <el-table-column label="用药单位" prop="pharmacy" />
            <el-table-column prop="billingPerformance" label="开单业绩" />
            <el-table-column prop="departmentPerformance" label="科室业绩" />
            <el-table-column prop="priceNum" label="产品次数" width="50" />
            <!--<el-table-column prop="quantity" label="产品次数" width="50" />-->
            <el-table-column prop="quantitySum" label="产品总次数" width="60" />
            <el-table-column label="备注" prop="remark" />
          </el-table>
        </el-card>

        <el-card v-if="materialList.length > 0" style="margin-top: 5px">
          <div class="title" style="margin-top: 10px">物资列表</div>
          <el-table
            :data="materialList"
            :border="true"
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column label="物资名称/规格">
              <template #default="scope">
                <span>{{ scope.row.materialName }} / {{ scope.row.materialSpec }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="priceUnit" label="单位" />
            <el-table-column prop="totalQuantity" label="总购买数量" />
            <el-table-column prop="receivedQuantity" label="已领取数量" />
            <el-table-column prop="surplusQuantity" label="待领取数量" />
          </el-table>
        </el-card>
      </div>

      <!--右侧-->
      <div v-if="showOldDetailsList" class="right">
        <el-card class="box-card">
          <div class="title">退/还款列表</div>
        </el-card>
      </div>
      <div v-else-if="oldOrderInfo[0].billType === '11' || oldOrderInfo[0].billType === '9'" class="right">
        <el-card class="box-card">
          <div class="title">退/还款列表</div>
          <div v-for="(item, index) in oldOrderInfo" :key="index">
            <div class="fontwidth" style="margin-top: 10px">
              {{ customOpen(item.billType) }} [{{ item.orderNumber }}]
              <span style="color: red; float: right">{{ BillStatusName(item.billingStatus) }}</span>
            </div>
            <div class="headers">
              <div class="liets">
                <div class="item">下单时间：{{ item.billTime }}</div>
                <div class="item">下单人：{{ item.dsingleUserName }}</div>
                <div class="item">科室：{{ item.departmentName }}</div>
                <div class="item">结账时间：{{ item.checkoutTime }}</div>
                <div class="item">收银员：{{ item.cashierName }}</div>
                <div class="item">医生：{{ item.doctorName }}</div>
                <div class="item">费用合计：{{
                  item.totalExpenses === null ? 0 : item.totalExpenses
                }}
                </div>
                <div class="item">应付款：{{
                  item.amountPayable === null ? 0 : item.amountPayable
                }}
                </div>
                <div class="item">实付款：{{ item.paidAmount === null ? 0 : item.paidAmount }}</div>
              </div>
              <div class="boxs title">备注：{{ item.billingRemarks }}</div>
            </div>
            <div class="title" style="margin-top: 10px">结账列表</div>
            <el-table
              :data="item.oldClosingList"
              border
              style="width: 100%"
              size="mini"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              
            >
              <el-table-column prop="payName" label="收银科目" />
              <el-table-column prop="paymentAmount" label="结账金额" />
              <el-table-column prop="remark" label="备注" width="200" />
            </el-table>
            <div class="title" style="margin-top: 10px">收费明细</div>
            <el-table
              v-if="item.billType === '6'"
              :data="item.orderDetailsList"
              border
              style="width: 100%"
              size="mini"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              
            >
              <el-table-column label="产品名称" prop="projectName" />
              <el-table-column prop="quantity" label="数量(单位)" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="总价" prop="sumPrice" />
              <el-table-column label="折扣" prop="discountNumber" />
              <el-table-column label="折后金额" prop="discountAmount" />
              <el-table-column label="每次用量" prop="eachTime" />
              <el-table-column label="用药单位" prop="pharmacy" />
              <el-table-column label="备注" prop="remark" />
            </el-table>

            <el-table
              v-if="(item.billType === '1' || item.billType === '2' || item.billType === '7' || item.billType === '8'|| item.billType === '19') && item.oldBillType !== '6'"
              :data="item.orderDetailsList"
              border
              style="width: 100%"
              size="mini"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              
            >
              <el-table-column
                fixed="left"
                prop="projectName"
                label="产品名称/规格"
                :show-overflow-tooltip="true"
              />
              <el-table-column prop="quantity" label="数量(单位)" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" label="合计金额" width="70" />
              <el-table-column prop="discount" label="折扣" width="45" />
              <el-table-column prop="discountAmount" label="折后金额" width="70" />
              <el-table-column prop="allowanceAmount" label="折让金额" width="70" />
              <el-table-column prop="billingPerformance" label="开单业绩" width="70" />
              <el-table-column prop="departmentPerformance" label="科室业绩" width="70" />
              <el-table-column prop="priceNum" label="产品次数" width="70" />
              <el-table-column prop="quantitySum" label="产品总次数" width="85" />
              <el-table-column prop="treatedNum" label="已治疗次数" width="85" />
              <el-table-column prop="surplusQuantity" label="剩余次数" width="70" />
              <el-table-column prop="refundNum" label="退款次数" width="70" />
              <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
            </el-table>
            <el-table
              v-if="item.billType === '11'"
              :data="item.orderDetailsList"
              border
              style="width: 100%"
              size="mini"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              
            >
              <el-table-column
                fixed="left"
                prop="projectName"
                label="产品名称/规格"
                width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column prop="quantity" label="数量(单位)" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="company" label="单位" width="50" />
              <el-table-column prop="totalAmount" label="合计金额" />
              <el-table-column prop="discount" label="折扣" width="50" />
              <el-table-column prop="discountAmount" label="退款金额" />
              <el-table-column prop="priceNum" label="产品次数" />
              <el-table-column prop="quantitySum" label="退款次数" />
              <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
            </el-table>
            <el-table
              v-if="item.billType === '9'"
              :data="item.orderDetailsList"
              border
              style="width: 100%"
              size="mini"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              
            >
              <el-table-column
                fixed="left"
                prop="projectName"
                label="产品名称/规格"
                width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column prop="quantity" label="数量(单位)" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" label="合计金额" />
              <el-table-column prop="discount" label="折扣" width="50" />
              <el-table-column prop="discountAmount" label="折后金额" />
              <el-table-column prop="priceNum" label="产品次数" />
              <el-table-column prop="quantitySum" label="产品总次数" />
              <el-table-column prop="thisAmount" label="还款金额" />
              <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
            </el-table>

          </div>
        </el-card>
      </div>
      <el-card v-else-if="oldOrderInfo[0].billType === '3'" class="box-card">
        <sg-table
          ref="table"
          :sg-ref="'multipleTable'"
          size="mini"
          border
          :table-data="tableDatavalue1"
          :columns="columns1"
          max-height="120px"
          
        >
          <div slot="searchBar" class="searchBar" style="background-color: #ffffff">
            <div class="rights">
              <p class="itemfont">项目储值信息</p>
            </div>
          </div>
        </sg-table>
      </el-card>
      <div v-else class="right">
        <el-card class="box-card">
          <div class="title">源单据</div>
          <div class="fontwidth" style="margin-top: 10px">
            {{ customOpen(oldOrderInfo[0].billType) }} [{{ oldOrderInfo[0].orderNumber }}]
            <span style="color: red; float: right">{{
              BillStatusName(oldOrderInfo[0].billingStatus)
            }}</span>
          </div>
          <div class="headers">
            <div class="liets">
              <div class="item">下单时间：{{ oldOrderInfo[0].billTime }}</div>
              <div class="item">下单人：{{ oldOrderInfo[0].dsingleUserName }}</div>
              <div class="item">科室：{{ oldOrderInfo[0].departmentName }}</div>
              <div class="item">结账时间：{{ oldOrderInfo[0].checkoutTime }}</div>
              <div class="item">收银员：{{ oldOrderInfo[0].cashierName }}</div>
              <div class="item">医生：{{ oldOrderInfo[0].doctorName }}</div>
              <div class="item">费用合计：{{
                oldOrderInfo[0].totalExpenses === null ? 0 : oldOrderInfo[0].totalExpenses
              }}
              </div>
              <div class="item">应付款：{{
                oldOrderInfo[0].amountPayable === null ? 0 : oldOrderInfo[0].amountPayable
              }}
              </div>
              <div class="item">
                实付款：{{ oldOrderInfo[0].paidAmount === null ? 0 : oldOrderInfo[0].paidAmount }}
              </div>
            </div>
            <div class="boxs title">备注：{{ oldOrderInfo[0].billingRemarks }}</div>
          </div>
          <div class="title" style="margin-top: 10px">结账列表</div>
          <el-table
            :data="oldClosingList"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column prop="payName" label="收银科目" />
            <el-table-column prop="paymentAmount" label="结账金额" />
            <el-table-column prop="remark" label="备注" width="200" />
          </el-table>
          <div class="title" style="margin-top: 10px">收费明细</div>
          <el-table
            v-if="oldOrderInfo[0].billType === '6'"
            :data="orderDetailsList"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column label="产品名称" prop="projectName" />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总价" prop="sumPrice" />
            <el-table-column label="折扣" prop="discountNumber" />
            <el-table-column label="折后金额" prop="discountAmount" />
            <el-table-column label="每次用量" prop="eachTime" />
            <el-table-column label="用药单位" prop="pharmacy" />
            <el-table-column label="备注" prop="remark" />
          </el-table>

          <el-table
            v-if="(oldOrderInfo[0].billType === '1' || oldOrderInfo[0].billType === '2' || oldOrderInfo[0].billType === '7' || oldOrderInfo[0].billType === '8' || oldOrderInfo[0].billType === '19') && oldOrderInfo[0].oldBillType !== '6'"
            :data="orderDetailsList"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
<!--            哈哈找到了-->
            <el-table-column
              fixed="left"
              prop="projectName"
              label="产品名称/规格"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="合计金额" width="70" />
            <el-table-column prop="discount" label="折扣" width="45" />
            <el-table-column prop="discountAmount" label="折后金额" width="70" />
            <el-table-column prop="allowanceAmount" label="折让金额" width="70" />
            <el-table-column prop="billingPerformance" label="开单业绩" width="70" />
            <el-table-column prop="departmentPerformance" label="科室业绩" width="70" />
            <el-table-column prop="priceNum" label="产品次数" width="70" />
            <el-table-column prop="quantitySum" label="产品总次数" width="85" />
            <el-table-column prop="treatedNum" label="已治疗次数" width="85" />
            <el-table-column prop="surplusQuantity" label="剩余次数" width="70" />
            <el-table-column prop="refundNum" label="退款次数" width="70" />
            <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
          </el-table>

          <el-table
            v-if="oldOrderInfo[0].billType === '11'"
            :data="orderDetailsList"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column
              fixed="left"
              prop="projectName"
              label="产品名称/规格"
              width="200"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="company" label="单位" width="50" />
            <el-table-column prop="totalAmount" label="合计金额" />
            <el-table-column prop="discount" label="折扣" width="50" />
            <el-table-column prop="discountAmount" label="折后金额" />
            <el-table-column prop="priceNum" label="产品次数" />
            <el-table-column prop="quantitySum" label="产品总次数" />
            <el-table-column prop="refundReason" label="退款原因">
              <template>
                <span
                  v-for="item in dict.type.refund_reason"
                  :key="item.value"
                >{{ item.value === oldOrderInfo[0].reasonForRefund ? item.label : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
          </el-table>
          <el-table
            v-if="oldOrderInfo[0].billType === '9'"
            :data="orderDetailsList"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            
          >
            <el-table-column
              fixed="left"
              prop="projectName"
              label="产品名称/规格"
              width="200"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="quantity" label="数量(单位)" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity + '(' + scope.row.company + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="合计金额" />
            <el-table-column prop="discount" label="折扣" width="50" />
            <el-table-column prop="discountAmount" label="折后金额" />
            <el-table-column prop="priceNum" label="产品次数" />
            <el-table-column prop="quantitySum" label="产品总次数" />
            <el-table-column prop="thisAmount" label="还款金额" />
            <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
          </el-table>
        </el-card>
      </div>

      <div class="footer">
        <div class="content">
          <el-button type="danger" plain icon="el-icon-close" size="mini" @click="signOut">关闭</el-button>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>

import { math } from '@/utils/math'
import vm from '@/utils/util'
import SgTable from '@/components/Table'

export default {
  name: 'BillDetails',
  dicts: ['billing_type', 'refund_reason', 'billing_status'],
  components: {
    SgTable
  },
  data() {
    return {
      data: {},
      tableData: [], // 产品明细
      ClosingList: [], // 结账列表
      orderDetailsList: [], // 欠还款列表
      projectList: '', //   物资列表
      oldOrderInfo: [],
      showOldDetailsList: true,
      oldClosingList: [],
      // 辅助治疗关联的物资列表
      materialList: [],
      orderInfo: {},
      columns: [
        {
          lab: '项目储值名称',
          val: 'projectName'
        },
        {
          lab: '储值现金',
          val: 'totalPayment'
        },

        {
          lab: '储值赠送',
          val: 'num2'
        },
        {
          lab: '储值本金',
          val: 'num1'
        },
        {
          lab: '比例',
          val: 'num3',
          custom: 'num3'

        },
        {
          lab: '项目储值卡号',
          val: 'itemId'
        }
      ],
      tableDatavalue1: [],
      columns1: [
        {
          lab: '项目储值名称',
          val: 'projectName'
        },
        {
          lab: '储值现金',
          val: 'totalPayment'
        },

        {
          lab: '储值赠送',
          val: 'num2'
        },
        {
          lab: '储值本金',
          val: 'num1'
        },
        {
          lab: '比例',
          val: 'num3'
        },
        {
          lab: '项目储值卡号',
          val: 'itemId'
        }
      ],
      tableDatavalue: []
    }
  },
  created() {

    this.data = JSON.parse(sessionStorage.getItem('billDetailsitem'))
    this.$api.modules.billingList.ChargeList({
      orderNumber: this.data.orderNumber
    }).then(res => {
      if (res) {
        this.orderInfo = res.rows[0]
        if (this.orderInfo.paidAmount < 0) {
          this.orderInfo.paidAmount = math.multiply(this.orderInfo.paidAmount, -1)
        }
        this.ChargeDetails() // 收费明细
        this.ChargeRecord() // 结账列表
        this.getOrderInfo()
      }
    })
    // 获取收费单关联的物资列表
    this.getMaterialList()
  },
  methods: {
    // 获取收费单关联的物资列表
    getMaterialList() {
      this.$api.finance.getMaterialList(this.data.orderNumber).then(res => {
        this.materialList = res.data
      })
    },
    /**
         * @author Nevin
         * @date 2022/6/16
         * @Description: 获取订单   this.orderInfo.billType === '12' ||
         */
    getOrderInfo() {

      if (this.orderInfo.billType === '9' ||
                this.orderInfo.billType === '11' ||
                this.orderInfo.billType === '12' ||
                this.orderInfo.billType === '13' ||
                this.orderInfo.billType === '14') {
        this.$api.billingList.ChargeList({
          orderNumber: this.orderInfo.chargeSheetId
        }).then(res => {
          if (res.rows.length > 0) {
            this.oldOrderInfo = res.rows

            this.oldOrderInfo.forEach(item => {
              if (item.paidAmount < 0) {
                item.paidAmount = math.multiply(item.paidAmount, -1)
              }

              this.getOrderDetailsList(item)
              this.getChargeRecord(item)
            })
            this.showOldDetailsList = false
          }
        })
      } else {
        this.$api.billingList.ChargeList({
          chargeSheetId: this.orderInfo.orderNumber
        }).then(res => {
          if (res.rows.length > 0) {

            this.oldOrderInfo = res.rows
            this.oldOrderInfo.forEach(item => {
              if (item.paidAmount < 0) {
                item.paidAmount = math.multiply(item.paidAmount, -1)
              }

              this.getOrderDetailsList(item)
              this.getChargeRecord(item)
            })
            this.showOldDetailsList = false
          }
        })
      }
    },
    getChargeRecord(item) {
      this.$api.billingList.ChargeRecord({
        id: item.id,
        orderNumber: item.orderNumber
      }).then((res) => {
        if (res) {
          this.oldClosingList = res.rows
          this.oldOrderInfo.forEach(items => {
            if (items.orderNumber === item.orderNumber) {
              this.$set(items, 'oldClosingList', this.oldClosingList)
            }
          })
        }
      })
    },
    /**
         * @author Nevin
         * @date 2022/5/31
         * @Description: 开单状态
         */
    BillStatusName(str) {
      const obj = this.dict.type.billing_status.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    signOut() {
      this.closeTag()
    },
    // 收费明细
    ChargeDetails() {
      if (this.orderInfo.billType === '9' && this.orderInfo.oldBillType === '6') {
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
        }).then(res => {
          if (res) {
            this.tableData = res.rows
            this.tableData.forEach(item => {
              this.$set(item, 'treatedNum', math.subtract(item.quantitySum, item.surplusQuantity))
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
            })
          }
        })
      } else if (this.orderInfo.billType === '11' && this.orderInfo.oldBillType === '6') {
        // 退款单
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
        }).then(res => {
          if (res) {
            this.tableData = res.rows
            this.tableData.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              this.$set(item, 'surplusQuantity', math.subtract(item.surplusQuantity, item.refundNum))
              this.$set(item, 'treatedNum', math.subtract(math.subtract(item.quantitySum, item.surplusQuantity), item.refundNum))
            })
          }
        })
      } else if (this.orderInfo.billType === '6') {
        // this.$api.billingList.adjuvantBillingList({
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
          // relationshipNumber: this.orderInfo.orderNumber
        }).then(res => {
          if (res) {
            this.tableData = res.rows
            this.tableData.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              this.$set(item, 'surplusQuantity', math.subtract(item.surplusQuantity, item.refundNum))
              this.$set(item, 'treatedNum', math.subtract(math.subtract(item.quantitySum, item.surplusQuantity), item.refundNum))
            })
          }
        })
      } else if (this.orderInfo.billType === '9') {
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
        }).then((res) => {
          if (res) {
            this.tableData = res.rows
            this.tableData.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              this.$set(item, 'surplusQuantity', math.subtract(item.surplusQuantity, item.refundNum))
              this.$set(item, 'treatedNum', math.subtract(math.subtract(item.quantitySum, item.surplusQuantity), item.refundNum))
            })
          }
        })
      } else if (this.orderInfo.billType === '2') {
        this.$api.billingList.reservationDataDetailed({
          orderNumber: this.orderInfo.orderNumber
        }).then(res => {
          this.tableData = res.rows
          // console.log('預約金',this.tableData )
          this.tableData.forEach(item => {
            if (item.billingPerformance === undefined) {
              item.billingPerformance = 0
            }
            if (item.departmentPerformance === undefined) {
              item.departmentPerformance = 0
            }
            // console.log(item.surplusQuantity, item.refundNum)
            this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
            // this.$set(item, 'surplusQuantity', math.subtract(item.surplusQuantity, item.refundNum))
            // this.$set(item, 'treatedNum', math.subtract(math.subtract(item.quantitySum, item.surplusQuantity), item.refundNum))
          })
        })
      } else if (this.orderInfo.billType === '3') {
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
        }).then((res) => {
          if (res) {
            res.rows.forEach(item => {
              item.num1 = Number(item.projectName.slice(3).match(/(\S*)--赠金:/)[1])
              item.num2 = Number(item.projectName.slice(3).match(/--赠金:(\S*)/)[1])
              item.num3 = item.num2 / item.num1
            })
            this.tableDatavalue = res.rows
          }
        })
      } else {
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
        }).then((res) => {
          if (res) {
            this.tableData = res.rows
            this.tableData.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              if(item.refundNum){
                this.$set(item, 'surplusQuantity', math.subtract(item.surplusQuantity, item.refundNum))
                this.$set(item, 'treatedNum', math.subtract(math.subtract(item.quantitySum, item.surplusQuantity), item.refundNum))
              }
            
              
            })
          }
        })
      }
    },
    /**
         * @author Nevin
         * @date 2022/5/29
         * @Description: 获取欠还款列表
         */
    getOrderDetailsList(item) {
      if (item.billType === '9' && item.oldBillType === '6') {
        this.$api.billingList.orderDetailsList({
          orderNumber: item.orderNumber
        }).then(res => {
          if (res) {
            this.orderDetailsList = res.rows
            this.orderDetailsList.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              // this.$set(item, 'treatedNum', math.subtract(item.quantitySum, item.surplusQuantity))
            })
            this.oldOrderInfo.forEach(items => {
              if (items.orderNumber === item.orderNumber) {
                this.$set(items, 'orderDetailsList', this.orderDetailsList)
              }
            })
          }
        })
      } else if (item.billType === '11' && item.oldBillType === '6') {
        this.$api.billingList.orderDetailsList({
          orderNumber: item.orderNumber
        }).then(res => {
          if (res) {
            this.orderDetailsList = res.rows
            this.orderDetailsList.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              // this.$set(item, 'treatedNum', math.subtract(item.quantitySum, item.surplusQuantity))
            })
            this.oldOrderInfo.forEach(items => {
              if (items.orderNumber === item.orderNumber) {
                this.$set(items, 'orderDetailsList', this.orderDetailsList)
              }
            })
          }
        })
      } else if ((item.billType === '9' || item.billType === '11') && item.billType !== '6') {
        this.$api.billingList.orderDetailsList({
          orderNumber: item.orderNumber
        }).then((res) => {
          if (res) {
            this.orderDetailsList = res.rows
            this.orderDetailsList.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              // this.$set(item, 'treatedNum', math.subtract(item.quantitySum, item.surplusQuantity))
            })
            this.oldOrderInfo.forEach(items => {
              if (items.orderNumber === item.orderNumber) {
                this.$set(items, 'orderDetailsList', this.orderDetailsList)
              }
            })
          }
        })
      } else if (item.billType === '6') {
        this.$api.billingList.adjuvantBillingList({
          relationshipNumber: item.orderNumber
        }).then(res => {
          if (res) {
            this.orderDetailsList = res.rows
            this.orderDetailsList.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              // this.$set(item, 'treatedNum', math.subtract(item.quantitySum, item.surplusQuantity))
            })
            this.oldOrderInfo.forEach(items => {
              if (items.orderNumber === item.orderNumber) {
                this.$set(items, 'orderDetailsList', this.orderDetailsList)
              }
            })
          }
        })
      } else if (this.orderInfo.billType === '3') {
        this.$api.billingList.orderDetailsList({
          orderNumber: this.orderInfo.orderNumber
        }).then((res) => {
          if (res) {
            res.rows.forEach(item => {
              item.num1 = Number(item.projectName.slice(3).match(/(\S*)--赠金:/)[1])
              item.num2 = Number(item.projectName.slice(3).match(/--赠金:(\S*)/)[1])
              item.num3 = item.num2 / item.num1
            })
            this.tableDatavalue1 = res.rows
          }
        })
      } else if(item.billType === '2'){
        this.$api.billingList.reservationDataDetailed({
          orderNumber: item.orderNumber
        }).then(res => {
          this.orderDetailsList = res.rows

        })
      } else {
        this.$api.billingList.orderDetailsList({
          orderNumber: item.orderNumber
        }).then((res) => {
          if (res) {
            this.orderDetailsList = res.rows
            this.orderDetailsList.forEach(item => {
              this.$set(item, 'allowanceAmount', math.subtract(item.discountAmount, item.billingPerformance))
              this.$set(item, 'surplusQuantity', math.subtract(item.surplusQuantity, item.refundNum))
              this.$set(item, 'treatedNum', math.subtract(math.subtract(item.quantitySum, item.surplusQuantity), item.refundNum))
            })
            this.oldOrderInfo.forEach(items => {
              if (items.orderNumber === item.orderNumber) {
                this.$set(items, 'orderDetailsList', this.orderDetailsList)
              }
            })
          }
        })
      }
    },
    // 开单
    customOpen(str) {
      const obj = this.dict.type.billing_type.find(item => item.value === str)
      return obj ? obj.label : '未知'
    },
    // 收费记录
    ChargeRecord() {
      this.$api.billingList.ChargeRecord({
        id: this.orderInfo.id,
        orderNumber: this.orderInfo.orderNumber
      }).then((res) => {
        if (res) {
          // alert('123')
          console.log(res.rows,'dsdasd')
          this.ClosingList = res.rows
        }
      })
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;

  .left, .right {
    width: 48.5%;
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
      //width: 76.6%;
      .item {
        box-sizing: border-box; /*border计算在width中*/
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        width: 33.33%;
        font-size: 12px !important;
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

.footer {
  position: fixed;
  bottom: 0;
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

.rights {
  height: 40px;
  line-height: 40px;
  padding-left: 8px;
  background-color: #ffffff;

  .itemfont {
    font-size: 12px;
  }
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar[data-v-3363c4d1] {
  height: 40px !important;
  padding: 0px !important;
}
</style>
