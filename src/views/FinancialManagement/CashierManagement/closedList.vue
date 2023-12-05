<template>
  <!-- 已结账列表 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData(true)" @keydown.enter.native="getData(true)">查询
        </el-button>
        <el-button v-has-permi="['payment:toBePaidList:export']" type="success" size="mini" icon="el-icon-upload2" plain
          :loading="submitLoading" @click.stop="exportExcel">导出
        </el-button>
      </div>
      <slot>
        <sg-table id="out-table" ref="table" :row-key="handle" :sg-ref="'multipleTable'" size="mini" border index="序号"
          :expand-row-keys="expands" highlight-current-row :table-data="tableData" :columns="columns"
          :pagination="pagination" :cell-class-name="cellClassName" @size-change="sizeChange" @current-change="currentChange" @row-click="rowClick"
          @selection-change="handleSelectionChange" @expand-change="expandChange" >
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
            <div>
              <p>实付汇总金额: {{ summary }}元
                &nbsp;&nbsp;
                <span>选中记录 : {{
                  placeorder > 0 ? placeorder : -placeorder
                }}元[ 实付：{{ placeorder > 0 ? placeorder : 0 }}元 <span style="color: red "> 退款:{{
  placeorder < 0 ? -placeorder : 0 }}元</span> ]</span>&nbsp;
              </p>
            </div>
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px;cursor:pointer"><i class="el-icon-s-fold" @click="getDialog" /> 列表清单</span>
            <div style="float: right">
              <el-button v-has-permi="['paidList:toBePaidList:backmoney']" type="primary"  size="mini"  plain @click="clickbackmoney">{{tagtitle}}</el-button>
              <el-tooltip content="该按钮功能收费类型为退款单才可以使用" placement="top">
              <el-button v-has-permi="['paidList:toBePaidList:backdelte']" type="primary" :disabled="refundCancellation" size="mini"  plain @click="clickbackdelete">清除退款单</el-button>
              </el-tooltip>
              <el-tooltip content="该按钮功能收费类型为住院结算及退住院结算且时间为当天才可以使用" placement="top">
              <el-button v-has-permi="['paidList:toBePaidList:back']" type="primary" size="mini" :disabled="backdisable" plain @click="clickback">返结账  </el-button>
              </el-tooltip>
            </div>
          </div>
          <!--字典调用-->
          <template #custom="data">

            <div v-if="data.props === 'assist'">
              <div>{{data.custom.assist!==""?'是':"否"}}</div>
            </div>
            <div v-if="data.props === 'billType'">
              <show-dict-data :options="dict.type.billing_type" :class="data.custom.billType == 11
               || data.custom.billType == 12
               || data.custom.billType == 22
               || data.custom.billType == 13
               || data.custom.billType == 18
               || data.custom.billType == 14
               || data.custom.billType == 15
               || data.custom.billType == 20
               || data.custom.billType == 16
               ? 'redClass' : ''"
                :value="data.custom.billType" />
            </div>
            <div v-if="data.props === 'paidAmount'">
              <span :class="data.custom.billType == 11
               || data.custom.billType == 12
               || data.custom.billType == 22
               || data.custom.billType == 13
               || data.custom.billType == 18
               || data.custom.billType == 14
               || data.custom.billType == 15
               || data.custom.billType == 20
               || data.custom.billType == 16
               ? 'redClass' : 'redClass1'"> {{ data.custom.paidAmount }}</span>
            </div>
            <div v-else-if="data.props === 'customerName'">
              <a style="color: #5f94de;cursor: pointer;"
                @click="customer(data.custom.id, data.custom, data.custom.numberId, data.custom.id)">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                {{ data.custom.orderNumber }}
              </a>
            </div>
            <div v-else-if="data.props === 'chargeSheetId'">
              <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
                {{ data.custom.chargeSheetId }}
              </a>
            </div>
            <div v-else-if="data.props === 'isPackage'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isPackage" />
            </div>
            <div v-else-if="data.props === 'reasonForRefund'">
              <show-dict-data :options="dict.type.refund_reason" :value="data.custom.reasonForRefund" />
            </div>
          </template>
          <template #expands="data">
            <span style="font-size: 14px;padding: 0 10px">
              <i class="el-icon-printer" style="color: #5f94de" />
              <a style="color: #5f94de;cursor: pointer" @click="printOrderDetails(data.expands)">明细打印</a>
            </span>
            <!--<span style="font-size: 14px;padding: 0 10px">-->
            <!--  <i class="el-icon-printer" style="color: #5f94de" />-->
            <!--  <a style="color: #5f94de;cursor: pointer" @click="printSetMeal(data.expands)">套餐打印</a>-->
            <!--</span>-->
            <span style="font-size: 14px;padding: 0 10px" v-if="data.expands.isPackage!=''">
              <i class="el-icon-printer" style="color: #5f94de" />
              <a style="color: #5f94de;cursor: pointer" @click="printSetMealDetails(data.expands)">套餐明细打印</a>
            </span>
            <span style="font-size: 14px;padding: 0 10px" v-has-permi="['payment:toBePaidList:paidList:listqd']" v-if="data.expands.billType==17 ||data.expands.billType==10">
              <i class="el-icon-printer" style="color: #5f94de" />
              <a style="color: #5f94de;cursor: pointer" @click="printSetMealDetailsfy(data.expands)">费用结算清单</a>
            </span>
            <span style="font-size: 14px;padding: 0 10px" v-has-permi="['payment:toBePaidList:paidList:list']" v-if="data.expands.billType==17 ||data.expands.billType==10">
              <i class="el-icon-printer" style="color: #5f94de" />
              <a style="color: #5f94de;cursor: pointer" @click="printSetMealDetailsfys(data.expands)">费用结算单</a>
            </span>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <send-message :show-send-message-dialog="showSendMessageDialog" :selection-data="selectionData"
      @closeDialog="closeDialog" />
    <vue-easy-print ref="orderDetailsPrint">
      <order-details-print :print="print" :message="newmessage" :customCardNumberlist="customCardNumberlist" :details="details" :total="total" :final-pay-data="finalPayData" :paidAmountlist="paidAmountlist" />
    </vue-easy-print>
    <!--<vue-easy-print ref="setMealPrint">-->
    <!--  <set-meal-print-->
    <!--    :print="print"-->
    <!--    :details="details"-->
    <!--    :total="total"-->
    <!--    :final-pay-data="finalPayData"-->
    <!--  />-->
    <!--</vue-easy-print>-->
    <vue-easy-print ref="setMealDetailsPrint">
      <set-meal-details-print :package-order-detail="packageDetailPrintData.packageOrderDetail"
        :package-items="packageDetailPrintData.packageItems" :payment-methods="packageDetailPrintData.paymentMethods" />
    </vue-easy-print>
    <vue-easy-print ref="orderDetailsPrintfy">
      <div style="position: relative">


      <div class="order_detail">
        <h1>{{newmessage}}费用结算清单</h1>
      </div>
      <div class="order_detail_basic" style="margin-top: 20px">
        <div style="width: 33%">
          姓名:{{ vals.customerName }}
        </div>
        <div style="width: 33%">
          年龄:{{ vals.customAge }}
        </div>
        <div style="width: 33%">
          性别:{{ vals.customSex == '0' ? '男' : "女" }}
        </div>
      </div>
        <div class="order_detail_basic">
          <div style="width: 33%">
            床号:{{ hosiptalData.bedNumber }}
          </div>
          <div style="width: 33%">
            住院天数:{{ hosiptalData.days }}
          </div>
          <div style="width: 33%">
            医疗付款:{{ hosiptalData.fyzffs }}
          </div>
        </div>
        <div class="order_detail_basic" >
          <div style="width: 33%">
            金额:{{ strlist }}
          </div>
          <div style="width: 33%">
            预交押金:{{ hosiptalData.deposit }}
          </div>
          <div style="width: 33%" >
            医生:{{ hosiptalData.doctorName }}
          </div>
        </div>
        <div class="order_detail_basic" style="justify-content: space-between">
          <div style="width: 50%">

            <span >入院时间:</span>
            {{ hosiptalData.hospitalTime }}
          </div>
          <div style="width: 50%">
            <span v-if="vals.waitSource=='0'">出院时间:{{vals.checkoutTime}}</span>
            <span v-else>出院时间:{{ hosiptalData.leaveTime }}</span>
          </div>
        </div>
        <div class="order_detail_basic" style="justify-content: normal">
          <div style="width: 45%">
            <span v-if="vals.waitSource=='0'">入住时间:</span>
            <span v-else>统计时间:</span>
           {{ hosiptalData.hospitalTime }}
          </div>
          <div style="margin-right: 30px" v-if="vals.waitSource=='1'">
            至
          </div>
          <div style="width: 50%" v-if="vals.waitSource=='1'">
            结束时间:{{ hosiptalData.leaveTime == undefined ? timeFmt('YYYY-mm-dd HH: MM: SS',new Date()): hosiptalData.leaveTime }}
          </div>
        </div>

      <div >
        <div style="width:700px" class="tablist">
          <el-table
            :data="tableDataaccount"
             border
            :height="tableDataaccount.length==0?200:''"
            >
            <el-table-column
              prop="itemName"
              label="项目名称"
              align="center"
              width="100"


            >
            </el-table-column>
            <el-table-column
              prop="amount"
              label="数量"
              align="center"
              width="50"

            >
            </el-table-column>
            <el-table-column
              prop="materialSpec"
              label="规格"
              align="center"


            ></el-table-column>
              <el-table-column
                prop="doseUnit"
                label="单位"
                align="center"


              ></el-table-column>
                <el-table-column
                  prop="unitPrice"
                  label="单价"
                  align="center"


                ></el-table-column>
                  <el-table-column
                    prop="discountAmount"
                    label="优惠"
                    align="center"


                  />
                    <el-table-column
                      prop="pricingTime"
                      label="审核时间"
                      align="center"
                     width="145"

                    />
            <el-table-column
              prop="amountReceived"
              label="金额"
              align="center"
              width="80"


            >
            </el-table-column>
          </el-table>
        </div>

      </div>
        <div class="order_detail_basic" style="display: flex;justify-content: space-between">
          <div style="position: relative;width: 100%;display: flex;justify-content: space-between" >

            <div style="">
              <span>合计:<span style="margin-left:20px;"> {{ strlist }}</span></span>
            </div>
            <div>
              <span>时间: <span style="margin-left:20px;"> {{ timeFmt('YYYY-mm-dd HH:MM:SS', new Date()) }}</span></span>
            </div>
          </div>

        </div>
      </div>
    </vue-easy-print>
    <vue-easy-print ref="neworderDetailsPrintfy">
      <div style="position: relative">


        <div class="order_detail">
          <h1>{{newmessage}}费用结算单</h1>
        </div>
        <div class="order_detail_basic" style="margin-top: 20px">
          <div>
            <span style="width: 300px;display:inline-block;">姓名:{{ vals.customerName }}</span>
            <span style="margin-left: 10px;width: 100px;display:inline-block">年龄:{{ vals.customAge }}</span>
            <span style="margin-left: 100px;">性别:{{ vals.customSex == '0' ? '男' : "女" }}</span>
          </div>
        </div>
        <div class="order_detail_basic" >
          <div   style="width: 100%;min-height: 50px;display: flex;flex-wrap: wrap">
            <div style="margin-top: 20px;margin-right: 20px;width: 45%;" v-for="item in listone" v-if="item.payAmount>0">{{ item.typeName }} : <span style="margin-left: 10px">{{item.payAmount }}</span>   </div>
          </div>
        </div>
        <div class="order_detail_basic" style="display: flex;justify-content: space-evenly">
          <div style="position: relative">
            <div style="">
              <span v-if="this.vals.billType=='10'||this.vals.billType=='17'">预收:<span style="margin-left:20px;"> {{ this.ysmoney }}</span></span>
            </div>
          </div>
          <div style="position: relative">
            <div style="">
              <span v-if="this.vals.billType=='10'||this.vals.billType=='17'">结算:<span style="margin-left:20px;"> {{ this.jsmoney }}</span></span>
            </div>
          </div>
          <div style="position: relative;display: flex;justify-content: space-between">
            <div style="">
              <span>合计:<span style="margin-left:20px;"> {{ strlist }}</span></span>
            </div>

          </div>
        </div>
        <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;margin-top: 20px">
          <div style="">{{capAmountToStringel}}</div>
          <div style="font-size: 24px">
            <span style="font-size: 16px">时间: <span style="margin-left:20px;"> {{ timeFmt('YYYY-mm-dd HH:MM:SS', new Date()) }}</span></span>
          </div>



              <!-- <span style="margin-left: 90px;">应退: <span style="margin-left:20px;"> 360</span></span> -->


        </div>


