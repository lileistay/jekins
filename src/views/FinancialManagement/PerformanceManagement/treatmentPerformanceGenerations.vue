<template>
  <!-- 治疗 单业绩·生成 -->
    <div class="content-area">
        <slideSearch :options="options">
            <div slot="btnBar" class="buttonBox">
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
                        type="success"
                        size="mini"
                        icon="el-icon-search"
                        plain
                        @click.stop="exportExcel"
                >导出
                </el-button>
                <!-- v-has-permi="['payment:toBePaidList:export']" -->
            </div>
            <slot>
                <sg-table
                        ref="table"
                        :sg-ref="'multipleTable'"
                        size="mini"
                        id="out-table"
                        border
                        index="序号"
                        selection
                        highlight-current-row
                        :table-data="tableData"
                        :columns="columns"
                        :pagination="pagination"
                        @size-change="sizeChange"
                        :row-class-name="rowClassName"
                        @current-change="currentChange"
                        @selection-change="handleSelectionChange"
                        @row-click="rowClick"
                >
                    <div slot="searchBar" class="searchBar">
                        <div>统计信息</div>
                        <div class="information-List">
                            <span>客户数量：{{statisticalData.customNum}}</span>
                            <span>收费单开单业绩：{{statisticalData.billingPerformance}}</span>
                            <span>收费单科室业绩：{{statisticalData.departmentPerformance}}</span>
                            <span>已执行业绩汇总：{{statisticalData.executedPerformance }}</span>
                        </div>
                    </div>
                    <!-- 头部列表清单 -->
                    <div slot="header" style="width:100%">
                        <span style="color: #7ec5b7; font-size: 18px"><i class="el-icon-s-fold"></i>列表清单</span>
                        <span><i class="color-block-ungenerated" /> 未生成</span>
                        <span><i class="color-block-success" /> 已生成</span>
                        <span style="float: right">
                          <el-button
                              v-has-permi="['confinement:financialManagement:add']"
                                  size="mini"
                                  type="primary"
                                  plain
                                  class="headerBarBtn"
                                  @click="handleSignalTreatmentMoney"
                          >生成治疗单业绩
                          </el-button>
                          <el-button
                              v-has-permi="['confinement:financialManagement:add']"
                                  size="mini"
                                  type="primary"
                                  plain
                                  class="headerBarBtn"
                                  @click="handleBatchTreatmentMoney"
                          >批量生成治疗单业绩（每次最多生成500条）
                          </el-button>
                        </span>
                    </div>
                    <template #custom="data">
                        <!-- 客户姓名 -->
                        <div v-if="data.props === 'customerName'">
                            <a class="textLink" @click="handleCustomer(data.custom)">
                                {{ data.custom.customerName }}
                            </a>
                        </div>
                        <!-- 收费单号 -->
                        <div v-if="data.props === 'orderNumber'">
                            <a
                                    style="color: #0066cc; cursor: pointer"
                                    @click="handleOrderNumber(data.custom)"
                            >
                                {{ data.custom.orderNumber }}
                            </a>
                        </div>
                        <div v-if="data.props === 'anesthesiaMethod'">
                            <show-dict-data :options="dict.type.Anesthesia_mode" :value="data.custom.anesthesiaMethod" />
                        </div>
                        <div v-if="data.props === 'isExecute'">
                            <show-dict-data :options="dict.type.whether" :value="data.custom.isExecute" />
                        </div>
                        <div v-if="data.props === 'isPerformance'">
                            <show-dict-data :options="dict.type.whether" :value="data.custom.isPerformance" />
                        </div>
                        <div v-if="data.props === 'isBillingPerformance'">
                            <show-dict-data :options="dict.type.whether" :value="data.custom.isBillingPerformance" />
                        </div>
                        <div v-if="data.props === 'isExperience'">
                            <show-dict-data :options="dict.type.whether" :value="data.custom.isExperience" />
                        </div>
                        <div v-if="data.props === 'isDebtAmount'">
                            <show-dict-data :options="dict.type.whether" :value="data.custom.isDebtAmount" />
                        </div>
                        <div v-if="data.props === 'state'">
                            <show-dict-data :options="dict.type.whether" :value="data.custom.state" />
                        </div>
                        <div v-if="data.props === 'thisScribingNum'">
                          <span>{{Number(data.custom.thisScribingNum).toFixed(0)}}</span>
                        </div>
                        <div v-if="data.props === 'refundNum'">
                            <span>{{Number(data.custom.refundNum).toFixed(0)}}</span>
                        </div>
                        <div v-if="data.props === 'billingPerformance'">
                            <span>{{Number(data.custom.billingPerformance).toFixed(0)}}</span>
                        </div>
                    </template>
                </sg-table>
            </slot>
        </slideSearch>
    </div>
