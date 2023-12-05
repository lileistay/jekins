<template>
    <!-- 我的收费单 -->
    <div class="container">
      <slideSearch :options="options">
        <div slot="btnBar">
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getData(true)"
            @keydown.enter.native="getData(true)"
          >查询
          </el-button>
          <el-button
            v-has-permi="['payment:toBePaidList:export']"
            size="mini"
            icon="el-icon-upload2"
            plain
            :loading="submitLoadings"
            type="success"
            @click.stop="exportExcel"
          >导出
          </el-button>
        </div>
        <slot>
          <sg-table
            id="out-table"
            ref="table"
            :row-key="(a)=>a.orderId"
            :sg-ref="'multipleTable'"
            size="mini"
            selection
            border
            index="序号"
            :expand-row-keys="expands"
            highlight-current-row
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            :cell-style="cellStyle"
            :cell-class-name="cellClassName"
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            @expand-change="expandChange"
          >
            <div slot="searchBar" class="searchBar">
              <div>统计信息</div>
              <div>
                <span style="color: #999">应付金额：{{ sumAmountPayable }}</span>
                &nbsp;&nbsp;&nbsp;
                <span style="color: #999">实付金额： {{ sumPaidAmount }}</span>
              </div>
            </div>
            <!-- 按钮 -->
            <div slot="header" style="width: 100%;">
              <span style="font-size: 14px;color: #999;"><i style="cursor:pointer" class="el-icon-s-fold" @click="getDialogScharge" />列表清单</span>
              <el-button
                type="danger"
                size="mini"
                plain
                style="float: right;margin-left: 10px"
                @click.stop.native="removeOrderInfo"
                v-has-permi="['SiteManagement:secondremove']"
              >删除
              </el-button>
              <!--            <el-button-->
              <!--              type="success"-->
              <!--              size="mini"-->
              <!--              plain-->
              <!--              style="float: right;"-->
              <!--            >预约金消费-->
              <!--            </el-button>-->
              <!--            <el-button-->
              <!--              v-has-permi="['SiteManagement:returnedValue']"-->
              <!--              type="danger"-->
              <!--              size="mini"-->
              <!--              plain-->
              <!--              style="float: right;"-->
              <!--              @click="retreat"-->
              <!--            >退储值-->
              <!--            </el-button>-->
              <el-button
                v-has-permi="['SiteManagement:secondrefund']"
                type="danger"
                size="mini"
                plain
                style="float: right;"
                @click.stop.native="refund"
              >退款
              </el-button>
              <el-button
                v-has-permi="['SiteManagement:secondsubmit']"
                type="primary"
                size="mini"
                plain
                style="float: right;"
                @click.stop.native="management"
              >提交
              </el-button>
              <el-button
                v-has-permi="['SiteManagement:secondwithdraw']"
                type="danger"
                size="mini"
                plain
                style="float: right;"
                @click.stop.native="repulse"
              >撤回
              </el-button>
              <el-button
                v-has-permi="['SiteManagement:secondsubscription']"
                type="success"
                size="mini"
                plain
                style="float: right;"
                @click.stop.native="yuyue"
              >预约金消费
              </el-button>
            </div>
  
            <template #custom="data">
              <div v-if="data.props === 'billingStatus'">
                <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />
              </div>
              <div v-else-if="data.props === 'detailed'">
                <span v-if="data.custom.billType === '3' || data.custom.billType === '4' || data.custom.billType === '5'">-</span>
                <el-button v-else size="mini" type="text" @click="showDetails(data.custom)">查看</el-button>
              </div>
              <div v-else-if="data.props === 'refund'">
                <el-button
                  v-if="data.custom.billType === '9' || data.custom.billType === '11' || data.custom.billType === '12' || data.custom.billType === '13' || data.custom.billType === '14'"
                  size="mini"
                  type="text"
                  @click="showOldOrder(data)"
                >源收费单</el-button>
                <span v-else>-</span>
              </div>
              <div v-else-if="data.props === 'orderNumber'">
                <a style="color: #0066cc; cursor: pointer;" @click="orderNumber(data.custom)">
                  {{ data.custom.orderNumber }}
                </a>
              </div>
              <div v-else-if="data.props === 'customerName'">
                <a style="color: #0066cc; cursor: pointer;" @click="customerName(data.custom.id, data.custom)">
                  {{ data.custom.customerName }}
                </a>
              </div>
              <div v-else-if="data.props === 'isReceivingMedicine'">
                <span v-if="data.custom.isReceivingMedicine==0">否</span>
                <span v-if="data.custom.isReceivingMedicine==1">是</span>
  
              </div>
  
              <div v-else-if="data.props === 'billType'">
                <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
              </div>
              <div v-else-if="data.props === 'reasonForRefund'">
                <show-dict-data :options="dict.type.refund_reason" :value="data.custom.reasonForRefund" />
              </div>
              <div v-else-if="data.props === 'isTreatment'">
                <show-dict-data :options="dict.type.whether" :value="data.custom.isTreatment" />
              </div>
            </template>
            <template #expands="data">
              <span style="font-size: 14px;padding: 0 10px">
                <i class="el-icon-printer" style="color: #5f94de" />
                <a style="color: #5f94de;cursor: pointer" @click="printChargeSheet(data.expands)">收费单打印</a>
              </span>
              <!--            <span style="font-size: 14px;padding: 0 10px">-->
              <!--              <i class="el-icon-printer" style="color: #5f94de" />-->
              <!--              <a style="color: #5f94de;cursor: pointer" @click="printTreatmentSheet(data.expands)">治疗单打印</a>-->
              <!--            </span>-->
              <span style="font-size: 14px;padding: 0 10px" v-if="data.expands.billType=='7'">
                <i class="el-icon-printer" style="color: #5f94de" />
                <a style="color: #5f94de;cursor: pointer" @click="printInspectionSheet(data.expands)">检验单打印</a>
              </span>
              <span style="font-size: 14px;padding: 0 10px">
                <i v-if="data.expands.billType=='6'" class="el-icon-printer" style="color: #5f94de" />
                <a v-if="data.expands.billType=='6'" style="color: #5f94de;cursor: pointer" @click="prescription(data.expands)">处方打印</a>
              </span>
              <!--            <span style="font-size: 14px;padding: 0 10px">-->
              <!--              <i class="el-icon-printer" style="color: #5f94de" />-->
              <!--              <a style="color: #5f94de;cursor: pointer">中药处方打印</a>-->
              <!--            </span>-->
            </template>
          </sg-table>
        </slot>
      </slideSearch>
      <!--打回-->
      <sgDialog
        title="撤回"
        :dialog="dialogVisible"
        width="30%"
        @handleClose="dialogVisible=false"
      >
        <div slot="out">
          <el-form ref="receipt" :rules="rules" label-width="100px" :model="receipt" size="mini">
            <el-form-item label="收费单单号:">
              <el-input v-model="receipt.orderNumber" disabled />
            </el-form-item>
            <el-form-item
              label="撤回说明:"
              prop="returnComments"
              :rules="{
              required: true, message: '请填写撤回说明', trigger: 'blur'
            }"
            >
              <el-input v-model="receipt.returnComments" type="textarea" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: right">
          <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading" @click="repulseReceipt">保存</el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-close" @click="dialogVisible = false">关闭</el-button>
        </div>
        </div>
  
      </sgDialog>
      <el-drawer
        title="收费单明细"
        :visible.sync="showDetailsDrawer"
        direction="rtl"
        size="40%"
        :before-close="closeDetailsDrawer"
      >
        <el-table
          v-if="orderInfo.billType === '6' || orderInfo.oldBillType === '6'"
          :data="detailsDrawerData"
          style="width: 100%"
          size="mini"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="projectName" label="项目|药品" />
          <el-table-column prop="quantity" label="数量" width="50" />
          <el-table-column prop="sumPrice" label="价格" />
          <el-table-column prop="discountNumber" label="折扣" width="50" />
          <el-table-column prop="discountAmount" label="合计" />
        </el-table>
        <el-table
          v-else
          :data="detailsDrawerData"
          style="width: 100%"
          size="mini"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="projectName" label="项目|药品" />
          <el-table-column prop="quantity" label="数量" width="50" />
          <el-table-column prop="totalAmount" label="价格" />
          <el-table-column prop="discount" label="折扣" width="50" />
          <el-table-column prop="discountAmount" label="合计" />
        </el-table>
      </el-drawer>
      <el-drawer
        title="源收费单"
        :visible.sync="showOldOrderInfo"
        direction="btt"
        size="30%"
        :before-close="closeOldOrderInfo"
      >
        <el-table
          :data="oldOrderInfoData"
          style="width: 100%"
          size="mini"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="orderNumber" label="收费单编号" width="140">
            <template slot-scope="scope">
              <a style="color: #0066cc; cursor: pointer;" @click="orderNumber(scope.row)">
                {{ scope.row.orderNumber }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="billType" label="收费单类型">
            <template slot-scope="scope">
              <span>{{ BillTypeName(scope.row.billType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户姓名">
            <template slot-scope="scope">
              <a style="color: #0066cc; cursor: pointer;" @click="customerName(scope.row.id, scope.row)">
                {{ scope.row.customerName }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="customCardNumber" label="卡号" width="140" />
          <el-table-column prop="billingRemarks" label="备注" />
          <el-table-column prop="totalExpenses" label="费用合计" />
          <el-table-column prop="amountPayable" label="应付款" />
          <el-table-column prop="paidAmount" label="实付款" />
          <el-table-column prop="departmentName" label="科室" />
          <el-table-column prop="crName" label="客户代表" />
          <el-table-column prop="souName" label="推荐人" />
          <el-table-column prop="acName" label="现场咨询师" />
          <el-table-column prop="dsingleUserName" label="下单人" />
          <el-table-column prop="billTime" label="下单时间" width="140" />
        </el-table>
      </el-drawer>
      <vue-easy-print ref="printChargeSheet">
        <charge-sheet-print :print="print" :details="details" :total="total" />
      </vue-easy-print>
      <vue-easy-print ref="printInspectionSheet">
        <inspection-sheet-print :print="print" :details="details" :total="total" />
      </vue-easy-print>
      <vue-easy-print ref="newprescription">
        <div v-show="traditiona">
          <div style="text-align: center;font-size: 8px">
            <h1>{{newmessage}}处方单</h1>
          </div>
          <div style="width:95%;height: 50px;border: 1px solid black;display: flex;border-left-color: transparent;border-right-color: transparent;border-top-color: transparent;font-size: 8px;border-bottom-color: transparent">
            <div style="width: 50px;height: 50px;line-height: 50px;text-align: center;">
              费别
            </div>
            <div style="width: calc(100% - 50px);height: 50px;position: relative;">
              <div style="width:100%;height: 25px;display: flex;align-items: center;">
                <div style="width: 10px;height: 10px;border: 1px solid black;" />
                <span>公费</span>
                <div style="width: 10px;height: 10px;border: 1px solid black;margin-left: 20px;" />
                <span>自费</span>
                <span style="margin-left: 20px;display: inline-block;width: 150px;">病人类别：</span>
                <!--              <span style="">老客户</span>-->
                <!--              <span style="margin-left: 20px;display: inline-block;width: 200px;">状态：{{ result.billingStatus==3?'已结账':result.billingStatus==2?'已下单':'已提交' }}</span>-->
                <div style="width: 100px;height: 50px;text-align: center;line-height: 50px;position: absolute;right: 0;top: -30px;font-size: 20px;">
                  【普通】
                </div>
              </div>
              <div style="width:100%;height: 15px;display: flex;align-items: center;">
                <div style="width: 10px;height: 10px;border: 1px solid black;" />
                <span>医保</span>
                <div style="width: 10px;height: 10px;border: 1px solid black;margin-left: 20px;" />
                <span>其他</span>
                <span style="display: inline-block;width: 100px;margin-left: 20px;">社保号：</span>
                <span style="display: inline-block;width: 270px;">处方编号:{{ result.orderNumber }}</span>
              </div>
            </div>

          </div>
          <div style="width: 95%;height: 10px;display: flex;line-height: 25px;font-size: 8px">
            <span style="margin-left: 10px;display: inline-block;width: 150px;height: 25px;">姓名：{{ result.customerName }}</span>
            <span style="display: inline-block;width: 50px;">性别:{{ customAge=='0'?'男':'女' }}</span>
            <span style="display: inline-block;width: 80px;">年龄：{{ Ages }}岁</span>
            <span style="display: inline-block;width: 120px;">科别：{{ result.departmentName }}</span>
            <span style="display: inline-block;width: 120px;">门诊号：{{ hispotaljdxxId }}</span>
            <span style="display: inline-block;width: 150px;">开具日期：{{ billTimeStart }}</span>
          </div>
          <div style="width: 95%;height: 10px;display: flex;line-height: 25px;margin-top: 10px;font-size: 8px">
            <span style="margin-left: 10px;display: inline-block;width: 100%;height: 25px;">临床及诊断：{{result.billingRemarks}}</span>
          </div>
          <div style="width: 95%;border-top:0.1px solid black;margin-top: 15px"></div>
          <div style="width: 100%;height: 290px;display: flex;position: relative">
            <div style="position: absolute;bottom: 0;right: 10%">
              <span style="font-size: 16px">医师签名(盖章)：{{ result.doctorName }}</span>
            </div>
            <div style="width: 50px;height: 280px;font-size: 14px;border-top: 1px solid transparent;border-bottom: 1px solid transparent;padding-left: 10px">
            </div>
            <div style="width: calc(100% - 50px)">
              <span style="margin-left: 10px;font-size: 20px;">Rp：</span>
              <div v-for="(item,index) in PrintList" :key="index" style="margin-left: 50px">
                <div style="margin-top: 5px;display: flex;width: 100%;">
                  <span style="margin-left: 10px;font-size: 12px">{{ index+1 }}.</span> <span style="margin-left: 10px;font-size: 12px">{{ item.projectName }}</span>
                  <span style="font-size: 12px;margin-left: 50px">{{item.specs==undefined?'':item.specs}}</span>
                  <span style="font-size: 12px;margin-left: 50px">{{item.surplusQuantity}} {{item.company}}</span>
                </div>
                <div style="display: flex;margin-top: 7px">
                  <span style="margin-left: 50px;font-size: 12px">用法： {{item.eachTime}} {{ item.pharmacy }}</span>
                  <span v-if="item.chineseUse!==''">
                  <span style="margin-left: 20px;font-size: 12px">{{ item.chineseUse }}</span>
                </span>
                  <span style="margin-left: 20px;font-size: 12px" v-else>{{ item.westUse }}</span>
                  <span style="margin-left: 20px;font-size: 12px" >{{ item.drugDelivery }}</span>


                </div>
              </div>
            </div>

          </div>

          <div style="width: 95%;height: 25px;display: flex;line-height: 25px;border: 0.1px solid black;border-left-color: transparent;border-right-color: transparent;border-bottom-color: transparent;font-size: 12px">
            <!--          <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;">医师签名(盖章)：{{ result.doctorName }}</span>-->
            <span style="display: inline-block;width: 200px;margin-left: 10px">审核：</span>
            <span style="display: inline-block;width: 200px;margin-left: 50px">调配签名(盖章)：</span>
          </div>
          <div style="width: 95%;height: 25px;display: flex;line-height: 25px;font-size: 12px">
            <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;">核对：</span>
            <span style="display: inline-block;width: 200px;">发药签名(盖章)：</span>
            <span style="display: inline-block;width: 200px;">药品金额：{{ newresult.sumAmountPayable }}</span>
          </div>
          <div style="width: 95%;height: 25px;display: flex;line-height: 25px;font-size: 12px">
            <span style="margin-left: 10px;display: inline-block;width: 100%;height: 25px;">药品提示：</span>
          </div>
          <div style="width: 95%;height: 25px;display: flex;line-height: 25px;font-size: 12px">
            <span style="margin-left: 10px;display: inline-block;width: 100%;height: 25px;">1.请遵医嘱服药；2.请在窗口点清药品；3.处方当日有效；4.发出药品不予退换</span>
          </div>
        </div>
  
        <!-- <div v-show="traditiona">
              <div style="text-align: center;">
                <h1>兰州时光激光整形医院西药处方单</h1>
              </div>
            <div style="width:95%;height: 50px;border: 1px solid black;display: flex;margin-top: 50px;border-left-color: transparent;border-right-color: transparent;border-top-color: transparent;">
              <div style="width: 50px;height: 50px;line-height: 50px;text-align: center;">
                         费别
              </div>
              <div style="width: calc(100% - 50px);height: 50px;position: relative;" >
              <div style="width:100%;height: 25px;display: flex;align-items: center;">
                <div style="width: 10px;height: 25px;border: 1px solid black;"></div>
                 <span>公费</span>
                 <div style="width: 10px;height: 25px;border: 1px solid black;margin-left: 20px;"></div>
                 <span>自费</span>
                  <span style="margin-left: 20px;display: inline-block;width: 150px;">病人类别：</span>
                  <span style="margin-left: 20px;display: inline-block;width: 200px;">状态：已结账</span>
                  <div style="width: 50px;height: 50px;text-align: center;line-height: 50px;position: absolute;right: 0;top: -30px;border: 1px solid black;font-size: 20px;">
                    普通
                  </div>
              </div>
              <div style="width:100%;height: 25px;display: flex;align-items: center;">
                <div style="width: 10px;height: 25px;border: 1px solid black;"></div>
                 <span>医保</span>
                 <div style="width: 10px;height: 25px;border: 1px solid black;margin-left: 20px;"></div>
                 <span>其他</span>
                 <span style="display: inline-block;width: 200px;margin-left: 20px;">社保号：</span>
                 <span style="margin-left: 20px;">处方编号:</span>
                </div>
              </div>
  
            </div>
            <div style="width: 95%;height: 25px;display: flex;line-height: 25px;">
              <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;" >姓名：{{ result.customerName }}</span>
              <span style="display: inline-block;width: 200px;">性别:</span>
              <span style="display: inline-block;width: 200px;">年龄：</span>
            </div>
            <div style="width: 95%;height: 25px;display: flex;line-height: 25px;margin-top: 10px;">
              <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;" >门诊号：</span>
              <span style="display: inline-block;width: 200px;margin-left: 50px;">科别：{{ result.departmentName }}</span>
            </div>
            <div style="width: 95%;height: 25px;display: flex;line-height: 25px;margin-top: 10px;">
              <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;" >临床诊断：</span>
              <span style="display: inline-block;width: 300px;margin-left: 50px;">开具日期：{{ result.billTime }}</span>
            </div>
            <div style="width: 95%;height: 25px;display: flex;line-height: 25px;margin-top: 10px;">
              <span style="margin-left: 310px;display: inline-block;width: 250px;height: 25px;" >电话地址：{{ result.customPhone }}</span>
            </div>
            <div style="width: 95%;height: 35px;display: flex;text-align: center;line-height: 25px;">
              <span style="margin-left: 10px;font-size: 35px;">R：</span>
  
            </div>
            <div style="width: 95%;height: 300px;line-height: 25px;border: 1px solid black;border-left-color: transparent;border-right-color: transparent;border-top-color: transparent;">
              <div style="width: 95%;height: 25px;line-height: 25px;display: flex;">
                <span style="margin-left: 10px;">1.</span>
               <div style="width:100px;height:25px;width: 400px;">处方添加医疗</div>
              </div>
              <div style="width: 95%;height: 25px;display: flex;text-align: center;line-height: 25px;">
              <span style="margin-left: 10px;">剂数：</span>
  
            </div>
  
            </div>
            <div style="width: 95%;height: 25px;display: flex;line-height: 25px;">
              <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;" >医师签名(盖章)：{{ result.acName }}</span>
  
              <span style="display: inline-block;width: 200px;">处方金额：</span>
            </div>
            <div style="width: 95%;height: 25px;display: flex;line-height: 25px;margin-top: 20px;">
              <span style="margin-left: 10px;display: inline-block;width: 250px;height: 25px;" >审核药师：</span>
              <span style="display: inline-block;width: 200px;">调配药师/士：</span>
              <span style="display: inline-block;width: 200px;">核发/发药药师：</span>
            </div>
          </div> -->
  
        <!-- <div v-show="newtraditiona"></div> -->
      </vue-easy-print>
      <sg-table
        id="out-table"
        size="mini"
        index="序号"
        style="display: none"
        :table-data="tableDatas"
        :columns="columns"
      >
        <template #custom="data">
          <div v-if="data.props === 'billingStatus'">
            <show-dict-data :options="dict.type.billing_status" :value="data.custom.billingStatus" />
          </div>
          <div v-else-if="data.props === 'detailed'">
            <span v-if="data.custom.billType === '3' || data.custom.billType === '4' || data.custom.billType === '5'">-</span>
            <el-button v-else size="mini" type="text" @click="showDetails(data.custom)">查看</el-button>
          </div>
          <div v-else-if="data.props === 'refund'">
            <el-button
              v-if="data.custom.billType === '9' || data.custom.billType === '11' || data.custom.billType === '12' || data.custom.billType === '13' || data.custom.billType === '14'"
              size="mini"
              type="text"
              @click="showOldOrder(data)"
            >源收费单</el-button>
            <span v-else>-</span>
          </div>
          <div v-else-if="data.props === 'orderNumber'">
            <a style="color: #0066cc; cursor: pointer;" @click="orderNumber(data.custom)">
              {{ data.custom.orderNumber }}
            </a>
          </div>
          <div v-else-if="data.props === 'customerName'">
            <a style="color: #0066cc; cursor: pointer;" @click="customerName(data.custom.id, data.custom)">
              {{ data.custom.customerName }}
            </a>
          </div>
          <div v-else-if="data.props === 'billType'">
            <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
          </div>
          <div v-else-if="data.props === 'reasonForRefund'">
            <show-dict-data :options="dict.type.refund_reason" :value="data.custom.reasonForRefund" />
          </div>
        </template>
      </sg-table>
      <!--  列表排序弹框    -->
      <Dsort
        :drow_table="'Charge'"
        ref="charge"
        :show-dialog-s="showDialogScharge"
        :sort-list="columns1"
        :select-enable="selectEnable"
        :table-row-class-name="tableRowClassName"
        :item-handle-selection-change="itemHandleSelectionChange"
        @showdialogT="showdialogT"
      />
    </div>
  </template>
  
  <script>
  // 引入导出Excel表格依赖
  import slideSearch from '@/components/SlideSearchBar/index'
  import SgTable from '@/components/Table'
  import moment from 'moment'
  import {debounce} from '@/utils/throttleAndDebounce' // 防抖
  import vueEasyPrint from 'vue-easy-print'
  import chargeSheetPrint from '@/components/Print/chargeSheetPrint'
  import inspectionSheetPrint from '@/components/Print/inspectionSheetPrint'
  import {math} from '@/utils/math'
  import {todayTime,newgetData} from '@/utils/time'
  import Dsort from '@/components/Dsort'
  import Sortable from 'sortablejs' // 排序拖拽
  import sgDialog from '@/components/Dialog/index'
  
  export default {
    dicts: ['billing_status', 'billing_type', 'refund_reason', 'whether'],
    components: {
      SgTable,
      slideSearch,
      vueEasyPrint,
      chargeSheetPrint,
      inspectionSheetPrint,
      Dsort,
      sgDialog
    },
    data() {
      return {
        hispotaljdxxId:'',
        billTimeStart:'',
        newresult:'',
        traditiona: true,
        newmessage:"",
        newtraditiona: false,
        tableDatas: [], // 导出
        submitLoadings: false,
        showDetailsDrawer: false,
        showOldOrderInfo: false,
        submitLoading: false,
        // 加载蒙版
        showDataDialog: false,
        tableData: [],
        // 多选数据
        selectionData: [],
        // 弹框
        dialogVisible: false,
        receipt: {
          orderId: '',
          billingStatus: '2',
          orderNumber: '',
          returnComments: ''
        },
        // 分页
        pagination: {
          show: true,
          pageNum: 1,
          pageSize: 20,
          total: 0,
          currentPage: 1
        },
        //  序列清单
        columns: [
          {
            lab: '打印',
            val: 'print',
            expands: {}
          },
          {
            lab: '明细',
            val: 'detailed',
            custom: 'detailed'
          },
          {
            lab: '还退款',
            val: 'refund',
            custom: 'refund',
            width: 100
          },
          {
            lab: '收费单编号',
            val: 'orderNumber',
            custom: 'orderNumber',
            width: 165
          },
          {
            lab: '收费单状态',
            val: 'billingStatus',
            custom: 'billingStatus',
            width: 135
          },
          {
            lab: '收费单类型',
            val: 'billType',
            custom: 'billType',
            width: 135
          },
          {
            lab: '客户姓名',
            val: 'customerName',
            custom: 'customerName',
            width: 100
          },
          {
            lab: '卡号',
            val: 'customCardNumber',
            width: 160
          },
          {
            lab: '备注',
            val: 'billingRemarks',
            width: 135,
            showOverflowTooltip: true
          },
          {
            lab: '费用合计',
            val: 'totalExpenses'
          },
          // 临时隐藏
          // {
          //   lab: '折扣',
          //   val: 'discount'
          // },
          {
            lab: '应付款',
            val: 'amountPayable'
          },
          {
            lab: '实付款',
            val: 'paidAmount'
          },
          {
            lab: '是否领药',
            val: 'isReceivingMedicine',
            custom: 'isReceivingMedicine'
          },
          {
            lab: '是否治疗',
            val: 'isTreatment',
            custom: 'isTreatment'
          },
          {
            lab: '科室',
            val: 'departmentName',
            width: 120
          },
          {
            lab: '客户代表',
            val: 'crName',
            width: 130
          },
          {
            lab: '推荐人',
            val: 'souName',
            width: 130
          },
          {
            lab: '现场咨询师',
            val: 'acName',
            width: 130
          },
          {
            lab: '下单人',
            val: 'dsingleUserName',
            width: 120
          },
          {
            lab: '下单时间',
            val: 'billTime',
            width: 144
          },
          {
            lab: '退款原因',
            val: 'reasonForRefund',
            custom: 'reasonForRefund',
            width: 120
          },
          {
            lab: '打回备注/审批备注',
            val: 'returnComments',
            width: 135,
            showOverflowTooltip: true
          }
        ],
        columns1: [
          {
            lab: '打印',
            val: 'print',
            expands: {}
          },
          {
            lab: '明细',
            val: 'detailed',
            custom: 'detailed'
          },
          {
            lab: '还退款',
            val: 'refund',
            custom: 'refund',
            width: 100
          },
          {
            lab: '收费单编号',
            val: 'orderNumber',
            custom: 'orderNumber',
            width: 165
          },
          {
            lab: '收费单状态',
            val: 'billingStatus',
            custom: 'billingStatus',
            width: 135
          },
          {
            lab: '收费单类型',
            val: 'billType',
            custom: 'billType',
            width: 135
          },
          {
            lab: '客户姓名',
            val: 'customerName',
            custom: 'customerName',
            width: 100
          },
          {
            lab: '卡号',
            val: 'customCardNumber',
            width: 160
          },
          {
            lab: '备注',
            val: 'billingRemarks',
            width: 135,
            showOverflowTooltip: true
          },
          {
            lab: '费用合计',
            val: 'totalExpenses'
          },
          // 临时隐藏
          // {
          //   lab: '折扣',
          //   val: 'discount'
          // },
          {
            lab: '应付款',
            val: 'amountPayable'
          },
          {
            lab: '实付款',
            val: 'paidAmount'
          },
          {
            lab: '是否领药',
            val: 'isReceivingMedicine',
            custom: 'isReceivingMedicine'
          },
          {
            lab: '是否治疗',
            val: 'isTreatment',
            custom: 'isTreatment'
          },
          {
            lab: '科室',
            val: 'departmentName',
            width: 120
          },
          {
            lab: '客户代表',
            val: 'crName',
            width: 130
          },
          {
            lab: '推荐人',
            val: 'souName',
            width: 130
          },
          {
            lab: '现场咨询师',
            val: 'acName',
            width: 130
          },
          {
            lab: '下单人',
            val: 'dsingleUserName',
            width: 120
          },
          {
            lab: '下单时间',
            val: 'billTime',
            width: 144
          },
          {
            lab: '退款原因',
            val: 'reasonForRefund',
            custom: 'reasonForRefund',
            width: 120
          },
          {
            lab: '打回备注/审批备注',
            val: 'returnComments',
            width: 135,
            showOverflowTooltip: true
          }
        ],
        // 查询出列表
        options: {
          billTime: {
            type: 'Tdatetime',
            clearable: true,
            label: '开单时间',
            values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
          },
          // 收费单编号
          orderNumber: {
            type: 'input',
            label: '收费单号'
          },
          customerName: {
            type: 'input',
            label: '客户姓名'
          },
          customPhone: {
            type: 'input',
            label: '电话'
          },
          customCardNumber: {
            type: 'input',
            label: '卡号'
          },
          billType: {
            type: 'select',
            label: '收费类型',
            clearable: true,
            options: []
          },
          billingStatus: {
            type: 'select',
            label: '收费单状态',
            clearable: true,
            options: []
          },
          departmentId: {
            type: 'select',
            clearable: true,
            label: '科室',
            options: []
          },
          aestheticConsultant: {
            type: 'select',
            label: '美学顾问',
            clearable: true,
            options: []
          },
          dsingleUser: {
            type: 'select',
            label: '下单人',
            clearable: true,
            values: []
          }
          // reasonForRefund: {
          //   type: 'select',
          //   label: '退款原因',
          //   clearable: true
          // }
        },
        sumAmountPayable: 0, // 应付金额
        sumPaidAmount: '', // 实付金额
        customerStatus: 0,
        expands: [], // 存放展开行的ID
        detailsData: [],
        print: {
          customName: '',
          customPhone: '',
          orderNumber: '',
          billType: '',
          billingRemarks: ''
        },
        result: {},
        orderInfo: {},
        detailsDrawerData: [],
        oldOrderInfoData: [],
        details: [],
        total: '',
        Ages: '',
        customSex: '',
  
        rules: {
          returnComments: [
            { required: true, message: '请填写撤回说明', trigger: 'change' }
          ]
        },
        PrintList: {},
        customAge: '',
        // 排序弹框
        showDialogScharge: false,
        selectionDataSortList: [], // 选中的列表数据
        xflagList: [],
        cancelList: []
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
        this.getDepartmentList()
        this.getData()
        this.getUserList(val)
      }
    },
    created() {
      this.columns = JSON.parse(localStorage.getItem('flagListcharge')) ? JSON.parse(localStorage.getItem('flagListcharge')) : this.columns
      this.columns1 = JSON.parse(localStorage.getItem('sortListcharge')) ? JSON.parse(localStorage.getItem('sortListcharge')) : this.columns1
      this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionCharge')) ? JSON.parse(localStorage.getItem('selectionCharge')) : this.selectionDataSortList
      this.cancelList = JSON.parse(localStorage.getItem('cancelListcharge')) ? JSON.parse(localStorage.getItem('cancelListcharge')) : this.cancelList
  
      this.options.billType.options = this.dict.type.billing_type
      this.options.billingStatus.options = this.dict.type.billing_status
      this.deptId = this.$store.getters.departmentId
      this.getUserList(this.deptId)
      this.getDepartmentList()
      this.getData()
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    mounted() {
      let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
      let newstr=str.split('<')[0]
      this.newmessage=newstr
    },
    methods: {
      // 弹出顺序弹框
      cellClassName({row,rowIndex}){
        if(rowIndex%2==0){
          return 'normal-row'
        }
      },
      getDialogScharge() {
        this.showDialogScharge = true
        this.$nextTick(() => {
          this.$refs.charge.$refs.sortRef.$refs.sortRefs.toggleRowSelection(this.columns1[0], true)
        })
        if (this.selectionDataSortList.length) {
          this.columns.forEach(item => {
            this.columns1.forEach(items => {
              if (item.lab == items.lab) {
                this.$nextTick(() => {
                  this.$refs.charge.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
                })
              }
            })
          })
        } else {
          this.$nextTick(() => {
            this.$refs.charge.$refs.sortRef.$refs.sortRefs.toggleAllSelection()
          })
        }
        this.$nextTick(() => {
          this.rowDrop()
        })
      },
      // 在行拖拽的方法进行querySelector的查找时，需对查询到dialog的el-table的类中
      rowDrop() {
        const tbody = document.querySelector('.Charge .el-table__body-wrapper tbody')
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
            const currRow = _this.columns1.splice(oldIndex, 1)[0]
            _this.columns1.splice(newIndex, 0, currRow)
            if (_this.cancelList.length) {
              _this.columns = _this.columns1
              _this.cancelList.forEach(iten => {
                _this.columns = _this.columns.filter(mm => mm.lab != iten.lab)
              })
            } else {
              _this.columns = _this.columns1
              _this.columns1 = _this.columns1
            }
            localStorage.setItem('sortListcharge', JSON.stringify(_this.columns1))
            localStorage.setItem('flagListcharge', JSON.stringify(_this.columns))
          }
        })
      },
      // 在点击列的时候被触发
      itemHandleSelectionChange(selection) {
        this.xflagList = this.columns1
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
            localStorage.setItem('flagListcharge', JSON.stringify(this.columns))
            localStorage.setItem('cancelListcharge', JSON.stringify(this.cancelList))
          })
        } else {
          this.cancelList = this.cancelList.filter(item => item.val != selection[2].val)
          this.columns1.forEach((item1, index1) => {
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
              localStorage.setItem('flagListcharge', JSON.stringify(this.columns))
            }
          })
        }
        localStorage.setItem('selectionCharge', JSON.stringify(this.selectionDataSortList))
      },
      // 取消禁用
      selectEnable(row, rowIndex) {
        if (row.lab == '打印') { // 禁用
          return false
        } else {
          return true
        }
      },
      // 去重
      unique1(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.lab) && res.set(arr.lab, 1))
      },
      // 弹窗关闭
      showdialogT() {
        this.showDialogScharge = false
      },
      // 顺序禁止点击
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex == 0) {
          return 'flagclass'
        }
      },
      getnum(val) {
      
        if (val == '1') {
          return '已提交'
        }
        if (val == '2') {
          return '已下单'
        }
        if (val == '1') {
          return '已结账'
        }
      },
      prescription(data) {
        this.hispotaljdxxId=data.jdxxId
        const datas = {
          orderNumber: data.orderNumber,
          deptId: this.deptId
        }
        const newdata = {
          orderNumber: data.orderNumber
        }
        this.$api.modules.billingList.ChargeList(datas).then((res) => {
          this.$api.billingList.orderDetailsList(newdata).then(newres => {
            this.PrintList = newres.rows
            this.Ages = this.PrintList[0].customAge
            this.customSex = this.PrintList[0].customSex
            this.result = res.rows[0]
            this.billTimeStart=this.result.billTime.split(' ')[0]
            this.newresult=res.data;
            console.log(JSON.stringify(this.result))
            setTimeout(() => {
              this.$refs.newprescription.print()
            }, 300)
          })

        })
        // this.$refs.newprescription.print();
        // console.log(data,'dsgfsgf')
      },
      // :row-key="getRowKeys"
      getRowKeys(row) {
        return row.orderId
      },
      exportExcel() {
        if (this.tableData.length === 0) {
          this.$message('打印数据为空')
          return
        }
        var data = {}
        this.submitLoadings = true
        for (const k in this.options) {
          if (this.options[k].type === 'Tdatetime') {
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
          } else {
            if (this.options[k].values === '') {
              data[k] = undefined
            } else {
              data[k] = this.options[k].values
            }
          }
        }
        this.$message({
          message: '稍等一下，马上就好',
          type: 'success'
        })
        data = Object.assign(data)
        this.$set(data, 'deptId', this.deptId)
        this.$api.modules.billingList.ChargeList(data).then((res) => {
          if (res) {
            this.tableData = res.rows
          }
        }).finally(() => {
          this.$export('#out-table', '我的收费单')
          setInterval(() => {
            this.submitLoadings = false
          }, 5000)
        })
      },
      /** 分页*/
      sizeChange(e) {
        this.pagination.pageSize = e[1]
        this.getData()
      },
      currentChange(e) {
        this.pagination.pageNum = e[1]
        this.pagination.currentPage = e[1]
        this.getData()
      },
      /**
       * @author Nevin
       * @date 2022/6/4
       * @Description: 收费单类型
       */
      BillTypeName(str) {
        const obj = this.dict.type.billing_type.find(item => item.value === str)
        return obj ? obj.label : ''
      },
      /**
       * @author Nevin
       * @date 2022/6/4
       * @Description: 展开行时的方法(每次只能展开一行)
      */
      expandChange(row) {
        if (row[2].length) {
          this.expands = []
          row[1] ? this.expands.push(row[1].orderId) : ''
        } else {
          this.expands = []
        }
        this.print.customName = row[1].customerName
        this.print.customPhone = row[1].customPhone
        this.print.orderNumber = row[1].orderNumber
        this.print.billType = this.BillTypeName(row[1].billType)
        this.print.billingRemarks = row[1].billingRemarks
        this.getDetails(row[1])
      },
      /**
       * @author Nevin
       * @date 2022/6/6
       * @Description: 获取收费单详情
      */
      getDetails(data) {
        if (data.billType === '9' || data.billType === '11') {
          if (data.oldBillType === '6') {
            this.$api.billingList.orderDetailsList({
              orderNumber: data.orderNumber
            }).then(res => {
              if (res) {
                this.details = res.rows
                let total = 0
                this.details.forEach(item => {
                  total = math.add(item.discountAmount, total).toFixed(2)
                })
                this.total = total
              }
            })
          } else if (data.oldBillType === '2') {
            this.$api.billingList.reservationDataDetailed({
              orderNumber: data.orderNumber
            }).then(res => {
              this.details = res.rows
              let total = 0
              this.details.forEach(item => {
                total = math.add(item.discountAmount, total).toFixed(2)
              })
              this.total = total
            })
          } else {
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
              }
            })
          }
        } else {
          if (data.billType === '6') {
            this.$api.billingList.orderDetailsList({
              orderNumber: data.orderNumber
            }).then(res => {
              if (res) {
                if(res.rows.length!==0){
                  this.details = res.rows
                  let total = 0
                  this.details.forEach(item => {
                    total = math.add(item.discountAmount, total).toFixed(2)
                  })
                  this.total = total
                }

              }
            })
          } else if (data.billType === '2') {
            this.$api.billingList.reservationDataDetailed({
              orderNumber: data.orderNumber
            }).then(res => {
              this.details = res.rows
              let total = 0
              this.details.forEach(item => {
                total = math.add(item.discountAmount, total).toFixed(2)
              })
              this.total = total
            })
          } else {
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
              }
            })
          }
        }
      },
      /**
       * @author Nevin
       * @date 2022/6/5
       * @Description: 展示订单明细
      */
      showDetails(data) {
        this.orderInfo = data
        if (this.orderInfo.billType === '9' || this.orderInfo.billType === '11') {
          if (this.orderInfo.oldBillType === '6') {
            this.$api.billingList.adjuvantBillingList({
              relationshipNumber: this.orderInfo.chargeSheetId
            }).then(res => {
              if (res) {
                this.detailsDrawerData = res.rows
                this.showDetailsDrawer = true
              }
            })
          } else if (this.orderInfo.oldBillType === '2') {
            this.$api.billingList.reservationDataDetailed({
              orderNumber: this.orderInfo.chargeSheetId
            }).then(res => {
              this.detailsDrawerData = res.rows
            })
          } else {
            this.$api.billingList.orderDetailsList({
              orderNumber: this.orderInfo.chargeSheetId
            }).then((res) => {
              if (res) {
                this.detailsDrawerData = res.rows
                this.showDetailsDrawer = true
              }
            })
          }
        } else {
          if (this.orderInfo.billType === '6') {
            this.$api.billingList.adjuvantBillingList({
              relationshipNumber: this.orderInfo.orderNumber
            }).then(res => {
              if (res) {
                this.detailsDrawerData = res.rows
                this.showDetailsDrawer = true
              }
            })
          } else if (this.orderInfo.billType === '2') {
            this.$api.billingList.reservationDataDetailed({
              orderNumber: this.orderInfo.orderNumber
            }).then(res => {
              this.detailsDrawerData = res.rows
              this.showDetailsDrawer = true
            })
          } else {
            this.$api.billingList.orderDetailsList({
              orderNumber: this.orderInfo.orderNumber
            }).then((res) => {
              if (res) {
                this.detailsDrawerData = res.rows
                this.showDetailsDrawer = true
              }
            })
          }
        }
      },
      /**
       * @author Nevin
       * @date 2022/6/5
       * @Description: 关闭订单详情drawer
      */
      closeDetailsDrawer() {
        this.showDetailsDrawer = false
      },
      /**
       * @author Nevin
       * @date 2022/6/5
       * @Description:获取源订单
      */
      showOldOrder(data) {
        this.$api.billingList.ChargeList({
          orderNumber: data.custom.chargeSheetId
        }).then(res => {
          if (res) {
            this.oldOrderInfoData = res.rows
            this.showOldOrderInfo = true
          }
        })
      },
      /**
       * @author Nevin
       * @date 2022/6/5
       * @Description: 关闭源收费单drawer
      */
      closeOldOrderInfo() {
        this.showOldOrderInfo = false
      },
      /**
       * @author Nevin
       * @date 2022/6/4
       * @Description: 打印收费单
      */
      printChargeSheet(data) {
        this.print.titleName = '收费单'
        this.$refs.printChargeSheet.print()
      },
      /**
       * @author Nevin
       * @date 2022/6/4
       * @Description: 打印治疗单单
       */
      printTreatmentSheet() {
        // this.$refs.print.print()
      },
      /**
       * @author Nevin
       * @date 2022/7/1
       * @Description: 检验单打印
      */
      printInspectionSheet(data) {
        if (data.billType !== '7') {
          this.$message.warning('此订单不是检验单！')
          return
        }
        this.print.titleName = '检验单'
        this.$refs.printInspectionSheet.print()
      },
      // 客户姓名
      customerName(id, val) {
        this.showOldOrderInfo = false
        if (val.paidAmount > 0) {
          this.customerStatus = 2
          this.$router.push({ path: 'customerInfo', query: { id, status: this.customerStatus, noDeal: val.billingStatus }})
        } else {
          this.customerStatus = 1
          this.$router.push({ path: 'customerInfo', query: { id, status: this.customerStatus, noDeal: val.billingStatus }})
        }
      },
      // 弹框关闭
      handleClose(done) {
        this.$confirm('确认关闭？').then(_ => {
          done()
          this.receipt = {
            orderId: '',
            billingStatus: '2',
            orderNumber: '',
            returnComments: ''
          }
        }).catch(_ => {})
      },
      // 保存
      repulseReceipt() {
        this.$refs.receipt.validate(valid => {
          if (valid) {
            // this.submitLoading = true
            // this.dialogVisible = false
            this.$refs.receipt.validate(valid => {
              if (valid) {
                this.$api.finance.repulseReceipt(this.receipt).then(res => {
                  if (res) {
                    this.$message.success(res.msg)
                    this.dialogVisible = false
                    this.receipt = {
                      orderId: '',
                      billingStatus: '2',
                      orderNumber: '',
                      returnComments: ''
                    }
                    this.submitLoading = false
                    this.getData()
                  }
                })
              }
            })
          }
        })
      },
      // 撤回
      repulse() {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择一名顾客进行修改')
          return
        } else {
          if (this.selectionData.length >= 2) {
            this.$message.warning('只能选择一名顾客进行修改')
            return
          }
        }
        if (this.selectionData[0].billingStatus === '2') {
          this.$message.warning('该顾客已撤回，不能重复撤回！')
        } else if (this.selectionData[0].billingStatus === '3') {
          this.$message.warning('该顾客已结账，不能撤回！')
        } else {
          this.dialogVisible = true
          this.receipt.orderNumber = this.selectionData[0].orderNumber
          this.receipt.orderId = this.selectionData[0].orderId
          this.receipt.billType= this.selectionData[0].billType
          this.receipt.roomReservationId= this.selectionData[0].roomReservationId
          this.receipt.waitSource=this.selectionData[0].waitSource
        }
      },
  
      // 列表数据
      getData: debounce(async function(isSearch) {
        var data = {}
        for (const k in this.options) {
          if (this.options[k].type === 'Tdatetime') {
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
          } else {
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
        this.showDataDialog = true
        await this.$api.modules.billingList.myPaymentInfoTow(data).then((res) => {
          if (res) {
            res.rows.forEach(item => {
              if (item.paidAmount < 0) {
                item.paidAmount = -item.paidAmount
              }
            })
            this.tableData = res.rows
            this.pagination.total = res.total
            if (res.data === null) {
              this.sumAmountPayable = 0
              this.sumPaidAmount = 0
            } else {
              this.sumAmountPayable = res.data.sumAmountPayable
              this.sumPaidAmount = res.data.sumPaidAmount
            }
          }
        }).finally(() => {
          this.showDataDialog = false
        })
      }),
      /**
        * @author 李尚
        * @date 16/5/2022
        * @Description: 退储值
      */
      retreat() {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择一项')
          return
        }
        if (this.selectionData[0].billType !== '3' && this.selectionData[0].billType !== '4') {
          this.$message.warning('选中的单据不是储值单')
          return
        }
        if (this.selectionData[0].billingStatus !== '3') {
          this.$message.warning('选中的用户未结账')
          return
        }
        this.$router.push({ path: 'returnedValue', query: { data: JSON.stringify(this.selectionData[0]) }})
      },
      // 提交
      async management() {
        if (this.selectionData.length !== 1) {
          this.$message.warning('请选择一名顾客进行修改')
          return
        }
        // 网络请求判断一下当前状态
        const { data } = await this.$api.billingList.getOrderInfo(this.selectionData[0].orderId)
        // console.log(data)
        // console.log(this.selectionData[0])
        if (this.selectionData[0].billingStatus !== data.billingStatus) {
          this.$message.warning('当前数据已发生改变，请刷新后重试！')
          return
        }
        if (this.selectionData[0].billingStatus === '1') {
          this.$message.warning('该顾客已提交，不能重复提交！')
        } else if (this.selectionData[0].billingStatus === '3') {
          this.$message.warning('已结账客户不能再提交！')
        } else {
          if (this.selectionData[0].billType === '1') {
            this.$router.push({ path: 'customerBilling'})
            const query={
              billing:JSON.stringify(this.selectionData[0]),
              billType: this.selectionData[0].billType,
            }
            sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '2') {
            this.$router.push({ path: 'advancePayment'})
            const query= { billType: this.selectionData[0].billType, billing: JSON.stringify(this.selectionData[0]) }
            sessionStorage.setItem('advancePaymentitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '3') {
            this.$router.push({ path: 'pepositValue'})
            const query= {id: this.selectionData[0].id, content: JSON.stringify(this.selectionData[0]), billType: this.selectionData[0].billType}
            sessionStorage.setItem('pepositValueitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '4') {
            this.$router.push({ path: 'StoredValueCard'})
            const query={
              content:JSON.stringify(this.selectionData[0]),
              billType: this.selectionData[0].billType,
              id: this.selectionData[0].id
            }
            sessionStorage.setItem('StoredValueCarditem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '5') {
            this.$router.push({ path: 'hospitalizationDeposit'})
            const query={
              content:JSON.stringify(this.selectionData[0]),
              id: this.selectionData[0].id,
              billType: this.selectionData[0].billType
            }
            sessionStorage.setItem('hospitalizationDeposititem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '6') {
            this.$router.push({ path: 'adjuvantBillingTherapy'})
            const query= {
              billing: JSON.stringify(this.selectionData[0]),
              billType: this.selectionData[0].billType
            }
            sessionStorage.setItem('adjuvantBillingTherapyitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '7') {
            this.$router.push({ path: 'inspectionBilling'})
            const query= {
              billType: this.selectionData[0].billType,
              billing: JSON.stringify(this.selectionData[0])
            }
            sessionStorage.setItem('inspectionBillingitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '19') {
            this.$router.push({ path: 'radiationBilling'})
            const query= {
              billType: this.selectionData[0].billType,
              billing: JSON.stringify(this.selectionData[0])
            }
            sessionStorage.setItem('radiationBillingitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '8') {
            this.$router.push({ path: 'customerBilling'})
            const query={
              billing:JSON.stringify(this.selectionData[0]),
              billType: this.selectionData[0].billType,
            }
            sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
          } else if (this.selectionData[0].billType === '9') {
            this.$message.warning('该笔订单不可提交！')
          } else {
            this.$message.warning('该笔订单不可提交！')
          }
        }
      },
      // 预约金消费
      yuyue() {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择一名顾客进行修改')
          return
        } else {
          if (this.selectionData.length >= 2) {
            this.$message.warning('只能选择一名顾客进行修改')
            return
          }
        }
        if (this.selectionData[0].billingStatus != 3) {
          this.$message.warning('该单据未结账')
          return
        }
        if (this.selectionData[0].billType === '2') {
          this.$router.push({
            name: 'Subscription',
            params: { list: this.selectionData[0], billType: this.selectionData[0].billType }
          })
          sessionStorage.setItem('consultInputitemmoney',JSON.stringify(this.selectionData[0]))
        } else {
          this.$message.warning('选中的单据不是预约金消费单')
        }
      },
      /**
       * @author Nevin
       * @date 2022/5/10
       * @Description: 表格单选
      */
      handleSelectionChange(e) {
        this.selectionData = []
        if (e[1].length > 1) {
          this.$refs.table.$refs.multipleTable.clearSelection()
          this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
        }
        this.selectionData.push(e[1].pop())
        this.$delete(this.selectionData, 1)
      },
      /**
       * @author Nevin
       * @date 2022/5/10
       * @Description: 行内点击选中
      */
      rowClick(e) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
      },
      // 退款
      refund() {
        if (this.selectionData.length < 1) {
          this.$message.warning('请选择一项')
          return
        }
        if (this.selectionData[0].billingStatus !== '3') {
          this.$message.warning('未结账不能退款')
          return
        }
        if (this.selectionData[0].billType === '11' || this.selectionData[0].billType === '9' || this.selectionData[0].billType === '12' || this.selectionData[0].billType === '13' || this.selectionData[0].billType === '14') {
          this.$message.warning('该单据不能退款')
          return
        }
        if (this.selectionData[0].billType === '3' || this.selectionData[0].billType === '4') {
          this.$router.push({ path: 'returnedValue', query: { data: JSON.stringify(this.selectionData[0]) }})
          return
        }
        if (this.selectionData[0].billType === '2') {
          this.$router.push({ path: 'refundAdvancePayment', query: { data: JSON.stringify(this.selectionData[0]) }})
          return
        }
        if (this.selectionData[0].billType === '5') {
          this.$router.push({ path: 'refundHospitalizationDeposit', query: { data: JSON.stringify(this.selectionData[0]) }})
          return
        }
        this.$router.push({ path: 'refundPage', query: { id: this.selectionData[0].id, billing: JSON.stringify(this.selectionData[0]) }})
      },
      /**
       * @author Nevin
       * @date 2022/5/14
       * @Description: 删除订单
      */
      removeOrderInfo() {
        if (this.selectionData[0].billingStatus === '2') {
          this.$api.modules.billingList.removeOrderInfo({
            billType: this.selectionData[0].billType,
            jdxxId: this.selectionData[0].jdxxId,
            orderId: this.selectionData[0].orderId,
            orderNumber: this.selectionData[0].orderNumber
          }).then((res) => {
            if (res) {
              this.$message.success(res.msg)
              this.getData()
            }
          })
        } else {
          this.$message.error('该客户订单不可删除！')
        }
      },
      // 获取科室列表
      getDepartmentList() {
        /**
         * @author 李尚
         * @date 2022/6/18
         * @Description: 添加状态
         */
        const data = {
          deptId: this.deptId,
          status: '0',
          isDepartment: '1'
        }
        this.$api.dept.DepartmentList(data).then(res => {
          if (res.code === 200) {
            res.rows.forEach(item => {
              item.label = item.departmentName
              item.value = item.departmentId
            })
            this.options.departmentId.options = res.rows
          }
        })
      },
      // 获取系统用户列表
      async getUserList(deptId) {
        /**
         * @author 李尚
         * @date 2022/6/18
         * @Description: 人员添加公司Id 添加状态
         */
        const data = {
          deptId: deptId,
          status: '0'
        }
        await this.$api.user.getUserList(data).then(res => {
          if (res.code === 200) {
            res.data.forEach(item => {
              item.label = item.nickName
              item.value = item.userId
            })
            const arr1 = this.unique(res.data)
            this.options.dsingleUser.options = arr1
            // xczxs 美学顾问
            res.data.forEach(item => {
              if (item.postCode === 'xczxs') {
                this.options.aestheticConsultant.options.push(item)
              }
            })
          }
        })
      },
      unique(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
      },
      // 收费单编号
      orderNumber(data) {
        this.showOldOrderInfo = false
        this.$router.push({ path: 'billDetails'})
        sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
      },
      /**
       * @author Nevin
       * @date 2022/5/20
       * @Description:
       */
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (row.billingStatus === '3') {
          if (columnIndex === 6) {
            return { 'color': '#e41b17', 'font-weight': '600' }
          }
        }
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .print {
    margin: 0;
    padding: 0;
    .title {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
    .header {
      margin: 30px 20px 0 20px;
      font-size: 14px;
      span {
        margin: 0 40px;
      }
    }
    .table {
      width: 100%;
      margin: 30px 20px 0 20px;
      font-size: 14px;
    }
  }
  .container {
    width: 100%;
    height: 100%;
  
  }
  .print_list{
    width: 95%;height: 50px;line-height: 25px;
    margin-top: 10px;
  }
  
  a{
    color: #0066cc;
  }
  .searchBar {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 30px;
    color: #999;
  }
  
  .headerTopPadding {
    padding-top: 16px;
    padding-left: 10px;
    box-sizing: border-box;
  }
  ::v-deep thead .el-table-column--selection .cell {
    display: none;
  }
  ::v-deep .el-input--prefix .el-input__inner{
    padding-left: 15px !important;
    padding-right: 10px !important;
  }
  ::v-deep .el-input__icon{
    width: 10px !important;
  }
  </style>
  <style>
  .el-input__prefix{
    display: none;
  }
  </style>
  