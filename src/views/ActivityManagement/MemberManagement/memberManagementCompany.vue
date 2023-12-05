<template>
  <!-- 会员管理列表 -->
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
            type="success"
            icon="el-icon-upload2"
            plain
            :loading="submitLoadings"
            @click.stop="exportExcel"
        >导出</el-button>
      </div>
      <slot>
        <sg-table
            id="out-table"
            ref="table"

            :sg-ref="'multipleTable'"
            size="mini"
            border
            index="序号"
            selection
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            highlight-current-row
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            :row-class-name="rowClassName"
            v-has-permi="['confinement:memberPoints:getMemberList']"
        >
          <div slot="searchBar" class="searchBar">
            <div>统计信息</div>
<!--            <div>-->
<!--              <p>客户: {{ coument }}-->
<!--                &nbsp;&nbsp;-->
<!--                <span>应付 : {{ placeorder }}元[{{ payableSigle }}单]</span>&nbsp;-->
<!--                 <span>应退 : {{checkOut}}元[{{payableSigle}}单]</span>-->
<!--              </p>-->
<!--            </div>-->
          </div>
          <!-- 按钮 -->
          <div slot="header" style="width: 100%;position: relative">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
<!--            <span style="display: inline-block;width: 20px;height: 20px;background-color:#c6f9c3;margin-left: 10px;position: absolute"></span>-->
<!--            <span style="margin-left: 40px;font-size: 14px">已领取</span>-->
           <div style="float: right">

            <el-button
                v-hasPermi="['system:dept:repulse']"
                type="primary"
                size="mini"
                plain
                icon="el-icon-edit"

                @click.stop.native="repulse"
            >绑定批量客服
            </el-button>
            <el-button type="primary" size="mini" plain v-has-permi="['confinement:memberPoints:add']"  @click="Gradeadjustment">等级调整</el-button>
            <el-button type="primary" size="mini" plain v-has-permi="['confinement:memberPointsInfo:add']" @click="Integral">积分调整</el-button>
            <el-button type="primary" size="mini" plain v-has-permi="['share:giftIncomingOutgoingInfo:add']" @click="newNumber">新客礼品兑换</el-button>
            <el-button type="primary" size="mini" plain v-has-permi="['share:giftIncomingOutgoingInfo:add']" @click="clicklExchange">积分兑换</el-button>
<!--            <el-button type="primary" size="mini" plain>手工上报</el-button>-->
<!--            <el-button type="primary" size="mini" plain>补充客户信息</el-button>-->
            <el-button type="primary" size="mini" plain v-has-permi="['confinement:memberPoints:edit']" @click="clickCard">领卡</el-button>
<!--            <el-button type="danger" size="mini" plain>批量添加黑名单</el-button>-->
           </div>
          </div>
          <template #custom="data">
              <!-- 客户姓名 -->
              <div v-if="data.props === 'customerName'">
                  <a class="textLink" @click="handleCustomer(data.custom)">
                      {{ data.custom.customerName }}
                  </a>
              </div>
            <div v-if="data.props === 'customState'">
              <div v-if="data.custom.customState==0">正常</div>
              <div v-if="data.custom.customState==1">注销</div>
            </div>
            <div v-if="data.props === 'receiveFlag'">
              <div v-if="data.custom.receiveFlag==0">未领取</div>
              <div v-if="data.custom.receiveFlag==1" style="color:#1abc9c">正常 (已领卡)</div>
            </div>
            <div v-if="data.props === 'channelName'|| data.props === 'channelTypeName'">
              <div>
                {{ data.custom.channelTypeName}}/{{ data.custom.channelName}}
              </div>
            </div>
            <div v-if="data.props === 'dealFlag'">
              <div v-if="data.custom.dealFlag==0">是</div>
              <div v-if="data.custom.dealFlag==1">否</div>
            </div>
            <div v-if="data.props === 'customSex'">
              <div v-if="data.custom.customSex==0">女</div>
              <div v-if="data.custom.customSex==1">男</div>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <!--[批量绑定客服]-->
    <el-dialog
        title="批量绑定客服"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
      <el-form ref="receipt" label-width="100px"  :model="userLists" size="mini">
        <el-form-item label="客服名称:">
          <el-select v-model="userLists.userName"  filterable clearable :filter-method="may">
            <el-option
                v-for="(item, index) in getuserLists"
                :key="index"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini"  @click="repulseReceipt">保存</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-close" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--等级调整-->
    <sgDialog title="等级调整"  size="600px" :dialog="showDialogS" @handleClose="showdialogT">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="105px" label-position="right" :inline="true" ref="formlist" :model="formlist" :rules='rules' size="mini" class="demo-form-inline">
            <el-form-item label="客户名称：" prop="customerName" >
              <el-input v-model="formlist.customerName" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="会员等级：" prop="levelDescription">
              <el-select v-model="formlist.levelDescription" style="width: 100px" filterable clearable>
                <el-option
                    v-for="(item, index) in levelDescriptionList"
                    :key="index"
                    :label="item.gradeName"
                    :value="item.membershipLevel"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="会员卡号：" prop="memberCard">
              <el-input v-model="formlist.memberCard" disabled  style="width: 160px;" />
            </el-form-item>
            <el-form-item label="总积分：" prop="pointsTotal">
              <el-input v-model="formlist.pointsTotal" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="冻结积分：" prop="number">
              <el-input v-model="formlist.number"  disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="可用积分：" prop="usablePoints">
              <el-input v-model="formlist.usablePoints" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="formlist.remarks"  style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div  class="dialog-footer" style="text-align: end;">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submit">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <!--积分调整-->
    <sgDialog title="积分调整"  size="600px" :dialog="showDialogintegral" @handleClose="showdialogIntegral">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="105px" label-position="right" :inline="true" ref="formlist" :model="formlistIntegral" :rules='rulesIntegral' size="mini" class="demo-form-inline">
            <el-form-item label="客户名称：" prop="customerName" >
              <el-input v-model="formlistIntegral.customerName" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="会员等级：" prop="levelDescription">
              <el-input v-model="formlistIntegral.levelDescription" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="会员卡号：" prop="memberCard">
              <el-input v-model="formlistIntegral.memberCard" disabled  style="width: 160px;" />
            </el-form-item>
            <el-form-item label="总积分：" prop="pointsTotal">
              <el-input v-model="formlistIntegral.pointsTotal" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="冻结积分：" prop="number">
              <el-input v-model="formlistIntegral.number"  disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="可用积分：" prop="usablePoints">
              <el-input v-model="formlistIntegral.usablePoints" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="积分加减：" prop="adjustState">
              <el-select v-model="formlistIntegral.adjustState" style="width: 140px" filterable clearable>
                <el-option
                    v-for="(item, index) in adjustStateList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="积分：" prop="pointsAdjust">
              <el-input v-model="formlistIntegral.pointsAdjust"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="formlistIntegral.remarks"  style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer" style="text-align: end;">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submitIntegral">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="closeIntegral">关闭</el-button>
        </div>
      </div>
    </sgDialog>
