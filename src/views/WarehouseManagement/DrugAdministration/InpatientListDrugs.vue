<template>
  <!--住院单药品查询-->
  <div class="container">
    <sg-table
      ref="table"
      :sg-ref="'multipleTable'"
      :pagination="pagination"
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <div slot="searchBar" class="header-float">
        <div>
          <el-form size="mini" :model="form" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户姓名：">
                  <el-input v-model="form.customerName" clearable />
                </el-form-item>
                <el-form-item label="电话：">
                  <el-input v-model="form.customPhone" clearable />
                </el-form-item>
              </el-col>
              <!--              <el-col :span="4">-->
              <!--                <el-form-item label="住院医生：">-->
              <!--                  <el-select v-model="form.region" placeholder="请选择活动区域">-->
              <!--                    <el-option label="区域一" value="shanghai"></el-option>-->
              <!--                    <el-option label="区域二" value="beijing"></el-option>-->
              <!--                  </el-select>-->
              <!--                </el-form-item>-->
              <!--                <el-form-item label="病床号：">-->
              <!--                  <el-input />-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :span="4">-->
              <!--                <el-form-item label="病房号：">-->
              <!--                  <el-select v-model="form.region" placeholder="请选择活动区域">-->
              <!--                    <el-option label="区域一" value="shanghai"></el-option>-->
              <!--                    <el-option label="区域二" value="beijing"></el-option>-->
              <!--                  </el-select>-->
              <!--                </el-form-item>-->
              <!--                <el-form-item label="住院医生：">-->
              <!--                  <el-select v-model="form.region" placeholder="请选择活动区域">-->
              <!--                    <el-option label="区域一" value="shanghai"></el-option>-->
              <!--                    <el-option label="区域二" value="beijing"></el-option>-->
              <!--                  </el-select>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="8">
                <el-form-item label="住院日期：">
