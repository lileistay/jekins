<template>
  <!-- 收费单药品查询 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="auxiliaryBillListData(true)">查询</el-button>
        <el-button
          size="mini"
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['confinement:warehouseManagement:exportsearch']"

          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table ref="table" id="out-table" :sg-ref="'multipleTable'" :expand-row-keys="expands" :pagination="pagination" size="mini"
          selection border index="序号" highlight-current-row :table-data="tableData" :columns="columns"
          :row-class-name="rowClassName" default-expand-all :row-key="setRowkey" @size-change="sizeChange"
          @current-change="change" @row-click="rowClick" @selection-change="handleSelectionChange">
          <div slot="searchBar" class="header-float">
            <div>
              <span><i class="el-icon-s-data" style="color: #5f94de" />统计信息</span>
              <span><i style="background-color:#c6f9c3" />已领药</span>
              <span><i style="background-color:#ffff00" />已领完</span>
              <span><i style="background-color:#f56c6c" />已退款</span>
            </div>
            <div>
              <el-button size="mini" plain type="success" icon="el-icon-plus" @click="collar">领药</el-button>
              <el-button size="mini" plain type="success" icon="el-icon-plus" @click="retreat">退药</el-button>
              <el-button size="mini" plain type="primary" icon="el-icon-plus" @click="printMethods(null)">
                批量打印药品清单
              </el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customerName'">
              <a @click="customer(data.custom,data.custom)" style="color: blue;font-weight:bolder">
                {{ data.custom.customerName }}
              </a>
            </div>
            <div v-else-if="data.props === 'orderNumber'">
              <a style="color: blue;font-weight:bolder;cursor: pointer;" @click="orderNumber(data.custom)" >
                {{ data.custom.orderNumber }}
              </a>
            </div>
            <div v-else-if="data.props === 'billType'">
              <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
            </div>
            <div v-else-if="data.props === 'isRefund'">
              <div v-if="data.custom.isRefund == 0">否</div>
              <div v-if="data.custom.isRefund == 1">是</div>
            </div>
            <div v-else-if="data.props === 'operation'" >
              <el-button type="text" size="mini" @click.stop.native="detailDialogOpen(data.custom)" style="color: blue;font-weight:bolder">详情</el-button>
              <el-button type="text" size="mini" @click.stop.native="printMethods(data.custom)" style="color: blue;font-weight:bolder">打印</el-button>
            </div>
          </template>
          <template #expands="data">
            <span style="font-size: 14px;padding: 0 10px">
              <a style="color: #5a5e66;  padding-left: 8.5%">物资：</a><a style="color: #5f94de;cursor: pointer">
                {{ getMaterials(data.expands.detail) }}
              </a>
            </span>
          </template>
        </sg-table>
      </slot>
    </SlideSearch>
    <!--详情弹框-->
    <sg-dialog title="详情" size="1200px" :dialog="detailDialog" @handleClose="detailDialog=false">
      <div slot="out">
        <div class="formBody">
          <!--<div class="title">详情</div>-->
          <el-row>
            <el-col :span="3">姓名：{{ detailRow.customerName }}</el-col>
            <el-col :span="4">电话：{{ detailRow.customPhone }}</el-col>
            <el-col :span="7">收费单号：{{ detailRow.orderNumber }}</el-col>
            <el-col :span="5">
              <template v-for="item in dict.type.billing_type">
                <span v-if="item.value===detailRow.billType" :key="item.value">收费单类型：{{ item.label }}</span>
              </template>
            </el-col>
            <el-col :span="4">科室：{{ detailRow.departmentName }}</el-col>
          </el-row>
        </div>
        <div class="formBody">
          <div class="title">物资清单</div>
          <el-table :border="true" size="mini" :data="detailRow.detail">
            <el-table-column label="项目名称" prop="projectName" width="150" />
            <el-table-column label="物资名称" prop="materialName" width="150" />
            <el-table-column label="是否退款" prop="isRefund" width="100">
              <template #default="scope">
                <span>{{ scope.row.isRefund === '0'?'否' :'是' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存数量" prop="stock" />
            <el-table-column label="单位" prop="priceUnit" />
            <el-table-column label="规格" prop="specs" />
            <el-table-column label="总购买数量" prop="totalQuantity" />
            <el-table-column label="已领取数量" prop="receivedQuantity" />
            <el-table-column label="退回数量" prop="returnQuantity" />
            <el-table-column label="待领取数量" prop="surplusQuantity" />
          </el-table>
        </div>
        <div class="formBody">
          <div class="title">领/退药记录</div>
          <el-table :border="true" :data="detailRow.inAndOutRecord" size="mini">
            <el-table-column label="项目名称" prop="projectName" width="150" />
            <el-table-column label="物资名称" prop="materialName" />
            <el-table-column label="类型" prop="" width="80">
              <template #default="scope">
                <template v-for="item in dict.type.document_type">
                  <span v-if="item.value===scope.row.documentType" :key="item.value">{{ item.label }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="领/退时间" prop="createTime" width="150" />
            <el-table-column label="领/退药人" prop="receiveAndReturner" />
            <el-table-column label="数量" prop="number" width="80" />
            <el-table-column label="单号" prop="documentNo" width="180" />
            <el-table-column label="库房" prop="whouseName" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="printDetail(scope.row)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </sg-dialog>
    <!--领药-->
    <sgDialog :title="receiveTitle" size="1550px" :dialog="showDialog" @handleClose="showdialog">
      <div slot="out">
        <div class="formBody">
          <div class="title">收费单</div>
          <el-form
            ref="formlist"
            :inline="true"
            :rules="rules"
            :model="getMedicine"
            size="mini"
            class="demo-form-inline"
          >
            <el-form-item label="姓名：">
              <el-input v-model="getMedicine.customerName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="getMedicine.customPhone" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="收费单号：">
              <el-input v-model="getMedicine.orderNumber" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="咨询师：">
              <el-input v-model="getMedicine.acName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="领取人：" prop="outPerson">
              <el-select v-model="getMedicine.outPerson" placeholder="请选择领取人" size="mini">
                <el-option
                  v-for="item in optionsoutPerson"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
<!--              <el-input v-model="getMedicine.outPerson" style="width: 140px;" />-->
            </el-form-item>
            <el-form-item label="库房：" prop="whouseId">
              <el-select v-model="getMedicine.whouseId" filterable style="width: 100%" @change="getMedicineSelect">
                <el-option
                  v-for="item in storehouseList"
                  :key="item.whouseId"
                  :label="item.whouseName"
                  :value="item.whouseId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="title">药品清单</div>
          <el-table
            height="238px"
            :data="collarList"
            size="mini"
            border
            style="width: 100%"
            @row-click="DataListDetail"
          >
            <el-table-column prop="projectName" label="项目名称" fixed />
            <el-table-column label="物资名称" prop="materialName" />
            <el-table-column prop="isRefund" label="是否退款" width="80" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isRefund == '0'">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="priceUnit" label="单位" width="100" align="center" />
            <el-table-column prop="materialSpec" label="规格" width="250" align="center" />
            <el-table-column prop="discountAmount" label="价格" width="100" align="center" />
            <el-table-column prop="totalQuantity" label="总购买数量" width="100" align="center" />
            <el-table-column prop="receivedQuantity" label="已领取数量" width="100" align="center" />
            <el-table-column prop="returnQuantity" label="退回数量" width="100" align="center" />
            <el-table-column prop="surplusQuantity" label="待领取数量" width="100" align="center" />
          </el-table>
          <!--详情-->
          <el-table
            :data="collarListDetail"
            size="mini"
            height="238px"
            border
            :header-cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
            :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
            style="margin-top: 10px"
          >
            <el-table-column prop="inBatchNumber" label="入库批次号" width="130" />
            <el-table-column prop="productionBatch" label="生产批次号" width="130" />
            <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true" />
            <el-table-column prop="materialName" label="物资名称" :show-overflow-tooltip="true" />
            <el-table-column prop="startTime" label="开始有效期" :show-overflow-tooltip="true" />
            <el-table-column prop="endTime" label="结束有效期" :show-overflow-tooltip="true" />
            <el-table-column prop="materialSpec" label="规格	" :show-overflow-tooltip="true" width="60" />
            <el-table-column prop="unitName" label="单位	" :show-overflow-tooltip="true" width="60" />
            <el-table-column prop="materialPrice" label="物资价格" width="80" />
            <el-table-column prop="insertNumber" label="入库数量" />
            <el-table-column prop="availableNumber" label="可用数量" />
            <el-table-column prop="whouseName" label="库房" />
            <el-table-column prop="place" label="产地" width="80" />
            <el-table-column prop="outNumber" label="领取数量">
              <template slot-scope="scope">
                <div>
                  <el-input
                    v-model.number="scope.row.outNumber"
                    size="mini"
                    class="moneyInput"
                    placeholder="请输入数量"
                    @input="getinput(scope.row)"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" @click="delReceiveRow(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-folder-checked"
              :loading="submitLoding"
              @click="outDrugList(collarListDetail)"
            >保存
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <!--退药-->
    <sgDialog :title="drugTitle" size="1550px" :dialog="notshowDialog" @handleClose="notshowdialog">
      <div slot="out">
        <div class="formBody">
          <div class="title">收费单</div>
          <el-form :inline="true" :model="returnMedicine" size="mini" class="demo-form-inline">
            <el-form-item label="姓名：">
              <el-input v-model="returnMedicine.customerName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="returnMedicine.customPhone" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="收费单号：">
              <el-input v-model="returnMedicine.orderNumber" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="咨询师：">
              <el-input v-model="returnMedicine.acName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="退药人：">
              <el-input v-model="returnMedicine.drugReturner" style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="title">药品清单</div>
          <el-table :data="collarListDrug" height="338px" size="mini" border style="width: 100%">
            <el-table-column prop="projectName" label="项目名称" fixed />
            <el-table-column prop="materialName" label="药品名称" fixed />
            <el-table-column prop="productionBatch" label="生产批次" />
            <el-table-column prop="priceUnit" label="单位" />
            <el-table-column prop="materialSpec" label="规格" />
            <el-table-column prop="outDocumentNo" label="出库单号" />
            <el-table-column prop="receivedQuantity" label="已领取数量" />
            <el-table-column prop="insertNumber" label="退药数量">
              <template slot-scope="scope">
                <div>
                  <el-input
                    v-model="scope.row.insertNumber"
                    size="mini"
                    class="moneyInput"
                    placeholder="请输入数量"
                    @input="getinputDrup"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-folder-checked"
              :loading="submitLoding1"
              @click="drugSubmit(collarListDrug)"
            >保存
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-close" @click="drugclose">关闭</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <!-- 列表数据打印   -->
    <vue-easy-print ref="printChargeSheet">
      <div v-for="(item,index) in printList" :key="index" >
        <div style="width: 100%;height: 98%;"  v-for="newitem in item.codeArr">
          <div style="width: 100%;height: 30px;font-size: 20px;font-weight: 700;text-align: center;margin-top: 20px">收费单药品清单</div>
          <span style="margin-left: 50px;">客户：{{ item.customerName }}({{ item.customPhone }})</span>
          <span style="margin-left: 50px;">收费单号：{{ item.orderNumber }}  ({{ item.label }}/{{ item.Name }})</span>
                    <table border style="border-collapse: collapse;margin-top: 10px;font-size: 12px">
                      <th style="width: 150px;color:#999;">项目名称</th>
                      <th style="width: 150px;color:#999;">药品名称</th>
                      <th style="width: 60px;color:#999;">单位</th>
                      <th style="width: 150px;color:#999;">规格</th>
                      <th style="width: 90px;color:#999;">总购买数量</th>
                      <th style="width:90px;color:#999;">已领取数量</th>
                      <th style="width: 90px;color:#999;">待领取数量</th>
                      <tr v-for="(newitem,index) in newitem" :key="index" align="center">
                        <td>{{ newitem.projectName }}</td>
                        <td>{{ newitem.materialName }}</td>
                        <td>{{ newitem.priceUnit }}</td>
                        <td>{{ newitem.specs }}</td>
                        <td>{{ newitem.totalQuantity }}</td>
                        <td>{{ newitem.receivedQuantity }}</td>
                        <td>{{ newitem.surplusQuantity }}</td>
                      </tr>
                    </table>
          <div style="display: flex;align-items: center;justify-content: space-between">
            <span style="margin-left: 20px">领药人：</span>
            <span style="margin-left: 100px;">打印时间：{{ printTime }}</span>
          </div>

        </div>
      </div>

<!--      <div v-for="(item,index) in printList" :key="index" style="width: 100%;height: 480px;position: relative;">-->
<!--        <div style="width: 100%;height: 30px;font-size: 20px;font-weight: 700;text-align: center;">收费单药品清单</div>-->
<!--        <div style="width: 100%;height: 13.5px;margin-top: 10px;">-->
<!--          <span style="margin-left: 50px;">客户：{{ item.customerName }}({{ item.customPhone }})</span>-->
<!--          <span style="margin-left: 50px;">收费单号：{{ item.orderNumber }}  ({{ item.label }}/{{ item.Name }})</span>-->
<!--          <table border style="border-collapse: collapse;margin-top: 10px;">-->
<!--            <th style="width: 150px;color:#999;">项目名称</th>-->
<!--            <th style="width: 150px;color:#999;">药品名称</th>-->
<!--            <th style="width: 60px;color:#999;">单位</th>-->
<!--            <th style="width: 70px;color:#999;">规格</th>-->
<!--            <th style="width: 90px;color:#999;">总购买数量</th>-->
<!--            <th style="width:90px;color:#999;">已领取数量</th>-->
<!--            <th style="width: 90px;color:#999;">待领取数量</th>-->
<!--            <tr v-for="(newitem,index) in item.detail" :key="index" align="center">-->
<!--              <td>{{ newitem.projectName }}</td>-->
<!--              <td>{{ newitem.materialName }}</td>-->
<!--              <td>{{ newitem.priceUnit }}</td>-->
<!--              <td>{{ newitem.specs }}</td>-->
<!--              <td>{{ newitem.totalQuantity }}</td>-->
<!--              <td>{{ newitem.receivedQuantity }}</td>-->
<!--              <td>{{ newitem.surplusQuantity }}</td>-->
<!--            </tr>-->
<!--          </table>-->
<!--        </div>-->
<!--        <div-->
<!--          style="position: absolute;bottom: 0;width: 100%;height: 13.5px;font-size: 13.5px;border: 1px solid transparent;"-->
<!--        >-->
<!--          <span>领药人：</span>-->
<!--          <span style="margin-left: 300px;">打印时间：{{ printTime }}</span>-->

<!--        </div>-->
<!--      </div>-->
    </vue-easy-print>
    <!-- 详情打印-->
    <vue-easy-print ref="receiveDetail">
      <detail :print="printDetails" :details="printDetailList" />
    </vue-easy-print>
    <!-- 详情打印-->
    <vue-easy-print ref="returnDetail">
      <return-details :print="printDetails" :details="printDetailList" />
    </vue-easy-print>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import { math } from '@/utils/math'
import { beforeDayTime, todayTime } from '@/utils/time'
import vueEasyPrint from 'vue-easy-print'
import moment from 'moment'
import Detail from '@/components/Print/detail'
import ReturnDetails from '@/components/Print/returnDetail.vue'

export default {
  dicts: ['billing_type', 'document_type'],
  components: {
    ReturnDetails,
    slideSearch,
    SgTable,
    sgDialog,
    vueEasyPrint,
    Detail
  },
  data() {
    return {
      submitLoding1:false,
      submitLoding:false,
      optionsoutPerson:[],
      printValue: [],
      printList: [],
      printDetails: {},
      printDetailList: [],
      printTime: '',
      print: {},
      total: '',
      outNumber: 0,
      insertNumber: 0,
      expands: [],
      storehouseList: [],
      storehouse: [],
      tableData: [],
      selectionData: [], // 选择的数据
      detailDialog: false, // 详情弹窗
      detailRow: {}, // 详情弹框里显示的列
      columns: [
        {
          lab: '',
          val: 'print',
          expands: {}
        },
        {
          lab: '收费单编号',
          width: 165,
          val: 'orderNumber',
          custom: 'orderNumber'
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 150
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 150
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },

        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType'
        },
        {
          lab: '是否退款',
          val: 'isRefund',
          custom: 'isRefund'
        },
        {
          lab: '科室',
          val: 'departmentName',
          width: 150
        },
        {
          lab: '药品清单',
          val: '',
          custom: 'operation',
          width: 150
        }
      ],
      options: {
        orderNumber: {
          type: 'input',
          label: '收费单号：'
        },
        customerName: {
          type: 'input',
          label: '客户姓名：'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号：',
          clearable: true,
          options: []
        },
        customPhone: {
          type: 'input',
          label: '电话：'
        },

        isDraw: {
          type: 'select',
          label: '是否领药',
          clearable: true,
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }]
        },
        isRefund: {
          type: 'select',
          label: '是否退款：',
          clearable: true,
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        departmentId: {
          type: 'select',
          label: '科室：',
          clearable: true,
          options: []
        },
        checkoutTime: {
          type: 'Tdatetime',
          label: '结账时间',
          clearable: true,
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        }
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 领药
      receiveTitle: '领药信息',
      // 退药
      drugTitle: '退药信息',
      showDialog: false, // 关闭
      notshowDialog: false,
      getMedicine: {
        customerName: null,
        user: null,
        ophen: null,
        orderNumber: null,
        acName: null,
        whouseId: null
      },
      params: {
        orderNumber: null
      },
      returnMedicine: {
        customerName: null,
        user: '',
        ophen: '',
        orderNumber: '',
        acName: '',
        region: '',
        drugReturner: ''
      },
      collarList: [],
      collarListDrug: [],
      outListList: [],
      insertList: [], // 退药的数组参数
      outInv: {
        materId: '',
        whouseId: '',
        outNumber: '',
        outPerson: '',
        outChargeNo: '',
        waitId: ''
      },
      list: {},
      rules: {
        whouseId: [
          { required: true, message: '请输入库房名称', trigger: 'change' }
        ],
        outPerson: [
          { required: true, message: '请输入领取人', trigger: 'change' }
        ]
      },
      collarListDetail: [],
      ListDetail: {},
      hehe: null,
      computeNum: 0, // 领取的数量和
      computeNum1: 0,
      listDetails: []

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
    },
    userId: {
      get() {
        return this.$store.getters.user.userId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.auxiliaryBillListData()
      this.getInvData()
      this.Department()
    }
  },
  created() {

    this.auxiliaryBillListData()
    this.getInvData()
    this.Department()
    this.getlistTyppe();

  },
  methods: {
    getlistTyppe(){
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        console.log(res,'sadgasd')
        res.data.forEach(item => {
          item.label = item.nickName
          item.value = item.userId
        })
        this.optionsoutPerson=this.newUnique(res.data)
      })
    },
    newUnique(arr){
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    getMaterials(val) {
      let materials = ''
      if (val) {
        val.forEach(item => {
          materials = materials + item.materialName + ';'
        })
      }
      return materials
    },
    Export(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      const query = {
        deptId: this.$store.getters.departmentId,
      }
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
      data = Object.assign(data, query)
      this.$api.finance.wfBillList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '收费单药品查询')
        // setInterval(() => {
        //   this.submitLoadings = false
        // }, 5000)
      })
    },
    getNowDate() {
      var date = new Date()
      var sign2 = ':'
      var year = date.getFullYear() // 年
      var month = date.getMonth() + 1 // 月
      var day = date.getDate() // 日
      var hour = date.getHours() // 时
      var minutes = date.getMinutes() // 分
      var seconds = date.getSeconds() // 秒
      var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      var week = weekArr[date.getDay()]
      // 给一位数的数据前面加 “0”
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 0 && day <= 9) {
        day = '0' + day
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds
      }
      return year + '-' + month + '-' + day + ' ' + hour + sign2 + minutes + sign2 + seconds
    },
    // 详情点击打开弹窗
    detailDialogOpen(val) {
      this.detailRow = val
      this.$api.storageRoom.receiveAndReturnRecord(val.orderNumber).then(res => {
        this.detailRow.inAndOutRecord = res.data
        this.detailDialog = true
      })
      // console.log(this.detailRow)
    },
    // 详情弹窗关闭
    detailDialogClose() {
      this.detailRow = {}
      this.detailDialog = false
    },
    printMethods(row) {
      this.printTime = this.getNowDate()
      // 判断是打印一条还是批量打印
      if (row) {
        this.printList = [row]
      } else {
        this.printList = this.selectionData
      }
      if (this.printList.length === 0) {
        this.$message.warning('请至少选择一条打印数据')
        return
      }

      let that=this;
      setTimeout(function (){
        console.log(that.printList,'dsadahsdhasd')
        that.$refs.printChargeSheet.print()
      },100)
    },
    printDetail(data) {
      if (data.outId !== undefined) {
        this.$api.storageRoom.receiveDetail(data.outId).then(res => {
          this.printDetailList = []
          this.printDetails = res.data
          this.printDetailList.push(res.data)
          this.$nextTick(() => {
            this.$refs.receiveDetail.print()
          })
        })
      } else if (data.insertId !== undefined) {
        this.$api.storageRoom.returnDetail(data.insertId).then(res => {
          this.printDetailList = []
          this.printDetails = res.data
          this.printDetailList.push(res.data)
          this.$nextTick(() => {
            this.$refs.returnDetail.print()
          })
        })
      }
    },
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {}
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj !== 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      // 引用类型
      // 数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i]
          if (typeof new_obj[i] === 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { // 对象
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] === 'object') {
              new_obj[key] = this.deepClone(obj[key])
            } else { // 对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj
    },
    setRowkey(row) {
      return row.orderNumber
    },
    auxiliaryBillListData(isSearch) {
      const query = {
        deptId: this.$store.getters.departmentId
      }
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
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, query, this.pagination)
      this.$api.finance.wfBillList(data).then(res => {
        if (res) {

          res.rows.forEach(value => {
            this.dict.type.billing_type.forEach(newvalue => {
              if (value.billType === newvalue.value) {
                value.label = newvalue.label
                value.Name = value.departmentName
              }
            })
            value.codeArr=[];
            let num=Math.ceil(value.detail.length/8);
            for(let i=0;i<num;i++){
              value.codeArr.push(value.detail.slice(i*8,i*8+8))
            }
          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 获取科室的列表
    Department() {
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
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.departmentName
            item.value = item.departmentId
          })
          this.options.departmentId.options = res.rows
        }
      })
    },
    // 领药按钮
    collar() {
      this.collarListDetail = []
      if (this.selectionData.length > 1 || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      } else {
        this.getMedicine = this.selectionData[0]
        // this.getMedicine.whouseId=this.storehouseList[0].whouseId
        this.drugList()
      }
      this.showDialog = true
    },
    getMedicineSelect(val) {
      this.hehe = this.getMedicine.whouseId
    },
    // 获取库房书库
    getInvData() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      this.$api.storageRoom.selectOutWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          this.storehouseList = res.data
        }
      })
    },
    // 领药药品清单
    async drugList() {
      this.params.orderNumber = this.getMedicine.orderNumber
      await this.$api.finance.drugList(this.params).then(res => {
        if (res) {
          this.collarList = res.rows
        }
      })
    },
    DataListDetail(row) {
      this.ListDetail = row
      if (this.getMedicine.whouseId == null) {
        this.$message.error('请先选择库房')
      } else {
        // 入库详情
        const query = {
          materId: row.materId,
          whouseId: this.getMedicine.whouseId
        }
        this.$api.storageRoom.medicationMaterialQuery(query).then(res => {
          if (res) {
            console.log(res.rows)
            if (res.rows.length === 0) {
              this.$message.error('此库房没有对应产品 请更换库房')
              return
            }
            this.listDetails = []
            this.listDetails.push(...res.rows)
            this.listDetails.forEach(a => {
              a.waitId = row.waitId
              // 添加领取表
              a.omrId = row.omrId
              a.projectName = row.projectName
              a.surplusQuantity = row.surplusQuantity
              this.collarListDetail.push(a)
            })
          }
          this.collarListDetail = this.unique(this.collarListDetail)
        })
      }
    },
    // 删除
    delReceiveRow(row, index) {
      this.$nextTick(() => {
        this.collarListDetail.splice(index, 1)
      })
    },
    //  去重
    unique(arr) {
      const res = new Map()
      // 通过入库单和ormId去重
      return arr.filter((item) => !res.has(item.omrId) && res.set(item.omrId, 1))
    },
    // 退药药品清单
    async outList() {
      const query = {
        outChargeNo: this.selectionData[0].orderNumber
      }
      await this.$api.finance.drugListMedic(query).then(res => {
        if (res) {
          this.collarListDrug = res.data
        }
      })
    },
    // 领药保存
    outDrugList(row) {
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          this.outListList = []
          this.collarListDetail = row
          this.collarListDetail.forEach((collarList, index) => {
            if (collarList.outNumber > 0) {
              this.outListList.push({
                materId: collarList.materId,
                insertId: collarList.insertId,
                whouseId: collarList.whouseId,
                waitId: collarList.waitId,
                omrId: collarList.omrId,
                receiveType: 0,
                outChargeNo: this.selectionData[0].orderNumber,
                outNumber: collarList.outNumber,
                id:this.selectionData[0].id,
                // 领药人
                drugRecipient: this.getMedicine.outPerson,
                deptId:this.deptId,
                assist:collarList.assist
              })
            }
          })
          // const outInfo = {
          //   executePerson: this.$store.getters.user.userName, // 执行人
          //   status: 1, // 单据状态
          //   executeDate: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()), // 执行日期
          //   whouseId: this.selectionData[0].whouseId// 库房
          // }
          // console.log(this.outListList,outInfo,'this.outListList[[[')
          // return
         this.submitLoding=true
          this.$api.storageRoom.outDrugListOutmedicinewarehouse({ 'outListList': this.outListList }
          ).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.submitLoding=false
              this.showDialog = false
              this.auxiliaryBillListData()
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    customer(personal, val) {
      const id = personal.id
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.billingStatus }})
    },
    orderNumber(data) {
      // this.$router.push({ path: 'collectionSettlement', query: { order: JSON.stringify(this.selectionData[0]) }})
      this.$router.push({ path: 'billDetails'})
      sessionStorage.setItem('billDetailsitem',JSON.stringify(data))
    },
    // 退药按钮
    retreat() {
      if (this.selectionData.length > 1 || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      } else {
        this.outList()
        this.returnMedicine = this.selectionData[0]
      }
      this.notshowDialog = true
    },
    // 关闭 弹框
    showdialog() {
      this.showDialog = false
    },
    notshowdialog() {
      console.log('册数')
      this.notshowDialog = false
    },
    close() {
      this.showDialog = false
      this.notshowDialog = false
    },
    //
    getinput(val, e) {
      var l = 0;
      // var l = 0;
      // l=val.outNumber;
      // if (val.outNumber > val.availableNumber) {
      //   this.$message.warning('领药数量不能大于可用量')
      //   details.outNumber = 0
      // }
      // this.collarList.forEach(collars=>{
      //   if(collars.omrId==val.omrId){
      //     alert(collars.surplusQuantity)
      //     if (l > collars.surplusQuantity) {
      //       this.$message.warning('领药之和不能大于领药数量')
      //
      //     }
      //   }
      //
      // })
      this.collarList.forEach(collars => {
        console.log('数据', this.collarListDetail)
        l = 0
        this.collarListDetail.forEach(details => {
          if (details.omrId === collars.omrId) {
            l += details.outNumber
            if (l > collars.surplusQuantity) {
              this.$message.warning('领药之和不能大于领药数量')
              details.outNumber = 0
            }
          }
          if (details.outNumber > details.availableNumber) {
            this.$message.warning('领药数量不能大于可用量')
            details.outNumber = 0
          }
        })
      })
    },
    getinputDrup(val, e) {

    },
    // 退药保存
    drugSubmit(row) {
      this.computeNum1 = 0
      this.insertList = []
      this.collarListDrug.forEach(collarList => {
        if (collarList.insertNumber > 0) {
          if (collarList.insertNumber > collarList.receivedQuantity) {
            this.$message.warning('退款数量不能大于已领取数量')
            return
          } else {
            this.insertList.push({
              materId: collarList.materId,
              returnAmount: math.multiply(math.divide(collarList.materialPrice, collarList.receivedQuantity), collarList.insertNumber),
              returnedQuantity: collarList.insertNumber,
              insertId: collarList.insertId,
              outDocumentNo: collarList.outDocumentNo,
              whouseId: collarList.whouseId,
              waitId: collarList.waitId,
              outId: collarList.outId,
              // 0 表示门诊退药
              source: 0,
              omrId: collarList.omrId,
              // 退药人
              drugReturner: this.returnMedicine.drugReturner,
              inChargeNo: this.selectionData[0].orderNumber,
              deptId:this.deptId,
              assist:collarList.assist,
            })
          }
        }
      })
      // console.log( this.insertList,' this.outListListgggg')
      // return
      this.submitLoding1=true
      this.$api.finance.drugSure(this.insertList).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.submitLoding1=false
          this.notshowDialog = false
          this.auxiliaryBillListData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //
    drugclose() {
      this.notshowDialog = false
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.auxiliaryBillListData()// 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.auxiliaryBillListData()
    },
    // 是否选中
    rowClick(e) {
      // this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = e[1]
      this.printList = e[1]
    },
    rowClassName({ row }) {
      const totalQuantity = row.detail.reduce((par, item) => par + item.totalQuantity, 0)
      const returnQuantity = row.detail.reduce((par, item) => par + item.returnQuantity, 0)
      // const surplusQuantity = row.detail.reduce((par, item) => par + item.surplusQuantity, 0)
      // 已领取数量
      const receivedQuantity = row.detail.reduce((par, item) => par + item.receivedQuantity, 0)
      // 总的已领取数量=0，就是未领药
      if(row.isRefund==1){
        return 'error-row'
      }
      if (receivedQuantity === 0) {
        return ''
      } else if (receivedQuantity === totalQuantity + returnQuantity) {
        // 已领取 = 总次数 + 退回的次数，就是已领完
        return 'warning-row'
      } else {
        return 'success-row'
      }

    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';
@page {
  size: auto;
  margin:0mm;
}
.container {
  width: 100%;
  height: 100%;
}

span {
  font-size: 14px;
  margin-right: 15px;

  i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
}

.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 20px 20px 20px 20px;
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

::v-deep .el-table .warning-row {
  background: #ffff00;
}

::v-deep .el-table .success-row {
  background: #c6f9c3;
}
::v-deep .el-table .error-row{
  background: #f56c6c;
}
.footer {
  margin-top: 10px;
  text-align: right;
}
</style>