<!--    积分兑换-->
    <sgDialog title="积分兑换"  size="690px" :dialog="dailogintegralExchange" @handleClose="integralExchanges">
      <div slot="out">
        <div class="formBody">
          <el-form label-width="145px" label-position="right" :inline="true" ref="formlistExchange" :model="integralExchange" :rules='rulesintegralExchange' size="mini" class="demo-form-inline">
            <el-form-item label="会员名：" prop="customerName" >
              <el-input v-model="integralExchange.customerName" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="可用积分：" prop="usablePoints">
              <el-input v-model="integralExchange.usablePoints" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品：" prop="giftTypeName">
              <el-select v-model="integralExchange.giftTypeName" @change="getChange" style="width: 140px" filterable clearable placeholder="请选择礼品类型">
                <el-option
                    v-for="(item, index) in giftTypeList"
                    :key="index"
                    :label="item.giftTypeName"
                    :value="item.giftTypeId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="giftName">
              <el-select v-model="integralExchange.giftName" @change="getRedeemPoints" style="width: 140px" filterable clearable placeholder="请选择礼品">
                <el-option
                    v-for="(item, index) in giftList"
                    :key="index"
                    :label="item.giftName"
                    :value="item.giftTypeListId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="单个产品所需积分：" prop="redeemPoints">
              <el-input v-model="integralExchange.redeemPoints" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="冻结积分：" prop="number2">
              <el-input v-model="integralExchange.number2"  disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品数量：" prop="number" >
              <el-input  v-model="integralExchange.number" onkeyup="this.value=this.value.replace(/\D|^0/g,'')"   @input="getNumber"  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="积分发生额：" prop="memberCard">
<!--              <el-input v-model="integralExchange.memberCard" disabled  style="width: 140px;" />-->
              <span style="    border: 1px solid #e9e6e6;width: 130px;font-size: 12px; border-radius: 4px;cursor: not-allowed;display: block;background: #f7f7f7;height: 27px;padding-left: 10px;">
                {{integralExchange.memberCard?integralExchange.memberCard.toFixed(2):''}}
              </span>
            </el-form-item>

            <el-form-item label="期末积分：" prop="Points">
<!--              <el-input v-model="integralExchange.Points" disabled  style="width: 140px;" />-->
              <span style="    border: 1px solid #e9e6e6;width: 130px;font-size: 12px; border-radius: 4px;cursor: not-allowed;display: block;background: #f7f7f7;height: 27px;padding-left: 10px;">
                {{integralExchange.Points?integralExchange.Points.toFixed(2):''}}
              </span>
            </el-form-item>
            <el-form-item label="兑换日期：" prop="exchangeTime">
              <el-input v-model="integralExchange.exchangeTime" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="integralExchange.remarks"  style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer" style="text-align: end;">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submitChange">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="integralExchanges">关闭</el-button>
        </div>
      </div>
    </sgDialog>