<!--                  <el-date-picker-->
<!--                    v-model="form.date"-->
<!--                    style="width: 100%"-->
<!--                    type="datetimerange"-->
<!--                    range-separator="至"-->
<!--                    start-placeholder="开始日期"-->
<!--                    end-placeholder="结束日期"-->
<!--                  />-->
                  <el-date-picker
                    v-model="form.date" class="inputWidth"
                    type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                    :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
                </el-form-item>
                <el-form-item label="客户卡号：">
                  <el-input v-model="form.customCardNumber" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检索类型：">
                  <el-select v-model="form.searchType" filterable clearable placeholder="请选择检索类型">
                    <el-option label="注射液" value="3" />
                    <el-option label="注射剂" value="4" />
                    <el-option label="口服药" value="5" />
                    <el-option label="外用药" value="6" />
                  </el-select>
                </el-form-item>
                <el-form-item label="领取状态：">
                  <el-select v-model="form.receiveState" filterable clearable placeholder="请选择领取状态">
                    <el-option label="待领取" value="0" />
                    <el-option label="已领取" value="1" />
                    <el-option label="已退" value="2" />

                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="margin-top: -25px">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
      </div>
      <div slot="header" class="header-float">
        <div>
          <span>住院列表</span>
        </div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="drugs" v-has-permi="['sorage:outList:getOutListTotal:get']">领料药品汇总</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="drug">领药</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="drug1">退药</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'billerFlag'">
          <div v-if="data.custom.billerFlag==1">已计费</div>
          <div v-if="data.custom.billerFlag==0">未计费</div>
        </div>
        <div v-if="data.props === 'customerName'">
          <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
        </div>
        <div v-if="data.props === 'receiveState'">
          <div v-if="data.custom.receiveState==1">部分领取</div>
          <div v-if="data.custom.receiveState==0">未领取</div>
          <div v-if="data.custom.receiveState==2">已领取</div>
          <div v-if="data.custom.receiveState==3">已退药</div>
        </div>
      </template>
    </sg-table>
    <!--领药-->
    <sgDialog :title="title" size="1550px" :dialog="showDialogs" @handleClose="showDialog">
      <div slot="out">
        <div class="formBody">
          <div class="title">收费单</div>
          <el-form ref="formlist" :inline="true" :rules="rules" :model="getMedicine" size="mini" class="demo-form-inline">
            <el-form-item label="姓名：">
              <el-input v-model="getMedicine.customerName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="电话：">
              <el-input v-model="getMedicine.customPhone" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="领取人：">
              <el-input v-model="getMedicine.drugRecipient" style="width: 140px;" />
            </el-form-item>
            <el-form-item label="库房：" prop="whouseId">
              <el-select v-model="getMedicine.whouseId" filterable style="width: 100%">
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
      </div>
      <div slot="footer" class="formBody">
        <div class="title">药品清单</div>
        <el-table
          ref="tableRef"
          size="mini"
          border
          :data="tableDataDetail"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :sg-ref="'multipleTable'"
          @selection-change="handleSelectionChangeDetail"
          @select="selectChange"
          @row-click="handleRowClick"
        >
          <el-table-column prop="itemName" label="产品名称" />
          <el-table-column prop="serialNum" label="批次编号" />
          <el-table-column prop="materialSpec" label="规格" width="100" />
          <el-table-column prop="doseUnit" label="剂量单位" width="160" />
          <el-table-column prop="days" label="天数" width="60" />
          <el-table-column prop="unitPrice" label="单价" />
          <el-table-column prop="amount" label="数量" />
          <el-table-column prop="expense" label="扣费金额" />
          <el-table-column prop="useCustomer" label="医嘱对象">
            <template slot-scope="scope">
              <span v-if="scope.row.useCustomer==0">本人</span>
              <span v-else>子女</span>
            </template>
          </el-table-column>
          <el-table-column prop="outChargeNo" label="领药单编号" />
        </el-table>
        <el-table
          size="mini"
          border
          :data="tableDataProject"
          style="width: 100%;margin-top: 10px"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column prop="inBatchNumber" label="入库批次号" />
          <el-table-column prop="productionBatch" label="生产批次号" />
          <el-table-column prop="materialName" label="物资名称" width="100" />
          <el-table-column prop="startTime" label="开始有效期" width="60" />
          <el-table-column prop="endTime" label="结束有效期" width="60" />
          <el-table-column prop="materialSpec" label="规格" width="60" />
          <el-table-column prop="unitName" label="单位" />
          <el-table-column prop="drugPriceOne" label="物资价格" />
          <!--          <el-table-column prop="insertNumber" label="入库数量" />-->
          <el-table-column prop="availableNumber" label="可用数量" />
          <el-table-column prop="whouseName" label="库房" />
          <el-table-column prop="place" label="产地" />
          <el-table-column prop="surplusQuantity" label="领取数量" />
          <el-table-column prop="priceNum" label="操作" fixed="right">
            <template slot-scope="{row}">
              <el-button size="mini" @click="additionapriceNum(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button size="mini" type="primary" icon="el-icon-folder-checked" :loading="submitLoding" @click="reMedicine(tableDataDetail)">保存</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        </div>

      </div>

    </sgDialog>
    <!--退药-->
    <sgDialog title="退药信息" size="1550px" :dialog="notshowDialog" @handleClose="showdialogT">
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
            <!--            <el-form-item label="收费单号：">-->
            <!--              <el-input v-model="returnMedicine.orderNumber" disabled style="width: 140px;" />-->
            <!--            </el-form-item>-->
            <el-form-item label="医生：">
              <el-input v-model="returnMedicine.hospitalDoctorName" disabled style="width: 140px;" />
            </el-form-item>
            <el-form-item label="退药人：">
              <el-input v-model="drugReturner" style="width: 140px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="formBody">
          <div class="title">药品清单</div>
          <el-table :data="collarListDrug" height="338px" size="mini" border style="width: 100%">
            <el-table-column prop="projectName" label="药品名称" fixed />
            <el-table-column prop="productionBatch" label="生产批次" />
            <el-table-column prop="unitName" label="单位" />
            <el-table-column prop="materialSpec" label="规格" />
            <el-table-column prop="outDocumentNo" label="出库单号" />
            <el-table-column prop="collectedQuantity" label="已领取数量" />
            <el-table-column prop="outNumber" label="退药数量">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.insertNumber" size="mini" class="moneyInput" placeholder="请输入数量" @change="getinputDrup" />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-button size="mini" type="primary" :loading="submitLoding1" icon="el-icon-folder-checked" @click="drugSubmit(collarListDrug)">保存</el-button>
            <el-button size="mini" type="danger" icon="el-icon-close" @click="drugclose">关闭</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定领取药品吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="newsubmit">确 定</el-button>
      </span>
    </el-dialog>
    <sgDialog title="领料药品汇总信息" size="1200px" :dialog="drugsFlag" @handleClose="drugsFlag=false">
      <div slot="out">
        <div style="width: 100%;min-height: 30px;display: flex;flex-wrap: wrap">
         <div style="width: 240px;height: 30px;">
           开始时间：    <el-date-picker
           v-model="startTime"
           type="datetime"
           placeholder="选择日期" size="mini" style="width: 125px">
         </el-date-picker>
         </div>
          <div style="width: 240px;height: 30px;">
            结束时间：    <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="选择日期" size="mini" style="width: 125px">
          </el-date-picker>
          </div>
          <div style="width: 240px;height: 30px;">
            库房：
            <el-select v-model="whouseId" filterable  size="mini" style="width: 150px">
              <el-option
                v-for="item in storehouseList"
                :key="item.whouseId"
                :label="item.whouseName"
                :value="item.whouseId"
              />
            </el-select>
          </div>
          <div style="width: 240px;height: 30px;">
            领取方式：
            <el-select v-model="documentType" filterable  size="mini" style="width: 150px">
              <el-option
                v-for="item in optiondocumentType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="searchdata">搜索</el-button>
          <el-button type="success" plain size="mini" icon="el-icon-top" @click="exportsnew">导出</el-button>

        </div>
        <div class="contain_num_left" style="margin-top:10px ">
          <el-table
            :data="tableDatas"
            border
            id="out-table"
            style="width: 100%" :height="500">
            <el-table-column type="index" width="50" align="center">
            </el-table-column>
            <el-table-column
              prop="materialName"
              label="物资名称"

              align="center">
            </el-table-column>
            <el-table-column
              prop="materialPrice"
              label="物资价格"

              align="center">
            </el-table-column>
            <el-table-column
              prop="materialSpec"
              label="物资规格"

              align="center">
            </el-table-column>
            <el-table-column
              prop="outNumber"
              label="出库数量"

              align="center">
            </el-table-column>
            <el-table-column
              prop="returnAmount"
              label="退药金额"

              align="center">
            </el-table-column>
            <el-table-column
              prop="returnNumbeer"
              label="退药数量"

              align="center">
            </el-table-column>
            <el-table-column
              prop="unitName"
              label="单位"

              align="center">
            </el-table-column>
          </el-table>
        </div>

      </div>
    </sgDialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime,
  timeFmt
} from '@/utils/time'
import {export_table_to_excel} from "@/utils/utils";