<!--        <div class="order_detail_basic" style="">-->
<!--          <div style="position: relative">-->
<!--            <div style="position: absolute;right:150px">-->
<!--              <span>合计:<span style="margin-left:20px;"> {{ strlist }}</span></span>-->
<!--            </div>-->

<!--            &lt;!&ndash;          <span style="margin-left:80px" >住院押金: <span style="margin-left:20px;"> {{ deposit}}</span></span>&ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="order_detail_basic">-->
<!--          <div style="position: relative">-->
<!--            <div style="position: absolute;right:0">-->
<!--              <span>时间: <span style="margin-left:20px;"> {{ timeFmt('YYYY-mm-dd HH:MM:SS', new Date()) }}</span></span>-->
<!--            </div>-->


<!--            &lt;!&ndash; <span style="margin-left: 90px;">应退: <span style="margin-left:20px;"> 360</span></span> &ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </vue-easy-print>
    <sg-table id="out-table" size="mini" index="序号" style="display: none" :table-data="tableDatas" :columns="columns">
      <template #custom="data">
        <div v-if="data.props === 'billType'">
          <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
        </div>
        <div v-else-if="data.props === 'customerName'">
          <a style="color: #5f94de;cursor: pointer;"
            @click="customer(data.custom.id, data.custom, data.custom.numberId, data.custom.id)">
            {{ data.custom.customerName }}
          </a>
        </div>
        <div v-else-if="data.props === 'orderNumber'">
          <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
            {{ data.custom.orderNumber }}
          </a>
        </div>
        <div v-else-if="data.props === 'chargeSheetId'">
          <a style="color: #5f94de;cursor: pointer;" @click="orderNumber(data.custom)">
            {{ data.custom.chargeSheetId }}
          </a>
        </div>
        <div v-else-if="data.props === 'isPackage'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isPackage" />
        </div>
        <div v-else-if="data.props === 'reasonForRefund'">
          <show-dict-data :options="dict.type.refund_reason" :value="data.custom.reasonForRefund" />
        </div>
      </template>
    </sg-table>
    <sgDialog title="自定义配置" size="360px" :modal="false" :dialog="showDialogS" @handleClose="showdialogT">
      <div slot="out">
        <sg-table ref="sortRef" :sg-ref="'sortRefs'" size="mini" :row-key="getlab" :table-data="sortList"
          :columns="columnssortList" border index="序号" selection class="drow_table" :select-enable="selectEnable"
          :row-class-name="tableRowClassName" @select="itemHandleSelectionChange">
          <div slot="searchBar" />
          <template #custom="data">
            <div v-if="data.props === 'icon'">
              <i class="el-icon-d-caret" />
            </div>
          </template>
        </sg-table>
      </div>
    </sgDialog>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import moment from 'moment'