<!--  领卡-->
    <sgDialog title="领卡"  size="430px" :dialog="dailogCard" @handleClose="closeCard">
      <div slot="out">
        <div class="">
          <el-form label-width="145px" label-position="right" :inline="true" ref="cardList" :model="cardList"  size="mini" class="demo-form-inline" :rules="newrules">
            <el-form-item label="会员姓名：" prop="customerName" >
              <el-input v-model="cardList.customerName" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="会员等级：" prop="levelDescription">
              <el-input v-model="cardList.levelDescription" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="会员卡号：" prop="memberCard">
              <el-input v-model="cardList.memberCard"  style="width: 160px;" />
            </el-form-item>
          </el-form>
        </div>

        <div class="footer" style="text-align: end;">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submitCard">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="closeCard">关闭</el-button>
        </div>
      </div>
    </sgDialog>
    <!--  新客礼品兑换-->
    <sgDialog title="新客礼品兑换"  size="1000px" :dialog="dailogNewnumber" @handleClose="closeNewnumber">
      <div slot="out">
        <div class="formBody">
          <div class="title">客户信息</div>
          <el-form label-width="125px"  label-position="right" :inline="true" ref="cardList" :model="searchList"  size="mini" class="demo-form-inline">
            <el-form-item label="会员姓名：" prop="customerName" >
              <el-input v-model="searchList.customerName"   clearable style="width: 140px;" />
            </el-form-item>
            <el-form-item label="电话：" prop="customPhone">
              <el-input v-model="searchList.customPhone"  clearable style="width: 140px;" />
            </el-form-item>
            <el-form-item label="会员卡号：" prop="memberCard">
              <el-input v-model="searchList.memberCard" clearable style="width: 160px;" />
            </el-form-item>
            <el-form-item  prop="memberCard">
              <el-button type="primary" size="mini"  @click="searchNumber">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <el-table :data="tableDatas" height="200px" size="mini" border style="width: 100%">
            <el-table-column prop="customerName" label="会员姓名" fixed />
            <el-table-column prop="customPhone" label="电话" />
            <el-table-column prop="customCardNumber" label="客户卡号" width="200"/>
            <el-table-column prop="customState" label="会员状态" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.customState == '0'">正常</span>
                <span v-if="scope.row.customState == '1'">销户</span>
              </template>
            </el-table-column>
            <el-table-column prop="customSex" label="性别" >
              <template slot-scope="scope">
                <span v-if="scope.row.customSex == '0'">女</span>
                <span v-if="scope.row.customSex == '1'">男</span>
              </template>
            </el-table-column>
            <el-table-column prop="aestheticConsultantName" label="归属美学顾问" />
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" plain @click="exchangeGift(tableDatas)">兑换礼品</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="formBody">
          <div class="title">新客礼品兑换</div>
          <el-form label-width="200px"  label-position="right" :inline="true" ref="redemption" :model="Giftredemption" :rules="Rulesgiftredemption"  size="mini" class="demo-form-inline">
            <el-form-item label="会员名：" prop="customerName" >
              <el-input v-model="Giftredemption.customerName"  disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="手机：" prop="customPhone">
              <el-input v-model="Giftredemption.customPhone" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="可用积分：" prop="usablePoints">
              <el-input v-model="Giftredemption.usablePoints" disabled  style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品：" prop="giftTypeName">
              <el-select v-model="Giftredemption.giftTypeName" @change="getChange1" style="width: 140px" filterable clearable>
                <el-option
                    v-for="(item, index) in giftTypeList"
                    :key="index"
                    :label="item.giftTypeName"
                    :value="item.giftTypeId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="giftName">
              <el-select v-model="Giftredemption.giftName" @change="getRedeemPoints1" style="width: 140px" filterable clearable>
                <el-option
                    v-for="(item, index) in giftList"
                    :key="index"
                    :label="item.giftName"
                    :value="item.giftTypeListId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="单个产品所需积分：" prop="redeemPoints">
              <el-input v-model="Giftredemption.redeemPoints" disabled   style="width: 140px;" />
            </el-form-item>
            <el-form-item label="礼品数量：" prop="number" >
              <el-input v-model="Giftredemption.number"  @input="getNumber"  style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer" style="text-align: end;">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submitChangeGigt(Giftredemption)">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="closeNewnumber">关闭</el-button>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import PinyinMatch from "pinyin-match";

import moment from 'moment'
// import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import { math } from '@/utils/math'
import {todayTime, timeFmt, newgetData} from '@/utils/time'
import log from "../../../api/sysManger/log";