export default {
  name: 'PurchaseReceiptQuery',
  components: {
    SgTable,
    sgDialog
  },
  data() {
    return {
      submitLoding:false,
      tableDatas:[],
      drugsFlag:false,
      documentType:'',
      optiondocumentType:[{
        label:"领料",
        value:4
      },{
        label:"领药",
        value:9
      }],
      whouseId:'',
      startTime:'',
      endTime:'',
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      submitLoding1:false,
      dialogVisible: false,
      form: {
        region: '',
        customerName: null,
        customCardNumber: null,
        customPhone: null,
        date: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])],
        receiveState:""
      },
      tableData: [],
      columns: [
        {
          lab: '成组号',
          val: 'groupNum',
          width: 200
        },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName'
        },
        {
          lab: '客户电话',
          val: 'customPhone'
        }, {
          lab: '客户卡号',
          val: 'customCardNumber',
          width:250,
        },
        {
          lab: '医嘱成组号',
          val: 'adviceGroupNum'
        },
        {
          lab: '住院号',
          val: 'inHospitalId'
        },
        {
          lab: '计费状态 ',
          val: 'billerFlag',
          custom: 'billerFlag'
        },
        {
          lab: '病床号',
          val: 'bedNumber'
        },
        {
          lab: '领取状态',
          val: 'receiveState',
          custom: 'receiveState'
        },
        {
          lab: '  金额',
          val: 'expense'
        },
        {
          lab: ' 住院时间',
          val: 'hospitalTime',
          width: 200
        },
        {
          lab: '部门名称',
          val: 'departmentName'
        },
        {
          lab: '抄送时间',
          val: 'copyPersonTime',
          width: 200,
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      paginationDetail: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      searchlist: {},
      showDialogs: false,
      title: '详情',
      tableDataDetail: [],
      columnsDetail: [
        {
          lab: '产品名称',
          val: 'itemName'
        },
        {
          lab: '规格',
          val: 'materialSpec'
        },
        {
          lab: '数量',
          val: 'amount'
        },
        {
          lab: '每次用量',
          val: 'frequency'
        },
        {
          lab: '代领',
          val: 'amount'
        },
        {
          lab: '已领',
          val: ''
        },
        {
          lab: '单价',
          val: 'unitPrice'
        },
        {
          lab: '总价',
          val: 'totalPrice'
        }
      ],
      selectionData: [],
      tableDataProject: [],
      selectionDataDetail: [],
      xflag: 0,
      dataList: [],
      getMedicine: {
        customerName: null,
        user: null,
        ophen: null,
        orderNumber: null,
        acName: null,
        whouseId: null
      },
      storehouseList: [],
      rules: {
        whouseId: [
          { required: true, message: '请输入库房名称', trigger: 'change' }
        ]
      },
      medicalList: [],
      rowlist: {},
      outListList: [],
      collarListDetail: [],
      notshowDialog: false,
      returnMedicine: {
        customerName: null,
        user: '',
        ophen: '',
        orderNumber: '',
        acName: '',
        region: ''
      },
      drugReturner: '',
      collarListDrug: []
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
      // this.deptId = val
      this.getList()
      this.getInvData()
    }
  },
  created() {
    this.getList()
    this.getInvData()

    // this.deptId = this.$store.getters.departmentId
  },
  methods: {
    exportsnew(){
      export_table_to_excel('#out-table', '领料药品汇总')
    },
    searchdata(){
      this.$api.confinementRoom.getOutListTota({
        documentType:this.documentType,
        deptId:this.deptId,
        startTime:this.startTime==''||this.startTime==null?'': timeFmt('', this.startTime) ,
        endTime: this.endTime==''|| this.endTime==null?'':timeFmt('',this.endTime),
        whouseId:this.whouseId,
      }).then(res=>{
        this.tableDatas=res.rows;
      })
    },
    drugs(){
      this.tableDatas=[]
       this.drugsFlag=true;
    },
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, display: '1' }})
    },
    // 获取库房书库
    handleClose() {
      this.dialogVisible = false
    },
    newsubmit() {
      this.$api.medical.addHospitalReceive(this.outListList).then(res => {
        if (res.code) {
          this.tableDataDetail = res.rows
          this.showDialogs = false
          this.$message.success('操作成功')
          this.getList()
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
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
    // 领药、退药按钮
    drug() {
      this.xflag = 1
      this.tableDataProject = []
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行操作')
        return
      } else {
        this.getMedicine = this.selectionData[0]
      }
      if (this.selectionData[0].receiveState == 2) {
        this.$message.warning('已经领取')
        return
      }
      this.showDialogs = true
      this.getListDetail()
    },
    // 退药药品清单
    async outList() {
      const query = {
        outChargeNo: this.selectionData[0].outChargeNo
      }
      console.log(query, 'queryqueryquery')
      await this.$api.finance.drugWithdrawal(query).then(res => {
        if (res) {
          this.collarListDrug = res.data
        }
      })
    },
    drugclose() {
      this.notshowDialog = false
    },
    // 获取输入框的值
    getinputDrup() {
      this.collarListDrug.forEach(collarList => {
        if (collarList.insertNumber > collarList.collectedQuantity && collarList.insertNumber != undefined) {
          this.$message.warning('退款数量不能大于已领取数量')
          return
        } else {
        }
      })
    },
    // 退药保存
    drugSubmit(row) {
      this.collarListDrug = row
      this.insertList = []
      this.collarListDrug.forEach(collarList => {
        if (collarList.insertNumber > 0 || collarList.insertNumber != undefined) {
          this.insertList.push({
            copyRecordId: collarList.copyRecordId,
            refundNum: collarList.insertNumber,
            outId: collarList.outId,
            outDocumentNo: collarList.outDocumentNo,
            whouseId: collarList.whouseId,
            drugReturner: this.drugReturner
          })
        }
      })
      this.submitLoding1=true
      this.$api.finance.newdrugSure(this.insertList).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.notshowDialog = false
          this.submitLoding1=false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showdialogT() {
      this.notshowDialog = false
    },
    // input值改变
    getinput(val, e) {
      var l = 0
      this.tableDataDetail.forEach(collars => {
        console.log('数据', this.tableDataProject)
        l = 0
        this.tableDataProject.forEach(details => {
          if (details.materId === collars.materId) {
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
    drug1() {
      this.xflag = 0
      this.tableDataProject = []
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行操作')
        return
      } else {
        this.returnMedicine = this.selectionData[0]
      }
      if (this.selectionData[0].receiveState == 0) {
        this.$message.warning('未领取')
        return
      }
      this.notshowDialog = true

      this.outList()
    },
    showDialog() {
      this.showDialogs = false
    },
    getNowDate(date) {
      if (date != undefined) {
        var sign2 = ':'
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1 // 月
        var day = date.getDate() // 日
        var hour = date.getHours() // 时
        var minutes = date.getMinutes() // 分
        var seconds = date.getSeconds() // 秒
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
      }
    },
    // 退药,领药确定
    reMedicine(row) {
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          if(this.tableDataProject.length==0){
            this.$message.warning('请先选择领取药品');
            return;
          }
          this.tableDataDetail = row
          this.outListList = []
          this.tableDataDetail.forEach((collarList, index) => {
            this.outListList.push({
              deptId: this.$store.getters.departmentId,
              copyRecordId: collarList.copyRecordId,
              itemId: collarList.itemId,
              whouseId: this.getMedicine.whouseId,
              drugRecipient: this.getMedicine.drugRecipient,
              id:this.selectionData[0].id,
            })
          })
          // if(row[0].amount>this.tableDataProject[0].availableNumber){
          //  this.dialogVisible=true;
          //   return
          // }
          //

          // // this.outListList[0].drugRecipient=this.getMedicine.drugRecipient
          // console.log(this.outListList[0],'哈哈哈');
          // return
          this.submitLoding=true
          this.$api.medical.addHospitalReceive(this.outListList).then(res => {
            if (res.code) {
              this.tableDataDetail = res.rows
              this.showDialogs = false
              this.$message.success('操作成功')
              this.submitLoding=false
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },

    // 获取列表
    async getList() {
      const query = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum,
        deptId: this.$store.getters.departmentId,
        receiveState: this.form.receiveState,
        searchType: this.form.searchType,
        customerName: this.form.customerName,
        customCardNumber: this.form.customCardNumber,
        customPhone: this.form.customPhone,
        startTime: this.form.date != null ?this.form.date[0] : '',
        endTime: this.form.date != null ? this.form.date[1] : ''
      }
      await this.$api.medical.getDispenseMedicineLists(query).then(res => {
        if (res.code) {
          res.rows.forEach(item => {
            item.copyPersonTime = item.copyPersonTime.replace(/T/g, ' ')
            item.hospitalTime = item.hospitalTime.replace(/T/g, ' ')
          })
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 搜索列表
    search() {
      this.getList()
    },
    // 获取列表详情
    async getListDetail() {
      const query = {
        adviceGroupNum: this.selectionData[0].adviceGroupNum,
        groupNum: this.selectionData[0].groupNum,
        deptId: this.deptId
      }
      await this.$api.medical.getDispenseMedicineInfo(query).then(res => {
        if (res.code) {
          this.tableDataDetail = res.rows
        }
      })
    },
    // 关闭弹窗
    close() {
      this.showDialogs = false
    },
    // 删除
    additionapriceNum(row) {
      this.$nextTick(() => {
        this.tableDataProject.splice(this.tableDataProject.findIndex(item => item.insertId === row.insertId), 1)
      })
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.getList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getList()
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },

    handleSelectionChangeDetail(e) {
      this.selectionDataDetail = e
    },
    selectChange(selection, row) {
      if (selection.length > 1) {
        const del_row = selection.shift()
        this.$refs.tableRef.toggleRowSelection(del_row, false)
      }
    },
    // 点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.rowlist = row
      if (this.getMedicine.whouseId == null) {
        this.$message.error('请先选择库房')
      } else {
        this.$refs.tableRef.toggleRowSelection(row)
        this.selectChange(this.selectionDataDetail)
        const query = {
          itemId: row.itemId,
          deptId: this.$store.getters.departmentId,
          copyRecordId: row.copyRecordId,
          warehouseId: this.getMedicine.whouseId
        }
        if (this.selectionDataDetail.length != 0) {
          this.$api.medical.getListByItemId(query).then(res => {
            if (res.code) {
              this.medicalList = []
              this.medicalList.push(...res.rows)
              this.medicalList.forEach(a => {
                this.tableDataProject.push(a)
              })
            }
            this.tableDataProject = this.unique(this.tableDataProject)
            if (this.tableDataProject.length == 0) {

            } else {
              let Name = ''
              this.storehouseList.forEach(value => {
                if (this.getMedicine.whouseId == value.whouseId) {
                  Name = value.whouseName
                }
              })
              this.tableDataProject.forEach(value => {
                value.whouseName = Name
              })
            }
          })
        }
      }
    },
    //  去重
    unique(arr) {
      const result = {}
      const finalResult = []
      for (let i = 0; i < arr.length; i++) {
        // 利用对象的键名无法重复的特点，cpmch_id是唯一区别的属性值
        result[arr[i].insertId] ? '' : result[arr[i].insertId] = true && finalResult.push(arr[i])
      }
      return finalResult
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .contain_num_left .el-table__header-wrapper th {
  padding: 2px !important;
  font-weight: normal;
  font-size: 12px;
  color: black;


}
::v-deep .contain_num_left .el-table__body tr td {
  padding: 3px;
  font-size: 12px;
  cursor: pointer;
}
@import '../../../styles/globalfloat.css';

span {
  font-size: 14px;
}
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
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
.footer{
  margin-top: 10px;
  text-align: right;
}
</style>