</template>
<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import {newgetData, todayTime} from '@/utils/time'
import moment from "moment/moment";
import { export_table_to_excel } from '@/utils/utils.js'
export default {
    dicts:['Anesthesia_mode','whether'],
    components: {
        slideSearch,
        SgTable
    },
    data(){
        return{
            pagination: { //分页数
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1,
                deptId:''
            },
            statisticalData:[],
            tableData:[],
            selectionData:[],
            columns: [
                {
                    lab: '客户姓名',
                    val: 'customerName',
                    width: 100,
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
                    // custom: 'customerCard'
                },
                {
                    lab: '结账时间',
                    val: 'checkoutTime',
                    width: 150
                    // custom: 'closingTime'
                },
                {
                    lab: '收费单号',
                    val: 'orderNumber',
                    width: 165,
                    custom: 'orderNumber'
                },
                {
                    lab: '治疗时间',
                    val: 'treatStartTime',
                    width: 140
                },
                {
                    lab: '开单业绩',
                    val: 'billingPerformance',
                    custom: 'billingPerformance'
                },
                {
                    lab: '执行业绩',
                    val: 'departmentPerformance',
                },
                // {
                //     lab: '剩余待执行业绩',
                //     val: 'remainingPerformance',
                //     width: 120
                // },
                {
                    lab: '当前治疗次数',
                    val: 'thisScribingNum',
                    custom: 'thisScribingNum',
                    width: 120
                },
                {
                    lab: '本次执行业绩',
                    val: 'performance',
                    width: 120

                },
                {
                    lab: '欠款金额',
                    val: 'debtAmount',

                },
                {
                    lab: '项目名称',
                    val: 'projectName',
                    width: 140

                },
                {
                    lab: '原价',
                    val: 'finalPrice',

                },
                {
                    lab: '产品数量',
                    val: 'quantity',

                },
                {
                    lab: '产品总次数',
                    val: 'quantitySum',
                    showOverflowTooltip: true,
                    width: 120
                },
                {
                    lab: '产品次数',
                    val: 'priceNum',

                },
                {
                    lab: '退款次数',
                    val: 'refundNum',
                    custom: 'refundNum'

                },
                {
                    lab: '折后（应付总金额度）',
                    val: 'discountAmount',
                    width: 150

                },
                {
                    lab: '科室',
                    val: 'departmentName',

                },
                {
                    lab: '一级项目',
                    val: 'departmentName',
                    width: 130

                },
                {
                    lab: '二级项目',
                    val: 'projectTypeName',
                    width: 130
                },
                {
                    lab: '三级项目',
                    val: 'categoryName',
                    width: 130

                },
                {
                    lab: '是否生成执行业绩',
                    val: 'isExecute',
                    custom: 'isExecute',
                    width: 120

                },
                {
                    lab: '生成业绩时间',
                    val: 'genAmentTime',
                    width: 150

                },
                {
                    lab: '实际执行医生',
                    val: 'aueName',
                    width: 100

                },
                {
                    lab: '医生',
                    val: 'doctorName',
                    width: 100

                },
                {
                    lab: '医助',
                    val: 'dassName',

                },
                {
                    lab: '护士',
                    val: 'cnName',

                },
                {
                    lab: '麻醉方式',
                    val: 'anesthesiaMethod',
                    custom: 'anesthesiaMethod',
                },
                {
                    lab: '麻醉师',
                    val: 'alName',

                },
                {
                    lab: '美学顾问',
                    val: 'acName',
                    width: 100
                },
                {
                    lab: '客户代表',
                    val: 'crName',
                    width: 100
                },
                {
                    lab: '仪器',
                    val: 'equipmentName',

                },
                {
                    lab: '治疗时长',
                    val: 'treatmentLength',

                },
                {
                    lab: '是否体检',
                    val: 'isExperience',
                    custom: 'isExperience'
                },
                {
                    lab: '治疗备注',
                    val: 'remark',

                }
            ],
            options:{
                timeType: {
                    type: 'select',
                    label: '时间类型：',
                    values: 'treat',
                    options:this.timeType
                },
                // 开始时间和结束时间
                Time: {
                  type: 'Tdatetime',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])],
                    label: '时间选择：'
                },
                customerName: {
                    type: 'input',
                    label: '客户姓名',
                    clearable: true
                },
                customPhone: {
                    type: 'input',
                    label: '电话:',
                    clearable: true
                },
                customCardNumber: {
                    type: 'input',
                    label: '客户卡号',
                    clearable: true
                },
                orderNumber: {
                    type: 'input',
                    label: '收费单号',
                    clearable: true
                },
                doctorId: {
                    type: 'select',
                    label: '医生:',
                    clearable: true,
                    options: []
                },
                actualExecutorUser: {
                    type: 'select',
                    label: '实际执行医生:',
                    options: [],
                    clearable: true,
                },
                // 医美顾问
                aestheticConsultant: {
                    type: 'select',
                    label: '美学顾问：',
                    clearable: true,
                    options: []
                },
                // 客户代表
                customerRepresentative: {
                    type: 'select',
                    label: '客户代表：',
                    clearable: true,
                    options: []
                },
                // 医助
                doctorAssistant: {
                    type: 'select',
                    label: '医助：',
                    clearable: true,
                    options: []
                },
                // 麻醉方式
                anesthesiaMethod: {
                    type: 'select',
                    label: '麻醉方式：',
                    clearable: true,
                    options: this.anesthesiaTypeList
                },
                // 麻醉师
                anesthesiologist: {
                    type: 'select',
                    label: '麻醉师：',
                    clearable: true,
                    options: []
                },
                // 护士
                circulatingNurse: {
                    type: 'select',
                    label: '护士：',
                    clearable: true,
                    options: []
                },
                deviceId: {
                    type: 'select',
                    label: '仪器：',
                    clearable: true,
                    options: []
                },
                isExperience: {
                    type: 'select',
                    label: '体检：',
                    clearable: true,
                    options: this.yesAndNoType
                },
                // 是否有开单业绩：
                isBillingPerformance: {
                    type: 'select',
                    label: '是否有开单业绩：',
                    clearable: true,
                    options: this.yesAndNoType
                },
                // 是否有执行业绩
                isPerformance: {
                    type: 'select',
                    label: '是否有执行业绩:',
                    clearable: true,
                    options: this.yesAndNoType
                },
                // 是否生成执行业绩
                isExecute: {
                    type: 'select',
                    label: '是否生成执行业绩：',
                    clearable: true,
                    options: this.yesAndNoType
                },
                departmentId: {
                    type: 'select',
                    label: '一级项目：',
                    clearable: true,
                    options: [],
                    values: ''
                },
                projectTypeId: {
                    type: 'select',
                    label: '二级项目：',
                    clearable: true,
                    options: [],
                    values: ''
                },
                categoryId: {
                    type: 'select',
                    label: '三级项目：',
                    clearable: true,
                    options: [],
                    values: ''
                },
                projectName: {
                    type: 'input',
                    label: '项目：'
                },
                thisScribingNum: {
                    type: 'Tinput',
                    label: '当前治疗次数：',
                    clearable: true,
                    values: []
                },
                isDebtAmount: {
                    type: 'select',
                    label: '是否有记账：',
                    clearable: true,
                    options: this.yesAndNoType
                },
                // 是否已治疗
                state: {
                    type: 'select',
                    label: '是否已治疗：',
                    clearable: true,
                    options: this.yesAndNoType
                }
            },
            // 时间类型
            timeType:[
                {
                    value: 'treat',
                    label: '治疗时间'
                },
                {
                    value: 'create',
                    label: '生成业绩时间'
                },
                {
                    value: 'checkout',
                    label: '结账时间'
                },
                {
                    value: 'putRecord',
                    label: '建档时间'
                }
            ],
            // 是否的一些值
            yesAndNoType : [
                {
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                }
            ],
            // 麻醉方式
            anesthesiaTypeList : [
                {
                    value: '1',
                    label: '局部'
                },
                {
                    value: '2',
                    label: '全麻'
                },
                {
                    value: '3',
                    label: '强化麻'
                },
                {
                    value: '4',
                    label: '输血费'
                },
                {
                    value: '5',
                    label: '输氧费'
                },
                {
                    value: '6',
                    label: '手术费'
                }
            ],
            xflagList:{}
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
            this.getUserList() // 人员数据
            this.getData()
        },
        // 监听一级项目
        'options.departmentId.values'() {
            this.options.projectTypeId.values = '' // 二级项目
            this.options.projectTypeId.options = [] // 二级项目
            this.options.categoryId.values = '' // 三级项目
            this.options.categoryId.options = [] // 三级项目
            if (this.options.departmentId.values) {
                const departmentId = this.options.departmentId.values
                this.getProjectType(departmentId)
            }
        },
        // 监听二级项目
        'options.projectTypeId.values'() {
            this.options.categoryId.values = '' // 三级项目
            this.options.categoryId.options = [] // 三级项目
            if (this.options.projectTypeId.values) {
                const projectTypeId = this.options.projectTypeId.values
                this.categoryType(projectTypeId)
            }
        },
    },
    created() {
        this.getData()
        this.getUserList() // 人员数据
        this.getAllDepartment(this.deptId) // 一级项目
        this.queryDeviceManageList() //获取仪器
        this.options.timeType.options=this.timeType
        this.options.anesthesiaMethod.options=this.anesthesiaTypeList
        this.options.isExperience.options=this.yesAndNoType
        this.options.isBillingPerformance.options=this.yesAndNoType
        this.options.isPerformance.options=this.yesAndNoType
        this.options.isExecute.options=this.yesAndNoType
        this.options.isDebtAmount.options=this.yesAndNoType
        this.options.state.options=this.yesAndNoType
      const this_ = this
      // 点击回车后事件
      document.onkeydown = function(e) {
        if (e.keyCode === 13) {
          this_.getData()
        }
      }
    },
    methods:{
        // 列表数据
        getData(isSearch){ //查询
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1

            }
            this.pagination.deptId=this.deptId
            let data = {};
            for(let  k in this.options){
                // 当前治疗次数
                if (
                    this.options[k].type === 'Tinput' &&
                    Array.isArray(this.options[k].values)
                ) {
                    data[k] = this.options[k].values[0]
                    data[ 'end' + k] = this.options[k].values[1]
                } else if (this.options[k].type === 'Tdatetime') {
                    // 治疗时间
                    if (
                        this.options[k].values[0] === null &&
                        this.options[k].values[1] !== null
                    ) {
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] === null
                    ) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                    if (
                        this.options[k].values[1] !== null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.options[k].values.length === 0) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                }
                else if(this.options[k].type === 'datetimerangeopentions'){
                  if(this.options[k].values){
                    if(this.options[k].values.length!==0){
                      data['startTime'] =newgetData(this.options[k].values[0])
                      data['endTime'] =newgetData(this.options[k].values[1])
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
            this.xflagList=data
            this.$api.treatmentMoney.queryTreatmentMoneyList({...data,pageSize: this.pagination.pageSize,
                pageNum: this.pagination.currentPage,deptId:this.deptId}).then(res =>{
                if(res.rows){
                    this.tableData = res.rows;
                    this.dataList=res.data
                    this.pagination.total = res.total
                    this.statisticalData = res.data
                }
            })
        },
        rowClick(e) { //点击每行
            this.$refs.table.$refs.multipleTable.clearSelection()
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
            // const select = this.$refs.table.$refs.multipleTable.selection
            // this.handleSelectionChange(select)
        },
        // 选中的数组
        handleSelectionChange(row) {
            this.selectionData = row[1];
        },
        // 搜索
        handleSearch() {
            this.pagination = {
                ...this.pagination,
                currentPage: 1
            }
            this.getData()
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
        // 收费单编号
        handleOrderNumber(data) {
            this.$router.push({
                path: 'billDetails'
            })
          sessionStorage.setItem('billDetailsitem',JSON.stringify(data) )
        },
        // 处理生成治疗单业绩
        handleSignalTreatmentMoney() {
            if (!this.selectionData.length) {
                return this.$message.warning('请选中一条治疗记录')
            } else if (this.selectionData.length > 1) {
                return this.$message.warning('不能选择多条治疗记录')
            }
            const findExecute = this.selectionData.some(item => item.isExecute == '1')
            if (findExecute) {
                return this.$message.warning('选中数据有已执行，请重新选择')
            }
            this.$router.push({
                path: '/batchTreatmentPerformanceGeneration',
                query: {
                    batchData: JSON.stringify(this.selectionData)
                }
            })
        },
        // 批量生成治疗单业绩
        async handleBatchTreatmentMoney() {
            if (this.tableData.length<=0) {
                return this.$message.warning('没有需要执行的数据')
            }
            if (this.selectionData.length) {
                const findExecute = this.selectionData.some(item => item.isExecute == '1')
                if (findExecute) {
                    return this.$message.warning('选中数据有已执行，请重新选择')
                }
                this.$router.push({
                    path: '/batchTreatmentPerformanceGeneration',
                    query: {
                        batchData: JSON.stringify(this.selectionData),
                    }
                })
            } else {
                this.pagination.pageSize = 500
                // setTimeout(()=>{
                const findExecute = this.tableData.filter(item => item.isExecute !== '1')
                this.$router.push({
                    path: '/batchTreatmentPerformanceGeneration',
                    query: {
                        // batchData: JSON.stringify(findExecute),
                        xflag:2,
                        num:this.xflagList
                    }
                })
                // },260)
                this.pagination.pageSize = 20

            }
        },
        // 获得人员数据
        getUserList() {
            const query={
                deptId: this.deptId,
            }
            this.$api.user.getUserList(query).then((res) => {
                if (res) {
                    res.data.forEach((item) => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    // doctor 医生、实际执行医生、医助
                    res.data.forEach((item) => {
                        if (item.postCode === 'doctor') {
                            this.options.doctorId.options.push(item) // 医生
                            this.options.actualExecutorUser.options.push(item) // 实际执行医生
                            this.options.doctorAssistant.options.push(item) // 医助

                        }
                        // 医美顾问 xczxs
                        if (item.postCode === 'xczxs') {
                            this.options.aestheticConsultant.options.push(item)
                            this.options.customerRepresentative.options.push(item)
                        }
                        // 麻醉师 anesthesiologist anesthesiologist
                        if (item.postCode === 'anesthesiologist') {
                            this.options.anesthesiologist.options.push(item)
                        }
                        // 护士 circulatingNurse zerennurse
                        if (item.postCode === 'zerennurse') {
                            this.options.circulatingNurse.options.push(item)
                        }
                    })
                    this.options.doctorId.options = this.handleArrRepeat(
                        this.options.doctorId.options
                    ) // 医生
                    this.options.actualExecutorUser.options = this.handleArrRepeat(
                        this.options.actualExecutorUser.options
                    ) // 实际执行医生
                    this.options.doctorAssistant.options = this.handleArrRepeat(
                        this.options.doctorAssistant.options
                    ) // 医助
                    this.options.aestheticConsultant.options = this.handleArrRepeat(
                        this.options.aestheticConsultant.options
                    ) // 医美顾问
                    this.options.customerRepresentative.options =
                        this.handleArrRepeat(
                            this.options.customerRepresentative.options
                        ) // 客户代表
                    this.options.anesthesiologist.options = this.handleArrRepeat(
                        this.options.anesthesiologist.options
                    ) // 麻醉师
                    this.options.circulatingNurse.options = this.handleArrRepeat(
                        this.options.circulatingNurse.options
                    ) // 护士
                }
            })
        },
        // 数组去重
        handleArrRepeat(arr) {
            const newArr = []
            const empty = {}
            arr.forEach((item) => {
                if (!empty[item.userId]) {
                    newArr.push(item)
                    empty[item.userId] = true
                }
            })
            return newArr
        },
        // row背景颜色
        rowClassName({ row,rowIndex }) {
          if(rowIndex%2==0){
            return 'normal-row'
          }
            const { isExecute } = row
            if (isExecute==1){
                return 'color-block-green'
            }else if (isExecute==1){
                return 'color-block-white'
            }
        },
        // 请求一级项目
        getAllDepartment(deptId) {
            this.options.departmentId.values = '' // 一级项目
            this.options.projectTypeId.values = '' // 二级项目
            this.options.categoryId.values = '' // 三级项目
            this.options.departmentId.options = [] // 一级项目
            const data = {
                deptId,
                status: '0'
            }
            this.$api.modules.filing.departmentInfoList(data).then((res) => {
                if (res) {
                    res.rows.forEach((item) => {
                        item.label = item.departmentName
                        item.value = item.departmentId
                    })
                    this.options.departmentId.options = res.rows
                }
            })
        },
        // 请求二级项目
        getProjectType(departmentId) {
            this.$api.modules.filing
                .projectTypeInfoList({ departmentId })
                .then((res) => {
                    if (res) {
                        if (res.rows.length === 0) {
                            this.options.projectTypeId.values = '' // 二级项目
                            return
                        }
                        res.rows.forEach((item) => {
                            item.label = item.projectTypeName
                            item.value = item.projectTypeId
                        })
                        this.options.projectTypeId.options = res.rows // 二级项目
                    }
                })
        },
        // 请求三级项目
        categoryType(projectTypeId) {
            this.$api.dept.CategoryList({ projectTypeId }, 'get').then((res) => {
                if (res) {
                    res.rows.forEach((item) => {
                        item.label = item.categoryName
                        item.value = item.categoryId
                    })
                    this.options.categoryId.options = res.rows // 三级项目
                }
            })
        },
        // 导出
        exportExcel(){
            if(this.tableData.length==0){
                this.$message.warning('打印数据为空');
                return
            }
            let data = {};
            for(let  k in this.options){
                // 当前治疗次数
                if (
                    this.options[k].type === 'Tinput' &&
                    Array.isArray(this.options[k].values)
                ) {
                    data[k] = this.options[k].values[0]
                    data[ 'end' + k] = this.options[k].values[1]
                } else if (this.options[k].type === 'Tdatetime') {
                    // 治疗时间
                    if (
                        this.options[k].values[0] === null &&
                        this.options[k].values[1] !== null
                    ) {
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (
                        this.options[k].values[1] === null &&
                        this.options[k].values[0] === null
                    ) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                    if (
                        this.options[k].values[1] !== null &&
                        this.options[k].values[0] !== null
                    ) {
                        data['start' + k] = moment(
                            this.options[k].values[0]
                        ).format('YYYY-MM-DD HH:mm:ss')
                        data['end' + k] = moment(this.options[k].values[1]).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.options[k].values.length === 0) {
                        data['start' + k] = undefined
                        data['end' + k] = undefined
                    }
                } else {
                    if (this.options[k].values === '') {
                        data[k] = undefined
                    } else {
                        data[k] = this.options[k].values
                    }
                }
            }
            this.xflagList=data
            this.$api.treatmentMoney.queryTreatmentMoneyList({...data,deptId:this.deptId}).then(res =>{
                if(res.rows){
                    this.tableData = res.rows;
                    this.dataList=res.data
                    this.pagination.total = res.total
                    this.statisticalData = res.data
                }
            }).finally(()=>{
                export_table_to_excel('#out-table', '治疗单业绩生成')
            })
        },
        // 获取到仪器数据
        queryDeviceManageList() {
            this.$api.treatmentMoney.deviceManagementlist({
                deptId: this.deptId
            }).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        item.label = item.equipmentName
                        item.value = item.deviceId
                    })
                    this.options.deviceId.options = res.rows
                }
            })
        },
        currentChange(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getData()
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getData()
        },
    }
}
</script>
<style scoped>

.content-area{
    width: 100%;
    height: 100%;
}
.searchBar {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 30px;
    color: #999;
}

.information-List >span{
    display: inline-block;
    margin-right: 5px;
}

/*.buttonBox>.el-button{*/
/*  width: 60px;*/
/*  height: 30px;*/
/*}*/
::v-deep .el-input--prefix .el-input__inner {
    padding-left: 4px !important;
}
.color-block-success {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #c6f9c3;
    border-radius: 2px;
}

.color-block-ungenerated {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 2px;
}
</style>
<style>
.el-input__prefix {
    display: none;
}
.color-block-white {
    background: white !important;
}
.color-block-green {
    background-color: #c6f9c3 !important;
}
/*.el-table__body-wrapper {*/
/*    &::-webkit-scrollbar {*/
/*        height: 5px*/
/*    }*/
/*}*/
/*.el-table__fixed-body-wrapper .el-table__body {*/
/*    padding-bottom: 5px;*/
/*}*/
</style>