export default {
  dicts: ['billing_status', 'billing_type', 'just_needed'],
  components: {
    SgTable,
    slideSearch,
    sgDialog
  },
  data() {
    return {
      submitLoadings: false,
      submitLoading: false,
      coument: '',
      payableSigle: 0,
      placeorder: 0, // 下单人数
      // checkOut: 0,
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      dialogVisible: false,
      receipt: {
        orderId: '',
        billingStatus: '2',
        orderNumber: '',
        returnComments: ''
      },
      newrules:{
        memberCard:[
          { required: true, message: '会员卡不能为空', trigger: 'blur' }
        ]
      },
      rules: {
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'change' }
        ],
        memberCard: [
          { required: true, message: '会员卡号不能为空', trigger: 'change' }
        ],
        levelDescription: [
          { required: true, message: '会员等级不能为空', trigger: 'change' }
        ],
      },
      rulesIntegral:{
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'change' }
        ],
        memberCard: [
          { required: true, message: '会员卡号不能为空', trigger: 'change' }
        ],
        levelDescription: [
          { required: true, message: '会员等级不能为空', trigger: 'change' }
        ],
        adjustState:[
          { required: true, message: '积分加减不能为空', trigger: 'change' }
        ],
        pointsAdjust:[
          { required: true, message: '积分不能为空', trigger: 'change' }
        ]
      },
      Rulesgiftredemption:{
        giftTypeName:[
          { required: true, message: '礼品类型不能为空', trigger: 'change' }
        ],
        giftName:[
          { required: true, message: '礼品不能为空', trigger: 'blur' }
        ],
        customerName:[
          { required: true, message: '会员名不能为空', trigger: 'change' }
        ],
        customPhone:[
          { required: true, message: '手机不能为空', trigger: 'change' }
        ],
        usablePoints:[
          { required: true, message: '可用积分不能为空', trigger: 'change' }
        ],
        redeemPoints:[
          { required: true, message: '单个产品所需积分不能为空', trigger: 'change' }
        ],
        number:[
          { required: true, message: '礼品数量不能为空', trigger: 'change' }
        ],
      },
      rulesintegralExchange:{
        giftTypeName:[
          { required: true, message: '礼品类型不能为空', trigger: 'change' }
        ],
        giftName:[
          { required: true, message: '礼品不能为空', trigger: 'change' }
        ],
        number:[
          { required: true, message: '礼品类型不能为空', trigger: 'change' }
        ],
        usablePoints:[
          { required: true, message: '可用积分不能为空', trigger: 'change' }
        ],
        customerName:[
          { required: true, message: '会员名不能为空', trigger: 'change' }
        ],
    },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      tableDatas: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [
        // {
        //   lab: '操作',
        //   val: 'orderNumber',
        //   custom: 'orderNumber',
        //   width: 140
        // },
        {
          lab: '客户姓名',
          val: 'customerName',
            custom: 'customerName'
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
          width: 120
        },
        {
          lab: '年龄',
          val: 'customAge',
        },
        {
          lab: '生日',
          val: 'birthday',
          width: 120
        },
        {
          lab: '会员等级',
          val: 'levelDescription'
        },
        {
          lab: '会员卡号',
          val: 'memberCard',
          width: 160
        },
        {
          lab: '会员卡状态',
          val: 'customState',
          custom: 'customState',
          width: 140
        },
        {
          lab: '是否领卡',
          val: 'receiveFlag',
          custom: 'receiveFlag',
          width: 140
        },
        {
          lab: '领卡时间',
          val: 'receiveTime',
          width: 150
        },
        {
          lab: '媒介类型/媒介来源',
          val: 'channelName',
          custom: 'channelName',
          width: 200,
          showOverflowTooltip: true
        },
        {
          lab: '是否成交客户',
          val: 'dealFlag',
          custom: 'dealFlag',
          width: 140
        },
        {
          lab: '累积消费金额',
          val: 'consumeTotal',
          width: 140
        },
        {
          lab: '累积总积分',
          val: 'pointsTotal',
          width: 140
        },
        {
          lab: '可用积分',
          val: 'usablePoints',
        },
        {
          lab: '注册时间',
          val: 'createTime',
          width: 140
        },
        {
          lab: '最后消费时间',
          val: 'lastConsumeTime',
          width: 140
        },
        {
          lab: '客户代表',
          val: 'customerrepName',
        },
        {
          lab: '会员客服',
          val: 'memberServiceName',
        },

      ],
      // 查询出列表
      options: {
        registerStart: {
          type: 'datetimerangeopentions',
          label: '注册时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        receiveStart: {
          type: 'datetimerangeopentions',
          label: '领卡时间:',
          clearable: true,
          values: []
        },
        lastConsumeStart: {
          type: 'datetimerangeopentions',
          label: '最后消费时间:',
          clearable: true,
          values: []
        },
        // billTime4: {
        //   type: 'Tdatetime',
        //   label: '最后来院时间:',
        //   clearable: true,
        //   values: []
        // },
        lastReturnVisitStart: {
          type: 'datetimerangeopentions',
          label: '最后回访时间:',
          clearable: true,
          values: []
        },
        // orderNumber: {
        //   type: 'input',
        //   label: '收费单号:'
        // },
        customerName: {
          type: 'input',
          label: '顾客姓名:'
        },
        customPhone: {
          type: 'input',
          label: '顾客电话:'
        },
        customCardNumber: {
          type: 'input',
          label: '顾客卡号:'
        },
        memberCard: {
          type: 'input',
          label: '会员卡号:'
        },
        membershipLevel: {
          type: 'select',
          label: '会员等级:',
          clearable: true,
          options: []
        },
        // billingStatus: {
        //   type: 'select',
        //   label: '会员等级反选:',
        //   clearable: true,
        //   options: []
        // },
        // customState: {
        //   type: 'select',
        //   label: '会员卡状态：',
        //   clearable: true,
        //   options: [
        //     {value:'1',label:'销户'},
        //     {value:'0',label:'正常'},
        //   ]
        // },
        dealFlag: {
          type: 'select',
          label: '是否成交客户:',
          clearable: true,
          options: [
            {value:'1',label:'否'},
            {value:'0',label:'是'},
          ]
        },
        // billingStatus3: {
        //   type: 'select',
        //   label: '是否有效:',
        //   clearable: true,
        //   options: []
        // },
        channel: {
          type: 'Tselect',
          label: '媒介类型/媒介来源:',
          clearable: true,
          options: [],
          values: [],
        },
        customerrepId:{
          type: 'select',
          label: '美学顾问:',
          clearable: true,
          options: []
        },
        memberServiceId: {
          type: 'select',
          label: '会员客服:',
          clearable: true,
          options: []
        },
        // billingStatus7: {
        //   type: 'select',
        //   label: '服务助理:',
        //   clearable: true,
        //   options: []
        // },
        // billingStatus8: {
        //   type: 'select',
        //   label: '会员客服:',
        //   clearable: true,
        //   options: []
        // },
        ageStart: {
          type: 'Tinput',
          label: '年龄:',
          clearable: true,
          values: [],
          options: []
        },
        usablePointsStart: {
          type: 'Tinput',
          label: '可用积分:',
          clearable: true,
          values: [],
          options: []
        },
        // consumeTotal: {
        //   type: 'Tinput',
        //   label: '累计消费金额:',
        //   clearable: true,
        //   values: [],
        //   options: []
        // },
        // billingStatus12: {
        //   type: 'select',
        //   label: '是否绑定客服:',
        //   clearable: true,
        //   options: [
        //     {value:'1',label:'否'},
        //     {value:'0',label:'是'}
        //   ]
        // },
        // billingStatus14: {
        //   type: 'Tinput',
        //   label: '剩余储值总额:',
        //   clearable: true,
        //   values: [],
        //   options: []
        // },
        // billingStatus15: {
        //   type: 'Tinput',
        //   label: '剩余储值卡总额:',
        //   clearable: true,
        //   values: [],
        //   options: []
        // },
        // billingStatus16: {
        //   type: 'select',
        //   label: '一级项目:',
        //   clearable: true,
        //   options: []
        // },
        // billingStatus17: {
        //   type: 'select',
        //   label: '二级项目:',
        //   clearable: true,
        //   options: []
        // },
        // billingStatus18: {
        //   type: 'select',
        //   label: '三级项目:',
        //   clearable: true,
        //   options: []
        // },
        // billingStatus19: {
        //   type: 'input',
        //   label: '项目名称:'
        // },
      },
      arrList:[],
      userLists:{},
      getuserLists:[],
      newgetuserLists:[],
      showDialogS:false,
      formlist:{},
      //会员等级下拉
      levelDescriptionList:[],
      //积分加减
      adjustStateList:[
        {label:'增加',value:'0'},
        {label:'减少',value:'1'},
      ],
      showDialogintegral:false,
      formlistIntegral:{},
      dailogintegralExchange:false,//积分兑换弹窗
      integralExchange:{},//积分兑换列表
      dailogCard:false,
      cardList:{},//领卡
      giftTypeList:[],
      giftList:[],
      dailogNewnumber:false,
      searchList:{},
      Giftredemption:{},
      numId:''
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
      this.getData()
      this.getUserList(this.deptId)
      this.membershipLevelInfoList()
      this.followUpRecordList()
      this.getChannelInfo(this.deptId)
    },
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
    },
  },
  created() {
    // this.options.billType.options = this.dict.type.billing_type
    // this.options.billingStatus.options = this.dict.type.billing_status
    this.getData()
    this.getUserList(this.deptId)
    this.membershipLevelInfoList()
    this.followUpRecordList()
    this.getChannelInfo(this.deptId)
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    rowClassName({row}){
      // if(row.receiveFlag=='1'){
      //   return 'success-row'
      // }
    },
    may(val){
      if (val) {
        this.getuserLists = this.newgetuserLists.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
      } else {
        this.getuserLists = this.newgetuserLists
      }

  },
    //渠道
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
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
    // 选择媒介来源第一级
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      this.channelTypeChildren = data[0].channelInfo
    },
      // 处理客户名称
      handleCustomer(personal) {
          const id = personal.id
          this.$router.push({
              path: 'customerInfo',
              query: {
                  id,
                  status: personal.customerStatus,
                  noDeal: personal.billingStatus
              }
          })
      },
    //获取会员等级列表
    membershipLevelInfoList(){
      const query={
        deptId:this.deptId
      }
      this.$api.modules.bookProject.membershipLevelInfo(query).then(res => {
        if (res) {
          this.levelDescriptionList = res.rows
          res.rows.forEach(item => {
            this.options.membershipLevel.options.push(
                {
                  label:item.levelDescription,
                  value:item.membershipLevel
                }
            )
          })
        }
      })
    },
    //获取礼品类型列表
    followUpRecordList(){
      const query={
        deptId:this.deptId
      }
      this.$api.modules.bookProject.giftTypeInfo(query).then(res => {
        if (res) {
          this.giftTypeList = res.rows
          console.log('礼品：',this.giftTypeList)
        }
      })
    },
    //更具礼品类型查礼品
    getChange(){
      this.integralExchange.giftName=''
      this.giftBasicInfo()

    },
    //获取礼品兑换积分
    getRedeemPoints(e){
      this.giftList.forEach(item=>{
        if (item.giftTypeListId==e){
          this.integralExchange.redeemPoints=item.redeemPoints
        }
      })
      if (this.integralExchange.number!==undefined){
        this.integralExchange.memberCard=this.integralExchange.number*this.integralExchange.redeemPoints
        this.integralExchange.Points=this.integralExchange.pointsTotal-this.integralExchange.memberCard
        if (this.integralExchange.memberCard>this.integralExchange.usablePoints){
          this.$message.warning('变动积分大于初期积分')
        }
      }

    },
    //获取礼品兑换积分
    getRedeemPoints1(e){
      this.giftList.forEach(item=>{
        if (item.giftTypeListId==e){
          this.Giftredemption.redeemPoints=item.redeemPoints
        }
      })
      if (this.Giftredemption.redeemPoints>this.Giftredemption.usablePoints){
        this.$message.warning('所需积分大于可用积分')
      }
    },
    // 礼品类型查礼品1
    getChange1(){
      this.Giftredemption.giftName=''
      const query={
        giftTypeId:this.Giftredemption.giftTypeName
      }
      this.$api.modules.bookProject.giftBasicInfo(query).then(res => {
        if (res) {
          this.giftList = res.rows
        }
      })

    },
    getNumber(e){
      this.integralExchange.memberCard=this.integralExchange.number*this.integralExchange.redeemPoints
      this.integralExchange.Points=this.integralExchange.usablePoints-this.integralExchange.memberCard
      if (this.integralExchange.memberCard>this.integralExchange.usablePoints){
        this.$message.warning('变动积分大于初期积分')
      }
    },
    //获取礼品基本信息列表
    giftBasicInfo(){
      const query={
        giftTypeId:this.integralExchange.giftTypeName
      }
      this.$api.modules.bookProject.giftBasicInfo(query).then(res => {
        if (res) {
          this.giftList = res.rows
        }
      })
    },
    /** 获取用户列表*/
    getUserList(deptId) {
      // 人员添加公司Id  添加状态
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          this.getuserLists= res.data
          this.newgetuserLists=res.data;
          res.data.forEach(item => {
            this.options.memberServiceId.options.push(
                {
                  label:item.nickName,
                  value:item.userId
                }
            )
            if (item.postCode === 'xczxs') {
              this.options.customerrepId.options.push(
                  {
                    label:item.nickName,
                    value:item.userId
                  }
              )
            }
          })
        }
      })
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
      data = Object.assign(data)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billingStatus', '1')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.modules.activityManagement.memberPointsgetMemberList(data).then(res => {
        if (res) {
          this.tableData = res.rows
            console.log(this.tableData,res.rows )
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '会员管理列表')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },
    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    //新客弹窗关闭
    closeNewnumber(){
      this.dailogNewnumber=false
      this.giftList=[]
    },
    submitChangeGigt(val){
      this.$refs.redemption.validate((valid) =>{
        if (valid){
     const query={
        changeAmount: this.Giftredemption.number,   // 变动数量
        changeState: "2",  // 变动类型 0:入库; 1:出库; 2:兑换; 3:退领
        id: val.id,    // 用户主键
        giftName: "",
        giftTypeId:this.Giftredemption.giftTypeName ,
        giftTypeListId: this.Giftredemption.giftName ,
        giftTypeName: "",
        model: "",
        unit: "",
       deptId:this.deptId
      }
      if (this.Giftredemption.redeemPoints>this.Giftredemption.usablePoints){
        this.$message.warning('所需积分大于可用积分')
        return
      }
      this.giftTypeList.forEach(item=>{
        if (this.Giftredemption.giftTypeName==item.giftTypeId){
          query.giftTypeName=item.giftTypeName
        }

      })
      this.giftList.forEach(item=>{
        if (this.Giftredemption.giftName==item.giftTypeListId){
          query.giftName=item.giftName
          query.model = item.model
          query.unit = item.unit
        }

      })
      this.$api.modules.activityManagement.giftIncomingOutgoingInfoa(query).then(res => {
        if (res) {
          this.tableDatas = res.rows
          this.dailogNewnumber=false
          this.getData()
        }
      })
        }
      })
    },
    newNumber(){
      this.tableDatas=[]
      this.dailogNewnumber=true
      this.searchList={
        customerName:'',
        customPhone:'',
        memberCard:''
      }
      this.Giftredemption={
        customerName:'',
        customPhone:'',
        usablePoints:"",
        giftTypeName:'',
        giftName:'',
        redeemPoints:'',
        number:''
      }
    },
    //等级调整
    Gradeadjustment(){
      if (this.selectionData.length > 1) {
        this.$message.warning('您不能选择多个会员!')
        return
      }
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名会员!')
        return
      }
      this.formlist={
        customerName:this.selectionData[0].customerName,
        levelDescription:this.selectionData[0].levelDescription,
        memberCard:this.selectionData[0].memberCard,
        pointsTotal:this.selectionData[0].pointsTotal,
        remarks:this.selectionData[0].remarks,
        usablePoints:this.selectionData[0].usablePoints,

      }
      this.showDialogS = true
    },
    //弹窗关闭
    showdialogT(){
      this.showDialogS = false
    },
    //积分调整
    Integral(){
      if (this.selectionData.length > 1) {
        this.$message.warning('您不能选择多个会员!')
        return
      }
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一位会员!')
        return
      }
      this.formlistIntegral={
        customerName:this.selectionData[0].customerName,
        levelDescription:this.selectionData[0].levelDescription,
        memberCard:this.selectionData[0].memberCard,
        pointsTotal:this.selectionData[0].pointsTotal,
        remarks:this.selectionData[0].remarks,
        usablePoints:this.selectionData[0].usablePoints,

      }
      this.showDialogintegral = true
    },
    closeIntegral(){
      this.showDialogintegral = false
    },

    //积分兑换
    clicklExchange(){
      if (this.selectionData.length<1||this.selectionData.length>1){
        this.$message.warning('请选择一位会员')
        return
      }
      this.dailogintegralExchange=true
      this.giftList=[]
      this.integralExchange={
        customerName:this.selectionData[0].customerName,
        pointsTotal:this.selectionData[0].pointsTotal ,
        giftTypeName:this.selectionData[0].giftTypeName,
        giftName:this.selectionData[0].giftName,
        usablePoints:this.selectionData[0].usablePoints,
        exchangeTime:timeFmt('YYYY-mm-dd HH:MM:SS',new Date())
      }
    },
    //积分调整弹窗关闭
    showdialogIntegral(){
      this.showDialogintegral = false
    },
    //积分兑换弹窗关闭
    integralExchanges(){
      this.dailogintegralExchange = false
    },
    //领卡按钮
    clickCard(){
      if (this.selectionData.length<1||this.selectionData.length>1){
        this.$message.warning('请先选择一名会员')
        return
      }
      if (this.selectionData[0].receiveFlag == 1){
        this.$message.warning('该会员已领取')
        return
      }
      this.dailogCard=true
      this.cardList={
        customerName:this.selectionData[0].customerName,
        levelDescription:this.selectionData[0].levelDescription,
        membershipLevel:this.selectionData[0].membershipLevel,
        memberCard:this.selectionData[0].memberCard
      }
    },
    //领卡关闭
    closeCard(){
      this.dailogCard=false
    },
    //领卡保存
    submitCard(){
      this.$refs.cardList.validate((valid) => {
        if (valid) {
          const query={
            customerName:this.cardList.customerName,
            levelDescription:this.cardList.levelDescription,
            memberCard:this.cardList.memberCard,
            memberPointsId:this.selectionData[0].memberPointsId,
            receiveFlag:this.selectionData[0].receiveFlag==0?1:0,
            receiveTime:timeFmt('YYYY-mm-dd HH:MM:SS',new Date()),
            membershipLevel:this.cardList.membershipLevel
          }
          this.$api.modules.activityManagement.memberPointsCard(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.dailogCard=false
              this.getData()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

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
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.arrList=[]
      this.selectionData =e[1]
      this.selectionData.forEach(item=>{
        this.arrList.push(item.id)
        this.hehe=this.arrList
      })

    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },

    // 收款结账
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
    },
    // >绑定批量客服
    repulse() {
      if (this.selectionData.length < 1||this.selectionData.length>1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.selectionData.forEach(item=>{
        if (item.memberServiceName!=undefined){
          this.$message.warning('选择的当中已经有绑定客服的')
          this.dialogVisible = false
        }else if (item.memberServiceName==undefined){
          this.dialogVisible = true
        }
      })
    },
    //绑定客服确定
    repulseReceipt() {
      this.$refs.receipt.validate(valid => {
        if (valid) {
          const query={
            ids:this.hehe.toString(),
            memberServiceId:this.userLists.userName,
            memberServiceName:''
          }
          this.getuserLists.forEach(item=>{
            if (item.userId==this.userLists.userName){
              query.memberServiceName=item.nickName
            }
          })
          this.submitLoading = true
          this.$api.modules.activityManagement.batchBindCustomer(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.submitLoading = false
              this.getData()
            }
          })
        }
      })
    },
    //等级调整保存
    submit(){
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          const query={
            customerName:this.formlist.customerName,
            levelDescription:'',
            membershipLevel:this.formlist.levelDescription,
            memberCard:this.formlist.memberCard,
            pointsTotal:this.formlist.pointsTotal,
            usablePoints:this.formlist.usablePoints,
            remarks:this.formlist.remarks,
            memberPointsId:this.selectionData[0].memberPointsId,
            id: this.selectionData[0].id
          }
          this.levelDescriptionList.forEach(item=>{
            console.log(item,'itemitem')
            if (item.membershipLevel==this.formlist.levelDescription){
              query.levelDescription=item.levelDescription
            }
          })
          this.$api.modules.activityManagement.lmemberPoints(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogS=false
              this.getData()
            }
          })
          // 新增会员记录
          const query1={
            memberPointsId:this.selectionData[0].memberPointsId,
            memberCard: this.selectionData[0].memberCard,
            customCardNumber: this.selectionData[0].customCardNumber,
            customPhone: this.selectionData[0].customPhone,
            customerName:this.selectionData[0].customerName,
            id:this.selectionData[0].id,
            aestheticConsultant:this.selectionData[0].aestheticConsultant,
            aestheticConsultantName:this.selectionData[0].aestheticConsultantName,
            onlineUserId:this.selectionData[0].memberServiceId ,              //会员客服主键
            onlineUserName:this.selectionData[0].memberServiceName    ,         //会员客服姓名
            upgradeAfterId:this.formlist.levelDescription,
            upgradeAfterName:'',
            upgradeTime:this.selectionData[0].upgradeTime,                 //升级时间
            upgradeBeforeId:this.selectionData[0].membershipLevel,            //升级前会员卡主键
            upgradeBeforeName  :this.selectionData[0].levelDescription  ,     // 升级前会员卡名称
            usablePoints  :this.selectionData[0].usablePoints,              //可用积分
          }
          this.levelDescriptionList.forEach(item=>{
            if (item.membershipLevel==this.formlist.levelDescription){
              query1.upgradeAfterName=item.levelDescription
            }
          })
          this.$api.modules.activityManagement.memberUpgradeAdd(query1).then(res => {
            if (res) {
              // this.$message.success(res.msg)
              this.showDialogS=false
              this.getData()
            }
          })
        } else {
          return false;
        }
      });

    },
    //等级调整关闭
    close(){
      this.showDialogS = false
    },
    //积分调整保存
    submitIntegral(){
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          const query={
            customerName:this.formlistIntegral.customerName,
            customPhone:this.formlistIntegral.customPhone,
            levelDescription:this.formlistIntegral.levelDescription,
            memberCard:this.formlistIntegral.memberCard,
            pointsTotal:this.formlistIntegral.pointsTotal,
            usablePoints:this.formlistIntegral.usablePoints,
            remarks:this.formlistIntegral.adjustState==1? '积分调整减扣积分' : '积分调整增加积分',
            memberPointsId:this.selectionData[0].memberPointsId,
            // 积分加减
            adjustState:this.formlistIntegral.adjustState,
            // 积分
            pointsAdjust:this.formlistIntegral.adjustState==1?-this.formlistIntegral.pointsAdjust:this.formlistIntegral.pointsAdjust,
            delFlag: "0",
            deptId: this.deptId,
            id: this.selectionData[0].id,
          }
          if (this.formlistIntegral.adjustState==1 && this.formlistIntegral.pointsAdjust>this.formlistIntegral.usablePoints){
            this.$message.warning('减扣积分大于可用积分')
            return
          }
          this.levelDescriptionList.forEach(item=>{
            if (item.membershipLevel==this.formlist.levelDescription){
              query.levelDescription=item.levelDescription
            }
          })
          this.$api.modules.activityManagement.memberPointsInfo(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialogintegral=false
              this.getData()
            }
          })
        }
      })
    },
    //积分兑换保存
    submitChange(){

      this.$refs.formlistExchange.validate((valid)=>{
        if (valid){
          if(this.integralExchange.Points<0){
            this.$message.warning('期末积分小于0,不能兑换礼品');
            return
          }
          const query={
            changeAmount: this.integralExchange.number,   // 变动数量
            changeState: "2",  // 变动类型 0:入库; 1:出库; 2:兑换; 3:退领
            id: this.selectionData[0].id,    // 用户主键
            giftName: "",
            giftTypeId:this.integralExchange.giftTypeName ,
            giftTypeListId: this.integralExchange.giftName ,
            giftTypeName: "",
            model: "",
            remarks: this.integralExchange.remarks,
            unit: "",
            deptId:this.deptId
          }
          if (this.integralExchange.memberCard>this.integralExchange.pointsTotal){
            this.$message.warning('变动积分大于初期积分')
            return
          }
          this.giftTypeList.forEach(item=>{
            if (this.integralExchange.giftTypeName==item.giftTypeId){
              query.giftTypeName=item.giftTypeName
            }

          })
          this.giftList.forEach(item=>{
            if (this.integralExchange.giftName==item.giftTypeListId){
              query.giftName=item.giftName
              query.model = item.model
              query.unit = item.unit
            }

          })
          this.$api.modules.activityManagement.giftIncomingOutgoingInfoa(query).then(res => {
            if (res) {
              this.tableDatas = res.rows
              this.dailogintegralExchange=false
              this.getData()
            }
          })
        }
      })
    },
    //搜索
    searchNumber(){
      const query={
        deptId:this.deptId,
        customerName:this.searchList.customerName,
        customPhone:this.searchList.customPhone,
        memberCard:this.searchList.memberCard
      }
      this.$api.modules.activityManagement.memberPointsgetMemberList(query).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      })
    },
    exchangeGift(val){
      this.numId=val.id
      this.Giftredemption={
        customerName:val[0].customerName,
        customPhone:val[0].customPhone,
        usablePoints:val[0].usablePoints,
        redeemPoints:val[0].redeemPoints,
        number:val[0].number,
        id:val[0].id
      }
    },
    customer(personal, val) {
      const id = personal.id
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus }})
    },
    /**
     * @author 李尚
     * @date 17/5/2022
     * @Description: 搜索
     */
    async getData(isSearch) {
      var data = {}
      for (const k in this.options) {
        if (( this.options[k].type === 'Tinput' ) && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data[ k.slice(0,-5) + 'End' ] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else  if (this.options[k].type === 'Tdatetime1') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data[ k.slice(0,-5) + 'End'] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data[k.slice(0,-5) + 'End'] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data[k.slice(0,-5) + 'End'] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data[k.slice(0,-5) + 'End'] = null
          }
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
      this.$set(data, 'billingStatus', '1')
      this.showDataDialog = true

      if(data.endregisterStart){
        data.registerEnd=data.endregisterStart;
        delete  data.endregisterStart
      }
      if(data.endreceiveStart){
        data.receiveEnd=data.endreceiveStart;
        delete  data.endreceiveStart
      }
      if(data.endlastConsumeStart){
        data.lastConsumeEnd=data.endlastConsumeStart
        delete data.endlastConsumeStart
      }
      if(data.endlastReturnVisitStart){
        data.lastReturnVisitEnd=data.endlastReturnVisitStart
        delete  data.endlastReturnVisitStart
      }
      // if()

      await this.$api.modules.activityManagement.memberPointsgetMemberList(data).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 弹框关闭
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .success-row{
  background: #c6f9c3;
}
a{
  color: #7b95ef;
}
.container {
  width: 100%;
  height: 100%;
}
::v-deep .el-dialog__header{
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
  color: #999;
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
.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 40px 20px 20px 20px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;

  .title {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}
</style>
<style>

.el-input__prefix{
  display: none;
}
</style>