import SendMessage from '@/components/SendMessage'
import {newgetData, todayTime} from '@/utils/time'
import vueEasyPrint from 'vue-easy-print'
import orderDetailsPrint from '@/components/Print/orderDetailsPrint'
// import setMealPrint from '@/components/Print/setMealPrint'
import setMealDetailsPrint from '@/components/Print/setMealDetailsPrint'
import { math } from '@/utils/math'
import sgDialog from '@/components/Dialog/index'
import Sortable from 'sortablejs' // 排序拖拽
import { log } from 'mathjs'
export default {
  dicts: ['whether', 'billing_type', 'refund_reason'],
  components: {
    vueEasyPrint,
    orderDetailsPrint,
    // setMealPrint,
    setMealDetailsPrint,
    SgTable,
    slideSearch,
    SendMessage,
    sgDialog
  },
  data() {
    return {
      listone: [],
      tagtitle:"开发票",
      paidAmountlist:-1000,
      customCardNumberlist:'',
      hosiptalData:"",
      refundCancellation:true,
      tableDataaccount:[],
      capAmountToStringel:"",
      ysmoney:"",
      jsmoney:"",
      newmessage:"",
      deposit:0,
      summary: 0.00, // 汇总金额
      expands: [], // 存放展开行的ID
      print: {},
      details: [],
      total: '',
      userInfo: {},
      finalPayData: '',
      tableDatas: [],
      submitLoading: false,
      coument: '',
      payableSigle: 0,
      placeorder: 0, // 下单人数
      checkOut: 0,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      // 套餐打印的表单数据
      packageDetailPrintData: {},
      // 序列清单
      columns: [
        {
          lab: '打印',
          val: 'print',
          expands: {}
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 100
        },

        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '收银员',
          val: 'cashierName',
          width: 100
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 120,
          showOverflowTooltip: true
        },
        // {
        //   lab: '是否开发票',
        //   val: '暂无',
        //   width: 100
        // },
        // {
        //   lab: '是否返款',
        //   val: '暂无'
        // },
        {
          lab: '折前合计',
          val: 'totalExpenses'
        },
        {
          lab: '费用合计',
          val: 'totalExpenses'
        },
        {
          lab: '实付款',
          val: 'paidAmount', // 合计金额
          custom: 'paidAmount'
        },
        {
          lab: '科室业绩',
          val: 'departmentPerformance',
          width: 100
        },
        {
          lab: '是否已开发票',
          val: 'assist',
          width: 100,
          custom: 'assist'
        },
        {
          lab: '媒介类型',
          val: 'typeName',
          width: 120
        },
        {
          lab: '媒介信息',
          val: 'channelName',
          width: 120
        },
        {
          lab: '来源渠道',
          val: 'typeThreeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '结账方式',
          val: 'payNameAmount',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '收费备注',
          val: 'billingRemarks',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '财务收支金额',
          val: 'paidAmount',
          width: 110
        },
        {
          lab: '源单据号',
          val: 'chargeSheetId',
          custom: 'chargeSheetId',
          width: 165
        },
        {
          lab: '源单据结账时间',
          val: 'sourceCheckoutTime',
          width: 140
        },
        {
          lab: '退款原因',
          val: 'reasonForRefund',
          custom: 'reasonForRefund'
        },
        {
          lab: '是否套餐',
          val: 'isPackage',
          custom: 'isPackage'
        }
      ],
      columns1: [
        {
          lab: '打印',
          val: 'print',
          expands: {}
        },
        {
          lab: '结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '收费单编号',
          val: 'orderNumber',
          custom: 'orderNumber',
          width: 165
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType',
          width: 100
        },
        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '收银员',
          val: 'cashierName',
          width: 100
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 120,
          showOverflowTooltip: true
        },
        // {
        //   lab: '是否开发票',
        //   val: '暂无',
        //   width: 100
        // },
        // {
        //   lab: '是否返款',
        //   val: '暂无'
        // },
        {
          lab: '折前合计',
          val: 'totalExpenses'
        },
        {
          lab: '费用合计',
          val: 'totalExpenses'
        },
        {
          lab: '实付款',
          val: 'paidAmount', // 合计金额
          custom: 'paidAmount'
        },
        {
          lab: '媒介类型',
          val: 'typeName'
        },
        {
          lab: '媒介信息',
          val: 'channelName'
        },
        {
          lab: '来源渠道',
          val: 'typeThreeName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '结账方式',
          val: 'payNameAmount',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '收费备注',
          val: 'billingRemarks',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '财务收支金额',
          val: 'paidAmount',
          width: 110
        },
        {
          lab: '源单据号',
          val: 'chargeSheetId',
          custom: 'chargeSheetId',
          width: 165
        },
        {
          lab: '源单据结账时间',
          val: 'checkoutTime',
          width: 140
        },
        {
          lab: '退款原因',
          val: 'reasonForRefund',
          custom: 'reasonForRefund'
        },
        {
          lab: '是否套餐',
          val: 'isPackage',
          custom: 'isPackage'
        }
      ],
      // 查询出列表
      options: {
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        orderNumber: {
          type: 'input',
          label: '收费单号:',
          clearable: true
        },
        customerName: {
          type: 'input',
          label: '客户姓名:',
          clearable: true
        },
        customPhone: {
          type: 'input',
          label: '电话:',
          clearable: true
        },
        customCardNumber: {
          type: 'input',
          label: '顾客卡号:',
          clearable: true
        },
        channel: {
          type: 'Tselect',
          label: '媒介类型',
          clearable: true,
          values: [],
          options: []
        },
        // paymentChannel: {
        //   type: 'cascader',
        //   label: '渠道:',
        //   props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
        //   options: [],
        //   clearable: true
        // },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问:',
          options: [],
          clearable: true
        },
        billType: {
          type: 'select',
          label: '收费类型:',
          options: [],
          clearable: true
        },
        paidAmount: {
          type: 'Tinput',
          label: '实付款',
          values: [],
          clearable: true
        },
        departmentId: {
          type: 'select',
          label: '科室',
          options: [],
          clearable: true
        },
        cashierName: {
          type: 'select',
          label: '收银员',
          options: [],
          clearable: true
        },
        // Invoice: {
        //   type: 'select',
        //   label: '是否开发票',
        //   options: [],
        //   clearable: true
        // },
        // isHospitasl: {
        //   type: 'select',
        //   label: '是否返款',
        //   options: [],
        //   clearable: true
        // },
        paymentChannel: {
          type: 'select',
          label: '结账方式',
          options: [],
          clearable: true
        },
        billingRemarks: {
          type: 'input',
          label: '收费备注:',
          clearable: true
        },
        chargeSheetId: {
          type: 'input',
          label: '源单据号:',
          clearable: true
        },
        sourceCheckoutTime: {
          type: 'Tdatetime',
          label: '源单据结账时间',
          clearable: true,
          values: []
        },
        reasonForRefund: {
          type: 'select',
          label: '退款原因',
          options: [],
          clearable: true
        },
        pmIds: {
          type: 'select',
          label: '是否套餐',
          options: [],
          clearable: true
        }
      },
      strlist: 0,
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      showDialogS: false,
      sortList: [], // 顺序列表
      columnssortList: [
        {
          lab: '列名',
          val: 'lab'
        },
        {
          lab: '拖动调整顺序',
          val: 'icon',
          custom: 'icon'
        }
      ],
      selectionDataSortList: [],
      selectionlist: [],
      cancelList: [],
      xflagList: [],
      vals: "",
      Indexlist: 1,
      backdisable:true,
      backList:{}
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
      this.getChannelInfo(val)
      this.getData()
      this.getUserList(val)
    },
    // 媒介
    'options.channel.values'() {
      if (this.options.channel.values[0]) {
        this.options.channel.options[1] = this.channelType.filter(filter => {
          return filter.typeId === this.options.channel.values[0]
        })[0].channelInfo
      } else {
        this.options.channel.options[1] = []
      }
    },
    'options.channel.values.0'() {
      this.options.channel.values[1] = ''
    }
  },
  mounted() {
    // this.$refs.orderDetailsPrintfy.print();
  },
  created() {
    this.columns = JSON.parse(localStorage.getItem('flagList')) ? JSON.parse(localStorage.getItem('flagList')) : this.columns
    this.columns1 = JSON.parse(localStorage.getItem('sortList')) ? JSON.parse(localStorage.getItem('sortList')) : this.columns1
    this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionDataSortLists')) ? JSON.parse(localStorage.getItem('selectionDataSortLists')) : this.selectionDataSortList
    this.cancelList = JSON.parse(localStorage.getItem('cancelList')) ? JSON.parse(localStorage.getItem('cancelList')) : this.cancelList
    this.deptId = this.$store.getters.departmentId
    this.Department()
    this.ChargeType()
    this.getData()
    this.getUserList(this.deptId)
    this.getChannelInfo()
    // this.deptFilingList()
    this.options.reasonForRefund.options = this.dict.type.refund_reason
    this.options.billType.options = this.dict.type.billing_type
    this.options.pmIds.options = this.dict.type.whether
    // this.options.isHospitasl.options = this.dict.type.whether
    // this.options.Invoice.options = this.dict.type.whether
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    clickbackmoney(){

      if(this.selectionData.length==0||this.selectionData[0]==undefined){
        this.$message.warning('请点击选择一条数据进行开发票')
        return
      }
      if(this.selectionData[0].assist!==""){
        this.$confirm('确认取消开发票吗，是否继续？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          this.$api.confinementRoom.deleteOrderList(this.selectionData[0].orderNumber).then(res => {
            if (res.code == 200) {
              this.selectionData=[];
              this.$message.success(res.msg)
              this.getData();
              this.refundCancellation=true;
            }

          })
        })
      }else{
        this.$confirm('确认开发票吗，是否继续？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          this.$api.confinementRoom.orderInfoList({
            orderNumber: this.selectionData[0].orderNumber,
            jdxxId: this.selectionData[0].jdxxId
          }).then(res => {
            if (res.code == 200) {
              this.selectionData=[];
              this.$message.success(res.msg)
              this.getData();
              console.log(this.selectionData,'黑欸')
              this.refundCancellation=true;
            }

          })
        })
      }

    },
    cellClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }

    },
    clickbackdelete(){
      this.$confirm('确认清除退款单吗，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$api.confinementRoom.refundCancellation({
          orderNumber: this.selectionData[0].orderNumber,
          oldOrderNumber: this.selectionData[0].chargeSheetId,
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getData();
            this.refundCancellation=true;
          }

        })

      }).catch((res) => {

      });

    },
    capAmountToString(values) {
      if (values === null || values === '') {
        return ''
      }
      values = values.toString()
      const reg = new RegExp(',')
      values = values.replace(reg, '')
      // 不足两位小数补零
      const capArr = values.split('.')
      if (capArr.length < 2) {
        capArr[1] = '00'
      } else if (capArr[1].length == 1) {
        capArr[1] = capArr[1][0] + '0'
      }

      const len = capArr[0].length // 整数长度
      const len2 = capArr[1].length // 小数长度
      let arr = []
      let arr2 = []
      const chin_list = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] // 所有的数值对应的汉字
      const chin_lisp = ['仟', '佰', '拾', '兆', '仟', '佰', '拾', '亿', '仟', '佰', '拾', '万', '仟', '佰', '拾'] // 进制
      const chin_lisp2 = ['角', '分'] // 进制

      // 数字转大写，添加进制
      for (let i = 0; i < len; i++) {
        arr.push(parseInt(capArr[0][i])) // 输入的数据按下标存进去   存进去的只是数字
        arr[i] = chin_list[arr[i]] // 是根据我们输入的输入的数字，对应着我们的chin_list这个数组
      }
      for (let i = len - 1, j = 1; i > 0; i--) {
        // i =2	1		//倒序		为了添加进制，方便我们去观看
        arr.splice(i, 0, chin_lisp[chin_lisp.length - j++]) // j=2
      }
      for (let n = 0; n < len2; n++) {
        arr2.push(parseInt(capArr[1][n])) // 输入的数据按下标存进去   存进去的只是数字
        arr2[n] = chin_list[arr2[n]] // 是根据我们输入的输入的数字，对应着我们的chin_list这个数组
      }
      for (let i = len2, j = 1; i > 0; i--) {
        // i =2	1		//倒序		为了添加进制，方便我们去观看
        arr2.splice(i, 0, chin_lisp2[chin_lisp2.length - j++]) // j=2
      }

      arr = arr.join('')
      // 整数位处理
      if (len >= 1) {
        arr += '元'
      }// 1234510001=>壹拾贰亿叁仟肆佰伍拾壹万零壹元
      arr = arr
        .replace(/零[仟佰拾]/g, '零')// 100051231 =>壹亿零零零伍万壹仟贰佰叁拾壹
      arr = arr.replace(/零{2,}/g, '零')// 壹亿零零零伍万壹仟贰佰叁拾壹  =>壹亿零伍万壹仟贰佰叁拾壹
      arr = arr.replace(/零([兆|亿|万|元])/g, '$1')// 12300000壹仟贰佰叁拾零万零元 =>壹仟贰佰叁拾万元
      arr = arr.replace(/亿零{0,3}万/, '亿')// 10000000123 =>壹佰亿万零壹佰贰拾叁元
      arr = arr.replace(/兆零{0,3}亿/, '兆')// 10000000000123 壹拾零兆亿零壹佰贰拾叁元 =>
      arr = arr.replace(/^元/, '零元') // 0 ->零元

      // 小数位处理
      arr2 = arr2.join('')
      arr = arr + arr2
      arr = arr.replace(/零角/, '零') // 11.01 壹拾壹元零角壹分 =>壹拾壹元零壹分
      arr = arr.replace(/零{1,2}分/, '整') //

      return arr
    },
    printSetMealDetailsfys(val){
      let that = this;
      this.vals = val;
      this.jsmoney=val.paidAmount
      if(val.waitSource=='1'){
        this.$api.confinementRoom.settlementPrintingHospital({ orderNumber:val.orderNumber }).then(newres => {
          let arr=[];
          newres.data.forEach(value=>{
            if(value.typeName){
              arr.push(value)
            }else{
              this.ysmoney=value.payAmount
            }
          })
          this.listone=arr;
          this.strlist=math.add(this.ysmoney,val.paidAmount)
          this.capAmountToStringel=this.capAmountToString(this.strlist);
          let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
          let newstr=str.split('<')[0]
          this.newmessage=newstr;
          setTimeout((function () {
            that.$refs.neworderDetailsPrintfy.print();
          }), 300)
        })
      }else{
        this.$api.confinementRoom.settlementPrinting({ jdxxId:Number(this.vals.jdxxId),id:this.vals.id }).then(newres => {
          let arr=[];
          newres.data.forEach(value=>{
            if(value.typeName){
              arr.push(value)
            }else{
              this.ysmoney=value.payAmount
            }
          })
          this.listone=arr;
          this.strlist=this.ysmoney+val.paidAmount
          this.capAmountToStringel=this.capAmountToString(this.strlist);
          let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
          let newstr=str.split('<')[0]
          this.newmessage=newstr;
          setTimeout((function () {
            that.$refs.neworderDetailsPrintfy.print();
          }), 300)
        })
      }

      // }
    },
    printSetMealDetailsfy(val) {

      let that = this;
      this.vals = val;
      if(val.waitSource=='1'){

          this.$api.confinementRoom.getHospitalExpensesSettlementList({
            orderNumber:val.orderNumber
          }).then(res=>{
             if(res){
               this.strlist=0;
               this.tableDataaccount=res.rows;
               this.hosiptalData=res.data;
               res.rows.forEach(value=>{
                 this.strlist+=value.amountReceived
               })
               let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
               let newstr=str.split('<')[0]
               this.newmessage=newstr;
               setTimeout((function () {
                 that.$refs.orderDetailsPrintfy.print();
               }), 300)
             }
          })
      }else{
        this.$api.finance.getCustomerWforservice({ jdxxId: this.vals.jdxxId }).then(res => {
          if (res) {
            this.strlist=0;
            this.hosiptalData=res.data;
            this.tableDataaccount=res.rows;
            res.rows.forEach(value=>{
              this.strlist+=value.amountReceived
            })
            let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
            let newstr=str.split('<')[0]
            this.newmessage=newstr;
            setTimeout((function () {
              that.$refs.orderDetailsPrintfy.print();
            }), 300)

          }
        })
      }

      // }

    },
    selectEnable(row, rowIndex) {
      if (row.lab == '打印') { // 禁用
        this.$nextTick(() => {
          // console.log(111)
          // this.$refs.sortRef.$refs.sortRefs.toggleRowSelection(row, true)
        })
        return false
      } else {
        return true
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'flagclass'
      }
    },
    // 在行拖拽的方法进行querySelector的查找时，需对查询到dialog的el-table的类中
    rowDrop() {
      const tbody = document.querySelector('.drow_table .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
        group: {
          name: 'words',
          pull: true,
          put: true,
          sort: true,
          filter: '.flagclass'
        },
        animation: 150, // ms, number 单位：ms，定义排序动画的时间
        onEnd({ newIndex, oldIndex }) { // 结束拖拽
          const currRow = _this.sortList.splice(oldIndex, 1)[0]
          _this.sortList.splice(newIndex, 0, currRow)
          if (_this.cancelList.length) {
            _this.columns = _this.sortList
            _this.cancelList.forEach(iten => {
              _this.columns = _this.columns.filter(mm => mm.lab != iten.lab)
            })
          } else {
            _this.columns = _this.sortList
            _this.columns1 = _this.sortList
          }
          localStorage.setItem('sortList', JSON.stringify(_this.sortList))
          localStorage.setItem('flagList', JSON.stringify(_this.columns))
        }
      })
    },
    timeFmt(fmt, time) {
      if (!time) {
        return ''
      } else {
        if (!fmt) {
          fmt = 'YYYY-mm-dd HH:MM:SS'
        }
        let ret
        var date = new Date(time)
        const opt = {
          'Y+': date.getFullYear().toString(), // 年
          'm+': (date.getMonth() + 1).toString(), // 月
          'd+': date.getDate().toString(), // 日
          'H+': date.getHours().toString(), // 时
          'M+': date.getMinutes().toString(), // 分
          'S+': date.getSeconds().toString() // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        }
        for (const k in opt) {
          ret = new RegExp('(' + k + ')').exec(fmt)
          if (ret) {
            fmt = fmt.replace(
              ret[1],
              ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
            )
          }
        }
        return fmt
      }
    },
    getlab(row) {
      return row.lab
    },
    // 自定义配置弹框
    getDialog() {
      this.showDialogS = true
      this.sortList = this.columns1
      this.$nextTick(() => {
        this.$refs.sortRef.$refs.sortRefs.toggleRowSelection(this.sortList[0], true)
      })
      if (this.selectionDataSortList.length) {
        this.columns.forEach(item => {
          this.sortList.forEach(items => {
            if (item.lab == items.lab) {
              this.$nextTick(() => {
                this.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
              })
            }
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs.sortRef.$refs.sortRefs.toggleAllSelection()
        })
      }
      this.$nextTick(() => {
        this.rowDrop()
      })
    },
    showdialogT() {
      this.showDialogS = false
    },
    // 去重
    unique1(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.lab) && res.set(arr.lab, 1))
    },
    itemHandleSelectionChange(selection) {
      this.xflagList = this.sortList
      this.selectionDataSortList = selection[1]
      // localStorage.setItem('sortList',JSON.stringify(this.sortList))
      const selected = selection[1].length && selection[1].indexOf(selection[2]) !== -1
      if (selected == false) {
        this.cancelList.push(selection[2])
        this.cancelList = this.unique1(this.cancelList)
        this.xflagList = []
        this.cancelList.forEach((item1, index1) => {
          this.columns = this.columns.filter(itemm => itemm.lab !== item1.lab)
          this.columns = this.unique1(this.columns)
          localStorage.setItem('flagList', JSON.stringify(this.columns))
          localStorage.setItem('cancelList', JSON.stringify(this.cancelList))
        })
      } else {
        this.cancelList = this.cancelList.filter(item => item.val != selection[2].val)
        this.sortList.forEach((item1, index1) => {
          if (item1.lab == selection[2].lab) {
            if (this.cancelList.length) {
              this.cancelList.forEach(item => {
                this.xflagList = this.xflagList.filter(mm => mm.lab != item.lab)
                this.xflagList.splice(index1, 0, selection[2])
                this.columns = this.xflagList
              })
            } else {
              this.columns.splice(index1, 0, selection[2])
            }
            this.columns = this.unique1(this.columns)
            localStorage.setItem('flagList', JSON.stringify(this.columns))
          }
        })
      }
      localStorage.setItem('selectionDataSortLists', JSON.stringify(this.selectionDataSortList))
    },
    getDetails(data) {
      this.paidAmountlist=data.paidAmount
      // alert(data.billType)
      // if (data.billType === '9' || data.billType === '11') {
      //   if (data.oldBillType === '6') {
      //     this.$api.billingList.adjuvantBillingList({
      //       relationshipNumber: data.chargeSheetId
      //     }).then(res => {
      //       if (res) {
      //         this.details = res.rows
      //         let total = 0
      //         this.details.forEach(item => {
      //           total = math.add(item.discountAmount, total).toFixed(2)
      //         })
      //         let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      //         let newstr=str.split('<')[0]
      //         this.newmessage=newstr;
      //         this.total = total
      //         this.$nextTick(() => {
      //           this.$refs.orderDetailsPrint.print()
      //         })
      //       }
      //     })
      //   } else if (data.oldBillType === '2') {
      //     this.$api.billingList.reservationDataDetailed({
      //       orderNumber: data.chargeSheetId
      //     }).then(res => {
      //       this.details = res.rows
      //       let total = 0
      //       this.details.forEach(item => {
      //         total = math.add(item.discountAmount, total).toFixed(2)
      //       })
      //       this.total = total
      //       let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      //       let newstr=str.split('<')[0]
      //       this.newmessage=newstr;
      //       this.$nextTick(() => {
      //         this.$refs.orderDetailsPrint.print()
      //       })
      //     })
      //   } else {
      //     this.$api.billingList.orderDetailsList({
      //       orderNumber: data.chargeSheetId
      //     }).then((res) => {
      //       if (res) {
      //         this.details = res.rows
      //         let total = 0
      //         this.details.forEach(item => {
      //           total = math.add(item.discountAmount, total).toFixed(2)
      //         })
      //         let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      //         let newstr=str.split('<')[0]
      //         this.newmessage=newstr;
      //         this.total = total
      //         this.$nextTick(() => {
      //           this.$refs.orderDetailsPrint.print()
      //         })
      //       }
      //     })
      //   }
      // } else {
      //   if (data.billType === '6') {
      //     this.$api.billingList.orderDetailsList({
      //       orderNumber: data.orderNumber
      //     }).then((res) => {
      //       if (res) {
      //         this.details = res.rows
      //         console.log(this.details,'dsagdsgadasd')
      //         let total = 0
      //         this.details.forEach(item => {
      //           total = math.add(item.discountAmount, total).toFixed(2)
      //         })
      //         this.total = total
      //         let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      //         let newstr=str.split('<')[0]
      //         this.newmessage=newstr;
      //         this.$nextTick(() => {
      //           this.$refs.orderDetailsPrint.print()
      //         })
      //       }
      //     })
      //     // this.$api.billingList.adjuvantBillingList({
      //     //   relationshipNumber: data.orderNumber
      //     // }).then(res => {
      //     //   if (res) {
      //     //     this.details = res.rows
      //     //     let total = 0
      //     //     this.details.forEach(item => {
      //     //       total = math.add(item.discountAmount, total).toFixed(2)
      //     //     })
      //     //     this.total = total
      //     //     let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      //     //     let newstr=str.split('<')[0]
      //     //     this.newmessage=newstr;
      //     //     this.$nextTick(() => {
      //     //       this.$refs.orderDetailsPrint.print()
      //     //     })
      //     //   }
      //     // })
      //   } else if (data.billType === '2') {
      //     this.$api.billingList.reservationDataDetailed({
      //       orderNumber: data.orderNumber
      //     }).then(res => {
      //       this.details = res.rows
      //       let total = 0
      //       this.details.forEach(item => {
      //         total = math.add(item.discountAmount, total).toFixed(2)
      //       })
      //       this.total = total
      //       let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      //       let newstr=str.split('<')[0]
      //       this.newmessage=newstr;
      //       this.$nextTick(() => {
      //         this.$refs.orderDetailsPrint.print()
      //       })
      //     })
      //   } else {
          this.$api.billingList.orderDetailsList({
            orderNumber: data.orderNumber
          }).then((res) => {
            if (res) {
              this.details = res.rows
              let total = 0
              this.details.forEach(item => {
                total = math.add(item.discountAmount, total).toFixed(2)
              })
              this.total = total
              let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
              let newstr=str.split('<')[0]
              this.newmessage=newstr;
              this.$nextTick(() => {
                this.$refs.orderDetailsPrint.print()
              })
            }
          })
      //   }
      // }
    },
    /**
     * @author Nevin
     * @date 2022/8/24
     * @Description: 展开行的方法
     */
    expandChange(row) {
      if (row[2].length) {
        this.expands = []
        row[1] ? this.expands.push(row[1].orderId) : ''
      } else {
        this.expands = []
      }
      this.print = row[1]
      this.total = row[1].paidAmount + ''
      this.finalPayData = row[1].payNameAmount
      this.customCardNumberlist=row[1].customCardNumber;
      // this.getDetails(row[1])
    },
    /**
     * @author Nevin
     * @date 2022/8/24
     * @Description: 打印明细单
     */
    printOrderDetails(data) {
      // alert(this.print);
      this.getDetails(data)
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     this.$refs.orderDetailsPrint.print()
      //   }, 1000)
      // })
    },
    /**
     * @author Nevin
     * @date 2022/9/1
     * @Description: 套餐打印
     */
    // printSetMeal(data) {
    //   if (data.billType !== '8') {
    //     this.$message.warning('请选择套餐开单再打印！')
    //   } else {
    //     this.details
    //     this.$nextTick(() => {
    //       this.$refs.setMealPrint.print()
    //     })
    //   }
    // },
    /**
     * @author Nevin
     * @date 2022/9/1
     * @Description: 套餐明细打印
     */
    printSetMealDetails(val) {
      if (val.billType !== '8') {
        this.$message.warning('请选择套餐开单再打印！')
      } else {
        const data = {
          isPackage: val.isPackage,
          orderNumber: val.orderNumber
        }
        this.$api.billingList.packageDetailPrint(data).then(res => {
          this.packageDetailPrintData = res.data
          this.$nextTick(() => {
            this.$refs.setMealDetailsPrint.print()
          })
        })
      }
    },
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      this.submitLoading = true
      for (const k in this.options) {
        if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else if (this.options[k].type === 'Tinput') {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billingStatus', '3')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.finance.paidList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          // this.summary=res.data()
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '已结账列表')
        setInterval(() => {
          this.submitLoading = false
        }, 5000)
      })
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 收款结账
    openManualDialog() {
      // this.$router.push({ name: 'collectionSettlement' })
    },
    /**
     * @author 李尚
     * @date 2022/5/31
     * @Description: 点击跳转
     */
    customer(id, val, numberId) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal } })
    },
    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails' })
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    /**
     * @author 李尚
     * @date 2022/5/30
     * @Description: 搜索
     */
    async getData(isSearch) {
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else if (this.options[k].type === 'Tinput') {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billingStatus', '3')
      await this.$api.finance.paidList(data).then(res => {
        if (res) {
          this.placeorder = res.data
          this.tableData = res.rows
          this.pagination.total = res.total
          this.summary = res.data
        }
      })
      // 接口
    },
    // 收费类型
    ChargeType() {
      // 添加状态
      const data = {
        status: '0'
      }
      this.$api.modules.finance.paymentChannelList(data).then(res => {
        if (res) {
          res.rows.forEach((item) => {
            item.value = item.payId
            item.label = item.payName
          })
          this.options.paymentChannel.options = res.rows
        }
      })
    },
    // 科室
    Department() {
      this.$api.modules.netPower.projectTreeselect({ deptId: this.deptId }).then(res => {
        if (res) {
          res.data.forEach((item) => {
            item.value = item.departmentId
            item.label = item.departmentName
          })
          this.options.departmentId.options = res.data
        }
      })
    },

    handle(row) {
      return row.orderId
    },
    /**
     * @author 李尚
     * @date 2022/5/31
     * @Description: 点击复选框选中
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      // // this.coument = this.selectionData[0].customerName
      // let totals = 0
      // let temp = []
      // this.tableData.forEach(item => {
      //   if (item.id === this.selectionData[0].id) {
      //     totals = math.add(item.amountPayable, totals)
      //   }
      // })
      // temp = this.tableData.filter(item => {
      //   return item.id === this.selectionData[0].id
      // })
      // this.payableSigle = temp.length
      // this.placeorder = totals
    },
    /**
     * @author 李尚
     * @date 2022/6/20
     * @Description: 人员添加公司Id  添加状态
     */
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
          // xczxs 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.options.aestheticConsultant.options.push(item)
            }
          })
          const arr1 = this.unique(res.data)
          this.options.cashierName.options = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
    },
    // 关闭发送短信弹窗
    closeDialog() {
      this.showSendMessageDialog = false
    },
    // 批量发送短信
    sendMessage() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客发送短信')
        return
      }
      this.showSendMessageDialog = true
    },
    // 获取渠道信息
    getChannelInfo() {
      this.$api.modules.channel.getChannelType({
        'deptId': this.deptId,
        'status': 0
      }).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            this.channelType = res.data
            this.respliceNameLabel(res.data)
            this.options.channel.options.splice(0, 0, res.data)
          } else {
            this.options.channel.options = []
            this.options.channel.values = []
          }
        }
      })
    },
    /**
     * @author 李尚
     * @date 2022/5/31
     * @Description: 选中行内点击
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
      this.coument = e[1].customerName
      this.placeorder = e[1].paidAmount
      this.backList=e[1]
      console.log(e[1].assist,'就饿哦饿哦')
      if(e[1].assist!==""){
        this.tagtitle="取消开发票"
      }else{
        this.tagtitle="开发票"
      }
      const timestamp = moment(new Date()).format('YYYY-MM-DD');
      const dateStr = e[1].checkoutTime.split(' '); // 要转换的日期字符串
      const timestamp1 = dateStr[0]
      if ((e[1].billType==10 || e[1].billType==17) && (timestamp==timestamp1) ){
        this.backdisable=false
      }else{
        this.backdisable=true
      }
      if(this.selectionData[0].billType=='11'){
        this.refundCancellation=false;
      }else{
        this.refundCancellation=true
      }
    },
    clickback(){
      console.log('ddd')
      this.$confirm('确认撤回该条数据吗？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        const query={
          orderNumber: this.backList.orderNumber,
          roomReservationId: this.backList.roomReservationId,
          jdxxId: this.backList.jdxxId,
          remainingAmount: this.backList.paidAmount > 0 ? -this.backList.paidAmount:this.backList.paidAmount < 0 ? -this.backList.paidAmount:this.backList.paidAmount,
          id: this.backList.id,
          billType: this.backList.billType,
          waitSource:this.backList.waitSource

        }

        console.log(this.backList)
        console.log(query)
        // //
        // return;
        this.$api.finance.antiSettlement(query).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '撤回成功!'
            });
          }
          this.getData()
        })
      }).catch((res) => {

      });
    },
  }
}
</script>

<style scoped lang="scss">

::v-deep .el-table__body tr.current-row>td {
  background-color: #90ee90 !important;
}
.tablist{
  margin-top: 10px;
}
 ::v-deep .tablist th {
  padding:  0 !important;
   font-size: 14px !important;
}
 ::v-deep .tablist tr td {
   padding:  0 !important;
   font-size: 14px !important;
 }
.order_detail_basic {
  width: 98%;
  min-height: 30px;
  margin-top: 0px;
  font-size: 20px !important;
  color: black !important;
  display: flex;align-items: center;justify-content: space-evenly;
  font-size: 16px !important;
}

.order_detail {
  width: 100%;
  height: 30px;
  text-align: center;
  color: black !important;
}

.redClass {
  color: red;
}

.redClass1 {
  color: #606266;
}

.container {
  width: 100%;
  height: 100%;
}

::v-deep .el-dialog__header {
  background-color: #1abc9c;
}

.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}

span {
  color: #7ec5b7;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .flagclass {
  cursor: not-allowed;
  pointer-events: none;
  color: #ccc;
}

// dialog 去除遮罩层 弹窗底下可点击
::v-deep .el-dialog__wrapper {
  pointer-events: none;
}

::v-deep .el-dialog {
  pointer-events: auto;
}
</style>
<style>
.el-input__prefix {
  display: none;
}
</style>
